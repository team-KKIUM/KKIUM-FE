'use client';

import * as React from 'react';

import { ResizableSplit } from '../ResizableSplit';
import {
  coverLetterQuestionExperiencesMock,
  getCoverLetterQuestionDisplayText,
} from '../../_constants/applyMockData';
import { useApplyCoverLetterStore } from '../../_stores/useApplyCoverLetterStore';
import { ApplyCoverLetterExperienceSelectModal } from './ApplyCoverLetterExperienceSelectModal';
import { ApplyCoverLetterPanel } from './ApplyCoverLetterPanel';
import { ApplyCoverLetterRightPanel } from './ApplyCoverLetterRightPanel';

export function ApplyCoverLetterSection() {
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
  const [experienceModalOpen, setExperienceModalOpen] = React.useState(false);

  const activeQuestion = questions[activeQuestionIndex];

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

      return (selectedExperienceIdsByQuestion[activeQuestion.id] ?? [])
        .map(
          (experienceId) =>
            coverLetterQuestionExperiencesMock.find(
              ({ experience }) => experience.id === experienceId,
            )?.experience,
        )
        .filter((experience) => experience != null);
    },
    [activeQuestion, selectedExperienceIdsByQuestion],
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
      <div className="flex min-h-0 flex-1 flex-col pl-10">
        <ResizableSplit
          className="min-h-0 flex-1"
          separatorAriaLabel="자기소개서 작성 패널 너비 조절"
          rightClassName="bg-background-w"
          left={
            <ApplyCoverLetterPanel
              selectedExperiences={activeQuestionSelectedExperiences}
              onSelectedExperienceRemove={handleRemoveSelectedExperience}
              onSelectExperienceClick={() => setExperienceModalOpen(true)}
            />
          }
          right={
            <ApplyCoverLetterRightPanel
              questions={questions}
              activeIndex={activeQuestionIndex}
              onActiveIndexChange={setActiveQuestionIndex}
              onQuestionsChange={setQuestions}
              selectedExperienceIdsByQuestion={selectedExperienceIdsByQuestion}
            />
          }
        />
      </div>

      {activeQuestion ? (
        <ApplyCoverLetterExperienceSelectModal
          open={experienceModalOpen}
          onOpenChange={setExperienceModalOpen}
          questionId={activeQuestion.id}
          questionOrder={activeQuestionIndex + 1}
          questionText={getCoverLetterQuestionDisplayText(activeQuestion)}
          selectedExperienceIds={selectedExperienceIdsByQuestion[activeQuestion.id] ?? []}
          onSave={handleSaveExperiences}
        />
      ) : null}
    </>
  );
}
