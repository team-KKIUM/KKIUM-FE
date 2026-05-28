import type { JdResumeResponse } from '@/app/api/apply/types';
import type { ApplyCoverLetterQuestion } from '../_constants/applyMockData';

export function mapJdResumeToCoverLetterQuestions(
  resume: JdResumeResponse | null | undefined,
): ApplyCoverLetterQuestion[] {
  const questions = resume?.questions ?? [];

  return questions
    .slice()
    .sort((a, b) => a.orderNum - b.orderNum)
    .map((question, index) => {
      const prompt = question.content?.trim() ?? '';

      return {
        id: `resume-q-${question.questionId}`,
        jdQuestionId: question.questionId,
        title: prompt || `${index + 1}번 문항`,
        prompt: prompt || undefined,
        content: question.answer?.trim() ?? '',
      };
    });
}
