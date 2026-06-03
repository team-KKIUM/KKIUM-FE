import type { JdExperienceAnalysisResponse } from '@/app/api/apply/types';

import { mapJdExperienceAnalysisToView } from './mapJdExperienceAnalysisToView';

describe('mapJdExperienceAnalysisToView', () => {
  test('maps experience analysis response to view data', () => {
    const response: JdExperienceAnalysisResponse = {
      experienceId: 3,
      analysis: {
        strengths: '강점',
        weaknesses: '약점',
        usageGuide: '활용 가이드',
        highlightKeywords: [
          {
            keyword: 'Kafka',
            sources: ['mainResponsibilities'],
          },
        ],
      },
    };

    expect(mapJdExperienceAnalysisToView(response)).toEqual({
      goodPoints: '강점',
      badPoints: '약점',
      usageGuide: '활용 가이드',
      highlightKeywords: [
        {
          keyword: 'Kafka',
          sources: ['mainResponsibilities'],
        },
      ],
    });
  });
});
