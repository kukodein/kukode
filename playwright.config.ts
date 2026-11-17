/**
 * CONFIG A — DITEMPEL DI DALAM PROJECT KUKODE (+ GitHub Actions)
 *
 * Cara pakai: salin file ini ke root project kukode sebagai `playwright.config.ts`,
 * salin folder `tests/` dan `.github/workflows/playwright.yml` (lihat TUTORIAL.md).
 *
 * Config ini membangun situs dengan ENV=production lalu menjalankannya lewat `astro preview`,
 * sehingga perilaku robots.txt / meta robots / canonical sama seperti produksi, tapi di mesin lokal/CI.
 * Variabel env mengikuti astro.config.mjs: ENV dan PUBLIC_SITE_URL.
 *
 *   npx playwright test                           # build + preview otomatis, lalu jalankan semua tes
 *   npx playwright test tests/ui                  # satu grup saja
 *   PW_SKIP_BUILD=1 npx playwright test           # lewati build bila dist/ sudah terbaru
 *   BASE_URL=https://kukode.my.id npx playwright test   # arahkan ke situs live (webServer dimatikan)
 */
import { defineConfig, devices } from '@playwright/test';

const PORT = 4321;
const LOCAL_URL = `http://127.0.0.1:${PORT}`;
const remote = process.env.BASE_URL; // bila diisi → tidak menjalankan server lokal
const baseURL = remote ?? LOCAL_URL;

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  timeout: 30_000,
  expect: { timeout: 7_000, toHaveScreenshot: { maxDiffPixelRatio: 0.02 } },

  // 'github' memberi anotasi error langsung di PR; 'html' untuk laporan lengkap; 'blob' bila ingin sharding.
  reporter: process.env.CI
    ? [['github'], ['html', { open: 'never' }], ['junit', { outputFile: 'test-results/junit.xml' }]]
    : [['list'], ['html', { open: 'never' }]],

  use: {
    baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    locale: 'en-US',
    timezoneId: 'Asia/Jakarta',
  },

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    // Aktifkan browser lain bila perlu (di CI cukup chromium agar cepat):
    ...(process.env.PW_ALL_BROWSERS
      ? [
          { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
          { name: 'webkit', use: { ...devices['Desktop Safari'] } },
          { name: 'mobile-chrome', use: { ...devices['Pixel 7'] }, grep: /@smoke|@a11y/ },
        ]
      : []),
  ],

  webServer: remote
    ? undefined
    : {
        command: `${process.env.PW_SKIP_BUILD ? '' : 'npm run build && '}npm run preview -- --host 127.0.0.1 --port ${PORT}`,
        url: LOCAL_URL,
        timeout: 300_000, // build Astro ± 1–3 menit
        reuseExistingServer: !process.env.CI,
        env: { ENV: 'production', PUBLIC_SITE_URL: LOCAL_URL },
      },
});
