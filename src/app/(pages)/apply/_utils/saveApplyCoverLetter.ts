import { createJdResumeQuestion, getJdResume, saveJdResume } from '@/app/api/apply';
import type { JdId } from '@/app/api/apply/types';

import {
  getCoverLetterQuestionDisplayText,
  type ApplyCoverLetterQuestion,
} from '../_constants/applyMockData';
import { buildSaveResumeRequest, getJdQuestionIdFromCoverLetterQuestion } from './buildSaveResumeRequest';

type SelectedExperienceIdsByQuestion = Record<string, string[]>;

export type SaveApplyCoverLetterResult = {
  updatedQuestions: ApplyCoverLetterQuestion[];
  updatedExperienceIdsByQuestion: SelectedExperienceIdsByQuestion;
  saved: boolean;
};

function remapSelectedExperienceIds(
  selectedExperienceIdsByQuestion: SelectedExperienceIdsByQuestion,
  oldQuestionId: string,
  newQuestionId: string,
) {
  if (oldQuestionId === newQuestionId) {
    return selectedExperienceIdsByQuestion;
  }

  const { [oldQuestionId]: experienceIds, ...rest } = selectedExperienceIdsByQuestion;

  if (experienceIds == null) {
    return selectedExperienceIdsByQuestion;
  }

  return {
    ...rest,
    [newQuestionId]: experienceIds,
  };
}

function collectKnownQuestionIds(questions: ApplyCoverLetterQuestion[]) {
  return new Set(
    questions
      .map(getJdQuestionIdFromCoverLetterQuestion)
      .filter((questionId): questionId is number => questionId != null),
  );
}

function applyQuestionIdSync(
  questions: ApplyCoverLetterQuestion[],
  selectedExperienceIdsByQuestion: SelectedExperienceIdsByQuestion,
  localQuestionId: string,
  jdQuestionId: number,
  prompt: string,
) {
  const nextQuestionId = `resume-q-${jdQuestionId}`;

  return {
    updatedQuestions: questions.map((item) =>
      item.id === localQuestionId
        ? {
            ...item,
            id: nextQuestionId,
            jdQuestionId,
            prompt,
            title: item.title.trim().length > 0 ? item.title : prompt,
          }
        : item,
    ),
    updatedExperienceIdsByQuestion: remapSelectedExperienceIds(
      selectedExperienceIdsByQuestion,
      localQuestionId,
      nextQuestionId,
    ),
  };
}

async function syncCreatedQuestionsFromResume(
  jdId: JdId,
  questions: ApplyCoverLetterQuestion[],
  selectedExperienceIdsByQuestion: SelectedExperienceIdsByQuestion,
  pendingQuestions: ApplyCoverLetterQuestion[],
  knownQuestionIds: Set<number>,
) {
  const resume = await getJdResume(jdId);
  const newServerQuestions = resume.questions
    .filter((question) => !knownQuestionIds.has(question.questionId))
    .slice()
    .sort((a, b) => a.orderNum - b.orderNum);

  let updatedQuestions = questions;
  let updatedExperienceIdsByQuestion = selectedExperienceIdsByQuestion;
  const usedServerQuestionIds = new Set<number>();

  for (const localQuestion of pendingQuestions) {
    const content = getCoverLetterQuestionDisplayText(localQuestion).trim();
    const matchedServerQuestion =
      newServerQuestions.find(
        (question) =>
          !usedServerQuestionIds.has(question.questionId) &&
          question.content.trim() === content,
      ) ??
      newServerQuestions.find((question) => !usedServerQuestionIds.has(question.questionId));

    if (!matchedServerQuestion) {
      continue;
    }

    usedServerQuestionIds.add(matchedServerQuestion.questionId);
    knownQuestionIds.add(matchedServerQuestion.questionId);

    const synced = applyQuestionIdSync(
      updatedQuestions,
      updatedExperienceIdsByQuestion,
      localQuestion.id,
      matchedServerQuestion.questionId,
      matchedServerQuestion.content.trim() || content,
    );

    updatedQuestions = synced.updatedQuestions;
    updatedExperienceIdsByQuestion = synced.updatedExperienceIdsByQuestion;
  }

  return { updatedQuestions, updatedExperienceIdsByQuestion };
}

async function createMissingResumeQuestions(
  jdId: JdId,
  questions: ApplyCoverLetterQuestion[],
  selectedExperienceIdsByQuestion: SelectedExperienceIdsByQuestion,
) {
  const pendingQuestions = questions.filter((question) => {
    if (getJdQuestionIdFromCoverLetterQuestion(question) != null) {
      return false;
    }

    return getCoverLetterQuestionDisplayText(question).trim().length > 0;
  });

  if (pendingQuestions.length === 0) {
    return { updatedQuestions: questions, updatedExperienceIdsByQuestion: selectedExperienceIdsByQuestion };
  }

  const knownQuestionIds = collectKnownQuestionIds(questions);

  for (const question of pendingQuestions) {
    const content = getCoverLetterQuestionDisplayText(question).trim();
    await createJdResumeQuestion(jdId, { content });
  }

  return syncCreatedQuestionsFromResume(
    jdId,
    questions,
    selectedExperienceIdsByQuestion,
    pendingQuestions,
    knownQuestionIds,
  );
}

export async function saveApplyCoverLetter(
  jdId: JdId,
  questions: ApplyCoverLetterQuestion[],
  selectedExperienceIdsByQuestion: SelectedExperienceIdsByQuestion,
): Promise<SaveApplyCoverLetterResult> {
  const { updatedQuestions, updatedExperienceIdsByQuestion } = await createMissingResumeQuestions(
    jdId,
    questions,
    selectedExperienceIdsByQuestion,
  );
  const request = buildSaveResumeRequest(updatedQuestions, updatedExperienceIdsByQuestion);

  if (request.answers.length === 0) {
    return {
      updatedQuestions,
      updatedExperienceIdsByQuestion,
      saved: false,
    };
  }

  await saveJdResume(jdId, request);

  return {
    updatedQuestions,
    updatedExperienceIdsByQuestion,
    saved: true,
  };
}
