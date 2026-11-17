/**
 * Grup: quality
 * Cakupan: Visual regression (baseline snapshot).
 * Kode kukode terkait bila tes ini gagal: public/css/*, semua komponen
 */
import { test, expect, scrollThrough } from '../fixtures/base';
import type { Page } from '@playwright/test';

test.describe('Visual regression @visual', () => {
  async function prepare(page: Page) {
    await scrollThrough(page);
    await page.waitForLoadState('networkidle');
  }
  const masks = (page: Page) => [page.locator('time'), page.locator('.marquee-wrap'), page.locator('#numbers')];

  test('homepage light (full page)', async ({ consentedPage: page }) => {
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/');
    await prepare(page);
    await expect(page).toHaveScreenshot('home-light.png', {
      fullPage: true,
      animations: 'disabled',
      mask: masks(page),
      maxDiffPixelRatio: 0.02,
    });
  });

  test('homepage dark (full page)', async ({ consentedPage: page }) => {
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/');
    await prepare(page);
    await expect(page).toHaveScreenshot('home-dark.png', {
      fullPage: true,
      animations: 'disabled',
      mask: masks(page),
      maxDiffPixelRatio: 0.02,
    });
  });

  test('komponen: navbar & footer', async ({ consentedPage: page }) => {
    await page.goto('/');
    await prepare(page);
    await expect(page.locator('header.kk-navbar-wrap')).toHaveScreenshot('navbar.png', { animations: 'disabled' });
    await expect(page.locator('footer')).toHaveScreenshot('footer.png', { animations: 'disabled', maxDiffPixelRatio: 0.02 });
  });

  test('halaman kontak mobile', async ({ consentedPage: page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/contact/');
    await prepare(page);
    await expect(page).toHaveScreenshot('contact-mobile.png', { fullPage: true, animations: 'disabled', maxDiffPixelRatio: 0.02 });
  });

  test('struktur aksesibilitas navbar (ARIA snapshot)', async ({ consentedPage: page }) => {
    await page.goto('/');
    await expect(page.locator('nav.navbar')).toMatchAriaSnapshot(`
      - navigation:
        - link
    `);
  });
});
