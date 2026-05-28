import type { SaveResumeRequest } from '@/app/api/apply/types';

import type { ApplyCoverLetterQuestion } from '../_constants/applyMockData';

export function parseExperienceIds(experienceIds: string[]) {
  return experienceIds
    .map((experienceId) => Number(experienceId))
    .filter((experienceId) => Number.isFinite(experienceId) && experienceId > 0);
}

export function getJdQuestionIdFromCoverLetterQuestion(
  question: ApplyCoverLetterQuestion,
): number | null {
  if (question.jdQuestionId != null && Number.isFinite(question.jdQuestionId)) {
    return question.jdQuestionId;
  }

  const match = question.id.match(/^resume-q-(\d+)$/);
  if (!match) {
    return null;
  }

  const jdQuestionId = Number(match[1]);
  return Number.isFinite(jdQuestionId) ? jdQuestionId : null;
}

export function buildSaveResumeRequest(
  questions: ApplyCoverLetterQuestion[],
  selectedExperienceIdsByQuestion: Record<string, string[]>,
): SaveResumeRequest {
  const answers = questions.flatMap((question) => {
    const jdQuestionId = getJdQuestionIdFromCoverLetterQuestion(question);
    if (jdQuestionId == null) {
      return [];
    }

    const experienceIds = parseExperienceIds(selectedExperienceIdsByQuestion[question.id] ?? []);

    return [
      {
        jdQuestionId,
        answerText: question.content,
        experienceIds,
      },
    ];
  });

  return { answers };
}
