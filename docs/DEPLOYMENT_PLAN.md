# DEPLOYMENT_PLAN.md

## 1. Medii

| Mediu | URL | Sursă | Scop |
|---|---|---|---|
| Local | `http://localhost:4321` (`astro dev`) + `wrangler pages dev` pentru funcție/`_headers` | working tree | dezvoltare |
| Preview | `https://<branch>.upburnout.pages.dev` | orice branch ≠ `main` | review design/conținut de către client și soră, fără risc |
| Staging = Production înainte de cut-over | `https://upburnout.pages.dev` | `main` | verificare finală (Sesiunile 4–6) |
| Production | `https://www.upburnout.com` (+ `upburnout.com` → redirect) | `main` | după cut-over (Sesiunea 7) |

Site-ul Wix rămâne **live și neatins** pe domeniu până la pasul 5 din §4.

## 2. Conturi și configurare inițială (Sesiunea 2)

> **Actualizare 2026-09-20 — Cloudflare Workers (static assets) în loc de Cloudflare Pages.** Dashboard-ul Cloudflare
> direcționează proiectele noi către Workers cu Git builds (Pages e în mod de întreținere). Este aceeași platformă și
> același cost (0), dar cu: `frontend/wrangler.jsonc` (`assets.directory = ./dist`, `html_handling = drop-trailing-slash`,
> `not_found_handling = 404-page`), build `npm run build`, deploy `npx wrangler deploy`, **Path/root = `frontend`**.
> `_headers`/`_redirects` funcționează la fel. Formularul din Sesiunea 3 devine un Worker (`main`) cu
> `assets.run_worker_first = ["/api/*"]` în loc de Pages Function — API identic (`API_DESIGN.md`). Domeniile custom se
> adaugă din Worker → Settings → Domains & Routes. Pașii de mai jos care spun „Pages” se citesc „Worker `upburnout`”.

1. **GitHub**: repo privat `upburnout-website` pe contul personal `kamisamanootouto` (decis 2026-09-20). Branch `main` protejat.
2. **Cloudflare Workers**: Workers & Pages → Create → Import a repository → `upburnout-website` → Path `frontend`, Build command
   `npm run build`, Deploy command `npx wrangler deploy` (branch-uri: `npx wrangler versions upload`). Node 22 din `frontend/.node-version`.
   Worker-ul `upburnout-website` → `https://upburnout-website.bogdan-gandila.workers.dev` (preview).
3. **Variabile de mediu** (Production și Preview separat): vezi `API_DESIGN.md` §3. Pe Preview: chei Turnstile de test + `CONTACT_TO_EMAIL` de test.
4. **Turnstile**: Cloudflare → Turnstile → Add widget → hostnames `upburnout.pages.dev`, `www.upburnout.com`, `upburnout.com`; mod Managed.
5. **Resend**: cont creat pe `bogdan.gandila@yahoo.com` (2026-09-20) → API key → până la verificarea domeniului, `from = onboarding@resend.dev`
   (funcționează doar către adresa contului, deci `CONTACT_TO_EMAIL` = adresa de Yahoo până la cut-over).
   Secretele se pun în Worker → Settings → **Runtime variables and secrets** (nu în „Build → Variables and secrets”, care sunt doar pentru build).
6. **CI (GitHub Actions)**: `npm ci`, `tsc --noEmit`, `npm run lint`, `vitest`, `astro build`, `verify-content`, Playwright (pe build local) — pe PR și pe `main`.

## 3. Fluxul de deploy curent

`git push` pe branch → Cloudflare face build + preview URL (comentat în PR) → review → merge în `main` → build de producție
(~1–2 min) → live pe `upburnout.pages.dev` (și pe domeniu, după cut-over). Rollback: Pages → Deployments → „Rollback to this deployment”.

## 4. Cut-over domeniu (Sesiunea 7) — runbook pas cu pas

### 4.0 Pre-condiții (toate bifate înainte de a atinge DNS-ul)
- [ ] Sesiunile 2–6 aprobate; `upburnout.pages.dev` verificat pagină cu pagină, formular testat real.
- [ ] Sora clientului a aprobat designul final și a văzut site-ul pe `pages.dev`.
- [x] Wix → Manage DNS records (2026-09-21): A ×3 → IP-uri Wix, CNAME `www`/`en` → `cdn3.wixdns.net`, **fără MX/TXT/SRV** → nimic de replicat. La import în Cloudflare, aceste înregistrări Wix se **șterg** (altfel domeniul ar arăta tot site-ul vechi).
- [ ] Wix → Domains: domeniul nu are „transfer lock” care să blocheze schimbarea NS (schimbarea NS nu e transfer; ar trebui permisă).
- [ ] Contul Cloudflare al clientului e pregătit; are 2FA.
- [ ] Un moment cu trafic mic (seara/weekend) și 1–2 ore disponibile.

