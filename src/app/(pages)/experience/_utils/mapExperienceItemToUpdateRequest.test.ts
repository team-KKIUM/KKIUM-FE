import { mapExperienceItemToUpdateRequest } from './mapExperienceItemToUpdateRequest';

type ExperienceUpdateSource = Parameters<typeof mapExperienceItemToUpdateRequest>[0];

function createExperience(override: Partial<ExperienceUpdateSource> = {}): ExperienceUpdateSource {
  return {
    type: 'activity',
    title: '경험 제목',
    description: '한 줄 소개',
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    basicDetail: {
      name: '프로젝트',
      teamNum: '4',
      role: '프론트엔드',
      contributionRate: '70',
    },
    skillTags: ['React', 'TypeScript'],
    competencyTags: ['협업', '문제 해결'],
    detail: {
      situation: '상황',
      task: '과제',
      action: '행동',
      result: '결과',
      taken: '배운 점',
    },
    ...override,
  };
}

describe('mapExperienceItemToUpdateRequest', () => {
  test('maps common fields, tags, STAR fields, and activity detail', () => {
    expect(mapExperienceItemToUpdateRequest(createExperience())).toEqual({
      title: '경험 제목',
      oneLineIntro: '한 줄 소개',
      tags: [
        { category: 'TECH', field: 'React' },
        { category: 'TECH', field: 'TypeScript' },
        { category: 'COMPETENCY', field: '협업' },
        { category: 'COMPETENCY', field: '문제 해결' },
      ],
      situation: '상황',
      task: '과제',
      act: '행동',
      result: '결과',
      taken: '배운 점',
      detail: {
        name: '프로젝트',
        teamNum: 4,
        role: '프론트엔드',
        contributionRate: 70,
        startDate: '2024-01-01',
        endDate: '2024-12-31',
      },
    });
  });

  test('omits invalid activity numeric fields as undefined', () => {
    const request = mapExperienceItemToUpdateRequest(
      createExperience({
        basicDetail: {
          name: '프로젝트',
          teamNum: ' ',
          role: '프론트엔드',
          contributionRate: 'abc',
        },
      }),
    );

    expect(request.detail).toEqual({
      name: '프로젝트',
      teamNum: undefined,
      role: '프론트엔드',
      contributionRate: undefined,
      startDate: '2024-01-01',
      endDate: '2024-12-31',
    });
  });

  test('maps career detail', () => {
    const request = mapExperienceItemToUpdateRequest(
      createExperience({
        type: 'career',
        basicDetail: {
          name: '인턴십',
          company: '키움랩',
          employmentStatus: '인턴',
        },
      }),
    );

    expect(request.detail).toEqual({
      name: '인턴십',
      company: '키움랩',
      employmentStatus: '인턴',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
    });
  });

  test('maps education detail', () => {
    const request = mapExperienceItemToUpdateRequest(
      createExperience({
        type: 'education',
        basicDetail: {
          organizationName: '교육기관',
          name: '프론트엔드 과정',
        },
      }),
    );

    expect(request.detail).toEqual({
      organizationName: '교육기관',
      name: '프론트엔드 과정',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
    });
  });

  test('maps etc detail with only period fields', () => {
    const request = mapExperienceItemToUpdateRequest(
      createExperience({
        type: 'etc',
        basicDetail: {},
      }),
    );

    expect(request.detail).toEqual({
      startDate: '2024-01-01',
      endDate: '2024-12-31',
    });
  });
});
