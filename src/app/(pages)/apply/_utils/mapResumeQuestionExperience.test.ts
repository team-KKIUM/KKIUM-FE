import type { ResumeQuestionExperience } from '@/app/api/apply/types';

import {
  mapResumeQuestionExperienceToCoverLetter,
  mapResumeQuestionExperiencesToCoverLetter,
} from './mapResumeQuestionExperience';

describe('mapResumeQuestionExperienceToCoverLetter', () => {
  test('maps resume question experience into cover letter experience view', () => {
    const item: ResumeQuestionExperience = {
      experienceId: 7,
      type: 'CAREER',
      title: '  인턴 ',
      oneLineIntro: '  API 개발 ',
      startDate: '2024-01-01',
      endDate: '2024-06-30',
      usageFitScore: 75,
    };

    expect(mapResumeQuestionExperienceToCoverLetter(item)).toEqual({
      fitScore: 75,
      experience: {
        id: '7',
        type: 'career',
        title: '인턴',
        description: 'API 개발',
        startDate: '2024-01-01',
        endDate: '2024-06-30',
        period: '2024.01.01~06.30',
        detailInfo: [],
        basicDetail: {},
        skillTags: [],
        competencyTags: [],
        detail: {
          situation: '',
          task: '',
          action: '',
          result: '',
          taken: '',
        },
      },
    });
  });
});

describe('mapResumeQuestionExperiencesToCoverLetter', () => {
  test('maps multiple experiences', () => {
    const experiences: ResumeQuestionExperience[] = [
      {
        experienceId: 1,
        type: 'ETC',
        title: 'A',
        oneLineIntro: 'B',
        startDate: '',
        endDate: '',
        usageFitScore: 10,
      },
    ];

    expect(mapResumeQuestionExperiencesToCoverLetter(experiences)).toHaveLength(1);
  });
});
