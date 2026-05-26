'use client';

import Image from 'next/image';

import type { ExperienceCategory } from '@/app/(pages)/experience/_components/ExperienceCategoryTab';
import { getExperienceCategoryIconSrc } from '@/app/(pages)/experience/_utils/ExperienceCategory';
import { CheckButton } from '@/components/common/CheckButton';
import { cn } from '@/lib/utils';

export interface ExperienceSelectProps {
  type: Exclude<ExperienceCategory, 'all'>;
  title: string;
  description: string;
  fitScore: number;
  selected: boolean;
  disabled?: boolean;
  onSelectedChange: (selected: boolean) => void;
  className?: string;
}

function clampScore(value: number) {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.min(100, Math.max(0, Math.round(value)));
}

export function ExperienceSelect({
  type,
  title,
  description,
  fitScore,
  selected,
  disabled = false,
  onSelectedChange,
  className,
}: ExperienceSelectProps) {
  const score = clampScore(fitScore);

  const handleToggle = () => {
    if (disabled) {
      return;
    }

    onSelectedChange(!selected);
  };

  return (
    <div
      data-slot="experience-select"
      data-selected={selected}
      className={cn(
        'inline-flex w-full items-center justify-between gap-3 rounded-xl bg-background-w p-3',
        selected ? 'border-2 border-brand' : 'border border-border-default',
        disabled && 'opacity-60',
        className,
      )}
    >
      <button
        type="button"
        disabled={disabled}
        aria-pressed={selected}
        onClick={handleToggle}
        className={cn(
          'flex min-w-0 flex-1 items-center gap-3 text-left outline-none',
          'rounded-lg focus-visible:shadow-focus-ring',
          disabled ? 'cursor-not-allowed' : 'cursor-pointer',
        )}
      >
        <Image
          src={getExperienceCategoryIconSrc(type)}
          alt=""
          aria-hidden
          width={40}
          height={40}
          className="size-10 shrink-0"
        />

        <span className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className="line-clamp-1 body-1-bold text-strong">{title}</span>
          <span className="line-clamp-1 text-xs leading-4 text-gray-700">{description}</span>

          <span className="mt-0.5 flex h-12 w-full flex-col gap-1">
            <span className="inline-flex items-center gap-2">
              <span className="body-3-bold text-tertiary">문항 적합도</span>
              <span className="text-xl font-bold leading-8 text-mint-400">{score}%</span>
            </span>

            <span
              role="progressbar"
              aria-valuenow={score}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="문항 적합도"
              className="relative h-2.5 w-full overflow-hidden rounded-full bg-gray-300"
            >
              <span
                className="absolute inset-y-0 left-0 block rounded-full bg-brand"
                style={{ width: `${score}%` }}
              />
            </span>
          </span>
        </span>
      </button>

      <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-background-w">
        <CheckButton
          checked={selected}
          disabled={disabled}
          aria-label={`${title} ${selected ? '선택 해제' : '선택'}`}
          onCheckedChange={onSelectedChange}
        />
      </span>
    </div>
  );
}
