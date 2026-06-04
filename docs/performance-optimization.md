# Lighthouse 성능 최적화 기록

Lighthouse 감사 항목별로 **무엇을**, **어디에서** 수정했는지 추적합니다. 새 항목을 최적화할 때마다 이 문서에 섹션을 추가합니다.


# 홈 
---

## 1. Use efficient cache lifetimes

**증상:** `_next/static` JS/CSS/폰트, `public` SVG 등 Cache TTL `None`, 전송 ~6.7MB 재다운로드.

**대응:** S3 업로드 시 경로별 `Cache-Control` 설정.

### 수정한 파일

| 파일 | 변경 내용 |
|------|-----------|
| [`next.config.ts`](../next.config.ts) | 효과 없던 전역 `headers()` (`no-store`) 제거. export 빌드에서는 미적용됨을 주석으로 명시. |
| [`scripts/s3-sync-with-cache.sh`](../scripts/s3-sync-with-cache.sh) | `_next/static/**` → `max-age=31536000, immutable`. HTML·기타 자산 규칙 분리 sync. |
| [`buildspec.yml`](../buildspec.yml) | `post_build`에서 `S3_BUCKET` 있을 때 위 스크립트 실행. |
| [`docs/static-asset-cache.md`](./static-asset-cache.md) | 배포·CloudFront 요약 (상세는 이 문서 참고). |

### 운영 설정

- CodeBuild 환경 변수: `S3_BUCKET` (필수), `CLOUDFRONT_DISTRIBUTION_ID` (선택)
- 별도 `aws s3 sync`만 쓰는 단계가 있으면 동일 스크립트로 교체 필요

### 검증

- 배포 후 DevTools → Network → 정적 파일 Response Headers에 `cache-control: public, max-age=31536000, immutable` 확인

---

## 2. Document request latency

**증상:** 문서 HTML — 압축 없음(~10KB 절감 가능), 서버 응답 ~634ms(TTFB).

**대응:** HTML gzip 업로드 + CDN 엣지 캐시(`s-maxage`) + HTML만 CloudFront 무효화.

### 수정한 파일

| 파일 | 변경 내용 |
|------|-----------|
| [`scripts/s3-sync-with-cache.sh`](../scripts/s3-sync-with-cache.sh) | `upload_html`: `gzip -9` + `Content-Encoding: gzip`. `HTML_CACHE`에 `s-maxage=3600`, `stale-while-revalidate`. 무효화를 HTML 경로만으로 제한. |
| [`buildspec.yml`](../buildspec.yml) | (1번과 동일 `post_build` 단계) |
| [`docs/static-asset-cache.md`](./static-asset-cache.md) | Document latency·CloudFront 압축 권장 사항 |

### 검증

- `curl -H 'Accept-Encoding: gzip' -I https://www.kkium.com/` → `content-encoding: gzip`
- Lighthouse Document request latency → compression 통과
- 두 번째 방문 또는 엣지 히트 후 TTFB 개선 확인

---

## 3. Render-blocking requests

**증상:** `/_next/static/chunks/*.css` (~70KB, ~190ms)가 초기 렌더를 블로킹. 예: `07yk.tnyd8~cx.css`.

**대응:** 프로덕션 빌드 후 HTML의 Next CSS `<link rel="stylesheet">`를 **preload + onload** 비동기 로드로 변환.

### 수정한 파일

| 파일 | 변경 내용 |
|------|-----------|
| [`scripts/defer-render-blocking-css.mjs`](../scripts/defer-render-blocking-css.mjs) | `out/**/*.html`에서 `/_next/static/*.css` stylesheet 링크를 non-blocking 패턴으로 치환. `<noscript>` 폴백 유지. |
| [`package.json`](../package.json) | `"build": "next build && node scripts/defer-render-blocking-css.mjs out"` |
| [`buildspec.yml`](../buildspec.yml) | `pnpm build` 시 위 스크립트 자동 실행 (package.json 경유) |

### 변환 예시

**Before (빌드 직후):**

```html
<link rel="stylesheet" href="/_next/static/chunks/07yk.tnyd8~cx.css" data-precedence="next"/>
```

**After (`pnpm build` 완료 후):**

```html
<link rel="preload" href="/_next/static/chunks/07yk.tnyd8~cx.css" as="style" onload="this.onload=null;this.rel='stylesheet'" data-precedence="next"/>
<noscript><link rel="stylesheet" href="/_next/static/chunks/07yk.tnyd8~cx.css" data-precedence="next"/></noscript>
```

