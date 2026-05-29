'use client';

import * as React from 'react';

import { UpArrowIcon } from '@/components/common/icons/UpArrowIcon';
import { cn } from '@/lib/utils';

export interface ExperienceUpdateCardProps extends Omit<React.ComponentProps<'aside'>, 'children'> {
  totalCount?: number;
  monthlyNewCount?: number;
  monthlyDiff?: number;
  onTotalNavigate?: () => void;
}

function formatCount(n: number): string {
  return Number.isFinite(n) ? String(Math.max(0, Math.floor(n))) : '0';
}

function StatPanel({
  title,
  count,
  unit = '개',
  diff,
  showNavigate,
  onNavigate,
}: {
  title: string;
  count: number;
  unit?: string;
  diff?: number;
  showNavigate?: boolean;
  onNavigate?: () => void;
}) {
  const signedDiff = typeof diff === 'number' && Number.isFinite(diff) ? Math.trunc(diff) : null;
  const diffText = signedDiff == null ? null : signedDiff > 0 ? `+${signedDiff}` : String(signedDiff);
  const diffToneClass = signedDiff == null || signedDiff >= 0 ? 'text-success' : 'text-red-500';

  return (
    <div className="flex h-40 w-full min-w-0 flex-col justify-between self-stretch overflow-hidden rounded-xl border border-border-bold bg-background-w px-4 py-5">
      <div className="flex w-full items-center justify-between gap-2">
        <div className="min-w-0 flex-1 text-xl font-bold leading-8 text-strong">{title}</div>
        {showNavigate ? (
          <button
            type="button"
            aria-label={`${title} 더보기`}
            className="flex size-8 shrink-0 items-center justify-center rounded-sm text-strong outline-none hover:bg-gray-100 focus-visible:shadow-focus-ring"
            onClick={onNavigate}
          >
            <UpArrowIcon className="size-6" />
          </button>
        ) : null}
      </div>

      <div className="flex items-end gap-0.5">
        <span className="text-6xl font-bold leading-[78px] text-strong">{formatCount(count)}</span>
        <div className="flex h-14 flex-col justify-center py-2">
          <span className="text-xl font-bold leading-7 text-strong">{unit}</span>
        </div>
      </div>

      {diffText ? (
        <div className="flex items-center gap-1">
          <div className={`text-sm font-bold leading-5 ${diffToneClass}`}>지난 달 대비</div>
          <div className={`text-sm font-bold leading-5 ${diffToneClass}`}>{diffText}</div>
        </div>
      ) : null}
    </div>
  );
}

export function ExperienceUpdateCard({
  totalCount = 0,
  monthlyNewCount = 0,
  monthlyDiff = 0,
  onTotalNavigate,
  className,
  ...props
}: ExperienceUpdateCardProps) {
  return (
    <aside
      data-slot="experience-update-card"
      className={cn('flex w-full min-w-0 flex-col items-stretch justify-center gap-4 self-stretch', className)}
      {...props}
    >
      <StatPanel
        title="나의 전체 경험"
        count={totalCount}
        showNavigate
        onNavigate={onTotalNavigate}
      />
      <StatPanel title="이번 달 새로운 경험" count={monthlyNewCount} diff={monthlyDiff} />
    </aside>
  );
}
