'use client';

import * as React from 'react';

import { DeadlineTimeField } from '@/components/common/DeadlineTimeField';
import { RecruitmentPeriodField } from '@/components/common/PeriodField';
import { type CalendarDateRange } from '@/components/common/RangeCalendar';
import { cn } from '@/lib/utils';

export interface RecruitmentDeadlineFieldsProps {
  periodRange: CalendarDateRange | null;
  onPeriodRangeChange: (range: CalendarDateRange | null) => void;
  deadlineTime: string;
  onDeadlineTimeChange: (time: string) => void;
  noRecruitmentPeriod: boolean;
  onNoRecruitmentPeriodChange: (checked: boolean) => void;
  className?: string;
}

export function RecruitmentDeadlineFields({
  periodRange,
  onPeriodRangeChange,
  deadlineTime,
  onDeadlineTimeChange,
  noRecruitmentPeriod,
  onNoRecruitmentPeriodChange,
  className,
}: RecruitmentDeadlineFieldsProps) {
  const checkboxId = React.useId();
  const fieldsDisabled = noRecruitmentPeriod;

  const handleNoPeriodChange = (checked: boolean) => {
    onNoRecruitmentPeriodChange(checked);
    if (checked) {
      onPeriodRangeChange(null);
      onDeadlineTimeChange('');
    }
  };

  return (
    <div className={cn('flex w-full min-w-0 items-start gap-3', className)}>
      <div className="flex min-w-0 flex-1 flex-col gap-4">
        <p className="title-2-bold text-strong">모집 기간</p>
        <div className="flex flex-col gap-1">
          <RecruitmentPeriodField
            showLabel={false}
            disabled={fieldsDisabled}
            placeholder="0000년 00월 00일"
            value={periodRange}
            onChange={onPeriodRangeChange}
          />
          <label htmlFor={checkboxId} className="inline-flex cursor-pointer items-center">
            <span className="flex size-10 shrink-0 items-center justify-center">
              <input
                id={checkboxId}
                type="checkbox"
                checked={noRecruitmentPeriod}
                onChange={(e) => handleNoPeriodChange(e.target.checked)}
                className="peer sr-only"
              />
              <span
                aria-hidden
                className={cn(
                  'flex size-6 items-center justify-center rounded border border-gray-300 bg-background-w transition-colors',
                  'peer-checked:border-gray-main peer-checked:bg-gray-main peer-checked:[&_svg]:opacity-100',
                  'peer-focus-visible:shadow-focus-ring',
                )}
              >
                <svg
                  className="size-3.5 text-on-fill opacity-0"
                  viewBox="0 0 12 10"
                  fill="none"
                >
                  <path
                    d="M1 5L4.5 8.5L11 1.5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </span>
            <span className="body-1-bold text-tertiary">마감기간이 없어요</span>
          </label>
        </div>
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-4">
        <p className="title-2-bold text-strong">마감 시간</p>
        <DeadlineTimeField
          value={deadlineTime}
          onChange={onDeadlineTimeChange}
          disabled={fieldsDisabled}
          placeholder="00:00 pm"
        />
      </div>
    </div>
  );
}
