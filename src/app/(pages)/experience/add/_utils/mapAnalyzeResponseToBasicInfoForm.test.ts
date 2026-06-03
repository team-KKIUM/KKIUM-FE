import type { ExperienceAnalyzeResponse } from '@/app/api/experience/add/types';

import {
  mapAnalyzeResponseToBasicInfoForm,
  mapAnalyzeResponseToCoreInfoForm,
  mapAnalyzeResponseToResultInfoForm,
} from './mapAnalyzeResponseToBasicInfoForm';

function createAnalyzeResponse(
  override: Partial<ExperienceAnalyzeResponse> = {},
): ExperienceAnalyzeResponse {
  return {
    title: '분석된 제목',
    oneLineIntro: '분석된 한 줄 소개',
    activityInfo: null,
    careerInfo: null,
    educationInfo: null,
    situation: '상황',
    task: '과제',
    act: '행동',
    result: '결과',
    taken: '배운 점',
    tags: [],
    ...override,
  };
}

describe('mapAnalyzeResponseToBasicInfoForm', () => {
  test('maps activity analyze info to basic info form', () => {
    const response = createAnalyzeResponse({
      activityInfo: {
        name: '프로젝트',
        teamNum: 4,
        role: '프론트엔드',
        contributionRate: 70,
        startDate: '2024-01-01',
        endDate: '2024-12-31',
      },
    });

    expect(mapAnalyzeResponseToBasicInfoForm(response)).toEqual({
      type: 'activity',
      title: '분석된 제목',
      oneLineIntro: '분석된 한 줄 소개',
      teamNum: '4',
      role: '프론트엔드',
      contributionRate: '70',
      company: '',
      employmentStatus: '',
      organizationName: '',
      name: '',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
    });
  });

  test('maps career analyze info to basic info form', () => {
    const response = createAnalyzeResponse({
      careerInfo: {
        name: '인턴십',
        company: '키움랩',
        employmentStatus: '인턴',
        startDate: '2023-01-01',
        endDate: '2023-06-30',
      },
    });

    expect(mapAnalyzeResponseToBasicInfoForm(response)).toMatchObject({
      type: 'career',
      company: '키움랩',
      employmentStatus: '인턴',
      startDate: '2023-01-01',
      endDate: '2023-06-30',
    });
  });

  test('maps education analyze info to basic info form', () => {
    const response = createAnalyzeResponse({
      educationInfo: {
        organizationName: '교육기관',
        name: '프론트엔드 과정',
        startDate: '2024-03-01',
        endDate: '2024-05-31',
      },
    });

    expect(mapAnalyzeResponseToBasicInfoForm(response)).toMatchObject({
      type: 'education',
      organizationName: '교육기관',
      name: '프론트엔드 과정',
      startDate: '2024-03-01',
      endDate: '2024-05-31',
    });
  });

  test('uses etc type and empty strings when type-specific info is missing', () => {
    const response = createAnalyzeResponse({
      title: null,
      oneLineIntro: null,
    });

    expect(mapAnalyzeResponseToBasicInfoForm(response)).toEqual({
      type: 'etc',
      title: '',
      oneLineIntro: '',
      teamNum: '',
      role: '',
      contributionRate: '',
      company: '',
      employmentStatus: '',
      organizationName: '',
      name: '',
      startDate: '',
      endDate: '',
    });
  });
});

describe('mapAnalyzeResponseToCoreInfoForm', () => {
  test('maps core fields and converts null values to empty strings', () => {
    const response = createAnalyzeResponse({
      task: null,
      result: null,
    });

    expect(mapAnalyzeResponseToCoreInfoForm(response)).toEqual({
      situation: '상황',
      task: '',
      act: '행동',
      result: '',
      taken: '배운 점',
    });
  });
});

describe('mapAnalyzeResponseToResultInfoForm', () => {
  test('splits tags by category', () => {
    const response = createAnalyzeResponse({
      tags: [
        { category: 'TECH', field: 'React' },
        { category: 'COMPETENCY', field: '협업' },
        { category: 'TECH', field: 'TypeScript' },
      ],
    });

    expect(mapAnalyzeResponseToResultInfoForm(response)).toEqual({
      skillTags: ['React', 'TypeScript'],
      competencyTags: ['협업'],
    });
  });
});
