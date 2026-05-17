'use client';

import * as React from 'react';

import { CalendarIcon } from '@/components/common/icons/CalendarIcon';
import { type CalendarDateRange, RangeCalendar } from '@/components/common/RangeCalendar';
import { cn } from '@/lib/utils';

function formatKoreanDateRange(range: CalendarDateRange | null): string | null {
  if (!range) return null;
  const opts: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  const fmt = new Intl.DateTimeFormat('ko-KR', opts);
  return `${fmt.format(range.start)} ~ ${fmt.format(range.end)}`;
}

export interface RecruitmentPeriodFieldProps {
  label?: string;
  placeholder?: string;
  defaultRange?: CalendarDateRange | null;
  value?: CalendarDateRange | null;
  onChange?: (range: CalendarDateRange | null) => void;
  defaultVisibleMonth?: Date;
  className?: string;
}

export function RecruitmentPeriodField({
  label = '모집 기간',
  placeholder = '기간을 선택해주세요',
  defaultRange = null,
  value: valueProp,
  onChange,
  defaultVisibleMonth,
  className,
}: RecruitmentPeriodFieldProps) {
  const isControlled = valueProp !== undefined;
  const [innerRange, setInnerRange] = React.useState<CalendarDateRange | null>(defaultRange);
  const range = isControlled ? valueProp ?? null : innerRange;

  const [open, setOpen] = React.useState(false);
  const rootRef = React.useRef<HTMLDivElement>(null);
  const listboxId = React.useId();

  const setRange = (next: CalendarDateRange | null) => {
    if (!isControlled) setInnerRange(next);
    onChange?.(next);
  };

  React.useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      const el = rootRef.current;
      if (el && !el.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown, true);
    return () => document.removeEventListener('pointerdown', onPointerDown, true);
  }, [open]);

  React.useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open]);

  const display = formatKoreanDateRange(range);
  const visibleMonth = defaultVisibleMonth ?? range?.start ?? new Date();

  return (
    <div className={cn('flex w-full flex-col gap-4', className)}>
      <p className="title-2-bold text-strong">{label}</p>

      <div ref={rootRef} className="relative">
        <button
          type="button"
          aria-expanded={open}
          aria-controls={listboxId}
          aria-haspopup="dialog"
          className={cn(
            'flex h-14 w-full items-center gap-2 rounded-lg border border-gray-300 px-4 text-left outline-none transition-colors',
            ' focus-visible:border-mint-main focus-visible:shadow-focus-ring',
          )}
          onClick={() => setOpen((v) => !v)}
        >
          <CalendarIcon className="size-6 shrink-0 text-quaternary" aria-hidden />
          <span className={cn('min-w-0 flex-1 truncate body-2-regular', display ? 'text-strong' : 'text-quaternary')}>
            {display ?? placeholder}
          </span>
        </button>

        {open ? (
          <div
            id={listboxId}
            role="dialog"
            aria-label={`${label} 선택`}
            className="absolute left-0 z-60 mt-2 max-w-[calc(100vw-2rem)]"
          >
            <RangeCalendar
              defaultVisibleMonth={visibleMonth}
              value={range}
              onChange={(next) => {
                setRange(next);
                if (next) setOpen(false);
              }}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}
