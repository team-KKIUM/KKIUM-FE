'use client';

import * as React from 'react';

import type { ExperienceItem } from '@/app/(pages)/experience/_components/ExperienceCardGrid';
import type { BasicDetailKey } from '@/app/(pages)/experience/_utils/experienceDetailInfoItems';
import { limitExperienceFieldText } from '@/app/(pages)/experience/_utils/experienceFieldLimits';
import { formatExperiencePeriod } from '@/app/(pages)/experience/_utils/formatExperiencePeriod';
import { sanitizeNumberText } from '@/app/(pages)/experience/_utils/sanitizeNumberText';
import type { CalendarDateRange } from '@/components/common/RangeCalendar';
import type { SingleMonthCalendarDateRange } from '@/components/common/SingleMonthRangeCalendar';

type EditableTagGroupKey = 'skill' | 'competency';
type DateRangeChangeValue = Partial<CalendarDateRange | SingleMonthCalendarDateRange> | null;
export type { BasicDetailKey } from '@/app/(pages)/experience/_utils/experienceDetailInfoItems';
export type ExperienceDetailSaveValue = Pick<
  ExperienceItem,
  | 'title'
  | 'description'
  | 'basicDetail'
  | 'detail'
  | 'skillTags'
  | 'competencyTags'
  | 'startDate'
  | 'endDate'
>;

interface UseExperienceDetailFormParams {
  experience: ExperienceItem;
  defaultEditing: boolean;
  onEdit?: () => void;
  onSave?: (experience: ExperienceDetailSaveValue) => Promise<void> | void;
}

