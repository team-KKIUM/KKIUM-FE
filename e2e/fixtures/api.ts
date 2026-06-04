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
      await fulfillApiSuccess(route, null);
      return;
    }

    if (url.pathname === '/api/v1/experiences') {
      await fulfillApiSuccess(route, {
        hasNext: false,
        nextCursor: null,
        experiences: [
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
        ],
      });
      return;
    }

    if (url.pathname === '/api/v1/experiences/1') {
      await fulfillApiSuccess(route, {
        pieceId: 101,
        experienceId: 1,
        type: 'ACTIVITY',
        title: 'E2E 경험 카드',
        oneLineIntro: 'E2E 상세 한 줄 소개',
        situation: 'E2E 상황',
        task: 'E2E 과제',
        act: 'E2E 행동',
        result: 'E2E 결과',
        taken: 'E2E 배운 점',
        tags: [
          { category: 'TECH', field: 'Playwright' },
          { category: 'COMPETENCY', field: '문제해결' },
        ],
        detail: {
          name: 'E2E 활동',
          teamNum: 4,
          role: '프론트엔드',
          contributionRate: 80,
          startDate: '2026-01-01',
          endDate: '2026-02-01',
        },
      });
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
      await fulfillApiSuccess(route, null);
      return;
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
