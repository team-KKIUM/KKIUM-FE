import { expect, test } from '@playwright/test';

import { mockExperienceApi, mockUserProfileApi } from './fixtures/api';
import { mockAuthenticatedSession } from './fixtures/auth';

test('인증 상태에서 경험 목록을 보고 상세 패널을 열고 닫는다', async ({ page }) => {
  await mockAuthenticatedSession(page);
  await mockUserProfileApi(page);
  await mockExperienceApi(page);

  await page.goto('/experience');

  await expect(page.getByRole('heading', { name: '경험 관리' })).toBeVisible();
  await expect(page.getByRole('tablist', { name: '경험 유형 필터' })).toBeVisible();

  const experienceCard = page.getByRole('button', { name: /E2E 경험 카드/ }).first();
  await expect(experienceCard).toBeVisible();
  await experienceCard.click();

  const detailPanel = page.getByRole('dialog', { name: '상세 경험' });
  await expect(detailPanel).toBeVisible();
  await expect(page.getByText('E2E 상세 한 줄 소개')).toBeVisible();

  await page.getByRole('button', { name: '경험 상세 패널 닫기' }).click();
  await expect(detailPanel).toHaveCount(0);
});
