'use client';

import Image from 'next/image';
import { createOAuthState, resolveOAuthRedirectUri } from '@/app/_utils/authFetch';
import type { LoginButtonProps } from '../_types/login';

const KAKAO_AUTH_URL = 'https://kauth.kakao.com/oauth/authorize';
const kakaoClientId = process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY;
function buildKakaoAuthorizeUrl() {
  if (!kakaoClientId) return null;
  const state = createOAuthState('kakao');
  let redirectUri: string;
  try {
    redirectUri = resolveOAuthRedirectUri('kakao');
  } catch {
    return null;
  }

  const params = new URLSearchParams({
    client_id: kakaoClientId,
    redirect_uri: redirectUri,
    response_type: 'code',
  });
  if (state) params.set('state', state);

  return `${KAKAO_AUTH_URL}?${params.toString()}`;
}

export function KakaoLoginButton({ onClick }: Omit<LoginButtonProps, 'type'> = {}) {
  const handleKakaoLogin = () => {
    onClick?.();
    const kakaoAuthorizeUrl = buildKakaoAuthorizeUrl();
    if (!kakaoAuthorizeUrl) return;
    window.location.href = kakaoAuthorizeUrl;
  };

  return (
    <button
      type="button"
      onClick={handleKakaoLogin}
      className="flex h-10 w-full items-center justify-center rounded-md bg-[#FEE500] px-3 text-black/90 transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-50"
      aria-label="카카오로 로그인"
    >
      <span className="inline-flex items-center gap-2">
        <Image
          src="/oauth/kakao-logo.svg"
          alt=""
          width={16}
          height={16}
          className="size-4"
          aria-hidden="true"
        />
        <span className="body-3-bold">카카오 로그인</span>
      </span>
    </button>
  );
}
