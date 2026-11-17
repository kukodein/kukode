/**
 * Grup: seo
 * Cakupan: Header keamanan/cache, HTTPS redirect (khusus deployment Netlify).
 * Kode kukode terkait bila tes ini gagal: astro.config.mjs (serverHeadersIntegration), netlify.toml
 */
import { test, expect, isLocal } from '../fixtures/base';

test.describe('Header keamanan & cache @headers', () => {
  test.skip(({ baseURL }) => isLocal(baseURL), '_headers hanya diterapkan oleh Netlify/Cloudflare, bukan astro preview');

  test('header keamanan pada HTML', async ({ request }) => {
    const h = (await request.get('/')).headers();
    expect(h['x-frame-options']).toBe('SAMEORIGIN');
    expect(h['x-content-type-options']).toBe('nosniff');
    expect(h['referrer-policy']).toBe('strict-origin-when-cross-origin');
    expect(h['permissions-policy']).toContain('camera=()');
  });

  for (const path of ['/css/kukode.css', '/js/kukode-global.js', '/image/default-thumbnail.jpg']) {
    test(`aset ${path} di-cache panjang`, async ({ request }) => {
      const res = await request.get(path);
      test.skip(res.status() === 404, `${path} tidak ada`);
      expect(res.headers()['cache-control']).toMatch(/max-age=31536000/);
    });
  }

  test('HTML tidak di-cache setahun', async ({ request }) => {
    const cc = (await request.get('/')).headers()['cache-control'] ?? '';
    expect(cc).not.toMatch(/max-age=31536000/);
  });

  test('HTTP di-redirect ke HTTPS', async ({ request, baseURL }) => {
    const httpUrl = baseURL!.replace(/^https:/, 'http:') + '/';
    const res = await request.get(httpUrl, { maxRedirects: 0 });
    expect([301, 302, 307, 308]).toContain(res.status());
    expect(res.headers()['location']).toMatch(/^https:/);
  });

  test('kukode.netlify.app di-redirect 301 ke domain utama dengan path utuh', async ({ request, baseURL }) => {
    test.skip(new URL(baseURL!).hostname !== 'kukode.my.id', 'Hanya relevan saat menguji domain produksi kukode.my.id');
    const res = await request.get('https://kukode.netlify.app/article/', { maxRedirects: 0 });
    expect(res.status()).toBe(301);
    expect(res.headers()['location']).toBe('https://kukode.my.id/article/');
  });
});
