import type { Page } from '@playwright/test';

export const E2E_ACCESS_TOKEN = 'e2e-access-token';

export async function mockAuthenticatedSession(page: Page) {
  await page.addInitScript((accessToken) => {
    window.sessionStorage.setItem('mg_access_token', accessToken);
  }, E2E_ACCESS_TOKEN);
}
