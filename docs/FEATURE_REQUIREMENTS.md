# FEATURE_REQUIREMENTS.md

Legendă: **[P]** = parity, există identic pe site-ul actual și se reproduce; **[N]** = nou, cerut de standardul
„premium / rapid / accesibil” din prompt, invizibil pentru conținut; **[?]** = depinde de un răspuns din `OPEN_QUESTIONS.md`.

## 1. Cerințe funcționale

### 1.1 Pagini și URL-uri
- [P] `/` — Acasă, conținut exact din `content/pages/acasa.md`.
- [P] `/echipă` — Echipă, conținut exact din `content/pages/echipa.md`. URL-ul cu diacritic **trebuie să funcționeze**.
- [?] `/echipa` (fără diacritic) ca alias 301 către forma canonică aleasă (OPEN_QUESTIONS #12).
- [N] Pagină 404 minimală în același design (Wix are una implicită; nu e conținut).
- [N] `robots.txt`, `sitemap-index.xml` — site indexabil (decizie #2, 2026-09-21).

### 1.2 Header și navigare
- [P] Header sticky, alb; stânga: „Protocolul Unificat pentru Burnout” → `/`; dreapta: „Acasă”, „Echipă”.
- [P] Marcarea paginii curente în meniu (vizual).
- [P] Mobil: text „UP-Burnout” + hamburger care deschide meniul cu cele 2 linkuri (OPEN_QUESTIONS #4 dacă se unifică textul).
- [N] Meniul mobil accesibil: `aria-expanded`, închidere cu Esc, focus trap nu e necesar (2 linkuri), navigabil din tastatură.
- [N] Skip-link „Sari la conținut” (Wix îl are ca „Skip to Main Content”, în engleză; noi îl punem în română — text nevizibil decât la focus).

### 1.3 Secțiunile paginii Acasă (ordinea fixă)
1. [P] Hero: logo UVT/FPSE, H1, subtitlu, buton „Înscrie-te acum!” (ancoră la §6), ilustrație.
2. [P] Despre această terapie: H2, 2 paragrafe, ilustrație.
3. [P] Abordarea noastră: H2, intro, cele **8 ședințe** (titlu + listă/paragraf) — pe Wix erau un slideshow cu un slide vizibil; **implementat ca grilă de carduri numerotate, toate vizibile** (decizie de design #25, 2026-09-20; textele identice). Fără JS, fără autoplay, accesibil (listă ordonată, numere prin CSS + text sr-only).
4. [P] Scopul cercetării: H3, 3 paragrafe, ilustrație, buton „Descoperă echipa proiectului” → `/echipă` (secțiunea „Echipa de cercetare”).
5. [P] Ce presupune participarea ta?: H2, ilustrație, lista 1–5 (numere bold), pe 2 coloane la desktop.
6. [P] Înscrie-te acum!: H2 (bold), text (prima propoziție italic), buton „Contactează-ne” (ancoră la §7), imagine QR, buton „Înscrie-te” → QuestionPro în tab nou (`rel="noopener noreferrer"`).
7. [P] Formular de contact: H2 + formular (vezi 1.5).
8. [P] Footer (vezi 1.4).

### 1.4 Footer (ambele pagini)
- [P] Titlu bold, cele 3 rânduri despre UVT (păstrate ca 3 rânduri), linkuri: Acasă, Echipă, Înscrie-te (ancoră §6 de pe Acasă), Formular de contact (ancoră §7 de pe Acasă), credit „Ilustrații Vecteezy” cu link.
- [?] „Acasă” din footer → `/` (pe Wix face doar scroll sus pe pagina curentă; OPEN_QUESTIONS #5).

### 1.5 Formular de contact
- [P] Câmpuri și etichete exacte: `Nume*` (text, obligatoriu), `Prenume*` (text, obligatoriu), `Email*` (email, obligatoriu), `Telefon` (opțional), `Cum te putem ajuta?` (textarea, opțional). Buton `Trimite`.
- [P] Aspect: câmpuri cu linie de subliniere, fără placeholder, Nume/Prenume pe același rând la desktop.
- [N] Validare client + server (câmpuri obligatorii, format e-mail, lungimi maxime), mesaje de eroare în română lângă câmp, `aria-describedby`, `aria-invalid`.
- [N] Trimitere fără reîncărcarea paginii; stări: „Se trimite…”, succes, eroare cu posibilitate de reîncercare.
- [?] Textul de succes/eroare: cel din Wix dacă există (OPEN_QUESTIONS #6), altfel propunerea din `API_DESIGN.md` §5.
- [N] Livrare prin e-mail la adresa configurată (`CONTACT_TO_EMAIL`), cu `Reply-To` = e-mailul expeditorului, subiect clar, conținut escapat.
- [N] Anti-spam: honeypot + timp minim de completare + Cloudflare Turnstile (invizibil în mod normal) + rate limiting. Fără CAPTCHA vizibil cu puzzle.
- [P] Fără stocare a mesajelor (nu există CRM/DB). [?] BCC de siguranță către o a doua adresă (OPEN_QUESTIONS #7).
- [?] Checkbox de consimțământ GDPR — nu există pe Wix; decizie legală amânată (OPEN_QUESTIONS #13). Formularul trebuie construit astfel încât adăugarea lui să fie trivială.

### 1.6 Linkuri externe
- [P] `https://e-uvt.questionpro.com/up-burnout` — buton „Înscrie-te” (tab nou).
- [P] `http://www.vecteezy.com` — credit footer. [N] Se poate servi ca `https://www.vecteezy.com` (același site; evită mixed-content warnings) — modificare tehnică, nu de conținut.
- [P] Imaginea QR rămâne exact fișierul actual (nu regenerăm QR-ul).

## 2. Cerințe de conținut (fidelitate)

- Textele se preiau **doar** din `content/pages/*.md`, blocurile `VERBATIM`. Diacriticele corecte (ș/ț cu virgulă, U+0219/U+021B) se păstrează exact cum sunt în original.
- Typo-urile din original (listate în OPEN_QUESTIONS #3) se reproduc **verbatim** până la aprobarea corectării.
- Imagini **fixe** (sunt conținut): logo-ul UVT/FPSE, cele 10 portrete ale echipei, codul QR — aceleași fișiere din `content/assets/original/`, doar optimizate (format/dimensiune); portretele pot primi tratament de design (rotunjire, raport de aspect), nu filtre care schimbă persoana.
- Imagini **înlocuibile** (sunt design, clarificat de client 2026-09-20): cele 5 ilustrații Vecteezy — pot fi înlocuite/eliminate (OPEN_QUESTIONS #22); dacă dispar toate, creditul „Ilustrații Vecteezy” din footer se scoate cu acordul sorei (#23).
- [N] Text alternativ real pentru imagini (Wix are nume de fișiere ca alt). Propunerile sunt în OPEN_QUESTIONS #9; alt-ul nu este vizibil, dar e „conținut” pentru cititoare de ecran → cere aprobare.
- Ordinea secțiunilor, ordinea membrilor echipei, gruparea 7 + 3, rândul „Asistent cercetare voluntar” — identice.
- Criteriu de acceptare (Sesiunea 6): un script extrage tot textul vizibil din build-ul final și îl compară cu lista de blocuri VERBATIM; 0 diferențe (în afara celor aprobate explicit).

## 3. Cerințe nefuncționale

| Domeniu | Țintă | Verificare |
|---|---|---|
| Performanță | Lighthouse mobil ≥ 95 la toate cele 4 categorii; LCP < 1,5 s pe 4G; CLS < 0,05; JS total < 30 KB gzip (doar slideshow, meniu, formular, Turnstile) | Lighthouse + WebPageTest în Sesiunea 4 |
| Imagini | AVIF/WebP + fallback, `srcset` pe DPR/lățime, `loading="lazy"` sub fold, dimensiuni explicite (fără CLS); niciun original > 400 KB servit | audit build |
| Fonturi | Plus Jakarta Sans (titluri) + Inter (text), self-hostate via @fontsource, subset latin + latin-ext, `font-display: swap` (design nou, aprobat) | audit network |
| Accesibilitate | WCAG 2.2 AA: contrast ≥ 4,5:1, focus vizibil, H1 unic pe pagină (#20), formular etichetat cu erori `aria-describedby`, meniu mobil cu `aria-expanded` + Esc, `prefers-reduced-motion` — **axe 0 violări, Lighthouse 100 (S4)** | axe + Playwright (S6) |
| SEO tehnic | `lang="ro"`, title-uri păstrate, canonical `www`, OG/Twitter + `og:image`, description din text existent, sitemap, robots; indexabil (decizie #2); preview-urile `noindex` prin header | Lighthouse SEO 100 (S4, local fără header) + Rich Results după cut-over |
| Responsive | 320 → 1920 px fără scroll orizontal; layout mobil ≤ 750 px (aliniat cu breakpoint-ul Wix), tabletă, desktop | test la 320/390/768/1024/1440 |
| Browsere | ultimele 2 versiuni Chrome/Edge/Firefox/Safari + iOS Safari; fără JS: conținutul complet vizibil, slide 1 vizibil, formularul afișează mesaj „activează JavaScript pentru trimitere” | test manual |
| Securitate | headere CSP/HSTS/etc., validare server, secrete în env, vezi `SECURITY_PLAN.md` | curl + teste |
| Confidențialitate | zero cookie-uri proprii, zero tracking (parity), fonturi self-hostate (nu Google Fonts CDN); Turnstile este singurul serviciu terț încărcat, doar pe pagina cu formular | audit network |
| Disponibilitate | Cloudflare Pages (CDN global); formularul degradează elegant dacă e-mailul pică (mesaj clar, nu pierdere silențioasă) | test simulat |
| Cost | 0 €/lună la volumul așteptat (Pages free, Turnstile free, Resend free 3.000 e-mailuri/lună) | — |

## 4. Explicit în afara scopului

- CRM, panou admin, stocare lead-uri, autentificare, roluri (decizie client).
- Blog (Wix Blog e instalat pe site, dar nu există nicio pagină/articol public — nu se migrează nimic).
- Multilingv, newsletter, chat, programări, plăți.
- Rescrierea/„îmbunătățirea” textelor, adăugarea de secțiuni (ex. FAQ, testimoniale).
- Regenerarea codului QR, schimbarea linkului QuestionPro.
- Politica de confidențialitate: **textul** nu se scrie de noi fără aviz legal; doar pregătim locul (OPEN_QUESTIONS #13).
- Analytics (parity = niciun analytics; OPEN_QUESTIONS #14 dacă se dorește Cloudflare Web Analytics, fără cookie-uri).
