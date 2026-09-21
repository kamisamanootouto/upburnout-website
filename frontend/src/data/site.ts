// Texte și linkuri comune (header, footer, identitate). Sursa: content/pages/acasa.md §0 și §8.
// Regula proiectului: textele sunt VERBATIM față de site-ul Wix — nu se editează fără aprobare.

export const site = {
  name: 'Protocolul Unificat pentru Burnout',
  /** Textul din header pe mobil (parity cu Wix — OPEN_QUESTIONS #4). */
  nameShort: 'UP-Burnout',
  canonicalOrigin: 'https://www.upburnout.com',
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
    echipa: '/echipă',
    /** Ancore pe pagina Acasă */
    inscriere: '/#inscrie-te',
    contact: '/#contact',
    echipaCercetare: '/echipă#echipa-de-cercetare',
  },
  links: {
    questionpro: 'https://e-uvt.questionpro.com/up-burnout',
    vecteezy: 'https://www.vecteezy.com',
  },
  nav: [
    { label: 'Acasă', href: '/' },
    { label: 'Echipă', href: '/echipă' },
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
      { label: 'Echipă', href: '/echipă' },
      { label: 'Înscrie-te', href: '/#inscrie-te' },
      { label: 'Formular de contact', href: '/#contact' },
      { label: 'Politica de confidențialitate', href: '/confidentialitate' },
    ],
    creditLabel: 'Ilustrații',
    creditLink: 'Vecteezy',
  },
} as const;
