// Verificare de fidelitate a conținutului (docs/FEATURE_REQUIREMENTS.md §2, PROJECT_ROADMAP S2/S6):
// extrage toate blocurile VERBATIM din content/pages/*.md și verifică, după `astro build`,
// că fiecare apare identic în textul vizibil al paginilor din dist/.
//   npm run build && npm run verify-content
// Exit code 1 dacă lipsește ceva. Abaterile aprobate explicit se listează în content/approved-deviations.json.
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const CONTENT = path.resolve(here, '../../content/pages');
const DIST = path.resolve(here, '../dist');
const DEVIATIONS = path.resolve(here, '../../content/approved-deviations.json');

const normalize = (s) =>
  s
    .normalize('NFC')
    .replace(/​/g, '')
    .replace(/[•]/g, ' ') // bulinele sunt formatare de listă, nu text
    .replace(/\s+/g, ' ')
    .trim();

// HTML → text vizibil (fără script/style/template, fără taguri, entități decodate)
const htmlToText = (html) =>
  html
    .replace(/<(script|style|template|noscript)[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(
      /<\/(p|div|li|h[1-6]|section|header|footer|nav|ul|ol|figure|figcaption|label|button|a|span)>/gi,
      '$& ',
    )
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)));

// nu sunt text: căi, URL-uri, fișiere, ID-uri de ancore Wix, atribute HTML citate în markdown
const SKIP = /^(\/|https?:\/\/|assets\/|image\.png$|\.\/|anchors-)|="/;

async function collectExpected() {
  const expected = [];
  for (const file of (await readdir(CONTENT)).filter((f) => f.endsWith('.md'))) {
    const md = await readFile(path.join(CONTENT, file), 'utf8');
    for (const line of md.split('\n')) {
      if (!line.includes('VERBATIM') && !line.startsWith('> `')) continue;
      for (const m of line.matchAll(/`([^`]+)`/g)) {
        const text = m[1];
        if (SKIP.test(text)) continue;
        expected.push({ file, text });
      }
    }
  }
  return expected;
}

async function collectPages() {
  const pages = [];
  async function walk(dir) {
    for (const entry of await readdir(dir, { withFileTypes: true })) {
      const p = path.join(dir, entry.name);
      if (entry.isDirectory()) await walk(p);
      else if (entry.name.endsWith('.html')) pages.push(p);
    }
  }
  await walk(DIST);
  const texts = [];
  for (const p of pages)
    texts.push({
      page: path.relative(DIST, p),
      text: normalize(htmlToText(await readFile(p, 'utf8'))),
    });
  return texts;
}

async function main() {
  let deviations = [];
  try {
    deviations = JSON.parse(await readFile(DEVIATIONS, 'utf8')).map((d) => normalize(d.original));
  } catch {
    /* fără fișier = fără abateri aprobate */
  }
  const expected = await collectExpected();
  const pages = await collectPages();
  const all = pages.map((p) => p.text).join(' ');
  const missing = [];
  for (const e of expected) {
    const needle = normalize(e.text);
    if (!needle) continue;
    if (all.includes(needle)) continue;
    if (deviations.includes(needle)) continue;
    missing.push(e);
  }
  console.log(`Pagini verificate: ${pages.map((p) => p.page).join(', ')}`);
  console.log(`Blocuri VERBATIM: ${expected.length}; lipsă/diferite: ${missing.length}`);
  for (const m of missing) console.log(`  ✗ [${m.file}] ${m.text}`);
  if (missing.length) process.exit(1);
  console.log('✓ Conținut identic cu content/pages.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
