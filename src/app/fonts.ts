import localFont from 'next/font/local';

export const nanumSquare = localFont({
  src: [
    {
      path: '../assets/fonts/NanumSquareL.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../assets/fonts/NanumSquareR.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../assets/fonts/NanumSquareB.woff2',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../assets/fonts/NanumSquareEB.woff2',
      weight: '800',
      style: 'normal',
    },
  ],
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'Apple SD Gothic Neo', 'Malgun Gothic', 'sans-serif'],
  adjustFontFallback: 'Arial',
});
