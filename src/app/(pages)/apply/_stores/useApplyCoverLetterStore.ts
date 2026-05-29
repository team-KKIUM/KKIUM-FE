'use client';

import { create } from 'zustand';

import {
  applyCoverLetterQuestionsMock,
  type ApplyCoverLetterQuestion,
} from '../_constants/applyMockData';

type SelectedExperienceIdsByQuestion = Record<string, string[]>;

type ApplyCoverLetterState = {
  questions: ApplyCoverLetterQuestion[];
  activeQuestionIndex: number;
  selectedExperienceIdsByQuestion: SelectedExperienceIdsByQuestion;
  setQuestions: (questions: ApplyCoverLetterQuestion[]) => void;
  setActiveQuestionIndex: (index: number) => void;
  setQuestionExperienceIds: (questionId: string, experienceIds: string[]) => void;
  removeQuestionExperienceId: (questionId: string, experienceId: string) => void;
  setSelectedExperienceIdsByQuestion: (
    selectedExperienceIdsByQuestion: SelectedExperienceIdsByQuestion,
  ) => void;
};

export const useApplyCoverLetterStore = create<ApplyCoverLetterState>((set) => ({
  questions: applyCoverLetterQuestionsMock,
  activeQuestionIndex: 0,
  selectedExperienceIdsByQuestion: {},
  setQuestions: (questions) => set({ questions }),
  setActiveQuestionIndex: (activeQuestionIndex) => set({ activeQuestionIndex }),
  setQuestionExperienceIds: (questionId, experienceIds) =>
    set((state) => ({
      selectedExperienceIdsByQuestion: {
        ...state.selectedExperienceIdsByQuestion,
        [questionId]: experienceIds,
      },
    })),
  removeQuestionExperienceId: (questionId, experienceId) =>
    set((state) => ({
      selectedExperienceIdsByQuestion: {
        ...state.selectedExperienceIdsByQuestion,
        [questionId]: (state.selectedExperienceIdsByQuestion[questionId] ?? []).filter(
          (id) => id !== experienceId,
        ),
      },
    })),
  setSelectedExperienceIdsByQuestion: (selectedExperienceIdsByQuestion) =>
    set({ selectedExperienceIdsByQuestion }),
}));
