'use client';

import * as React from 'react';

import { ResizableSplit } from '../ResizableSplit';
import {
  APPLY_COVER_LETTER_LEFT_PANEL_INSET,
  APPLY_COVER_LETTER_RIGHT_PANEL_BG,
  APPLY_COVER_LETTER_SECTION_EXTEND,
  APPLY_COVER_LETTER_SPLIT_BLEED,
} from '../../_constants/applyConstants';
import {
  APPLY_COVER_LETTER_SPLIT_MIN_LEFT_WIDTH,
  APPLY_COVER_LETTER_SPLIT_MIN_RIGHT_WIDTH,
} from '../../_constants/resizableSplitConstants';
import {
  applyCoverLetterQuestionsMock,
  getCoverLetterQuestionDisplayText,
} from '../../_constants/applyMockData';
import { useApplyCoverLetterStore } from '../../_stores/useApplyCoverLetterStore';
import { getJdQuestionIdFromCoverLetterQuestion } from '../../_utils/buildSaveResumeRequest';
import { mapJdResumeToCoverLetterQuestions } from '../../_utils/mapJdResumeToCoverLetterQuestions';
import { useApplyResumeQuestionExperiences } from '@/hooks/apply/useApplyResumeQuestionExperiences';
import { useApplyResumeWritingGuide } from '@/hooks/apply/useApplyResumeWritingGuide';
import { ApplyCoverLetterExperienceSelectModal } from './ApplyCoverLetterExperienceSelectModal';
import { ApplyCoverLetterPanel } from './ApplyCoverLetterPanel';
import { ApplyCoverLetterRightPanel } from './ApplyCoverLetterRightPanel';
import { useApplyJobPostingResume } from '@/hooks/apply/useApplyJobPostings';
import { cn } from '@/lib/utils';

export interface ApplyCoverLetterSectionProps {
  jdId: string | null;
}

