'use client';

import { useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { consumeOAuthState, requestSocialLogin } from '@/app/_utils/authFetch';

export type OAuthProvider = 'google' | 'kakao';

export function OAuthCallbackClient({ provider }: { provider: OAuthProvider }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestedRef = useRef(false);

  useEffect(() => {
    if (requestedRef.current) return;
    requestedRef.current = true;

    const code = searchParams.get('code');
    const error = searchParams.get('error');
    const incomingState = searchParams.get('state');
    const persistedState = consumeOAuthState(provider);

    if (!incomingState || !persistedState || incomingState !== persistedState) {
      router.replace('/login?error=invalid_state');
      return;
    }

    if (error) {
      router.replace(`/login?error=${encodeURIComponent(error)}`);
      return;
    }

    if (!code) {
      router.replace('/login?error=missing_code');
      return;
    }

    void requestSocialLogin(provider, code)
      .then(() => {
        router.replace('/');
      })
      .catch((err: unknown) => {
        const message = err instanceof Error ? err.message : 'auth_failed';
        router.replace(`/login?error=${encodeURIComponent(message)}`);
      });
  }, [provider, router, searchParams]);

  return null;
}
