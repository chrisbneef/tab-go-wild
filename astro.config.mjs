import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { SITE } from './src/config/site.js';

// Static output: Vercel serves dist/ and builds /api/*.js as serverless functions.
export default defineConfig({
  site: SITE.url,
  trailingSlash: 'always',
  build: { format: 'directory', inlineStylesheets: 'auto' },
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/thank-you/'),
    }),
  ],
});
