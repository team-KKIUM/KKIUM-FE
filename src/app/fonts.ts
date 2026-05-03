import localFont from 'next/font/local';

export const nanumSquare = localFont({
  src: [
    {
      path: '../assets/fonts/NanumSquareL.ttf',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../assets/fonts/NanumSquareR.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../assets/fonts/NanumSquareB.ttf',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../assets/fonts/NanumSquareEB.ttf',
      weight: '800',
      style: 'normal',
    },
  ],
  display: 'swap',
});
