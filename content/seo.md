# SEO — starea actuală (extras din HTML-ul public, 2026-09-20)

## Per pagină

| | Acasă `/` | Echipă `/echipă` |
|---|---|---|
| `<title>` | `Acasă \| Protocolul Unificat pentru Burnout` | `Echipă \| Protocolul Unificat pentru Burnout` |
| `<meta name="description">` | **lipsește** | **lipsește** |
| `<meta name="robots">` | **`noindex`** | **`noindex`** |
| `<link rel="canonical">` | `https://www.upburnout.com` | `https://www.upburnout.com/echip%C4%83` |
| `og:title` | = title | = title |
| `og:url` | `https://www.upburnout.com` | `https://www.upburnout.com/echip%C4%83` |
| `og:site_name` | `Protocolul Unificat pentru Burnout` | idem |
| `og:type` | `website` | `website` |
| `og:image` | **lipsește** | **lipsește** |
| `twitter:card` | `summary_large_image` (fără imagine) | idem |
| `<html lang>` | **`en`** (conținutul e în română) | **`en`** |
| JSON-LD | `{"@type":"WebSite","name":"Protocolul Unificat pentru Burnout","url":"https://www.upburnout.com"}` | — |
| H1 | `Protocolul Unificat pentru Burnout` (1 singur) | **niciun H1** (începe cu H2 „Despre noi”) |

## Site-wide

- `robots.txt`: generat de Wix, `Allow: /` + `Disallow: *?lightbox=` + `Sitemap: https://www.upburnout.com/sitemap.xml`
- `sitemap.xml`: **răspunde 404** — consecința setării de noindex din Wix (Wix nu publică sitemap când indexarea e oprită)
- Favicon: implicit Wix (`https://static.parastorage.com/client/pfavico.ico`) — niciun favicon personalizat
- Analytics / pixeli: **niciunul** (nu există GA4, GTM, Meta Pixel, Hotjar, Clarity)
- Cookie banner: **niciunul**
- Domeniu: `www.upburnout.com` este varianta canonică (apex `upburnout.com` redirecționează spre `www`)
- Locale Wix: `siteLanguage: en`, `locale: ro-ro` la nivel de business — de aici `lang="en"` greșit

## Concluzii care contează pentru migrare

1. **Site-ul nu este indexat în Google acum** (noindex pe ambele pagini). Nu există trafic organic sau poziții de
   pierdut → migrarea nu are risc SEO. Decizia „vrem să fie găsit pe Google sau nu?” e a clientului → `docs/OPEN_QUESTIONS.md` #2.
2. Dacă răspunsul e „da, indexat”: avem nevoie de meta description (text nou — conținut nou, cere aprobare), imagine OG,
   `lang="ro"`, sitemap, Search Console. Dacă „nu”: păstrăm `noindex` + `robots.txt` cu `Disallow`.
3. URL-urile trebuie păstrate funcționale indiferent de decizie: `/` și `/echipă` (+ `/echipa` fără diacritic ca alias).
