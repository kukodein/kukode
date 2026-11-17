/**
 * Grup: ui
 * Cakupan: FAQ accordion di homepage.
 * Kode kukode terkait bila tes ini gagal: src/pages/index.astro (#faq), public/js/kukode-home.js
 */
import { test, expect } from '../fixtures/base';

test.describe('FAQ accordion', () => {
  test('item tertutup default, klik membuka, klik lagi menutup, multi-open diperbolehkan', async ({ consentedPage: page }) => {
    await page.goto('/');
    const items = page.locator('.kk-faq-item');
    test.skip((await items.count()) < 2, 'FAQ tidak aktif di homepage ini');

    await expect(page.locator('.kk-faq-item.active')).toHaveCount(0);
    await items.nth(0).locator('.kk-faq-q').click();
    await expect(items.nth(0)).toHaveClass(/active/);
    await expect(items.nth(0).locator('.kk-faq-a-inner')).toBeVisible();

    await items.nth(1).locator('.kk-faq-q').click();
    await expect(items.nth(0)).toHaveClass(/active/); // kode memakai classList.toggle → tidak auto-collapse
    await expect(items.nth(1)).toHaveClass(/active/);

    await items.nth(0).locator('.kk-faq-q').click();
    await expect(items.nth(0)).not.toHaveClass(/active/);
  });

  test('[HIPOTESIS] tombol FAQ punya aria-expanded', async ({ consentedPage: page }) => {
    await page.goto('/');
    const q = page.locator('.kk-faq-q').first();
    test.skip((await q.count()) === 0, 'FAQ tidak aktif');
    await expect(q).toHaveAttribute('aria-expanded', /^(true|false)$/);
  });

  test('jumlah pertanyaan FAQ sama dengan JSON-LD FAQPage', async ({ page }) => {
    await page.goto('/');
    const count = await page.locator('.kk-faq-item').count();
    test.skip(count === 0, 'FAQ tidak aktif');
    const blocks = await page.locator('script[type="application/ld+json"]').allTextContents();
    const faq = blocks.map((b) => JSON.parse(b)).find((j) => j['@type'] === 'FAQPage');
    expect(faq?.mainEntity).toHaveLength(count);
  });
});
