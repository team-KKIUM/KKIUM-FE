'use client';

import * as React from 'react';

import { APPLY_COVER_LETTER_MAX_QUESTIONS } from '../../_constants/applyMockData';
import { ArrowRightIcon } from '@/components/common/icons/ArrowRightIcon';
import { PlusIcon } from '@/components/common/icons/PlusIcon';
import { cn } from '@/lib/utils';

export interface ApplyCoverLetterQuestionNavProps {
  questionCount: number;
  activeIndex: number;
  onActiveIndexChange: (index: number) => void;
  onAddQuestion: () => void;
  className?: string;
}

export function ApplyCoverLetterQuestionNav({
  questionCount,
  activeIndex,
  onActiveIndexChange,
  onAddQuestion,
  className,
}: ApplyCoverLetterQuestionNavProps) {
  const questionIndices = React.useMemo(
    () => Array.from({ length: questionCount }, (_, index) => index),
    [questionCount],
  );
  const canAddQuestion = questionCount < APPLY_COVER_LETTER_MAX_QUESTIONS;

  return (
    <div
      data-slot="cover-letter-question-nav"
      className={cn('inline-flex items-center gap-4', className)}
    >
      <div className="flex items-center gap-2">
        {questionIndices.map((index) => (
          <React.Fragment key={index}>
            {index > 0 ? (
              <span
                className="flex size-8 shrink-0 items-center justify-center"
                aria-hidden="true"
              >
                <ArrowRightIcon className="size-6 text-gray-400" />
              </span>
            ) : null}

            <button
              type="button"
              aria-label={`${index + 1}번 문항`}
              aria-current={index === activeIndex ? 'step' : undefined}
              onClick={() => onActiveIndexChange(index)}
              className={cn(
                'flex h-10 w-12 shrink-0 items-center justify-center rounded-base px-3 py-1 body-1-bold transition-colors outline-none focus-visible:shadow-focus-ring',
                index === activeIndex
                  ? 'bg-brand text-strong outline-1 -outline-offset-1 outline-brand'
                  : 'bg-gray-300 text-gray-600 hover:bg-gray-200',
              )}
            >
              Q{index + 1}
            </button>
          </React.Fragment>
        ))}
      </div>

      {canAddQuestion ? (
        <button
          type="button"
          aria-label="문항 추가"
          onClick={onAddQuestion}
          className="flex size-8 shrink-0 items-center justify-center rounded outline-none transition-colors hover:bg-gray-100 focus-visible:shadow-focus-ring"
        >
          <PlusIcon className="size-6 text-secondary" />
        </button>
      ) : null}
    </div>
  );
}
