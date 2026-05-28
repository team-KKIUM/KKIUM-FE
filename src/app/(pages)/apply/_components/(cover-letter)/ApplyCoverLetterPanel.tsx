'use client';

import * as React from 'react';

import type { ResumeWritingGuideResponse } from '@/app/api/apply/types';
import type { ExperienceItem } from '@/app/(pages)/experience/_components/ExperienceCardGrid';
import { PlusIcon } from '@/components/common/icons/PlusIcon';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import { ApplyCoverLetterExperienceEmptyState } from './ApplyCoverLetterExperienceEmptyState';
import { ApplyCoverLetterSelectedExperienceCard } from './SelectedExperienceCard';
import { ApplyCoverLetterWritingGuideCard } from './ApplyCoverLetterWritingGuideCard';
import { SelectedExperienceDetailPanel } from './SelectedExperienceDetailPanel';

export interface ApplyCoverLetterPanelProps {
  className?: string;
  onSelectExperienceClick?: () => void;
  selectedExperiences?: ExperienceItem[];
  onSelectedExperienceRemove?: (experienceId: string) => void;
  writingGuide?: ResumeWritingGuideResponse | null;
  isWritingGuideLoading?: boolean;
  isWritingGuideError?: boolean;
}

export function ApplyCoverLetterPanel({
  className,
  onSelectExperienceClick,
  selectedExperiences = [],
  onSelectedExperienceRemove,
  writingGuide,
  isWritingGuideLoading = false,
  isWritingGuideError = false,
}: ApplyCoverLetterPanelProps) {
  const hasSelectedExperiences = selectedExperiences.length > 0;
  const [detailExperienceId, setDetailExperienceId] = React.useState<string | null>(null);
  const detailExperience = selectedExperiences.find(
    (experience) => experience.id === detailExperienceId,
  );

  React.useEffect(() => {
    if (!detailExperienceId || detailExperience) {
      return;
    }

    setDetailExperienceId(null);
  }, [detailExperience, detailExperienceId]);

  if (detailExperience) {
    return (
      <SelectedExperienceDetailPanel
        experience={detailExperience}
        className={className}
        onClose={() => setDetailExperienceId(null)}
      />
    );
  }

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

      <div
        className={cn(
          'flex min-h-0 flex-1 flex-col',
          hasSelectedExperiences ? 'gap-3 overflow-y-auto pr-1 pt-2' : 'items-center pt-8',
        )}
      >
        {hasSelectedExperiences ? (
          <>
            <ApplyCoverLetterWritingGuideCard
              guide={writingGuide}
              isLoading={isWritingGuideLoading}
              isError={isWritingGuideError}
            />
            {selectedExperiences.map((experience) => (
              <ApplyCoverLetterSelectedExperienceCard
                key={experience.id}
                experience={experience}
                onSelect={() => setDetailExperienceId(experience.id)}
                onRemove={() => onSelectedExperienceRemove?.(experience.id)}
              />
            ))}
          </>
        ) : (
          <ApplyCoverLetterExperienceEmptyState />
        )}
      </div>
    </section>
  );
}
