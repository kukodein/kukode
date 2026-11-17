/**
 * Grup: quality
 * Cakupan: Overflow horizontal per viewport, target sentuh.
 * Kode kukode terkait bila tes ini gagal: public/css/*, Bootstrap grid
 */
import { test, expect, VIEWPORTS, scrollThrough } from '../fixtures/base';

test.describe('Responsive @smoke', () => {
  for (const vp of VIEWPORTS) {
    for (const route of ['/', '/article/', '/contact/', '/portfolio/']) {
      test(`${vp.name}: ${route} tanpa horizontal overflow`, async ({ consentedPage: page }) => {
        await page.setViewportSize({ width: vp.width, height: vp.height });
        await page.goto(route);
        await scrollThrough(page);
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
        expect(overflow, 'piksel konten melebihi lebar viewport').toBeLessThanOrEqual(1);
      });
    }
  }

  test('target sentuh tombol utama ≥ 44px di mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    for (const locator of [page.getByRole('link', { name: 'Chat on WhatsApp' }), page.locator('#themeToggleMobile')]) {
      const box = await locator.boundingBox();
      expect.soft(box?.width, 'lebar target sentuh').toBeGreaterThanOrEqual(44);
      expect.soft(box?.height, 'tinggi target sentuh').toBeGreaterThanOrEqual(44);
    }
  });
});
