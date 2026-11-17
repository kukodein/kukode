/**
 * Grup: forms
 * Cakupan: Form kontak: validasi alert, popup WhatsApp, encoding, XSS.
 * Kode kukode terkait bila tes ini gagal: src/page-template/Contact.astro
 */
import { test, expect } from '../fixtures/base';
import type { Page } from '@playwright/test';

test.describe('Form kontak', () => {
  const VALID = {
    name: 'Budi Pratama',
    email: 'budi@example.com',
    phone: '08123456789',
    subject: 'Website Perusahaan',
    message: 'Halo, saya butuh website. Anggaran 10jt & deadline 1 bulan.',
  };

  async function fillForm(page: Page, data: Partial<typeof VALID>) {
    if (data.name !== undefined) await page.locator('#contactName').fill(data.name);
    if (data.email !== undefined) await page.locator('#contactEmail').fill(data.email);
    if (data.phone !== undefined) await page.locator('#contactPhone').fill(data.phone);
    if (data.subject !== undefined) await page.locator('#contactSubject').fill(data.subject);
    if (data.message !== undefined) await page.locator('#contactMessage').fill(data.message);
  }

  test('field wajib dan opsional sesuai label', async ({ consentedPage: page }) => {
    await page.goto('/contact/');
    for (const id of ['#contactName', '#contactEmail', '#contactSubject', '#contactMessage']) {
      await expect(page.locator(id)).toHaveAttribute('required', '');
    }
    await expect(page.locator('#contactPhone')).not.toHaveAttribute('required', '');
    await expect(page.getByLabel(/Your Name/)).toBeVisible();
  });

  test('validasi berurutan: nama → email → subjek → pesan (via alert) + fokus', async ({ consentedPage: page }) => {
    await page.goto('/contact/');
    const dialogs: string[] = [];
    page.on('dialog', async (d) => {
      dialogs.push(d.message());
      await d.accept();
    });
    const submit = page.locator('#btnSendWa');

    await submit.click();
    await expect.poll(() => dialogs.length).toBe(1);
    expect(dialogs[0]).toBe('Please enter your name.');
    await expect(page.locator('#contactName')).toBeFocused();

    await fillForm(page, { name: VALID.name });
    await submit.click();
    await expect.poll(() => dialogs.length).toBe(2);
    expect(dialogs[1]).toBe('Please enter your email address.');
    await expect(page.locator('#contactEmail')).toBeFocused();

    await fillForm(page, { email: VALID.email });
    await submit.click();
    await expect.poll(() => dialogs.length).toBe(3);
    expect(dialogs[2]).toBe('Please enter a subject.');

    await fillForm(page, { subject: VALID.subject });
    await submit.click();
    await expect.poll(() => dialogs.length).toBe(4);
    expect(dialogs[3]).toBe('Please enter your message.');
  });

  test('versi ID: pesan validasi berbahasa Indonesia', async ({ consentedPage: page }) => {
    await page.goto('/id/contact/');
    const messages: string[] = [];
    page.on('dialog', async (d) => {
      messages.push(d.message());
      await d.accept();
    });
    await page.locator('#btnSendWa').click();
    await expect.poll(() => messages.length).toBe(1);
    expect(messages[0]).toBe('Mohon masukkan nama Anda.');
  });

  test('submit valid membuka wa.me dengan isi pesan terformat & ter-encode', async ({ consentedPage: page }) => {
    await page.goto('/contact/');
    await fillForm(page, VALID);
    const popupPromise = page.waitForEvent('popup');
    await page.locator('#btnSendWa').click();
    const popup = await popupPromise;
    await popup.waitForLoadState();

    const url = new URL(popup.url());
    expect(url.hostname).toBe('wa.me');
    const text = url.searchParams.get('text') ?? '';
    for (const value of Object.values(VALID)) expect(text).toContain(value); // karakter &, ., newline utuh setelah decode
  });

  test('nomor telepon opsional: tidak ada baris telepon bila dikosongkan', async ({ consentedPage: page }) => {
    await page.goto('/contact/');
    await fillForm(page, { ...VALID, phone: '' });
    const popupPromise = page.waitForEvent('popup');
    await page.locator('#btnSendWa').click();
    const popup = await popupPromise;
    await popup.waitForLoadState();
    const text = new URL(popup.url()).searchParams.get('text') ?? '';
    expect(text).not.toMatch(/Phone\/WA/);
  });

  test('input berbahaya (XSS) tidak dieksekusi', async ({ consentedPage: page }) => {
    await page.goto('/contact/');
    const dialogs: string[] = [];
    page.on('dialog', async (d) => {
      dialogs.push(d.message());
      await d.dismiss();
    });
    await fillForm(page, { ...VALID, name: '<img src=x onerror=alert(1)>', message: '<script>alert(2)</script>' });
    const popupPromise = page.waitForEvent('popup');
    await page.locator('#btnSendWa').click();
    await popupPromise;
    expect(dialogs).toEqual([]);
  });

  // test.fail(): kita ASUMSIKAN ini bug. Bila ternyata lolos, Playwright melaporkan "unexpected pass".
  test('[HIPOTESIS BUG] email tidak valid ditolak', async ({ consentedPage: page }) => {
    test.fail(true, 'Kode hanya cek email tidak kosong (form novalidate)');
    await page.goto('/contact/');
    let popupOpened = false;
    page.on('popup', () => (popupOpened = true));
    page.on('dialog', (d) => d.accept());
    await fillForm(page, { ...VALID, email: 'abc' });
    await page.locator('#btnSendWa').click();
    await page.waitForTimeout(500); // beri waktu popup (negatif) muncul; tidak ada event DOM untuk "tidak terjadi apa-apa"
    expect(popupOpened).toBe(false);
  });

  test('urutan Tab field: nama → email → telepon → subjek → pesan → tombol', async ({ consentedPage: page }) => {
    await page.goto('/contact/');
    await page.locator('#contactName').focus();
    for (const next of ['#contactEmail', '#contactPhone', '#contactSubject', '#contactMessage', '#btnSendWa']) {
      await page.keyboard.press('Tab');
      await expect(page.locator(next)).toBeFocused();
    }
  });
});
