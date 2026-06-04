'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { consumeOAuthState, requestSocialLoginOnce } from '@/app/_utils/authFetch';
import { TermsAgreementModal } from '@/app/oauth/_components/TermsAgreementModal';
import { trackEvent } from '@/lib/analytics';

export type OAuthProvider = 'google' | 'kakao';

/**
 * `output: 'export'` + `useSearchParams` leaves a CSR bailout placeholder and breaks hydration (#418).
 * Read OAuth query params from `window.location` instead (same approach as LoginErrorBanner).
 */
function readOAuthCallbackSearchParams() {
  if (typeof window === 'undefined') {
    return { code: null, error: null, state: null };
  }

  const search = new URLSearchParams(window.location.search);
  return {
    code: search.get('code'),
    error: search.get('error'),
    state: search.get('state'),
  };
}

export function OAuthCallbackClient({ provider }: { provider: OAuthProvider }) {
  const router = useRouter();
  const [showTermsAgreement, setShowTermsAgreement] = useState(false);
  /** Ensures OAuth callback logic (incl. consumeOAuthState) runs once per mount; avoids Strict Mode / dependency re-runs wiping state. */
  const requestedRef = useRef(false);

  useEffect(() => {
    if (requestedRef.current) {
      return;
    }
    requestedRef.current = true;

    const { code, error, state: incomingState } = readOAuthCallbackSearchParams();
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
  }, [provider, router]);

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
