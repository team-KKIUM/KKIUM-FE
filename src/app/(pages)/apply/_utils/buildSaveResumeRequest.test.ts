import type { ApplyCoverLetterQuestion } from '../_constants/applyMockData';
import {
  buildSaveResumeRequest,
  getJdQuestionIdFromCoverLetterQuestion,
  parseExperienceIds,
} from './buildSaveResumeRequest';

describe('parseExperienceIds', () => {
  test('parses valid numeric ids and filters invalid values', () => {
    expect(parseExperienceIds(['1', '2', 'abc', '0', '-3', '4.5'])).toEqual([1, 2, 4.5]);
  });
});

describe('getJdQuestionIdFromCoverLetterQuestion', () => {
  test('returns jdQuestionId when present', () => {
    const question = { id: 'local-1', jdQuestionId: 42 } as ApplyCoverLetterQuestion;
    expect(getJdQuestionIdFromCoverLetterQuestion(question)).toBe(42);
  });

  test('parses resume-q-{id} fallback', () => {
    const question = { id: 'resume-q-7' } as ApplyCoverLetterQuestion;
    expect(getJdQuestionIdFromCoverLetterQuestion(question)).toBe(7);
  });

  test('returns null for unsupported id format', () => {
    const question = { id: 'draft-1' } as ApplyCoverLetterQuestion;
    expect(getJdQuestionIdFromCoverLetterQuestion(question)).toBeNull();
  });
});

describe('buildSaveResumeRequest', () => {
  test('builds answers with question ids, content, and experience ids', () => {
    const questions: ApplyCoverLetterQuestion[] = [
      {
        id: 'resume-q-1',
        jdQuestionId: 1,
        title: '1번 문항',
        content: '답변 1',
        hasAiDraft: false,
        aiDraft: '',
      },
      {
        id: 'draft-2',
        title: '임시 문항',
        content: '무시됨',
        hasAiDraft: false,
        aiDraft: '',
      },
    ];

    const request = buildSaveResumeRequest(questions, {
      'resume-q-1': ['10', 'bad', '20'],
    });

    expect(request).toEqual({
      answers: [
        {
          jdQuestionId: 1,
          answerText: '답변 1',
          experienceIds: [10, 20],
        },
      ],
    });
  });
});
