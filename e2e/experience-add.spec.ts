import { expect, test } from '@playwright/test';

import { mockUserProfileApi } from './fixtures/api';
import { mockAuthenticatedSession } from './fixtures/auth';

test('인증 상태에서 경험 추가 첫 단계에서 기본 정보 단계로 이동한다', async ({ page }) => {
  await mockAuthenticatedSession(page);
  await mockUserProfileApi(page);

  await page.goto('/experience/add');

  await expect(page.getByRole('heading', { name: '경험 추가하기' })).toBeVisible();
  await expect(page.getByRole('heading', { name: '자료 업로드' })).toBeVisible();
  await expect(page.getByRole('button', { name: '자료 추가하기' })).toBeVisible();

  await page.getByRole('button', { name: '다음' }).click();

  await expect(page.getByRole('heading', { name: '기본 정보 입력' })).toBeVisible();
});
