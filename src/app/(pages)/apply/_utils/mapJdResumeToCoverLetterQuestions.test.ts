import type { JdResumeResponse } from '@/app/api/apply/types';

import { mapJdResumeToCoverLetterQuestions } from './mapJdResumeToCoverLetterQuestions';

describe('mapJdResumeToCoverLetterQuestions', () => {
  test('sorts by orderNum and maps resume questions', () => {
    const resume: JdResumeResponse = {
      postingTitle: '공고',
      companyName: '회사',
      recruitmentField: '개발',
      startDate: '',
      endDate: '',
      questions: [
        {
          questionId: 2,
          orderNum: 2,
          content: '  두 번째 문항 ',
          answer: ' 답변 2 ',
          aiDraft: ' 초안 ',
          hasAiDraft: true,
        },
        {
          questionId: 1,
          orderNum: 1,
          content: '',
          answer: ' 답변 1 ',
          aiDraft: '',
          hasAiDraft: false,
        },
      ],
    };

    expect(mapJdResumeToCoverLetterQuestions(resume)).toEqual([
      {
        id: 'resume-q-1',
        jdQuestionId: 1,
        title: '1번 문항',
        prompt: undefined,
        content: '답변 1',
        hasAiDraft: false,
        aiDraft: '',
      },
      {
        id: 'resume-q-2',
        jdQuestionId: 2,
        title: '두 번째 문항',
        prompt: '두 번째 문항',
        content: '답변 2',
        hasAiDraft: true,
        aiDraft: '초안',
      },
    ]);
  });

  test('returns empty array when resume is nullish', () => {
    expect(mapJdResumeToCoverLetterQuestions(null)).toEqual([]);
  });
});
