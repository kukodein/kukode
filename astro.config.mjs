import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { loadEnv } from 'vite';

const { ENV, PUBLIC_SITE_URL, GA_ID, GTM_ID } = loadEnv(process.env.NODE_ENV ?? 'development', process.cwd(), '');
const currentEnv = ENV || 'development';
const isNotProduction = currentEnv !== 'production';
const siteUrl = PUBLIC_SITE_URL || (currentEnv === 'local' ? 'http://localhost:4321' : 'https://kukode.com');

// Integration to add X-Robots-Tag for non-production environments
function xRobotsTagIntegration() {
  return {
    name: 'x-robots-tag-integration',
    hooks: {
      'astro:build:done': async ({ dir }) => {
        if (isNotProduction) {
          const fs = await import('fs/promises');
          const path = await import('path');
          const { fileURLToPath } = await import('url');
          const outDir = fileURLToPath(dir);

          // Netlify & Cloudflare Pages _headers
          await fs.writeFile(
            path.join(outDir, '_headers'),
            '/*\n  X-Robots-Tag: noindex, nofollow\n',
            'utf-8'
          );

          // Apache / cPanel .htaccess
          await fs.writeFile(
            path.join(outDir, '.htaccess'),
            '<IfModule mod_headers.c>\n  Header set X-Robots-Tag "noindex, nofollow"\n</IfModule>\n',
            'utf-8'
          );
        }
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
      i18n: {
        defaultLocale: 'en',
        locales: {
          en: 'en',
          id: 'id-ID',
        },
      },
      filter: (page) => !page.includes('/admin') && !page.includes('/404'),
    }),
    xRobotsTagIntegration(),
  ],
});
