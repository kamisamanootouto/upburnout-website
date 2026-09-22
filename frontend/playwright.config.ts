import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { defineConfig, devices } from '@playwright/test';

// E2E pe runtime-ul Cloudflare local (wrangler dev): static assets + worker-ul de contact cu .dev.vars
// (chei Turnstile de test, MAIL_MODE=log → nu trimite e-mailuri). Rulare: `npm run build && npm run e2e`.
//
// Firefox pe PC-ul de dezvoltare (Windows): binarul din %LOCALAPPDATA%\ms-playwright nu pornește de acolo
// („side-by-side configuration is incorrect”, doar din acel folder); aceeași copie pornește din
// %USERPROFILE%\ms-playwrightirefox-1532irefox. Dacă există copia, o folosim; altfel (CI, Linux) calea implicită.
const localFirefox = path.join(
  os.homedir(),
  'ms-playwright',
  'firefox-1532',
  'firefox',
  'firefox.exe',
);
const firefoxLaunch = fs.existsSync(localFirefox) ? { executablePath: localFirefox } : {};

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
    // Firefox nu suportă emularea mobilă (isMobile) în Playwright → doar desktop.
    {
      name: 'firefox-desktop',
      use: { ...devices['Desktop Firefox'], launchOptions: firefoxLaunch },
    },
    { name: 'chromium-mobile', use: { ...devices['Pixel 7'] } },
    { name: 'webkit-mobile', use: { ...devices['iPhone 14'] } },
  ],
});
