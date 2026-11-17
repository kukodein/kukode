/**
 * Grup: quality
 * Cakupan: CLS/LCP, mixed content, anggaran request.
 * Kode kukode terkait bila tes ini gagal: gambar, font, script pihak ketiga
 */
import { test, expect, isLocal, scrollThrough } from '../fixtures/base';

test.describe('Performa @perf', () => {
  test('CLS < 0.1 dan LCP < 4 dtk di homepage', async ({ consentedPage: page, browserName }) => {
    test.skip(browserName !== 'chromium', 'Metrik layout-shift/LCP hanya tersedia di Chromium');
    await page.addInitScript(() => {
      const w = window as unknown as { __cls: number; __lcp: number };
      w.__cls = 0;
      w.__lcp = 0;
      new PerformanceObserver((list) => {
        for (const e of list.getEntries() as unknown as { value: number; hadRecentInput: boolean }[]) {
          if (!e.hadRecentInput) w.__cls += e.value;
        }
      }).observe({ type: 'layout-shift', buffered: true });
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        w.__lcp = entries[entries.length - 1].startTime;
      }).observe({ type: 'largest-contentful-paint', buffered: true });
    });

    await page.goto('/');
    await scrollThrough(page);
    // dua frame agar observer sempat menerima entri terakhir
    await page.evaluate(() => new Promise<void>((r) => requestAnimationFrame(() => requestAnimationFrame(() => r()))));

    const { cls, lcp } = await page.evaluate(() => {
      const w = window as unknown as { __cls: number; __lcp: number };
      return { cls: w.__cls, lcp: w.__lcp };
    });
    await test.info().attach('web-vitals.json', { body: JSON.stringify({ cls, lcp }), contentType: 'application/json' });
    expect.soft(cls, 'CLS').toBeLessThan(0.1);
    expect.soft(lcp, 'LCP (ms) — longgar karena jaringan CI/lokal bervariasi').toBeLessThan(4000);
  });

  test('tidak ada mixed content dan daftar host eksternal dilampirkan ke report', async ({ consentedPage: page, baseURL }) => {
    const hosts = new Set<string>();
    const insecure: string[] = [];
    page.on('request', (r) => {
      const u = new URL(r.url());
      if (u.hostname !== new URL(baseURL!).hostname) hosts.add(u.hostname);
      if (u.protocol === 'http:' && !isLocal(baseURL)) insecure.push(r.url());
    });
    await page.goto('/');
    await scrollThrough(page);
    await page.waitForLoadState('networkidle');
    await test.info().attach('external-hosts.txt', { body: [...hosts].join('\n') || '(none)', contentType: 'text/plain' });
    expect(insecure).toEqual([]);
  });

  test('jumlah request & total transfer homepage dalam anggaran', async ({ consentedPage: page }) => {
    let requests = 0;
    let bytes = 0;
    page.on('response', async (r) => {
      requests += 1;
      const len = Number(r.headers()['content-length'] ?? 0);
      bytes += Number.isNaN(len) ? 0 : len;
    });
    await page.goto('/');
    await scrollThrough(page);
    await page.waitForLoadState('networkidle');
    await test.info().attach('budget.json', { body: JSON.stringify({ requests, bytes }), contentType: 'application/json' });
    expect.soft(requests, 'jumlah request').toBeLessThan(80);
    expect.soft(bytes, 'total byte (berdasarkan content-length)').toBeLessThan(4 * 1024 * 1024);
  });
});
