import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import keystatic from '@keystatic/astro';

export default defineConfig({
  integrations: [
    tailwind(), 
    react(),
    keystatic({
      configPath: './keystatic.config.ts',
    }),
  ],
  output: 'server'
});
