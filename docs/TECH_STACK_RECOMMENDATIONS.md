# TECH_STACK_RECOMMENDATIONS.md

Criterii de evaluare, în ordinea importanței pentru acest proiect: (1) fidelitatea conținutului și controlul total al
HTML-ului, (2) performanță pe mobil, (3) cost zero de rulare, (4) simplitate de întreținere pe termen lung de către
o singură persoană, (5) familiaritatea clientului (a livrat deja BacAI cu Astro + Cloudflare Pages + Fastify/Render).

## 1. Frontend

| Opțiune | Pro | Contra | Verdict |
|---|---|---|---|
| **Astro 5** (output static) | HTML pur, 0 KB JS implicit; imagini optimizate nativ (`astro:assets`/sharp); island-uri doar unde trebuie; deploy direct pe Pages fără adaptor; content collections pentru text; clientul îl cunoaște | Ecosistem de componente mai mic (irelevant aici) | **Recomandat** |
| Next.js 15 (static export) | Ecosistem uriaș, React | Trimite runtime React (~80 KB) pentru 2 pagini fără stare; `next/image` are nevoie de loader custom la export static; complexitate inutilă | Nu |
| Vite + React (SPA) | Simplu de pornit | SPA = HTML gol până rulează JS → SEO/fidelitate slabe, LCP mai mare | Nu |
| TanStack Start | Modern, type-safe | Are nevoie de server (SSR) sau adaptor; proiect tânăr; overkill | Nu |
| SvelteKit (adapter-static) | Foarte ușor, output mic | Ecosistem nou pentru client; niciun avantaj real față de Astro la un site fără stare | Nu |
| HTML/CSS scris de mână | Zero tooling | Fără pipeline de imagini/fonturi, duplicare header/footer, greu de verificat automat | Nu |

