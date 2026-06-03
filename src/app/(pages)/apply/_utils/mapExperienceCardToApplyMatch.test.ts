import type { ExperienceCardResponse } from '@/app/api/experience/types';

import { mapExperienceCardToApplyMatch } from './mapExperienceCardToApplyMatch';

describe('mapExperienceCardToApplyMatch', () => {
  test('maps experience card to apply match item', () => {
    const card: ExperienceCardResponse = {
      pieceId: 1,
      experienceId: 99,
      type: 'ACTIVITY',
      title: '동아리 활동',
      oneLineIntro: '프로젝트 리드',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      tags: [
        { category: 'TECH', field: 'React' },
        { category: 'COMPETENCY', field: '리더십' },
      ],
    };

    expect(mapExperienceCardToApplyMatch(card)).toEqual({
      id: '99',
      type: 'activity',
      title: '동아리 활동',
      description: '프로젝트 리드',
      skillTags: ['React'],
      competencyTags: ['리더십'],
      matchScore: 0,
      analysis: {
        goodPoints: '',
        badPoints: '',
        usageGuide: '',
      },
    });
  });
});