### 4.1 Cloudflare — adăugarea zonei
1. Cloudflare Dashboard → „Add a domain” → `upburnout.com` → plan **Free**.
2. Cloudflare scanează DNS-ul Wix și importă înregistrările. **Ștergem** A/CNAME-urile care duc la Wix (ex. `A @ 185.230.63.x`, `CNAME www … wixdns.net`).
   **Păstrăm** orice MX/TXT găsit (dacă există).
3. Notăm cele 2 nameservere afișate de Cloudflare (ex. `ada.ns.cloudflare.com`, `rob.ns.cloudflare.com`).

### 4.2 Cloudflare Pages — domeniile custom
4. Workers & Pages → `upburnout-website` → Settings → **Domains & Routes** → *Add* → Custom domain `www.upburnout.com`, apoi încă unul `upburnout.com`. Cloudflare creează singur înregistrările DNS în zonă și emite certificatele (pot dura câteva minute după ce NS-urile sunt active).
5. Redirect `upburnout.com` → `https://www.upburnout.com` (301): **făcut în worker** (`worker/index.ts`, `CANONICAL_HOST`), nu e nevoie de regulă în dashboard.
6. SSL/TLS → Full (strict); Edge Certificates → Always Use HTTPS, HSTS (după 48 h de funcționare corectă), Minimum TLS 1.2.
7. Security → Bots → Bot Fight Mode ON; Security → WAF → Rate limiting rule pentru `/api/contact` (5/min).

### 4.3 ⚠ BLOCAJ DESCOPERIT LA EXECUȚIE (2026-09-21): Wix NU permite schimbarea nameserverelor pentru domeniile cumpărate de la Wix

Confirmat în Help Center Wix („Currently, it is not possible to change the name servers of a Wix domain”) și în panou (meniul
domeniului nu are opțiunea; secțiunea NS e „not editable”). Wix oferă doar (a) „pointing” prin înregistrări A/CNAME în DNS-ul Wix
sau (b) „Transfer away from Wix”. **(a) nu funcționează cu Cloudflare Workers/Pages** pentru domeniul apex (Cloudflare cere
zona pe DNS-ul lui; Wix nu are ALIAS/flattening și Cloudflare nu dă IP fix) → singura cale curată este **(b) transferul
domeniului la un registrar care permite nameservere custom**, apoi NS → Cloudflare.

RDAP (2026-09-21): înregistrat 2026-02-05 (peste 60 de zile → transferabil), status `clientTransferProhibited` (se deblochează
din Wix la „Transfer away”), registrar Wix.com Ltd.

**Plan revizuit (Sesiunea 7):**
1. Wix → Domains → ⋯ → **Transfer away from Wix** → Wix deblochează domeniul și trimite **codul EPP/de autorizare** pe e-mailul
   de contact al domeniului (al sorei — verificați „Edit contact info”). Dacă cere dezactivarea WHOIS privacy, se acceptă temporar.
2. Registrar nou (recomandare: **Porkbun** — ieftin, simplu, NS custom imediat; alternative: Namecheap, INWX/Gandi în UE).
   Cont creat de client; sora ca persoană de contact a domeniului. „Transfer domain” → `upburnout.com` + codul EPP → plata a 1 an
   (~10–12 $; prelungește expirarea la feb 2028) → se aprobă e-mailul de confirmare a transferului (Wix trimite unul; aprobat
   explicit, transferul se face în ore în loc de 5 zile).
3. Când domeniul apare la registrarul nou: Name servers → custom → `aria.ns.cloudflare.com`, `chase.ns.cloudflare.com`.
   Zona Cloudflare (`upburnout.com`, worker-ul cu ambele domenii custom) e deja pregătită și așteaptă activarea. (Dacă
   activarea întârzie > ~28 de zile, Cloudflare poate șterge zona pending — se re-adaugă în 5 minute.)
4. Continuă cu §4.4. Cloudflare Registrar rămâne opțiune ulterioară (după 60 de zile de la transfer).

**Pregătite deja în zona Cloudflare (2026-09-21), active automat la comutare:** înregistrările Worker pentru apex + `www`;
Resend: TXT `resend._domainkey`, CNAME `rsend` → `rsend-euw1.forge.rmta.net`, CNAME `send` → `send.forge.rmta.net` (ambele DNS only),
TXT `_dmarc` `v=DMARC1; p=none;` (domeniul e adăugat în Resend, regiune eu-west-1, click/open tracking oprite — status Pending până la
activare); SSL/TLS Full (strict); Always Use HTTPS; Bot Fight Mode ON; AI Labyrinth OFF (ar injecta text). Verificat cu `nslookup` pe
`aria.ns.cloudflare.com` că toate răspund.

