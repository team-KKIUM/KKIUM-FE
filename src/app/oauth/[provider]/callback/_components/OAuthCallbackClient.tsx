'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { consumeOAuthState, requestSocialLogin } from '@/app/_utils/authFetch';

const TermsAgreementModal = dynamic(
  () => import('./TermsAgreementModal').then((mod) => mod.TermsAgreementModal),
  { ssr: false },
);

export type OAuthProvider = 'google' | 'kakao';

const requestedLoginRequests = new Set<string>();

export function OAuthCallbackClient({ provider }: { provider: OAuthProvider }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showTermsAgreement, setShowTermsAgreement] = useState(false);

  useEffect(() => {
    const code = searchParams.get('code');
    const error = searchParams.get('error');
    const incomingState = searchParams.get('state');
    const persistedState = consumeOAuthState(provider);
    const requestKey = code ? `${provider}:${code}` : provider;

    if (requestedLoginRequests.has(requestKey)) return;
    requestedLoginRequests.add(requestKey);

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
      .then((result) => {
        if (result.termsAgreed) {
          router.replace('/');
          return;
        }

        setShowTermsAgreement(true);
      })
      .catch((err: unknown) => {
        const message = err instanceof Error ? err.message : 'auth_failed';
        router.replace(`/login?error=${encodeURIComponent(message)}`);
      });
  }, [provider, router, searchParams]);

  return (
    <TermsAgreementModal
      open={showTermsAgreement}
      onDismiss={() => {
        setShowTermsAgreement(false);
        router.replace('/login');
      }}
      onComplete={() => {
        setShowTermsAgreement(false);
        router.replace('/');
      }}
    />
  );
}
