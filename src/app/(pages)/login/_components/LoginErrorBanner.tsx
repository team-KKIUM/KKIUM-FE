'use client';

import { useSyncExternalStore } from 'react';

function decodeLoginError(raw: string | null): string | null {
  if (!raw) return null;
  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
}

function readLoginErrorFromLocation() {
  if (typeof window === 'undefined') return null;
  return decodeLoginError(new URLSearchParams(window.location.search).get('error'));
}

const emptySubscribe = () => () => {};

/**
 * `output: 'export'` + `useSearchParams`는 정적 HTML에 CSR bailout placeholder를 남겨 #418을 유발합니다.
 * hydration 첫 패스에서는 서버와 같이 null만 반환하고, 이후 URL의 `?error=`를 반영합니다.
 */
export function LoginErrorBanner() {
  const message = useSyncExternalStore(emptySubscribe, readLoginErrorFromLocation, () => null);

  if (!message) return null;

  return (
    <p className="body-3-regular w-full text-center text-red-700" role="alert">
      {message}
    </p>
  );
}
