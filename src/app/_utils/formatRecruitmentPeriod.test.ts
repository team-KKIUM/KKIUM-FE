import { formatRecruitmentPeriod } from './formatRecruitmentPeriod';

describe('formatRecruitmentPeriod', () => {
  test('returns 상시 채용 when both dates are empty', () => {
    expect(formatRecruitmentPeriod('', '')).toBe('상시 채용');
  });

  test('formats start and end dates', () => {
    expect(formatRecruitmentPeriod('2026-04-01', '2026-04-28')).toBe(
      '2026.04.01 ~ 2026.04.28',
    );
  });

  test('returns only available date when one side is missing', () => {
    expect(formatRecruitmentPeriod('2026-04-01', '')).toBe('2026.04.01');
    expect(formatRecruitmentPeriod('', '2026-04-28')).toBe('2026.04.28');
  });
});
