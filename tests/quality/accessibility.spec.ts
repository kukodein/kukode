/**
 * Grup: quality
 * Cakupan: axe-core, skip link, landmark, nama aksesibel, reduced motion.
 * Kode kukode terkait bila tes ini gagal: src/layouts/BaseLayout.astro, semua komponen
 */
import { test, expect, scrollThrough } from '../fixtures/base';

test.describe('Aksesibilitas @a11y', () => {
  for (const route of ['/', '/id/', '/article/', '/contact/', '/portfolio/']) {
    test(`axe: ${route} tanpa pelanggaran serious/critical`, async ({ consentedPage: page }) => {
      let AxeBuilder: typeof import('@axe-core/playwright').default;
      try {
        AxeBuilder = (await import('@axe-core/playwright')).default;
      } catch {
        test.skip(true, 'Install dulu: npm i -D @axe-core/playwright');
        return;
      }
      await page.goto(route);
      await scrollThrough(page);
      const { violations } = await new AxeBuilder({ page }).analyze();
      const blocking = violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');
      await test.info().attach(`axe-${route.replace(/\W+/g, '_')}.json`, {
        body: JSON.stringify(violations, null, 2),
        contentType: 'application/json',
      });
      expect(blocking.map((v) => `${v.id} (${v.nodes.length}x): ${v.help}`)).toEqual([]);
    });
  }

  test('skip link menjadi fokus pertama dan memindahkan ke #main-content', async ({ consentedPage: page }) => {
    await page.goto('/');
    await page.keyboard.press('Tab');
    const skip = page.locator('.kk-skip-link');
    await expect(skip).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/#main-content$/);
  });

  test('[HIPOTESIS] landmark: ada <main> (saat ini #main-content hanya <div>)', async ({ page }) => {
    await page.goto('/');
    await expect.soft(page.getByRole('main')).toHaveCount(1);
    await expect.soft(page.getByRole('banner')).toHaveCount(1);
    await expect.soft(page.getByRole('contentinfo')).toHaveCount(1);
  });

  test('tombol ikon punya nama aksesibel', async ({ consentedPage: page }) => {
    await page.goto('/');
    await expect(page.locator('#themeToggle')).toHaveAccessibleName(/dark mode/i);
    await expect(page.getByRole('link', { name: 'Chat on WhatsApp' })).toBeVisible();
    await expect(page.locator('#kkBackToTop')).toHaveAccessibleName('Back to top');
  });

  test('semua <img> di homepage punya atribut alt', async ({ consentedPage: page }) => {
    await page.goto('/');
    const missing = await page.locator('img:not([alt])').evaluateAll((imgs) => (imgs as HTMLImageElement[]).map((i) => i.src));
    expect(missing).toEqual([]);
  });

  test.describe('reduced motion', () => {
    test.use({ reducedMotion: 'reduce' });
    test('back-to-top tetap berfungsi', async ({ consentedPage: page }) => {
      await page.goto('/');
      await page.mouse.wheel(0, 1200);
      await page.locator('#kkBackToTop').click();
      await expect.poll(() => page.evaluate(() => window.scrollY)).toBeLessThan(5);
    });
  });
});
