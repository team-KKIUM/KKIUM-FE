'use client';

import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';

import {
  normalizeJobPostingAnalyzeErrorMessage,
  type CreateJdAiRequest,
  type ParsedJdUrlResponse,
} from '@/app/api/apply/types';
import {
  APPLY_COVER_LETTER_MAX_QUESTIONS,
  JOB_POSTING_BODY_MAX_LENGTH,
  JOB_POSTING_COVER_QUESTION_MAX_LENGTH,
  JOB_POSTING_MODAL_CONTENT_CLASS,
  JOB_POSTING_MODAL_URL_STEP_CONTENT_CLASS,
} from '@/app/(pages)/apply/_constants/applyConstants';
import { useApplyJobPostingStore } from '@/app/(pages)/apply/_stores/useApplyJobPostingStore';
import {
  limitJobPostingBodyText,
  limitJobPostingCoverQuestionText,
} from '@/app/(pages)/apply/_utils/limitJobPostingFieldText';
import { Modal } from '@/components/common/Modal';
import { PlusIcon } from '@/components/common/icons/PlusIcon';
import { type CalendarDateRange } from '@/components/common/RangeCalendar';
import { Button } from '@/components/ui/button';
import {
  useCreateApplyJobPostingWithAi,
  useParseApplyJobPostingOcr,
  useParseApplyJobPostingUrl,
} from '@/hooks/apply/useApplyJobPostings';
import { useJobPostingUrlField } from '@/hooks/apply/useJobPostingUrlField';
import { cn } from '@/lib/utils';

import {
  ApplyAddJobPostingEditStep,
  type CoverQuestionRow,
} from './ApplyAddJobPostingEditStep';
import { ApplyAddJobPostingUrlStep } from './ApplyAddJobPostingUrlStep';

function parseLocalDate(value: string) {
  const [datePart] = value.split('T');
  const [year, month, day] = datePart.split('-').map(Number);

  if (!year || !month || !day) {
    return null;
  }

  return new Date(year, month - 1, day);
}

function formatJdDate(date: Date, time = '00:00') {
  const [hours = 0, minutes = 0] = time.split(':').map(Number);
  const nextDate = new Date(date);
  nextDate.setHours(hours, minutes, 0, 0);

  return nextDate.toISOString();
}