export function ApplyCoverLetterSection({ jdId }: ApplyCoverLetterSectionProps) {
  const questions = useApplyCoverLetterStore((state) => state.questions);
  const setQuestions = useApplyCoverLetterStore((state) => state.setQuestions);
  const activeQuestionIndex = useApplyCoverLetterStore((state) => state.activeQuestionIndex);
  const setActiveQuestionIndex = useApplyCoverLetterStore(
    (state) => state.setActiveQuestionIndex,
  );
  const selectedExperienceIdsByQuestion = useApplyCoverLetterStore(
    (state) => state.selectedExperienceIdsByQuestion,
  );
  const setQuestionExperienceIds = useApplyCoverLetterStore(
    (state) => state.setQuestionExperienceIds,
  );
  const removeQuestionExperienceId = useApplyCoverLetterStore(
    (state) => state.removeQuestionExperienceId,
  );
  const resumeQuery = useApplyJobPostingResume(jdId, jdId != null);
  const [experienceModalOpen, setExperienceModalOpen] = React.useState(false);
  const initializedQuestionJdIdsRef = React.useRef<Set<string>>(new Set());

  const activeQuestion = questions[activeQuestionIndex];
  const activeQuestionExperienceIds = activeQuestion
    ? (selectedExperienceIdsByQuestion[activeQuestion.id] ?? [])
    : [];
  const activeJdQuestionId = activeQuestion
    ? getJdQuestionIdFromCoverLetterQuestion(activeQuestion)
    : null;
  const writingGuideQuery = useApplyResumeWritingGuide(
    jdId,
    activeJdQuestionId,
    activeQuestionExperienceIds,
  );
  const shouldLoadQuestionExperiences =
    jdId != null &&
    activeJdQuestionId != null &&
    (experienceModalOpen || activeQuestionExperienceIds.length > 0);
  const questionExperiencesQuery = useApplyResumeQuestionExperiences(
    jdId,
    activeJdQuestionId,
    shouldLoadQuestionExperiences,
  );

  React.useEffect(() => {
    if (!jdId || !resumeQuery.data) {
      return;
    }

    if (initializedQuestionJdIdsRef.current.has(jdId)) {
      return;
    }

    const mappedQuestions = mapJdResumeToCoverLetterQuestions(resumeQuery.data);
    setQuestions(mappedQuestions.length > 0 ? mappedQuestions : applyCoverLetterQuestionsMock);
    initializedQuestionJdIdsRef.current.add(jdId);
  }, [jdId, resumeQuery.data, setQuestions]);

  React.useEffect(() => {
    if (activeQuestionIndex >= questions.length) {
      setActiveQuestionIndex(Math.max(0, questions.length - 1));
    }
  }, [activeQuestionIndex, questions.length, setActiveQuestionIndex]);

  const activeQuestionSelectedExperiences = React.useMemo(
    () => {
      if (!activeQuestion) {
        return [];
      }

      const experiencesById = new Map(
        (questionExperiencesQuery.data ?? []).map(({ experience }) => [
          experience.id,
          experience,
        ]),
      );

      return (selectedExperienceIdsByQuestion[activeQuestion.id] ?? [])
        .map((experienceId) => experiencesById.get(experienceId))
        .filter((experience) => experience != null);
    },
    [activeQuestion, questionExperiencesQuery.data, selectedExperienceIdsByQuestion],
  );

  const handleRemoveSelectedExperience = (experienceId: string) => {
    if (!activeQuestion) {
      return;
    }

    removeQuestionExperienceId(activeQuestion.id, experienceId);
  };

  const handleSaveExperiences = (experienceIds: string[]) => {
    if (!activeQuestion) {
      return;
    }

    setQuestionExperienceIds(activeQuestion.id, experienceIds);
  };

  return (
    <>
      <div
        className={cn(
          'flex min-h-0 min-w-0 flex-1 flex-col overflow-x-visible',
          APPLY_COVER_LETTER_SECTION_EXTEND,
        )}
      >
        <ResizableSplit
          className={cn('min-h-0 flex-1', APPLY_COVER_LETTER_SPLIT_BLEED)}
          separatorAriaLabel="자기소개서 작성 패널 너비 조절"
          separatorClassName="-mt-px"
          leftClassName="pt-3"
          rightClassName={APPLY_COVER_LETTER_RIGHT_PANEL_BG}
          layout={{
            minLeftWidth: APPLY_COVER_LETTER_SPLIT_MIN_LEFT_WIDTH,
            minRightWidth: APPLY_COVER_LETTER_SPLIT_MIN_RIGHT_WIDTH,
            leftPanelInset: APPLY_COVER_LETTER_LEFT_PANEL_INSET,
          }}
          left={
            <ApplyCoverLetterPanel
              selectedExperiences={activeQuestionSelectedExperiences}
              onSelectedExperienceRemove={handleRemoveSelectedExperience}
              onSelectExperienceClick={() => setExperienceModalOpen(true)}
              writingGuide={writingGuideQuery.data}
              isWritingGuideLoading={writingGuideQuery.isFetching}
              isWritingGuideError={writingGuideQuery.isError}
            />
          }
          right={
            <ApplyCoverLetterRightPanel
              jdId={jdId}
              questions={questions}
              activeIndex={activeQuestionIndex}
              onActiveIndexChange={setActiveQuestionIndex}
              onQuestionsChange={setQuestions}
              selectedExperienceIdsByQuestion={selectedExperienceIdsByQuestion}
              hasDisplayedSelectedExperiences={activeQuestionSelectedExperiences.length > 0}
            />
          }
        />
      </div>

      {activeQuestion ? (
        <ApplyCoverLetterExperienceSelectModal
          open={experienceModalOpen}
          onOpenChange={setExperienceModalOpen}
          jdId={jdId}
          jdQuestionId={activeJdQuestionId}
          questionOrder={activeQuestionIndex + 1}
          questionText={getCoverLetterQuestionDisplayText(activeQuestion)}
          selectedExperienceIds={selectedExperienceIdsByQuestion[activeQuestion.id] ?? []}
          onSave={handleSaveExperiences}
        />
      ) : null}
    </>
  );
}
