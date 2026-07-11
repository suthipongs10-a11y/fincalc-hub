// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// Live domain (registered 2026-07-11, Cloudflare Registrar + Pages).
export default defineConfig({
  site: 'https://payofflogic.com',
  output: 'static',
  trailingSlash: 'always',
  vite: {
    plugins: [tailwindcss()],
  },
});
