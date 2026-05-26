'use client';

import { ChevronDownIcon } from 'lucide-react';

import {
  JOB_EDIT_STEP_HEADER,
  RESULT_RECRUITMENT_FIELD_OPTIONS,
} from '@/app/(pages)/apply/_constants/applyMockData';
import { ModalDescription, ModalTitle } from '@/components/common/Modal';
import { PlusIcon } from '@/components/common/icons/PlusIcon';
import { XIcon } from '@/components/common/icons/XIcon';
import { RecruitmentDeadlineFields } from '@/components/common/RecruitmentDeadlineFields';
import { type CalendarDateRange } from '@/components/common/RangeCalendar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

export type CoverQuestionRow = { id: string; value: string };

export interface ApplyAddJobPostingEditStepProps {
  step: 'result' | 'manual';
  postingTitle: string;
  onPostingTitleChange: (value: string) => void;
  companyName: string;
  onCompanyNameChange: (value: string) => void;
  recruitmentField: string;
  recruitmentFieldOptions?: readonly string[];
  onRecruitmentFieldChange: (value: string) => void;
  postingBody: string;
  onPostingBodyChange: (value: string) => void;
  periodRange: CalendarDateRange | null;
  onPeriodRangeChange: (range: CalendarDateRange | null) => void;
  deadlineTime: string;
  onDeadlineTimeChange: (value: string) => void;
  noRecruitmentPeriod: boolean;
  onNoRecruitmentPeriodChange: (value: boolean) => void;
  coverQuestions: CoverQuestionRow[];
  onCoverQuestionChange: (id: string, value: string) => void;
  onRemoveCoverQuestion: (id: string) => void;
  onAddCoverQuestion: () => void;
  onSave: () => void;
  isSaving?: boolean;
  saveError?: string | null;
}

function LabeledField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex w-full flex-col gap-4">
      <p className="title-2-bold text-strong">{label}</p>
      {children}
    </div>
  );
}

