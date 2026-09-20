// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// Site static: HTML generat la build, servit de Cloudflare Pages.
// `www` rămâne varianta canonică (ca pe site-ul Wix actual).
export default defineConfig({
  site: 'https://www.upburnout.com',
  output: 'static',
  trailingSlash: 'never',
  build: { format: 'directory' },
  // v7 folosește regulile JSX de whitespace; păstrăm compresia HTML-aware (lossless)
  // ca textele verbatim să nu piardă spațiile dintre elementele inline.
  compressHTML: true,
  vite: {
    plugins: [tailwindcss()],
  },
});
