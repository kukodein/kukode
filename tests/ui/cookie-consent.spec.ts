/**
 * Grup: ui
 * Cakupan: Banner cookie, Accept/Decline, link privasi.
 * Kode kukode terkait bila tes ini gagal: src/components/CookieConsent.astro
 */
import { test, expect, getLocal } from '../fixtures/base';

test.describe('Cookie consent', () => {
  test('banner muncul setelah jeda, Accept menyimpan "accepted" dan banner tidak muncul lagi', async ({ page }) => {
    await page.clock.install();
    await page.goto('/');
    await page.clock.fastForward(1000); // lewati jeda 700 ms tanpa menunggu
    const banner = page.locator('#kkCookieConsent');
    await expect(banner).toHaveClass(/show/);

    await page.locator('#kkCookieAccept').click();
    await expect(banner).not.toHaveClass(/show/);
    expect(await getLocal(page, 'kk-cookie-consent')).toBe('accepted');

    await page.reload();
    await page.clock.fastForward(1000);
    await expect(banner).not.toHaveClass(/show/);
  });

  test('Decline menyimpan "declined"', async ({ page }) => {
    await page.clock.install();
    await page.goto('/');
    await page.clock.fastForward(1000);
    await page.locator('#kkCookieDecline').click();
    await expect(page.locator('#kkCookieConsent')).not.toHaveClass(/show/);
    expect(await getLocal(page, 'kk-cookie-consent')).toBe('declined');
  });

  test('consent yang sudah tersimpan → banner tidak pernah tampil', async ({ consentedPage: page }) => {
    await page.clock.install();
    await page.goto('/');
    await page.clock.fastForward(2000);
    await expect(page.locator('#kkCookieConsent')).not.toHaveClass(/show/);
  });

  test('[HIPOTESIS] link kebijakan privasi di banner tidak 404 (EN & ID)', async ({ page, request }) => {
    // Halaman EN privacy-policy ditandai draft: true di CMS → kemungkinan 404.
    for (const [route, expectedHref] of [['/', '/privacy-policy/'], ['/id/', '/id/kebijakan-privasi/']] as const) {
      await page.goto(route);
      const link = page.locator('#kkCookieConsent a');
      await expect(link).toHaveAttribute('href', expectedHref);
      const res = await request.get(expectedHref);
      expect.soft(res.status(), `GET ${expectedHref}`).toBe(200);
    }
  });
});
