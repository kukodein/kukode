/**
 * Grup: seo
 * Cakupan: Meta, canonical, OG, JSON-LD, robots.txt, sitemap, RSS, favicon.
 * Kode kukode terkait bila tes ini gagal: src/components/SEOHead.astro, src/pages/robots.txt.ts, astro.config.mjs (site, ENV, sitemap)
 */
import { test, expect, SEO_ROUTES, metaContent, collectSitemapUrls } from '../fixtures/base';

test.describe('SEO @seo', () => {
  test('title unik, description, canonical absolut, OG & Twitter lengkap, satu h1 (semua route utama)', async ({ page }) => {
    const titles = new Map<string, string>();
    for (const route of SEO_ROUTES) {
      await test.step(route, async () => {
        await page.goto(route);
        const title = await page.title();
        expect.soft(title.length, `title ${route}`).toBeGreaterThan(10);
        expect.soft(titles.has(title), `title duplikat di ${route}: "${title}" (juga di ${titles.get(title)})`).toBe(false);
        titles.set(title, route);

        const desc = (await metaContent(page, 'meta[name="description"]')) ?? '';
        expect.soft(desc.length, `description ${route}`).toBeGreaterThan(50);

        expect.soft(await page.locator('link[rel="canonical"]').getAttribute('href'), `canonical ${route}`).toMatch(/^https?:\/\//);

        for (const og of ['og:title', 'og:description', 'og:url', 'og:image', 'og:site_name', 'og:locale']) {
          expect.soft(await metaContent(page, `meta[property="${og}"]`), `${og} ${route}`).toBeTruthy();
        }
        expect.soft(await metaContent(page, 'meta[name="twitter:card"]'), `twitter:card ${route}`).toBe('summary_large_image');
        expect.soft(await page.locator('h1').count(), `jumlah h1 ${route}`).toBe(1);
      });
    }
  });

  test('[HIPOTESIS] canonical & og:url memakai origin yang sama dengan situs yang diuji', async ({ page, baseURL }) => {
    // astro.config.mjs: site = PUBLIC_SITE_URL, fallback https://kukode.com. Di CI, build memakai PUBLIC_SITE_URL=baseURL.
    const origin = new URL(baseURL!).origin;
    for (const route of SEO_ROUTES) {
      await page.goto(route);
      const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
      const ogUrl = await metaContent(page, 'meta[property="og:url"]');
      expect.soft(new URL(canonical!).origin, `canonical ${route}`).toBe(origin);
      expect.soft(new URL(ogUrl!).origin, `og:url ${route}`).toBe(origin);
    }
  });

  test('JSON-LD valid di semua route utama', async ({ page }) => {
    for (const route of SEO_ROUTES) {
      await page.goto(route);
      const blocks = await page.locator('script[type="application/ld+json"]').allTextContents();
      for (const raw of blocks) {
        const parsed = JSON.parse(raw); // melempar bila JSON rusak
        expect.soft(String(parsed['@context']), `@context ${route}`).toContain('schema.org');
      }
    }
  });

  test('robots.txt produksi: Allow /, Disallow /admin/, memuat Sitemap', async ({ request }) => {
    const res = await request.get('/robots.txt');
    expect(res.status()).toBe(200);
    const body = await res.text();
    expect(body, 'ENV bukan production? robots.txt berisi Disallow: /').not.toMatch(/^Disallow:\s*\/\s*$/m);
    expect(body).toContain('Disallow: /admin/');
    expect(body).toMatch(/^Sitemap:\s*https?:\/\//m);
  });

  test('meta robots index,follow dan tanpa X-Robots-Tag noindex', async ({ page }) => {
    const response = await page.goto('/');
    expect(await metaContent(page, 'meta[name="robots"]')).toContain('index');
    expect(response?.headers()['x-robots-tag'] ?? '').not.toMatch(/noindex/i);
  });

  test('sitemap: URL bisa dibuka, tanpa /admin & /404, origin konsisten', async ({ request, baseURL }) => {
    const urls = await collectSitemapUrls(request, '/sitemap.xml');
    expect(urls.length).toBeGreaterThan(5);
    expect(urls.filter((u) => /\/admin|\/404/.test(u))).toEqual([]);

    const origin = new URL(baseURL!).origin;
    expect.soft(urls.filter((u) => new URL(u).origin !== origin), 'URL sitemap di luar origin yang diuji').toEqual([]);

    for (const u of urls.slice(0, 20)) {
      const res = await request.get(new URL(u).pathname);
      expect.soft(res.status(), u).toBeLessThan(400);
    }
  });

  for (const feed of ['/rss.xml', '/id/rss.xml']) {
    test(`RSS ${feed} valid dan berisi item`, async ({ request }) => {
      const res = await request.get(feed);
      expect(res.status()).toBe(200);
      const xml = await res.text();
      expect(xml).toContain('<rss');
      expect((xml.match(/<item>/g) ?? []).length).toBeGreaterThan(0);
    });
  }

  test('favicon, apple-touch-icon, webmanifest tersedia dan manifest valid JSON', async ({ request }) => {
    for (const path of ['/favicon.ico', '/apple-touch-icon.png']) {
      expect((await request.get(path)).status(), path).toBe(200);
    }
    const manifest = await request.get('/site.webmanifest');
    expect(manifest.status()).toBe(200);
    expect(await manifest.json()).toHaveProperty('name'); // .json() melempar bila bukan JSON valid
  });
});
