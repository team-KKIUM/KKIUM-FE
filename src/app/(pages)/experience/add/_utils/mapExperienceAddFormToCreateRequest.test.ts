import {
  createEmptyBasicInfoForm,
  createEmptyCoreInfoForm,
  createEmptyResultInfoForm,
  type ExperienceAddBasicInfoForm,
  type ExperienceAddCoreInfoForm,
  type ExperienceAddResultInfoForm,
} from '@/app/(pages)/experience/add/_types/experienceAddForm';

import { mapExperienceAddFormToCreateRequest } from './mapExperienceAddFormToCreateRequest';

function createBasicInfo(
  override: Partial<ExperienceAddBasicInfoForm> = {},
): ExperienceAddBasicInfoForm {
  return {
    ...createEmptyBasicInfoForm(),
    type: 'activity',
    title: '경험 제목',
    oneLineIntro: '한 줄 소개',
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    ...override,
  };
}

function createCoreInfo(
  override: Partial<ExperienceAddCoreInfoForm> = {},
): ExperienceAddCoreInfoForm {
  return {
    ...createEmptyCoreInfoForm(),
    situation: '상황',
    task: '과제',
    act: '행동',
    result: '결과',
    taken: '배운 점',
    ...override,
  };
}

function createResultInfo(
  override: Partial<ExperienceAddResultInfoForm> = {},
): ExperienceAddResultInfoForm {
  return {
    ...createEmptyResultInfoForm(),
    skillTags: ['React', 'TypeScript'],
    competencyTags: ['협업', '문제 해결'],
    ...override,
  };
}

const etcCreateRequest = {
  type: 'ETC',
  title: '경험 제목',
  oneLineIntro: '한 줄 소개',
  startDate: '2024-01-01',
  endDate: '2024-12-31',
  situation: '상황',
  task: '과제',
  act: '행동',
  result: '결과',
  taken: '배운 점',
  tags: [],
} as const;

describe('mapExperienceAddFormToCreateRequest', () => {
  test('maps common fields, tags, and activity fields to create request', () => {
    const request = mapExperienceAddFormToCreateRequest({
      basicInfo: createBasicInfo({
        name: '프로젝트',
        teamNum: '5명',
        role: ' 프론트엔드 ',
        contributionRate: '70%',
      }),
      coreInfo: createCoreInfo(),
      resultInfo: createResultInfo(),
    });

    expect(request).toEqual({
      type: 'ACTIVITY',
      title: '경험 제목',
      oneLineIntro: '한 줄 소개',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      situation: '상황',
      task: '과제',
      act: '행동',
      result: '결과',
      taken: '배운 점',
      tags: [
        { category: 'TECH', field: 'React' },
        { category: 'TECH', field: 'TypeScript' },
        { category: 'COMPETENCY', field: '협업' },
        { category: 'COMPETENCY', field: '문제 해결' },
      ],
      name: '프로젝트',
      teamNum: 5,
      role: '프론트엔드',
      contributionRate: 70,
    });
  });

  test('uses title as activity name fallback and omits invalid numeric fields', () => {
    const request = mapExperienceAddFormToCreateRequest({
      basicInfo: createBasicInfo({
        name: ' ',
        teamNum: 'abc',
        contributionRate: '',
      }),
      coreInfo: createCoreInfo(),
      resultInfo: createResultInfo(),
    });

    expect(request).toMatchObject({
      type: 'ACTIVITY',
      name: '경험 제목',
      teamNum: undefined,
      contributionRate: undefined,
    });
  });

  test('maps career fields to create request', () => {
    const request = mapExperienceAddFormToCreateRequest({
      basicInfo: createBasicInfo({
        type: 'career',
        company: ' 키움랩 ',
        employmentStatus: ' 인턴 ',
      }),
      coreInfo: createCoreInfo(),
      resultInfo: createResultInfo(),
    });

    expect(request).toMatchObject({
      type: 'CAREER',
      company: '키움랩',
      employmentStatus: '인턴',
    });
  });

  test('maps education fields to create request', () => {
    const request = mapExperienceAddFormToCreateRequest({
      basicInfo: createBasicInfo({
        type: 'education',
        organizationName: ' 교육기관 ',
        name: ' ',
      }),
      coreInfo: createCoreInfo(),
      resultInfo: createResultInfo(),
    });

    expect(request).toMatchObject({
      type: 'EDUCATION',
      organizationName: '교육기관',
      name: '경험 제목',
    });
  });

  test('maps etc type to etc create request without type-specific fields', () => {
    const request = mapExperienceAddFormToCreateRequest({
      basicInfo: createBasicInfo({
        type: 'etc',
      }),
      coreInfo: createCoreInfo(),
      resultInfo: createResultInfo({
        skillTags: [],
        competencyTags: [],
      }),
    });

    expect(request).toEqual(etcCreateRequest);
  });

  test('maps missing type to etc create request without type-specific fields', () => {
    const request = mapExperienceAddFormToCreateRequest({
      basicInfo: createBasicInfo({
        type: null,
      }),
      coreInfo: createCoreInfo(),
      resultInfo: createResultInfo({
        skillTags: [],
        competencyTags: [],
      }),
    });

    expect(request).toEqual(etcCreateRequest);
  });
});