Wix Premium (lunar, 16 ale lunii) se anulează abia după ce site-ul nou e live pe domeniu. Până atunci site-ul Wix rămâne activ
— transferul domeniului NU întrerupe nimic (DNS-ul Wix funcționează până schimbăm noi nameserverele la noul registrar).

### 4.3-vechi Wix — schimbarea nameserverelor (NU se aplică — vezi mai sus)
8. Wix → Domains → `upburnout.com` → ⋯ (Domain Actions) → **Advanced** / **Manage DNS** → **Name Servers** → „Replace name servers” →
   introducem cele 2 nameservere Cloudflare → Save. Wix avertizează că site-ul Wix și serviciile Wix de pe domeniu nu vor mai funcționa — corect, asta vrem.
9. Propagare: de obicei minute–1 h; teoretic până la 24–48 h. Verificare: `nslookup -type=NS upburnout.com` → NS Cloudflare;
   Cloudflare marchează zona „Active” (trimite e-mail).

### 4.4 Verificări post-cut-over
10. `https://www.upburnout.com` și `https://upburnout.com` (→ redirect) → site-ul nou, lacăt HTTPS valid, ambele pagini, `/echipă`.
11. Formularul trimis real de pe domeniu → e-mailul ajunge.
12. **Resend → Domains → Add `upburnout.com`** → adăugăm în Cloudflare DNS înregistrările DKIM (CNAME/TXT), SPF (TXT) și DMARC (TXT `v=DMARC1; p=quarantine; rua=…`) → Verify → schimbăm `CONTACT_FROM_EMAIL` la `contact@upburnout.com` → redeploy → test real.
13. Export zonă DNS (Cloudflare → DNS → Export) → salvat în repo la `docs/dns/`.
14. Indexare = da (#2): Search Console → proprietate de domeniu `upburnout.com`, verificare prin TXT în Cloudflare DNS; trimitem `https://www.upburnout.com/sitemap-index.xml`; cerem indexarea celor 2 URL-uri. Verificăm că răspunsul de pe domeniu NU are `X-Robots-Tag: noindex` (doar preview-urile îl au).
15. `_headers` HSTS activat; `curl -I` final; Lighthouse pe domeniul real.

### 4.5 Perioada de siguranță și curățenie
16. **2–4 săptămâni**: site-ul Wix rămâne publicat (nu se șterge, nu se anulează nimic). Rollback = revenirea NS-urilor la cele Wix (Wix le afișează în același ecran).
17. După perioada de siguranță: Wix → Subscriptions → **anulăm doar planul Premium al site-ului** (nu domeniul!). Domeniul rămâne la Wix și se reînnoiește pe 5 feb 2027 (sau se transferă — §5).
18. Opțional: Wix → site → „Unpublish” (păstrăm proiectul ca arhivă).

## 5. Opțional: transfer domeniu la Cloudflare Registrar (după cut-over, oricând)

- Condiții: > 60 zile de la înregistrare/ultimul transfer; zona deja activă în Cloudflare (da, după §4); Wix: domeniu deblocat + cod EPP/auth (Wix → Domains → ⋯ → Transfer away from Wix → primește codul pe e-mail); privacy WHOIS poate rămâne.
- Cloudflare → Domain Registration → Transfer → introducem codul → plătim 1 an de reînnoire la preț de cost (~10 $) → 5–7 zile → domeniul e la Cloudflare, expirarea se prelungește cu 1 an.
- Avantaj: nu mai depindem de contul Wix deloc; reînnoire ieftină. Dezavantaj: nimic notabil; se face doar cu acordul sorei (contul Wix e al ei).

## 6. Varianta B (Render) — dacă se alege

- Serviciu web Render din `backend/` (`render.yaml`), env vars în Render, health check `/healthz`, CORS către domeniile site-ului.
- Subdomeniu `api.upburnout.com` (CNAME către `*.onrender.com`) după cut-over; până atunci `*.onrender.com`.
- Cold start pe free tier — vezi `API_DESIGN.md` §7.

## 7. Rollback general

| Problemă | Acțiune | Timp |
|---|---|---|
| Deploy stricat | Pages → Rollback la deploy-ul anterior | 1 min |
| Formular nu trimite | verifică Resend status + secrete; temporar afișăm adresa de e-mail ca alternativă (text nou → cere aprobare) | 10 min |
| Domeniul nu răspunde după NS change | verifică NS la Wix, DNS records în Cloudflare, SSL mode; în ultimă instanță NS înapoi la Wix | minute–ore (propagare) |
| Cheie compromisă | rotire în Resend/Turnstile + update env + redeploy | 15 min |
