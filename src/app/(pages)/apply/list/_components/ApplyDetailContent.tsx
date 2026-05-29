'use client';

import Image from 'next/image';
import * as React from 'react';

import type { ApplyListItem } from '@/app/(pages)/apply/_constants/applyMockData';
import { copyToClipboard } from '@/app/(pages)/apply/_utils/copyToClipboard';
import { CalendarIcon } from '@/components/common/icons/CalendarIcon';
import { CopyIcon } from '@/components/common/icons/CopyIcon';
import { ExpandIcon } from '@/components/common/icons/ExpandIcon';
import { XIcon } from '@/components/common/icons/XIcon';
import { ToastMessage } from '@/components/ui/ToastMessage';
import {
  useApplyJobPostingResume,
  useUpdateApplyJobPostingResume,
} from '@/hooks/apply/useApplyJobPostings';
import { cn } from '@/lib/utils';

export interface ApplyDetailContentProps {
  item: ApplyListItem;
  variant?: 'panel' | 'page';
  onClose: () => void;
  onExpand?: () => void;
  onCollapseToPanel?: () => void;
}

export function ApplyDetailContent({
  item,
  variant = 'panel',
  onClose,
  onExpand,
  onCollapseToPanel,
}: ApplyDetailContentProps) {
  const isPage = variant === 'page';
  const [isEditing, setIsEditing] = React.useState(false);
  const [toastOpen, setToastOpen] = React.useState(false);
  const toastTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const [editableQuestions, setEditableQuestions] = React.useState(item.coverLetter);
  const resumeQuery = useApplyJobPostingResume(item.id, true);
  const updateResumeMutation = useUpdateApplyJobPostingResume();

  React.useEffect(() => {
    setIsEditing(false);
  }, [item.id]);

  React.useEffect(() => {
    setEditableQuestions(item.coverLetter);
  }, [item]);

  React.useEffect(() => {
    if (!resumeQuery.data) {
      return;
    }

    setEditableQuestions(
      resumeQuery.data.questions
        .sort((a, b) => a.orderNum - b.orderNum)
        .map((question) => ({
          label: question.content,
          answer: question.answer,
        })),
    );
  }, [item.id, resumeQuery.data]);

  React.useEffect(() => {
    return () => {
      if (toastTimerRef.current) {
        clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  const coverLetterQuestions = editableQuestions.map((question, index) => ({
    index: index + 1,
    label: question.label,
    answer: question.answer,
  }));

  const showCopyToast = () => {
    setToastOpen(true);

    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }

    toastTimerRef.current = setTimeout(() => {
      setToastOpen(false);
      toastTimerRef.current = null;
    }, 1600);
  };

  const handleCopy = async (answer: string) => {
    const copied = await copyToClipboard(answer);

    if (copied) {
      showCopyToast();
    }
  };

  const handleEditButtonClick = () => {
    if (!isEditing) {
      setIsEditing(true);
      return;
    }

    if (!resumeQuery.data) {
      setIsEditing(false);
      return;
    }

    updateResumeMutation.mutate(
      {
        jdId: item.id,
        request: {
          postingTitle: resumeQuery.data.postingTitle,
          companyName: resumeQuery.data.companyName,
          recruitmentField: resumeQuery.data.recruitmentField,
          startDate: normalizeLocalDateTimeString(resumeQuery.data.startDate),
          endDate: normalizeLocalDateTimeString(resumeQuery.data.endDate),
          questions: resumeQuery.data.questions
            .sort((a, b) => a.orderNum - b.orderNum)
            .map((question, index) => ({
              questionId: question.questionId,
              content: editableQuestions[index]?.label ?? question.content,
              answer: editableQuestions[index]?.answer ?? question.answer,
            })),
        },
      },
      {
        onSuccess: () => {
          setIsEditing(false);
        },
      },
    );
  };

  const handleHeaderExpandClick = () => {
    if (isPage) {
      onCollapseToPanel?.();
      return;
    }

    onExpand?.();
  };

  return (
    <>
      <div
        className={cn(
          'flex min-h-0 flex-1 flex-col gap-6',
          isPage ? 'px-8 pt-6' : 'px-6 pt-8',
        )}
      >
        <div className="flex shrink-0 flex-col gap-4">
          <div className="flex items-center justify-between pb-2">
            <button
              type="button"
              aria-label={isPage ? '패널 보기로 돌아가기' : '전체 화면으로 보기'}
              className="flex size-8 cursor-pointer items-center justify-center rounded-full text-gray-main hover:bg-gray-100"
              onClick={handleHeaderExpandClick}
            >
              <ExpandIcon className="size-6" />
            </button>

            <h2 className="text-xl font-extrabold leading-8 text-strong">지원 상세</h2>

            <button
              type="button"
              aria-label="닫기"
              className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full text-gray-main hover:bg-gray-100"
              onClick={onClose}
            >
              <XIcon className="size-6" />
            </button>
          </div>

          <div className="flex items-start justify-between gap-4">
            <div className="flex min-w-0 flex-1 flex-col gap-5">
              <h3 className="min-w-0 flex-1 text-2xl font-bold leading-9 text-strong">{item.title}</h3>

              <div className="flex items-center gap-5">
                <div className="flex w-20 shrink-0 flex-col items-center gap-0.5">
                  <Image
                    src="/career-selected.svg"
                    alt=""
                    width={64}
                    height={64}
                    className="size-16 shrink-0"
                  />
                </div>

                <div className="flex min-w-0 flex-col gap-1.5">
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-1">
                      <CalendarIcon className="size-5 text-strong" />
                      <span className="body-3-bold text-strong">모집 기간</span>
                    </div>
                    <span className="body-3-bold text-secondary">{item.period}</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-4">
                    <span className="body-3-bold text-strong">기업명</span>
                    <span className="body-3-bold text-secondary">{item.companyName}</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-4">
                    <span className="body-3-bold text-strong">모집 분야</span>
                    <span className="body-3-bold text-secondary">{item.jobField}</span>
                  </div>
                </div>
              </div>
            </div>

            <button
              type="button"
              className={cn(
                'inline-flex h-9 shrink-0 items-center justify-start gap-1 overflow-hidden rounded-lg px-2 py-0.5',
                isEditing ? 'bg-gray-main' : 'bg-gray-200',
              )}
              onClick={handleEditButtonClick}
            >
              <span
                className={cn(
                  'text-base font-bold leading-6',
                  isEditing ? 'text-white' : 'text-tertiary',
                )}
              >
                {isEditing ? '저장하기' : '수정하기'}
              </span>
            </button>
          </div>

          <div className={cn('h-px w-full bg-gray-300', !isPage && 'max-w-[452px]')} />
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto pb-6">
          <div className={cn('flex flex-col gap-3', !isPage && 'max-w-[452px]')}>
            {coverLetterQuestions.map((question) => (
              <QuestionBlock
                key={`${question.label}-${question.index}`}
                index={question.index}
                label={question.label}
                answer={question.answer}
                isPage={isPage}
                editable={isEditing}
                inputBackgroundClassName={isEditing ? 'bg-[#F5F5F5]' : 'bg-[#FFFFFF]'}
                onAnswerChange={(nextAnswer) =>
                  setEditableQuestions((prev) =>
                    prev.map((entry, entryIndex) =>
                      entryIndex === question.index - 1
                        ? { ...entry, answer: nextAnswer }
                        : entry,
                    ),
                  )
                }
                onCopy={() => void handleCopy(question.answer)}
              />
            ))}
          </div>
        </div>
      </div>

      <ToastMessage open={toastOpen} message="복사되었습니다" />
    </>
  );
}

function normalizeLocalDateTimeString(value: string) {
  const trimmed = value.trim();

  if (!trimmed) {
    return trimmed;
  }

  if (trimmed.includes('T')) {
    return trimmed;
  }

  return trimmed.replace(' ', 'T');
}

function QuestionBlock({
  index,
  label,
  answer,
  isPage = false,
  editable = false,
  inputBackgroundClassName,
  onAnswerChange,
  onCopy,
}: {
  index: number;
  label: string;
  answer: string;
  isPage?: boolean;
  editable?: boolean;
  inputBackgroundClassName?: string;
  onAnswerChange?: (value: string) => void;
  onCopy?: () => void;
}) {
  return (
    <div className={cn('flex w-full flex-col gap-1.5', !isPage && 'max-w-[452px]')}>
      <div className="flex items-center gap-1 px-2">
        <div className="flex min-w-0 flex-1 items-center gap-1">
          <span className="body-1-bold text-mint-300">Q{index}.</span>
          <span className="body-1-bold text-gray-800">{label}</span>
        </div>
        <button
          type="button"
          aria-label={`${label} 복사`}
          className="flex size-7 shrink-0 cursor-pointer items-center justify-center rounded text-gray-main outline-none transition-colors hover:bg-gray-100 focus-visible:shadow-focus-ring"
          onClick={(event) => {
            event.stopPropagation();
            onCopy?.();
          }}
        >
          <CopyIcon className="size-4" />
        </button>
      </div>
      <div
        className={cn(
          'flex min-h-36 flex-col gap-2 rounded-2xl px-3 py-4',
          inputBackgroundClassName ?? 'bg-[#FFFFFF]',
        )}
      >
        <textarea
          value={answer}
          readOnly={!editable}
          placeholder="여기에 자기소개서를 작성해보세요."
          className={cn(
            'h-full min-h-28 w-full resize-none bg-transparent body-3-bold text-gray-700 outline-none placeholder:text-tertiary',
            !editable && 'cursor-default',
          )}
          onChange={(event) => onAnswerChange?.(event.currentTarget.value)}
        />
      </div>
    </div>
  );
}
