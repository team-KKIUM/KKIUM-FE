import {
  UNPARSEABLE_JD_URL_MESSAGE,
  assertParseableJdUrlResponse,
  jdAnalysisResponseSchema,
  normalizeJobPostingAnalyzeErrorMessage,
  updateJdResumeQuestionRequestSchema,
} from './types';

describe('assertParseableJdUrlResponse', () => {
  test('passes when at least one critical field has value', () => {
    expect(() =>
      assertParseableJdUrlResponse({
        postingTitle: '백엔드',
        companyName: null,
      }),
    ).not.toThrow();
  });

  test('throws when no critical field is parseable', () => {
    expect(() =>
      assertParseableJdUrlResponse({
        postingTitle: '',
        companyName: null,
        recruitmentField: '   ',
        content: '',
      }),
    ).toThrow(UNPARSEABLE_JD_URL_MESSAGE);
  });
});

describe('normalizeJobPostingAnalyzeErrorMessage', () => {
  test('maps content null zod error payload to user-friendly message', () => {
    const zodErrorMessage =
      '[ { "expected": "string", "code": "invalid_type", "path": [ "content" ], "message": "Invalid input: expected string, received null" } ]';

    expect(normalizeJobPostingAnalyzeErrorMessage(new Error(zodErrorMessage))).toBe(
      UNPARSEABLE_JD_URL_MESSAGE,
    );
  });

  test('returns null when error is absent', () => {
    expect(normalizeJobPostingAnalyzeErrorMessage(null)).toBeNull();
  });
});

describe('updateJdResumeQuestionRequestSchema', () => {
  test('trims content and requires at least one character', () => {
    const parsed = updateJdResumeQuestionRequestSchema.parse({
      content: '  수정할 자기소개서 문항입니다.  ',
    });

    expect(parsed).toEqual({ content: '수정할 자기소개서 문항입니다.' });
  });

  test('rejects empty or whitespace-only content', () => {
    expect(() => updateJdResumeQuestionRequestSchema.parse({ content: '' })).toThrow();
    expect(() => updateJdResumeQuestionRequestSchema.parse({ content: '   ' })).toThrow();
  });
});

describe('jdAnalysisResponseSchema', () => {
  test('accepts pending response with null jdInfo and matchResult', () => {
    const parsed = jdAnalysisResponseSchema.parse({
      analysisStatus: 'PENDING',
      jdInfo: null,
      matchResult: null,
    });

    expect(parsed.analysisStatus).toBe('PENDING');
    expect(parsed.jdInfo).toBeNull();
    expect(parsed.matchResult).toBeNull();
  });

  test('normalizes snake_case analysis status', () => {
    const parsed = jdAnalysisResponseSchema.parse({
      analysis_status: 'completed',
    });

    expect(parsed.analysisStatus).toBe('completed');
  });
});
