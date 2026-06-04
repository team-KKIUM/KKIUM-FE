import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';

import { mockExperienceCreateApi, mockUserProfileApi } from './fixtures/api';
import { mockAuthenticatedSession } from './fixtures/auth';

async function setupAuthenticatedExperienceAddPage(page: Page) {
  await page.clock.setFixedTime(new Date('2026-03-15'));
  await mockAuthenticatedSession(page);
  await mockUserProfileApi(page);
}

async function selectCurrentMonthDateRange(page: Page) {
  await page.getByRole('button', { name: '0000년 00월 00일 ~ 0000년 00월 00일' }).click();

  const datePicker = page.getByRole('dialog', { name: '날짜 선택' });
  await datePicker.getByRole('button', { name: '1', exact: true }).first().click();
  await datePicker.getByRole('button', { name: '2', exact: true }).first().click();
}

async function fillEtcBasicInfo(page: Page) {
  await page.getByRole('button', { name: '기타' }).click();
  await page.getByPlaceholder('제목을 작성해주세요.').fill('E2E 직접 입력 경험');
  await page
    .getByPlaceholder('이 경험을 간단히 설명해주세요.')
    .fill('직접 입력으로 저장되는 경험입니다.');
  await selectCurrentMonthDateRange(page);
}

async function fillCoreInfo(page: Page) {
  await page
    .getByPlaceholder('이 경험을 통해 달성하고자 했던 목표를 구체적으로 작성해주세요.')
    .fill('사용자가 경험을 직접 입력해 저장할 수 있도록 검증했습니다.');
  await page
    .getByPlaceholder('직면했던 문제나 해결해야 했던 과제를 작성해주세요.')
    .fill('필수 입력값과 단계 이동을 함께 확인해야 했습니다.');
  await page
    .getByPlaceholder('문제 해결을 위해 구체적으로 어떤 행동을 했는지 작성해주세요.')
    .fill('기본 정보, 핵심 경험, 결과 확인 단계를 순서대로 입력했습니다.');
  await page
    .getByPlaceholder(
      '수치화된 성과(KPI)를 포함하여 결과를 작성해주세요. 예: 전환율 20% 상승, 참여자 100명 증가',
    )
    .fill('E2E 테스트에서 저장 완료 화면까지 도달했습니다.');
  await page
    .getByPlaceholder('이 경험을 통해 배운 점이나 성장한 부분을 작성해주세요.')
    .fill('직접 입력 플로우의 회귀를 빠르게 확인할 수 있습니다.');
}

async function addResultTags(page: Page) {
  await page.getByRole('button', { name: '기술 태그 수정' }).click();
  await page.getByLabel('기술 태그 입력').fill('Playwright');
  await page.getByRole('button', { name: 'Playwright 태그 추가' }).click();
  await page.getByRole('heading', { name: '결과 확인' }).click();

  await page.getByRole('button', { name: '역량 태그 수정' }).click();
  await page.getByLabel('역량 태그 입력').fill('꼼꼼함');
  await page.getByRole('button', { name: '꼼꼼함 태그 추가' }).click();
}

test('인증 상태에서 경험 추가 첫 단계에서 기본 정보 단계로 이동한다', async ({ page }) => {
  await setupAuthenticatedExperienceAddPage(page);

  await page.goto('/experience/add');

  await expect(page.getByRole('heading', { name: '경험 추가하기' })).toBeVisible();
  await expect(page.getByRole('heading', { name: '자료 업로드' })).toBeVisible();
  await expect(page.getByRole('button', { name: '자료 추가하기' })).toBeVisible();

  await page.getByRole('button', { name: '다음' }).click();

  await expect(page.getByRole('heading', { name: '기본 정보 입력' })).toBeVisible();
});

test('자료 없이 직접 입력한 경험을 저장한다', async ({ page }) => {
  await setupAuthenticatedExperienceAddPage(page);
  await mockExperienceCreateApi(page);

  await page.goto('/experience/add');
  await page.getByRole('button', { name: '다음' }).click();
  await fillEtcBasicInfo(page);
  await page.getByRole('button', { name: '다음' }).click();

  await expect(page.getByRole('heading', { name: '핵심 경험 입력' })).toBeVisible();
  await fillCoreInfo(page);
  await page.getByRole('button', { name: '다음' }).click();

  await expect(page.getByRole('heading', { name: '결과 확인' })).toBeVisible();
  await addResultTags(page);

  const createRequestPromise = page.waitForRequest(
    (request) => request.url().includes('/api/v1/experiences') && request.method() === 'POST',
  );

  await page.getByRole('button', { name: '저장하기' }).click();

  const createRequest = await createRequestPromise;
  const createRequestBody = createRequest.postDataJSON();

  await expect(page.getByRole('heading', { name: '경험 추가가 완료되었습니다!' })).toBeVisible();
  expect(createRequestBody).toMatchObject({
    type: 'ETC',
    title: 'E2E 직접 입력 경험',
    oneLineIntro: '직접 입력으로 저장되는 경험입니다.',
    tags: [
      { category: 'TECH', field: 'Playwright' },
      { category: 'COMPETENCY', field: '꼼꼼함' },
    ],
  });
});
