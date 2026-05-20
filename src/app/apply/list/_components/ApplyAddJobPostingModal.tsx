'use client';

import { useRef, useState } from 'react';
import { ChevronDownIcon } from 'lucide-react';

import { Modal, ModalClose, ModalDescription, ModalTitle } from '@/components/common/Modal';
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
import { useJobPostingUrlField } from '@/hooks/apply/useJobPostingUrlField';

const MOCK_ANALYSIS = {
  companyName: '토스플레이스',
  field: 'Server Developer',
} as const;

//mock data
const RESULT_RECRUITMENT_FIELD_OPTIONS = [
  MOCK_ANALYSIS.field,
  'Frontend Developer',
  'Full Stack Developer',
  'Mobile Developer',
  'Data Engineer',
] as const;

const JOB_EDIT_HEADER: Record<'result' | 'manual', { title: string; description: string }> = {
  result: {
    title: '분석 결과 확인하기',
    description: '등록한 공고 결과를 확인해주세요.',
  },
  manual: {
    title: '공고 등록',
    description: '새로운 공고를 등록해주세요.',
  },
};

type CoverQuestionRow = { id: string; value: string };

function LabeledField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex w-full flex-col gap-4">
      <p className="title-2-bold text-strong">{label}</p>
      {children}
    </div>
  );
}

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
        <>
          <div className="flex w-full min-w-0 items-start justify-between pr-10">
            <div className="flex min-w-0 flex-col gap-0.5">
              <ModalTitle className="text-strong">공고 등록</ModalTitle>
              <ModalDescription>지원하고 싶은 기업의 공고 링크를 입력해주세요</ModalDescription>
            </div>
          </div>

          <div className="flex w-full flex-col gap-6">
            <div className="flex w-full flex-col gap-4">
              <label htmlFor="apply-job-posting-url" className="title-2-bold text-strong">
                공고 링크
              </label>
              <div className="flex flex-col gap-1.5">
                <Input
                  id="apply-job-posting-url"
                  type="url"
                  inputMode="url"
                  name="jobPostingUrl"
                  autoComplete="url"
                  value={url}
                  maxLength={maxLength}
                  aria-invalid={showError}
                  aria-describedby={showError ? errorId : undefined}
                  onChange={(e) => setUrl(e.target.value)}
                  onBlur={markTouched}
                  placeholder="링크를 입력해주세요"
                />
                {showError && !validation.ok ? (
                  <p id={errorId} className="body-3-regular text-red-700" role="alert">
                    {validation.error}
                  </p>
                ) : null}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="body-1-bold text-quaternary">공고 링크가 없나요?</span>
              <button
                type="button"
                className="body-1-bold text-secondary underline underline-offset-4 hover:text-strong"
                onClick={() => setStep('manual')}
              >
                공고 직접 등록하기
              </button>
            </div>
          </div>

          <Button
            type="button"
            variant="default"
            size="default"
            disabled={!validation.ok}
            className="w-full text-xs font-bold leading-5"
            onClick={() => {
              setCompanyName(MOCK_ANALYSIS.companyName);
              setRecruitmentField(MOCK_ANALYSIS.field);
              setPostingBody('');
              setStep('result');
            }}
          >
            공고 분석하기
          </Button>
        </>
      ) : (
        <>
          <div className="flex w-full min-w-0 items-start justify-between pr-10">
            <div className="flex min-w-0 flex-col gap-0.5">
              <ModalTitle className="text-strong">{JOB_EDIT_HEADER[step].title}</ModalTitle>
              <ModalDescription>{JOB_EDIT_HEADER[step].description}</ModalDescription>
            </div>
          </div>

          <div className="flex w-full flex-col gap-6">
            <LabeledField label="기업명">
              <Input
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
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
                    {RESULT_RECRUITMENT_FIELD_OPTIONS.map((option) => (
                      <DropdownMenuItem
                        key={option}
                        className={cn(
                          'min-h-10 border-b border-border-bold last:border-b-0',
                          recruitmentField === option && 'bg-gray-100',
                        )}
                        onSelect={() => setRecruitmentField(option)}
                      >
                        <span>{option}</span>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Input
                  value={recruitmentField}
                  onChange={(e) => setRecruitmentField(e.target.value)}
                  placeholder="모집 분야를 입력해주세요."
                />
              )}
            </LabeledField>

            <RecruitmentDeadlineFields
              periodRange={periodRange}
              onPeriodRangeChange={setPeriodRange}
              deadlineTime={deadlineTime}
              onDeadlineTimeChange={setDeadlineTime}
              noRecruitmentPeriod={noRecruitmentPeriod}
              onNoRecruitmentPeriodChange={setNoRecruitmentPeriod}
            />

            <LabeledField label="공고 본문">
              <Textarea
                value={postingBody}
                onChange={(e) => setPostingBody(e.target.value)}
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
                        onClick={() =>
                          setCoverQuestions((prev) => prev.filter((r) => r.id !== row.id))
                        }
                      >
                        <XIcon className="size-4" />
                      </button>
                    ) : null}
                    <Input
                      className="min-w-0 flex-1"
                      value={row.value}
                      onChange={(e) =>
                        setCoverQuestions((prev) =>
                          prev.map((r) => (r.id === row.id ? { ...r, value: e.target.value } : r)),
                        )
                      }
                      placeholder={`${index + 1}번 문항`}
                      aria-label={`${index + 1}번 문항`}
                    />
                  </div>
                ))}
              </div>
              <button
                type="button"
                className="inline-flex h-10 w-full shrink-0 items-center justify-center gap-1 overflow-hidden rounded-lg bg-gray-200 px-3 py-1 body-1-bold text-tertiary outline-none transition-colors hover:bg-gray-300 focus-visible:shadow-focus-ring"
                onClick={() =>
                  setCoverQuestions((prev) => {
                    coverRowIdRef.current += 1;
                    return [...prev, { id: `cover-${coverRowIdRef.current}`, value: '' }];
                  })
                }
              >
                <span className="flex size-8 shrink-0 items-center justify-center">
                  <PlusIcon className="size-6 text-tertiary" />
                </span>
                추가하기
              </button>
            </div>
          </div>

          <ModalClose asChild>
            <Button type="button" variant="default" size="default" className="w-full text-xs font-bold leading-5">
              저장하기
            </Button>
          </ModalClose>
        </>
      )}
    </Modal>
  );
}
