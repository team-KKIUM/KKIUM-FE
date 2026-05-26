'use client';

import Image from 'next/image';
import * as React from 'react';

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

import type { ApplyListItem } from '@/app/(pages)/apply/_constants/applyMockData';

export interface ApplyDetailSidebarProps {
  open: boolean;
  item: ApplyListItem | null;
  onClose: () => void;
}

export function ApplyDetailSidebar({ open, item, onClose }: ApplyDetailSidebarProps) {
  const [panelVisible, setPanelVisible] = React.useState(false);
  const [expanded, setExpanded] = React.useState(false);
  const [isEditing, setIsEditing] = React.useState(false);
  const [toastOpen, setToastOpen] = React.useState(false);
  const toastTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const [editableQuestions, setEditableQuestions] = React.useState(item?.coverLetter ?? []);
  const resumeQuery = useApplyJobPostingResume(item?.id ?? null, open && item != null);
  const updateResumeMutation = useUpdateApplyJobPostingResume();

  React.useEffect(() => {
    if (open) {
      setPanelVisible(false);
      let secondFrame = 0;
      const firstFrame = window.requestAnimationFrame(() => {
        secondFrame = window.requestAnimationFrame(() => setPanelVisible(true));
      });

      return () => {
        window.cancelAnimationFrame(firstFrame);
        window.cancelAnimationFrame(secondFrame);
      };
    }

    setPanelVisible(false);
  }, [open]);

  React.useEffect(() => {
    if (!open) {
      return;
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose();
      }
    }

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  React.useEffect(() => {
    if (!item) {
      setExpanded(false);
      setIsEditing(false);
    }
  }, [item]);

  React.useEffect(() => {
    setEditableQuestions(item?.coverLetter ?? []);
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
  }, [open, item?.id, resumeQuery.data, resumeQuery.status]);

  React.useEffect(() => {
    return () => {
      if (toastTimerRef.current) {
        clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  if (!item) {
    return null;
  }

  const coverLetterQuestions = editableQuestions.map((question, index) => ({
    index: index + 1,
    label: question.label,
    answer: question.answer,
  }));

  const handleCopy = async (answer: string) => {
    if (!answer) {
      return;
    }

    try {
      await navigator.clipboard.writeText(answer);
      setToastOpen(true);

      if (toastTimerRef.current) {
        clearTimeout(toastTimerRef.current);
      }

      toastTimerRef.current = setTimeout(() => {
        setToastOpen(false);
        toastTimerRef.current = null;
      }, 1600);
    } catch {
    }
  };

  const handleEditButtonClick = () => {
    if (!isEditing) {
      setIsEditing(true);
      return;
    }

    if (!item || !resumeQuery.data) {
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
          startDate: resumeQuery.data.startDate,
          endDate: resumeQuery.data.endDate,
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

  return (
    <>
      <button
        type="button"
        aria-label="사이드바 닫기"
        className={cn(
          'fixed inset-0 z-40 bg-transparent',
          open ? 'pointer-events-auto' : 'pointer-events-none',
        )}
        onClick={onClose}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="apply-detail-heading"
        className={cn(
          'fixed z-50 flex flex-col overflow-hidden shadow-xl transform-gpu',
          expanded
            ? 'top-0 right-0 h-screen w-[calc(100vw-var(--app-sidebar-width))] rounded-none bg-[#FAFAFA]'
            : 'top-0 right-0 h-screen w-[500px] bg-background-w',
          'shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.10)]',
          'will-change-transform',
        )}
        style={{
          transform: panelVisible ? 'translate3d(0, 0, 0)' : 'translate3d(100%, 0, 0)',
          transition:
            'transform 520ms cubic-bezier(0.22, 1, 0.36, 1), width 520ms cubic-bezier(0.22, 1, 0.36, 1), border-radius 520ms cubic-bezier(0.22, 1, 0.36, 1), background-color 520ms cubic-bezier(0.22, 1, 0.36, 1)',
        }}
      >
        <div className={cn('flex min-h-0 flex-1 flex-col gap-6 px-6 pt-8', expanded && 'px-8 pt-6')}>
          <div className="flex shrink-0 flex-col gap-4">
            <div className="flex items-center justify-between pb-2">
              <button
                type="button"
                aria-label="확장"
                aria-pressed={expanded}
                className="flex size-8 cursor-pointer items-center justify-center rounded-full text-gray-main hover:bg-gray-100"
                onClick={() => setExpanded((prev) => !prev)}
              >
                <ExpandIcon className="size-6" />
              </button>

              <h2 id="apply-detail-heading" className="text-xl font-extrabold leading-8 text-strong">
                지원 상세
              </h2>

              <button
                type="button"
                aria-label="닫기"
                className="flex size-8 cursor-pointer shrink-0 items-center justify-center rounded-full text-gray-main hover:bg-gray-100"
                onClick={onClose}
              >
                <XIcon className="size-6" />
              </button>
            </div>
            <div className="flex items-start justify-between gap-4">
              <div className="flex min-w-0 flex-1 flex-col gap-5">
                <h2
                  id="apply-detail-title"
                  className="min-w-0 flex-1 text-2xl leading-9 font-bold text-strong"
                >
                  {item.title}
                </h2>

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
              {expanded ? (
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
                      'text-base leading-6 font-bold',
                      isEditing ? 'text-white' : 'text-tertiary',
                    )}
                  >
                    {isEditing ? '저장하기' : '수정하기'}
                  </span>
                </button>
              ) : null}

            </div>

            <div className={cn('h-px w-full bg-gray-300', !expanded && 'max-w-[452px]')} />
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto pb-6">
            <div className={cn('flex flex-col gap-3', !expanded && 'max-w-[452px]')}>
              {coverLetterQuestions.map((question) => (
                <QuestionBlock
                  key={`${question.label}-${question.index}`}
                  index={question.index}
                  label={question.label}
                  answer={question.answer}
                  expanded={expanded}
                  editable={isEditing}
                  inputBackgroundClassName={isEditing ? 'bg-[#F5F5F5]' : 'bg-[#FFFFFF]'}
                  onAnswerChange={(nextAnswer) =>
                    setEditableQuestions((prev) =>
                      prev.map((entry, entryIndex) =>
                        entryIndex === question.index - 1 ? { ...entry, answer: nextAnswer } : entry,
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
      </aside>
    </>
  );
}

function QuestionBlock({
  index,
  label,
  answer,
  expanded = false,
  editable = false,
  inputBackgroundClassName,
  onAnswerChange,
  onCopy,
}: {
  index: number;
  label: string;
  answer: string;
  expanded?: boolean;
  editable?: boolean;
  inputBackgroundClassName?: string;
  onAnswerChange?: (value: string) => void;
  onCopy?: () => void;
}) {
  return (
    <div className={cn('flex w-full flex-col gap-1.5', !expanded && 'max-w-[452px]')}>
      <div className="flex items-center gap-1 px-2">
        <div className="flex min-w-0 flex-1 items-center gap-1">
          <span className="body-1-bold text-mint-300">Q{index}.</span>
          <span className="body-1-bold text-gray-800">{label}</span>
        </div>
        <button
          type="button"
          aria-label={`${label} 복사`}
          className="flex size-7 shrink-0 cursor-pointer items-center justify-center rounded text-gray-main outline-none transition-colors hover:bg-gray-100 focus-visible:shadow-focus-ring"
          onClick={onCopy}
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
        {editable ? (
          <textarea
            value={answer}
            className="h-full min-h-28 w-full resize-none bg-transparent body-3-bold text-gray-700 outline-none"
            onChange={(event) => onAnswerChange?.(event.currentTarget.value)}
          />
        ) : (
          <p className="body-3-bold text-gray-700">{answer}</p>
        )}
      </div>
    </div>
  );
}