### 미적용 / 보류

- `experimental.inlineCss` — Next.js 16.2.3 번들에 해당 플래그 없음. 도입 시 Tailwind 소량 번들에 적합하나 HTML 캐시 분리 불가.
- `experimental.optimizeCss` (critters) — App Router·static export와 호환 제한.

### 검증

```bash
pnpm build
grep -o 'rel="preload"[^>]*as="style"' out/index.html
```

- Lighthouse **Render-blocking requests**에서 해당 CSS URL이 목록에서 사라지는지 확인
- FOUC(스타일 깜빡임) 없는지 홈·로그인·apply 화면 육안 확인

---

## 4. LCP breakdown

**증상:** LCP `img.object-cover.object-center`(홈 **나의 직무 유형** 카드) — Resource load delay ~14s. TTFB ~600ms, 실제 다운로드 ~1.3s.

**원인:** 홈이 `'use client'` 단독이라 LCP `<img>`가 API·하이드레이션 이후에만 DOM에 추가됨. `priority={false}`로 이미지 요청이 더 늦어짐.

**대응:**

1. 서버 `page.tsx`에서 `NullType` 플레이스홀더를 SSR → 초기 HTML에 LCP `<img>` 포함
2. API 로딩 중(`isPending`) 플레이스홀더 유지, 이후 `JobTypeCard` / `NullType` 전환
3. LCP 후보 SVG `preload` + `priority` / `fetchPriority="high"`

### 수정한 파일

| 파일 | 변경 내용 |
|------|-----------|
| [`src/app/page.tsx`](../src/app/page.tsx) | Server Component로 전환. SSR `NullType`을 Client의 **`children`** 으로 전달(정적 HTML에 LCP 포함). `HOME_LCP_IMAGE_PATHS` 상수. |
| [`src/app/_components/HomeDashboardClient.tsx`](../src/app/_components/HomeDashboardClient.tsx) | 기존 홈 로직 분리. `isPending` 시 `children`(SSR 플레이스홀더) 표시. |
| [`src/app/_components/JobTypeCard.tsx`](../src/app/_components/JobTypeCard.tsx) | `priority`, `fetchPriority="high"`, `object-center`, `sizes` 조정. |
| [`src/app/_components/NullType.tsx`](../src/app/_components/NullType.tsx) | `priority`, `fetchPriority="high"`. |
| [`scripts/inject-performance-hints.mjs`](../scripts/inject-performance-hints.mjs) | `out/index.html`에 LCP SVG `preload` 주입. |
| [`package.json`](../package.json) | `build` 체인에 hints 스크립트 추가. |

### 관련 후속 (§7)

- LCP 배경은 [`job-type-background-opt.jpg`](../public/job-type-background-opt.jpg)로 대체함 (원본 SVG ~557KB → JPG ~24KB).

### 검증

```bash
pnpm build
grep -E 'empty-type|job-type-background' out/index.html | head -5
```

- 초기 HTML에 `<img ... empty-type.svg` 존재
- Lighthouse LCP breakdown → Resource load delay 감소

---

## 5. Network dependency tree

**증상:** Critical path `www.kkium.com` (666ms) → `...chunks/*.css` (누적 ~1.8s). CSS가 문서 직후 병목.

**대응:** (3번) CSS non-blocking + `fetchpriority="high"` preload. (4번) viewport 직후 LCP·CSS 힌트로 병렬 다운로드 유도.

### 수정한 파일

| 파일 | 변경 내용 |
|------|-----------|
| [`scripts/defer-render-blocking-css.mjs`](../scripts/defer-render-blocking-css.mjs) | CSS `rel=preload`에 `fetchpriority="high"` 추가. |
| [`scripts/inject-performance-hints.mjs`](../scripts/inject-performance-hints.mjs) | 홈 `index.html` viewport 다음 LCP `preload` 삽입. |
| (3·4번 파일) | Render-blocking·LCP 항목과 동일 체인 완화. |

### 검증

- DevTools Performance → 초기 navigation 직후 CSS·LCP 이미지 요청이 거의 동시에 시작되는지 확인
- Lighthouse Network dependency tree → critical path 길이·latency 감소

---

## 6. Reduce unused JavaScript

**증상:** 홈·지원서 등 초기 번들에 echarts·탭 UI 등 **당장 쓰지 않는** 코드가 포함됨.

