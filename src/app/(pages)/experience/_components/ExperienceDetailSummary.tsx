'use client';

import Image from 'next/image';
import * as React from 'react';

import type { ExperienceItem } from '@/app/(pages)/experience/_components/ExperienceCardGrid';
import { ExperienceDetailInlineTextArea } from '@/app/(pages)/experience/_components/ExperienceDetailInlineTextArea';
import type { BasicDetailKey } from '@/app/(pages)/experience/_hooks/useExperienceDetailForm';
import { getExperienceCategoryMeta } from '@/app/(pages)/experience/_utils/ExperienceCategory';
import { getExperienceFieldMaxLength } from '@/app/(pages)/experience/_utils/experienceFieldLimits';
import { CalendarIcon } from '@/components/common/icons/CalendarIcon';
import { type CalendarDateRange, RangeCalendar } from '@/components/common/RangeCalendar';
import {
  type SingleMonthCalendarDateRange,
  SingleMonthRangeCalendar,
} from '@/components/common/SingleMonthRangeCalendar';
import { cn } from '@/lib/utils';

interface ExperienceDetailSummaryProps {
  type: ExperienceItem['type'];
  basicDetail: ExperienceItem['basicDetail'];
  periodLabel: string;
  isEditing: boolean;
  isPage: boolean;
  datePickerOpen: boolean;
  datePickerTop: number | null;
  datePickerRootRef: React.RefObject<HTMLDivElement | null>;
  datePickerButtonRef: React.RefObject<HTMLButtonElement | null>;
  selectedDateRange: CalendarDateRange | null;
  onDatePickerToggle: () => void;
  onDateRangeChange: (nextRange: CalendarDateRange | SingleMonthCalendarDateRange | null) => void;
  onBasicDetailChange: (key: BasicDetailKey, value: string) => void;
}

