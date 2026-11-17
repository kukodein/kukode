/**
 * Grup: quality
 * Cakupan: Tanpa JS, offline, aset diblokir.
 * Kode kukode terkait bila tes ini gagal: SSG fallback, public/js/*
 */
import { test, expect } from '../fixtures/base';

test.describe('Ketahanan', () => {
  test.describe('tanpa JavaScript', () => {
    test.use({ javaScriptEnabled: false });
    test('konten homepage SSG tetap terbaca', async ({ page }) => {
      await page.goto('/');
      await expect(page.locator('h1').first()).toBeVisible();
      await expect(page.locator('#services')).toBeAttached();
      await expect(page.locator('#contact')).toBeAttached();
    });
  });

  test('search artikel tetap jalan saat offline (index tertanam di HTML)', async ({ consentedPage: page, context }) => {
    await page.goto('/article/');
    await context.setOffline(true);
    const posts = JSON.parse((await page.locator('#all-posts-data').textContent()) ?? '[]') as { title: string }[];
    const word = posts[0].title.split(/\s+/).find((w) => w.length > 3) ?? posts[0].title;
    await page.locator('#articleSearchInput').fill(word);
    await expect(page.locator('#search-results-grid .kk-card').first()).toBeVisible();
    await context.setOffline(false);
  });

  test.describe('aset diblokir', () => {
    test.use({ failOnConsoleError: false }); // blokir sengaja menghasilkan error console

    test('semua gambar diblokir → layout tidak runtuh & tanpa horizontal overflow', async ({ consentedPage: page }) => {
      await page.route(/\.(png|jpe?g|webp|svg|gif|avif)(\?.*)?$/i, (route) => route.abort());
      await page.goto('/');
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      expect(overflow).toBeLessThanOrEqual(1);
      await expect(page.locator('h1').first()).toBeVisible();
    });

    test('JS bundel beranda diblokir → konten FAQ tetap ada di DOM', async ({ consentedPage: page }) => {
      await page.route('**/js/kukode-home.js', (route) => route.abort());
      await page.goto('/');
      const items = await page.locator('.kk-faq-item').count();
      test.skip(items === 0, 'FAQ tidak aktif');
      await expect(page.locator('.kk-faq-q').first()).toBeAttached();
    });
  });
});