export function useExperienceDetailForm({
  experience,
  defaultEditing,
  onEdit,
  onSave,
}: UseExperienceDetailFormParams) {
  const [title, setTitle] = React.useState(experience.title);
  const [description, setDescription] = React.useState(experience.description);
  const [detail, setDetail] = React.useState(experience.detail);
  const [basicDetail, setBasicDetail] = React.useState(experience.basicDetail);
  const [startDate, setStartDate] = React.useState(experience.startDate);
  const [endDate, setEndDate] = React.useState(experience.endDate);
  const [skillTags, setSkillTags] = React.useState(experience.skillTags);
  const [competencyTags, setCompetencyTags] = React.useState(experience.competencyTags);
  const [isEditing, setIsEditing] = React.useState(defaultEditing);
  const [isSaving, setIsSaving] = React.useState(false);
  const [editingTagGroup, setEditingTagGroup] = React.useState<EditableTagGroupKey | null>(null);
  const [datePickerOpen, setDatePickerOpen] = React.useState(false);
  const [datePickerTop, setDatePickerTop] = React.useState<number | null>(null);
  const [errorMessage, setErrorMessage] = React.useState('');
  const datePickerRootRef = React.useRef<HTMLDivElement>(null);
  const datePickerButtonRef = React.useRef<HTMLButtonElement>(null);
  const previousExperienceIdRef = React.useRef(experience.id);

  React.useEffect(() => {
    const isSameExperience = previousExperienceIdRef.current === experience.id;

    if (isSameExperience && isEditing) {
      return;
    }

    previousExperienceIdRef.current = experience.id;
    setTitle(experience.title);
    setDescription(experience.description);
    setDetail(experience.detail);
    setBasicDetail(experience.basicDetail);
    setStartDate(experience.startDate);
    setEndDate(experience.endDate);
    setSkillTags(experience.skillTags);
    setCompetencyTags(experience.competencyTags);
    setIsEditing(defaultEditing);
    setIsSaving(false);
    setEditingTagGroup(null);
    setDatePickerOpen(false);
    setDatePickerTop(null);
  }, [
    defaultEditing,
    experience.basicDetail,
    experience.competencyTags,
    experience.description,
    experience.detail,
    experience.endDate,
    experience.id,
    experience.skillTags,
    experience.startDate,
    experience.title,
    isEditing,
  ]);

  React.useEffect(() => {
    if (!datePickerOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      const root = datePickerRootRef.current;

      if (root && !root.contains(event.target as Node)) {
        setDatePickerOpen(false);
      }
    };

    document.addEventListener('pointerdown', handlePointerDown, true);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown, true);
    };
  }, [datePickerOpen]);

  React.useEffect(() => {
    if (!datePickerOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setDatePickerOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [datePickerOpen]);

  const selectedDateRange = React.useMemo<CalendarDateRange | null>(() => {
    const parsedStartDate = parseDateValue(startDate);
    const parsedEndDate = parseDateValue(endDate);

    if (!parsedStartDate || !parsedEndDate) return null;

    return { start: parsedStartDate, end: parsedEndDate };
  }, [endDate, startDate]);
  const periodLabel = formatExperiencePeriod(startDate, endDate);

  const updateTitle = React.useCallback((value: string) => {
    setTitle(limitExperienceFieldText('title', value));
  }, []);

  const updateDescription = React.useCallback((value: string) => {
    setDescription(limitExperienceFieldText('description', value));
  }, []);

  const handleDetailChange = React.useCallback(
    (key: keyof ExperienceItem['detail']): React.ChangeEventHandler<HTMLTextAreaElement> =>
      (event) => {
        setDetail((prev) => ({
          ...prev,
          [key]: event.target.value,
        }));
      },
    [],
  );

  const updateBasicDetail = React.useCallback((key: BasicDetailKey, value: string) => {
    const nextValue = getSanitizedBasicDetailValue(key, value);

    setBasicDetail((currentBasicDetail) => ({
      ...currentBasicDetail,
      [key]: nextValue,
    }));
  }, []);

  const handleEditClick = React.useCallback(() => {
    onEdit?.();
    setIsEditing(true);
    setEditingTagGroup(null);
  }, [onEdit]);

  const handleSaveEdit = React.useCallback(async () => {
    try {
      setIsSaving(true);
      await onSave?.({
        title,
        description,
        detail,
        basicDetail,
        startDate,
        endDate,
        skillTags,
        competencyTags,
      });
      setIsEditing(false);
      setEditingTagGroup(null);
      setDatePickerOpen(false);
      setDatePickerTop(null);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : '경험 수정 중 오류가 발생했습니다.');
    } finally {
      setIsSaving(false);
    }
  }, [
    basicDetail,
    competencyTags,
    description,
    detail,
    endDate,
    onSave,
    skillTags,
    startDate,
    title,
  ]);

  const toggleDatePicker = React.useCallback(() => {
    const buttonRect = datePickerButtonRef.current?.getBoundingClientRect();

    if (buttonRect) {
      setDatePickerTop(buttonRect.bottom + 8);
    }

    setDatePickerOpen((open) => !open);
  }, []);

  const handleDateRangeChange = React.useCallback((nextRange: DateRangeChangeValue) => {
    if (!isCompleteDateRange(nextRange)) return;

    setStartDate(formatDateValue(nextRange.start));
    setEndDate(formatDateValue(nextRange.end));
    setDatePickerOpen(false);
  }, []);

  const handleErrorDialogOpenChange = React.useCallback((open: boolean) => {
    if (!open) {
      setErrorMessage('');
    }
  }, []);

  return {
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
  };
}

function getSanitizedBasicDetailValue(key: BasicDetailKey, value: string) {
  if (key === 'teamNum' || key === 'contributionRate') {
    return sanitizeNumberText(value, 100);
  }

  return limitExperienceFieldText(key, value);
}

function parseDateValue(value: string) {
  if (!value) return null;

  const date = new Date(`${value}T00:00:00`);

  return Number.isNaN(date.getTime()) ? null : date;
}

function formatDateValue(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function isCompleteDateRange(
  range: DateRangeChangeValue,
): range is CalendarDateRange | SingleMonthCalendarDateRange {
  return isValidDate(range?.start) && isValidDate(range?.end);
}

function isValidDate(value: unknown): value is Date {
  return value instanceof Date && !Number.isNaN(value.getTime());
}
