import { expect, test } from '@playwright/test';

// dev 서버 병렬 부하에서 로그인 화면 로딩과 보호 라우트 리다이렉트가 불안정해 순차 실행한다.
test.describe.configure({ mode: 'serial' });

const AUTH_REDIRECT_TIMEOUT = 15_000;

test('로그인 페이지에서 OAuth 로그인 버튼을 보여준다', async ({ page }) => {
  await page.goto('/login', { waitUntil: 'domcontentloaded' });

  await expect(page.getByAltText('KKIUM 로고')).toBeVisible();
  await expect(page.getByRole('button', { name: '카카오로 로그인' })).toBeVisible();
  await expect(page.getByRole('button', { name: '구글로 로그인' })).toBeVisible();
});

test.describe('보호 라우트', () => {
  const protectedRoutes = ['/experience', '/experience/add', '/apply/list', '/apply'] as const;

  for (const route of protectedRoutes) {
    test(`인증되지 않은 사용자는 ${route}에서 로그인으로 이동한다`, async ({ page }) => {
      await page.goto(route, { waitUntil: 'domcontentloaded' });

      await expect(page).toHaveURL(/\/login\/?(?:\?.*)?$/, { timeout: AUTH_REDIRECT_TIMEOUT });
      await expect(page.getByRole('button', { name: '카카오로 로그인' })).toBeVisible();
    });
  }
});
