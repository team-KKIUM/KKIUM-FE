const KAKAO_SDK_URL = 'https://t1.kakaocdn.net/kakao_js_sdk/2.8.1/kakao.min.js';
const KAKAO_SDK_INTEGRITY =
  'sha384-OL+ylM/iuPLtW5U3XcvLSGhE8JzReKDank5InqlHGWPhb4140/yrBw0bg0y7+C9J';

let loadPromise: Promise<void> | null = null;

export function loadKakaoSdk(): Promise<void> {
  if (typeof window === 'undefined') {
    return Promise.resolve();
  }

  const key = process.env.NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY?.trim();
  if (!key) {
    return Promise.resolve();
  }

  if (window.Kakao?.isInitialized()) {
    return Promise.resolve();
  }

  if (!loadPromise) {
    loadPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.id = 'kakao-javascript-sdk';
      script.src = KAKAO_SDK_URL;
      script.async = true;
      script.crossOrigin = 'anonymous';
      script.integrity = KAKAO_SDK_INTEGRITY;
      script.onload = () => {
        if (window.Kakao && !window.Kakao.isInitialized()) {
          window.Kakao.init(key);
        }
        resolve();
      };
      script.onerror = () => {
        loadPromise = null;
        reject(new Error('Failed to load Kakao JavaScript SDK'));
      };
      document.head.appendChild(script);
    });
  }

  return loadPromise;
}
