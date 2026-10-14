// Texte și linkuri comune (header, footer, identitate). Sursa: content/pages/acasa.md §0 și §8.
// Regula proiectului: textele sunt VERBATIM față de site-ul Wix — nu se editează fără aprobare.

// `import.meta.env?.` — fișierul e importat și de testele Playwright, care rulează în Node simplu.
export const site = {
  name: 'Protocolul Unificat pentru Burnout',
  /** Textul din header pe mobil (parity cu Wix — OPEN_QUESTIONS #4). */
  nameShort: 'UP-Burnout',
  /** Originea publică a site-ului (canonical, OG, JSON-LD). Aceeași variabilă ca `site` din astro.config.mjs. */
  canonicalOrigin: import.meta.env?.PUBLIC_SITE_ORIGIN ?? 'https://upburnout.uvt.ro',
  /**
   * Unde trimite formularul. Implicit aceeași origine (`/api/contact`, pe Cloudflare).
   * Când site-ul e găzduit în altă parte (UVT), se dă adresa completă a worker-ului la build:
   * `PUBLIC_CONTACT_ENDPOINT=https://…/api/contact npm run build` (worker-ul permite originea, vezi ALLOWED_ORIGINS).
   */
  contactEndpoint: import.meta.env?.PUBLIC_CONTACT_ENDPOINT ?? '/api/contact',
  /** Decizie client 2026-09-21 (OPEN_QUESTIONS #2): site-ul se indexează. Doar pagina 404 rămâne noindex. */
  noindex: false,
  /** Imagine pentru partajări (OG/Twitter), 1200×630, generată din elementele existente (titlu + logo + ilustrația hero). */
  ogImage: '/og-image.jpg',
  ogImageAlt: 'Protocolul Unificat pentru Burnout',
  titles: {
    acasa: 'Acasă | Protocolul Unificat pentru Burnout',
    echipa: 'Echipă | Protocolul Unificat pentru Burnout',
    notFound: 'Pagina nu a fost găsită | Protocolul Unificat pentru Burnout',
  },
  paths: {
    acasa: '/',
    echipa: '/echipă/',
    /** Ancore pe pagina Acasă */
    inscriere: '/#inscrie-te',
    contact: '/#contact',
    echipaCercetare: '/echipă/#echipa-de-cercetare',
  },
  links: {
    questionpro: 'https://e-uvt.questionpro.com/up-burnout',
    vecteezy: 'https://www.vecteezy.com',
  },
  nav: [
    { label: 'Acasă', href: '/' },
    { label: 'Echipă', href: '/echipă/' },
  ],
  footer: {
    title: 'Protocolul Unificat pentru Burnout',
    lines: [
      'Studiu desfășurat prin intermediul',
      'Școlii Doctorale de Psihologie a',
      'Universității de Vest din Timișoara',
    ],
    links: [
      { label: 'Acasă', href: '/' },
      { label: 'Echipă', href: '/echipă/' },
      { label: 'Înscrie-te', href: '/#inscrie-te' },
      { label: 'Formular de contact', href: '/#contact' },
    ],
    creditLabel: 'Ilustrații',
    creditLink: 'Vecteezy',
  },
} as const;
