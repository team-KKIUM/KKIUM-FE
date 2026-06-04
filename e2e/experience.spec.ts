import { expect, test, type Page } from '@playwright/test';

import { mockExperienceApi, mockUserProfileApi } from './fixtures/api';
import { mockAuthenticatedSession } from './fixtures/auth';

async function setupAuthenticatedExperiencePage(page: Page) {
  await mockAuthenticatedSession(page);
  await mockUserProfileApi(page);
  await mockExperienceApi(page);
}

test('인증 상태에서 경험 목록을 보고 상세 패널을 열고 닫는다', async ({ page }) => {
  await setupAuthenticatedExperiencePage(page);

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

test('경험 카테고리 필터로 목록을 좁힌다', async ({ page }) => {
  await setupAuthenticatedExperiencePage(page);

  await page.goto('/experience');
  await page.getByRole('tab', { name: '인턴/직무경력' }).click();

  await expect(page).toHaveURL(/category=career/);
  await expect(page.getByRole('button', { name: /E2E 커리어 경험/ })).toBeVisible();
  await expect(page.getByRole('button', { name: /E2E 경험 카드/ })).toHaveCount(0);
});

test('검색어로 경험 목록을 필터링한다', async ({ page }) => {
  await setupAuthenticatedExperiencePage(page);

  await page.goto('/experience');
  await page
    .getByPlaceholder('경험 제목, 기술 태그, 역량 태그를 검색해주세요')
    .fill('검색 대상');

  await expect(page.getByRole('button', { name: /E2E 검색 대상 경험/ })).toBeVisible();
  await expect(page.getByRole('button', { name: /E2E 경험 카드/ })).toHaveCount(0);
});

test('상세 패널에서 상세 페이지로 확장하고 다시 패널로 돌아온다', async ({ page }) => {
  await setupAuthenticatedExperiencePage(page);

  await page.goto('/experience');

  const experienceCard = page.getByRole('button', { name: /E2E 경험 카드/ }).first();
  await experienceCard.click();

  await expect(page.getByRole('dialog', { name: '상세 경험' })).toBeVisible();
  await page.getByRole('button', { name: '경험 상세 확장 보기' }).click();

  await expect(page).toHaveURL(/view=detail/);
  await expect(page.getByRole('heading', { name: '상세 경험' })).toBeVisible();
  await expect(page.getByText('E2E 상세 한 줄 소개')).toBeVisible();

  await page.getByRole('button', { name: '경험 상세 패널로 돌아가기' }).click();

  await expect(page).toHaveURL(/selected=1/);
  await expect(page.getByRole('dialog', { name: '상세 경험' })).toBeVisible();
});

test('잘못된 상세 URL은 404 화면을 보여준다', async ({ page }) => {
  await setupAuthenticatedExperiencePage(page);

  await page.goto('/experience?view=detail&selected=abc');

  await expect(page.getByRole('heading', { name: 'Page Not Found' })).toBeVisible();
});
