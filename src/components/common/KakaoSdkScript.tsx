'use client';

import Script from 'next/script';

const KAKAO_JAVASCRIPT_KEY = process.env.NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY?.trim();
const KAKAO_SDK_URL = 'https://t1.kakaocdn.net/kakao_js_sdk/2.8.1/kakao.min.js';
const KAKAO_SDK_INTEGRITY =
  'sha384-OL+ylM/iuPLtW5U3XcvLSGhE8JzReKDank5InqlHGWPhb4140/yrBw0bg0y7+C9J';

export function KakaoSdkScript() {
  if (!KAKAO_JAVASCRIPT_KEY) {
    return null;
  }

  return (
    <Script
      id="kakao-javascript-sdk"
      src={KAKAO_SDK_URL}
      strategy="afterInteractive"
      integrity={KAKAO_SDK_INTEGRITY}
      crossOrigin="anonymous"
      onReady={() => {
        const kakao = window.Kakao;

        if (!kakao || kakao.isInitialized()) {
          return;
        }

        kakao.init(KAKAO_JAVASCRIPT_KEY);
      }}
    />
  );
}
