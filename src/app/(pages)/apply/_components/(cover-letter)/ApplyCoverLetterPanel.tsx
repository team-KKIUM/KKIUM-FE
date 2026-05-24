'use client';

import { PlusIcon } from '@/components/common/icons/PlusIcon';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import { ApplyCoverLetterExperienceEmptyState } from './ApplyCoverLetterExperienceEmptyState';

export interface ApplyCoverLetterPanelProps {
  className?: string;
  onSelectExperienceClick?: () => void;
}

export function ApplyCoverLetterPanel({
  className,
  onSelectExperienceClick,
}: ApplyCoverLetterPanelProps) {
  return (
    <section
      data-slot="cover-letter-panel"
      className={cn('flex min-h-full w-full min-w-0 flex-col gap-3 overflow-hidden', className)}
    >
      <h2 className="line-clamp-1 text-2xl font-extrabold leading-9 text-strong">
        경험 선택 및 자기소개서 작성
      </h2>

      <Button
        type="button"
        variant="line"
        className="w-full"
        rightIcon={<PlusIcon className="text-tertiary" />}
        onClick={onSelectExperienceClick}
      >
        경험 선택하기
      </Button>

      <div className="flex flex-1 flex-col items-center pt-8">
        <ApplyCoverLetterExperienceEmptyState />
      </div>
    </section>
  );
}
