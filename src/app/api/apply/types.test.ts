import {
  UNPARSEABLE_JD_URL_MESSAGE,
  assertParseableJdUrlResponse,
  jdAnalysisResponseSchema,
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
