# `output: 'export'`와 동적 라우트 (`[segment]`)

이 프로젝트의 `next.config`에 `output: 'export'`가 있으면, 빌드 결과가 **완전한 정적 HTML/자산**이어야 합니다. 그래서 **동적 세그먼트**(`[id]`, `[provider]` 등)가 있는 라우트는 빌드 시점에 **어떤 URL을 만들지**를 Next에 알려줘야 합니다.

## 필수: `generateStaticParams`

동적 세그먼트를 쓰는 `page.tsx`(필요 시 `layout.tsx`)에 **`generateStaticParams`**를 export 하세요.

- 반환 형태는 세그먼트 이름과 동일한 키를 가진 객체 배열입니다.  
  예: 폴더가 `oauth/[provider]/callback`이면 `{ provider: 'google' }`, `{ provider: 'kakao' }` 형태입니다.
- 이 레포(Next 16.2 + Turbopack)에서는 **`async function generateStaticParams()`** 로 두고, **실제로보낼 경로**를 배열로 반환하는 구성이 빌드와 맞습니다.
- **같은 URL을 두 개의 `page.tsx`가 담당하지 않도록** 하세요. 예: `oauth/google/callback/page.tsx`와 `oauth/[provider]/callback/page.tsx`가 동시에 `google`을 처리하면 충돌·중복이 납니다. OAuth는 **`[provider]` 한 곳** + `generateStaticParams`로 통일했습니다.

## 이 레포의 동적 라우트 점검표

| 경로 | `generateStaticParams` | 비고 |
|------|------------------------|------|
| `src/app/oauth/[provider]/callback/page.tsx` | `google`, `kakao` | 리다이렉트 URI와 `OAuthProvider` 타입과 일치 |
| `src/app/(pages)/experience/[experienceId]/page.tsx` | `1` … `20` (문자열) | 기존 구현 유지 |

새로 `[something]` 폴더를 추가하면 **위 표에 한 줄 추가**하고, 아래 체크리스트를 따르세요.

## 새 동적 라우트 추가 시 체크리스트

1. `page.tsx`(또는 해당 레이아웃)에 `generateStaticParams`를 추가한다.
2. 정적 export에서 **미리 만들 URL 목록**을 정한다. (OAuth 제공자, 공개 문서 ID 등)
3. **동일 경로를 만드는 정적·동적 `page.tsx`가 겹치지 않는지** 확인한다.
4. `npm run build`로 `output: 'export'` 빌드가 끝까지 통과하는지 확인한다.

## 예시 스니펫

단일 동적 세그먼트:

```ts
export async function generateStaticParams() {
  return [{ slug: 'a' }, { slug: 'b' }];
}
```

중첩 동적 세그먼트(예: `[locale]/[slug]`):

```ts
export async function generateStaticParams() {
  return [
    { locale: 'ko', slug: 'intro' },
    { locale: 'en', slug: 'intro' },
  ];
}
```

## 참고

- [Next.js: Static exports](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)
- [Next.js: `generateStaticParams`](https://nextjs.org/docs/app/api-reference/functions/generate-static-params)
