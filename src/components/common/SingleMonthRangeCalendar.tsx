'use client';

import * as React from 'react';

import { ChevronLeftIcon } from '@/components/common/icons/ChevronLeftIcon';
import { ChevronRightIcon } from '@/components/common/icons/ChevronRightIcon';
import { MonthPanel } from '@/components/common/MonthPanel';
import { cn } from '@/lib/utils';

export type SingleMonthCalendarDateRange = { start: Date; end: Date };

function startOfLocalDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
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

function formatMonthTitle(year: number, month: number): string {
  return `${year}년 ${month + 1}월`;
}

export interface SingleMonthRangeCalendarProps
  extends Omit<React.ComponentProps<'div'>, 'onChange' | 'defaultValue'> {
  defaultVisibleMonth?: Date;
  defaultRange?: SingleMonthCalendarDateRange | null;
  value?: SingleMonthCalendarDateRange | null;
  onChange?: (range: SingleMonthCalendarDateRange | null) => void;
  minDate?: Date;
  maxDate?: Date;
}

export function SingleMonthRangeCalendar({
  className,
  defaultVisibleMonth,
  defaultRange = null,
  value: valueProp,
  onChange,
  minDate,
  maxDate,
  ...props
}: SingleMonthRangeCalendarProps) {
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
  const [previewEnd, setPreviewEnd] = React.useState<Date | null>(null);

  const valueSyncKey =
    valueProp == null ? 'empty' : `${dayTime(valueProp.start)}-${dayTime(valueProp.end)}`;
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

  const bumpAnchor = (delta: number) => {
    setAnchor((currentAnchor) => addMonths(currentAnchor.year, currentAnchor.month, delta));
  };

  const handleDayClick = (cell: Date) => {
    const inMonth = cell.getMonth() === anchor.month && cell.getFullYear() === anchor.year;
    if (!inMonth) return;

    const t = dayTime(cell);
    if (minDate && t < dayTime(minDate)) return;
    if (maxDate && t > dayTime(maxDate)) return;

    const day = startOfLocalDay(cell);

    if (!draftStart || (draftStart && draftEnd)) {
      setDraftStart(day);
      setDraftEnd(null);
      setPreviewEnd(null);
      onChange?.(null);
      return;
    }

    let start = draftStart;
    let end = day;
    if (compareLocalDay(end, start) < 0) [start, end] = [end, start];
    setDraftStart(start);
    setDraftEnd(end);
    setPreviewEnd(null);
    onChange?.({ start, end });
  };

  return (
    <div
      data-slot="single-month-range-calendar"
      className={cn(
        'inline-flex w-96 flex-col gap-2.5 rounded-2xl bg-background-w p-6 shadow-lg',
        className,
      )}
      {...props}
    >
      <div className="flex w-full items-center">
        <button
          type="button"
          aria-label="이전 달"
          className="flex size-8 shrink-0 items-center justify-center rounded-sm text-gray-main outline-none hover:bg-gray-100 focus-visible:shadow-focus-ring"
          onClick={() => bumpAnchor(-1)}
        >
          <ChevronLeftIcon className="size-6" />
        </button>
        <span className="flex-1 text-center text-base font-semibold leading-7 text-strong">
          {formatMonthTitle(anchor.year, anchor.month)}
        </span>
        <button
          type="button"
          aria-label="다음 달"
          className="flex size-8 shrink-0 items-center justify-center rounded-sm text-gray-main outline-none hover:bg-gray-100 focus-visible:shadow-focus-ring"
          onClick={() => bumpAnchor(1)}
        >
          <ChevronRightIcon className="size-6" />
        </button>
      </div>
      <div className="flex w-full justify-center">
        <MonthPanel
          year={anchor.year}
          month={anchor.month}
          selectionStart={draftStart}
          selectionEnd={draftEnd}
          previewEnd={draftStart && !draftEnd ? previewEnd : null}
          onDayClick={handleDayClick}
          onDayHover={setPreviewEnd}
        />
      </div>
    </div>
  );
}
