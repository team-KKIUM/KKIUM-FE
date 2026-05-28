'use client';

import Image from 'next/image';
import { createOAuthState, resolveOAuthRedirectUri } from '@/app/_utils/authFetch';
import type { LoginButtonProps } from '../_types/login';

const GOOGLE_AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
const GOOGLE_SCOPE = 'email profile';
const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
function buildGoogleAuthorizeUrl() {
  if (!googleClientId) return null;
  const state = createOAuthState('google');
  let redirectUri: string;
  try {
    redirectUri = resolveOAuthRedirectUri('google');
  } catch {
    return null;
  }

  const params = new URLSearchParams({
    client_id: googleClientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: GOOGLE_SCOPE,
  });
  if (state) params.set('state', state);

  return `${GOOGLE_AUTH_URL}?${params.toString()}`;
}

export function GoogleLoginButton({ onClick }: Omit<LoginButtonProps, 'type'> = {}) {
  const handleGoogleLogin = () => {
    onClick?.();
    const googleAuthorizeUrl = buildGoogleAuthorizeUrl();
    if (!googleAuthorizeUrl) return;
    window.location.href = googleAuthorizeUrl;
  };

  return (
    <button
      type="button"
      onClick={handleGoogleLogin}
      className="w-full rounded-md border border-neutral-500 bg-white px-3 py-2 text-left transition hover:bg-[#f8f9fa] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1a73e8] disabled:cursor-not-allowed disabled:opacity-50"
      aria-label="구글로 로그인"
    >
      <span className="flex items-center justify-center gap-2.5">
        <Image
          src="/oauth/google-logo.svg"
          alt=""
          width={20}
          height={20}
          className="size-5"
          aria-hidden="true"
        />
        <span className="text-sm leading-5 font-medium text-stone-900">Google 계정으로 로그인</span>
      </span>
    </button>
  );
}
