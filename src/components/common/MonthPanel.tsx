'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';

const WEEK_LABELS = ['일', '월', '화', '수', '목', '금', '토'] as const;

function startOfLocalDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function sameLocalDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function dayTime(d: Date): number {
  return startOfLocalDay(d).getTime();
}

function compareLocalDay(a: Date, b: Date): number {
  return dayTime(a) - dayTime(b);
}

function buildMonthWeeks(year: number, month: number): Date[][] {
  const pad = new Date(year, month, 1).getDay();
  const start = new Date(year, month, 1 - pad);
  const weeks: Date[][] = [];
  const cur = new Date(start);
  for (let w = 0; w < 6; w++) {
    const row: Date[] = [];
    for (let i = 0; i < 7; i++) {
      row.push(new Date(cur));
      cur.setDate(cur.getDate() + 1);
    }
    weeks.push(row);
  }
  while (weeks.length > 0) {
    const last = weeks[weeks.length - 1]!;
    const touchesMonth = last.some((d) => d.getMonth() === month && d.getFullYear() === year);
    if (!touchesMonth) weeks.pop();
    else break;
  }
  return weeks;
}

type DayVariant = 'default' | 'disabled' | 'range-start' | 'range-mid' | 'range-end' | 'range-single';

function getDayVariant(
  cell: Date,
  viewYear: number,
  viewMonth: number,
  rangeStart: Date | null,
  rangeEnd: Date | null,
): DayVariant {
  const inMonth = cell.getMonth() === viewMonth && cell.getFullYear() === viewYear;
  if (!inMonth) return 'disabled';

  if (!rangeStart) return 'default';

  if (!rangeEnd) {
    return sameLocalDay(cell, rangeStart) ? 'range-single' : 'default';
  }

  const s = startOfLocalDay(rangeStart);
  const e = startOfLocalDay(rangeEnd);
  const lo = compareLocalDay(s, e) <= 0 ? s : e;
  const hi = compareLocalDay(s, e) <= 0 ? e : s;

  const c = startOfLocalDay(cell);
  if (compareLocalDay(c, lo) < 0 || compareLocalDay(c, hi) > 0) return 'default';
  if (sameLocalDay(c, lo) && sameLocalDay(c, hi)) return 'range-single';
  if (sameLocalDay(c, lo)) return 'range-start';
  if (sameLocalDay(c, hi)) return 'range-end';
  return 'range-mid';
}

function dayCellClass(variant: DayVariant): string {
  switch (variant) {
    case 'disabled':
      return 'text-quaternary';
    case 'range-single':
      return 'bg-mint-500 text-on-fill rounded-xl';
    case 'range-start':
      return 'bg-mint-500 text-on-fill rounded-tl-xl rounded-bl-xl';
    case 'range-end':
      return 'bg-mint-500 text-on-fill rounded-tr-xl rounded-br-xl';
    case 'range-mid':
      return 'bg-mint-50 text-success';
    default:
      return 'text-strong';
  }
}

export type MonthPanelProps = {
  year: number;
  month: number;
  selectionStart: Date | null;
  selectionEnd: Date | null;
  onDayClick: (d: Date) => void;
};

export function MonthPanel({ year, month, selectionStart, selectionEnd, onDayClick }: MonthPanelProps) {
  const weeks = React.useMemo(() => buildMonthWeeks(year, month), [year, month]);

  return (
    <div className="flex flex-col gap-px">
      <div className="flex h-10 w-[336px] items-center">
        {WEEK_LABELS.map((label) => (
          <div
            key={label}
            className="flex size-12 shrink-0 flex-col items-center justify-center rounded-full p-2.5"
          >
            <span className="text-center text-base font-bold leading-6 text-strong">{label}</span>
          </div>
        ))}
      </div>

      {weeks.map((row, ri) => (
        <div key={ri} className="flex w-[336px] items-center">
          {row.map((cell, ci) => {
            const variant = getDayVariant(cell, year, month, selectionStart, selectionEnd);
            return (
              <button
                key={`${ri}-${ci}-${cell.getTime()}`}
                type="button"
                disabled={variant === 'disabled'}
                data-statement={
                  variant === 'disabled'
                    ? 'Disable'
                    : variant.startsWith('range')
                      ? variant.replace('range-', '')
                      : 'Default'
                }
                className={cn(
                  'flex size-12 shrink-0 flex-col items-center justify-center overflow-hidden p-2.5 text-base font-bold leading-6 outline-none',
                  variant === 'default' && 'rounded-full hover:bg-gray-100 focus-visible:shadow-focus-ring',
                  variant === 'disabled' && 'cursor-default rounded-full',
                  variant !== 'disabled' &&
                    variant !== 'default' &&
                    'cursor-pointer focus-visible:shadow-focus-ring',
                  dayCellClass(variant),
                )}
                onClick={() => onDayClick(cell)}
              >
                {cell.getDate()}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
