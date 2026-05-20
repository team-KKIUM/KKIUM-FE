'use client';

import * as React from 'react';

import { ChevronLeftIcon } from '@/components/common/icons/ChevronLeftIcon';
import { ChevronRightIcon } from '@/components/common/icons/ChevronRightIcon';
import { MonthPanel } from '@/components/common/MonthPanel';
import { cn } from '@/lib/utils';

export type CalendarDateRange = { start: Date; end: Date };

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
        'inline-flex w-200 flex-col gap-2.5 rounded-2xl bg-background-w p-6 shadow-lg',
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
        <div className="flex flex-1 items-center justify-center gap-8">
          <span className="w-[336px] text-center text-base font-semibold leading-7 text-strong">
            {formatMonthTitle(anchor.year, anchor.month)}
          </span>
          <span className="w-[336px] text-center text-base font-semibold leading-7 text-strong">
            {formatMonthTitle(second.year, second.month)}
          </span>
        </div>
        <button
          type="button"
          aria-label="다음 달"
          className="flex size-8 shrink-0 items-center justify-center rounded-sm text-gray-main outline-none hover:bg-gray-100 focus-visible:shadow-focus-ring"
          onClick={() => bumpAnchor(1)}
        >
          <ChevronRightIcon className="size-6" />
        </button>
      </div>
      <div className="flex w-full justify-center gap-8">
        <MonthPanel
          year={anchor.year}
          month={anchor.month}
          selectionStart={selectionStart}
          selectionEnd={selectionEnd}
          onDayClick={(d) => handleDayClick(d, anchor.year, anchor.month)}
        />
        <MonthPanel
          year={second.year}
          month={second.month}
          selectionStart={selectionStart}
          selectionEnd={selectionEnd}
          onDayClick={(d) => handleDayClick(d, second.year, second.month)}
        />
      </div>
    </div>
  );
}
