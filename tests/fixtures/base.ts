/**
 * Fixtures & helper bersama untuk semua grup tes.
 * - baseURL TIDAK diset di sini: diambil dari playwright.config (use.baseURL).
 * - Fixture otomatis: isolateThirdParty (blokir analytics, mock wa.me) dan consoleErrors (gagal bila ada error console).
 * - Fixture consentedPage: cookie banner & bubble WhatsApp sudah ditutup.
 */
import { test as base, expect, type APIRequestContext, type Page } from '@playwright/test';

export { expect };

/* ------------------------------------------------------------------ */
/* Konfigurasi & data                                                  */
/* ------------------------------------------------------------------ */

/** true bila target tes adalah server lokal (astro preview) — beberapa tes hanya bermakna di deployment asli. */
export const isLocal = (url?: string) => /^https?:\/\/(localhost|127\.0\.0\.1)/.test(url ?? '');

export const ROUTES = [
  '/',
  '/id/',
  '/article/',
  '/id/article/',
  '/portfolio/',
  '/category/',
  '/id/category/',
  '/author/',
  '/id/author/',
  '/about/',
  '/id/about/',
  '/contact/',
  '/id/contact/',
  '/company-profile-website/',
  '/id/jasa-pembuatan-website-company-profile/',
] as const;

export const SEO_ROUTES = ['/', '/id/', '/article/', '/portfolio/', '/about/', '/contact/'] as const;

export const VIEWPORTS = [
  { name: 'mobile-320', width: 320, height: 640 },
  { name: 'mobile-375', width: 375, height: 812 },
  { name: 'tablet-768', width: 768, height: 1024 },
  { name: 'desktop-1440', width: 1440, height: 900 },
] as const;

export const HOME_SECTION_ORDER = [
  'section-hero',
  'trusted',
  'section-marquee',
  'numbers',
  'about-us',
  'services',
  'process',
  'portfolio',
  'stack',
  'testimony',
  'why-kukode',
  'pricing',
  'blog',
  'faq',
  'contact',
];

// Console error dari host ini diabaikan (diblokir oleh fixture isolateThirdParty).
export const IGNORED_CONSOLE_HOSTS = /googletagmanager|google-analytics|doubleclick|googleapis|gstatic/i;

/* ------------------------------------------------------------------ */
/* Fixtures                                                            */
/* ------------------------------------------------------------------ */

type Fixtures = {
  /** auto: blokir analytics, mock WhatsApp */
  isolateThirdParty: void;
  /** auto: kumpulkan error console/pageerror, gagal di akhir test bila ada */
  consoleErrors: string[];
  /** option: matikan gate error console untuk test yang memang mengharapkan error */
  failOnConsoleError: boolean;
  /** page dengan cookie banner sudah ditutup + bubble WA sudah di-dismiss */
  consentedPage: Page;
};

export const test = base.extend<Fixtures>({
  isolateThirdParty: [
    async ({ context }, use) => {
      await context.route(/googletagmanager\.com|google-analytics\.com|doubleclick\.net/, (route) =>
        route.abort(),
      );
      await context.route(/^https:\/\/(wa\.me|api\.whatsapp\.com)\//, (route) =>
        route.fulfill({ status: 200, contentType: 'text/html', body: '<html><body>mock whatsapp</body></html>' }),
      );
      await use();
    },
    { auto: true },
  ],

  failOnConsoleError: [true, { option: true }],

  consoleErrors: [
    async ({ page, failOnConsoleError }, use) => {
      const errors: string[] = [];
      page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
      page.on('console', (m) => {
        if (m.type() !== 'error') return;
        if (IGNORED_CONSOLE_HOSTS.test(m.location().url)) return;
        errors.push(`console.error: ${m.text()} (${m.location().url})`);
      });
      await use(errors);
      if (failOnConsoleError) {
        expect(errors, 'Tidak boleh ada error console / pageerror').toEqual([]);
      }
    },
    { auto: true },
  ],

  consentedPage: async ({ page }, use) => {
    await page.addInitScript(() => {
      localStorage.setItem('kk-cookie-consent', 'accepted');
      sessionStorage.setItem('kk-wa-dismissed', '1');
    });
    await use(page);
  },
});

/* ------------------------------------------------------------------ */
/* Helper                                                              */
/* ------------------------------------------------------------------ */

export const getLocal = (page: Page, key: string) => page.evaluate((k) => localStorage.getItem(k), key);
export const getSession = (page: Page, key: string) => page.evaluate((k) => sessionStorage.getItem(k), key);

/** Scroll bertahap supaya gambar lazy-load dan scroll handler terpicu, lalu kembali ke atas. */
export async function scrollThrough(page: Page) {
  await page.evaluate(async () => {
    const step = Math.max(300, window.innerHeight * 0.8);
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 60));
    }
    window.scrollTo(0, 0);
  });
}

/** Href artikel pertama dari halaman daftar (tidak hardcode slug). */
export async function firstArticleHref(page: Page): Promise<string> {
  await page.goto('/article/');
  const href = await page.locator('#paginated-posts-wrap a[href^="/article/"]').first().getAttribute('href');
  expect(href, 'harus ada minimal satu artikel').toBeTruthy();
  return href!;
}

export async function metaContent(page: Page, selector: string) {
  return page.locator(selector).first().getAttribute('content');
}

export async function collectSitemapUrls(request: APIRequestContext, path: string, depth = 0): Promise<string[]> {
  const res = await request.get(path);
  expect(res.status(), `GET ${path}`).toBe(200);
  const xml = await res.text();
  const locs = [...xml.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/g)].map((m) => m[1]);
  if (xml.includes('<sitemapindex') && depth < 2) {
    const nested: string[] = [];
    for (const loc of locs) {
      // pakai pathname agar tetap menembak baseURL, bukan domain di dalam sitemap
      nested.push(...(await collectSitemapUrls(request, new URL(loc).pathname, depth + 1)));
    }
    return nested;
  }
  return locs;
}
