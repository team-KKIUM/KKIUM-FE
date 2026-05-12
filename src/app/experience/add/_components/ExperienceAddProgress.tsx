import { EXPERIENCE_ADD_STEPS } from '@/app/experience/add/_constants/experienceAddSteps';
import { CheckedExperienceIcon } from '@/components/common/icons/CheckedExperienceIcon';
import { ExperienceIcon } from '@/components/common/icons/ExperienceIcon';
import { cn } from '@/lib/utils';

export interface ExperienceAddProgressProps {
  currentStepIndex?: number;
  className?: string;
}

export function ExperienceAddProgress({
  currentStepIndex = 0,
  className,
}: ExperienceAddProgressProps) {
  const boundedStepIndex = Math.min(Math.max(currentStepIndex, 0), EXPERIENCE_ADD_STEPS.length);
  const progressRatio =
    Math.min(boundedStepIndex, EXPERIENCE_ADD_STEPS.length - 1) / (EXPERIENCE_ADD_STEPS.length - 1);

  return (
    <div className={cn('relative h-[66px] w-full', className)}>
      <div className="pointer-events-none absolute top-[19px] right-9 left-9 z-0 h-[3px] bg-gray-300">
        <div className="h-full bg-mint-main" style={{ width: `${progressRatio * 100}%` }} />
      </div>

      <ol
        aria-label="경험 추가 진행 단계"
        className="relative z-10 flex h-full w-full items-start justify-between"
      >
        {EXPERIENCE_ADD_STEPS.map((step, index) => {
          const state =
            boundedStepIndex === EXPERIENCE_ADD_STEPS.length
              ? 'completed'
              : index < boundedStepIndex
                ? 'completed'
                : index === boundedStepIndex
                  ? 'current'
                  : 'upcoming';

          return (
            <li
              key={step}
              className="relative z-10 flex w-[72px] shrink-0 flex-col items-center gap-2"
            >
              <span
                className={cn(
                  'flex size-10 items-center justify-center rounded-base p-1',
                  state === 'completed' && 'bg-mint-main',
                  state === 'current' && 'border border-brand bg-gray-300',
                  state === 'upcoming' && 'bg-gray-300',
                )}
              >
                {state === 'completed' ? (
                  <CheckedExperienceIcon />
                ) : (
                  <ExperienceIcon className="size-6 text-tertiary" />
                )}
              </span>
              <span
                className={cn(
                  'caption-bold whitespace-nowrap',
                  state === 'completed' ? 'text-strong' : 'text-tertiary',
                )}
              >
                {step}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
