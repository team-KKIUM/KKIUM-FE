'use client';

import { useSearchParams } from 'next/navigation';

function decodeLoginError(raw: string | null): string | null {
  if (!raw) return null;
  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
}

export function LoginErrorBanner() {
  const searchParams = useSearchParams();
  const message = decodeLoginError(searchParams.get('error'));

  if (!message) return null;

  return (
    <p className="body-3-regular w-full text-center text-red-700" role="alert">
      {message}
    </p>
  );
}
