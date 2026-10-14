// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// Site static: HTML generat la build. Din 14.10.2026 site-ul este găzduit de UVT, pe Apache
// (`https://upburnout.uvt.ro`); worker-ul Cloudflare rămâne pentru formular (/api/contact) și ca oglindă.
// Alt domeniu → `PUBLIC_SITE_ORIGIN=https://… npm run build` (aceeași variabilă o citește și src/data/site.ts).
//
// Format „directory” + slash final: fiecare pagină e `nume/index.html`, deci orice server web o servește
// fără configurare, iar linkurile interne nu mai trec printr-o redirecționare (pe Apache-ul UVT aceea
// trimitea de pe https pe http).
export default defineConfig({
  site: process.env.PUBLIC_SITE_ORIGIN ?? 'https://upburnout.uvt.ro',
  output: 'static',
  trailingSlash: 'always',
  build: { format: 'directory' }, // /echipă/ → dist/echipă/index.html
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
