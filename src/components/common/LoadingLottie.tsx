'use client';

import { DotLottieReact } from '@lottiefiles/dotlottie-react';

import { cn } from '@/lib/utils';

interface LoadingLottieProps {
  className?: string;
}

export function LoadingLottie({ className }: LoadingLottieProps) {
  return (
    <DotLottieReact
      src="/lotties/loading.lottie"
      loop
      autoplay
      aria-hidden
      className={cn('size-[155px]', className)}
    />
  );
}
