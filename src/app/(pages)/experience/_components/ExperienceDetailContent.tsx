'use client';

import Image from 'next/image';
import * as React from 'react';

import type { ExperienceItem } from '@/app/(pages)/experience/_components/ExperienceCardGrid';
import { EditableTagGroup } from '@/app/(pages)/experience/_components/EditableTagGroup';
import {
  type BasicDetailKey,
  type ExperienceDetailSaveValue as ExperienceDetailSaveValueType,
  useExperienceDetailForm,
} from '@/app/(pages)/experience/_hooks/useExperienceDetailForm';
import { getExperienceCategoryMeta } from '@/app/(pages)/experience/_utils/ExperienceCategory';
import {
  EXPERIENCE_FIELD_MAX_LENGTHS,
  getExperienceFieldMaxLength,
} from '@/app/(pages)/experience/_utils/experienceFieldLimits';
import { DetailInput } from '@/components/common/DetailInput';
import { ErrorDialog } from '@/components/common/ErrorDialog';
import { CalendarIcon } from '@/components/common/icons/CalendarIcon';
import { Tag } from '@/components/common/Tag';
import { SingleMonthRangeCalendar } from '@/components/common/SingleMonthRangeCalendar';
import { RangeCalendar } from '@/components/common/RangeCalendar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export type { ExperienceDetailSaveValue } from '@/app/(pages)/experience/_hooks/useExperienceDetailForm';

const detailFields = [
  ['Situation', 'situation'],
  ['Task', 'task'],
  ['Action', 'action'],
  ['Result', 'result'],
  ['Taken', 'taken'],
] as const;
const DETAIL_FIELD_MAX_LENGTH = 1000;

export interface ExperienceDetailContentProps extends React.ComponentProps<'div'> {
  experience: ExperienceItem;
  variant?: 'panel' | 'page';
  defaultEditing?: boolean;
  onEdit?: () => void;
  onSave?: (experience: ExperienceDetailSaveValueType) => Promise<void> | void;
}

