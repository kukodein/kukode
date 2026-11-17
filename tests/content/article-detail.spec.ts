/**
 * Grup: content
 * Cakupan: Detail artikel: TOC, progress bar, share, copy link/code, JSON-LD.
 * Kode kukode terkait bila tes ini gagal: src/pages/article/[slug].astro, public/js/kukode-article.js, src/components/SocialShare.astro
 */
import { test, expect, firstArticleHref, metaContent } from '../fixtures/base';

test.describe('Detail artikel', () => {
  test('h1, gambar utama termuat, JSON-LD valid, canonical & og:type', async ({ consentedPage: page }) => {
    await page.goto(await firstArticleHref(page));
    await expect(page.locator('h1')).toHaveCount(1);

    const broken = await page.locator('article img').evaluateAll((imgs) =>
      (imgs as HTMLImageElement[]).filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.src),
    );
    expect(broken).toEqual([]);

    const blocks = await page.locator('script[type="application/ld+json"]').allTextContents();
    const types = blocks.map((b) => JSON.parse(b)['@type']);
    expect(types).toContain('BreadcrumbList');

    expect(await metaContent(page, 'meta[property="og:type"]')).toBe('article');
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', /^https?:\/\//);
  });

  test('TOC: jumlah item = jumlah H2/H3; klik item scroll ke heading', async ({ consentedPage: page }) => {
    await page.goto(await firstArticleHref(page));
    const headings = page.locator('.article-body h2, .article-body h3');
    const n = await headings.count();
    const toc = page.locator('#kk-toc-nav a');

    if (n === 0) {
      await expect(page.locator('#kk-toc-nav')).toBeHidden();
      return;
    }
    await expect(toc).toHaveCount(n);
    await toc.nth(Math.min(1, n - 1)).click();
    await expect(page).toHaveURL(/#.+/);
    await expect(headings.nth(Math.min(1, n - 1))).toBeInViewport();
  });

  test('reading progress bar naik dari 0% ke ~100%', async ({ consentedPage: page }) => {
    await page.goto(await firstArticleHref(page));
    const bar = page.locator('#readingProgressBar');
    const width = async () => parseFloat(await bar.evaluate((el) => (el as HTMLElement).style.width || '0'));
    expect(await width()).toBeLessThan(5);
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await expect.poll(width).toBeGreaterThan(90);
  });

  test('link share WA/LinkedIn/X membawa URL & judul ter-encode, target _blank, rel aman', async ({ consentedPage: page }) => {
    await page.goto(await firstArticleHref(page));
    const share = page.locator('.kk-social-share');
    for (const label of ['Share on WhatsApp', 'Share on LinkedIn', 'Share on X']) {
      const a = share.getByRole('link', { name: label });
      await expect(a).toHaveAttribute('target', '_blank');
      await expect(a).toHaveAttribute('rel', /noopener/);
      expect(decodeURIComponent((await a.getAttribute('href'))!)).toContain('http');
    }
  });

  test('Copy Link menyalin URL ke clipboard, toast tampil lalu hilang', async ({ consentedPage: page, context, browserName }) => {
    test.skip(browserName !== 'chromium', 'Izin clipboard-read hanya didukung Chromium');
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.clock.install();
    await page.goto(await firstArticleHref(page));

    const btn = page.locator('.kk-copy-link-btn');
    const expected = await btn.getAttribute('data-url');
    await btn.click();
    await expect(page.locator('#kk-copy-toast')).toHaveClass(/show/);
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(expected);

    await page.clock.fastForward(3000); // toast otomatis hilang setelah 2,5 dtk
    await expect(page.locator('#kk-copy-toast')).not.toHaveClass(/show/);
  });

  test('tombol copy pada code block menyalin isi kode (bila ada code block)', async ({ consentedPage: page, context, browserName }) => {
    test.skip(browserName !== 'chromium', 'Izin clipboard-read hanya didukung Chromium');
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto(await firstArticleHref(page));
    const pre = page.locator('.article-body pre').first();
    test.skip((await pre.count()) === 0, 'Artikel pertama tidak punya code block');
    await pre.hover();
    await pre.locator('.kk-code-copy-btn').click();
    const copied = await page.evaluate(() => navigator.clipboard.readText());
    expect(copied.trim()).toBe(((await pre.locator('code').textContent()) ?? '').trim());
  });
});
