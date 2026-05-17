'use client';

import * as React from 'react';

import { ChevronLeftIcon } from '@/components/common/icons/ChevronLeftIcon';
import { ChevronRightIcon } from '@/components/common/icons/ChevronRightIcon';
import { cn } from '@/lib/utils';

const WEEK_LABELS = ['일', '월', '화', '수', '목', '금', '토'] as const;

export type CalendarDateRange = { start: Date; end: Date };

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

function addMonths(year: number, monthIndex: number, delta: number): { year: number; month: number } {
  const d = new Date(year, monthIndex + delta, 1);
  return { year: d.getFullYear(), month: d.getMonth() };
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

function formatMonthTitle(year: number, month: number): string {
  return `${year}년 ${month + 1}월`;
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

export interface RangeCalendarProps extends Omit<React.ComponentProps<'div'>, 'onChange' | 'defaultValue'> {
  defaultVisibleMonth?: Date;
  defaultRange?: CalendarDateRange | null;
  value?: CalendarDateRange | null;
  onChange?: (range: CalendarDateRange | null) => void;
  minDate?: Date;
  maxDate?: Date;
}

export function RangeCalendar({
  className,
  defaultVisibleMonth,
  defaultRange = null,
  value: valueProp,
  onChange,
  minDate,
  maxDate,
  ...props
}: RangeCalendarProps) {
  const initialAnchor = React.useMemo(() => {
    const base = defaultVisibleMonth ?? new Date();
    return { year: base.getFullYear(), month: base.getMonth() };
  }, [defaultVisibleMonth]);

  const [anchor, setAnchor] = React.useState(initialAnchor);
  const isControlled = valueProp !== undefined;

  const [draftStart, setDraftStart] = React.useState<Date | null>(() => {
    if (valueProp) return startOfLocalDay(valueProp.start);
    if (defaultRange) return startOfLocalDay(defaultRange.start);
    return null;
  });
  const [draftEnd, setDraftEnd] = React.useState<Date | null>(() => {
    if (valueProp) return startOfLocalDay(valueProp.end);
    if (defaultRange) return startOfLocalDay(defaultRange.end);
    return null;
  });

  const valueSyncKey =
    valueProp == null
      ? 'empty'
      : `${dayTime(valueProp.start)}-${dayTime(valueProp.end)}`;

  const prevCommittedKey = React.useRef<string | null>(null);

  React.useEffect(() => {
    if (!isControlled) return;
    if (valueProp) {
      setDraftStart(startOfLocalDay(valueProp.start));
      setDraftEnd(startOfLocalDay(valueProp.end));
      prevCommittedKey.current = valueSyncKey;
      return;
    }
    if (prevCommittedKey.current != null && prevCommittedKey.current !== 'empty') {
      setDraftStart(null);
      setDraftEnd(null);
    }
    prevCommittedKey.current = 'empty';
  }, [isControlled, valueSyncKey, valueProp]);

  const selectionStart = draftStart;
  const selectionEnd = draftEnd;

  const commitRange = (next: CalendarDateRange | null) => {
    onChange?.(next);
  };

  const bumpAnchor = (delta: number) => {
    setAnchor((a) => addMonths(a.year, a.month, delta));
  };

  const handleDayClick = (cell: Date, viewYear: number, viewMonth: number) => {
    const inMonth = cell.getMonth() === viewMonth && cell.getFullYear() === viewYear;
    if (!inMonth) return;

    const t = dayTime(cell);
    if (minDate && t < dayTime(minDate)) return;
    if (maxDate && t > dayTime(maxDate)) return;

    const day = startOfLocalDay(cell);

    if (!selectionStart || (selectionStart && selectionEnd)) {
      setDraftStart(day);
      setDraftEnd(null);
      commitRange(null);
      return;
    }

    let s = selectionStart;
    let e = day;
    if (compareLocalDay(e, s) < 0) [s, e] = [e, s];
    setDraftStart(s);
    setDraftEnd(e);
    commitRange({ start: s, end: e });
  };

  const second = addMonths(anchor.year, anchor.month, 1);

  return (
    <div
      data-slot="range-calendar"
      className={cn(
        'inline-flex flex-wrap items-start gap-8 rounded-2xl bg-background-w p-6 shadow-[0px_4px_6px_-4px_rgba(0,0,0,0.10)] shadow-lg',
        className,
      )}
      {...props}
    >
      <MonthPanel
        year={anchor.year}
        month={anchor.month}
        title={formatMonthTitle(anchor.year, anchor.month)}
        selectionStart={selectionStart}
        selectionEnd={selectionEnd}
        onPrev={() => bumpAnchor(-1)}
        onNext={() => bumpAnchor(1)}
        onDayClick={(d) => handleDayClick(d, anchor.year, anchor.month)}
      />
      <MonthPanel
        year={second.year}
        month={second.month}
        title={formatMonthTitle(second.year, second.month)}
        selectionStart={selectionStart}
        selectionEnd={selectionEnd}
        onPrev={() => bumpAnchor(-1)}
        onNext={() => bumpAnchor(1)}
        onDayClick={(d) => handleDayClick(d, second.year, second.month)}
      />
    </div>
  );
}

type MonthPanelProps = {
  year: number;
  month: number;
  title: string;
  selectionStart: Date | null;
  selectionEnd: Date | null;
  onPrev: () => void;
  onNext: () => void;
  onDayClick: (d: Date) => void;
};

function MonthPanel({
  year,
  month,
  title,
  selectionStart,
  selectionEnd,
  onPrev,
  onNext,
  onDayClick,
}: MonthPanelProps) {
  const weeks = React.useMemo(() => buildMonthWeeks(year, month), [year, month]);

  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex w-[336px] items-center justify-between">
        <button
          type="button"
          aria-label="이전 달"
          className="flex size-8 shrink-0 items-center justify-center rounded-sm text-gray-main outline-none hover:bg-gray-100 focus-visible:shadow-focus-ring"
          onClick={onPrev}
        >
          <ChevronLeftIcon className="size-6" />
        </button>
        <span className="text-center text-base font-semibold leading-7 text-strong">{title}</span>
        <button
          type="button"
          aria-label="다음 달"
          className="flex size-8 shrink-0 items-center justify-center rounded-sm text-gray-main outline-none hover:bg-gray-100 focus-visible:shadow-focus-ring"
          onClick={onNext}
        >
          <ChevronRightIcon className="size-6" />
        </button>
      </div>

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
    </div>
  );
}
