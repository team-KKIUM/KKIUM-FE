import type { JdResumeResponse } from '@/app/api/apply/types';

import { mapJdResumeToJobPostingSnapshot } from './mapJdResumeToJobPostingSnapshot';

describe('mapJdResumeToJobPostingSnapshot', () => {
  test('maps resume fields into job posting snapshot', () => {
    const resume: JdResumeResponse = {
      postingTitle: '2026 하반기 공채',
      companyName: 'KKIUM',
      recruitmentField: 'Frontend Developer',
      startDate: '2026-04-01',
      endDate: '2026-04-28',
      questions: [],
    };

    expect(mapJdResumeToJobPostingSnapshot('49', resume)).toEqual({
      jdId: '49',
      title: '2026 하반기 공채',
      companyName: 'KKIUM',
      jobField: 'Frontend Developer',
      period: expect.stringMatching(/^2026\.04\.01~2026\.04\.28$/),
    });
  });

  test('uses 상시 채용 when dates are empty', () => {
    const resume: JdResumeResponse = {
      postingTitle: '상시 채용',
      companyName: 'KKIUM',
      recruitmentField: 'Backend',
      startDate: '',
      endDate: '',
      questions: [],
    };

    expect(mapJdResumeToJobPostingSnapshot('1', resume).period).toBe('상시 채용');
  });
});
