/**
 * Grup: content
 * Cakupan: Daftar artikel: kartu, pagination, filter kategori, live search.
 * Kode kukode terkait bila tes ini gagal: src/pages/article/[...page].astro, src/components/Pagination.astro
 */
import { test, expect } from '../fixtures/base';

test.describe('Daftar artikel', () => {
  test('menampilkan min(12, total) kartu dan struktur kartu lengkap', async ({ consentedPage: page }) => {
    await page.goto('/article/');
    const total = (JSON.parse((await page.locator('#all-posts-data').textContent()) ?? '[]') as unknown[]).length;
    const cards = page.locator('#paginated-posts-wrap .kk-card');
    await expect(cards).toHaveCount(Math.min(12, total));

    const first = cards.first();
    await expect(first.locator('img')).toHaveAttribute('alt', /.+/);
    await expect(first.locator('time')).toHaveAttribute('datetime', /^\d{4}-\d{2}-\d{2}$/);
    await expect(first.locator('h3')).not.toBeEmpty();
  });

  test('pagination: Previous disabled di hal. 1, Next ke /article/2/, link "1" menuju /article/', async ({ consentedPage: page }) => {
    await page.goto('/article/');
    const pager = page.locator('nav.kk-pagination-wrap');
    test.skip((await pager.count()) === 0, 'Artikel ≤ 12 → pagination tidak dirender');

    await expect(pager.locator('li.page-item.disabled').first()).toBeVisible();
    await pager.locator('a[rel="next"]').click();
    await expect(page).toHaveURL(/\/article\/2\/$/);
    await expect(pager.locator('li.page-item.active')).toHaveAttribute('aria-current', 'page');
    await expect(pager.getByRole('link', { name: '1', exact: true })).toHaveAttribute('href', '/article/');
  });

  test('klik kartu membuka artikel dengan judul yang sama', async ({ consentedPage: page }) => {
    await page.goto('/article/');
    const card = page.locator('#paginated-posts-wrap .kk-card').first();
    const title = (await card.locator('h3').textContent())!.trim();
    await card.locator('a').first().click();
    await expect(page).toHaveURL(/\/article\/[^/]+\/$/);
    await expect(page.locator('h1')).toContainText(title);
  });

  test('filter kategori menuju /category/<slug>/', async ({ consentedPage: page }) => {
    await page.goto('/article/');
    const filters = page.locator('#category-filters a');
    test.skip((await filters.count()) < 2, 'Tidak ada kategori aktif');
    await filters.nth(1).click();
    await expect(page).toHaveURL(/\/category\/[^/]+\/$/);
    await expect(page.locator('h1')).toBeVisible();
  });

  test.describe('live search', () => {
    test.beforeEach(async ({ consentedPage: page }) => {
      await page.goto('/article/');
    });

    test('query yang cocok → hasil muncul, daftar biasa tersembunyi, tombol clear mengembalikan', async ({ consentedPage: page }) => {
      const posts = JSON.parse((await page.locator('#all-posts-data').textContent()) ?? '[]') as { title: string }[];
      const word = posts[0].title.split(/\s+/).find((w) => w.length > 3) ?? posts[0].title;

      await page.locator('#articleSearchInput').fill(word.toUpperCase()); // uji case-insensitive sekaligus
      await expect(page.locator('#search-results-wrap')).toBeVisible();
      await expect(page.locator('#paginated-posts-wrap')).toBeHidden();
      await expect(page.locator('#search-feedback')).toContainText(/Found \d+ article/);
      await expect(page.locator('#search-results-grid .kk-card').first()).toBeVisible();
      await expect(page.locator('#articleSearchClear')).toBeVisible();

      await page.locator('#articleSearchClear').click();
      await expect(page.locator('#articleSearchInput')).toBeEmpty();
      await expect(page.locator('#search-results-wrap')).toBeHidden();
      await expect(page.locator('#paginated-posts-wrap')).toBeVisible();
    });

    test('query tanpa hasil → pesan kosong', async ({ consentedPage: page }) => {
      await page.locator('#articleSearchInput').fill('zzzxxxqqq');
      await expect(page.locator('#search-empty')).toBeVisible();
      await expect(page.locator('#search-feedback')).toContainText('0 articles found');
    });

    test('karakter spesial/regex dan spasi saja tidak memicu error', async ({ consentedPage: page, consoleErrors }) => {
      for (const q of ['(', '[a-', '.*', '\\', '<b>', '   ']) {
        await page.locator('#articleSearchInput').fill(q);
      }
      expect(consoleErrors).toEqual([]);
    });
  });
});
