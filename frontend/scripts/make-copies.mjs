// Două copii ale site-ului, pentru găzduirea de la UVT și pentru cine cere „fișierele site-ului”.
//
//   dist-server/   — de urcat ca atare în `public_html` (Apache, UVT). Identic cu dist/, minus
//                    fișierele care sunt doar pentru Cloudflare.
//   dist-offline/  — se deschide prin dublu-click pe index.html (căi relative, totul într-un
//                    singur nivel: `echipa.html` în loc de `echipă/index.html`).
//
// Conținutul textual rămâne neschimbat; se rescriu doar căile.
// Rulare: npm run build:uvt   (sau: npm run build && npm run copies)

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const src = path.join(root, 'dist');

/** Fișiere de configurare Cloudflare — fără efect pe alt server, deci nu se publică acolo. */
const CF_ONLY = new Set(['_headers', '_redirects']);
/** Fișierele pentru motoarele de căutare n-au sens într-o copie deschisă de pe disc. */
const SEO = new Set(['robots.txt', 'sitemap-index.xml', 'sitemap-0.xml']);
const TEAM_DIR = 'echipă';
const TEAM_FLAT = 'echipa.html';

if (!fs.existsSync(src)) {
  console.error('Lipsește dist/. Rulează întâi: npm run build');
  process.exit(1);
}

function copyTree(from, to, transform) {
  fs.mkdirSync(to, { recursive: true });
  for (const entry of fs.readdirSync(from, { withFileTypes: true })) {
    const a = path.join(from, entry.name);
    const b = path.join(to, entry.name);
    if (entry.isDirectory()) copyTree(a, b, transform);
    else transform(a, b, entry.name);
  }
}

// --- 1. Copia pentru serverul UVT ------------------------------------------------------------
const server = path.join(root, 'dist-server');
fs.rmSync(server, { recursive: true, force: true });
copyTree(src, server, (from, to) => fs.copyFileSync(from, to));
for (const name of CF_ONLY) fs.rmSync(path.join(server, name), { force: true });

// --- 2. Copia pentru deschidere de pe disc ----------------------------------------------------
// Totul într-un singur nivel, cu căi relative: `echipă/index.html` devine `echipa.html`
// (fără diacritică — unele arhivatoare o strică la dezarhivare).
const toRelative = (html) =>
  html
    // sitemap/robots nu intră în copia locală → scoatem și referința din <head>
    .replace(/<link rel="sitemap"[^>]*>/g, '')
    .replaceAll('href="/echipă/#', `href="${TEAM_FLAT}#`)
    .replaceAll('href="/echipă/"', `href="${TEAM_FLAT}"`)
    .replaceAll('href="/#', 'href="index.html#')
    .replaceAll('href="/"', 'href="index.html"')
    // /_astro/…, /favicon.ico, /qr-questionpro.png etc. (nu și //… sau https://…)
    .replace(/(href|src)="\/(?!\/)/g, '$1="')
    .replace(/srcset="([^"]*)"/g, (m, v) => `srcset="${v.replace(/(^|,\s*)\//g, '$1')}"`);

const offline = path.join(root, 'dist-offline');
fs.rmSync(offline, { recursive: true, force: true });
fs.mkdirSync(offline, { recursive: true });
for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
  if (CF_ONLY.has(entry.name) || SEO.has(entry.name)) continue;
  const a = path.join(src, entry.name);
  if (entry.name === TEAM_DIR) {
    fs.writeFileSync(
      path.join(offline, TEAM_FLAT),
      toRelative(fs.readFileSync(path.join(a, 'index.html'), 'utf8')),
      'utf8',
    );
  } else if (entry.isDirectory()) {
    // fonturile sunt lângă CSS, în același folder `_astro/`
    copyTree(a, path.join(offline, entry.name), (from, to, name) =>
      name.endsWith('.css')
        ? fs.writeFileSync(to, fs.readFileSync(from, 'utf8').replaceAll('url(/_astro/', 'url('))
        : fs.copyFileSync(from, to),
    );
  } else if (entry.name.endsWith('.html')) {
    fs.writeFileSync(
      path.join(offline, entry.name),
      toRelative(fs.readFileSync(a, 'utf8')),
      'utf8',
    );
  } else {
    fs.copyFileSync(a, path.join(offline, entry.name));
  }
}

// --- Verificări --------------------------------------------------------------------------------
const problems = [];
const serverHome = fs.readFileSync(path.join(server, 'index.html'), 'utf8');
// Pe serverul UVT formularul trebuie să aibă adresa completă a worker-ului (altfel postează în gol).
if (/action="\/api\/contact"/.test(serverHome)) {
  problems.push('dist-server: formularul are adresa relativă — rulează `npm run build:uvt`');
}
if (!fs.existsSync(path.join(server, TEAM_DIR, 'index.html'))) {
  problems.push(`dist-server: lipsește ${TEAM_DIR}/index.html`);
}
if (!fs.existsSync(path.join(offline, TEAM_FLAT)))
  problems.push(`dist-offline: lipsește ${TEAM_FLAT}`);
for (const name of fs.readdirSync(offline)) {
  if (!/\.(html|css)$/.test(name)) continue;
  const text = fs.readFileSync(path.join(offline, name), 'utf8');
  for (const m of text.matchAll(/(?:href|src|srcset)="[^"]*"|url\([^)]*\)/g)) {
    if (/(?:="|\(|,\s*)\/(?!\/)/.test(m[0]))
      problems.push(`dist-offline ${name}: ${m[0].slice(0, 80)}`);
  }
}
if (problems.length) {
  console.error(problems.join('\n'));
  process.exit(1);
}
console.log('dist-server/   (de urcat în public_html pe serverul UVT)');
console.log('dist-offline/  (dublu-click pe index.html)');
