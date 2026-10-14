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

### 2.6 Pornesc / opresc politica de confidențialitate

Pagina `/confidentialitate` (text-proiect, nevalidat încă — `OPEN_QUESTIONS.md` #13) e **oprită temporar** de pe 2026-09-22.
Comutatorul e o singură linie în `frontend/src/data/confidentialitate.ts`: `export const PRIVACY_ENABLED = false;`.
Pui `true` → la următorul push apar pagina, linkul din footer și nota de sub formular; `false` → toate dispar (pagina dă 404
și nu intră în sitemap). Textul politicii stă în același fișier, nu trebuie rescris.

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

**Atenție (din 14.10.2026): site-ul public NU se actualizează singur la push.** Push-ul actualizează doar worker-ul
(formularul) și oglinda de pe Cloudflare. Site-ul de pe `upburnout.uvt.ro` stă pe serverul UVT, deci după push trebuie
urcate fișierele prin FileZilla:

1. `cd frontend` → `npm run build:uvt`
2. FileZilla (SFTP, user `upburnout`) → `/home/upburnout/public_html`
3. Urci **conținutul** folderului `frontend/dist-server/` (suprascrie tot) și ștergi ce a rămas vechi.
4. Verifici în browser: pagina Acasă, click pe „Echipă", un mesaj de test în formular.

`git push` → GitHub Actions rulează verificările (format, tipuri, teste, build, fidelitate conținut, teste în browser) → în
paralel Cloudflare Workers Builds face build + deploy (~2 min). Statusul: Cloudflare → worker → Deployments. Un push pe alt
branch decât `main` produce un preview separat (`<branch>-upburnout-website…workers.dev`), fără să atingă site-ul live.

## 6. Rollback (când ceva a ieșit prost)

- **Cel mai rapid (1 minut):** Cloudflare → worker → Deployments → versiunea anterioară → ⋯ → **Rollback**. Site-ul revine
  instant; codul din repo rămâne cel nou, deci repară-l după.
- **Curat:** `git revert HEAD && git push` → deploy nou cu versiunea anterioară.
- **Domeniul (după activare):** dacă e nevoie să revii la Wix în primele săptămâni: la registrar pui nameserverele Wix
  (`ns0.wixdns.net`, `ns1.wixdns.net`) — doar cât timp site-ul Wix e încă publicat și planul Premium activ.

## 7. Lista de finalizare (actualizată 14.10.2026, după mutarea pe serverul UVT)

Site-ul public e `https://upburnout.uvt.ro` (găzduit de UVT). Ce a mai rămas, în ordine:

| # | Pas | Cine |
|---|---|---|
| 1 | ✅ Push → worker-ul Cloudflare are CORS pentru `upburnout.uvt.ro` (verificat: preflight 204) | făcut |
| 2 | Turnstile: widget nou (hostname-uri `upburnout.uvt.ro` + `…workers.dev`, mod *Managed*); **Secret key** → worker → Settings → Variables and Secrets → `TURNSTILE_SECRET_KEY`; **Site key** (publică) → `TURNSTILE_SITE_KEY` în `frontend/scripts/build-uvt.mjs` | client + noi |
| 3 | `npm run build:uvt` → se urcă **conținutul** `frontend/dist-server/` în `/home/upburnout/public_html` (SFTP); se șterg rămășițele vechi (`_headers`, `_redirects`, `echipă.html`) | noi + client |
| 4 | Verificare pe domeniu: Acasă, „Echipă", mesaj real prin formular, `/api/health` | împreună |
| 5 | IT-ul UVT: forțare **HTTPS** pe subdomeniu (acum `http://upburnout.uvt.ro` răspunde pe http, fără redirecționare) și, opțional, `ErrorDocument 404 /404.html` | client → IT UVT |
| 6 | Resend: verificarea unui domeniu (înregistrări DNS în panoul Wix al lui `upburnout.com`) → apoi `CONTACT_FROM_EMAIL` = `contact@upburnout.com` (`wrangler.jsonc`) și `CONTACT_TO_EMAIL` = `athena.gandila@e-uvt.ro` (+ `CONTACT_BCC_EMAIL` prima lună). Până atunci mesajele ajung la adresa contului Resend | client + noi |
| 7 | Google Search Console → URL prefix `https://upburnout.uvt.ro/` → verificare prin fișierul HTML urcat în `public_html` → Sitemaps → `sitemap-index.xml` | client |
| 8 | Decizie `upburnout.com` (Wix Premium se reînnoiește ~16 oct): redirecționare către `upburnout.uvt.ro`, sau se lasă să expire | client |
| 9 | Politica de confidențialitate: validare text → `PRIVACY_ENABLED = true` (§2.6) → build + urcat | sora clientului + noi |
| 10 | Review final de conținut (inclusiv „faceți parte" vs „faci parte", #39), 2FA pe conturi (#35), o verificare pe telefon real | client |

Pașii 2–4 și 9 se termină cu același ritual: `npm run build:uvt` → urcat prin FileZilla → verificat în browser.

## 8. Ce a rămas deschis la predare (vezi `OPEN_QUESTIONS.md`)

- #7 adresa finală (`athena.gandila@e-uvt.ro`) se setează după verificarea unui domeniu în Resend (pasul 6 de mai sus).
- #13 politica de confidențialitate: **oprită temporar** (client, 2026-09-22) — proiectul rămâne în `frontend/src/data/confidentialitate.ts`;
  de citit și aprobat de coordonatoarea studiului (ideal și de DPO-ul UVT, gdpr@e-uvt.ro), apoi se pornește din comutator (§2.6).
- #34 chei Turnstile reale (până atunci: cheia de test, bannerul „Numai pentru testare" vizibil) — pasul 2.
- Găzduirea e la UVT: **push-ul nu mai actualizează site-ul public** (§5) — fișierele se urcă prin SFTP.
- #35 confirmare 2FA; #36 review-ul sorei; ajustări de ilustrații („revenim mai încolo").
- Telefon real: de deschis o dată site-ul pe un telefon (Firefox e acoperit automat din 2026-09-22).
