import type { ResumeQuestionExperience } from '@/app/api/apply/types';

import { enrichResumeQuestionExperiences } from './enrichResumeQuestionExperiences';

describe('enrichResumeQuestionExperiences', () => {
  test('keeps existing type when already normalized', () => {
    const experiences: ResumeQuestionExperience[] = [
      {
        experienceId: 1,
        type: 'CAREER',
        title: 'A',
        oneLineIntro: 'B',
        startDate: '',
        endDate: '',
        usageFitScore: 10,
      },
    ];

    expect(enrichResumeQuestionExperiences(experiences, new Map())).toEqual(experiences);
  });

  test('fills missing type from lookup map', () => {
    const experiences: ResumeQuestionExperience[] = [
      {
        experienceId: 2,
        type: '',
        title: 'A',
        oneLineIntro: 'B',
        startDate: '',
        endDate: '',
        usageFitScore: 10,
      },
    ];

    const typeByExperienceId = new Map<number, 'ACTIVITY'>([[2, 'ACTIVITY']]);

    expect(enrichResumeQuestionExperiences(experiences, typeByExperienceId)).toEqual([
      {
        ...experiences[0],
        type: 'ACTIVITY',
      },
    ]);
  });
});
