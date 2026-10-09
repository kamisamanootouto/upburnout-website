// Două copii ale site-ului, pentru cineva din afara proiectului care cere „fișierele site-ului”.
// Build-ul nostru (dist/) e făcut pentru Cloudflare Workers: căi absolute (/_astro/…) și pagina
// `echipă.html` servită la adresa `/echipă` (Cloudflare adaugă singur extensia). În altă parte asta
// se vede ca două probleme: deschis de pe disc, site-ul apare fără design („pare că lipsesc
// fișiere”); urcat pe un Apache/Nginx obișnuit, linkul către Echipă dă 404.
//
//   dist-offline/  — dublu-click pe index.html; căi relative, `echipa.html` fără diacritică.
//   dist-server/   — de urcat ca atare pe orice server web; pagina devine `echipă/index.html`,
//                    deci adresa `/echipă` merge fără nicio configurare pe server.
//
// Conținutul textual rămâne neschimbat; se rescriu doar căile. Formularul de contact funcționează
// doar legat de worker-ul nostru (vezi docs/API_DESIGN.md) — în ambele copii se afișează, dar
// trimite doar dacă site-ul e servit de pe Cloudflare.
//
// Rulare: npm run build && npm run copies

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const src = path.join(root, 'dist');

/** Fișiere specifice Cloudflare, fără sens în altă parte. */
const CF_ONLY = new Set(['_headers', '_redirects']);
/** Doar în copia locală: fișierele pentru motoarele de căutare n-au ce căuta pe disc. */
const SEO = new Set(['robots.txt', 'sitemap-index.xml', 'sitemap-0.xml']);
const TEAM = 'echipă.html';
const TEAM_LOCAL = 'echipa.html';

if (!fs.existsSync(src)) {
  console.error('Lipsește dist/. Rulează întâi: npm run build');
  process.exit(1);
}

/** Rescrie căile absolute în căi relative (pentru deschidere de pe disc). */
function toRelative(html) {
  return (
    html
      // sitemap/robots nu intră în copia locală → scoatem și referința din <head>
      .replace(/<link rel="sitemap"[^>]*>/g, '')
      .replaceAll('href="/echipă#', `href="${TEAM_LOCAL}#`)
      .replaceAll('href="/echipă"', `href="${TEAM_LOCAL}"`)
      .replaceAll('href="/#', 'href="index.html#')
      .replaceAll('href="/"', 'href="index.html"')
      // /_astro/…, /favicon.ico, /qr-questionpro.png etc. (nu și //… sau https://…)
      .replace(/(href|src)="\/(?!\/)/g, '$1="')
      .replace(/srcset="([^"]*)"/g, (m, v) => `srcset="${v.replace(/(^|,\s*)\//g, '$1')}"`)
  );
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

// --- 1. Copia pentru deschidere locală -------------------------------------------------------
const offline = path.join(root, 'dist-offline');
fs.rmSync(offline, { recursive: true, force: true });
fs.mkdirSync(offline, { recursive: true });
for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
  if (CF_ONLY.has(entry.name) || SEO.has(entry.name)) continue;
  const a = path.join(src, entry.name);
  const b = path.join(offline, entry.name === TEAM ? TEAM_LOCAL : entry.name);
  if (entry.isDirectory()) {
    copyTree(a, b, (from, to, name) =>
      name.endsWith('.css')
        ? fs.writeFileSync(to, fs.readFileSync(from, 'utf8').replaceAll('url(/_astro/', 'url('))
        : fs.copyFileSync(from, to),
    );
  } else if (entry.name.endsWith('.html')) {
    fs.writeFileSync(b, toRelative(fs.readFileSync(a, 'utf8')), 'utf8');
  } else {
    fs.copyFileSync(a, b);
  }
}

// --- 2. Copia pentru orice server web --------------------------------------------------------
// Singura schimbare: `echipă.html` → `echipă/index.html`, ca adresa `/echipă` să fie servită de
// orice server, fără reguli de rescriere. Căile absolute rămân (site-ul stă în rădăcina domeniului).
const server = path.join(root, 'dist-server');
fs.rmSync(server, { recursive: true, force: true });
fs.mkdirSync(server, { recursive: true });
for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
  if (CF_ONLY.has(entry.name)) continue;
  const a = path.join(src, entry.name);
  if (entry.isDirectory())
    copyTree(a, path.join(server, entry.name), (from, to) => fs.copyFileSync(from, to));
  else if (entry.name === TEAM) {
    const dir = path.join(server, path.basename(TEAM, '.html'));
    fs.mkdirSync(dir, { recursive: true });
    fs.copyFileSync(a, path.join(dir, 'index.html'));
  } else fs.copyFileSync(a, path.join(server, entry.name));
}

// --- Verificări --------------------------------------------------------------------------------
const problems = [];
for (const name of fs.readdirSync(offline)) {
  if (!/\.(html|css)$/.test(name)) continue;
  const text = fs.readFileSync(path.join(offline, name), 'utf8');
  for (const m of text.matchAll(/(?:href|src|srcset)="[^"]*"|url\([^)]*\)/g)) {
    if (/(?:="|\(|,\s*)\/(?!\/)/.test(m[0])) problems.push(`offline ${name}: ${m[0].slice(0, 80)}`);
  }
}
if (!fs.existsSync(path.join(offline, TEAM_LOCAL)))
  problems.push(`offline: lipsește ${TEAM_LOCAL}`);
const teamIndex = path.join(server, path.basename(TEAM, '.html'), 'index.html');
if (!fs.existsSync(teamIndex)) problems.push('server: lipsește echipă/index.html');
if (fs.existsSync(path.join(server, TEAM))) problems.push('server: a rămas și echipă.html');
if (problems.length) {
  console.error(problems.join('\n'));
  process.exit(1);
}
console.log('dist-offline/  (dublu-click pe index.html)');
console.log('dist-server/   (de urcat pe orice server web)');
