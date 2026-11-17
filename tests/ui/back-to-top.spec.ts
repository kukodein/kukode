/**
 * Grup: ui
 * Cakupan: Tombol kembali ke atas.
 * Kode kukode terkait bila tes ini gagal: src/components/BackToTop.astro
 */
import { test, expect } from '../fixtures/base';

test.describe('Back to top', () => {
  test('muncul setelah scroll > 300px, klik kembali ke atas', async ({ consentedPage: page }) => {
    await page.goto('/');
    const btn = page.locator('#kkBackToTop');
    await expect(btn).not.toHaveClass(/show/);
    await page.mouse.wheel(0, 1200);
    await expect(btn).toHaveClass(/show/);
    await btn.click();
    await expect.poll(() => page.evaluate(() => window.scrollY), { message: 'smooth scroll ke atas' }).toBeLessThan(5);
    await expect(btn).not.toHaveClass(/show/);
  });
});

