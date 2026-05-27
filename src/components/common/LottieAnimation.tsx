'use client';

import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import type { DotLottieReactProps } from '@lottiefiles/dotlottie-react';
import * as React from 'react';

import { cn } from '@/lib/utils';

interface LottieAnimationProps
  extends Omit<DotLottieReactProps, 'autoplay' | 'loop' | 'src'> {
  src: string;
  autoplay?: boolean;
  loop?: boolean;
  ariaLabel?: string;
}

/**
 * DotLottie는 WASM/Canvas 기반이라 정적 프리렌더(SSR)에서 훅/런타임 오류가 날 수 있습니다.
 * 클라이언트 마운트 이후에만 실제 플레이어를 렌더합니다.
 */
export function LottieAnimation({
  src,
  autoplay = true,
  loop = true,
  ariaLabel,
  className,
  ...props
}: LottieAnimationProps) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        className={cn('block', className)}
        aria-hidden={ariaLabel ? undefined : true}
        role={ariaLabel ? 'img' : undefined}
        aria-label={ariaLabel}
      />
    );
  }

  return (
    <DotLottieReact
      src={src}
      autoplay={autoplay}
      loop={loop}
      role={ariaLabel ? 'img' : undefined}
      aria-label={ariaLabel}
      aria-hidden={ariaLabel ? undefined : true}
      className={cn('block', className)}
      {...props}
    />
  );
}
