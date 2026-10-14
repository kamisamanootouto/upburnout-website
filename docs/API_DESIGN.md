# API_DESIGN.md — un singur endpoint: formularul de contact

## 1. `POST /api/contact`

Servit de Worker-ul site-ului (`frontend/src/worker.ts`, `main` în `wrangler.jsonc`, cu `assets.run_worker_first = ["/api/*"]`
ca restul cererilor să fie servite direct din static assets), aceeași origine ca site-ul → fără CORS. (Inițial planificat ca
Pages Function; hosting-ul a trecut pe Workers static assets — vezi `DEPLOYMENT_PLAN.md` §2.)
(Varianta B/Render: `https://api.upburnout.com/api/contact` sau `*.onrender.com`, cu CORS restrâns la origine — §7.)

### Request
`Content-Type: application/json` (trimis de scriptul formularului) **sau** `application/x-www-form-urlencoded` (submit fără JS).

| Câmp | Tip | Reguli | Corespondent Wix |
|---|---|---|---|
| `nume` | string | obligatoriu, 1–100 caractere după trim | `Nume*` |
| `prenume` | string | obligatoriu, 1–100 | `Prenume*` |
| `email` | string | obligatoriu, format e-mail, ≤ 254, lowercase la normalizare | `Email*` |
| `telefon` | string | opțional, ≤ 30, doar `+ 0-9 ( ) . -` și spații | `Telefon` |
| `mesaj` | string | opțional, ≤ 2.000 caractere | `Cum te putem ajuta?` |
| `website` | string | **honeypot** — trebuie să fie gol; dacă are conținut → răspuns 200 „fals-succes”, nimic trimis | — |
| `ts` | number | timestamp (ms) al randării formularului; dacă `now - ts < 3000` → tratat ca bot (fals-succes) | — |
| `cf-turnstile-response` | string | token Turnstile, obligatoriu; verificat la `https://challenges.cloudflare.com/turnstile/v0/siteverify` cu `remoteip` | — |

Toate stringurile: trim, eliminare caractere de control (`\u0000–\u001F` cu excepția `\n` în `mesaj`), normalizare NFC.
Corpul cererii limitat la 16 KB.

### Response

| Cod | Corp | Când |
|---|---|---|
| `200` | `{ "ok": true }` | trimis (sau fals-succes pentru boți — identic, ca să nu le dăm feedback) |
| `400` | `{ "ok": false, "errors": { "email": "Adresa de e-mail nu este validă." , … } }` | validare eșuată; chei = numele câmpurilor |
| `403` | `{ "ok": false, "error": "turnstile" }` | token Turnstile lipsă/invalid |
| `405` | — | altă metodă decât POST |
| `413` | `{ "ok": false, "error": "too_large" }` | corp > 16 KB |
| `429` | `{ "ok": false, "error": "rate_limited", "retryAfter": 600 }` | limită depășită (`Retry-After` header) |
| `502` | `{ "ok": false, "error": "delivery" }` | Resend a răspuns cu eroare / timeout (5 s) — utilizatorul e invitat să reîncerce |

Headere pe toate răspunsurile: `Cache-Control: no-store`, `Content-Type: application/json; charset=utf-8`.
Submit fără JS (form-urlencoded): răspunsul este o pagină HTML minimală cu același mesaj (succes/eroare) și link înapoi.

### Verificări de origine și CORS
- Acceptă doar `Origin`/`Referer` din lista `ALLOWED_ORIGINS` (implicit: `https://upburnout.uvt.ro` + `http://…` pentru vizitele fără HTTPS, `https://www.upburnout.com`, `https://upburnout.com`, `https://*upburnout*.workers.dev`); altfel `403`. Local: `http://127.0.0.1:8787`.
- **CORS (din 2026-10-14):** site-ul public e găzduit de UVT, worker-ul a rămas la Cloudflare → cererea e cross-origin.
  Pentru originile permise, răspunsurile poartă `Access-Control-Allow-Origin: <origin>` + `Vary: Origin`, iar `OPTIONS /api/contact`
  (preflight-ul browserului, pentru `content-type: application/json`) întoarce `204` cu `Access-Control-Allow-Methods: POST, OPTIONS`,
  `Access-Control-Allow-Headers: content-type`, `Access-Control-Max-Age: 86400`. Origine nepermisă → `OPTIONS` dă `403`, fără antete CORS.
  Pagina trimite către adresa din `site.contactEndpoint` (`PUBLIC_CONTACT_ENDPOINT` la build; implicit calea relativă `/api/contact`).
