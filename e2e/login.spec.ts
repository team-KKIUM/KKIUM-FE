import { expect, test } from '@playwright/test';

test('로그인 페이지에서 OAuth 로그인 버튼을 보여준다', async ({ page }) => {
  await page.goto('/login');

  await expect(page.getByAltText('KKIUM 로고')).toBeVisible();
  await expect(page.getByRole('button', { name: '카카오로 로그인' })).toBeVisible();
  await expect(page.getByRole('button', { name: '구글로 로그인' })).toBeVisible();
});

test('인증되지 않은 사용자는 보호 라우트에서 로그인으로 이동한다', async ({ page }) => {
  await page.goto('/experience');

  await expect(page).toHaveURL(/\/login\/?$/);
});
