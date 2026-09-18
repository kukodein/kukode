import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const GET: APIRoute = async ({ site }) => {
  const baseUrl = site?.toString().replace(/\/$/, '') || 'https://kukode.com';
  const posts = await getCollection('posts', ({ id, data }) => id.startsWith('id/') && !data.draft);
  const sortedPosts = posts.sort(
    (a, b) => new Date(b.data.pubDate).getTime() - new Date(a.data.pubDate).getTime()
  );

  const itemsXml = sortedPosts
    .map((post) => {
      const slug = post.data.custom_slug || post.id.replace(/^id\//, '');
      const link = `${baseUrl}/id/article/${slug}/`;
      const pubDate = new Date(post.data.pubDate).toUTCString();

      return `    <item>
      <title><![CDATA[${post.data.title}]]></title>
      <description><![CDATA[${post.data.description || ''}]]></description>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${pubDate}</pubDate>
    </item>`;
    })
    .join('\n');

  const rssFeed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Kukode Blog - Artikel &amp; Berita</title>
    <description>Artikel, tutorial, dan wawasan terbaru dari Kukode Digital Technology</description>
    <link>${baseUrl}/id/article/</link>
    <atom:link href="${baseUrl}/id/rss.xml" rel="self" type="application/rss+xml" />
    <language>id</language>
${itemsXml}
  </channel>
</rss>`;

  return new Response(rssFeed, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
};

