import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import keystatic from '@keystatic/astro';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  output: 'server',
  trailingSlash: 'never',
  adapter: cloudflare(),
  integrations: [
    tailwind(),
    react(),
    keystatic({
      configPath: './keystatic.config.ts',
    }),
  ],
});