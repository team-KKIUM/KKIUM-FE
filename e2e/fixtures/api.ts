import type { Page, Route } from '@playwright/test';

type ApiResponse<T> = {
  status: number;
  code: string;
  message: string;
  data: T;
};

function createApiSuccess<T>(data: T): ApiResponse<T> {
  return {
    status: 200,
    code: 'SUCCESS',
    message: '성공',
    data,
  };
}

async function fulfillApiSuccess<T>(route: Route, data: T) {
  await route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify(createApiSuccess(data)),
  });
}

async function fulfillUnmockedApi(route: Route) {
  await route.fulfill({
    status: 404,
    contentType: 'application/json',
    body: JSON.stringify({
      status: 404,
      code: 'NOT_FOUND',
      message: `E2E mock is not registered for ${route.request().method()} ${route.request().url()}`,
      data: null,
    }),
  });
}

function throwUnexpectedApiMethod(route: Route): never {
  const request = route.request();

  throw new Error(`Unexpected E2E API method: ${request.method()} ${request.url()}`);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

const experienceCards = [
  {
    pieceId: 101,
    experienceId: 1,
    type: 'ACTIVITY',
    title: 'E2E 경험 카드',
    oneLineIntro: 'E2E 한 줄 소개',
    startDate: '2026-01-01',
    endDate: '2026-02-01',
    tags: [
      { category: 'TECH', field: 'Playwright' },
      { category: 'COMPETENCY', field: '문제해결' },
    ],
  },
  {
    pieceId: 102,
    experienceId: 2,
    type: 'CAREER',
    title: 'E2E 커리어 경험',
    oneLineIntro: 'E2E 커리어 한 줄 소개',
    startDate: '2026-02-01',
    endDate: '2026-03-01',
    tags: [
      { category: 'TECH', field: 'React' },
      { category: 'COMPETENCY', field: '협업' },
    ],
  },
  {
    pieceId: 103,
    experienceId: 3,
    type: 'ETC',
    title: 'E2E 검색 대상 경험',
    oneLineIntro: '검색 대상 한 줄 소개',
    startDate: '2026-03-01',
    endDate: '2026-04-01',
    tags: [
      { category: 'TECH', field: '검색태그' },
      { category: 'COMPETENCY', field: '집중력' },
    ],
  },
];

type ExperienceDetailMock = Record<string, unknown>;

const experienceDetails: Record<string, ExperienceDetailMock> = {
  1: {
    ...experienceCards[0],
    oneLineIntro: 'E2E 상세 한 줄 소개',
    situation: 'E2E 상황',
    task: 'E2E 과제',
    act: 'E2E 행동',
    result: 'E2E 결과',
    taken: 'E2E 배운 점',
    detail: {
      name: 'E2E 활동',
      teamNum: 4,
      role: '프론트엔드',
      contributionRate: 80,
      startDate: '2026-01-01',
      endDate: '2026-02-01',
    },
  },
  2: {
    ...experienceCards[1],
    situation: 'E2E 커리어 상황',
    task: 'E2E 커리어 과제',
    act: 'E2E 커리어 행동',
    result: 'E2E 커리어 결과',
    taken: 'E2E 커리어 배운 점',
    detail: {
      name: 'E2E 커리어',
      company: '끼움컴퍼니',
      employmentStatus: '인턴',
      startDate: '2026-02-01',
      endDate: '2026-03-01',
    },
  },
  3: {
    ...experienceCards[2],
    situation: 'E2E 검색 상황',
    task: 'E2E 검색 과제',
    act: 'E2E 검색 행동',
    result: 'E2E 검색 결과',
    taken: 'E2E 검색 배운 점',
    detail: {
      startDate: '2026-03-01',
      endDate: '2026-04-01',
    },
  },
};

function getMockExperienceCards(url: URL) {
  const type = url.searchParams.get('type');
  const keyword = url.searchParams.get('keyword')?.trim().toLowerCase() ?? '';

  return experienceCards.filter((experience) => {
    const matchesType = !type || experience.type === type;
    const matchesKeyword =
      keyword.length === 0 ||
      [experience.title, experience.oneLineIntro, ...experience.tags.map((tag) => tag.field)].some(
        (value) => value.toLowerCase().includes(keyword),
      );

    return matchesType && matchesKeyword;
  });
}

export async function mockUserProfileApi(page: Page) {
  await page.route('**/api/v1/users/me/profile', async (route) => {
    await fulfillApiSuccess(route, {
      name: 'E2E 사용자',
      email: 'e2e@kkium.test',
      illustrateId: 1,
    });
  });
}

export async function mockExperienceApi(page: Page) {
  await page.route('**/api/v1/experiences**', async (route) => {
    const request = route.request();
    const url = new URL(request.url());

    if (request.method() !== 'GET') {
      throwUnexpectedApiMethod(route);
    }

    if (url.pathname === '/api/v1/experiences') {
      await fulfillApiSuccess(route, {
        hasNext: false,
        nextCursor: null,
        experiences: getMockExperienceCards(url),
      });
      return;
    }

    const experienceId = url.pathname.match(/^\/api\/v1\/experiences\/(\d+)$/)?.[1];
    const experienceDetail = experienceId ? experienceDetails[experienceId] : undefined;

    if (experienceDetail) {
      await fulfillApiSuccess(route, experienceDetail);
      return;
    }

    await fulfillUnmockedApi(route);
  });
}

export async function mockExperienceCreateApi(page: Page) {
  await page.route('**/api/v1/experiences', async (route) => {
    const request = route.request();
    const url = new URL(request.url());

    if (request.method() !== 'POST') {
      throwUnexpectedApiMethod(route);
    }

    if (url.pathname === '/api/v1/experiences') {
      const requestBody = request.postDataJSON();

      if (!isRecord(requestBody)) {
        throw new Error(`Unexpected E2E create experience body: ${request.postData() ?? ''}`);
      }

      await fulfillApiSuccess(route, null);
      return;
    }

    await fulfillUnmockedApi(route);
  });
}

export async function mockApplyListApi(page: Page) {
  await page.route('**/api/v1/jd**', async (route) => {
    const request = route.request();
    const url = new URL(request.url());

    if (request.method() !== 'GET') {
      throwUnexpectedApiMethod(route);
    }

    if (url.pathname === '/api/v1/jd') {
      await fulfillApiSuccess(route, {
        content: [
          {
            jdId: 1,
            postingTitle: 'E2E 지원 공고',
            companyName: '끼움테스트',
            recruitmentField: '프론트엔드',
            startDate: '2026-03-01',
            endDate: '2026-03-31',
            isTarget: false,
            questions: ['지원 동기를 작성해주세요.'],
          },
        ],
        page: 0,
        totalPages: 1,
        last: true,
      });
      return;
    }

    await fulfillUnmockedApi(route);
  });
}

export async function mockApplyDetailApi(page: Page) {
  await page.route('**/api/v1/jd/**', async (route) => {
    const request = route.request();
    const url = new URL(request.url());

    if (request.method() !== 'GET') {
      throwUnexpectedApiMethod(route);
    }

    if (url.pathname === '/api/v1/jd/1/resume') {
      await fulfillApiSuccess(route, {
        id: 1,
        postingTitle: 'E2E 지원 공고',
        companyName: '끼움테스트',
        recruitmentField: '프론트엔드',
        startDate: '2026-03-01',
        endDate: '2026-03-31',
        questions: [
          {
            questionId: 1,
            orderNum: 1,
            content: '지원 동기를 작성해주세요.',
            answer: '',
            aiDraft: '',
            hasAiDraft: false,
          },
        ],
      });
      return;
    }

    if (url.pathname === '/api/v1/jd/1/analysis') {
      await fulfillApiSuccess(route, {
        analysisStatus: 'COMPLETED',
        jdInfo: {
          postingTitle: 'E2E 지원 공고',
          companyName: '끼움테스트',
          recruitmentField: '프론트엔드',
          startDate: '2026-03-01',
          endDate: '2026-03-31',
          hardSkills: ['Playwright', 'React'],
          softSkills: ['문제해결'],
          mainResponsibilities: '사용자 경험 개선\n프론트엔드 품질 관리',
          requiredQualifications: 'React 경험\n테스트 자동화 경험',
          preferredQualifications: 'E2E 테스트 운영 경험',
        },
        matchResult: {
          applicationFitScore: 82,
          experiences: [
            {
              experienceId: 1,
              type: 'ACTIVITY',
              title: 'E2E 경험 카드',
              oneLineIntro: 'E2E 한 줄 소개',
              tags: [
                { category: 'TECH', field: 'Playwright' },
                { category: 'COMPETENCY', field: '문제해결' },
              ],
              usageFitScore: 91,
            },
          ],
        },
      });
      return;
    }

    await fulfillUnmockedApi(route);
  });

  await page.route('**/api/v1/resume/jd/**', async (route) => {
    const request = route.request();
    const url = new URL(request.url());

    if (request.method() !== 'GET') {
      throwUnexpectedApiMethod(route);
    }

    if (url.pathname === '/api/v1/resume/jd/1/questions/1/experiences') {
      await fulfillApiSuccess(route, {
        experiences: [
          {
            experienceId: 1,
            type: 'ACTIVITY',
            title: 'E2E 경험 카드',
            oneLineIntro: 'E2E 한 줄 소개',
            startDate: '2026-01-01',
            endDate: '2026-02-01',
            usageFitScore: 91,
          },
        ],
      });
      return;
    }

    await fulfillUnmockedApi(route);
  });
}
