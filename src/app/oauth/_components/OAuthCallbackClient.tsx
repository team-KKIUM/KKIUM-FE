'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { consumeOAuthState, requestSocialLoginOnce } from '@/app/_utils/authFetch';
import { TermsAgreementModal } from '@/app/oauth/_components/TermsAgreementModal';
import { trackEvent } from '@/lib/analytics';

export type OAuthProvider = 'google' | 'kakao';

export function OAuthCallbackClient({ provider }: { provider: OAuthProvider }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showTermsAgreement, setShowTermsAgreement] = useState(false);
  /** Ensures OAuth callback logic (incl. consumeOAuthState) runs once per mount; avoids Strict Mode / dependency re-runs wiping state. */
  const requestedRef = useRef(false);

  useEffect(() => {
    if (requestedRef.current) {
      return;
    }
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

    void requestSocialLoginOnce(provider, code)
      .then((result) => {
        if (result.termsAgreed === true) {
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
        trackEvent('sign_up', {
          method: provider,
        });
        setShowTermsAgreement(false);
        router.replace('/');
      }}
    />
  );
}
