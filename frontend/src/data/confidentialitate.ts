// Politica de confidențialitate — PROIECT scris la cererea clientului (2026-09-21, OPEN_QUESTIONS #13).
// NU face parte din conținutul original al site-ului Wix. Descrie exact fluxul real de date al acestui site.
// De verificat de coordonatoarea studiului și, ideal, de Responsabilul cu protecția datelor al UVT (gdpr@e-uvt.ro)
// înainte de lansare. Elementele de confirmat sunt marcate în docs/OPEN_QUESTIONS.md #13.

export const confidentialitate = {
  title: 'Politica de confidențialitate',
  updated: '21 septembrie 2026',
  intro:
    'Această pagină explică ce date cu caracter personal colectează site-ul upburnout.com, în ce scop, cine le prelucrează și ce drepturi ai. Ea se referă exclusiv la site și la formularul de contact. Înscrierea în studiu se face pe platforma QuestionPro, pe baza unui consimțământ informat separat, prezentat acolo.',
  sections: [
    {
      heading: 'Cine prelucrează datele',
      paragraphs: [
        'Operatorul de date este Universitatea de Vest din Timișoara (Bd. Vasile Pârvan nr. 4, Timișoara 300223), prin Școala Doctorală de Psihologie — echipa de cercetare a studiului „Protocolul Unificat pentru Burnout”.',
        'Responsabilul cu protecția datelor al universității poate fi contactat la gdpr@e-uvt.ro sau la adresa de mai sus (et. 1, cam. 119).',
      ],
    },
    {
      heading: 'Ce date colectăm și de ce',
      paragraphs: [
        'Prin formularul de contact colectăm doar datele pe care le completezi: nume, prenume, adresă de e-mail, opțional numărul de telefon și mesajul tău. Le folosim pentru un singur scop: să îți răspundem la întrebări despre studiu.',
        'Temeiul prelucrării este consimțământul tău, exprimat prin trimiterea formularului (art. 6 alin. (1) lit. a din Regulamentul (UE) 2016/679). Îl poți retrage oricând, fără a afecta legalitatea prelucrării de până atunci.',
        'Din motive de securitate (protecție împotriva spam-ului și a abuzurilor), furnizorul de găzduire prelucrează temporar adresa IP și date tehnice ale cererii. Site-ul nu le stochează și nu le asociază cu mesajul tău. Temeiul este interesul legitim de a menține site-ul funcțional și sigur (art. 6 alin. (1) lit. f).',
      ],
    },
    {
      heading: 'Cine mai are acces la date',
      paragraphs: [
        'Mesajul tău ajunge, prin e-mail, la echipa de cercetare. Pentru funcționarea site-ului folosim doi furnizori de servicii (persoane împuternicite), care prelucrează datele doar conform instrucțiunilor noastre: Cloudflare, Inc. (găzduirea site-ului și verificarea anti-spam Turnstile) și Resend, Inc. (transmiterea e-mailului, regiune de prelucrare: Uniunea Europeană — Irlanda).',
        'Acești furnizori pot prelucra anumite date și în afara Spațiului Economic European, în baza clauzelor contractuale standard aprobate de Comisia Europeană. Nu vindem, nu închiriem și nu transmitem datele tale către alte persoane sau în scopuri de marketing.',
      ],
    },
    {
      heading: 'Cât timp păstrăm datele',
      paragraphs: [
        'Mesajele trimise prin formular nu sunt stocate pe site sau într-o bază de date; ele există doar în căsuța de e-mail a echipei de cercetare, unde sunt păstrate atât timp cât este necesar pentru a-ți răspunde și cel mult 12 luni de la ultimul schimb de mesaje, după care sunt șterse. Furnizorul de e-mail păstrează jurnale tehnice de transmitere pentru cel mult 30 de zile.',
      ],
    },
    {
      heading: 'Cookie-uri și urmărire',
      paragraphs: [
        'Site-ul nu folosește cookie-uri proprii, instrumente de analiză a traficului sau de publicitate. Singura excepție este verificarea anti-spam Cloudflare Turnstile de pe pagina cu formularul, care poate salva în browser informații strict tehnice, necesare pentru a distinge vizitatorii de programele automate; ele nu sunt folosite pentru a te identifica sau urmări.',
      ],
    },
    {
      heading: 'Drepturile tale',
      paragraphs: [
        'Ai dreptul de acces la datele tale, de rectificare, de ștergere, de restricționare a prelucrării, de portabilitate, de opoziție, precum și dreptul de a-ți retrage consimțământul. Pentru exercitarea lor scrie la gdpr@e-uvt.ro sau la adresa poștală de mai sus. Ai, de asemenea, dreptul de a depune o plângere la Autoritatea Națională de Supraveghere a Prelucrării Datelor cu Caracter Personal (www.dataprotection.ro).',
      ],
    },
    {
      heading: 'Alte informații',
      paragraphs: [
        'Studiul se adresează persoanelor adulte; site-ul nu colectează cu bună știință date de la minori. Această politică poate fi actualizată; versiunea în vigoare este cea publicată pe această pagină, cu data ultimei actualizări indicată mai sus.',
      ],
    },
  ],
  /** Nota afișată sub formular, cu link către această pagină. */
  formNote: 'Datele trimise prin formular sunt folosite doar pentru a-ți răspunde. Detalii în',
  formNoteLink: 'Politica de confidențialitate',
  path: '/confidentialitate',
} as const;
