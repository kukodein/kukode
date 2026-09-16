import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { loadEnv } from 'vite';

const { ENV, PUBLIC_SITE_URL } = loadEnv(process.env.NODE_ENV ?? 'development', process.cwd(), '');
const siteUrl = PUBLIC_SITE_URL || (ENV === 'local' ? 'http://localhost:4321' : 'https://kukode.com');

export default defineConfig({
  site: siteUrl,
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
  ],
});
