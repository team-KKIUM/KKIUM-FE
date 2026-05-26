import Image from 'next/image';

import type { ExperienceItem } from '@/app/(pages)/experience/_components/ExperienceCardGrid';
import { getExperienceCategoryIconSrc } from '@/app/(pages)/experience/_utils/ExperienceCategory';
import { XIcon } from '@/components/common/icons/XIcon';
import { cn } from '@/lib/utils';

export interface ApplyCoverLetterSelectedExperienceCardProps {
  experience: ExperienceItem;
  className?: string;
  onSelect?: () => void;
  onRemove?: () => void;
}

export function ApplyCoverLetterSelectedExperienceCard({
  experience,
  className,
  onSelect,
  onRemove,
}: ApplyCoverLetterSelectedExperienceCardProps) {
  const interactive = Boolean(onSelect);

  return (
    <div
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      data-slot="cover-letter-selected-experience-card"
      className={cn(
        'flex w-full items-center justify-between gap-3 bg-background-w p-3 outline-none',
        interactive && 'cursor-pointer focus-visible:shadow-focus-ring',
        className,
      )}
      onClick={onSelect}
      onKeyDown={(event) => {
        if (!interactive || (event.key !== 'Enter' && event.key !== ' ')) {
          return;
        }

        event.preventDefault();
        onSelect?.();
      }}
    >
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center">
          <Image
            src={getExperienceCategoryIconSrc(experience.type)}
            alt=""
            aria-hidden
            width={40}
            height={40}
            className="size-10"
          />
        </span>

        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <p className="line-clamp-1 body-1-bold text-strong">{experience.title}</p>
          <p className="inline-flex min-w-0 items-center gap-1.5 text-xs leading-4 text-gray-700">
            <span className="shrink-0">기간</span>
            <span className="truncate">{experience.period || '2026.04.01~04.28'}</span>
          </p>
        </div>
      </div>

      <button
        type="button"
        aria-label={`${experience.title} 선택 해제`}
        onClick={(event) => {
          event.stopPropagation();
          onRemove?.();
        }}
        className="flex size-8 shrink-0 items-center justify-center rounded-full bg-background-w text-primary outline-none transition-colors hover:bg-gray-100 focus-visible:shadow-focus-ring"
      >
        <XIcon className="size-6" />
      </button>
    </div>
  );
}
