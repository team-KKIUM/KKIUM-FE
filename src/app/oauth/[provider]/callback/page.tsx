import { notFound } from 'next/navigation';
import { Suspense } from 'react';

import { OAuthCallbackClient } from '@/app/oauth/_components/OAuthCallbackClient';
import type { OAuthProvider } from '@/app/oauth/_components/OAuthCallbackClient';

const STATIC_OAUTH_PROVIDERS = ['google', 'kakao'] as const satisfies readonly OAuthProvider[];

/**
 * `output: 'export'`에서는 `[provider]`에 대해 빌드 타임에 생성할 경로가 필요합니다.
 * @see docs/next-static-export-dynamic-routes.md
 */
export async function generateStaticParams() {
  return STATIC_OAUTH_PROVIDERS.map((provider) => ({ provider }));
}

export default async function OAuthProviderCallbackPage({
  params,
}: {
  params: Promise<{ provider: string }>;
}) {
  const { provider } = await params;
  if (!STATIC_OAUTH_PROVIDERS.includes(provider as OAuthProvider)) {
    notFound();
  }
  return (
    <Suspense fallback={null}>
      <OAuthCallbackClient provider={provider as OAuthProvider} />
    </Suspense>
  );
}
