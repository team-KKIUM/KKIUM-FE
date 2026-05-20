'use client';

import { ModalDescription, ModalTitle } from '@/components/common/Modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import type { JobPostingUrlValidation } from '@/hooks/apply/useJobPostingUrlField';

export interface ApplyAddJobPostingUrlStepProps {
  url: string;
  setUrl: (value: string) => void;
  validation: JobPostingUrlValidation;
  showError: boolean;
  markTouched: () => void;
  maxLength: number;
  errorId: string;
  onRequestManual: () => void;
  onAnalyze: () => void;
  canAnalyze: boolean;
}

export function ApplyAddJobPostingUrlStep({
  url,
  setUrl,
  validation,
  showError,
  markTouched,
  maxLength,
  errorId,
  onRequestManual,
  onAnalyze,
  canAnalyze,
}: ApplyAddJobPostingUrlStepProps) {
  return (
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
            onClick={onRequestManual}
          >
            공고 직접 등록하기
          </button>
        </div>
      </div>

      <Button
        type="button"
        variant="default"
        size="default"
        disabled={!canAnalyze}
        className="w-full text-xs font-bold leading-5"
        onClick={onAnalyze}
      >
        공고 분석하기
      </Button>
    </>
  );
}
