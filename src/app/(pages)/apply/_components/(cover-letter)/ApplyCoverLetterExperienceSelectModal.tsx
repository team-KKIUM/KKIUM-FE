'use client';

import * as React from 'react';

import type { JdId } from '@/app/api/apply/types';
import { Modal, ModalClose, ModalDescription, ModalTitle } from '@/components/common/Modal';
import { XIcon } from '@/components/common/icons/XIcon';
import { Button } from '@/components/ui/button';
import { useApplyResumeQuestionExperiences } from '@/hooks/apply/useApplyResumeQuestionExperiences';
import { cn } from '@/lib/utils';

import { APPLY_COVER_LETTER_MAX_SELECTED_EXPERIENCES } from '../../_constants/applyMockData';

import { ApplyCoverLetterExperienceSelectEmptyState } from './ApplyCoverLetterExperienceSelectEmptyState';
import { CoverLetterQuestionFitInfoLink } from './CoverLetterQuestionFitInfoLink';
import { ExperienceSelect } from './ExperienceSelect';

export interface ApplyCoverLetterExperienceSelectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  jdId?: JdId | null;
  jdQuestionId?: number | null;
  questionOrder: number;
  questionText: string;
  selectedExperienceIds?: string[];
  onSave: (experienceIds: string[]) => void;
}

function formatQuestionOrder(order: number) {
  return String(order).padStart(2, '0');
}

export function ApplyCoverLetterExperienceSelectModal({
  open,
  onOpenChange,
  jdId,
  jdQuestionId,
  questionOrder,
  questionText,
  selectedExperienceIds = [],
  onSave,
}: ApplyCoverLetterExperienceSelectModalProps) {
  const canFetchExperiences = jdId != null && jdQuestionId != null;
  const experiencesQuery = useApplyResumeQuestionExperiences(
    jdId,
    jdQuestionId,
    open && canFetchExperiences,
  );
  const questionExperiences = experiencesQuery.data ?? [];
  const [draftSelectedIds, setDraftSelectedIds] = React.useState<string[]>(selectedExperienceIds);

  React.useEffect(() => {
    if (open) {
      setDraftSelectedIds(selectedExperienceIds);
    }
  }, [open, selectedExperienceIds]);

  const isPending = canFetchExperiences && experiencesQuery.isPending;
  const isError = canFetchExperiences && experiencesQuery.isError;
  const hasExperiences = questionExperiences.length > 0;
  const canSave = draftSelectedIds.length > 0;

  const handleToggleExperience = (experienceId: string) => {
    setDraftSelectedIds((current) => {
      if (current.includes(experienceId)) {
        return current.filter((id) => id !== experienceId);
      }

      if (current.length >= APPLY_COVER_LETTER_MAX_SELECTED_EXPERIENCES) {
        return current;
      }

      return [...current, experienceId];
    });
  };

  const handleSave = () => {
    if (!canSave) {
      return;
    }

    onSave(draftSelectedIds);
    onOpenChange(false);
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      contentClassName="flex h-[790px] max-h-[calc(100dvh-40px)] w-full max-w-[864px] flex-col justify-between gap-0 overflow-hidden px-7 py-5"
    >
      <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-hidden">
        <div className="flex shrink-0 items-start justify-between gap-4">
          <div className="flex min-w-0 flex-col gap-0.5">
            <ModalTitle className="text-xl font-bold leading-7 text-strong">경험 선택</ModalTitle>
            <ModalDescription className="body-2-regular text-gray-700">
              최대 {APPLY_COVER_LETTER_MAX_SELECTED_EXPERIENCES}개까지 선택할 수 있어요.
            </ModalDescription>
          </div>

          <ModalClose asChild>
            <button
              type="button"
              aria-label="모달 닫기"
              className="flex size-8 shrink-0 items-center justify-center rounded-full bg-background-w text-gray-main outline-none transition-colors hover:bg-gray-100 focus-visible:shadow-focus-ring"
            >
              <XIcon className="size-6" />
            </button>
          </ModalClose>
        </div>

        <hr className="shrink-0 border-0 border-t border-gray-300" />

        <div className="flex min-w-0 shrink-0 items-start gap-0.5">
          <span className="shrink-0 text-xl font-bold leading-7 text-mint-300">
            {formatQuestionOrder(questionOrder)}.
          </span>
          <p className="min-w-0 text-xl font-bold leading-7 text-strong">{questionText}</p>
        </div>

        <hr className="shrink-0 border-0 border-t border-gray-300" />

        {hasExperiences && !isPending ? (
          <>
            <CoverLetterQuestionFitInfoLink className="shrink-0" />

            <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto pr-1">
              {questionExperiences.map(({ experience, fitScore }) => {
                const selected = draftSelectedIds.includes(experience.id);
                const selectionLimitReached =
                  draftSelectedIds.length >= APPLY_COVER_LETTER_MAX_SELECTED_EXPERIENCES;

                return (
                  <ExperienceSelect
                    key={experience.id}
                    type={experience.type}
                    title={experience.title}
                    description={experience.description}
                    fitScore={fitScore}
                    selected={selected}
                    disabled={!selected && selectionLimitReached}
                    onSelectedChange={() => handleToggleExperience(experience.id)}
                  />
                );
              })}
            </div>
          </>
        ) : (
          <div
            className={cn(
              'flex min-h-0 flex-1 flex-col overflow-hidden',
              !isPending && 'rounded-lg border border-gray-400 bg-gray-200',
            )}
          >
            {isPending ? (
              <p className="flex flex-1 items-center justify-center body-2-regular text-tertiary">
                경험 목록을 불러오는 중이에요.
              </p>
            ) : isError ? (
              <p className="flex flex-1 items-center justify-center body-2-regular text-tertiary">
                경험 목록을 불러오지 못했습니다.
              </p>
            ) : (
              <ApplyCoverLetterExperienceSelectEmptyState />
            )}
          </div>
        )}
      </div>

      <Button
        type="button"
        variant={canSave ? 'default' : 'secondary'}
        className="mt-6 h-10 w-full shrink-0"
        disabled={!canSave}
        onClick={handleSave}
      >
        저장하기
      </Button>
    </Modal>
  );
}
