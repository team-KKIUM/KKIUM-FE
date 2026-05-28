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

type DayVariant =
  | 'default'
  | 'disabled'
  | 'selected-single'
  | 'selected-start'
  | 'selected-end'
  | 'range-mid'
  | 'preview-start'
  | 'preview-end';

function getDayVariant(
  cell: Date,
  viewYear: number,
  viewMonth: number,
  rangeStart: Date | null,
  rangeEnd: Date | null,
  previewEnd: Date | null,
): DayVariant {
  const inMonth = cell.getMonth() === viewMonth && cell.getFullYear() === viewYear;
  if (!inMonth) return 'disabled';

  if (!rangeStart) return 'default';

  if (!rangeEnd) {
    if (!previewEnd) {
      return sameLocalDay(cell, rangeStart) ? 'selected-single' : 'default';
    }

    const s = startOfLocalDay(rangeStart);
    const e = startOfLocalDay(previewEnd);
    const lo = compareLocalDay(s, e) <= 0 ? s : e;
    const hi = compareLocalDay(s, e) <= 0 ? e : s;

    const c = startOfLocalDay(cell);
    if (compareLocalDay(c, lo) < 0 || compareLocalDay(c, hi) > 0) return 'default';
    if (sameLocalDay(c, s) && sameLocalDay(c, e)) return 'selected-single';
    if (sameLocalDay(c, s)) {
      return compareLocalDay(s, e) <= 0 ? 'selected-start' : 'selected-end';
    }
    if (sameLocalDay(c, e)) {
      return compareLocalDay(s, e) <= 0 ? 'preview-end' : 'preview-start';
    }
    return 'range-mid';
  }

  const s = startOfLocalDay(rangeStart);
  const e = startOfLocalDay(rangeEnd);
  const lo = compareLocalDay(s, e) <= 0 ? s : e;
  const hi = compareLocalDay(s, e) <= 0 ? e : s;

  const c = startOfLocalDay(cell);
  if (compareLocalDay(c, lo) < 0 || compareLocalDay(c, hi) > 0) return 'default';
  if (sameLocalDay(c, lo) && sameLocalDay(c, hi)) return 'selected-single';
  if (sameLocalDay(c, lo)) return 'selected-start';
  if (sameLocalDay(c, hi)) return 'selected-end';
  return 'range-mid';
}

function dayCellClass(variant: DayVariant): string {
  switch (variant) {
    case 'disabled':
      return 'text-quaternary';
    case 'selected-single':
      return 'rounded-md bg-mint-500 text-on-fill';
    case 'selected-start':
      return 'rounded-tl-md rounded-bl-md bg-mint-500 text-on-fill';
    case 'selected-end':
      return 'rounded-tr-md rounded-br-md bg-mint-500 text-on-fill';
    case 'preview-start':
      return 'rounded-tl-md rounded-bl-md bg-mint-100 text-success';
    case 'preview-end':
      return 'rounded-tr-md rounded-br-md bg-mint-100 text-success';
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
  previewEnd?: Date | null;
  onDayClick: (d: Date) => void;
  onDayHover?: (d: Date | null) => void;
};

export function MonthPanel({
  year,
  month,
  selectionStart,
  selectionEnd,
  previewEnd = null,
  onDayClick,
  onDayHover,
}: MonthPanelProps) {
  const weeks = React.useMemo(() => buildMonthWeeks(year, month), [year, month]);

  return (
    <div className="flex flex-col" onPointerLeave={() => onDayHover?.(null)}>
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
            const variant = getDayVariant(cell, year, month, selectionStart, selectionEnd, previewEnd);
            const isDisabled = variant === 'disabled';
            return (
              <button
                key={`${ri}-${ci}-${cell.getTime()}`}
                type="button"
                disabled={isDisabled}
                data-statement={
                  isDisabled
                    ? 'Disable'
                    : variant === 'selected-single'
                      ? 'Selected'
                      : variant === 'selected-start'
                        ? 'start'
                        : variant === 'selected-end'
                          ? 'end'
                          : variant === 'range-mid'
                            ? 'range'
                            : variant === 'preview-start' || variant === 'preview-end'
                              ? 'hover2'
                              : 'Default'
                }
                className={cn(
                  'flex size-12 shrink-0 flex-col items-center justify-center overflow-hidden p-2.5 text-base font-bold leading-6 outline-none',
                  variant === 'default' &&
                    'rounded-full hover:rounded-md hover:bg-gray-300 focus-visible:shadow-focus-ring',
                  isDisabled && 'cursor-default rounded-full',
                  !isDisabled &&
                    variant !== 'default' &&
                    'cursor-pointer focus-visible:shadow-focus-ring',
                  dayCellClass(variant),
                )}
                onClick={() => onDayClick(cell)}
                onPointerEnter={() => {
                  if (!isDisabled) {
                    onDayHover?.(cell);
                  }
                }}
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
