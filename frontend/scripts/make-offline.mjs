// Creează o copie a site-ului care se poate deschide prin dublu-click, direct de pe disc
// (pentru cineva care cere „fișierele site-ului” și nu are un server web).
//
// Build-ul normal (dist/) folosește căi absolute — /_astro/..., /echipă — care funcționează doar
// servite de pe un server. Deschise de pe disc, stilurile și imaginile nu se încarcă („pare că
// lipsesc fișiere”), iar linkul către pagina Echipă nu merge. Scriptul rescrie căile în variantă
// relativă și redenumește `echipă.html` → `echipa.html` (diacritica din nume de fișier se strică
// la unele arhivatoare/servere). Conținutul textual rămâne neschimbat.
//
// Rulare: npm run build && npm run offline  → dist-offline/
// Limitări (explicate și în README-ul pachetului): formularul de contact și verificarea anti-spam
// au nevoie de serverul live, deci local doar se afișează; restul site-ului e complet funcțional.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const src = path.join(root, 'dist');
const out = path.join(root, 'dist-offline');

// Fișiere care au sens doar pe server (Cloudflare / motoare de căutare).
const SKIP = new Set(['_headers', '_redirects', 'robots.txt', 'sitemap-index.xml', 'sitemap-0.xml']);
const TEAM_SRC = 'echipă.html';
const TEAM_OUT = 'echipa.html';

if (!fs.existsSync(src)) {
  console.error('Lipsește dist/. Rulează întâi: npm run build');
  process.exit(1);
}
fs.rmSync(out, { recursive: true, force: true });

/** Rescrie căile absolute ale site-ului în căi relative, pentru deschidere de pe disc. */
function rewriteHtml(html) {
  return (
    html
      // sitemap/robots nu intră în copia locală → scoatem și referința din <head>
      .replace(/<link rel="sitemap"[^>]*>/g, '')
      // linkuri către pagini
      .replaceAll('href="/echipă#', `href="${TEAM_OUT}#`)
      .replaceAll('href="/echipă"', `href="${TEAM_OUT}"`)
      .replaceAll('href="/#', 'href="index.html#')
      .replaceAll('href="/"', 'href="index.html"')
      // resurse: /_astro/..., /favicon.ico, /qr-questionpro.png etc. (nu și //... sau https://...)
      .replace(/(href|src)="\/(?!\/)/g, '$1="')
      .replace(/srcset="([^"]*)"/g, (m, v) => `srcset="${v.replace(/(^|,\s*)\//g, '$1')}"`)
  );
}

/** Fonturile sunt lângă CSS, în același folder `_astro/`. */
const rewriteCss = (css) => css.replaceAll('url(/_astro/', 'url(');

function copyDir(from, to, depth = 0) {
  fs.mkdirSync(to, { recursive: true });
  for (const entry of fs.readdirSync(from, { withFileTypes: true })) {
    if (depth === 0 && SKIP.has(entry.name)) continue;
    const a = path.join(from, entry.name);
    const b = path.join(to, depth === 0 && entry.name === TEAM_SRC ? TEAM_OUT : entry.name);
    if (entry.isDirectory()) {
      copyDir(a, b, depth + 1);
    } else if (entry.name.endsWith('.html')) {
      fs.writeFileSync(b, rewriteHtml(fs.readFileSync(a, 'utf8')), 'utf8');
    } else if (entry.name.endsWith('.css')) {
      fs.writeFileSync(b, rewriteCss(fs.readFileSync(a, 'utf8')), 'utf8');
    } else {
      fs.copyFileSync(a, b);
    }
  }
}

copyDir(src, out);

// Verificare: nicio cale absolută rămasă în HTML/CSS (în afara URL-urilor http(s), care sunt
// metadate sau linkuri externe) și pagina Echipă există cu numele nou.
const leftovers = [];
for (const name of fs.readdirSync(out)) {
  if (!/\.(html|css)$/.test(name)) continue;
  const text = fs.readFileSync(path.join(out, name), 'utf8');
  for (const m of text.matchAll(/(?:href|src|srcset)="[^"]*"|url\([^)]*\)/g)) {
    if (/(?:="|\(|,\s*)\/(?!\/)/.test(m[0])) leftovers.push(`${name}: ${m[0].slice(0, 80)}`);
  }
}
if (!fs.existsSync(path.join(out, TEAM_OUT))) leftovers.push(`lipsește ${TEAM_OUT}`);
if (leftovers.length) {
  console.error('Căi absolute rămase:\n' + leftovers.join('\n'));
  process.exit(1);
}
console.log(`Copie pentru deschidere locală: dist-offline/ (${fs.readdirSync(out).length} intrări)`);