export function ExperienceDetailContent({
  experience,
  variant = 'panel',
  defaultEditing = false,
  onEdit,
  onSave,
  className,
  ...props
}: ExperienceDetailContentProps) {
  const category = getExperienceCategoryMeta(experience.type);
  const isPage = variant === 'page';
  const {
    title,
    description,
    detail,
    basicDetail,
    skillTags,
    competencyTags,
    isEditing,
    isSaving,
    editingTagGroup,
    datePickerOpen,
    datePickerTop,
    errorMessage,
    datePickerRootRef,
    datePickerButtonRef,
    selectedDateRange,
    periodLabel,
    setSkillTags,
    setCompetencyTags,
    setEditingTagGroup,
    updateTitle,
    updateDescription,
    handleDetailChange,
    updateBasicDetail,
    handleEditClick,
    handleSaveEdit,
    toggleDatePicker,
    handleDateRangeChange,
    handleErrorDialogOpenChange,
  } = useExperienceDetailForm({
    experience,
    defaultEditing,
    onEdit,
    onSave,
  });
  const detailInfoItems = React.useMemo(
    () => getDetailInfoItems(experience.type, basicDetail, periodLabel),
    [basicDetail, experience.type, periodLabel],
  );

  return (
    <div
      data-slot="experience-detail-content"
      className={cn('flex min-h-0 flex-1 flex-col', className)}
      {...props}
    >
      <div className={cn('flex flex-col', isPage ? 'gap-7' : 'gap-6')}>
        <div className="flex min-w-0 items-start justify-between gap-4">
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            {isEditing ? (
              <InlineTextArea
                value={title}
                ariaLabel="제목"
                maxLength={EXPERIENCE_FIELD_MAX_LENGTHS.title}
                className={cn('text-strong', isPage ? 'heading-2-bold' : 'title-1-bold')}
                onChange={updateTitle}
              />
            ) : (
              <h3
                className={cn(
                  'w-full min-w-0 leading-[1.48] wrap-break-word text-strong',
                  isPage ? 'heading-2-bold' : 'title-1-bold',
                )}
              >
                {title}
              </h3>
            )}
            {isEditing ? (
              <InlineTextArea
                value={description}
                ariaLabel="한 줄 설명"
                maxLength={EXPERIENCE_FIELD_MAX_LENGTHS.description}
                className={cn('text-quaternary', isPage ? 'body-1-bold' : 'body-3-regular')}
                onChange={updateDescription}
              />
            ) : (
              <p
                className={cn(
                  'w-full min-w-0 leading-[1.48] wrap-break-word text-quaternary',
                  isPage ? 'body-1-bold' : 'body-3-regular',
                )}
              >
                {description}
              </p>
            )}
          </div>

          {isEditing ? (
            <Button type="button" disabled={isSaving} onClick={handleSaveEdit}>
              {isSaving ? '저장 중...' : '저장하기'}
            </Button>
          ) : (
            <Button type="button" variant="secondary" onClick={handleEditClick}>
              수정하기
            </Button>
          )}
        </div>

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
                        onClick={toggleDatePicker}
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
                              onChange={handleDateRangeChange}
                            />
                          ) : (
                            <SingleMonthRangeCalendar
                              value={selectedDateRange}
                              defaultVisibleMonth={selectedDateRange?.start ?? new Date()}
                              onChange={handleDateRangeChange}
                            />
                          )}
                        </div>
                      )}
                    </div>
                  ) : null}
                  {isEditing && item.type === 'field' ? (
                    <InlineTextArea
                      value={item.value}
                      ariaLabel={item.label}
                      maxLength={getExperienceFieldMaxLength(item.name)}
                      className="text-secondary"
                      onChange={(value) => updateBasicDetail(item.name, value)}
                    />
                  ) : (
                    !isEditing && (
                      <span>{item.type === 'field' ? item.displayValue : item.value}</span>
                    )
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {isEditing ? (
          <div className="flex flex-col gap-2.5">
            <EditableTagGroup
              label="기술"
              tone="skill"
              tags={skillTags}
              editing={editingTagGroup === 'skill'}
              variant="bordered-row"
              viewTagSize="large"
              onChange={setSkillTags}
              onEdit={() => setEditingTagGroup('skill')}
              onRequestClose={() => setEditingTagGroup(null)}
            />
            <EditableTagGroup
              label="역량"
              tone="competency"
              tags={competencyTags}
              editing={editingTagGroup === 'competency'}
              variant="bordered-row"
              viewTagSize="large"
              borderBottom
              onChange={setCompetencyTags}
              onEdit={() => setEditingTagGroup('competency')}
              onRequestClose={() => setEditingTagGroup(null)}
            />
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <div className="flex flex-wrap gap-1">
              {skillTags.map((tag, index) => (
                <Tag key={`skill-${tag}-${index}`} tone="skill" size="large">
                  {tag}
                </Tag>
              ))}
            </div>

            <div className="flex flex-wrap gap-1">
              {competencyTags.map((tag, index) => (
                <Tag key={`competency-${tag}-${index}`} tone="competency" size="large">
                  {tag}
                </Tag>
              ))}
            </div>
          </div>
        )}
      </div>

      {!isEditing ? <div className="mt-4 h-px w-full shrink-0 bg-gray-300" /> : null}

      <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-x-hidden py-6">
        {detailFields.map(([label, key]) => {
          const fieldValue = detail[key] ?? '';
          const characterCount = fieldValue.length;
          const isMaxLength = characterCount >= DETAIL_FIELD_MAX_LENGTH;

          return (
            <div key={key} className="flex w-full flex-col gap-1.5">
              <div className="flex items-end gap-3 px-2">
                <h3
                  className={cn('font-bold text-primary', isPage ? 'title-2-bold' : 'body-2-bold')}
                >
                  {label}
                </h3>
                <p className={cn('caption-bold', isMaxLength ? 'text-danger' : 'text-quaternary')}>
                  {characterCount}자 / {DETAIL_FIELD_MAX_LENGTH}자
                </p>
              </div>
              <DetailInput
                value={fieldValue}
                maxLength={DETAIL_FIELD_MAX_LENGTH}
                readOnly={!isEditing}
                onChange={handleDetailChange(key)}
              />
            </div>
          );
        })}
      </div>
      <ErrorDialog
        open={errorMessage.length > 0}
        message={errorMessage}
        onOpenChange={handleErrorDialogOpenChange}
      />
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

function InlineTextArea({
  value,
  ariaLabel,
  maxLength,
  className,
  onChange,
}: {
  value: string;
  ariaLabel: string;
  maxLength?: number;
  className?: string;
  onChange: (value: string) => void;
}) {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  React.useLayoutEffect(() => {
    const textarea = textareaRef.current;

    if (!textarea) return;

    textarea.style.height = '0px';
    textarea.style.height = `${textarea.scrollHeight}px`;
  }, [value]);

  return (
    <textarea
      ref={textareaRef}
      value={value}
      aria-label={ariaLabel}
      maxLength={maxLength}
      rows={1}
      className={cn(
        'block min-h-[1.48em] w-full min-w-0 resize-none overflow-hidden bg-transparent p-0 leading-[1.48] outline-none',
        className,
      )}
      onChange={(event) => onChange(event.currentTarget.value.slice(0, maxLength))}
    />
  );
}
