import { Suspense } from 'react';
import { OAuthCallbackClient } from '@/app/oauth/_components/OAuthCallbackClient';

export default function GoogleOAuthCallbackPage() {
  return (
    <Suspense fallback={null}>
      <OAuthCallbackClient provider="google" />
    </Suspense>
  );
}
