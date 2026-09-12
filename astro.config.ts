import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { SITE } from './src/data/site';
import { pageLastmod } from './src/data/lastmod';

const root = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  site: SITE.url,
  // Matches the URL shape the site has always had (/services, /service-area/bondi):
  // one .html per route, no trailing slash. Vercel resolves /services to services.html.
  trailingSlash: 'never',
  build: { format: 'file' },
  integrations: [
    react(),
    sitemap({
      filter: (page) =>
        !page.includes('/thank-you') &&
        !page.includes('/404') &&
        !page.includes('/service-area/sydney') &&
        // homepage test variant (noindex) — keep it out of the sitemap
        new URL(page).pathname.replace(/\/$/, '') !== '/b',
      serialize: (item) => ({ ...item, lastmod: pageLastmod(new URL(item.url).pathname) }),
    }),
  ],
  redirects: {
    '/service-area/sydney': '/service-areas',
  },
  vite: {
    // The lead form, analytics and Places key are configured as VITE_* in Vercel.
    // Astro only exposes PUBLIC_* by default; keep both so nothing has to be renamed.
    envPrefix: ['VITE_', 'PUBLIC_'],
    resolve: { alias: { '@': path.resolve(root, './src') } },
  },
});
