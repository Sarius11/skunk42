import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

export default defineConfig({
  site: 'https://skunk42.com',
  trailingSlash: 'ignore',
  integrations: [mdx()],
});
