'use client';

import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import type { DotLottieReactProps } from '@lottiefiles/dotlottie-react';
import { useSyncExternalStore } from 'react';

import { cn } from '@/lib/utils';

interface LottieAnimationProps
  extends Omit<DotLottieReactProps, 'autoplay' | 'loop' | 'src'> {
  src: string;
  autoplay?: boolean;
  loop?: boolean;
  ariaLabel?: string;
}

const emptySubscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

/** SSR/정적 HTML과 첫 hydration이 같도록 서버·클라이언트 초기 스냅샷을 분리합니다. */
function useIsClient() {
  return useSyncExternalStore(emptySubscribe, getClientSnapshot, getServerSnapshot);
}

/**
 * DotLottie는 WASM/Canvas 기반이라 서버·정적 프리렌더에서 실행할 수 없습니다.
 * `useSyncExternalStore`로 마운트 전까지 placeholder만 그려 #418(하이드레이션 불일치)을 막습니다.
 */
export function LottieAnimation({
  src,
  autoplay = true,
  loop = true,
  ariaLabel,
  className,
  ...props
}: LottieAnimationProps) {
  const isClient = useIsClient();

  if (!isClient) {
    return (
      <div
        className={cn('block', className)}
        aria-hidden={ariaLabel ? undefined : true}
        role={ariaLabel ? 'img' : undefined}
        aria-label={ariaLabel}
        suppressHydrationWarning
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
      suppressHydrationWarning
      {...props}
    />
  );
}