**대응:** `next/dynamic`으로 지연 로드. barrel import 트리셰이킹은 `next.config`의 `optimizePackageImports`로 별도 관리(이 레포 성능 작업에서는 MD만 기록).

### 수정한 파일

| 파일 | 변경 내용 |
|------|-----------|
| [`src/app/_components/HomeDashboardClient.tsx`](../src/app/_components/HomeDashboardClient.tsx) | `BubbleChart`(echarts), `TargetPostingSection` dynamic import. 차트는 `ssr: false`. |
| [`src/app/(pages)/apply/page.tsx`](../src/app/(pages)/apply/page.tsx) | `ApplyAnalysis`, `ApplyMyExperience`, `ApplyCoverLetterSection` 탭별 dynamic import. |
| [`src/app/(pages)/login/page.tsx`](../src/app/(pages)/login/page.tsx) | `LoginVisual`(dotlottie) `ssr: false` dynamic. |

### 검증

- `pnpm build` 후 `.next` / `out` 청크 — 홈 초기 JS에 echarts 분리 여부
- Lighthouse **Reduce unused JavaScript** 점수·경고 감소

---

## 7. Properly size images (LCP 자산)

**증상:** `job-type-background.svg` ~557KB(내장 JPEG). LCP 다운로드·Resource load duration 과다.

**대응:** SVG 내 JPEG 추출 → 표시 크기(400px)·품질 55% JPEG `job-type-background-opt.jpg` (~24KB). `JobTypeCard`는 최적화 JPG 사용.

### 수정한 파일

| 파일 | 변경 내용 |
|------|-----------|
| [`scripts/optimize-public-images.mjs`](../scripts/optimize-public-images.mjs) | SVGO + JPEG 추출. macOS는 `sips` 리사이즈, Linux(CodeBuild)는 추출본 복사 폴백(빌드 중단 없음). |
| [`package.json`](../package.json) | `optimize:images`, `build` 앞단에서 스크립트 실행. |
| [`public/job-type-background-opt.jpg`](../public/job-type-background-opt.jpg) | 최적화 래스터 (빌드 스크립트로 재생성 가능). |
| [`src/app/_components/JobTypeCard.tsx`](../src/app/_components/JobTypeCard.tsx) | 배경 경로 `.svg` → `-opt.jpg`. |
| [`src/app/page.tsx`](../src/app/page.tsx), [`scripts/inject-performance-hints.mjs`](../scripts/inject-performance-hints.mjs) | LCP preload 경로 갱신. |

### 참고

- 원본 [`public/job-type-background.svg`](../public/job-type-background.svg)는 디자인 원본으로 유지. **런타임에서는 JPG만 참조.**
- `empty-type.svg`는 SVGO만 적용 (~98KB). 추가 축소 시 디자인 export 검토.
- **CodeBuild(Linux):** `sips` 없음 → 추출 JPEG를 `-opt.jpg`로 복사(용량 큼). macOS 로컬/`sips` 성공 시 ~24KB. 스크립트 실패 시에도 레포의 `-opt.jpg`로 빌드는 계속됨.

### 검증

```bash
pnpm optimize:images
ls -lh public/job-type-background-opt.jpg
```

---

## 8. 3rd party — Kakao JavaScript SDK

**증상:** `kauth.kakaocdn.net` `kakao.min.js`가 **모든 페이지** root layout에서 로드됨. 로그인은 REST OAuth 리다이렉트만 사용해 SDK 불필요.

**대응:** root에서 제거. 카카오 **공유**가 필요한 UI에서만 `loadKakaoSdk()`로 클릭 시 로드.

### 수정한 파일

| 파일 | 변경 내용 |
|------|-----------|
| [`src/app/layout.tsx`](../src/app/layout.tsx) | `<KakaoSdkScript />` 제거. |
| [`src/lib/loadKakaoSdk.ts`](../src/lib/loadKakaoSdk.ts) | SDK 동적 `<script>` 삽입·`Kakao.init`. |
| [`src/app/_components/MobileLandingResult.tsx`](../src/app/_components/MobileLandingResult.tsx) | 공유 버튼 클릭 시 `await loadKakaoSdk()`. |
| [`src/components/common/KakaoSdkScript.tsx`](../src/components/common/KakaoSdkScript.tsx) | 미사용(레거시). 필요 시 레이아웃에만 다시 추가 가능. |

### 검증

- 홈·경험·지원서 URL Network 탭 — `kakao.min.js` **미요청**
- (모바일 랜딩 공유 UI 사용 시) 공유 클릭 후에만 SDK 로드