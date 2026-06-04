import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';

import {
  mockApplyDetailApi,
  mockApplyListApi,
  mockUserProfileApi,
} from './fixtures/api';
import { mockAuthenticatedSession } from './fixtures/auth';

async function setupAuthenticatedApplyPage(page: Page) {
  await mockAuthenticatedSession(page);
  await mockUserProfileApi(page);
  await mockApplyListApi(page);
}

test('인증 상태에서 지원 목록을 보여준다', async ({ page }) => {
  await setupAuthenticatedApplyPage(page);

  await page.goto('/apply/list');

  await expect(page.getByRole('heading', { name: '지원 관리' })).toBeVisible();
  await expect(page.getByText('E2E 지원 공고')).toBeVisible();
  await expect(page.getByText('끼움테스트')).toBeVisible();
});

test('지원 공고에서 자기소개서 작성 화면으로 이동한다', async ({ page }) => {
  await setupAuthenticatedApplyPage(page);
  await mockApplyDetailApi(page);

  await page.goto('/apply/list');
  await page.getByRole('link', { name: '자기소개서 작성하기' }).click();

  await expect(page).toHaveURL(/\/apply\/?\?jdId=1/);
  await expect(page.getByRole('heading', { name: 'E2E 지원 공고' })).toBeVisible();
  await expect(page.getByRole('heading', { name: '공고 분석' })).toBeVisible();
  await expect(page.getByRole('heading', { name: '내 경험' })).toBeVisible();
  await expect(page.getByText('사용자 경험 개선')).toBeVisible();

  await page.getByRole('button', { name: '자기소개서 작성' }).click();

  await expect(page.getByRole('heading', { name: '경험 선택 및 자기소개서 작성' })).toBeVisible();
  await expect(page.getByText('지원 동기를 작성해주세요.')).toBeVisible();
  await expect(page.getByPlaceholder('여기에 자기소개서를 작성해보세요.')).toBeVisible();
  await expect(page.getByText('선택된 경험이 여기에 표시됩니다')).toBeVisible();
});
