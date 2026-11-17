/**
 * Grup: smoke
 * Cakupan: Semua route utama, 404, redirect pagination, struktur section homepage.
 * Kode kukode terkait bila tes ini gagal: src/pages/*, src/pages/404.astro, astro.config.mjs (redirects), netlify.toml
 */
import { test, expect, ROUTES, HOME_SECTION_ORDER, IGNORED_CONSOLE_HOSTS, isLocal, scrollThrough } from '../fixtures/base';

test.describe('Smoke & routing @smoke', () => {
  for (const route of ROUTES) {
    test(`route ${route} merespons < 400 dan punya title`, async ({ page }) => {
      const response = await page.goto(route);
      expect(response?.status(), `status ${route}`).toBeLessThan(400);
      await expect(page).toHaveTitle(/.+/);
    });
  }

  test.describe('halaman 404', () => {
    test.use({ failOnConsoleError: false }); // browser mencatat "Failed to load resource: 404" untuk dokumen itu sendiri

    test('slug tidak ada → status 404 dan ada link kembali', async ({ page }) => {
      const response = await page.goto('/halaman-tidak-ada-xyz/');
      expect(response?.status()).toBe(404);
      await expect(page.getByRole('link', { name: 'Read Articles' })).toBeVisible();
    });

    test('slug tidak ada di bawah /id/ → status 404', async ({ page }) => {
      const response = await page.goto('/id/halaman-tidak-ada-xyz/');
      expect(response?.status()).toBe(404);
    });
  });

  for (const path of ['/article/1', '/id/article/1', '/portfolio/1', '/category/1', '/author/1']) {
    test(`redirect ${path} → halaman list tanpa /1`, async ({ request, baseURL }) => {
      test.skip(isLocal(baseURL), 'Di astro preview redirect berupa meta-refresh (200); status 301 dibuat Netlify dari _redirects');
      const res = await request.get(path, { maxRedirects: 0 });
      expect([301, 302, 307, 308], `status ${path}`).toContain(res.status());
      const location = res.headers()['location'] ?? '';
      expect(location.replace(/\/$/, '')).toBe(path.replace(/\/1$/, ''));
    });
  }

  test('halaman utama memuat semua section dengan urutan yang benar', async ({ page }) => {
    await page.goto('/');
    const ids = await page.locator('section[id]').evaluateAll((els) => els.map((e) => e.id));
    // FAQ/section lain bisa dimatikan dari CMS, jadi cek sebagai subsequence berurutan
    const present = HOME_SECTION_ORDER.filter((id) => ids.includes(id));
    expect(present.length, 'minimal separuh section harus ada').toBeGreaterThan(HOME_SECTION_ORDER.length / 2);
    expect(ids.filter((id) => HOME_SECTION_ORDER.includes(id))).toEqual(present);
  });

  test('homepage tidak memicu request gagal (4xx/5xx/failed)', async ({ page }) => {
    const bad: string[] = [];
    page.on('response', (r) => {
      if (r.status() >= 400) bad.push(`${r.status()} ${r.url()}`);
    });
    page.on('requestfailed', (r) => {
      if (!IGNORED_CONSOLE_HOSTS.test(r.url()) && !/wa\.me/.test(r.url())) bad.push(`FAILED ${r.url()}`);
    });
    await page.goto('/');
    await scrollThrough(page);
    await page.waitForLoadState('networkidle');
    expect(bad).toEqual([]);
  });
});
