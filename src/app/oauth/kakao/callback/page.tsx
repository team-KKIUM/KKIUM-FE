import { Suspense } from 'react';
import { OAuthCallbackClient } from '@/app/oauth/_components/OAuthCallbackClient';

export default function KakaoOAuthCallbackPage() {
  return (
    <Suspense fallback={null}>
      <OAuthCallbackClient provider="kakao" />
    </Suspense>
  );
}
