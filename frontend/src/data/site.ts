// Texte și linkuri comune (header, footer, identitate). Sursa: content/pages/acasa.md §0 și §8.
// Regula proiectului: textele sunt VERBATIM față de site-ul Wix — nu se editează fără aprobare.

export const site = {
  name: 'Protocolul Unificat pentru Burnout',
  /** Textul din header pe mobil (parity cu Wix — OPEN_QUESTIONS #4). */
  nameShort: 'UP-Burnout',
  canonicalOrigin: 'https://www.upburnout.com',
  /** Ambele pagini sunt `noindex` pe Wix; rămâne așa până la decizia din OPEN_QUESTIONS #2. */
  noindex: true,
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
      'Universității de Vest din Timșoara',
    ],
    links: [
      { label: 'Acasă', href: '/' },
      { label: 'Echipă', href: '/echipă' },
      { label: 'Înscrie-te', href: '/#inscrie-te' },
      { label: 'Formular de contact', href: '/#contact' },
    ],
  },
} as const;
