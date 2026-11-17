/**
 * Grup: ui
 * Cakupan: Dark/light mode, persistensi, anti-FOUC.
 * Kode kukode terkait bila tes ini gagal: src/layouts/BaseLayout.astro, public/js/kukode-global.js (kk-theme)
 */
import { test, expect, getLocal } from '../fixtures/base';

test.describe('Tema gelap/terang', () => {
  test.describe('preferensi sistem dark', () => {
    test.use({ colorScheme: 'dark' });
    test('default mengikuti prefers-color-scheme', async ({ page }) => {
      await page.goto('/');
      await expect(page.locator('html')).toHaveAttribute('data-bs-theme', 'dark');
    });
  });

  test.describe('preferensi sistem light', () => {
    test.use({ colorScheme: 'light' });

    test('toggle mengubah tema, tersimpan, dan bertahan setelah reload & ganti bahasa', async ({ consentedPage: page }) => {
      await page.goto('/');
      const html = page.locator('html');
      await expect(html).toHaveAttribute('data-bs-theme', 'light');

      await page.locator('#themeToggle').click();
      await expect(html).toHaveAttribute('data-bs-theme', 'dark');
      expect(await getLocal(page, 'kk-theme')).toBe('dark');

      await page.reload();
      await expect(html).toHaveAttribute('data-bs-theme', 'dark');

      await page.goto('/id/');
      await expect(html).toHaveAttribute('data-bs-theme', 'dark');

      await page.locator('#themeToggle').click();
      await expect(html).toHaveAttribute('data-bs-theme', 'light');
    });

    test('anti-FOUC: tema tersimpan sudah terpasang saat DOMContentLoaded', async ({ consentedPage: page }) => {
      await page.addInitScript(() => localStorage.setItem('kk-theme', 'dark'));
      await page.goto('/', { waitUntil: 'domcontentloaded' });
      await expect(page.locator('html')).toHaveAttribute('data-bs-theme', 'dark');
    });

    test('hanya satu logo (light/dark) yang terlihat per tema', async ({ consentedPage: page }) => {
      await page.goto('/');
      const lightLogo = page.locator('.navbar-brand img.d-show-light');
      const darkLogo = page.locator('.navbar-brand img.d-show-dark');
      await expect(lightLogo).toBeVisible();
      await expect(darkLogo).toBeHidden();
      await page.locator('#themeToggle').click();
      await expect(darkLogo).toBeVisible();
      await expect(lightLogo).toBeHidden();
    });
  });
});
