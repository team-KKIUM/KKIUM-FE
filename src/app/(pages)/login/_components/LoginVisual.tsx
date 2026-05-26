import { LottieAnimation } from '@/components/common/LottieAnimation';

export function LoginVisual() {
  return (
    <div className="hidden h-screen min-h-[720px] flex-1 overflow-hidden bg-[#FAFAFA] lg:block">
      <LottieAnimation
        src="/lotties/login.lottie"
        ariaLabel="끼움 서비스 소개 애니메이션"
        className="h-full w-full object-cover"
      />
    </div>
  );
}
