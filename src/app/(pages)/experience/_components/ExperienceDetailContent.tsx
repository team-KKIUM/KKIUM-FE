'use client';

import * as React from 'react';

import type { ExperienceItem } from '@/app/(pages)/experience/_components/ExperienceCardGrid';
import { ExperienceDetailFields } from '@/app/(pages)/experience/_components/ExperienceDetailFields';
import { ExperienceDetailHeader } from '@/app/(pages)/experience/_components/ExperienceDetailHeader';
import { ExperienceDetailSummary } from '@/app/(pages)/experience/_components/ExperienceDetailSummary';
import { ExperienceDetailTags } from '@/app/(pages)/experience/_components/ExperienceDetailTags';
import {
  type ExperienceDetailSaveValue as ExperienceDetailSaveValueType,
  useExperienceDetailForm,
} from '@/app/(pages)/experience/_hooks/useExperienceDetailForm';
import { ErrorDialog } from '@/components/common/ErrorDialog';
import { cn } from '@/lib/utils';

export type { ExperienceDetailSaveValue } from '@/app/(pages)/experience/_hooks/useExperienceDetailForm';

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

  return (
    <div
      data-slot="experience-detail-content"
      className={cn('flex min-h-0 flex-1 flex-col', className)}
      {...props}
    >
      <div className={cn('flex flex-col', isPage ? 'gap-7' : 'gap-6')}>
        <ExperienceDetailHeader
          title={title}
          description={description}
          isEditing={isEditing}
          isSaving={isSaving}
          isPage={isPage}
          onTitleChange={updateTitle}
          onDescriptionChange={updateDescription}
          onEditClick={handleEditClick}
          onSaveClick={handleSaveEdit}
        />
        <ExperienceDetailSummary
          type={experience.type}
          basicDetail={basicDetail}
          periodLabel={periodLabel}
          isEditing={isEditing}
          isPage={isPage}
          datePickerOpen={datePickerOpen}
          datePickerTop={datePickerTop}
          datePickerRootRef={datePickerRootRef}
          datePickerButtonRef={datePickerButtonRef}
          selectedDateRange={selectedDateRange}
          onDatePickerToggle={toggleDatePicker}
          onDateRangeChange={handleDateRangeChange}
          onBasicDetailChange={updateBasicDetail}
        />
        <ExperienceDetailTags
          skillTags={skillTags}
          competencyTags={competencyTags}
          isEditing={isEditing}
          editingTagGroup={editingTagGroup}
          onSkillTagsChange={setSkillTags}
          onCompetencyTagsChange={setCompetencyTags}
          onEditingTagGroupChange={setEditingTagGroup}
        />
      </div>

      {!isEditing ? <div className="mt-4 h-px w-full shrink-0 bg-gray-300" /> : null}

      <ExperienceDetailFields
        detail={detail}
        isEditing={isEditing}
        isPage={isPage}
        onDetailChange={handleDetailChange}
      />
      <ErrorDialog
        open={errorMessage.length > 0}
        message={errorMessage}
        onOpenChange={handleErrorDialogOpenChange}
      />
    </div>
  );
}