export function ExperienceDetailSummary({
  type,
  basicDetail,
  periodLabel,
  isEditing,
  isPage,
  datePickerOpen,
  datePickerTop,
  datePickerRootRef,
  datePickerButtonRef,
  selectedDateRange,
  onDatePickerToggle,
  onDateRangeChange,
  onBasicDetailChange,
}: ExperienceDetailSummaryProps) {
  const category = getExperienceCategoryMeta(type);
  const detailInfoItems = React.useMemo(
    () => getDetailInfoItems(type, basicDetail, periodLabel),
    [basicDetail, periodLabel, type],
  );

  return (
    <div className={cn('flex items-start gap-5', isPage && 'items-center')}>
      <div
        className={cn(
          'flex shrink-0 flex-col items-center gap-0.5',
          isPage ? 'w-[109px]' : 'w-[83px]',
        )}
      >
        <Image
          src={category.selectedIconSrc}
          alt=""
          width={isPage ? 109 : 72}
          height={isPage ? 109 : 72}
          className={cn(isPage ? 'size-[109px]' : 'size-[72px]')}
        />
        <span className={cn('font-bold text-strong', isPage ? 'body-2-bold' : 'body-3-bold')}>
          {category.label}
        </span>
      </div>

      <dl className="flex w-full flex-col gap-1.5">
        {detailInfoItems.map((item) => (
          <div key={item.label} className="flex w-full items-start gap-4">
            <dt
              className={cn(
                'shrink-0 font-bold text-strong',
                isPage ? 'body-1-bold' : 'body-3-bold',
              )}
            >
              {item.label}
            </dt>
            <dd
              className={cn(
                'relative flex min-w-0 flex-1 items-center gap-1 text-secondary',
                isPage ? 'body-1-regular' : 'body-3-regular',
              )}
            >
              {isEditing && item.type === 'period' ? (
                <div ref={datePickerRootRef} className="relative flex items-center gap-1">
                  <button
                    ref={datePickerButtonRef}
                    type="button"
                    aria-label="기간 선택"
                    aria-expanded={datePickerOpen}
                    className="flex min-w-0 cursor-pointer items-center gap-1 rounded-sm text-secondary focus-visible:shadow-focus-ring focus-visible:outline-none"
                    onClick={onDatePickerToggle}
                  >
                    <CalendarIcon className="size-[21px] shrink-0 text-tertiary" />
                    <span>{item.value}</span>
                  </button>
                  {datePickerOpen && (
                    <div
                      role="dialog"
                      aria-label="기간 선택"
                      className={cn(
                        'z-60',
                        isPage
                          ? 'absolute top-full left-0 mt-2'
                          : 'fixed right-[max(1rem,calc((min(100vw,500px)-24rem)/2))]',
                      )}
                      style={isPage ? undefined : { top: datePickerTop ?? undefined }}
                    >
                      {isPage ? (
                        <RangeCalendar
                          value={selectedDateRange}
                          defaultVisibleMonth={selectedDateRange?.start ?? new Date()}
                          onChange={onDateRangeChange}
                        />
                      ) : (
                        <SingleMonthRangeCalendar
                          value={selectedDateRange}
                          defaultVisibleMonth={selectedDateRange?.start ?? new Date()}
                          onChange={onDateRangeChange}
                        />
                      )}
                    </div>
                  )}
                </div>
              ) : null}
              {isEditing && item.type === 'field' ? (
                <ExperienceDetailInlineTextArea
                  value={item.value}
                  ariaLabel={item.label}
                  maxLength={getExperienceFieldMaxLength(item.name)}
                  className="text-secondary"
                  onChange={(value) => onBasicDetailChange(item.name, value)}
                />
              ) : (
                !isEditing && <span>{item.type === 'field' ? item.displayValue : item.value}</span>
              )}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

type EditableDetailInfoItem =
  | {
      type: 'period';
      label: string;
      value: string;
    }
  | {
      type: 'field';
      label: string;
      value: string;
      displayValue: string;
      name: BasicDetailKey;
    };

function getDetailInfoItems(
  type: ExperienceItem['type'],
  basicDetail: ExperienceItem['basicDetail'],
  periodLabel: string,
): EditableDetailInfoItem[] {
  switch (type) {
    case 'activity': {
      const teamNum = basicDetail.teamNum ?? '';
      const contributionRate = basicDetail.contributionRate ?? '';

      return [
        { type: 'period', label: '기간', value: periodLabel },
        {
          type: 'field',
          label: '팀원 수',
          value: teamNum,
          displayValue: teamNum ? `${teamNum}명` : '',
          name: 'teamNum',
        },
        {
          type: 'field',
          label: '내 역할',
          value: basicDetail.role ?? '',
          displayValue: basicDetail.role ?? '',
          name: 'role',
        },
        {
          type: 'field',
          label: '기여도',
          value: contributionRate,
          displayValue: contributionRate ? `${contributionRate}%` : '',
          name: 'contributionRate',
        },
      ];
    }
    case 'career':
      return [
        { type: 'period', label: '기간', value: periodLabel },
        {
          type: 'field',
          label: '회사/기관/단체명',
          value: basicDetail.company ?? '',
          displayValue: basicDetail.company ?? '',
          name: 'company',
        },
        {
          type: 'field',
          label: '고용 형태',
          value: basicDetail.employmentStatus ?? '',
          displayValue: basicDetail.employmentStatus ?? '',
          name: 'employmentStatus',
        },
      ];
    case 'education':
      return [
        { type: 'period', label: '기간', value: periodLabel },
        {
          type: 'field',
          label: '기관명',
          value: basicDetail.organizationName ?? '',
          displayValue: basicDetail.organizationName ?? '',
          name: 'organizationName',
        },
        {
          type: 'field',
          label: '수강명',
          value: basicDetail.name ?? '',
          displayValue: basicDetail.name ?? '',
          name: 'name',
        },
      ];
    case 'etc':
      return [{ type: 'period', label: '기간', value: periodLabel }];
  }
}
