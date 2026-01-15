import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import keystatic from '@keystatic/astro';
import node from '@astrojs/node';

export default defineConfig({
  output: 'server',
  adapter: node({
    mode: 'standalone', // phổ biến nhất
  }),
  integrations: [
    tailwind(),
    react(),
    keystatic({
      configPath: './keystatic.config.ts',
    }),
  ],
});