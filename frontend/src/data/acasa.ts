// Conținutul paginii Acasă — transcris VERBATIM din content/pages/acasa.md (2026-09-20).
// Orice modificare de text cere aprobarea clientului (docs/OPEN_QUESTIONS.md #3).

export const hero = {
  title: 'Protocolul Unificat pentru Burnout',
  subtitle:
    'Explorează o nouă abordare care te poate ajuta să faci față burnoutului. Un pas pentru tine, un pas pentru cercetare.',
  cta: 'Înscrie-te acum!',
  ctaHref: '#inscrie-te',
  logoAlt:
    'Universitatea de Vest din Timișoara — Facultatea de Psihologie și Științe ale Educației',
} as const;

export const despre = {
  title: 'Despre această terapie',
  paragraphs: [
    'Imaginează-ți că te trezești într-o dimineață de luni deja epuizat. Te forțezi să mergi la muncă, cu mintea încețoșată, încercând să-ți amintești de ce ai ales acest job. Simți furie, frustrare sau poate tristețe, fără să știi exact de ce. Observi că reacționezi în moduri care nu îți sunt caracteristice. În timpul zilei, anxietatea crește, iar un sentiment discret de apăsare începe să se instaleze. Pentru a face față, începi să te retragi din munca care, la un moment dat, avea sens.',
    'Mulți oameni recunosc acest tipar—iar pentru unii, așa începe burnoutul.',
  ],
} as const;

export type Sedinta = {
  title: string;
  /** rândul 2 al titlului, dacă există în original */
  titleLine2?: string;
  bullets?: readonly string[];
  paragraph?: string;
};

export const abordare = {
  title: 'Abordarea noastră',
  intro:
    'Pe parcursul a opt ședințe de terapie de grup, vei explora abilități care te pot ajuta să faci față burnoutului și vei putea împărtăși experiențe cu alți oameni care se confruntă cu situații similare.',
  sedinte: [
    {
      title: '1. Ce este burnoutul? Care sunt valorile tale?',
      bullets: [
        'Ce este burnoutul?',
        'Care sunt factorii declanșatori ai burnoutului?',
        'Ce este valoros pentru tine?',
      ],
    },
    {
      title: '2. Înțelegerea emoțiilor',
      bullets: [
        'Care este natura adaptativă a emoțiilor?',
        'Cum devin emoțiile dezadaptative?',
        'Ce se întâmplă în minte, comportament și corp atunci când simțim o emoție?',
      ],
    },
    {
      title: '3. Observarea conștientă a emoțiilor &',
      titleLine2: 'Înțelegerea senzațiilor fizice',
      bullets: [
        'Cum putem fi ancorați în prezent atunci când emoțiile sunt copleșitoare?',
        'Cum putem contracara senzațiile fizice într-un mod conștient?',
      ],
    },
    {
      title: '4. Flexibilitate cognitivă',
      bullets: [
        'Cum influențează gândurile experiențele noastre?',
        'Cum experiențele noastre modelează ceea ce gândim?',
        'Cum putem fi mai flexibili în gândire raportat la trăirile noastre?',
      ],
    },
    {
      title: '5. Contracararea comportamentelor emoționale',
      bullets: [
        'Cum identificăm comportamentele emoționale atunci când experimentăm o emoție puternică?',
        'Care ar fi un comportament alternativ acelui care este în detrimentul tău?',
      ],
    },
    {
      title: '6. Sprijinirea funcțiilor cognitive',
      bullets: [
        'Ce putem face pentru a sprijini funcțiile cognitive?',
        'Cum ne planificăm ziua astfel încât să avem și momente de respiro?',
      ],
    },
    {
      title: '7. Expuneri la emoții',
      paragraph:
        'Toate abilitățile pe care le-am învățat anterior vor fi reunite în cadrul acestei întâlniri în care vom încerca să le aplicăm concomitent, ceea ce va duce la o bună integrare a lor.',
    },
    {
      title: '8. Recunoașterea meritelor și planuri pentru viitor',
      paragraph:
        'Ultima sesiune va avea scopul de a trece în revistă mesajul programului pe care tocmai l-ai urmat, să reflectăm asupra progresului, dar și să dezvoltăm un plan pentru a practica în continuare abilitățile pe care le-ai învățat.',
    },
  ] satisfies readonly Sedinta[],
} as const;

export const scop = {
  title: 'Scopul cercetării',
  paragraphs: [
    'În cadrul acestei cercetări dorim să evaluăm cât de ușor poate fi utilizată și cât de bine este primită este abordarea pe care o propunem. Aceasta a fost creată cu sprijinul specialiștilor în psihologie, al profesioniștilor din mediul organizațional, precum și al persoanelor care se confruntă sau care au trecut prin burnout, pentru a răspunde cât mai bine nevoilor reale ale participanților.',
    'Înainte ca o intervenție să fie utilizată pe scară largă, este important să verificăm dacă funcționează bine în practică și dacă este acceptată de cei care urmează acest program. Testarea fezabilității ne arată dacă intervenția este ușor de utilizat, dacă poate fi implementată în mod realist și dacă participanții pot parcurge conținutul fără dificultăți. Acceptabilitatea ne ajută să înțelegem dacă intervenția este percepută ca fiind utilă, relevantă și potrivită nevoilor.',
    'Aceste etape ne permit să îmbunătățim intervenția și să ne asigurăm că oferă o experiență valoroasă și benefică pentru cei care o urmează.',
  ],
  cta: 'Descoperă echipa proiectului',
  ctaHref: '/echipă#echipa-de-cercetare',
} as const;

export const participare = {
  title: 'Ce presupune participarea ta?',
  /** Numerele „1.”–„5.” sunt bold în original; se randează ca marcaje numerotate. */
  steps: [
    'Parcurgerea și acceptarea consimțământului informat.',
    'Participarea la o discuție (online, 50 de minute) cu unul dintre membrii echipei de cercetare.',
    'Participarea la cele opt ședințe de terapie (2 ore/ ședință) care vor fi organizate în cadrul Universtății de Vest din Timișoara.',
    'Participarea voluntară la un focus grup în cadrul căruia vom reflecta asupra modului în care procesul terapeutic a fost util.',
    'La o lună de la finalizarea ședințelor, vei fi rugat să completezi o serie de întrebări pentru a verifica dacă programul pe care l-ai urmat are efecte pozitive pe termen lung.',
  ],
} as const;

export const inscriere = {
  id: 'inscrie-te',
  title: 'Înscrie-te acum!',
  lineItalic: 'Ne dorim să fie totul clar pentru tine!',
  paragraph:
    'Înainte să te înscrii, citește cu atenție informațiile din formular. Dacă ai întrebări sau vrei mai multe detalii, ne poți scrie oricând prin formularul de contact de mai jos.',
  ctaContact: 'Contactează-ne',
  ctaContactHref: '#contact',
  ctaInscriere: 'Înscrie-te',
  ctaInscriereHref: 'https://e-uvt.questionpro.com/up-burnout',
  qrAlt: 'Cod QR pentru formularul de înscriere QuestionPro',
} as const;

export const contact = {
  id: 'contact',
  title: 'Formular de contact',
  fields: {
    nume: 'Nume',
    prenume: 'Prenume',
    email: 'Email',
    telefon: 'Telefon',
    mesaj: 'Cum te putem ajuta?',
  },
  submit: 'Trimite',
} as const;
