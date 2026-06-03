import {
  createEmptyBasicInfoForm,
  createEmptyCoreInfoForm,
  createEmptyResultInfoForm,
  type ExperienceAddBasicInfoForm,
  type ExperienceAddCoreInfoForm,
  type ExperienceAddResultInfoForm,
} from '@/app/(pages)/experience/add/_types/experienceAddForm';

import {
  getExperienceAddNextStepDisabled,
  isBasicInfoComplete,
  isCoreInfoComplete,
  isResultStepComplete,
} from './experienceAddValidation';

type NextStepDisabledParams = Parameters<typeof getExperienceAddNextStepDisabled>[0];

function createBasicInfo(
  override: Partial<ExperienceAddBasicInfoForm> = {},
): ExperienceAddBasicInfoForm {
  return {
    ...createEmptyBasicInfoForm(),
    type: 'activity',
    title: '경험 제목',
    oneLineIntro: '한 줄 소개',
    teamNum: '5',
    role: '프론트엔드',
    contributionRate: '70',
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
    skillTags: ['React'],
    competencyTags: ['협업'],
    ...override,
  };
}

function createNextStepDisabledParams(
  override: Partial<NextStepDisabledParams> = {},
): NextStepDisabledParams {
  return {
    isAnalyzing: false,
    isSaving: false,
    isBasicInfoStep: false,
    isCoreInfoStep: false,
    isResultStep: false,
    basicInfo: createBasicInfo(),
    coreInfo: createCoreInfo(),
    resultInfo: createResultInfo(),
    ...override,
  };
}

describe('isBasicInfoComplete', () => {
  test('returns false when experience type is missing', () => {
    expect(isBasicInfoComplete(createBasicInfo({ type: null }))).toBe(false);
  });

  test('validates activity required fields', () => {
    expect(isBasicInfoComplete(createBasicInfo())).toBe(true);
    expect(isBasicInfoComplete(createBasicInfo({ contributionRate: ' ' }))).toBe(false);
  });

  test('validates career required fields without activity fields', () => {
    expect(
      isBasicInfoComplete(
        createBasicInfo({
          type: 'career',
          teamNum: '',
          role: '',
          contributionRate: '',
          company: '키움랩',
          employmentStatus: '인턴',
        }),
      ),
    ).toBe(true);
  });

  test('validates education required fields', () => {
    expect(
      isBasicInfoComplete(
        createBasicInfo({
          type: 'education',
          teamNum: '',
          role: '',
          contributionRate: '',
          organizationName: '교육기관',
          name: '프론트엔드 과정',
        }),
      ),
    ).toBe(true);
  });

  test('validates etc required fields with only common fields', () => {
    expect(
      isBasicInfoComplete(
        createBasicInfo({
          type: 'etc',
          teamNum: '',
          role: '',
          contributionRate: '',
        }),
      ),
    ).toBe(true);
  });

  test('returns false when an etc required common field is missing', () => {
    expect(
      isBasicInfoComplete(
        createBasicInfo({
          type: 'etc',
          title: '',
          teamNum: '',
          role: '',
          contributionRate: '',
        }),
      ),
    ).toBe(false);
  });
});

describe('isCoreInfoComplete', () => {
  test('returns true when all core fields have text', () => {
    expect(isCoreInfoComplete(createCoreInfo())).toBe(true);
  });

  test('returns false when a core field is blank', () => {
    expect(isCoreInfoComplete(createCoreInfo({ task: ' ' }))).toBe(false);
  });
});

describe('isResultStepComplete', () => {
  test('returns true when basic info, core info, and both tag groups are complete', () => {
    expect(
      isResultStepComplete({
        basicInfo: createBasicInfo(),
        coreInfo: createCoreInfo(),
        resultInfo: createResultInfo(),
      }),
    ).toBe(true);
  });

  test('returns false when skillTags has no text', () => {
    expect(
      isResultStepComplete({
        basicInfo: createBasicInfo(),
        coreInfo: createCoreInfo(),
        resultInfo: createResultInfo({
          skillTags: [' '],
        }),
      }),
    ).toBe(false);
  });

  test('returns false when competencyTags has no text', () => {
    expect(
      isResultStepComplete({
        basicInfo: createBasicInfo(),
        coreInfo: createCoreInfo(),
        resultInfo: createResultInfo({
          competencyTags: [' '],
        }),
      }),
    ).toBe(false);
  });

  test('returns false when basicInfo is incomplete', () => {
    expect(
      isResultStepComplete({
        basicInfo: createBasicInfo({ title: '' }),
        coreInfo: createCoreInfo(),
        resultInfo: createResultInfo(),
      }),
    ).toBe(false);
  });

  test('returns false when coreInfo is incomplete', () => {
    expect(
      isResultStepComplete({
        basicInfo: createBasicInfo(),
        coreInfo: createCoreInfo({ situation: '' }),
        resultInfo: createResultInfo(),
      }),
    ).toBe(false);
  });
});

describe('getExperienceAddNextStepDisabled', () => {
  test('returns true while analyzing or saving', () => {
    expect(
      getExperienceAddNextStepDisabled(createNextStepDisabledParams({ isAnalyzing: true })),
    ).toBe(true);
    expect(getExperienceAddNextStepDisabled(createNextStepDisabledParams({ isSaving: true }))).toBe(
      true,
    );
  });

  test('validates basic info step state', () => {
    expect(
      getExperienceAddNextStepDisabled(
        createNextStepDisabledParams({
          isBasicInfoStep: true,
          basicInfo: createBasicInfo({ title: '' }),
        }),
      ),
    ).toBe(true);

    expect(
      getExperienceAddNextStepDisabled(
        createNextStepDisabledParams({
          isBasicInfoStep: true,
        }),
      ),
    ).toBe(false);
  });

  test('validates core info step state', () => {
    expect(
      getExperienceAddNextStepDisabled(
        createNextStepDisabledParams({
          isCoreInfoStep: true,
          coreInfo: createCoreInfo({ act: '' }),
        }),
      ),
    ).toBe(true);

    expect(
      getExperienceAddNextStepDisabled(
        createNextStepDisabledParams({
          isCoreInfoStep: true,
        }),
      ),
    ).toBe(false);
  });

  test('validates result step state', () => {
    expect(
      getExperienceAddNextStepDisabled(
        createNextStepDisabledParams({
          isResultStep: true,
          resultInfo: createResultInfo({ competencyTags: [] }),
        }),
      ),
    ).toBe(true);

    expect(
      getExperienceAddNextStepDisabled(
        createNextStepDisabledParams({
          isResultStep: true,
        }),
      ),
    ).toBe(false);
  });
});