**Stil:** **Tailwind CSS v4** (design tokens ca variabile CSS în `@theme`, purge automat, clientul îl folosește) —
alternativ CSS vanilla cu variabile; ShadCN/Mantine sunt biblioteci de componente React → irelevante fără React.
**Mișcare:** fără Motion/Framer. Reveal-on-scroll cu **CSS scroll-driven animations** (`animation-timeline: view()`)
și fallback minimal `IntersectionObserver` (~20 linii); totul dezactivat la `prefers-reduced-motion` — preferăm
mecanisme native în locul JS-ului de poziționare (lecție din BacAI).
**Cele 8 ședințe:** grilă de carduri, fără carusel (decizia #25) — 0 KB JS.
**Fonturi (ales în S2, aprobat):** `@fontsource-variable/plus-jakarta-sans` (titluri) + `@fontsource-variable/inter` (text),
self-host, subset latin + latin-ext, `font-display: swap`. Google Fonts CDN — nu (request terț, implicații GDPR, fără câștig).
Notă de performanță: Inter variabil (latin + latin-ext) ≈ 135 KB — cea mai mare parte din greutatea paginii; opțional de redus
cu greutăți statice, dacă se dorește vreodată (Lighthouse e deja 100).
**Conținut:** textele din `content/pages/*.md` se transpun în fișiere de date tipizate (`src/data/acasa.ts`, `echipa.ts`)
+ un script de verificare care compară build-ul cu blocurile VERBATIM (Sesiunea 6).
**Limbaj:** TypeScript strict. Node 22 LTS, npm (ca la BacAI).

## 2. Backend — singurul endpoint: formularul de contact

| Opțiune | Pro | Contra | Verdict |
|---|---|---|---|
| **Cloudflare Workers** (implementat: `frontend/worker/contact.ts`; planificat inițial ca Pages Function — același runtime) | Același repo, același deploy, aceeași origine (fără CORS); 0 cold start; 100.000 req/zi gratuit; integrare nativă Turnstile + Rate Limiting; secretele în Pages | Nu e Node complet (fără SMTP, fără fs) → e-mailul se trimite prin API HTTP (Resend); **abatere de la template** (care spune „Backend: Render”) | **Recomandat — APROBAT de client 2026-09-20** (OPEN_QUESTIONS #1) |
| Render + **Fastify** (Node) | Conform template-ului; clientul cunoaște Fastify; poate face SMTP | Free tier: serviciul adoarme după 15 min → **prima trimitere a formularului așteaptă ~30–60 s** (UX inacceptabil) sau instanță plătită (~7 $/lună) pentru un endpoint; CORS + 2 deploy-uri + 2 locuri cu secrete; mai multă suprafață de atac | Acceptabil doar dacă clientul cere strict template-ul |
| Render + Express | La fel ca Fastify, mai lent, mai puțin type-safe | — | Nu (Fastify e mai bun în aceeași categorie) |
| Render + NestJS | Structură enterprise | Overkill masiv pentru un endpoint | Nu |
| Servicii de formulare (Formspree, Web3Forms, Basin) | Zero cod | Datele participanților trec printr-un terț în plus; branding; limită de mesaje; control redus | Nu |

**Validare:** `zod` (schema unică, folosită și pe client pentru mesaje identice).

## 3. Bază de date

| Opțiune | Verdict |
|---|---|
| **Niciuna** | **Recomandat.** Nu există nimic de stocat (decizie fără CRM). E-mailul este înregistrarea. Elimină backup-uri, GDPR pe stocare, costuri. |
| MongoDB Atlas (template) | Doar dacă apare CRM-ul (vezi `CRM_ARCHITECTURE.md`). Pentru „lead-uri” semi-structurate, documentele sunt potrivite; Atlas free tier ajunge. |
| PostgreSQL (Neon/Supabase) | Echivalent pentru acest volum; ar fi preferat dacă apar relații (participanți ↔ ședințe ↔ terapeuți). Fără CRM: irelevant. |
| Cloudflare D1/KV | Ar fi opțiunea „nativă” pentru o copie de siguranță a mesajelor în Workers, dar contrazice decizia „fără DB”; se menționează doar ca posibilitate ieftină. |

## 4. E-mail tranzacțional (livrarea formularului)

| Provider | Free tier | Pro | Contra | Verdict |
|---|---|---|---|---|
| **Resend** | 3.000/lună, 100/zi, 1 domeniu | API simplu, funcționează din Workers, DKIM/SPF/DMARC ghidate, clientul l-a folosit la BacAI; până la verificarea domeniului se poate testa de pe `onboarding@resend.dev` **către adresa contului** (= e-mailul clientului, exact cazul nostru) | Retenție scurtă a logurilor în plan gratuit | **Recomandat** |
| Brevo | 300/zi | SMTP + API, UE | Interfață orientată marketing; API mai stufos | Rezervă |
| Postmark | 100/lună | Livrabilitate excelentă | Limită mică, aprobare manuală a contului | Nu |
| MailChannels | — | Era gratuit pentru Workers | Free tier-ul pentru Workers s-a închis (2024) | Nu |
| SMTP Gmail (app password) | — | „Gratis” | Nu merge din Workers; fragil; contrar politicilor Google pentru trafic automat | Nu |

Expeditor final după cut-over: `contact@upburnout.com` (sau `noreply@`) cu `Reply-To` = expeditorul din formular.
Până atunci: `onboarding@resend.dev` → e-mailul clientului (testare).

## 5. Anti-spam

| Opțiune | Verdict |
|---|---|
| **Honeypot + timp minim de completare** | Da, întotdeauna (0 cost, invizibil). |
| **Cloudflare Turnstile** (managed, invizibil în mod normal) | **Da.** Gratuit, fără cookie-uri de tracking, integrat cu Workers (`siteverify`), nu obligă utilizatorul la puzzle-uri — important pentru un public aflat în burnout. |
| Cloudflare Rate Limiting rule pe `/api/contact` | Da, la nivel de zonă după cut-over (1 regulă gratuită). Până atunci, limitare simplă în funcție (per IP, fereastră scurtă). |
| reCAPTCHA v2/v3 | Nu (Google, cookie-uri, puzzle-uri). |
| hCaptcha | Alternativă acceptabilă la Turnstile; nu e nevoie. |

## 6. Imagini și media

- **`astro:assets` (sharp)** la build: AVIF + WebP + fallback, `srcset`/`sizes`, `width/height` explicite. Originalele
  uriașe (până la 7973×7972, 13 MB CMYK) se **pre-procesează o singură dată** (script Python/sharp: convertire CMYK→RGB,
  redimensionare la max. 2× lățimea afișată, ~1600px) și doar variantele pre-procesate intră în repo (`frontend/src/assets/`).
  Originalele rămân în `content/assets/original/` (local / arhivă, nu în repo — vezi `.gitignore` în Sesiunea 2).
- Cloudflare Images / Polish — nu e nevoie (site static, build-time optimization ajunge).
- QR-ul: PNG 256×256 servit ca atare (nu se recomprimă cu pierderi; codul QR trebuie să rămână scanabil).

## 7. Hosting, DNS, domeniu

- **Cloudflare Pages** (template) — free, preview deployments pe fiecare branch, rollback instant, `_headers`/`_redirects`.
- **Cloudflare DNS** (free) pentru `upburnout.com`: nameserverele se schimbă la Wix; domeniul rămâne la Wix.
- **Cloudflare Registrar** — opțional, ulterior, pentru a scoate domeniul de la Wix (transfer la preț de cost).
- Render — doar în varianta B a backend-ului.

## 8. Analytics, monitorizare, calitate

- Analytics: **niciunul** (parity). Dacă se dorește: Cloudflare Web Analytics (gratuit, fără cookie-uri, fără consimțământ necesar) — OPEN_QUESTIONS #14.
- Monitorizare formular: Resend dashboard (livrări/bounce-uri) + test lunar manual; opțional un e-mail de alertă la eșec (funcția loghează în Cloudflare).
- Teste (implementate): **Vitest** (16 teste worker), **Playwright 1.61** (46 teste: Chromium + WebKit, desktop + mobil; Firefox
  neacoperit — binar corupt pe mașina de dezvoltare), `verify-content` (fidelitate), Lighthouse + axe rulate manual (S4).
- Calitate cod: ESLint + Prettier, `tsc --noEmit` în CI (GitHub Actions), Dependabot săptămânal.

## 9. Recomandarea finală (pe scurt)

**Astro 5 + Tailwind v4 + TypeScript**, fonturi self-hostate, imagini optimizate la build, **Cloudflare Pages** cu
**Worker** pentru `/api/contact` → **Resend**, protejat de **Turnstile** + honeypot + rate limiting.
**Fără bază de date, fără Render** (cu excepția cazului în care clientul cere strict template-ul — atunci Fastify pe
Render, cu avertismentul privind cold start-ul). Cost lunar: **0 €**.
