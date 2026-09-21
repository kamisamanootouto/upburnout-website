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
| 4 | SEO, Accesibilitate, Performanță | așteaptă „go” — #2 răspuns: **se indexează** | meta description doar din text existent (#2), sitemap, OG, a11y, Lighthouse |
| 5 | Security Review | după S4 | headere, teste de abuz |
| 6 | QA & Content Fidelity | după S5 | diff automat vs `content/`, cross-browser |
| 7 | Domain Cut-over | după S6 + aprobarea sorei — **înainte de ~16 oct 2026** (reînnoirea Premium Wix, #19) | runbook `DEPLOYMENT_PLAN.md` §4 |
| 8 | Final Polish + Handover | după S7 | verificare completă pe domeniul real, documentație de întreținere |

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
1. Head complet (lang=ro, canonical www, OG/Twitter, JSON-LD, robots/sitemap conform #2, description/OG image dacă aprobate).
2. Audit axe + tastatură + VoiceOver/NVDA pe carousel, meniu, formular; contrast; focus.
3. Lighthouse mobil ≥ 95 ×4; bugete din `WEBSITE_ARCHITECTURE.md` §7; `prefers-reduced-motion` verificat.
- Test de acceptare: rapoarte Lighthouse + axe atașate; verificare pe 320/390/768/1024/1440.

## Sesiunea 5 — Security Review
- Checklist `SECURITY_PLAN.md` §9 complet: CSP fără `unsafe-inline` (hash-uri la build), HSTS, teste de abuz, `npm audit`, Dependabot, repo privat, 2FA.
- Test de acceptare: toate `curl`/testele din §9 cu rezultatul așteptat, documentate în raport.

## Sesiunea 6 — QA & Content Fidelity
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
