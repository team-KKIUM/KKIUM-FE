'use client';

import { useRef, useState } from 'react';

import type { CreateJdAiRequest, ParsedJdUrlResponse } from '@/app/api/apply/types';
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

export function ApplyAddJobPostingModal() {
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
  const [coverQuestions, setCoverQuestions] = useState<CoverQuestionRow[]>([
    { id: 'cover-1', value: '' },
  ]);
  const [periodRange, setPeriodRange] = useState<CalendarDateRange | null>(null);
  const [deadlineTime, setDeadlineTime] = useState('');
  const [noRecruitmentPeriod, setNoRecruitmentPeriod] = useState(false);
  const errorId = 'apply-job-posting-url-error';
  const analyzeError =
    (parseJobPostingUrlMutation.error instanceof Error
      ? parseJobPostingUrlMutation.error.message
      : null) ??
    (parseJobPostingOcrMutation.error instanceof Error
      ? parseJobPostingOcrMutation.error.message
      : null);
  const saveError =
    createJobPostingMutation.error instanceof Error ? createJobPostingMutation.error.message : null;

  const applyParsedJobPosting = (data: ParsedJdUrlResponse) => {
    const startDate = parseLocalDate(data.startDate);
    const endDate = parseLocalDate(data.endDate);
    const parsedQuestions = data.questions ?? [];

    setCompanyName(data.companyName);
    setPostingTitle(data.postingTitle);
    const parsedFieldOptions = parseRecruitmentFieldOptions(data.recruitmentField);
    setRecruitmentFieldOptions(parsedFieldOptions);
    setRecruitmentField(parsedFieldOptions[0] ?? data.recruitmentField);
    setPostingBody(data.content);
    setCoverQuestions(
      parsedQuestions.length > 0
        ? parsedQuestions.map((question, index) => ({
            id: `cover-${index + 1}`,
            value: question,
          }))
        : [{ id: 'cover-1', value: '' }],
    );
    coverRowIdRef.current = Math.max(parsedQuestions.length, 1);

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
    coverRowIdRef.current = 1;
    setCoverQuestions([{ id: 'cover-1', value: '' }]);
    setPeriodRange(null);
    setDeadlineTime('');
    setNoRecruitmentPeriod(false);
    setPostingTitle('');
    setCompanyName('');
    setRecruitmentField('');
    setRecruitmentFieldOptions([]);
    setPostingBody('');
    parseJobPostingUrlMutation.reset();
    parseJobPostingOcrMutation.reset();
    createJobPostingMutation.reset();
  };

  const buildCreateJdAiRequest = (): CreateJdAiRequest => ({
    url: validation.ok ? validation.value : url.trim(),
    postingTitle: postingTitle.trim(),
    companyName: companyName.trim(),
    recruitmentField: recruitmentField.trim(),
    startDate: !noRecruitmentPeriod && periodRange ? formatJdDate(periodRange.start) : '',
    endDate:
      !noRecruitmentPeriod && periodRange
        ? formatJdDate(periodRange.end, deadlineTime || '23:59')
        : '',
    questions: coverQuestions.map((question) => question.value.trim()).filter(Boolean),
    content: postingBody.trim(),
  });

  return (
    <Modal
      open={open}
      showCloseButton
      onOpenChange={(open) => {
        setOpen(open);

        if (!open) {
          resetForm();
        }
      }}
      trigger={
        <Button type="button" variant="default" size="default" leftIcon={<PlusIcon />}>
          지원 추가
        </Button>
      }
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
          onRequestManual={() => setStep('manual')}
          canAnalyze={validation.ok}
          isAnalyzing={parseJobPostingUrlMutation.isPending}
          isOcrAnalyzing={parseJobPostingOcrMutation.isPending}
          analyzeError={analyzeError}
          onImageFileSelected={(file) => {
            parseJobPostingOcrMutation.mutate(file, {
              onSuccess: ({ text }) => {
                setPostingBody(text);
              },
            });
          }}
          onAnalyze={() => {
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
          postingTitle={postingTitle}
          onPostingTitleChange={setPostingTitle}
          companyName={companyName}
          onCompanyNameChange={setCompanyName}
          recruitmentField={recruitmentField}
          recruitmentFieldOptions={recruitmentFieldOptions}
          onRecruitmentFieldChange={setRecruitmentField}
          postingBody={postingBody}
          onPostingBodyChange={setPostingBody}
          periodRange={periodRange}
          onPeriodRangeChange={setPeriodRange}
          deadlineTime={deadlineTime}
          onDeadlineTimeChange={setDeadlineTime}
          noRecruitmentPeriod={noRecruitmentPeriod}
          onNoRecruitmentPeriodChange={setNoRecruitmentPeriod}
          coverQuestions={coverQuestions}
          onCoverQuestionChange={(id, value) =>
            setCoverQuestions((prev) => prev.map((r) => (r.id === id ? { ...r, value } : r)))
          }
          onRemoveCoverQuestion={(id) =>
            setCoverQuestions((prev) => prev.filter((r) => r.id !== id))
          }
          onAddCoverQuestion={() =>
            setCoverQuestions((prev) => {
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
            if (!hasRequiredTextFields || !hasAllCoverQuestions) {
              return;
            }

            createJobPostingMutation.mutate(buildCreateJdAiRequest(), {
              onSuccess: () => {
                resetForm();
                setOpen(false);
              },
            });
          }}
        />
      )}
    </Modal>
  );
}
