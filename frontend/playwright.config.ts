import { defineConfig, devices } from '@playwright/test';

// E2E pe runtime-ul Cloudflare local (wrangler dev): static assets + worker-ul de contact cu .dev.vars
// (chei Turnstile de test, MAIL_MODE=log → nu trimite e-mailuri). Rulare: `npm run build && npm run e2e`.
// Firefox lipsește intenționat: binarul Playwright de pe această mașină e corupt (side-by-side error) —
// se verifică manual în Firefox real (docs/PROJECT_ROADMAP.md, Sesiunea 6).
export default defineConfig({
  testDir: './tests/e2e',
  timeout: 45_000,
  expect: { timeout: 10_000 },
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: [['list']],
  use: {
    baseURL: 'http://127.0.0.1:8787',
    trace: 'retain-on-failure',
  },
  webServer: {
    command: 'npx wrangler dev --port 8787 --ip 127.0.0.1',
    url: 'http://127.0.0.1:8787/api/health',
    reuseExistingServer: true,
    timeout: 60_000,
    env: { WRANGLER_SEND_METRICS: 'false' },
  },
  projects: [
    { name: 'chromium-desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'webkit-desktop', use: { ...devices['Desktop Safari'] } },
    { name: 'chromium-mobile', use: { ...devices['Pixel 7'] } },
    { name: 'webkit-mobile', use: { ...devices['iPhone 14'] } },
  ],
});
