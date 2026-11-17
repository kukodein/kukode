/**
 * Grup: ui
 * Cakupan: Pergantian bahasa EN↔ID dan hreflang.
 * Kode kukode terkait bila tes ini gagal: src/components/Header.astro (a.kk-lang-toggle), src/components/SEOHead.astro
 */
import { test, expect, firstArticleHref } from '../fixtures/base';

test.describe('Bahasa EN ↔ ID @smoke', () => {
  test('toggle bendera: / → /id/ → /', async ({ consentedPage: page, baseURL }) => {
    await page.goto('/');
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await page.locator('a.kk-lang-toggle:visible').first().click();
    await expect(page).toHaveURL(/\/id\/$/);
    await expect(page.locator('html')).toHaveAttribute('lang', 'id');
    await page.locator('a.kk-lang-toggle:visible').first().click();
    await expect(page).toHaveURL(new URL('/', baseURL!).href);
  });

  test('toggle dari halaman artikel menuju artikel (bukan 404)', async ({ consentedPage: page }) => {
    await page.goto(await firstArticleHref(page));
    const [response] = await Promise.all([
      page.waitForResponse((r) => r.request().isNavigationRequest() && r.url().includes('/id/')),
      page.locator('a.kk-lang-toggle:visible').first().click(),
    ]);
    expect(response.status()).toBeLessThan(400);
    await expect(page).toHaveURL(/\/id\/article\//);
  });

  test('hreflang en/id/x-default ada dan saling konsisten di homepage', async ({ page }) => {
    await page.goto('/');
    const map = await page.locator('link[rel="alternate"][hreflang]').evaluateAll((els) =>
      Object.fromEntries(els.map((e) => [e.getAttribute('hreflang'), e.getAttribute('href')])),
    );
    expect(Object.keys(map)).toEqual(expect.arrayContaining(['en', 'id', 'x-default']));
    expect(map['id']).toMatch(/\/id\/?$/);
  });
});
