import type { JdAnalysisResponse } from '@/app/api/apply/types';

import { mapJdAnalysisToView } from './mapJdAnalysisToView';

describe('mapJdAnalysisToView', () => {
  test('maps analysis response into view model', () => {
    const data = {
      analysisStatus: 'COMPLETED',
      jdInfo: {
        postingTitle: '백엔드 개발자',
        companyName: 'KKIUM',
        recruitmentField: 'Server Developer',
        startDate: '2026-04-01',
        endDate: '2026-04-28',
        hardSkills: [' Kafka ', ''],
        softSkills: ['주인의식'],
        mainResponsibilities: 'API 개발\n\n배포 자동화',
        requiredQualifications: 'Java 경험',
        preferredQualifications: '',
      },
      matchResult: {
        applicationFitScore: 82,
        experiences: [],
      },
    } as JdAnalysisResponse;

    const view = mapJdAnalysisToView(data);

    expect(view.fitScore).toBe(82);
    expect(view.jobInfo).toMatchObject({
      postingTitle: '백엔드 개발자',
      companyName: 'KKIUM',
      jobField: 'Server Developer',
    });
    expect(view.tags.skills).toEqual([{ label: 'Kafka', on: true }]);
    expect(view.tags.competencies).toEqual([{ label: '주인의식', on: true }]);
    expect(view.sections).toEqual([
      { title: '주요 업무', items: ['API 개발', '배포 자동화'] },
      { title: '자격 요건', items: ['Java 경험'] },
    ]);
  });

  test('returns empty sections and 상시 채용 when jdInfo is missing', () => {
    const view = mapJdAnalysisToView({
      analysisStatus: 'PENDING',
      jdInfo: null,
      matchResult: null,
    } as JdAnalysisResponse);

    expect(view.fitScore).toBeUndefined();
    expect(view.jobInfo.period).toBe('상시 채용');
    expect(view.sections).toEqual([]);
  });
});
