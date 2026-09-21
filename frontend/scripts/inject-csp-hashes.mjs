// Rulează după `astro build`: calculează SHA-256 pentru fiecare <script> inline executabil din dist/*.html
// (Astro inlinează scripturile mici ale componentelor) și înlocuiește {{SCRIPT_HASHES}} în dist/_headers.
// Astfel CSP-ul nu are nevoie de 'unsafe-inline'. Dacă apar scripturi inline noi, hash-urile se regenerează singure.
import { createHash } from 'node:crypto';
import { readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const DIST = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../dist');
const NON_EXEC_TYPES =
  /type\s*=\s*["'](application\/(ld\+)?json|text\/plain|text\/template|importmap)["']/i;

async function htmlFiles(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await htmlFiles(p)));
    else if (entry.name.endsWith('.html')) out.push(p);
  }
  return out;
}

const hashes = new Set();
let inlineCount = 0;
for (const file of await htmlFiles(DIST)) {
  const html = await readFile(file, 'utf8');
  for (const m of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
    const attrs = m[1];
    const body = m[2];
    if (/\bsrc\s*=/i.test(attrs)) continue; // scripturi externe: acoperite de 'self'
    if (NON_EXEC_TYPES.test(attrs)) continue; // JSON-LD nu se execută
    if (!body.trim()) continue;
    inlineCount++;
    hashes.add(`'sha256-${createHash('sha256').update(body, 'utf8').digest('base64')}'`);
  }
}

const headersPath = path.join(DIST, '_headers');
const headers = await readFile(headersPath, 'utf8');
if (!headers.includes('{{SCRIPT_HASHES}}')) {
  throw new Error('dist/_headers nu conține placeholder-ul {{SCRIPT_HASHES}}');
}
await writeFile(
  headersPath,
  headers.replaceAll('{{SCRIPT_HASHES}}', [...hashes].join(' ')),
  'utf8',
);
console.log(
  `CSP: ${inlineCount} scripturi inline → ${hashes.size} hash-uri unice scrise în dist/_headers`,
);
