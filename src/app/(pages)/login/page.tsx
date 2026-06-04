'use client';

import dynamic from 'next/dynamic';
import Image from 'next/image';

import { GoogleLoginButton } from './_components/GoogleLoginButton';
import { KakaoLoginButton } from './_components/KakaoLoginButton';
import { LoginErrorBanner } from './_components/LoginErrorBanner';

const LoginVisual = dynamic(
  () => import('./_components/LoginVisual').then((mod) => ({ default: mod.LoginVisual })),
  { ssr: false },
);

export default function LoginPage() {
  return (
    <div className="flex min-h-screen w-full items-stretch bg-white">
      <div className="flex w-full items-center justify-center bg-white p-6 lg:w-[668px] lg:min-w-[668px]">
        <section className="inline-flex w-full flex-col items-center gap-12 overflow-hidden rounded-xl bg-white px-8 py-12 sm:px-16 sm:py-20 lg:w-[668px]">
          <div className="flex flex-col items-center gap-5">
            <Image
              src="/logo-big.svg"
              alt="KKIUM 로고"
              width={258}
              height={49}
              priority
              className="h-[49px] w-[258px]"
            />
            <p className="body-1-bold text-center text-primary">
              경험을 기록하고 분석하여
              <br />
              나만의 스토리를 완성하세요
            </p>
          </div>

          <div className="flex w-full max-w-72 flex-col items-start gap-3">
            <LoginErrorBanner />
            <KakaoLoginButton />
            <GoogleLoginButton />
          </div>
        </section>
      </div>
      <LoginVisual />
    </div>
  );
}
