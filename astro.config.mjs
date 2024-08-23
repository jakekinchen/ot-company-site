import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import node from '@astrojs/node';

import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// https://astro.build/config
export default defineConfig({
  //output: 'hybrid',
  //adapter: node({
  //  mode: 'standalone'
  //}),
  vite: {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src')
      },
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.d.ts']
    }
  },
  outDir: './dist',
  site: 'https://onetier.com',
  integrations: [
    react({
      include: ['**/components/react/*'], // Adjust the path according to your project structure
    }),
    mdx(),
    //sitemap(),
  ],
  devOptions: {
    tailwindConfig: './tailwind.config.js',
	proxy: {
		'/api': 'http://localhost:4321', // Proxy API requests to your backend
	  },
  },
});