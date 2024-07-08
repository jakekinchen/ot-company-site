import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  outDir: './dist',
  site: 'https://example.com',
  integrations: [
    react({
      include: ['**/components/react/*'], // Adjust the path according to your project structure
    }),
    mdx(),
    sitemap(),
  ],
  devOptions: {
    tailwindConfig: './tailwind.config.js',
	proxy: {
		'/api': 'http://localhost:4321', // Proxy API requests to your backend
	  },
  },
});