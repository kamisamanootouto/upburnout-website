# PROJECT_ROADMAP.md

Regula din prompt: fiecare sesiune este **independentă, testabilă, verificabilă**. După fiecare sesiune: stop, raport
(fișiere modificate, funcționalități implementate, probleme identificate, teste propuse), apoi **aprobare explicită**
înainte de următoarea. Template-ul are 15 sesiuni; cele de CRM/DB/Auth/AI/Portal/Integrations nu se aplică (fără CRM),
așa că roadmap-ul are 8 sesiuni.

## Status

| # | Sesiune | Status | Observații |
|---|---|---|---|
| 1 | Business Analysis + Architecture | **DONE — 2026-09-20, aprobată implicit prin „începe sesiunea 2”** | inventar `content/`, 13 documente, întrebări deschise |
| 2 | Design + Website Frontend Foundation | **DONE — 2026-09-20; deploy pe Workers făcut de client; design aprobat, cu 2 corecții aplicate (credit Vecteezy scos, rânduri echipă centrate)** | `verify-content` 71/71 |
| 3 | Contact Form Backend | **DONE — 2026-09-20; e-mail real primit de client pe preview („perfect, acum merge”)** | Worker `/api/contact` + Resend (sandbox → Yahoo-ul clientului) + Turnstile (chei de test) + rate limit; 16 teste Vitest |
| 4 | SEO, Accesibilitate, Performanță | **DONE local — 2026-09-21; așteaptă push + confirmare pe preview** | indexabil, description din text existent, sitemap, OG image, axe 0 violări, Lighthouse 100/100/100/100 (SEO 100 pe domeniul real; pe *.workers.dev e intenționat noindex) |
| 5 | Security Review | **DONE local — 2026-09-21; rămân la client: chei Turnstile reale (#34), confirmare 2FA** | CSP cu hash-uri, HSTS, teste de abuz verzi, audit 0 vulnerabilități, Dependabot |
| 6 | QA & Content Fidelity | **DONE local — 2026-09-21; rămâne: verificare manuală pe telefon real + Firefox de către client** | 46 teste Playwright (Chromium + WebKit, desktop + mobil) verzi; conținut 71/71 + 4 corecții; Wix neschimbat față de inventar; live: headere, rute, abuz OK |
| 7 | Domain Cut-over | **PREGĂTIT — 2026-09-21: zonă Cloudflare (NS `aria`/`chase`), worker cu `upburnout.com` + `www`, înregistrările Resend (DKIM/CNAME×2/DMARC) în zonă, SSL Full (strict), Always Use HTTPS, Bot Fight Mode. AȘTEAPTĂ transferul domeniului de la Wix (client) → apoi NS la noul registrar + verificări (§4.4)** | `DEPLOYMENT_PLAN.md` §4.3 |
| 8 | Final Polish + Handover | **DONE (partea fără domeniu) — 2026-09-21** (+ închideri: badge „UP” scos, favicon din semnul UVT, pagina `/confidentialitate` PROIECT, e-mail final decis #7): `docs/MAINTENANCE.md`, docs aliniate la implementare, verificare completă pe build (format/tipuri/16 unit/46 e2e/fidelitate/audit). **Rămâne după activarea domeniului:** checklist-ul din `MAINTENANCE.md` §7 (verificări pe domeniu, Resend Verify, Search Console, export DNS, HSTS întărit, anulare Wix Premium) | — |

## Sesiunea 1 — Business Analysis + Architecture (DONE)
- Inventar complet al site-ului Wix (text verbatim inclusiv cele 8 slide-uri ascunse, 17 imagini originale, SEO, design, screenshot-uri).
- Cele 13 documente din template (4 marcate N/A cu justificare).
- Test de acceptare: clientul citește `OPEN_QUESTIONS.md` și răspunde; sora confirmă că `content/pages/*.md` reflectă exact site-ul.

## Sesiunea 2 — Design + Website Frontend Foundation
Scop: site-ul complet, static, cu tot conținutul, pe `https://upburnout.pages.dev`, în designul nou.

**Stare (2026-09-20):** implementat integral local (`frontend/`), commit `90fcdc2` pe `main`. Abatere de la planul
inițial: în loc de checkpoint „hero + o secțiune”, s-a construit tot site-ul (transcrierea conținutului nu depinde de
design; schimbarea direcției vizuale = schimbare de tokens/componente, fără pierdere de muncă). Checkpoint-ul de design
devine review-ul acestei sesiuni. Rămân în sarcina clientului: `git push` (blocat în sesiunea automată), conectarea
Cloudflare Pages la repo, arătarea preview-ului sorei. Detalii de design în `docs/OPEN_QUESTIONS.md` #25–#29.
1. Init `frontend/` (Astro 5, Tailwind v4, TypeScript strict, ESLint/Prettier, fontsource), repo GitHub privat, proiect Cloudflare Pages, CI de bază.
2. `scripts/prepare-images.mjs` → `src/assets/` (CMYK→RGB, resize); originalele în `.gitignore`.
3. Tokens + layout (`Base.astro`, Header, Footer) + **propunere de design** livrată ca pagină reală (hero + o secțiune) pe un preview URL → **checkpoint de aprobare vizuală cu sora** înainte de a continua.
4. Toate secțiunile Acasă + Echipă din `src/data/*.ts` (transcriere VERBATIM), slideshow, meniu mobil, 404, `_redirects`, `_headers` (fără CSP finală).
5. Formularul: markup + validare client + stări (fără backend încă; submit → mesaj „în curând”).
6. `scripts/verify-content.mjs` rulat → 0 diferențe.
- Livrabil: URL de preview + screenshot-uri desktop/mobil + raport. Test: parcurgere manuală a ambelor pagini pe telefon real + `verify-content` verde.

## Sesiunea 3 — Contact Form Backend
**Stare (2026-09-20):** implementat ca Worker (`frontend/worker/contact.ts` + `index.ts`), nu Pages Function — vezi `DEPLOYMENT_PLAN.md` §2. Playwright amânat pentru S6 (QA); S3 are Vitest + verificare manuală în `wrangler dev`.
1. `worker/contact.ts` conform `API_DESIGN.md`; schema zod (server) + aceleași reguli pe client; Turnstile; honeypot; rate limit binding.
2. Resend: cont, API key, `onboarding@resend.dev` → e-mailul clientului; e-mail text+HTML; `Reply-To`.
3. Vitest pentru schemă + funcție (mock-uri); Playwright pentru fluxul de formular.
4. Test real: mesaj trimis de pe `pages.dev` → primit în inbox-ul clientului (dovadă: screenshot).
- Test de acceptare: cazurile din `API_DESIGN.md` §6 trec; niciun mesaj pierdut în 10 trimiteri consecutive (cu pauze).

## Sesiunea 4 — SEO, Accesibilitate, Performanță
**Stare (2026-09-21):** implementat local. Rezultate: axe-core (WCAG 2.2 AA + best-practice) — 0 violări pe ambele pagini, desktop și mobil (cu meniul deschis); Lighthouse mobil local: Acasă 99/100/100/100 (LCP 1,8 s local; 1,4 s pe CDN), Echipă 100/100/100/100 (CLS 0,04); fără scroll orizontal la 320/375 px; ordinea de tab logică; H1 unic pe pagină. Lipsește doar Search Console (cere domeniul — Sesiunea 7).
1. Head complet (lang=ro, canonical www, OG/Twitter, JSON-LD, robots/sitemap conform #2, description/OG image dacă aprobate).
2. Audit axe + tastatură + VoiceOver/NVDA pe carousel, meniu, formular; contrast; focus.
3. Lighthouse mobil ≥ 95 ×4; bugete din `WEBSITE_ARCHITECTURE.md` §7; `prefers-reduced-motion` verificat.
- Test de acceptare: rapoarte Lighthouse + axe atașate; verificare pe 320/390/768/1024/1440.

## Sesiunea 5 — Security Review
**Stare (2026-09-21):** checklist-ul din `SECURITY_PLAN.md` §9 executat local, cu tabelul de rezultate acolo. Rămase pe partea clientului: cheile Turnstile reale, confirmarea 2FA.
- Checklist `SECURITY_PLAN.md` §9 complet: CSP fără `unsafe-inline` (hash-uri la build), HSTS, teste de abuz, `npm audit`, Dependabot, repo privat, 2FA.
- Test de acceptare: toate `curl`/testele din §9 cu rezultatul așteptat, documentate în raport.

## Sesiunea 6 — QA & Content Fidelity
**Rezultate (2026-09-21):**
- **Fidelitate:** `verify-content` 71/71 blocuri + 4 corecții aprobate prezente; site-ul Wix re-crawl-uit — text identic cu inventarul din 2026-09-20 (nicio modificare între timp); QR byte-identic cu originalul; cei 10 membri în ordinea originală (test independent).
- **Playwright** (`frontend/tests/e2e/site.spec.ts`, 12 teste × 4 proiecte: Chromium/WebKit × desktop/mobil = 46 rulate, 2 sărite intenționat): conținut + titluri + cele 8 ședințe, headere de securitate, meta/canonical/og, ancore interne, QuestionPro în filă nouă, ruta către echipă, validare + trimitere formular cu Turnstile, meniul mobil (deschis/Esc/link), fără scroll orizontal, 404 + redirecturi (`/echipa`, slash final, `/acasa`), sitemap/robots, **fără JavaScript** (conținut + navigare vizibile), **prefers-reduced-motion** (fără animații), API 405/403. Zero erori de consolă și zero violări CSP pe ambele pagini.
- **Corecție găsită de QA:** fără JavaScript, meniul mobil era invizibil (panoul avea `hidden` în HTML). Acum: cu JS panoul e ascuns până la click (`html.js`), fără JS rămâne vizibil și butonul hamburger dispare.
- **Local vs. WebKit:** `upgrade-insecure-requests` bloca `http://127.0.0.1` în WebKit → worker-ul scoate directiva doar pe `http:` (local); pe https rămâne.
- **Live (preview `workers.dev`):** CSP/HSTS/noindex prezente; GET 405, origine străină 403, corp 20 KB 413, honeypot 200; rate limit **funcționează, dar e „eventual consistent”** (Workers Rate Limiting e best-effort, per locație: la 12 cereri rapide → 429 după a 3-a, cu 1–2 scăpări) — acceptabil ca primă linie; regula WAF pe zonă (S7) e a doua.
- **Responsive:** 320 / 375 / 390 / 768 / 1024 / 1440 / 1600 verificate (fără overflow; layout-uri corecte).
- **Neacoperit automat:** Firefox (binarul Playwright de pe această mașină e corupt: „side-by-side configuration is incorrect”; instalarea lui = descărcare ~100 MB — de decis) → verificare manuală de către client în Firefox și pe telefon real.
- **Playwright** rulează și în CI (job `e2e`, Chromium + WebKit) pe `wrangler dev` cu `MAIL_MODE=log`.
- Diff automat `verify-content` + verificare umană pagină cu pagină cu screenshot-urile din `content/screenshots/` alături.
- Toate linkurile (interne, ancore, QuestionPro, Vecteezy), toate slide-urile, formularul, 404, redirecturile.
- Cross-browser (Chrome/Edge/Firefox/Safari/iOS) + telefon real.
- Test de acceptare: **0 diferențe de conținut** neaprobate; lista abaterilor aprobate în `content/approved-deviations.json`.

## Sesiunea 7 — Domain Cut-over
- Runbook `DEPLOYMENT_PLAN.md` §4, executat împreună cu clientul (pașii din Wix îi face clientul, ghidat).
- Resend domain verification, redirect www/apex, Search Console (dacă e cazul), export DNS.
- Test de acceptare: site + formular funcționale pe `www.upburnout.com` cu expeditor `@upburnout.com`; Wix intact ca fallback.

## Sesiunea 8 — Final Polish + Handover
- Re-verificare completă pe domeniul real (fiecare pagină, fiecare link, formularul, headerele, Lighthouse).
- `README.md` de întreținere: cum se schimbă un text/o fotografie (editare `src/data`, PR, deploy), cum se rotesc cheile, cum se face rollback, ce se anulează la Wix și când.
- Închidere: lista finală de întrebări rămase (ex. politica de confidențialitate), recomandări (transfer domeniu, analytics).

## Template de raport de sesiune (obligatoriu la final de sesiune)

```
## Raport Sesiunea N — <nume>
1. Fișiere create/modificate: …
2. Funcționalități implementate: …
3. Probleme identificate (și ce am făcut cu ele): …
4. Teste propuse / efectuate (cu rezultat): …
5. Întrebări noi pentru client: … (se adaugă și în OPEN_QUESTIONS.md)
6. Ce urmează (Sesiunea N+1) — NU începe fără aprobare.
```
