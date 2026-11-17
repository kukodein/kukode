/**
 * Grup: ui
 * Cakupan: Tombol & bubble WhatsApp mengambang.
 * Kode kukode terkait bila tes ini gagal: src/components/WhatsAppWidget.astro
 */
import { test, expect, getSession } from '../fixtures/base';

test.describe('Widget WhatsApp', () => {
  test('tombol WA: href wa.me benar, target _blank, rel noopener', async ({ page }) => {
    await page.goto('/');
    const btn = page.getByRole('link', { name: 'Chat on WhatsApp' });
    const href = (await btn.getAttribute('href'))!;
    const url = new URL(href);
    expect(url.hostname).toBe('wa.me');
    expect(url.pathname).toMatch(/^\/\d{8,15}$/);
    expect(url.searchParams.get('text')).toContain('Kukode');
    await expect(btn).toHaveAttribute('target', '_blank');
    await expect(btn).toHaveAttribute('rel', /noopener/);
  });

  test('klik tombol membuka tab baru ke wa.me (di-mock)', async ({ page, context }) => {
    await page.goto('/');
    const popupPromise = context.waitForEvent('page');
    await page.getByRole('link', { name: 'Chat on WhatsApp' }).click();
    const popup = await popupPromise;
    await popup.waitForLoadState();
    expect(new URL(popup.url()).hostname).toBe('wa.me');
  });

  test('menutup bubble menyimpan state di sessionStorage dan bertahan antar halaman, reset di sesi baru', async ({
    page,
    browser,
    baseURL,
  }) => {
    await page.goto('/');
    const bubble = page.locator('#kkWaBubble');
    await expect(bubble).toBeVisible();
    await page.locator('#kkWaBubbleClose').click();
    await expect(bubble).toBeHidden();
    expect(await getSession(page, 'kk-wa-dismissed')).toBe('1');

    await page.goto('/article/');
    await expect(page.locator('#kkWaBubble')).toBeHidden();

    const freshContext = await browser.newContext({ baseURL });
    const freshPage = await freshContext.newPage();
    await freshPage.goto('/');
    await expect(freshPage.locator('#kkWaBubble')).toBeVisible();
    await freshContext.close();
  });
});
