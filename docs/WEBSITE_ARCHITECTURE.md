# WEBSITE_ARCHITECTURE.md

## 1. Vedere de ansamblu

```
Vizitator ──HTTPS──▶ Cloudflare CDN ──▶ Cloudflare Pages (HTML/CSS/JS/imagini statice, build Astro)
                                   │
                                   └─▶ POST /api/contact ──▶ Pages Function (Workers)
                                                              ├─ validare (zod)
                                                              ├─ honeypot + timp + Turnstile siteverify
                                                              ├─ rate limit
                                                              └─ Resend API ──▶ inbox destinatar (Reply-To: expeditor)
Buton „Înscrie-te” / QR ──▶ e-uvt.questionpro.com (extern, neschimbat)
```

Tot site-ul este **static** (HTML generat la build). Singurul cod care rulează la cerere este funcția de contact.
În varianta B (Render), funcția devine un serviciu Fastify separat, iar formularul face `fetch` cross-origin către el
(vezi `API_DESIGN.md` §7 pentru diferențe).

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
│   │   ├── Header.astro      # sticky, meniu desktop + hamburger mobil (script mic inline)
│   │   ├── Footer.astro
│   │   ├── Hero.astro, About.astro, Approach.astro (+ Slideshow.astro), Purpose.astro, Participation.astro, SignUp.astro
│   │   ├── ContactForm.astro # markup + script client (fetch, stări, Turnstile)
│   │   ├── TeamGrid.astro, TeamCard.astro
│   │   └── Reveal.astro      # wrapper pentru animația de intrare (CSS scroll-driven + fallback)
│   ├── pages/
│   │   ├── index.astro       # /
│   │   ├── echipă.astro      # /echipă (Astro acceptă nume Unicode; Pages servește /echip%C4%83) — de verificat în Sesiunea 2
│   │   ├── echipa.astro      # alias sau redirect, conform OPEN_QUESTIONS #12
│   │   └── 404.astro
│   ├── styles/global.css     # @import "tailwindcss"; @theme { tokens }; reset-uri; reduced-motion
│   └── lib/contact-schema.ts # schema zod partajată client/server
├── functions/
│   └── api/contact.ts        # Pages Function (POST) — vezi API_DESIGN.md
├── scripts/
│   ├── prepare-images.mjs    # one-off: originale → src/assets (CMYK→RGB, resize)
│   └── verify-content.mjs    # build → extrage text → compară cu content/pages VERBATIM
└── tests/
    ├── e2e/*.spec.ts         # Playwright
    └── unit/*.test.ts        # Vitest (schema, funcție cu mock Resend/Turnstile)
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

### Slideshow „Abordarea noastră”
- Toate cele 8 slide-uri în DOM; container cu `scroll-snap-type: x mandatory`, fiecare slide `scroll-snap-align: start`.
- Butoane „Ședința anterioară” / „Ședința următoare” (aria-label), 8 indicatori (`role="tablist"` sau butoane cu `aria-label="Ședința N"`),
  `aria-live="polite"` cu „Ședința N din 8”.
- Fără autoplay (parity). Swipe = scroll nativ. Tastatură: săgeți stânga/dreapta când containerul are focus.
- Fără JS: toate slide-urile sunt derulabile orizontal (conținutul e accesibil oricum).
- Reduced motion: `scroll-behavior: auto` în loc de `smooth`.

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
- Wrapper `Reveal.astro`: `opacity` + `translateY(12px)` → normal, prin `animation-timeline: view()`; fallback IO doar unde
  browserul nu suportă; `@media (prefers-reduced-motion: reduce)` → fără animație. Fără poziționare calculată în JS.

## 5. SEO / head

- `lang="ro"`; `<title>` identic cu Wix („Acasă | Protocolul Unificat pentru Burnout”, „Echipă | …”).
- `canonical` = `https://www.upburnout.com/…` (păstrăm `www` ca variantă canonică, la fel ca acum).
- `robots`: `noindex` **sau** indexare — conform OPEN_QUESTIONS #2; `description`/`og:image` doar dacă se indexează și textul e aprobat.
- JSON-LD `WebSite` (parity) + eventual `Organization` (UVT/FPSE) dacă se indexează.
- Sitemap doar la indexare.

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
