import type { ExperienceCardResponse, ExperienceDetailResponse } from '@/app/api/experience/types';

import { mapExperienceCardToItem, mapExperienceDetailToItem } from './mapExperienceResponse';

describe('mapExperienceCardToItem', () => {
  test('maps list card response to experience item', () => {
    const response: ExperienceCardResponse = {
      pieceId: 1,
      experienceId: 10,
      type: 'ACTIVITY',
      title: '프로젝트 경험',
      oneLineIntro: '서비스 리뉴얼',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      tags: [
        { category: 'TECH', field: 'React' },
        { category: 'TECH', field: 'TypeScript' },
        { category: 'COMPETENCY', field: '문제 해결' },
      ],
    };

    expect(mapExperienceCardToItem(response)).toEqual({
      id: '10',
      type: 'activity',
      title: '프로젝트 경험',
      description: '서비스 리뉴얼',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      period: '2024.01.01~12.31',
      detailInfo: [{ label: '기간', value: '2024.01.01~12.31' }],
      basicDetail: {},
      skillTags: ['React', 'TypeScript'],
      competencyTags: ['문제 해결'],
      detail: {
        situation: '',
        task: '',
        action: '',
        result: '',
        taken: '',
      },
    });
  });
});

describe('mapExperienceDetailToItem', () => {
  const detailBase = {
    pieceId: 1,
    experienceId: 20,
    title: '상세 경험',
    oneLineIntro: '상세 한 줄 소개',
    tags: [
      { category: 'TECH', field: 'Next.js' },
      { category: 'COMPETENCY', field: '협업' },
    ],
    situation: '상황',
    task: '과제',
    act: '행동',
    result: '결과',
    taken: '배운 점',
  } satisfies Omit<ExperienceDetailResponse, 'type' | 'detail'>;

  test('maps activity detail fields', () => {
    const response: ExperienceDetailResponse = {
      ...detailBase,
      experienceId: 21,
      type: 'ACTIVITY',
      detail: {
        name: '프로젝트',
        teamNum: 4,
        role: '프론트엔드',
        contributionRate: 70,
        startDate: '2023-03-01',
        endDate: '2023-08-31',
      },
    };

    const item = mapExperienceDetailToItem(response);

    expect(item).toMatchObject({
      id: '21',
      type: 'activity',
      title: '상세 경험',
      description: '상세 한 줄 소개',
      startDate: '2023-03-01',
      endDate: '2023-08-31',
      period: '2023.03.01~08.31',
      basicDetail: {
        name: '프로젝트',
        teamNum: '4',
        role: '프론트엔드',
        contributionRate: '70',
      },
      skillTags: ['Next.js'],
      competencyTags: ['협업'],
      detail: {
        situation: '상황',
        task: '과제',
        action: '행동',
        result: '결과',
        taken: '배운 점',
      },
    });
    expect(item.detailInfo).toEqual([
      { label: '기간', value: '2023.03.01~08.31' },
      { label: '팀원 수', value: '4명' },
      { label: '내 역할', value: '프론트엔드' },
      { label: '기여도', value: '70%' },
    ]);
  });

  test('maps career detail fields', () => {
    const response: ExperienceDetailResponse = {
      ...detailBase,
      type: 'CAREER',
      detail: {
        name: '인턴십',
        company: '키움랩',
        employmentStatus: '인턴',
        startDate: '2022-01-01',
        endDate: '2023-02-28',
      },
    };

    expect(mapExperienceDetailToItem(response)).toMatchObject({
      type: 'career',
      period: '2022.01.01~2023.02.28',
      basicDetail: {
        name: '인턴십',
        company: '키움랩',
        employmentStatus: '인턴',
      },
      detailInfo: [
        { label: '기간', value: '2022.01.01~2023.02.28' },
        { label: '회사/기관/단체명', value: '키움랩' },
        { label: '고용 형태', value: '인턴' },
      ],
    });
  });

  test('maps education detail fields', () => {
    const response: ExperienceDetailResponse = {
      ...detailBase,
      type: 'EDUCATION',
      detail: {
        organizationName: '교육기관',
        name: '프론트엔드 과정',
        startDate: '2024-04-01',
        endDate: '2024-06-30',
      },
    };

    expect(mapExperienceDetailToItem(response)).toMatchObject({
      type: 'education',
      period: '2024.04.01~06.30',
      basicDetail: {
        organizationName: '교육기관',
        name: '프론트엔드 과정',
      },
      detailInfo: [
        { label: '기간', value: '2024.04.01~06.30' },
        { label: '기관명', value: '교육기관' },
        { label: '수강명', value: '프론트엔드 과정' },
      ],
    });
  });

  test('maps etc detail fields', () => {
    const response: ExperienceDetailResponse = {
      ...detailBase,
      type: 'ETC',
      detail: {
        startDate: '2024-07-01',
        endDate: '2024-07-31',
      },
    };

    expect(mapExperienceDetailToItem(response)).toMatchObject({
      type: 'etc',
      period: '2024.07.01~07.31',
      basicDetail: {},
      detailInfo: [{ label: '기간', value: '2024.07.01~07.31' }],
    });
  });
});
