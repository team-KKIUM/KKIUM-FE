'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

import { EmptyState } from '@/components/common/EmptyState';
import { PlusIcon } from '@/components/common/icons/PlusIcon';
import { LoadingLottie } from '@/components/common/LoadingLottie';
import { useApplyJobAnalysis } from '@/hooks/apply/useApplyJobAnalysis';
import { cn } from '@/lib/utils';

import { isJdAnalysisFailed } from '@/app/api/apply/jdAnalysisStatus';
import { useApplyHighlightKeywordStore } from '@/app/(pages)/apply/_stores/useApplyHighlightKeywordStore';
import { mapJdAnalysisExperienceToApplyMatch } from '../../_utils/mapJdAnalysisExperienceToApplyMatch';
import { ApplySectionHeader } from './ApplySectionHeader';
import { ExperienceMatchCard } from './ExperienceMatchCard';

function ApplyAddExperienceLink({ className }: { className?: string }) {
  return (
    <Link
      href="/experience/add"
      className={cn(
        'inline-flex h-10 w-[376px] max-w-full shrink-0 items-center justify-center gap-1 overflow-hidden rounded-lg bg-background-w px-3 py-1',
        'outline -outline-offset-1 outline-border-default body-1-bold text-tertiary',
        'hover:bg-gray-100 focus-visible:shadow-focus-ring',
        className,
      )}
    >
      <PlusIcon className="size-6 shrink-0" aria-hidden />
      경험 추가하기
    </Link>
  );
}

export interface ApplyMyExperienceProps {
  jdId: string | null;
}

export function ApplyMyExperience({ jdId }: ApplyMyExperienceProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const clearHighlightKeywords = useApplyHighlightKeywordStore((state) => state.clearKeywords);
  const {
    data,
    error,
    isError,
    analysisStatus,
    isAnalysisLoading,
  } = useApplyJobAnalysis(jdId);

  const matchedExperiences = data?.matchResult?.experiences ?? [];

  useEffect(() => {
    if (expandedId == null) {
      clearHighlightKeywords();
    }
  }, [clearHighlightKeywords, expandedId]);

  return (
    <aside className="flex h-full w-full min-w-0 flex-col gap-5">
      <ApplySectionHeader title="내 경험" infoVariant="my-experience" />

      {!jdId ? (
        <EmptyState
          className="min-h-96 flex-1 py-16"
          illustrationLabel="공고 미선택"
          title="분석할 공고를 선택해주세요"
          description="지원 관리 목록에서 자기소개서 작성하기를 눌러주세요."
        />
      ) : isError ? (
        <EmptyState
          className="min-h-96 flex-1 py-16"
          illustrationLabel="내 경험 조회 실패"
          title="경험 매칭을 불러오지 못했어요"
          description={
            error instanceof Error ? error.message : '잠시 후 다시 시도해주세요.'
          }
        />
      ) : isAnalysisLoading ? (
        data && analysisStatus && isJdAnalysisFailed(analysisStatus) ? (
          <EmptyState
            className="min-h-96 flex-1 py-16"
            illustrationLabel="경험 매칭 실패"
            title="경험 매칭에 실패했어요"
            description="잠시 후 다시 시도해주세요."
          />
        ) : (
          <div
            className="flex min-h-96 flex-1 flex-col items-center justify-center gap-3"
            aria-live="polite"
            aria-label="경험 매칭 중"
          >
            <LoadingLottie />
            <p className="body-1-bold text-strong">경험 적합도를 분석하는 중...</p>
          </div>
        )
      ) : matchedExperiences.length === 0 ? (
        <div className="flex min-h-96 flex-1 flex-col items-center justify-center gap-4 py-16">
          <EmptyState
            className="h-auto min-h-0 w-full flex-none py-0"
            illustrationLabel="등록된 경험이 없습니다"
            title="아직 생성된 경험이 없어요"
            description="경험을 추가해 파일에 끼워넣어볼까요?"
          />
          <ApplyAddExperienceLink />
        </div>
      ) : (
        <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto pr-1">
          {matchedExperiences.map((experience) => {
            const item = mapJdAnalysisExperienceToApplyMatch(experience);
            const expanded = expandedId === item.id;

            return (
              <ExperienceMatchCard
                key={item.id}
                jdId={jdId}
                experienceId={Number(item.id)}
                type={item.type}
                title={item.title}
                description={item.description}
                skillTags={item.skillTags}
                competencyTags={item.competencyTags}
                matchScore={item.matchScore}
                analysis={item.analysis}
                expanded={expanded}
                onToggle={() => setExpandedId(expanded ? null : item.id)}
              />
            );
          })}
        </div>
      )}
    </aside>
  );
}
