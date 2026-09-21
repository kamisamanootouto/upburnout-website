# WEBSITE_ARCHITECTURE.md

## 1. Vedere de ansamblu

```
Vizitator ──HTTPS──▶ Cloudflare ──▶ Worker `upburnout-website` (run_worker_first)
                                   ├─ static assets din dist/ (build Astro; `_headers` CSP/HSTS, `_redirects`)
                                   ├─ 301 apex → www; X-Robots-Tag: noindex pe *.workers.dev
                                   └─▶ POST /api/contact ──▶ worker/contact.ts
                                                              ├─ validare (zod)
                                                              ├─ honeypot + timp + Turnstile siteverify
                                                              ├─ rate limit
                                                              └─ Resend API ──▶ inbox destinatar (Reply-To: expeditor)
Buton „Înscrie-te” / QR ──▶ e-uvt.questionpro.com (extern, neschimbat)
```

Tot site-ul este **static** (HTML generat la build). Singurul cod care rulează la cerere este worker-ul: pentru `/api/contact`
execută handler-ul, pentru restul servește fișierele din `dist/` prin binding-ul ASSETS (cu `not_found_handling: 404-page`).
Varianta Render a fost respinsă (`OPEN_QUESTIONS.md` #1).

## 2. Structura proiectului (`frontend/`)

```
frontend/
├── astro.config.mjs          # output: 'static', site: 'https://www.upburnout.com', integrations: sitemap (condiționat)
├── package.json              # astro, @astrojs/sitemap, tailwindcss, @fontsource/*, zod, (embla-carousel?)
├── tsconfig.json             # strict
├── public/
│   ├── _headers              # CSP, HSTS, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, X-Frame-Options
│   ├── _redirects            # /echipa ↔ /echipă (conform deciziei), eventual www/apex nu aici (regulă la nivel de zonă)
│   ├── robots.txt            # generat conform deciziei de indexare
│   ├── favicon.svg / .ico    # după aprobare (OPEN_QUESTIONS #10)
│   └── qr-questionpro.png    # QR servit neschimbat (fără re-procesare)
├── src/
│   ├── assets/               # imaginile pre-procesate (RGB, ≤ ~1600px) — sursa pentru astro:assets
│   ├── data/
│   │   ├── acasa.ts          # tot textul paginii Acasă, structurat, copiat VERBATIM din content/pages/acasa.md
│   │   ├── echipa.ts         # membrii echipei (nume, rol, fotografie, alt)
│   │   └── site.ts           # titluri, linkuri, texte header/footer, URL QuestionPro
│   ├── layouts/Base.astro    # <html lang="ro">, <head> (SEO, fonturi, preload), Header, <main>, Footer, skip-link
│   ├── components/
│   │   ├── Header.astro      # sticky, meniu desktop + hamburger mobil (script inline; fără JS panoul rămâne vizibil)
│   │   ├── Footer.astro
│   │   ├── Hero.astro, SectionDespre.astro, SectionAbordare.astro (grila celor 8 ședințe), SectionScop.astro,
│   │   │   SectionParticipare.astro, SectionInscriere.astro
│   │   ├── ContactForm.astro # markup + script client (validare, fetch, Turnstile lazy)
│   │   └── TeamGrid.astro, TeamCard.astro
│   ├── pages/
│   │   ├── index.astro       # /
│   │   ├── echipă.astro      # /echipă → dist/echipă.html (build.format 'file'); /echipa → 301 (_redirects)
│   │   └── 404.astro
│   └── styles/global.css     # @import "tailwindcss"; @theme { tokens }; .reveal (CSS scroll-driven); reduced-motion
├── worker/
│   ├── index.ts              # fetch handler: /api/contact, /api/health, apex→www, noindex pe preview, ASSETS
│   ├── contact.ts            # logica formularului (zod, origin, honeypot, Turnstile, Resend, rate limit) — vezi API_DESIGN.md
│   └── contact.test.ts       # Vitest (16 teste)
├── wrangler.jsonc            # main + assets (drop-trailing-slash, 404-page, run_worker_first) + vars + ratelimits
├── playwright.config.ts, tests/e2e/site.spec.ts   # Chromium + WebKit, desktop + mobil, pe wrangler dev
└── scripts/
    ├── prepare-images.mjs    # originale → src/assets (CMYK→RGB, resize, crop 3:4)
    ├── verify-content.mjs    # build → text → compară cu content/pages VERBATIM (+ approved-deviations)
    └── inject-csp-hashes.mjs # hash-uri SHA-256 pentru scripturile inline → dist/_headers
```

## 3. Design tokens (punct de plecare; designul final se aprobă în Sesiunea 2)

Derivate din `content/design-reference.md`, cu corecțiile de accesibilitate:

| Token | Valoare propusă | Origine |
|---|---|---|
| `--color-ink` | `#06103C` | bleumarinul actual (text, butoane, footer) |
| `--color-ink-soft` | `#444C6D` | din paleta Wix (text secundar, contrast 8:1 pe alb) |
| `--color-surface` | `#FFFFFF` | fundal |
| `--color-surface-alt` | `#F3F5F9` (ușor mai rece decât #F3F3F3) | carduri (slideshow, echipă) |
| `--color-accent` | `#A2A3E9` → **doar ca fundal/decor**, niciodată cu text alb | lavanda actuală (contrast alb/lavandă = 2,1:1, pică AA) |
| `--color-accent-ink` | `#5B5DBF` (lavandă închisă, ~5,4:1 pe alb) | pentru text/linkuri pe accent, dacă e nevoie |
| `--color-focus` | `#2F6FED` | inel de focus vizibil (nu roșu) |
| Familii | Fahkwang (titluri, corp), Raleway (opțional, UI mic) | parity |
| Scară tipografică | 17/19/24/32/42/51/67 px la desktop, fluid cu `clamp()` la mobil | din măsurători |
| Raze | butoane pill `9999px`; carduri `12–16px` | parity + modern |
| Interzis | orice roșu/portocaliu-roșu în UI (erori de formular se semnalizează cu bleumarin + iconiță + text, nu roșu) | cerința clientului |

## 4. Componente cheie — detalii de implementare

### Header
Sticky, alb, umbră discretă doar după scroll (`scroll-driven` sau clasă la `scrollY > 0`). Desktop: nume site + 2 linkuri,
pagina curentă marcată prin `aria-current="page"` + stil. Mobil (≤ 750px): „UP-Burnout” (sau textul decis la #4) +
buton hamburger `aria-expanded`, panou cu 2 linkuri, închidere la Esc/click în afară, fără JS → linkurile rămân vizibile
(progressive enhancement: meniul e ascuns doar când JS e activ).

### Cele 8 ședințe („Abordarea noastră”)
- Implementate ca `<ol>` de carduri (2 coloane desktop, 1 mobil), toate vizibile — decizia #25. Numărul din titlu („1. …”) e text
  verbatim: badge-ul vizual vine din CSS (`.num-badge::before { content: attr(data-num) }`), iar „1. ” rămâne în DOM ca text sr-only,
  ca `verify-content` și cititoarele de ecran să vadă textul original.

### Formular de contact
- `<form method="post" action="/api/contact">` cu `novalidate` + validare JS (aceeași schemă zod) + validare server.
- Câmpuri: `nume`, `prenume`, `email`, `telefon`, `mesaj`; honeypot `website` (ascuns vizual + `tabindex=-1` + `autocomplete=off`);
  `ts` (timestamp randării, semnat? — nu e nevoie: e doar un prag „completat în < 3 s = bot”); token Turnstile (`cf-turnstile-response`).
- Stări: idle → sending (buton dezactivat, text „Se trimite…”) → success (mesaj + formular golit) / error (mesaj + butonul reactivat).
- Erori pe câmp: text sub câmp, `aria-invalid="true"`, `aria-describedby`; focus pe primul câmp invalid.
- Fără JS: submit clasic → funcția răspunde cu un HTML minimal „Mesaj trimis / Eroare” (progressive enhancement rezonabil).

### Imagini
- `<Image>`/`<Picture>` din `astro:assets`: AVIF+WebP, `widths` adaptate slotului (ex. hero 480/720/1080/1440), `sizes` corect,
  `loading="eager"` + `fetchpriority="high"` doar pentru ilustrația hero (LCP), restul `lazy`.
- Portretele echipei: `aspect-ratio: 3/4`, `object-fit: cover`, `object-position: center` (= `fill/al_c` Wix).

### Animații de intrare
- Clasa `.reveal`: `opacity` + `translateY(14px)` → normal, prin `animation-timeline: view()` (CSS-only, fără JS, fără fallback —
  browserele fără suport afișează conținutul direct); `@media (prefers-reduced-motion: no-preference)` gate. **Nu se pune pe
  părintele unei imagini cu `mix-blend-mode`** (stacking context-ul animației blochează blend-ul) — se pune pe imagine.

## 5. SEO / head

- `lang="ro"`; `<title>` identic cu Wix („Acasă | Protocolul Unificat pentru Burnout”, „Echipă | …”).
- `canonical` = `https://www.upburnout.com/…` (păstrăm `www` ca variantă canonică, la fel ca acum).
- Indexare activă (decizie #2, 2026-09-21): fără `noindex` (doar 404); `description` = propoziție existentă pe pagină; `og:image` = `/og-image.jpg`; `sitemap-index.xml` (@astrojs/sitemap, 404 exclus); `robots.txt` cu `Allow: /`, `Disallow: /api/`, `Sitemap:`.
- Preview-urile (`*.workers.dev`, localhost) primesc `X-Robots-Tag: noindex` din worker (`PRODUCTION_HOSTS`), ca Google să indexeze doar domeniul real. De aceea `run_worker_first: true`.
- JSON-LD: `WebSite` + `WebPage` (name/url/description din datele existente).

## 6. Redirecturi și URL-uri

| Cerere | Răspuns |
|---|---|
| `http://…` | 301 → `https://…` (Cloudflare „Always Use HTTPS”) |
| `https://upburnout.com/*` | 301 → `https://www.upburnout.com/*` (regulă de redirect la nivel de zonă; păstrează varianta canonică actuală) |
| `/echip%C4%83` | pagina Echipă (200) sau 301 → `/echipa`, conform #12 |
| `/echipa` | pagina Echipă (200) sau 301 → `/echipă`, conform #12 |
| `/acasă`, `/acasa` | 301 → `/` (slug-ul intern Wix „acasă” nu e public, dar nu strică) |
| orice altceva | 404 în design |

## 7. Performanță — bugete

- HTML per pagină < 40 KB; CSS < 25 KB; JS < 30 KB (fără Turnstile, care se încarcă lazy doar când formularul intră în viewport sau la focus);
- Imagini pe Acasă (mobil) < 450 KB total; pe Echipă < 600 KB (10 portrete ~40–50 KB fiecare la 2×);
- Fonturi: 3 fișiere woff2 (Fahkwang 400/700 + italic) ≈ 60–80 KB, preload pentru 400.

## 8. Pipeline de conținut și verificare

1. `content/pages/*.md` (VERBATIM) → transcris manual în `src/data/*.ts` în Sesiunea 2 (o singură dată).
2. `scripts/verify-content.mjs`: după `astro build`, parcurge `dist/**/index.html`, extrage textul vizibil (fără script/style),
   normalizează spațiile și compară fiecare bloc VERBATIM (extras din markdown) → raport „găsit / lipsă / diferit”.
   Rulează în CI; orice diferență = build roșu, cu excepția unei liste de abateri aprobate (`content/approved-deviations.json`).
3. Playwright verifică: linkuri (interne, ancore, QuestionPro, Vecteezy), cele 8 slide-uri, formularul (validare + succes cu Resend mock), meniul mobil.
