import { LoadingLottie } from '@/components/common/LoadingLottie';
import { cn } from '@/lib/utils';

interface LoadingStateProps extends React.ComponentProps<'section'> {
  message: string;
  ariaLabel?: string;
  lottieClassName?: string;
}

export function LoadingState({
  message,
  ariaLabel = message,
  lottieClassName,
  className,
  ...props
}: LoadingStateProps) {
  return (
    <section
      aria-live="polite"
      aria-label={ariaLabel}
      className={cn(
        'flex h-[690px] w-full items-center justify-center overflow-hidden rounded-xl border border-border-default bg-background-w',
        className,
      )}
      {...props}
    >
      <div className="flex w-[211px] flex-col items-center gap-3">
        <div className="flex h-[155px] w-[199px] items-center justify-center">
          <LoadingLottie className={lottieClassName} />
        </div>
        <p className="body-1-bold text-strong">{message}</p>
      </div>
    </section>
  );
}
