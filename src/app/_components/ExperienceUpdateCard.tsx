'use client';

import * as React from 'react';

import { ExternalLinkIcon } from '@/components/common/icons/ExternalLinkIcon';
import { ChevronRightIcon } from '@/components/common/icons/ChevronRightIcon';
import { cn } from '@/lib/utils';

export interface ExperienceUpdateCardProps extends Omit<React.ComponentProps<'aside'>, 'children'> {
  totalCount?: number;
  monthlyNewCount?: number;
  onTotalNavigate?: () => void;
}

function formatCount(n: number): string {
  return Number.isFinite(n) ? String(Math.max(0, Math.floor(n))) : '0';
}

function StatPanel({
  title,
  count,
  unit = '개',
  showNavigate,
  onNavigate,
  navigateIcon = 'chevron',
}: {
  title: string;
  count: number;
  unit?: string;
  showNavigate?: boolean;
  onNavigate?: () => void;
  navigateIcon?: 'chevron' | 'externalLink';
}) {
  return (
    <div className="flex h-40 flex-col justify-between self-stretch overflow-hidden rounded-xl border border-border-bold bg-background-w px-4 py-5">
      <div className="inline-flex w-full items-center justify-between gap-2">
        <div className="min-w-0 flex-1 text-xl font-bold leading-8 text-strong">{title}</div>
        {showNavigate ? (
          <button
            type="button"
            aria-label={`${title} 더보기`}
            className="flex size-8 shrink-0 items-center justify-center rounded-sm text-strong outline-none hover:bg-gray-100 focus-visible:shadow-focus-ring"
            onClick={onNavigate}
          >
            {navigateIcon === 'externalLink' ? (
              <ExternalLinkIcon className="size-6" aria-hidden />
            ) : (
              <ChevronRightIcon className="size-6" aria-hidden />
            )}
          </button>
        ) : null}
      </div>

      <div className="inline-flex items-end gap-0.5">
        <span className="text-6xl font-bold leading-[78px] text-strong">{formatCount(count)}</span>
        <div className="flex h-14 flex-col justify-center py-2">
          <span className="text-xl font-bold leading-7 text-strong">{unit}</span>
        </div>
      </div>
    </div>
  );
}

export function ExperienceUpdateCard({
  totalCount = 0,
  monthlyNewCount = 0,
  onTotalNavigate,
  className,
  ...props
}: ExperienceUpdateCardProps) {
  return (
    <aside
      data-slot="experience-update-card"
      className={cn('inline-flex min-w-0 flex-col items-start justify-center gap-4 self-stretch', className)}
      {...props}
    >
      <StatPanel
        title="나의 전체 경험"
        count={totalCount}
        showNavigate
        onNavigate={onTotalNavigate}
        navigateIcon="externalLink"
      />
      <StatPanel title="이번 달 새로운 경험" count={monthlyNewCount} />
    </aside>
  );
}
