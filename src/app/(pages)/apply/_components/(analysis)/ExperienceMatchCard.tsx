'use client';

import Image from 'next/image';
import * as React from 'react';

import type { ExperienceCategory } from '@/app/(pages)/experience/_components/ExperienceCategoryTab';
import { useApplyHighlightKeywordStore } from '@/app/(pages)/apply/_stores/useApplyHighlightKeywordStore';
import { getExperienceCategoryIconSrc } from '@/app/(pages)/experience/_utils/ExperienceCategory';
import { useApplyExperienceAnalysis } from '@/hooks/apply/useApplyJobAnalysis';
import { Tag } from '@/components/common/Tag';
import { cn } from '@/lib/utils';

import type { ExperienceAnalysisData } from '../../_constants/applyMockData';
import { mapJdExperienceAnalysisToView } from '../../_utils/mapJdExperienceAnalysisToView';
import { ExperienceAnalysisPanel } from './ExperienceAnalysisPanel';

export interface ExperienceMatchCardProps extends Omit<React.ComponentProps<'article'>, 'title'> {
  jdId: string | null;
  experienceId: number;
  type: Exclude<ExperienceCategory, 'all'>;
  title: string;
  description: string;
  skillTags: readonly string[];
  competencyTags: readonly string[];
  matchScore: number;
  analysis: ExperienceAnalysisData;
  expanded?: boolean;
  onToggle?: () => void;
}

function clampScore(value: number) {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.min(100, Math.max(0, Math.round(value)));
}

function CardBodyContent({
  skillTags,
  competencyTags,
  score,
}: {
  skillTags: readonly string[];
  competencyTags: readonly string[];
  score: number;
}) {
  return (
    <>
      <section className="flex w-full flex-col gap-2">
        {skillTags.length > 0 && (
          <ul className="flex flex-wrap content-center gap-1">
            {skillTags.map((tag, index) => (
              <li key={`${tag}-${index}`}>
                <Tag tone="skill" className="rounded">
                  {tag}
                </Tag>
              </li>
            ))}
          </ul>
        )}

        {competencyTags.length > 0 && (
          <ul className="flex flex-wrap content-start gap-1">
            {competencyTags.map((tag, index) => (
              <li key={`${tag}-${index}`}>
                <Tag tone="competency" className="rounded">
                  {tag}
                </Tag>
              </li>
            ))}
          </ul>
        )}
      </section>

      <footer className="flex w-full flex-col gap-1">
        <div className="inline-flex items-center gap-2">
          <span className="body-3-bold text-tertiary">현재 공고에 활용 적합도</span>
          <span className="text-xl font-bold leading-8 text-mint-400">{score}%</span>
        </div>

        <div
          role="progressbar"
          aria-valuenow={score}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="현재 공고에 활용 적합도"
          className="relative h-2.5 w-full overflow-hidden rounded-full bg-gray-300"
        >
          <span
            className="absolute inset-y-0 left-0 block rounded-full bg-mint-300"
            style={{ width: `${score}%` }}
          />
        </div>
      </footer>
    </>
  );
}

export function ExperienceMatchCard({
  jdId,
  experienceId,
  type,
  title,
  description,
  skillTags,
  competencyTags,
  matchScore,
  analysis,
  expanded = false,
  onToggle,
  className,
  ...props
}: ExperienceMatchCardProps) {
  const score = clampScore(matchScore);
  const isInteractive = Boolean(onToggle);
  const headingId = React.useId();
  const panelId = React.useId();
  const experienceAnalysisQuery = useApplyExperienceAnalysis(jdId, experienceId, expanded);
  const setHighlightKeywords = useApplyHighlightKeywordStore((state) => state.setKeywords);
  const clearHighlightKeywords = useApplyHighlightKeywordStore((state) => state.clearKeywords);
  const activeHighlightExperienceId = useApplyHighlightKeywordStore((state) => state.experienceId);

  React.useEffect(() => {
    if (!expanded || !experienceAnalysisQuery.data) {
      return;
    }

    console.log('[ExperienceMatchCard] apply highlight keywords', {
      jdId,
      experienceId,
      keywordCount: experienceAnalysisQuery.data.analysis.highlightKeywords.length,
      highlightKeywords: experienceAnalysisQuery.data.analysis.highlightKeywords,
    });

    setHighlightKeywords(
      experienceId,
      experienceAnalysisQuery.data.analysis.highlightKeywords.map((item) => ({
        keyword: item.keyword,
        sources: item.sources,
      })),
    );
  }, [expanded, experienceAnalysisQuery.data, experienceId, jdId, setHighlightKeywords]);

  const handleToggle = () => {
    if (expanded && activeHighlightExperienceId === experienceId) {
      console.log('[ExperienceMatchCard] clear highlight keywords by collapse', {
        jdId,
        experienceId,
      });
      clearHighlightKeywords();
    }
    onToggle?.();
  };

  return (
    <article
      data-slot="experience-match-card"
      data-state={expanded ? 'expanded' : 'default'}
      className={cn(
        'flex w-full flex-col overflow-hidden rounded-xl border border-border-default bg-background-w',
        className,
      )}
      {...props}
    >
      <div className="relative flex w-full flex-col gap-2.5 px-4 py-5">
        {isInteractive && (
          <button
            type="button"
            className="absolute inset-0 z-0 cursor-pointer rounded-xl focus-visible:shadow-focus-ring focus-visible:outline-none"
            aria-expanded={expanded}
            aria-controls={panelId}
            aria-labelledby={headingId}
            onClick={handleToggle}
          >
            <span className="sr-only">
              {title} 경험 분석 {expanded ? '접기' : '펼치기'}
            </span>
          </button>
        )}

        <div
          className={cn(
            'relative z-10 flex w-full flex-col gap-2.5',
            isInteractive && 'pointer-events-none',
          )}
        >
          <header className="flex w-full items-center gap-1">
            <Image
              src={getExperienceCategoryIconSrc(type)}
              alt=""
              aria-hidden
              width={64}
              height={64}
              className="size-16 shrink-0"
            />

            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              <h3 id={headingId} className="line-clamp-1 title-1-bold text-strong">
                {title}
              </h3>
              <p className="line-clamp-1 body-3-regular text-tertiary">{description}</p>
            </div>
          </header>

          <CardBodyContent skillTags={skillTags} competencyTags={competencyTags} score={score} />
        </div>
      </div>

      {expanded ? (
        experienceAnalysisQuery.isPending ? (
          <section
            id={panelId}
            role="region"
            aria-labelledby={headingId}
            className="flex w-full items-center justify-center rounded-b-xl border-t border-border-default bg-background-w px-4 py-6"
          >
            <p className="body-3-regular text-gray-700">경험 분석을 불러오는 중...</p>
          </section>
        ) : experienceAnalysisQuery.isError ? (
          <section
            id={panelId}
            role="region"
            aria-labelledby={headingId}
            className="flex w-full items-center justify-center rounded-b-xl border-t border-border-default bg-background-w px-4 py-6"
          >
            <p className="body-3-regular text-red-700">경험 분석을 불러오지 못했어요.</p>
          </section>
        ) : (
          <ExperienceAnalysisPanel
            id={panelId}
            analysis={
              experienceAnalysisQuery.data
                ? mapJdExperienceAnalysisToView(experienceAnalysisQuery.data)
                : analysis
            }
            role="region"
            aria-labelledby={headingId}
          />
        )
      ) : null}
    </article>
  );
}
