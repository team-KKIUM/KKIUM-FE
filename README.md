# KKIUM Frontend (KKIUM-FE)
<img width="3840" height="2160" alt="image" src="https://github.com/user-attachments/assets/c682c083-1b07-41c8-b2f4-2435bf95ca46" />
KKIUM 은 흩어진 경험을 한곳으로 모아 AI와 함께 공고와의 매칭률, 자기소개서 작성을 도와주는 서비스입니다. 

- **서비스:** [https://www.kkium.com](https://www.kkium.com)
- **저장소:** [team-KKIUM/KKIUM-FE](https://github.com/team-KKIUM/KKIUM-FE)
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/f834174a-e8da-43de-af4f-8321b6898981" />
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/de5230b7-b776-472c-a51c-c0cdf984c059" />
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/2ca840d9-54ba-407d-8c48-f9f8d616886d" />
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/be139364-45be-4ef7-b860-db9fc7af5736" />
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/744b9672-e8d6-4567-86ec-3769b03dfffb" />
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/cec913a3-312b-4790-864d-38db3097ec43" />
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/df966bd3-89ac-4c4c-ad29-17bdadf500fe" />
<img width="3840" height="2160" alt="image" src="https://github.com/user-attachments/assets/c6d43700-257b-4316-a12c-0db3276c67c3" />
<img width="3840" height="2160" alt="image" src="https://github.com/user-attachments/assets/ae8ad543-e901-4989-b1dc-3373dec99411" />
<img width="3840" height="2160" alt="image" src="https://github.com/user-attachments/assets/566c65eb-1640-4156-baaa-1d99c0d52611" />
<img width="3840" height="2160" alt="image" src="https://github.com/user-attachments/assets/74cf2ac1-f64d-4591-9640-baec3f77eb8f" />
<img width="3840" height="2160" alt="image" src="https://github.com/user-attachments/assets/9d1a4d44-438a-41c3-99eb-cd04ca797511" />
<img width="3840" height="2160" alt="image" src="https://github.com/user-attachments/assets/ba0bb4c9-8119-49c9-a46b-e166dc3a6215" />
<img width="3840" height="2160" alt="image" src="https://github.com/user-attachments/assets/a970037b-79df-40e4-bf47-1ff7f3b3f578" />
<img width="3840" height="2160" alt="image" src="https://github.com/user-attachments/assets/c8bea3f2-ef36-4972-a18f-c13a1dc4aa13" />
<img width="3840" height="2160" alt="image" src="https://github.com/user-attachments/assets/8324756e-ba5f-4347-b9de-42011d96eae4" />

---

## 프로젝트 구성

### 기술 스택

| 구분 | 기술 |
|------|------|
| 프레임워크 | [Next.js](https://nextjs.org) 16 (App Router) |
| UI | React 19, Tailwind CSS 4, [shadcn/ui](https://ui.shadcn.com) |
| 상태·데이터 | TanStack Query, Zustand |
| 검증 | Zod |
| 차트 | ECharts |
| 테스트 | Jest (Unit), Playwright (E2E), Storybook |
| 패키지 매니저 | pnpm |
| 배포 | 정적 export → AWS CodePipeline / CodeBuild |

### 디렉터리 구조

```text
KKIUM-FE/
├── public/                 # 정적 에셋 (SVG, Lottie 등)
├── src/
│   ├── app/                # App Router 페이지·API 클라이언트
│   │   ├── (pages)/        # 화면 라우트 (apply, experience, login …)
│   │   ├── api/            # 백엔드 API 호출·타입·Zod 스키마
│   │   ├── oauth/          # OAuth 콜백
│   │   ├── _components/    # 홈 등 앱 전역 컴포넌트
│   │   └── layout.tsx      # 루트 레이아웃
│   ├── components/         # 공통 UI (common, ui)
│   ├── hooks/              # React Query 훅
│   ├── lib/                # 유틸·분석·SDK 로더
│   ├── stories/            # Storybook 스토리
│   └── assets/             # 폰트 등
├── e2e/                    # Playwright E2E
├── docs/                   # 프로젝트 문서
├── buildspec.yml           # AWS CodeBuild
└── .github/workflows/      # CI (E2E, Chromatic, deploy …)
```

### 주요 화면

| 경로 | 설명 |
|------|------|
| `/` | 홈 대시보드 (경험·직무 유형·타겟 공고) |
| `/experience` | 경험 보드 |
| `/experience/add` | 경험 추가 |
| `/apply/list` | 지원 관리 목록 |
| `/apply` | 지원 상세 (분석·자소서) |
| `/login` | OAuth 로그인 |

---


### 환경 변수 (`.env`)

| 변수 | 필수 | 설명 |
|------|:----:|------|
| `NEXT_PUBLIC_API_BASE_URL` | ✅ | 백엔드 API 베이스 URL |
| `NEXT_PUBLIC_SITE_URL` | | 사이트 URL (기본: `https://www.kkium.com`) |
| `NEXT_PUBLIC_KAKAO_REST_API_KEY` | | 카카오 OAuth REST API 키 |
| `NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY` | | 카카오 JS SDK 키 |
| `NEXT_PUBLIC_KAKAO_REDIRECT_URI` | | 카카오 리다이렉트 URI |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | | Google OAuth 클라이언트 ID |
| `NEXT_PUBLIC_GOOGLE_REDIRECT_URI` | | Google 리다이렉트 URI |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | | Google Analytics 측정 ID |

> API 키·시크릿은 저장소에 커밋하지 마세요. 팀 내부 비밀 관리 도구에서 값을 받습니다.

---

## 프로젝트 프로그램 사용법

### 개발 서버

```bash
pnpm dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 을 엽니다.

### 빌드·프리뷰

정적 사이트로 `out/` 디렉터리에 출력됩니다 (`next.config.ts`: `output: 'export'`).

```bash
pnpm test:unit    # 배포 파이프라인과 동일하게 테스트 후
pnpm build

# 로컬에서 정적 결과 확인 (선택)
npx serve out
```

### 자주 쓰는 스크립트

| 명령 | 설명 |
|------|------|
| `pnpm dev` | 개발 서버 |
| `pnpm build` | 프로덕션 정적 빌드 |
| `pnpm start` | `next start` (export 모드에서는 보통 미사용) |
| `pnpm lint` | ESLint |
| `pnpm format` | Prettier 포맷 |
| `pnpm format:check` | 포맷 검사 |
| `pnpm test:unit` | Jest 유닛 테스트 |
| `pnpm test:unit:watch` | Jest watch |
| `pnpm test:e2e` | Playwright E2E |
| `pnpm test:e2e:ui` | Playwright UI 모드 |
| `pnpm storybook` | Storybook (포트 6006) |

### 배포 

`main` 브랜치 push 시 GitHub Actions가 AWS CodePipeline(`kkium-pipeline`)을 트리거합니다.  
CodeBuild는 `buildspec.yml` 기준으로 **`pnpm test:unit` → `pnpm build`** 후 `out/` 아티팩트를 배포합니다.

---

## 저작권 및 사용권 정보

- 본 저장소는 **team-KKIUM** 소유입니다.
- 별도 `LICENSE` 파일이 없는 경우, 외부 공개·2차 배포·상업적 재사용은 **팀 승인 없이 금지**됩니다.
- 사용 폰트·이미지·Lottie 등 서드파티 에셋은 각 라이선스를 따릅니다.
- Next.js, React 등 오픈소스 의존성은 해당 패키지의 라이선스를 따릅니다.

---

## 버그 및 디버그

### 버그 제보

1. GitHub **Issues**에 재현 단계·기대/실제 결과·스크린샷을 남깁니다.
2. 가능하면 브라우저·OS·`NEXT_PUBLIC_API_BASE_URL` 환경을 함께 적어 주세요.
3. 로그인/지원/경험 등 **어느 경로**에서 발생했는지 명시합니다.


## 팀 내 문서

### 프로젝트 내부

- [AGENTS.md](AGENTS.md) — 에이전트/개발 규칙 (Next.js 버전 주의)
- [docs/test-structure.md](docs/test-structure.md) — 테스트 구조
- [docs/aws-jest-integration.md](docs/aws-jest-integration.md) — AWS 빌드 연동

---

### Contributors

<table>
  <tr>
    <td align="center"><b>성태경</b></td>
    <td align="center"><b>박수민</b></td>
  </tr>
  <tr>
    <td align="center">
      <a href="https://github.com/sungtaegyeong">
        <img src="https://github.com/sungtaegyeong.png" width="100" height="100" alt="성태경" style="border-radius:50%;" />
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/psm1st">
        <img src="https://github.com/psm1st.png" width="100" height="100" alt="박수민" style="border-radius:50%;" />
      </a>
    </td>
  </tr>
  <tr>
    <td align="center">
      <a href="https://github.com/sungtaegyeong">@sungtaegyeong</a>
    </td>
    <td align="center">
      <a href="https://github.com/psm1st">@psm1st</a>
    </td>
  </tr>
</table>
