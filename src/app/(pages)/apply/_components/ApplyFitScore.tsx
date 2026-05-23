import { cn } from '@/lib/utils';

export interface ApplyFitScoreProps {
  value: number;
  label?: string;
  className?: string;
}

export function ApplyFitScore({ value, label = '지원 적합도', className }: ApplyFitScoreProps) {
  const clampedValue = Math.min(100, Math.max(0, value));

  return (
    <div className={cn('flex w-full items-center gap-3', className)}>
      <div className="inline-flex shrink-0 flex-col items-start justify-end">
        <span className="text-3xl font-bold leading-[47.36px] text-strong">{clampedValue}%</span>
        <span className="w-20 body-1-regular text-gray-600">{label}</span>
      </div>

      <div
        role="progressbar"
        aria-valuenow={clampedValue}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
        className="relative h-2.5 min-w-0 flex-1 overflow-hidden rounded-full bg-gray-300"
      >
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-mint-300"
          style={{ width: `${clampedValue}%` }}
        />
      </div>
    </div>
  );
}
