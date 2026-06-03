import { homeDashboardResponseSchema } from './types';

describe('homeDashboardResponseSchema', () => {
  test('parses dashboard response and normalizes nullable fields', () => {
    const parsed = homeDashboardResponseSchema.parse({
      targetJds: [
        {
          jdId: '49',
          companyName: null,
          recruitmentField: 'Frontend Developer',
          startDate: '2026-04-01',
          endDate: null,
          hardSkills: ['React', null],
          softSkills: [],
          applicationFitScore: '82',
        },
      ],
      totalExperienceCount: '3',
      thisMonthExperienceCount: 1,
      lastMonthDiff: null,
      jobType: {
        typeName: '정밀 분석가',
      },
      experienceDistribution: [
        {
          type: 'CAREER',
          count: '2',
          percentage: '66.7',
        },
      ],
    });

    expect(parsed.targetJds[0]).toMatchObject({
      jdId: '49',
      companyName: '',
      applicationFitScore: 82,
      hardSkills: ['React', ''],
    });
    expect(parsed.totalExperienceCount).toBe(3);
    expect(parsed.lastMonthDiff).toBe(0);
    expect(parsed.jobType?.typeName).toBe('정밀 분석가');
  });

  test('requires numeric count fields', () => {
    expect(() => homeDashboardResponseSchema.parse({})).toThrow();
  });
});