- Nu folosim cookie-uri → nu există sesiune de protejat; CSRF clasic nu se aplică, dar verificarea de origine + Turnstile
  împiedică folosirea endpoint-ului din alte site-uri.

## 2. E-mailul trimis

- **To:** `CONTACT_TO_EMAIL` (inițial `gandilabogdan10@gmail.com`; final: OPEN_QUESTIONS #7). **Bcc:** `CONTACT_BCC_EMAIL` (opțional).
- **From:** `CONTACT_FROM_EMAIL` — înainte de cut-over `onboarding@resend.dev` (doar către adresa contului Resend), după: `contact@upburnout.com` (domeniu verificat DKIM/SPF/DMARC).
- **Reply-To:** e-mailul expeditorului (răspunsul din inbox merge direct la persoană).
- **Subject:** `Mesaj nou de pe upburnout.com — {Prenume} {Nume}`
- **Corp (text + HTML, toate valorile HTML-escapate):**
  ```
  Mesaj nou din formularul de contact upburnout.com

  Nume:      {nume}
  Prenume:   {prenume}
  Email:     {email}
  Telefon:   {telefon | „—”}
  Mesaj:
  {mesaj | „—”}

  Trimis la: {data/ora, Europe/Bucharest}
  ```
  Fără IP, fără user-agent în e-mail (minimizarea datelor). Nicio valoare nu ajunge în headere de e-mail în afară de `Reply-To`
  (validat ca e-mail) → fără header injection.
- Timeout Resend 5 s, 1 reîncercare la eroare de rețea; la eșec → `502` și log (`console.error` → Cloudflare logs), fără date personale în log (doar id-ul cererii și codul erorii).

## 3. Variabile de mediu (Worker → Settings → Variables and Secrets; local `frontend/.dev.vars`, în `.gitignore`, model în `.dev.vars.example`)

| Nume | Secret | Exemplu |
|---|---|---|
| `RESEND_API_KEY` | da | `re_…` |
| `CONTACT_TO_EMAIL` | nu | `gandilabogdan10@gmail.com` (test) → adresa finală |
| `CONTACT_BCC_EMAIL` | nu | opțional |
| `CONTACT_FROM_EMAIL` | nu | `onboarding@resend.dev` → `contact@upburnout.com` |
| `TURNSTILE_SECRET_KEY` | da | din dashboard Turnstile |
| `PUBLIC_TURNSTILE_SITE_KEY` | nu (public, ajunge în HTML) — **variabilă de build** (Workers Builds → Settings → Build → Variables), nu de runtime; fără ea se folosește cheia de test `1x00000000000000000000AA` | idem |
| `ALLOWED_ORIGINS` | nu (în `wrangler.jsonc` → `vars`) | `https://www.upburnout.com,https://upburnout.com,*.workers.dev` |
| `MAIL_MODE` | nu | `log` = nu trimite, doar loghează — **doar local/preview**, niciodată în producție |

`CONTACT_FROM_EMAIL` și `ALLOWED_ORIGINS` sunt în `wrangler.jsonc` (`vars`, deployate cu codul); `RESEND_API_KEY`, `TURNSTILE_SECRET_KEY`,
`CONTACT_TO_EMAIL` (+ `CONTACT_BCC_EMAIL`) se setează ca **Secret** în dashboard și supraviețuiesc deploy-urilor.
Fără `TURNSTILE_SECRET_KEY` worker-ul folosește cheia de test (trece întotdeauna) și loghează un avertisment — de înlocuit înainte de lansare (Sesiunea 5).

Cheile de test Turnstile (`1x00000000000000000000AA` / `1x0000000000000000000000000000000AA`) afișează un widget vizibil cu banner „Numai pentru testare” și trec întotdeauna — bune pentru preview, nu pentru producție.

## 4. Rate limiting

- **Implementat (S3):** Workers Rate Limiting binding `CONTACT_RATE_LIMIT` (`wrangler.jsonc` → `ratelimits`): 5 cereri / 60 s / IP (`cf-connecting-ip`) → `429` + `Retry-After: 60`. Funcționează și pe preview-urile `workers.dev`, fără configurare în dashboard. Verificat local: a 6-a cerere → 429.
- Opțional după cut-over: o regulă WAF de rate limiting pe zonă (a doua linie de apărare).

## 5. Texte pentru utilizator (propuneri — cele din Wix au prioritate dacă există; OPEN_QUESTIONS #6)

| Situație | Text (RO) |
|---|---|
| Succes | „Mulțumim! Mesajul tău a fost trimis. Îți răspundem cât de curând.” |
| Câmp obligatoriu gol | „Acest câmp este obligatoriu.” |
| E-mail invalid | „Adresa de e-mail nu este validă.” |
| Telefon invalid | „Numărul de telefon conține caractere nepermise.” |
| Prea lung | „Textul este prea lung (maximum {n} caractere).” |
| Turnstile eșuat | „Verificarea anti-spam nu a reușit. Reîncarcă pagina și încearcă din nou.” |
| 429 | „Ai trimis prea multe mesaje într-un timp scurt. Te rugăm să încerci din nou peste câteva minute.” |
| 502 / rețea | „Mesajul nu a putut fi trimis. Te rugăm să încerci din nou.” |
| Fără JS | „Pentru a trimite formularul, activează JavaScript.” (sau submit clasic — vezi §1) |

Erorile se afișează **fără roșu** (bleumarin + iconiță + text), conform cerinței de design.

## 6. Testare

**Stare S3 (2026-09-20):** 16 teste Vitest verzi (`worker/contact.test.ts`: schemă, origini, e-mail, handler 200/400/403/405/413/429/502, honeypot, timp, MAIL_MODE, submit fără JS); flux complet verificat în `wrangler dev` (runtime Cloudflare local) inclusiv widget-ul Turnstile din pagină și rate limit-ul. Rămâne: trimiterea reală cu cheia Resend a clientului (vezi raportul S3).

- Unit (Vitest): schema zod (cazuri valide/invalide, unicode, lungimi), funcția cu Resend + Turnstile mock-uite (200/400/403/429/502), honeypot, prag de timp.
- E2E (Playwright): completare corectă → mesaj de succes (Resend mock prin variabilă `MOCK_MAIL=1` în preview); erori pe câmp; fără JS.
- Manual, înainte de lansare: un mesaj real de pe `pages.dev` → ajunge în inboxul clientului; după cut-over, încă unul de pe domeniul real cu expeditor `@upburnout.com`.

## 7. Diferențe în varianta B (Fastify pe Render) — doar dacă se alege

- Serviciu `backend/` (Fastify 5 + `@fastify/rate-limit` + `@fastify/cors` + `@fastify/helmet`), `POST /api/contact`, aceeași schemă zod.
- CORS: `origin` = lista `ALLOWED_ORIGINS`; preflight OPTIONS.
- Cold start pe free tier: formularul trebuie să afișeze „Se trimite… (poate dura până la un minut la prima trimitere)” — UX degradat, de asumat de client.
- Secretele în Render → Environment; un al doilea loc de administrat; `render.yaml` în repo.
- Ping de „keep-alive” (cron extern la 10 min) atenuează cold start-ul, dar e un hack; alternativa este instanța plătită.
