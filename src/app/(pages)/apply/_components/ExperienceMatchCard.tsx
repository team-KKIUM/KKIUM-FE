'use client';

import Image from 'next/image';
import * as React from 'react';

import type { ExperienceCategory } from '@/app/(pages)/experience/_components/ExperienceCategoryTab';
import { Tag } from '@/components/common/Tag';
import { cn } from '@/lib/utils';

import type { ExperienceAnalysisData } from '../_constants/applyMyExperienceMockData';
import { ExperienceAnalysisPanel } from './ExperienceAnalysisPanel';

const iconMap: Record<Exclude<ExperienceCategory, 'all'>, string> = {
  activity: '/activity-selected.svg',
  career: '/career-selected.svg',
  education: '/education-selected.svg',
  etc: '/etc-selected.svg',
};

export interface ExperienceMatchCardProps extends Omit<React.ComponentProps<'article'>, 'title'> {
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

  const handleToggle = () => {
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
              src={iconMap[type]}
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

      {expanded && (
        <ExperienceAnalysisPanel id={panelId} analysis={analysis} role="region" aria-labelledby={headingId} />
      )}
    </article>
  );
}
