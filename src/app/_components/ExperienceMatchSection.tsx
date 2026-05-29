'use client';

import { ChevronLeftIcon } from '@/components/common/icons/ChevronLeftIcon';
import { ChevronRightIcon } from '@/components/common/icons/ChevronRightIcon';
import type { HomeTargetJd } from '@/app/api/home/types';
import { HOME_DASHBOARD_CONTENT_CLASS } from '@/app/_constants/homeLayoutConstants';
import { formatRecruitmentPeriod } from '@/app/_utils/formatRecruitmentPeriod';

import { cn } from '@/lib/utils';

import { ExperienceMatch } from './ExperienceMatch';
import { NullComponent } from './NullComponent';

export interface TargetPostingSectionProps {
  hasMatchData: boolean;
  currentPostingIndex: number;
  canGoPrev: boolean;
  canGoNext: boolean;
  onPrevPosting: () => void;
  onNextPosting: () => void;
  targetJd?: HomeTargetJd | null;
  applyHref?: string;
  onEmptyCtaClick?: () => void;
}

const TARGET_POSTING_NAV_BUTTON_CLASS =
  'flex size-8 items-center justify-center rounded text-gray-800 outline-none hover:bg-gray-100 focus-visible:shadow-focus-ring disabled:cursor-not-allowed disabled:opacity-40';

export function TargetPostingSection({
  hasMatchData,
  currentPostingIndex,
  canGoPrev,
  canGoNext,
  onPrevPosting,
  onNextPosting,
  targetJd,
  applyHref,
  onEmptyCtaClick,
}: TargetPostingSectionProps) {
  return (
    <div className="flex w-full min-w-0 flex-col items-stretch gap-2">
      <div className={cn('flex h-8 items-center justify-start gap-3', HOME_DASHBOARD_CONTENT_CLASS)}>
        <button
          type="button"
          disabled={!canGoPrev}
          aria-label="이전 목표 공고"
          className={TARGET_POSTING_NAV_BUTTON_CLASS}
          onClick={onPrevPosting}
        >
          <ChevronLeftIcon className="size-6" />
        </button>
        <div className="text-xl font-extrabold leading-8 text-black">{`목표 공고${currentPostingIndex + 1}`}</div>
        <button
          type="button"
          disabled={!canGoNext}
          aria-label="다음 목표 공고"
          className={TARGET_POSTING_NAV_BUTTON_CLASS}
          onClick={onNextPosting}
        >
          <ChevronRightIcon className="size-6" />
        </button>
      </div>

      {hasMatchData && targetJd ? (
        <ExperienceMatch
          className="w-full"
          percent={targetJd.applicationFitScore}
          ctaHref={applyHref}
          companyName={targetJd.companyName}
          recruitmentField={targetJd.recruitmentField}
          recruitmentPeriod={formatRecruitmentPeriod(targetJd.startDate, targetJd.endDate)}
          requiredSkills={targetJd.hardSkills}
          requiredCompetencies={targetJd.softSkills}
        />
      ) : (
        <NullComponent className={HOME_DASHBOARD_CONTENT_CLASS} onCtaClick={onEmptyCtaClick} />
      )}
    </div>
  );
}
