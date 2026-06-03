import type { JdAnalysisExperience } from '@/app/api/apply/types';

import { mapJdAnalysisExperienceToApplyMatch } from './mapJdAnalysisExperienceToApplyMatch';

describe('mapJdAnalysisExperienceToApplyMatch', () => {
  test('maps experience analysis item to apply match card model', () => {
    const experience: JdAnalysisExperience = {
      experienceId: 12,
      type: 'CAREER',
      title: '인턴 경험',
      oneLineIntro: 'API 성능 개선',
      tags: [
        { category: 'TECH', field: 'Spring' },
        { category: 'COMPETENCY', field: '협업' },
      ],
      usageFitScore: 88,
    };

    expect(mapJdAnalysisExperienceToApplyMatch(experience)).toEqual({
      id: '12',
      type: 'career',
      title: '인턴 경험',
      description: 'API 성능 개선',
      skillTags: ['Spring'],
      competencyTags: ['협업'],
      matchScore: 88,
      analysis: {
        goodPoints: '',
        badPoints: '',
        usageGuide: '',
      },
    });
  });
});
