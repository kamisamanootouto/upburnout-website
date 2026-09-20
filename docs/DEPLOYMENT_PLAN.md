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

1. **GitHub**: repo privat `upburnout-website` pe contul personal `kamisamanootouto` (decis 2026-09-20). Branch `main` protejat.
2. **Cloudflare Pages**: „Create project → Connect to Git” → repo → Root directory `frontend`, Build command `npm run build`,
   Output `dist`, Node 22 (`NODE_VERSION=22`). Numele proiectului `upburnout` → `upburnout.pages.dev`.
3. **Variabile de mediu** (Production și Preview separat): vezi `API_DESIGN.md` §3. Pe Preview: chei Turnstile de test + `CONTACT_TO_EMAIL` de test.
4. **Turnstile**: Cloudflare → Turnstile → Add widget → hostnames `upburnout.pages.dev`, `www.upburnout.com`, `upburnout.com`; mod Managed.
5. **Resend**: cont pe adresa clientului → API key (Production) → până la verificarea domeniului, `from = onboarding@resend.dev`
   (funcționează doar către adresa contului — exact adresa de test dorită).
6. **CI (GitHub Actions)**: `npm ci`, `tsc --noEmit`, `npm run lint`, `vitest`, `astro build`, `verify-content`, Playwright (pe build local) — pe PR și pe `main`.

## 3. Fluxul de deploy curent

`git push` pe branch → Cloudflare face build + preview URL (comentat în PR) → review → merge în `main` → build de producție
(~1–2 min) → live pe `upburnout.pages.dev` (și pe domeniu, după cut-over). Rollback: Pages → Deployments → „Rollback to this deployment”.

## 4. Cut-over domeniu (Sesiunea 7) — runbook pas cu pas

### 4.0 Pre-condiții (toate bifate înainte de a atinge DNS-ul)
- [ ] Sesiunile 2–6 aprobate; `upburnout.pages.dev` verificat pagină cu pagină, formular testat real.
- [ ] Sora clientului a aprobat designul final și a văzut site-ul pe `pages.dev`.
- [ ] În Wix → Domains → `upburnout.com` → ⋯ → **Manage DNS records**: screenshot al **tuturor** înregistrărilor existente
      (A, CNAME, MX, TXT, SRV). Dacă apar **MX** sau TXT (`google-site-verification`, SPF) → există e-mail pe domeniu și
      trebuie replicate în Cloudflare înainte de schimbare. (Butonul „Get a Business Email” din panou sugerează că nu există — de confirmat.)
- [ ] Wix → Domains: domeniul nu are „transfer lock” care să blocheze schimbarea NS (schimbarea NS nu e transfer; ar trebui permisă).
- [ ] Contul Cloudflare al clientului e pregătit; are 2FA.
- [ ] Un moment cu trafic mic (seara/weekend) și 1–2 ore disponibile.

### 4.1 Cloudflare — adăugarea zonei
1. Cloudflare Dashboard → „Add a domain” → `upburnout.com` → plan **Free**.
2. Cloudflare scanează DNS-ul Wix și importă înregistrările. **Ștergem** A/CNAME-urile care duc la Wix (ex. `A @ 185.230.63.x`, `CNAME www … wixdns.net`).
   **Păstrăm** orice MX/TXT găsit (dacă există).
3. Notăm cele 2 nameservere afișate de Cloudflare (ex. `ada.ns.cloudflare.com`, `rob.ns.cloudflare.com`).

### 4.2 Cloudflare Pages — domeniile custom
4. Pages → `upburnout` → Custom domains → Add `www.upburnout.com` și `upburnout.com`. Cloudflare creează automat CNAME-urile
   (apex prin CNAME flattening). Certificatele se emit automat după ce NS-urile se propagă.
5. Rules → Redirect Rules: `upburnout.com/*` → `https://www.upburnout.com/$1` (301) — păstrează varianta canonică `www` de acum.
6. SSL/TLS → Full (strict); Edge Certificates → Always Use HTTPS, HSTS (după 48 h de funcționare corectă), Minimum TLS 1.2.
7. Security → Bots → Bot Fight Mode ON; Security → WAF → Rate limiting rule pentru `/api/contact` (5/min).

### 4.3 Wix — schimbarea nameserverelor (clientul, ghidat live)
8. Wix → Domains → `upburnout.com` → ⋯ (Domain Actions) → **Advanced** / **Manage DNS** → **Name Servers** → „Replace name servers” →
   introducem cele 2 nameservere Cloudflare → Save. Wix avertizează că site-ul Wix și serviciile Wix de pe domeniu nu vor mai funcționa — corect, asta vrem.
9. Propagare: de obicei minute–1 h; teoretic până la 24–48 h. Verificare: `nslookup -type=NS upburnout.com` → NS Cloudflare;
   Cloudflare marchează zona „Active” (trimite e-mail).

### 4.4 Verificări post-cut-over
10. `https://www.upburnout.com` și `https://upburnout.com` (→ redirect) → site-ul nou, lacăt HTTPS valid, ambele pagini, `/echipă`.
11. Formularul trimis real de pe domeniu → e-mailul ajunge.
12. **Resend → Domains → Add `upburnout.com`** → adăugăm în Cloudflare DNS înregistrările DKIM (CNAME/TXT), SPF (TXT) și DMARC (TXT `v=DMARC1; p=quarantine; rua=…`) → Verify → schimbăm `CONTACT_FROM_EMAIL` la `contact@upburnout.com` → redeploy → test real.
13. Export zonă DNS (Cloudflare → DNS → Export) → salvat în repo la `docs/dns/`.
14. Dacă indexare = da (OPEN_QUESTIONS #2): Search Console → proprietate de domeniu, verificare prin TXT în Cloudflare; trimitem `sitemap.xml`.
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
