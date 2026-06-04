import { defineConfig, devices } from '@playwright/test';

const DEFAULT_E2E_PORT = 3001;
const parsedE2EPort = Number(process.env.E2E_PORT);
const E2E_PORT =
  Number.isInteger(parsedE2EPort) && parsedE2EPort > 0 && parsedE2EPort <= 65535
    ? parsedE2EPort
    : DEFAULT_E2E_PORT;
const E2E_BASE_URL = `http://localhost:${E2E_PORT}`;

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: E2E_BASE_URL,
    screenshot: 'only-on-failure',
    trace: 'on-first-retry',
    video: 'retain-on-failure',
  },
  webServer: {
    command: `pnpm dev --hostname localhost --port ${E2E_PORT}`,
    env: {
      NEXT_PUBLIC_API_BASE_URL: E2E_BASE_URL,
      NEXT_PUBLIC_KAKAO_REST_API_KEY: 'e2e-kakao-client-id',
      NEXT_PUBLIC_GOOGLE_CLIENT_ID: 'e2e-google-client-id',
      NEXT_PUBLIC_KAKAO_REDIRECT_URI: `${E2E_BASE_URL}/oauth/kakao/callback`,
      NEXT_PUBLIC_GOOGLE_REDIRECT_URI: `${E2E_BASE_URL}/oauth/google/callback`,
    },
    url: E2E_BASE_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
