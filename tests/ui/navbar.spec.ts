/**
 * Grup: ui
 * Cakupan: Navbar desktop/mobile, link logo, scroll-hide.
 * Kode kukode terkait bila tes ini gagal: src/components/Header.astro, public/js/kukode-global.js
 */
import { test, expect } from '../fixtures/base';

test.describe('Navbar @smoke', () => {
  const NAV = {
    en: ['Services', 'Process', 'Portfolio', 'Pricing', 'Blog', 'FAQ'],
    id: ['Layanan', 'Proses', 'Portofolio', 'Harga', 'Blog', 'FAQ'],
  };

  for (const [lang, labels] of Object.entries(NAV)) {
    test(`desktop (${lang}): semua item nav terlihat`, async ({ consentedPage: page }) => {
      await page.goto(lang === 'en' ? '/' : '/id/');
      const nav = page.locator('nav.navbar');
      for (const label of labels) {
        await expect(nav.getByRole('link', { name: label, exact: true }), label).toBeVisible();
      }
    });
  }

  test('logo mengarah ke / (EN) dan /id/ (ID)', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.navbar-brand')).toHaveAttribute('href', '/');
    await page.goto('/id/');
    await expect(page.locator('.navbar-brand')).toHaveAttribute('href', '/id/');
  });

  test('klik "Blog" menuju /article/', async ({ consentedPage: page }) => {
    await page.goto('/');
    await page.locator('nav.navbar').getByRole('link', { name: 'Blog', exact: true }).click();
    await expect(page).toHaveURL(/\/article\/$/);
  });

  test('klik "Pricing" scroll ke section #pricing', async ({ consentedPage: page }) => {
    await page.goto('/');
    await page.locator('nav.navbar').getByRole('link', { name: 'Pricing', exact: true }).click();
    await expect(page).toHaveURL(/#pricing$/);
    await expect(page.locator('#pricing')).toBeInViewport();
  });

  test('[HIPOTESIS] link Portfolio di versi ID memakai prefix /id', async ({ page }) => {
    // Di Header.astro URL portfolio hardcode '/portfolio/' (tanpa prefix locale).
    await page.goto('/id/');
    const href = await page.locator('nav.navbar').getByRole('link', { name: 'Portofolio', exact: true }).getAttribute('href');
    expect(href).toMatch(/^\/id\//);
  });

  test('navbar tersembunyi saat scroll turun dan kembali saat scroll naik', async ({ consentedPage: page }) => {
    await page.goto('/');
    const wrap = page.locator('.kk-navbar-wrap');
    await page.mouse.wheel(0, 900);
    await expect(wrap).toHaveClass(/kk-scrolled/);
    await page.mouse.wheel(0, -300);
    await expect(wrap).not.toHaveClass(/kk-scrolled/);
  });

  test.describe('mobile', () => {
    test.use({ viewport: { width: 375, height: 812 } });

    test('menu hamburger membuka dan menutup #mainNav', async ({ consentedPage: page }) => {
      await page.goto('/');
      const menu = page.locator('#mainNav');
      const burger = page.getByRole('button', { name: 'navbar-toggler' });
      await expect(menu).toBeHidden();
      await burger.click();
      await expect(menu).toBeVisible();
      await burger.click();
      await expect(menu).toBeHidden();
    });
  });
});
