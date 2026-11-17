/**
 * Grup: content
 * Cakupan: Portfolio: detail proyek, GLightbox, gambar.
 * Kode kukode terkait bila tes ini gagal: src/pages/portfolio/*, GLightbox di public/vendor
 */
import { test, expect, scrollThrough } from '../fixtures/base';
import type { Page } from '@playwright/test';

test.describe('Portfolio', () => {
  async function firstProjectHref(page: Page) {
    await page.goto('/portfolio/');
    const hrefs = await page.locator('a').evaluateAll((as) => (as as HTMLAnchorElement[]).map((a) => a.getAttribute('href') ?? ''));
    const detail = hrefs.find((h) => /^\/portfolio\/(?!\d+\/?$)[^/]+\/?$/.test(h));
    expect(detail, 'harus ada link detail portfolio').toBeTruthy();
    return detail!;
  }

  test('detail proyek: lightbox terbuka dari galeri dan tertutup dengan Escape', async ({ consentedPage: page }) => {
    await page.goto(await firstProjectHref(page));
    await expect(page.locator('h1')).toBeVisible();

    const gallery = page.locator('a.glightbox');
    test.skip((await gallery.count()) === 0, 'Proyek pertama tanpa galeri');

    await gallery.first().click();
    const box = page.locator('.glightbox-container');
    await expect(box).toBeVisible();
    if ((await gallery.count()) > 1) {
      await page.keyboard.press('ArrowRight');
    }
    await page.keyboard.press('Escape');
    await expect(box).toBeHidden();
  });

  test('semua gambar di detail proyek termuat', async ({ consentedPage: page }) => {
    await page.goto(await firstProjectHref(page));
    await scrollThrough(page);
    const broken = await page.locator('img').evaluateAll((imgs) =>
      (imgs as HTMLImageElement[]).filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.src),
    );
    expect(broken).toEqual([]);
  });
});
