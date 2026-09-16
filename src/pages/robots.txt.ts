import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ site }) => {
  const currentEnv = import.meta.env.ENV || 'production';
  const isNotProduction = currentEnv !== 'production';

  if (isNotProduction) {
    const robotsTxt = `User-agent: *
Disallow: /
`;
    return new Response(robotsTxt, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'X-Robots-Tag': 'noindex, nofollow',
      },
    });
  }

  const sitemapUrl = new URL('sitemap-index.xml', site).href;
  const robotsTxt = `User-agent: *
Allow: /
Disallow: /admin/

Sitemap: ${sitemapUrl}
`;
  return new Response(robotsTxt, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
