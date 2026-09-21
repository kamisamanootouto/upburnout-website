# MAINTENANCE.md — ghid de întreținere (fără cunoștințe de programare)

Site-ul: `https://www.upburnout.com` (după activarea domeniului) · preview permanent: `https://upburnout-website.bogdan-gandila.workers.dev`
Codul: GitHub `kamisamanootouto/upburnout-website` (privat) · Hosting: Cloudflare Workers (`upburnout-website`) · E-mail: Resend

Regula de aur: **orice modificare = editezi un fișier → commit → push → în ~2 minute e live.** Nu există „butoane" de editat
site-ul în Cloudflare; totul vine din repo. Dacă ceva iese greșit, revii la versiunea anterioară în 1 minut (§6).

---

## 1. Cum rulezi local (opțional, ca să vezi înainte de push)

```bash
cd D:\Creatii_Claude\upburnout-website\frontend
npm ci              # o singură dată (sau după ce se schimbă package.json)
npm run dev         # deschide http://localhost:4321 — se actualizează singur când salvezi fișiere
```
Verificare completă înainte de push (aceleași verificări le face și GitHub Actions automat):
```bash
npm run build && npm run verify-content && npm test
```
`verify-content` compară textul din build cu inventarul original din `content/pages/*.md` — dacă schimbi un text,
trebuie să actualizezi și `content/approved-deviations.json` (vezi §2.1), altfel verificarea pică intenționat.

## 2. Modificări frecvente

### 2.1 Schimb un text
1. Textele sunt în `frontend/src/data/`: `acasa.ts` (pagina Acasă), `echipa.ts` (Echipă), `site.ts` (header, footer, titluri).
2. Editezi textul între ghilimele. Atenție să nu ștergi ghilimelele sau virgulele de la final de rând.
3. În `content/approved-deviations.json` adaugi un bloc cu textul vechi (`original`) și cel nou (`replacement`), cine a aprobat, data.
   Fără asta, `verify-content` (și CI-ul) semnalează diferența — e mecanismul care garantează că nimeni nu schimbă textul din greșeală.
4. `git add -A && git commit -m "Text: ..." && git push`.

### 2.2 Schimb sau adaug o fotografie din echipă
1. Pui fotografia originală în `content/assets/original/` (folder local, nu intră în git) cu un nume clar, ex. `echipa-12-nume-prenume.jpg`.
2. În `frontend/scripts/prepare-images.mjs` adaugi un rând în lista `portraits`: `['echipa-12-nume-prenume.jpg', 'nume-prenume.jpg']`.
3. `npm run images` → apare `frontend/src/assets/team/nume-prenume.jpg` (decupat 3:4, optimizat).
4. În `frontend/src/data/echipa.ts`: adaugi `import numePrenume from '../assets/team/nume-prenume.jpg';` sus și
   `{ name: 'Titlu Nume Prenume', photo: numePrenume }` în lista potrivită (`echipaCercetare` sau `echipaPsihoterapeuti`), în poziția dorită.
   Pentru un rând suplimentar sub nume: `role: 'Asistent cercetare voluntar'`.
5. Textul numelui e conținut → intră în `content/approved-deviations.json` doar dacă înlocuiește un nume existent; un membru nou se
   adaugă și în `content/pages/echipa.md` (tabelul), ca inventarul să rămână sursa de adevăr.
6. Commit + push. Ordinea în pagină = ordinea din listă.

### 2.3 Schimb o ilustrație
Ilustrațiile sunt în `content/assets/original/` → procesate de `npm run images` în `frontend/src/assets/illustrations/` (lista
`illustrations` din `prepare-images.mjs`, cu lățimea maximă). Componentele care le folosesc: `Hero.astro`, `SectionDespre.astro`,
`SectionScop.astro`, `SectionParticipare.astro`, `pages/echipă.astro`. Dacă noua ilustrație nu are fundal alb, scoate clasa
`illustration` (care face albul transparent pe secțiunile colorate).

### 2.4 Schimb adresa la care ajung mesajele din formular
Cloudflare → Workers & Pages → `upburnout-website` → Settings → **Runtime variables and secrets** → `CONTACT_TO_EMAIL` → Edit → Deploy.
Se aplică imediat, fără push. (Până la verificarea domeniului în Resend, adresa poate fi doar cea a contului Resend.)
Copie de siguranță către o a doua adresă: adaugă secretul `CONTACT_BCC_EMAIL`.

### 2.5 Schimb culori / fonturi
`frontend/src/styles/global.css` → blocul `@theme` (culori `--color-*`, fonturi `--font-*`). Regula proiectului: fără roșu,
portocaliu-roșu, roz aprins, galben de alertă; contrast text/fundal ≥ 4,5:1.

## 3. Cum funcționează formularul (ca să știi ce să verifici când „nu merge")

Browser → `POST /api/contact` (worker) → validare → honeypot + timp minim 3 s → Turnstile (anti-bot) → Resend → e-mail la
`CONTACT_TO_EMAIL`, cu `Reply-To` = adresa celui care a scris (dai Reply și îi răspunzi direct).

Diagnostic rapid: deschide `https://www.upburnout.com/api/health` (sau pe preview). Trebuie:
`"resendKey":true,"contactTo":true,"turnstileSecret":"set","rateLimit":true,"mailMode":"send"`.
- `resendKey:false` / `contactTo:false` → lipsesc secretele (§2.4, same loc).
- Formularul arată `(cod: delivery, 502)` → Resend a refuzat: cheia expirată/ștearsă sau domeniul neverificat și destinatarul ≠ contul Resend.
- `(cod: turnstile, 403)` → cheile Turnstile nu se potrivesc între build (`PUBLIC_TURNSTILE_SITE_KEY`) și secret (`TURNSTILE_SECRET_KEY`).
- Loguri: Workers & Pages → `upburnout-website` → Observability → Logs (fără date personale, doar coduri).

