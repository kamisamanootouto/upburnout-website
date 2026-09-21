# SECURITY_PLAN.md

Suprafața de atac este mică (site static + un endpoint de e-mail), dar datele sunt sensibile (persoane care caută
ajutor pentru burnout: nume, e-mail, telefon, mesaj liber). Planul acoperă fiecare punct cerut de template.

## 1. Autentificare, autorizare, RBAC

- **Site:** nu există conturi, sesiuni, cookie-uri, zone protejate → nimic de autentificat. (Vezi `USER_ROLES.md`.)
- **Infrastructură:** GitHub, Cloudflare, Resend, Wix — toate cu **2FA obligatoriu**; principiul minimului privilegiu:
  Cloudflare API tokens (dacă apar) doar cu drepturi pe Pages/zonă; fără token global. Sora clientului = membru cu rol
  „read-only” dacă vrea vizibilitate.
- **Deploy:** doar din branch-ul `main` (production) prin integrarea GitHub → Cloudflare; branch-uri = preview. Protejare `main` (PR obligatoriu, cel puțin `tsc` + teste verzi).

## 2. Audit logs

- Cloudflare: audit log al contului (schimbări DNS, Pages, secrete) — se verifică după cut-over.
- GitHub: istoricul commit-urilor + Actions = trasabilitatea fiecărei schimbări de conținut/cod.
- Resend: loguri de livrare (id mesaj, status) — fără corpul mesajului în loguri de aplicație.
- Funcția de contact: loghează doar `requestId`, rezultat (ok / motiv eroare), **niciodată** câmpurile formularului.

## 3. Rate limiting și anti-abuz

- Cloudflare Rate Limiting rule pe `POST /api/contact` (5/min/IP) + `429` cu `Retry-After`.
- Turnstile (managed) — blochează boți fără puzzle-uri pentru oameni.
- Honeypot + prag de timp (3 s) → fals-succes silențios.
- Limită corp 16 KB; lungimi maxime per câmp; fără upload-uri.
- Bot Fight Mode (free) la nivel de zonă după cut-over; „Always Use HTTPS”; „Automatic HTTPS Rewrites”.

## 4. CSRF

- Fără cookie-uri/sesiuni → CSRF nu are efect. Suplimentar: verificarea `Origin`/`Referer` și tokenul Turnstile legat de domeniu.
- `SameSite` irelevant (nu setăm cookie-uri); Turnstile setează propriile cookie-uri tehnice pe `challenges.cloudflare.com` (nu pe domeniul nostru).

## 5. XSS și injecții

