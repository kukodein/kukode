import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { loadEnv } from 'vite';

const { ENV, PUBLIC_SITE_URL, GA_ID, GTM_ID } = loadEnv(process.env.NODE_ENV ?? 'development', process.cwd(), '');
const currentEnv = ENV || 'development';
const isNotProduction = currentEnv !== 'production';
const siteUrl = PUBLIC_SITE_URL || (currentEnv === 'local' ? 'http://localhost:4321' : 'https://kukode.com');

// Integration to generate production caching, security headers, and non-production X-Robots-Tag
function serverHeadersIntegration() {
  return {
    name: 'server-headers-integration',
    hooks: {
      'astro:build:done': async ({ dir }) => {
        const fs = await import('fs/promises');
        const path = await import('path');
        const { fileURLToPath } = await import('url');
        const outDir = fileURLToPath(dir);

        // 1. Build _headers (Netlify & Cloudflare Pages)
        let headersContent = `/*
  X-Frame-Options: SAMEORIGIN
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()
`;
        if (isNotProduction) {
          headersContent += `  X-Robots-Tag: noindex, nofollow\n`;
        }
        headersContent += `
# Cache static assets aggressively (1 year)
/fonts/*
  Cache-Control: public, max-age=31536000, immutable
/image/*
  Cache-Control: public, max-age=31536000, immutable
/css/*
  Cache-Control: public, max-age=31536000, immutable
/js/*
  Cache-Control: public, max-age=31536000, immutable
/vendor/*
  Cache-Control: public, max-age=31536000, immutable
/_astro/*
  Cache-Control: public, max-age=31536000, immutable
`;
        await fs.writeFile(path.join(outDir, '_headers'), headersContent, 'utf-8');

        // 2. Build .htaccess (Apache / cPanel / LiteSpeed)
        let htaccessContent = `<IfModule mod_headers.c>
  Header set X-Frame-Options "SAMEORIGIN"
  Header set X-Content-Type-Options "nosniff"
  Header set Referrer-Policy "strict-origin-when-cross-origin"
  Header set Permissions-Policy "camera=(), microphone=(), geolocation=()"
`;
        if (isNotProduction) {
          htaccessContent += `  Header set X-Robots-Tag "noindex, nofollow"\n`;
        }
        htaccessContent += `
  <FilesMatch "\\.(ico|pdf|flv|jpg|jpeg|png|gif|webp|avif|js|css|swf|woff2|woff|ttf|svg)$">
    Header set Cache-Control "max-age=31536000, public, immutable"
  </FilesMatch>
</IfModule>

<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType font/woff2 "access plus 1 year"
  ExpiresByType font/woff "access plus 1 year"
  ExpiresByType font/ttf "access plus 1 year"
  ExpiresByType image/webp "access plus 1 year"
  ExpiresByType image/avif "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/svg+xml "access plus 1 year"
  ExpiresByType text/css "access plus 1 year"
  ExpiresByType application/javascript "access plus 1 year"
  ExpiresByType text/javascript "access plus 1 year"
</IfModule>
`;
        await fs.writeFile(path.join(outDir, '.htaccess'), htaccessContent, 'utf-8');
      },
    },
  };
}

export default defineConfig({
  site: siteUrl,
  server: {
    headers: isNotProduction ? { 'X-Robots-Tag': 'noindex, nofollow' } : {},
  },
  preview: {
    headers: isNotProduction ? { 'X-Robots-Tag': 'noindex, nofollow' } : {},
  },
  vite: {
    define: {
      'import.meta.env.ENV': JSON.stringify(currentEnv),
      'import.meta.env.GA_ID': JSON.stringify(GA_ID || ''),
      'import.meta.env.GTM_ID': JSON.stringify(GTM_ID || ''),
    },
  },
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'id'],
    routing: {
      prefixDefaultLocale: false,
      redirectToDefaultLocale: false,
    },
  },
  integrations: [
    sitemap({
      xslURL: '/sitemap.xsl',
      lastmod: new Date(),
      changefreq: 'weekly',
      i18n: {
        defaultLocale: 'en',
        locales: {
          en: 'en',
          id: 'id-ID',
        },
      },
      filter: (page) => {
        if (page.includes('/admin') || page.includes('/404')) return false;
        try {
          const url = new URL(page);
          if (url.pathname.startsWith('/portfolio/') && url.pathname !== '/portfolio/') {
            return false;
          }
        } catch {
          if (page.includes('/portfolio/') && !page.endsWith('/portfolio/')) return false;
        }
        return true;
      },
    }),
    serverHeadersIntegration(),
  ],
});