export function ApplyAddJobPostingEditStep({
  step,
  postingTitle,
  onPostingTitleChange,
  companyName,
  onCompanyNameChange,
  recruitmentField,
  recruitmentFieldOptions = RESULT_RECRUITMENT_FIELD_OPTIONS,
  onRecruitmentFieldChange,
  postingBody,
  onPostingBodyChange,
  periodRange,
  onPeriodRangeChange,
  deadlineTime,
  onDeadlineTimeChange,
  noRecruitmentPeriod,
  onNoRecruitmentPeriodChange,
  coverQuestions,
  onCoverQuestionChange,
  onRemoveCoverQuestion,
  onAddCoverQuestion,
  onSave,
  isSaving = false,
  saveError,
}: ApplyAddJobPostingEditStepProps) {
  return (
    <>
      <div className="flex w-full min-w-0 items-start justify-between pr-10">
        <div className="flex min-w-0 flex-col gap-0.5">
          <ModalTitle className="text-strong">{JOB_EDIT_STEP_HEADER[step].title}</ModalTitle>
          <ModalDescription>{JOB_EDIT_STEP_HEADER[step].description}</ModalDescription>
        </div>
      </div>

      <div className="flex w-full flex-col gap-6">
        <LabeledField label="공고 제목">
          <Input
            value={postingTitle}
            onChange={(e) => onPostingTitleChange(e.target.value)}
            placeholder="공고 제목을 입력해주세요."
          />
        </LabeledField>

        <LabeledField label="기업명">
          <Input
            value={companyName}
            onChange={(e) => onCompanyNameChange(e.target.value)}
            placeholder="기업명을 입력해주세요."
            autoComplete="organization"
          />
        </LabeledField>

        <LabeledField label="모집 분야">
          {step === 'result' ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  aria-haspopup="listbox"
                  className={cn(
                    'flex h-[54px] w-full min-w-0 items-center justify-between gap-2 rounded-lg border-[1.5px] border-border-bold bg-background-w px-4 text-left outline-none transition-colors',
                    'body-2-regular focus-visible:border-mint-main focus-visible:bg-mint-50/40 data-[state=open]:border-mint-main data-[state=open]:bg-mint-50/40',
                  )}
                >
                  <span
                    className={cn(
                      'min-w-0 flex-1 truncate',
                      recruitmentField ? 'text-strong' : 'text-quaternary',
                    )}
                  >
                    {recruitmentField || '모집 분야를 선택해주세요.'}
                  </span>
                  <ChevronDownIcon className="size-5 shrink-0 text-quaternary" aria-hidden />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                sideOffset={4}
                className="max-h-60 w-(--radix-dropdown-menu-trigger-width) min-w-(--radix-dropdown-menu-trigger-width) overflow-y-auto p-0"
              >
                {recruitmentFieldOptions.map((option) => (
                  <DropdownMenuItem
                    key={option}
                    className={cn(
                      'min-h-10 border-b border-border-bold last:border-b-0',
                      recruitmentField === option && 'bg-gray-100',
                    )}
                    onSelect={() => onRecruitmentFieldChange(option)}
                  >
                    <span>{option}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Input
              value={recruitmentField}
              onChange={(e) => onRecruitmentFieldChange(e.target.value)}
              placeholder="모집 분야를 입력해주세요."
            />
          )}
        </LabeledField>

        <RecruitmentDeadlineFields
          periodRange={periodRange}
          onPeriodRangeChange={onPeriodRangeChange}
          deadlineTime={deadlineTime}
          onDeadlineTimeChange={onDeadlineTimeChange}
          noRecruitmentPeriod={noRecruitmentPeriod}
          onNoRecruitmentPeriodChange={onNoRecruitmentPeriodChange}
        />

        <LabeledField label="공고 본문">
          <Textarea
            value={postingBody}
            onChange={(e) => onPostingBodyChange(e.target.value)}
            className="min-h-36 resize-y"
          />
        </LabeledField>

        <div className="flex w-full flex-col gap-4">
          <p className="title-2-bold text-strong">자기소개서 문항 입력</p>
          <div className="flex flex-col gap-1.5">
            {coverQuestions.map((row, index) => (
              <div key={row.id} className="inline-flex w-full min-w-0 items-center gap-2.5">
                {index > 0 ? (
                  <button
                    type="button"
                    aria-label={`${index + 1}번 문항 삭제`}
                    className="flex size-7 shrink-0 items-center justify-center rounded bg-background-w text-tertiary outline-none transition-colors hover:bg-gray-100 focus-visible:shadow-focus-ring"
                    onClick={() => onRemoveCoverQuestion(row.id)}
                  >
                    <XIcon className="size-4" />
                  </button>
                ) : null}
                <Input
                  className="min-w-0 flex-1"
                  value={row.value}
                  onChange={(e) => onCoverQuestionChange(row.id, e.target.value)}
                  placeholder={`${index + 1}번 문항`}
                  aria-label={`${index + 1}번 문항`}
                />
              </div>
            ))}
          </div>
          <button
            type="button"
            className="inline-flex h-10 w-full shrink-0 items-center justify-center gap-1 overflow-hidden rounded-lg bg-gray-200 px-3 py-1 body-1-bold text-tertiary outline-none transition-colors hover:bg-gray-300 focus-visible:shadow-focus-ring"
            onClick={onAddCoverQuestion}
          >
            <span className="flex size-8 shrink-0 items-center justify-center">
              <PlusIcon className="size-5 text-tertiary" />
            </span>
            추가하기
          </button>
        </div>
      </div>

      {saveError ? (
        <p className="body-3-regular text-red-700" role="alert">
          {saveError}
        </p>
      ) : null}

      <Button
        type="button"
        variant="default"
        size="default"
        disabled={isSaving}
        className="w-full text-base font-bold leading-6"
        onClick={onSave}
      >
        {isSaving ? '저장 중...' : '저장하기'}
      </Button>
    </>
  );
}
