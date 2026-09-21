// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// Site static: HTML generat la build, servit de Cloudflare Pages.
// `www` rămâne varianta canonică (ca pe site-ul Wix actual).
export default defineConfig({
  site: 'https://www.upburnout.com',
  output: 'static',
  trailingSlash: 'never',
  build: { format: 'file' }, // /echipă → dist/echipă.html (fără slash final, ca pe Wix)
  // v7 folosește regulile JSX de whitespace; păstrăm compresia HTML-aware (lossless)
  // ca textele verbatim să nu piardă spațiile dintre elementele inline.
  compressHTML: true,
  integrations: [
    // sitemap-index.xml + sitemap-0.xml; pagina 404 nu intră
    sitemap({ filter: (page) => !page.includes('/404') }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
