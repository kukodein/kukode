import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

interface SitemapItem {
  loc: string;
  lastmod?: string;
  changefreq?: string;
  priority?: string;
  alternateEn?: string;
  alternateId?: string;
}

export const GET: APIRoute = async ({ site }) => {
  const baseUrl = site?.toString().replace(/\/$/, '') || 'https://kukode.com';
  const today = new Date().toISOString().split('T')[0];

  const items: SitemapItem[] = [];

  // 1. Core static routes (Home, Blog, Authors)
  items.push({
    loc: `${baseUrl}/`,
    lastmod: today,
    changefreq: 'daily',
    priority: '1.0',
    alternateEn: `${baseUrl}/`,
    alternateId: `${baseUrl}/id/`,
  });

  items.push({
    loc: `${baseUrl}/id/`,
    lastmod: today,
    changefreq: 'daily',
    priority: '1.0',
    alternateEn: `${baseUrl}/`,
    alternateId: `${baseUrl}/id/`,
  });

  items.push({
    loc: `${baseUrl}/article/`,
    lastmod: today,
    changefreq: 'daily',
    priority: '0.9',
    alternateEn: `${baseUrl}/article/`,
    alternateId: `${baseUrl}/id/article/`,
  });

  items.push({
    loc: `${baseUrl}/id/article/`,
    lastmod: today,
    changefreq: 'daily',
    priority: '0.9',
    alternateEn: `${baseUrl}/article/`,
    alternateId: `${baseUrl}/id/article/`,
  });

  items.push({
    loc: `${baseUrl}/author/`,
    lastmod: today,
    changefreq: 'weekly',
    priority: '0.8',
    alternateEn: `${baseUrl}/author/`,
    alternateId: `${baseUrl}/id/author/`,
  });

  items.push({
    loc: `${baseUrl}/id/author/`,
    lastmod: today,
    changefreq: 'weekly',
    priority: '0.8',
    alternateEn: `${baseUrl}/author/`,
    alternateId: `${baseUrl}/id/author/`,
  });

  // 2. Pages Collection (e.g. /about/ and /id/tentang/)
  const allPages = await getCollection('pages', ({ data }) => !data.draft);
  const enPages = allPages.filter((p) => p.id.startsWith('en/'));
  const idPages = allPages.filter((p) => p.id.startsWith('id/'));

  for (const page of enPages) {
    const slug = page.data.custom_slug || page.id.replace(/^en\//, '');
    const counterpart = idPages.find((p) => {
      if (page.data.translation_key && p.data.translation_key) {
        return p.data.translation_key === page.data.translation_key;
      }
      return p.id === page.id.replace(/^en\//, 'id/');
    });
    const counterpartSlug = counterpart ? counterpart.data.custom_slug || counterpart.id.replace(/^id\//, '') : null;

    items.push({
      loc: `${baseUrl}/${slug}/`,
      lastmod: today,
      changefreq: 'monthly',
      priority: '0.7',
      alternateEn: `${baseUrl}/${slug}/`,
      alternateId: counterpartSlug ? `${baseUrl}/id/${counterpartSlug}/` : undefined,
    });
  }

  for (const page of idPages) {
    const slug = page.data.custom_slug || page.id.replace(/^id\//, '');
    const counterpart = enPages.find((p) => {
      if (page.data.translation_key && p.data.translation_key) {
        return p.data.translation_key === page.data.translation_key;
      }
      return p.id === page.id.replace(/^id\//, 'en/');
    });
    const counterpartSlug = counterpart ? counterpart.data.custom_slug || counterpart.id.replace(/^en\//, '') : null;

    items.push({
      loc: `${baseUrl}/id/${slug}/`,
      lastmod: today,
      changefreq: 'monthly',
      priority: '0.7',
      alternateEn: counterpartSlug ? `${baseUrl}/${counterpartSlug}/` : undefined,
      alternateId: `${baseUrl}/id/${slug}/`,
    });
  }

  // 3. Posts Collection
  const allPosts = await getCollection('posts', ({ data }) => !data.draft);
  const enPosts = allPosts.filter((p) => p.id.startsWith('en/'));
  const idPosts = allPosts.filter((p) => p.id.startsWith('id/'));

  for (const post of enPosts) {
    const slug = post.data.custom_slug || post.id.replace(/^en\//, '');
    const counterpart = idPosts.find((p) => {
      if (post.data.translation_key && p.data.translation_key) {
        return p.data.translation_key === post.data.translation_key;
      }
      return p.id === post.id.replace(/^en\//, 'id/');
    });
    const counterpartSlug = counterpart ? counterpart.data.custom_slug || counterpart.id.replace(/^id\//, '') : null;
    const lastmod = (post.data.updatedDate || post.data.pubDate).toISOString().split('T')[0];

    items.push({
      loc: `${baseUrl}/article/${slug}/`,
      lastmod,
      changefreq: 'weekly',
      priority: '0.8',
      alternateEn: `${baseUrl}/article/${slug}/`,
      alternateId: counterpartSlug ? `${baseUrl}/id/article/${counterpartSlug}/` : undefined,
    });
  }

  for (const post of idPosts) {
    const slug = post.data.custom_slug || post.id.replace(/^id\//, '');
    const counterpart = enPosts.find((p) => {
      if (post.data.translation_key && p.data.translation_key) {
        return p.data.translation_key === post.data.translation_key;
      }
      return p.id === post.id.replace(/^id\//, 'en/');
    });
    const counterpartSlug = counterpart ? counterpart.data.custom_slug || counterpart.id.replace(/^en\//, '') : null;
    const lastmod = (post.data.updatedDate || post.data.pubDate).toISOString().split('T')[0];

    items.push({
      loc: `${baseUrl}/id/article/${slug}/`,
      lastmod,
      changefreq: 'weekly',
      priority: '0.8',
      alternateEn: counterpartSlug ? `${baseUrl}/article/${counterpartSlug}/` : undefined,
      alternateId: `${baseUrl}/id/article/${slug}/`,
    });
  }

  // 4. Categories Collection
  const allCategories = await getCollection('categories');
  const enCategories = allCategories.filter((c) => c.id.startsWith('en/'));
  const idCategories = allCategories.filter((c) => c.id.startsWith('id/'));

  for (const cat of enCategories) {
    const slug = cat.data.slug || cat.data.custom_slug || cat.id.replace(/^en\//, '').replace(/\.(md|json)$/, '');
    const counterpart = idCategories.find((c) => {
      if (cat.data.translation_key && c.data.translation_key) {
        return c.data.translation_key === cat.data.translation_key;
      }
      return c.id.replace(/^id\//, '') === cat.id.replace(/^en\//, '');
    });
    const counterpartSlug = counterpart
      ? counterpart.data.slug || counterpart.data.custom_slug || counterpart.id.replace(/^id\//, '').replace(/\.(md|json)$/, '')
      : null;

    items.push({
      loc: `${baseUrl}/category/${slug}/`,
      lastmod: today,
      changefreq: 'weekly',
      priority: '0.6',
      alternateEn: `${baseUrl}/category/${slug}/`,
      alternateId: counterpartSlug ? `${baseUrl}/id/category/${counterpartSlug}/` : undefined,
    });
  }

  for (const cat of idCategories) {
    const slug = cat.data.slug || cat.data.custom_slug || cat.id.replace(/^id\//, '').replace(/\.(md|json)$/, '');
    const counterpart = enCategories.find((c) => {
      if (cat.data.translation_key && c.data.translation_key) {
        return c.data.translation_key === cat.data.translation_key;
      }
      return c.id.replace(/^en\//, '') === cat.id.replace(/^id\//, '');
    });
    const counterpartSlug = counterpart
      ? counterpart.data.slug || counterpart.data.custom_slug || counterpart.id.replace(/^en\//, '').replace(/\.(md|json)$/, '')
      : null;

    items.push({
      loc: `${baseUrl}/id/category/${slug}/`,
      lastmod: today,
      changefreq: 'weekly',
      priority: '0.6',
      alternateEn: counterpartSlug ? `${baseUrl}/category/${counterpartSlug}/` : undefined,
      alternateId: `${baseUrl}/id/category/${slug}/`,
    });
  }

  // 5. Authors Collection
  const allAuthors = await getCollection('authors');
  const enAuthors = allAuthors.filter((a) => a.id.startsWith('en/'));
  const idAuthors = allAuthors.filter((a) => a.id.startsWith('id/'));

  for (const author of enAuthors) {
    const slug = author.data.custom_slug || author.id.replace(/^en\//, '').replace(/\.(md|json)$/, '');
    const counterpart = idAuthors.find((a) => {
      return (
        a.data.name.toLowerCase() === author.data.name.toLowerCase() ||
        a.id.replace(/^id\//, '') === author.id.replace(/^en\//, '')
      );
    });
    const counterpartSlug = counterpart
      ? counterpart.data.custom_slug || counterpart.id.replace(/^id\//, '').replace(/\.(md|json)$/, '')
      : null;

    items.push({
      loc: `${baseUrl}/author/${slug}/`,
      lastmod: today,
      changefreq: 'weekly',
      priority: '0.7',
      alternateEn: `${baseUrl}/author/${slug}/`,
      alternateId: counterpartSlug ? `${baseUrl}/id/author/${counterpartSlug}/` : undefined,
    });
  }

  for (const author of idAuthors) {
    const slug = author.data.custom_slug || author.id.replace(/^id\//, '').replace(/\.(md|json)$/, '');
    const counterpart = enAuthors.find((a) => {
      return (
        a.data.name.toLowerCase() === author.data.name.toLowerCase() ||
        a.id.replace(/^en\//, '') === author.id.replace(/^id\//, '')
      );
    });
    const counterpartSlug = counterpart
      ? counterpart.data.custom_slug || counterpart.id.replace(/^en\//, '').replace(/\.(md|json)$/, '')
      : null;

    items.push({
      loc: `${baseUrl}/id/author/${slug}/`,
      lastmod: today,
      changefreq: 'weekly',
      priority: '0.7',
      alternateEn: counterpartSlug ? `${baseUrl}/author/${counterpartSlug}/` : undefined,
      alternateId: `${baseUrl}/id/author/${slug}/`,
    });
  }

  // Generate XML
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${items
  .map((item) => {
    const alternates: string[] = [];
    if (item.alternateEn) {
      alternates.push(`    <xhtml:link rel="alternate" hreflang="en" href="${item.alternateEn}" />`);
    }
    if (item.alternateId) {
      alternates.push(`    <xhtml:link rel="alternate" hreflang="id" href="${item.alternateId}" />`);
    }
    if (item.alternateEn) {
      alternates.push(`    <xhtml:link rel="alternate" hreflang="x-default" href="${item.alternateEn}" />`);
    }

    return `  <url>
    <loc>${item.loc}</loc>${item.lastmod ? `\n    <lastmod>${item.lastmod}</lastmod>` : ''}${item.changefreq ? `\n    <changefreq>${item.changefreq}</changefreq>` : ''}${item.priority ? `\n    <priority>${item.priority}</priority>` : ''}${alternates.length > 0 ? '\n' + alternates.join('\n') : ''}
  </url>`;
  })
  .join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'X-Content-Type-Options': 'nosniff',
    },
  });
};
