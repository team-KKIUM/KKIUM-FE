'use client';

import { ChevronLeftIcon } from '@/components/common/icons/ChevronLeftIcon';
import { ChevronRightIcon } from '@/components/common/icons/ChevronRightIcon';
import type { HomeDashboardResponse } from '@/app/api/home/types';

import { ExperienceMatch } from './ExperienceMatch';
import { NullComponent } from './NullComponent';

type TargetJd = NonNullable<HomeDashboardResponse['targetJd']>;

export interface TargetPostingSectionProps {
  hasMatchData: boolean;
  currentPostingIndex: number;
  canGoPrev: boolean;
  canGoNext: boolean;
  onPrevPosting: () => void;
  onNextPosting: () => void;
  targetJd?: TargetJd | null;
  applyHref?: string;
}

function formatRecruitmentPeriod(startDate: string, endDate: string) {
  if (!startDate && !endDate) return '상시 채용';
  if (startDate && endDate) return `${startDate} ~ ${endDate}`;
  return startDate || endDate;
}

export function TargetPostingSection({
  hasMatchData,
  currentPostingIndex,
  canGoPrev,
  canGoNext,
  onPrevPosting,
  onNextPosting,
  targetJd,
  applyHref,
}: TargetPostingSectionProps) {
  return (
    <div className="flex w-full min-w-0 flex-col items-stretch gap-2">
      <div className="mx-auto inline-flex h-8 w-full max-w-[1048px] items-center justify-start gap-3">
        <button
          type="button"
          disabled={!canGoPrev}
          aria-label="이전 목표 공고"
          className="flex size-8 items-center justify-center rounded text-gray-500 outline-none hover:bg-gray-100 focus-visible:shadow-focus-ring disabled:cursor-not-allowed disabled:opacity-40"
          onClick={onPrevPosting}
        >
          <ChevronLeftIcon className="size-6" />
        </button>
        <div className="text-xl font-extrabold leading-8 text-black">{`목표 공고${currentPostingIndex + 1}`}</div>
        <button
          type="button"
          disabled={!canGoNext}
          aria-label="다음 목표 공고"
          className="flex size-8 items-center justify-center rounded text-gray-800 outline-none hover:bg-gray-100 focus-visible:shadow-focus-ring disabled:cursor-not-allowed disabled:opacity-40"
          onClick={onNextPosting}
        >
          <ChevronRightIcon className="size-6" />
        </button>
      </div>

      {hasMatchData && targetJd ? (
        <ExperienceMatch
          percent={targetJd.applicationFitScore}
          ctaHref={applyHref}
          companyName={targetJd.companyName}
          recruitmentField={targetJd.recruitmentField}
          recruitmentPeriod={formatRecruitmentPeriod(targetJd.startDate, targetJd.endDate)}
          requiredSkills={targetJd.hardSkills}
          requiredCompetencies={targetJd.softSkills}
        />
      ) : (
        <NullComponent className="mx-auto" />
      )}
    </div>
  );
}