Limite gratuite: Resend 100 e-mailuri/zi, 3.000/lună; Cloudflare 100.000 cereri/zi. Rate limit propriu: 5 trimiteri/minut/IP.

## 4. Chei și conturi (unde sunt, cum le rotești)

| Ce | Unde stă | Cum se schimbă |
|---|---|---|
| `RESEND_API_KEY` | Cloudflare → worker → Runtime variables and secrets | Resend → API Keys → Create → pui valoarea nouă → Deploy → ștergi cheia veche în Resend |
| `CONTACT_TO_EMAIL`, `CONTACT_BCC_EMAIL` | idem | Edit → Deploy |
| `TURNSTILE_SECRET_KEY` | idem | Cloudflare → Turnstile → widget → Rotate secret |
| `PUBLIC_TURNSTILE_SITE_KEY` | Cloudflare → worker → Settings → **Build** → Variables | e publică (ajunge în HTML); după schimbare e nevoie de un build nou (push sau „Retry build") |
| `CONTACT_FROM_EMAIL`, `ALLOWED_ORIGINS` | `frontend/wrangler.jsonc` → `vars` (în repo, nu sunt secrete) | editezi + push |

Conturi: GitHub (`kamisamanootouto`), Cloudflare (contul clientului), Resend (`bogdan.gandila@yahoo.com`), registrarul domeniului
(după transfer). **2FA activ pe toate.** Nicio cheie nu se pune în cod, în chat sau în docs.

## 5. Deploy: ce se întâmplă la push

`git push` → GitHub Actions rulează verificările (format, tipuri, teste, build, fidelitate conținut, teste în browser) → în
paralel Cloudflare Workers Builds face build + deploy (~2 min). Statusul: Cloudflare → worker → Deployments. Un push pe alt
branch decât `main` produce un preview separat (`<branch>-upburnout-website…workers.dev`), fără să atingă site-ul live.

## 6. Rollback (când ceva a ieșit prost)

- **Cel mai rapid (1 minut):** Cloudflare → worker → Deployments → versiunea anterioară → ⋯ → **Rollback**. Site-ul revine
  instant; codul din repo rămâne cel nou, deci repară-l după.
- **Curat:** `git revert HEAD && git push` → deploy nou cu versiunea anterioară.
- **Domeniul (după activare):** dacă e nevoie să revii la Wix în primele săptămâni: la registrar pui nameserverele Wix
  (`ns0.wixdns.net`, `ns1.wixdns.net`) — doar cât timp site-ul Wix e încă publicat și planul Premium activ.

## 7. Ziua activării domeniului (checklist, împreună)

1. Registrar → Name servers → `aria.ns.cloudflare.com`, `chase.ns.cloudflare.com`.
2. Cloudflare → zona `upburnout.com` → Overview → „Check nameservers"; statusul devine **Active** (minute–ore).
3. `https://www.upburnout.com` → site-ul nou; `https://upburnout.com` → redirect la `www`; `/echipă`; `/api/health`.
4. Formular: trimitere reală de pe domeniu → e-mailul ajunge.
5. Resend → Domains → `upburnout.com` → **Verify** → Verified → `CONTACT_FROM_EMAIL` se schimbă în `frontend/wrangler.jsonc` → `vars`
   la `contact@upburnout.com` → push. Apoi Cloudflare → worker → Runtime variables and secrets → `CONTACT_TO_EMAIL` =
   `athena.gandila@e-uvt.ro` (decizia #7) și, recomandat pentru prima lună, `CONTACT_BCC_EMAIL` = adresa de Yahoo a clientului
   (verificare că mesajele nu ajung în spam la e-uvt.ro). Test: un mesaj real → ajunge la ambele.
6. Google Search Console → Add property → Domain `upburnout.com` → înregistrarea TXT dată de Google → Cloudflare DNS → Verify →
   Sitemaps → `https://www.upburnout.com/sitemap-index.xml`.
7. Cloudflare → DNS → Export → fișierul salvat în `docs/dns/` (backup).
8. După 2–4 săptămâni fără probleme: Wix → Subscriptions → anulează **planul Premium al site-ului** (nu există alt abonament de anulat
   la Wix după transferul domeniului). Opțional, „Unpublish" pe site-ul Wix.
9. Tot atunci: în `public/_headers`, `Strict-Transport-Security` → `max-age=31536000; includeSubDomains` (întărire HSTS).

## 8. Ce a rămas deschis la predare (vezi `OPEN_QUESTIONS.md`)

- #7 adresa finală (`athena.gandila@e-uvt.ro`) se setează după verificarea domeniului în Resend (pasul 5 de mai sus).
- #13 politica de confidențialitate: PROIECT la `/confidentialitate` — de citit și aprobat de coordonatoarea studiului (ideal și de
  DPO-ul UVT, gdpr@e-uvt.ro) înainte de lansare; textul e în `frontend/src/data/confidentialitate.ts`.
- #34 chei Turnstile reale (până atunci: cheia de test, bannerul „Numai pentru testare" vizibil).
- #35 confirmare 2FA; #36 review-ul sorei; ajustări de ilustrații („revenim mai încolo").
- Firefox: neverificat automat (binarul Playwright de pe PC e corupt) — de deschis o dată manual.