function formatJobPostingPeriod(
  periodRange: CalendarDateRange | null,
  deadlineTime: string,
  noRecruitmentPeriod: boolean,
) {
  if (noRecruitmentPeriod || !periodRange) {
    return '상시 채용';
  }

  const formatDate = (date: Date) => {
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${date.getFullYear()}.${month}.${day}`;
  };

  const endTime = deadlineTime || '23:59';
  return `${formatDate(periodRange.start)}~${formatDate(periodRange.end)} ${endTime}`;
}

function parseRecruitmentFieldOptions(value: string) {
  const options: string[] = [];
  let current = '';
  let depth = 0;

  for (const char of value) {
    if (char === '(' || char === '（') {
      depth += 1;
      current += char;
      continue;
    }

    if (char === ')' || char === '）') {
      depth = Math.max(0, depth - 1);
      current += char;
      continue;
    }

    if ((char === ',' || char === '/') && depth === 0) {
      const normalized = current.trim();
      if (normalized) {
        options.push(normalized);
      }
      current = '';
      continue;
    }

    current += char;
  }

  const last = current.trim();
  if (last) {
    options.push(last);
  }

  return options.length > 0 ? Array.from(new Set(options)) : [value.trim()].filter(Boolean);
}

function createEmptyCoverQuestions(): CoverQuestionRow[] {
  return [{ id: 'cover-1', value: '' }];
}

export function ApplyAddJobPostingModal() {
  const router = useRouter();
  const setJobPosting = useApplyJobPostingStore((state) => state.setJobPosting);
  const { url, setUrl, validation, showError, markTouched, reset, maxLength } = useJobPostingUrlField();
  const parseJobPostingUrlMutation = useParseApplyJobPostingUrl();
  const parseJobPostingOcrMutation = useParseApplyJobPostingOcr();
  const createJobPostingMutation = useCreateApplyJobPostingWithAi();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<'url' | 'result' | 'manual'>('url');
  const [postingTitle, setPostingTitle] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [recruitmentField, setRecruitmentField] = useState('');
  const [recruitmentFieldOptions, setRecruitmentFieldOptions] = useState<string[]>([]);
  const [postingBody, setPostingBody] = useState('');
  const coverRowIdRef = useRef(1);
  const [coverQuestions, setCoverQuestions] = useState<CoverQuestionRow[]>(createEmptyCoverQuestions);
  const [periodRange, setPeriodRange] = useState<CalendarDateRange | null>(null);
  const [deadlineTime, setDeadlineTime] = useState('');
  const [noRecruitmentPeriod, setNoRecruitmentPeriod] = useState(false);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const errorId = 'apply-job-posting-url-error';
  const analyzeError =
    normalizeJobPostingAnalyzeErrorMessage(parseJobPostingUrlMutation.error) ??
    normalizeJobPostingAnalyzeErrorMessage(parseJobPostingOcrMutation.error);
  const saveError =
    createJobPostingMutation.error instanceof Error ? createJobPostingMutation.error.message : null;

  const resetEditFields = () => {
    coverRowIdRef.current = 1;
    setCoverQuestions(createEmptyCoverQuestions());
    setPeriodRange(null);
    setDeadlineTime('');
    setNoRecruitmentPeriod(false);
    setPostingTitle('');
    setCompanyName('');
    setRecruitmentField('');
    setRecruitmentFieldOptions([]);
    setPostingBody('');
  };

  const applyParsedJobPosting = (data: ParsedJdUrlResponse) => {
    const startDate = parseLocalDate(data.startDate);
    const endDate = parseLocalDate(data.endDate);
    const parsedQuestions = data.questions ?? [];

    setCompanyName(data.companyName);
    setPostingTitle(data.postingTitle);
    const parsedFieldOptions = parseRecruitmentFieldOptions(data.recruitmentField);
    setRecruitmentFieldOptions(parsedFieldOptions);
    setRecruitmentField(parsedFieldOptions[0] ?? data.recruitmentField);
    setPostingBody(limitJobPostingBodyText(data.content ?? ''));
    setCoverQuestions(
      parsedQuestions.length > 0
        ? parsedQuestions.slice(0, APPLY_COVER_LETTER_MAX_QUESTIONS).map((question, index) => ({
            id: `cover-${index + 1}`,
            value: limitJobPostingCoverQuestionText(question),
          }))
        : createEmptyCoverQuestions(),
    );
    coverRowIdRef.current = Math.max(
      Math.min(parsedQuestions.length, APPLY_COVER_LETTER_MAX_QUESTIONS),
      1,
    );

    if (startDate && endDate) {
      setPeriodRange({ start: startDate, end: endDate });
      setNoRecruitmentPeriod(false);
    } else {
      setPeriodRange(null);
      setNoRecruitmentPeriod(true);
    }

    setDeadlineTime('');
    setStep('result');
  };

  const resetForm = () => {
    reset();
    setStep('url');
    resetEditFields();
    setSelectedImageFile(null);
    parseJobPostingUrlMutation.reset();
    parseJobPostingOcrMutation.reset();
    createJobPostingMutation.reset();
  };

  const handleRequestManual = () => {
    resetEditFields();
    setSelectedImageFile(null);
    reset();
    setStep('manual');
  };

  const buildCreateJdAiRequest = (): CreateJdAiRequest => ({
    ...(validation.ok ? { url: validation.value } : {}),
    postingTitle: postingTitle.trim(),
    companyName: companyName.trim(),
    recruitmentField: recruitmentField.trim(),
    startDate: !noRecruitmentPeriod && periodRange ? formatJdDate(periodRange.start) : '',
    endDate:
      !noRecruitmentPeriod && periodRange
        ? formatJdDate(periodRange.end, deadlineTime || '23:59')
        : '',
    questions: coverQuestions
      .map((question) => limitJobPostingCoverQuestionText(question.value.trim()))
      .filter(Boolean)
      .slice(0, APPLY_COVER_LETTER_MAX_QUESTIONS),
    content: limitJobPostingBodyText(postingBody.trim()),
  });

  const isWithinFieldLimits =
    postingBody.length <= JOB_POSTING_BODY_MAX_LENGTH &&
    coverQuestions.every((question) => question.value.length <= JOB_POSTING_COVER_QUESTION_MAX_LENGTH) &&
    coverQuestions.length <= APPLY_COVER_LETTER_MAX_QUESTIONS;

  return (
    <Modal
      open={open}
      showCloseButton
      contentClassName={
        step === 'url' ? JOB_POSTING_MODAL_URL_STEP_CONTENT_CLASS : JOB_POSTING_MODAL_CONTENT_CLASS
      }
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);

        if (!nextOpen) {
          resetForm();
        }
      }}
      trigger={
        <Button type="button" variant="default" size="default" leftIcon={<PlusIcon />}>
          지원 추가
        </Button>
      }
    >
      <div
        className={cn(
          step === 'url'
            ? 'flex flex-col'
            : 'flex min-h-0 flex-1 flex-col overflow-hidden',
        )}
      >
        {step === 'url' ? (
          <ApplyAddJobPostingUrlStep
            url={url}
            setUrl={setUrl}
            validation={validation}
            showError={showError}
            markTouched={markTouched}
            maxLength={maxLength}
            errorId={errorId}
            onRequestManual={handleRequestManual}
            canAnalyze={validation.ok}
            isAnalyzing={parseJobPostingUrlMutation.isPending}
            isOcrAnalyzing={parseJobPostingOcrMutation.isPending}
            analyzeError={analyzeError}
            onImageFileChange={setSelectedImageFile}
            onAnalyze={() => {
              if (selectedImageFile) {
                parseJobPostingOcrMutation.mutate(selectedImageFile, {
                  onSuccess: ({ text }) => {
                    setPostingBody(limitJobPostingBodyText(text));
                    setStep('result');
                  },
                });
                return;
              }

              if (!validation.ok) {
                markTouched();
                return;
              }

              parseJobPostingUrlMutation.mutate(
                { linkUrl: validation.value },
                {
                  onSuccess: applyParsedJobPosting,
                },
              );
            }}
          />
        ) : (
          <ApplyAddJobPostingEditStep
            step={step}
            onBack={() => setStep('url')}
            onRequestManual={step === 'result' ? handleRequestManual : undefined}
            postingTitle={postingTitle}
            onPostingTitleChange={setPostingTitle}
            companyName={companyName}
            onCompanyNameChange={setCompanyName}
            recruitmentField={recruitmentField}
            recruitmentFieldOptions={recruitmentFieldOptions}
            onRecruitmentFieldChange={setRecruitmentField}
            postingBody={postingBody}
            onPostingBodyChange={(value) => setPostingBody(limitJobPostingBodyText(value))}
            periodRange={periodRange}
            onPeriodRangeChange={setPeriodRange}
            deadlineTime={deadlineTime}
            onDeadlineTimeChange={setDeadlineTime}
            noRecruitmentPeriod={noRecruitmentPeriod}
            onNoRecruitmentPeriodChange={setNoRecruitmentPeriod}
            coverQuestions={coverQuestions}
            onCoverQuestionChange={(id, value) =>
              setCoverQuestions((prev) =>
                prev.map((row) =>
                  row.id === id ? { ...row, value: limitJobPostingCoverQuestionText(value) } : row,
                ),
              )
            }
            onRemoveCoverQuestion={(id) =>
              setCoverQuestions((prev) => prev.filter((row) => row.id !== id))
            }
            onAddCoverQuestion={() =>
              setCoverQuestions((prev) => {
                if (prev.length >= APPLY_COVER_LETTER_MAX_QUESTIONS) {
                  return prev;
                }

                coverRowIdRef.current += 1;
                return [...prev, { id: `cover-${coverRowIdRef.current}`, value: '' }];
              })
            }
            isSaving={createJobPostingMutation.isPending}
            saveError={saveError}
            onSave={() => {
              const hasRequiredTextFields =
                postingTitle.trim().length > 0 &&
                companyName.trim().length > 0 &&
                recruitmentField.trim().length > 0 &&
                postingBody.trim().length > 0;
              const hasAllCoverQuestions =
                coverQuestions.length > 0 &&
                coverQuestions.every((question) => question.value.trim().length > 0);

              if (!hasRequiredTextFields || !hasAllCoverQuestions || !isWithinFieldLimits) {
                return;
              }

              const request = buildCreateJdAiRequest();

              createJobPostingMutation.mutate(request, {
                onSuccess: (response) => {
                  const jdId = String(response.jdId);

                  setJobPosting({
                    jdId,
                    title: request.postingTitle ?? '',
                    companyName: request.companyName ?? '',
                    jobField: request.recruitmentField ?? '',
                    period: formatJobPostingPeriod(periodRange, deadlineTime, noRecruitmentPeriod),
                  });

                  resetForm();
                  setOpen(false);
                  router.push(`/apply?jdId=${encodeURIComponent(jdId)}`);
                },
              });
            }}
          />
        )}
      </div>
    </Modal>
  );
}