- Site static: nu randăm niciodată input de utilizator în pagină. Mesajele de eroare sunt texte fixe.
- E-mail: toate valorile HTML-escapate în partea HTML; partea text separată; `Reply-To` validat strict ca e-mail (fără `\r\n`).
- Resend e API JSON → nu există SMTP header injection.
- **CSP** (în `public/_headers`), țintă fără `unsafe-inline` (lecția BacAI: hash-uri generate la build pentru script-urile inline ale Astro):
  ```
  default-src 'self';
  script-src 'self' https://challenges.cloudflare.com 'sha256-…';
  frame-src https://challenges.cloudflare.com;
  connect-src 'self' https://challenges.cloudflare.com;
  img-src 'self' data:;
  style-src 'self' 'sha256-…';
  font-src 'self';
  object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none';
  upgrade-insecure-requests;
  ```
  + `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload` (după ce www + apex sunt stabile),
  `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `X-Frame-Options: DENY`,
  `Permissions-Policy: camera=(), microphone=(), geolocation=(), interest-cohort=()`.
- Dependențe: Dependabot săptămânal, `npm audit` în CI, versiuni fixate în `package-lock.json`.

## 6. Secrete

- Doar în Cloudflare Pages (Production/Preview separate) și în `.dev.vars` local (gitignored). Niciodată în repo, în chat sau în documentație.
- Chei Turnstile de test pe preview; cheia Resend de producție doar pe Production.
- Rotire: la orice suspiciune sau la plecarea unei persoane cu acces; procedura documentată în `DEPLOYMENT_PLAN.md`.
- Repo-ul GitHub **privat** (conține fotografii ale echipei și e-mailul destinatar în config → nu public).

## 7. Confidențialitate / GDPR (schiță — decizia legală e amânată de client, OPEN_QUESTIONS #13)

- Date colectate: nume, prenume, e-mail, telefon (opțional), mesaj — doar prin formular, doar pentru a răspunde.
- Nu se stochează pe server; ajung în inbox-ul destinatarului (Google) prin Resend (procesator, DPA disponibil; servere în UE/SUA).
- Terți încărcați în browser: **doar** Turnstile (Cloudflare, esențial pentru securitate, fără profilare publicitară). Fără Google Fonts, fără analytics, fără cookie-uri proprii → nu e nevoie de cookie banner.
- Ce ar trebui înainte de lansare (recomandare, nu implementăm fără aviz): politică de confidențialitate (operator = UVT / echipa de cercetare, scop, temei, durată, drepturi) + un checkbox de consimțământ sau cel puțin un link către politică sub formular. Comisia de etică a UVT are probabil un model.

## 8. Backup și recovery

| Ce | Backup | Recuperare |
|---|---|---|
| Cod + conținut + imagini procesate | Git (GitHub) + copii locale | `git clone` + deploy |
| Imaginile originale (46 MB) | `content/assets/original/` local **+ recomandare: copie în Google Drive/OneDrive al clientului** (nu în repo) | re-rulare `prepare-images` |
| Deploy-uri | Cloudflare Pages păstrează istoricul; rollback în 1 click | Pages → Deployments → Rollback |
| DNS | Export zonă din Cloudflare (fișier BIND) imediat după cut-over, salvat în repo (`docs/dns/upburnout.com.zone`) | reimport |
| Site-ul Wix vechi | Rămâne publicat 2–4 săptămâni după cut-over (accesibil la URL-ul Wix intern) | schimbarea nameserverelor înapoi la Wix = site vechi revine în minute–ore |
| Mesaje din formular | Inbox destinatar (+ BCC opțional) | — |
| Secrete | Parolă-manager al clientului | re-creare chei la provideri |

Scenariu „site-ul e jos”: Pages e servit de CDN-ul Cloudflare (SLA înalt); dacă Pages are incident, conținutul static
poate fi publicat temporar oriunde (Netlify/Vercel) din același repo în < 30 min, cu schimbarea unui CNAME.

## 9. Verificare (Sesiunea 5 — Security Review)

**Rezultate (2026-09-21, local pe runtime-ul Cloudflare `wrangler dev`; de reconfirmat pe preview după push):**

| Verificare | Rezultat |
|---|---|
| CSP fără `unsafe-inline` | ✅ `script-src 'self' https://challenges.cloudflare.com` + 2 hash-uri SHA-256 generate la build (`scripts/inject-csp-hashes.mjs`, rulat de `npm run build`); `style-src 'self'` (Astro nu emite stiluri inline); `font-src 'self' data:` (widget-ul Turnstile injectează un font data:); `frame-src`/`connect-src` doar Cloudflare; `object-src 'none'`, `base-uri 'self'`, `form-action 'self'`, `frame-ancestors 'none'`, `upgrade-insecure-requests` |
| 0 violări CSP în browser | ✅ `securitypolicyviolation` = [] pe Acasă cu meniul deschis, widget Turnstile randat și formular trimis; Echipă cu meniul deschis |
| HSTS | ✅ `max-age=31536000` (fără `includeSubDomains`/`preload` — se adaugă în S8 după 2 săptămâni stabile pe domeniu) |
| Alte headere | ✅ `X-Content-Type-Options`, `X-Frame-Options: DENY`, `Referrer-Policy`, `Permissions-Policy`, `COOP` pe static; JSON/HTML din worker: `nosniff`, `no-store`, CSP `default-src 'none'` |
| Teste de abuz | ✅ GET → 405; origine străină → 403; corp 20 KB → 413; `\r\nBcc:` în e-mail → 400 (caracterele de control sunt eliminate, e-mailul devine invalid); honeypot → 200 fără e-mail; fără token Turnstile → 403; 7 cereri rapide de pe același IP → 5×200 apoi 429 |
| Injecție HTML în e-mail | ✅ test unitar: `<script>` ajunge escapat în partea HTML; `Reply-To` e validat ca e-mail |
| Date personale în loguri | ✅ worker-ul loghează doar coduri; `MAIL_MODE=log` nu mai scrie subiectul (conținea numele) |
| `npm audit` | ✅ 0 vulnerabilități după upgrade `sharp` 0.34 → 0.35.4 (CVE-uri libvips/libheif) și `vitest` 3 → 5 |
| Dependabot | ✅ `.github/dependabot.yml` (npm în `/frontend` + GitHub Actions, săptămânal) |
| Secrete | ✅ niciun `.dev.vars`/`.env` urmărit de git; secretele doar în Worker → Runtime variables and secrets |
| Repo privat, 2FA | ⬜ de confirmat de client (GitHub, Cloudflare, Resend, Wix) |
| Turnstile cu chei reale | ⬜ de făcut de client (pași în `OPEN_QUESTIONS.md` #34) — până atunci cheile de test trec întotdeauna, deci protecția anti-bot reală vine doar din honeypot + timp + rate limit |

- `curl -I` pe producție: toate headerele prezente; CSP fără raportări în consolă pe ambele pagini + formular.
- Teste de abuz: 6 POST-uri rapide → al 6-lea `429`; honeypot completat → `200` fără e-mail; token Turnstile invalid → `403`; corp 20 KB → `413`; `Origin` străin → `403`.
- Injecție în câmpuri (`<script>`, `\r\nBcc:`) → e-mailul primit conține textul escapat, fără headere suplimentare.
- `npm audit` fără vulnerabilități high/critical; Dependabot activ; repo privat; 2FA confirmat pe toate conturile.
- Nicio dată personală în loguri (verificare pe un submit de test).
