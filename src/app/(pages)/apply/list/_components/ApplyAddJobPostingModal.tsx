'use client';

import { useRef, useState } from 'react';

import { JOB_POSTING_ANALYSIS_MOCK } from '@/app/(pages)/apply/list/_constants/addJobPostingModalMock';
import { Modal } from '@/components/common/Modal';
import { PlusIcon } from '@/components/common/icons/PlusIcon';
import { type CalendarDateRange } from '@/components/common/RangeCalendar';
import { Button } from '@/components/ui/button';
import { useJobPostingUrlField } from '@/hooks/apply/useJobPostingUrlField';

import {
  ApplyAddJobPostingEditStep,
  type CoverQuestionRow,
} from './ApplyAddJobPostingEditStep';
import { ApplyAddJobPostingUrlStep } from './ApplyAddJobPostingUrlStep';

export function ApplyAddJobPostingModal() {
  const { url, setUrl, validation, showError, markTouched, reset, maxLength } = useJobPostingUrlField();
  const [step, setStep] = useState<'url' | 'result' | 'manual'>('url');
  const [companyName, setCompanyName] = useState('');
  const [recruitmentField, setRecruitmentField] = useState('');
  const [postingBody, setPostingBody] = useState('');
  const coverRowIdRef = useRef(1);
  const [coverQuestions, setCoverQuestions] = useState<CoverQuestionRow[]>([
    { id: 'cover-1', value: '' },
  ]);
  const [periodRange, setPeriodRange] = useState<CalendarDateRange | null>(null);
  const [deadlineTime, setDeadlineTime] = useState('');
  const [noRecruitmentPeriod, setNoRecruitmentPeriod] = useState(false);
  const errorId = 'apply-job-posting-url-error';

  return (
    <Modal
      showCloseButton
      onOpenChange={(open) => {
        if (!open) {
          reset();
          setStep('url');
          coverRowIdRef.current = 1;
          setCoverQuestions([{ id: 'cover-1', value: '' }]);
          setPeriodRange(null);
          setDeadlineTime('');
          setNoRecruitmentPeriod(false);
          setCompanyName('');
          setRecruitmentField('');
          setPostingBody('');
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
          onAnalyze={() => {
            setCompanyName(JOB_POSTING_ANALYSIS_MOCK.companyName);
            setRecruitmentField(JOB_POSTING_ANALYSIS_MOCK.field);
            setPostingBody('');
            setStep('result');
          }}
        />
      ) : (
        <ApplyAddJobPostingEditStep
          step={step}
          companyName={companyName}
          onCompanyNameChange={setCompanyName}
          recruitmentField={recruitmentField}
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
        />
      )}
    </Modal>
  );
}
