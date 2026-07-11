// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// Site URL is a placeholder until the owner picks a final domain (see STATUS.md).
// Cloudflare Pages will serve the default *.pages.dev URL until then.
export default defineConfig({
  site: 'https://fincalc-hub.pages.dev',
  output: 'static',
  trailingSlash: 'always',
  vite: {
    plugins: [tailwindcss()],
  },
});
