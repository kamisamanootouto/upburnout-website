// Build-ul pentru găzduirea de la UVT (`https://upburnout.uvt.ro`, Apache):
//   - adresele publice (canonical, OG, sitemap) sunt ale domeniului UVT;
//   - formularul trimite către worker-ul Cloudflare, cu adresa completă (site și worker sunt
//     pe domenii diferite; worker-ul acceptă originea prin ALLOWED_ORIGINS, vezi wrangler.jsonc).
// La final scrie și cele două copii de distribuit (dist-server/, dist-offline/).
//
// Rulare: npm run build:uvt

import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

/**
 * Cheia PUBLICĂ Turnstile a widget-ului de producție (Cloudflare → Turnstile → widget → Sitekey).
 * Apare oricum în HTML, deci nu e un secret. Cheia SECRETĂ stă doar în worker
 * (Settings → Variables and Secrets → TURNSTILE_SECRET_KEY) — fără ea, verificarea folosește
 * cheia de test și sub formular apare bannerul „Numai pentru testare”.
 * `1x00000000000000000000AA` = cheia de test Cloudflare (trece întotdeauna, pe orice domeniu).
 */
const TURNSTILE_SITE_KEY = '0x4AAAAAAFWmbvFT9C1X_1gE';

const env = {
  ...process.env,
  PUBLIC_TURNSTILE_SITE_KEY: process.env.PUBLIC_TURNSTILE_SITE_KEY ?? TURNSTILE_SITE_KEY,
  PUBLIC_SITE_ORIGIN: process.env.PUBLIC_SITE_ORIGIN ?? 'https://upburnout.uvt.ro',
  PUBLIC_CONTACT_ENDPOINT:
    process.env.PUBLIC_CONTACT_ENDPOINT ??
    'https://upburnout-website.bogdan-gandila.workers.dev/api/contact',
};

// Pașii se rulează direct cu Node: pe Windows, `npx` e un `.cmd` și nu poate fi pornit fără shell.
const astroBin = fileURLToPath(new URL('../node_modules/astro/bin/astro.mjs', import.meta.url));
for (const args of [
  [astroBin, 'build'],
  ['scripts/inject-csp-hashes.mjs'],
  ['scripts/make-copies.mjs'],
]) {
  const res = spawnSync(process.execPath, args, { stdio: 'inherit', env, cwd: root });
  if (res.status !== 0) process.exit(res.status ?? 1);
}

const turnstile = TURNSTILE_SITE_KEY.startsWith('1x000000')
  ? 'CHEIE DE TEST (bannerul „Numai pentru testare” rămâne vizibil)'
  : `cheie reală (${TURNSTILE_SITE_KEY})`;
console.log(
  `\nSite: ${env.PUBLIC_SITE_ORIGIN}\nFormular → ${env.PUBLIC_CONTACT_ENDPOINT}\nTurnstile: ${turnstile}`,
);
