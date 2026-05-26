'use client';

import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import type { ComponentProps } from 'react';

import { cn } from '@/lib/utils';

interface LottieAnimationProps
  extends Omit<ComponentProps<typeof DotLottieReact>, 'autoplay' | 'loop' | 'src'> {
  src: string;
  autoplay?: boolean;
  loop?: boolean;
  ariaLabel?: string;
}

export function LottieAnimation({
  src,
  autoplay = true,
  loop = true,
  ariaLabel,
  className,
  ...props
}: LottieAnimationProps) {
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
