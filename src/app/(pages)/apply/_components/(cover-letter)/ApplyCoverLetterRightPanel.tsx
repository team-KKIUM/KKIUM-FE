'use client';

import * as React from 'react';

import {
  APPLY_COVER_LETTER_MAX_QUESTIONS,
  applyCoverLetterQuestionsMock,
  type ApplyCoverLetterQuestion,
} from '../../_constants/applyMockData';
import { cn } from '@/lib/utils';

import { ApplyCoverLetterQuestionEditor } from './ApplyCoverLetterQuestionEditor';
import { ApplyCoverLetterQuestionNav } from './ApplyCoverLetterQuestionNav';

export interface ApplyCoverLetterRightPanelProps {
  className?: string;
  questions?: ApplyCoverLetterQuestion[];
  activeIndex?: number;
  onActiveIndexChange?: (index: number) => void;
  onQuestionsChange?: (questions: ApplyCoverLetterQuestion[]) => void;
  selectedExperienceIdsByQuestion?: Record<string, string[]>;
  initialQuestions?: ApplyCoverLetterQuestion[];
}

function createQuestionId() {
  return `cover-letter-q-${crypto.randomUUID()}`;
}

function createEmptyQuestion(index: number): ApplyCoverLetterQuestion {
  return {
    id: createQuestionId(),
    title: `${index}번 문항`,
    content: '',
  };
}

export function ApplyCoverLetterRightPanel({
  className,
  questions: controlledQuestions,
  activeIndex: controlledActiveIndex,
  onActiveIndexChange,
  onQuestionsChange,
  selectedExperienceIdsByQuestion = {},
  initialQuestions = applyCoverLetterQuestionsMock,
}: ApplyCoverLetterRightPanelProps) {
  const [uncontrolledQuestions, setUncontrolledQuestions] = React.useState(initialQuestions);
  const [uncontrolledActiveIndex, setUncontrolledActiveIndex] = React.useState(0);

  const isControlled = controlledQuestions != null && controlledActiveIndex != null;
  const questions = isControlled ? controlledQuestions : uncontrolledQuestions;
  const activeIndex = isControlled ? controlledActiveIndex : uncontrolledActiveIndex;

  const setQuestions = (updater: React.SetStateAction<ApplyCoverLetterQuestion[]>) => {
    const next = typeof updater === 'function' ? updater(questions) : updater;

    setUncontrolledQuestions(next);
    onQuestionsChange?.(next);
  };

  const setActiveIndex = (index: number) => {
    setUncontrolledActiveIndex(index);
    onActiveIndexChange?.(index);
  };

  const activeQuestion = questions[activeIndex];

  const handleAddQuestion = () => {
    setQuestions((prev) => {
      if (prev.length >= APPLY_COVER_LETTER_MAX_QUESTIONS) {
        return prev;
      }

      setActiveIndex(prev.length);
      return [...prev, createEmptyQuestion(prev.length + 1)];
    });
  };

  const handleContentChange = (content: string) => {
    setQuestions((prev) =>
      prev.map((question, index) => (index === activeIndex ? { ...question, content } : question)),
    );
  };

  const handleTitleChange = (title: string) => {
    setQuestions((prev) =>
      prev.map((question, index) => (index === activeIndex ? { ...question, title } : question)),
    );
  };

  React.useEffect(() => {
    if (activeIndex < questions.length) {
      return;
    }

    const nextIndex = Math.max(0, questions.length - 1);

    if (onActiveIndexChange) {
      onActiveIndexChange(nextIndex);
      return;
    }

    setUncontrolledActiveIndex(nextIndex);
  }, [activeIndex, onActiveIndexChange, questions.length]);

  if (!activeQuestion) {
    return null;
  }

  return (
    <section
      data-slot="cover-letter-right-panel"
      className={cn('flex h-full min-h-0 w-full min-w-0 flex-col gap-6', className)}
    >
      <ApplyCoverLetterQuestionNav
        className="mt-6 shrink-0"
        questionCount={questions.length}
        activeIndex={activeIndex}
        onActiveIndexChange={setActiveIndex}
        onAddQuestion={handleAddQuestion}
      />

      <ApplyCoverLetterQuestionEditor
        order={activeIndex + 1}
        title={activeQuestion.title}
        value={activeQuestion.content}
        onChange={handleContentChange}
        onTitleChange={handleTitleChange}
        hasSelectedExperiences={
          (selectedExperienceIdsByQuestion[activeQuestion.id] ?? []).length > 0
        }
      />
    </section>
  );
}
