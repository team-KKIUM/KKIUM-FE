import { expect, test } from '@playwright/test';

import { mockApplyListApi, mockUserProfileApi } from './fixtures/api';
import { mockAuthenticatedSession } from './fixtures/auth';

test('인증 상태에서 지원 목록을 보여준다', async ({ page }) => {
  await mockAuthenticatedSession(page);
  await mockUserProfileApi(page);
  await mockApplyListApi(page);

  await page.goto('/apply/list');

  await expect(page.getByRole('heading', { name: '지원 관리' })).toBeVisible();
  await expect(page.getByText('E2E 지원 공고')).toBeVisible();
  await expect(page.getByText('끼움테스트')).toBeVisible();
});
