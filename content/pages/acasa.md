# Pagina „Acasă” — `/`

- URL curent: `https://www.upburnout.com/` (Wix slug intern: `acasă`, servit la rădăcină)
- `<title>`: `Acasă | Protocolul Unificat pentru Burnout`
- Screenshot referință: `../screenshots/acasa-desktop-1440.png`, `../screenshots/acasa-mobile-390.png`
- Înălțime pagină la 1440px: ~4.460px; la 390px (mobil): ~4.590px

---

## 0. Header (comun ambelor pagini)

[[ Desktop: bară albă 85px, `position: sticky` (rămâne lipită sus la scroll). Stânga: numele site-ului ca text-link
către `/`. Dreapta: meniu orizontal cu 2 linkuri. Pagina curentă este afișată într-o nuanță mai deschisă (stare „selected”),
cealaltă în bleumarin. ]]

> VERBATIM (desktop, stânga): `Protocolul Unificat pentru Burnout` → link către `/`
> VERBATIM (meniu): `Acasă` → `/` · `Echipă` → `/echipă`

[[ Mobil: textul din stânga devine **`UP-Burnout`** (alt text decât pe desktop!) + buton hamburger (☰) care deschide
meniul cu aceleași 2 linkuri. Vezi `screenshots/acasa-mobile-390.png`. ]]

---

## 1. Hero

[[ Două coloane: stânga logo + H1 + subtitlu + buton; dreapta ilustrație mare (fată cu plante în păr, tricou portocaliu,
inimă), fundal alb. Ilustrația desktop are ~676×738px afișat. Pe mobil: H1 sus, logo mic, ilustrație, subtitlu, buton. ]]

- Imagine: `assets/original/acasa-01-logo-fpse-uvt.png` — logo UVT + FPSE („Facultatea de Psihologie și Științe ale Educației”), afișat 226×105 desktop / 77×36 mobil, alt Wix = `FPSE-11.png`
- Imagine: `assets/original/acasa-02-hero-ilustratie-femeie-plante.jpg` — afișat 676×738 (crop centrat), alt Wix = `2944_R0lVIEFOTiAzMDEtNjk.jpg`

> VERBATIM H1: `Protocolul Unificat pentru Burnout`
> VERBATIM subtitlu: `Explorează o nouă abordare care te poate ajuta să faci față burnoutului. Un pas pentru tine, un pas pentru cercetare.`
> VERBATIM buton (pill bleumarin, text alb): `Înscrie-te acum!` → ancoră internă către secțiunea 6 „Înscrie-te acum!” (aceeași pagină)

---

## 2. Despre această terapie

[[ Două coloane: stânga H2 + 2 paragrafe; dreapta ilustrație (grup de 5 persoane pe scaune, terapie de grup), 567×285. ]]

- Imagine: `assets/original/acasa-03-despre-terapie-grup.jpg` — afișat 567×285, alt Wix = `vecteezy_group-therapy-meeting-with-psychologist_13758405.jpg`

> VERBATIM H2: `Despre această terapie`
>
> VERBATIM p1: `Imaginează-ți că te trezești într-o dimineață de luni deja epuizat. Te forțezi să mergi la muncă, cu mintea încețoșată, încercând să-ți amintești de ce ai ales acest job. Simți furie, frustrare sau poate tristețe, fără să știi exact de ce. Observi că reacționezi în moduri care nu îți sunt caracteristice. În timpul zilei, anxietatea crește, iar un sentiment discret de apăsare începe să se instaleze. Pentru a face față, începi să te retragi din munca care, la un moment dat, avea sens.`
>
> VERBATIM p2: `Mulți oameni recunosc acest tipar—iar pentru unii, așa începe burnoutul.`

[[ Notă: „tipar—iar” are em dash fără spații în original. ]]

---

## 3. Abordarea noastră + slideshow cu cele 8 ședințe

[[ H2 stânga, paragraf intro centrat-dreapta, apoi un **slideshow** (card gri deschis #F3F3F3, cu umbră, ~830×290,
săgeți „Previous”/„Next” în stânga/dreapta, 8 buline de navigare jos). Un singur slide vizibil; slide-urile 2–8
NU există în HTML până nu navighezi — au fost extrase prin click real. Fiecare slide = titlu + listă cu buline sau paragraf. ]]

> VERBATIM H2: `Abordarea noastră`
>
> VERBATIM intro: `Pe parcursul a opt ședințe de terapie de grup, vei explora abilități care te pot ajuta să faci față burnoutului și vei putea împărtăși experiențe cu alți oameni care se confruntă cu situații similare.`

### Slide 1
> VERBATIM titlu: `1. Ce este burnoutul? Care sunt valorile tale?`
> VERBATIM listă:
> `• Ce este burnoutul?`
> `• Care sunt factorii declanșatori ai burnoutului?`
> `• Ce este valoros pentru tine?`

### Slide 2
> VERBATIM titlu: `2. Înțelegerea emoțiilor`
> VERBATIM listă:
> `• Care este natura adaptativă a emoțiilor?`
> `• Cum devin emoțiile dezadaptative?`
> `• Ce se întâmplă în minte, comportament și corp atunci când simțim o emoție?`

### Slide 3
> VERBATIM titlu (2 rânduri în original): `3. Observarea conștientă a emoțiilor &` / `Înțelegerea senzațiilor fizice`
> VERBATIM listă:
> `• Cum putem fi ancorați în prezent atunci când emoțiile sunt copleșitoare?`
> `• Cum putem contracara senzațiile fizice într-un mod conștient?`

### Slide 4
> VERBATIM titlu: `4. Flexibilitate cognitivă`
> VERBATIM listă:
> `• Cum influențează gândurile experiențele noastre?`
> `• Cum experiențele noastre modelează ceea ce gândim?`
> `• Cum putem fi mai flexibili în gândire raportat la trăirile noastre?`

### Slide 5
> VERBATIM titlu: `5. Contracararea comportamentelor emoționale`
> VERBATIM listă:
> `• Cum identificăm comportamentele emoționale atunci când experimentăm o emoție puternică?`
> `• Care ar fi un comportament alternativ acelui care este în detrimentul tău?`

### Slide 6
> VERBATIM titlu: `6. Sprijinirea funcțiilor cognitive`
> VERBATIM listă:
> `• Ce putem face pentru a sprijini funcțiile cognitive?`
> `• Cum ne planificăm ziua astfel încât să avem și momente de respiro?`

### Slide 7
> VERBATIM titlu: `7. Expuneri la emoții`
> VERBATIM paragraf: `Toate abilitățile pe care le-am învățat anterior vor fi reunite în cadrul acestei întâlniri în care vom încerca să le aplicăm concomitent, ceea ce va duce la o bună integrare a lor.`

### Slide 8
> VERBATIM titlu: `8. Recunoașterea meritelor și planuri pentru viitor`
> VERBATIM paragraf: `Ultima sesiune va avea scopul de a trece în revistă mesajul programului pe care tocmai l-ai urmat, să reflectăm asupra progresului, dar și să dezvoltăm un plan pentru a practica în continuare abilitățile pe care le-ai învățat.`

---

## 4. Scopul cercetării

[[ Două coloane: stânga H3 + 3 paragrafe (în original există și rânduri goale cu caracter invizibil U+200B între paragrafe);
dreapta ilustrație (persoană cu binoclu pe podium de blocuri, steag portocaliu) 470×470 + sub ea butonul lavandă. ]]

- Imagine: `assets/original/acasa-04-scopul-cercetarii-ilustratie.jpg` — afișat 470×470, alt Wix = *(gol)*

> VERBATIM H3: `Scopul cercetării`
>
> VERBATIM p1: `În cadrul acestei cercetări dorim să evaluăm cât de ușor poate fi utilizată și cât de bine este primită este abordarea pe care o propunem. Aceasta a fost creată cu sprijinul specialiștilor în psihologie, al profesioniștilor din mediul organizațional, precum și al persoanelor care se confruntă sau care au trecut prin burnout, pentru a răspunde cât mai bine nevoilor reale ale participanților.`
>
> VERBATIM p2: `Înainte ca o intervenție să fie utilizată pe scară largă, este important să verificăm dacă funcționează bine în practică și dacă este acceptată de cei care urmează acest program. Testarea fezabilității ne arată dacă intervenția este ușor de utilizat, dacă poate fi implementată în mod realist și dacă participanții pot parcurge conținutul fără dificultăți. Acceptabilitatea ne ajută să înțelegem dacă intervenția este percepută ca fiind utilă, relevantă și potrivită nevoilor.`
>
> VERBATIM p3: `Aceste etape ne permit să îmbunătățim intervenția și să ne asigurăm că oferă o experiență valoroasă și benefică pentru cei care o urmează.`
>
> VERBATIM buton (lavandă #A2A3E9, text alb, colțuri 20px): `Descoperă echipa proiectului` → `/echipă` (cu ancoră Wix `anchors-mkjwriqz` — probabil secțiunea „Echipa de cercetare”; de confirmat la implementare)

[[ Typo în original, p1: „cât de bine este primită **este** abordarea” (dublu „este”). Vezi OPEN_QUESTIONS. ]]

---

## 5. Ce presupune participarea ta?

[[ H2 centrat. Sub el: stânga ilustrație (cap/profil cu creier roz, pești), 339×339; dreapta lista 1–5 pe două coloane
(1–3 în prima, 4–5 în a doua). Numerele „1.”–„5.” sunt **bold**, restul textului normal. Secțiunea are un strat alb
semitransparent (rgba(255,255,255,0.5)) peste fundal. ]]

- Imagine: `assets/original/acasa-05-participare-ilustratie-cap-creier.jpg` — afișat 339×339, alt Wix = `2944_R0lVIEFOTiAzMDEtNjg.jpg`

> VERBATIM H2: `Ce presupune participarea ta?`
>
> VERBATIM 1: `1. Parcurgerea și acceptarea consimțământului informat.`
> VERBATIM 2: `2. Participarea la o discuție (online, 50 de minute) cu unul dintre membrii echipei de cercetare.`
> VERBATIM 3: `3. Participarea la cele opt ședințe de terapie (2 ore/ ședință) care vor fi organizate în cadrul Universtății de Vest din Timișoara.`
> VERBATIM 4: `4. Participarea voluntară la un focus grup în cadrul căruia vom reflecta asupra modului în care procesul terapeutic a fost util.`
> VERBATIM 5: `5. La o lună de la finalizarea ședințelor, vei fi rugat să completezi o serie de întrebări pentru a verifica dacă programul pe care l-ai urmat are efecte pozitive pe termen lung.`

[[ Typo în original, punctul 3: „Universtății” (lipsește „i”). Punctul 5 are în original un line-break forțat după
„întrebări” — presupus accidental, se redă ca o singură propoziție. Vezi OPEN_QUESTIONS. ]]

---

## 6. Înscrie-te acum!  (ținta ancorei „Înscrie-te acum!” din hero și „Înscrie-te” din footer)

[[ H2 centrat, bold. Sub el două coloane: stânga text (prima propoziție *italic*) + buton „Contactează-ne”;
dreapta imaginea QR (256×256, conține și textul „Powered By QuestionPro” în interiorul PNG-ului) + buton „Înscrie-te”.
Pe mobil: H2, QR, buton Înscrie-te, apoi textul și butonul Contactează-ne. ]]

- Imagine: `assets/original/acasa-06-qr-questionpro.png` — 256×256, alt Wix = `image.png`; codul QR duce (presupus) la același link QuestionPro

> VERBATIM H2: `Înscrie-te acum!`
>
> VERBATIM p (italic): `Ne dorim să fie totul clar pentru tine!`
> VERBATIM p: `Înainte să te înscrii, citește cu atenție informațiile din formular. Dacă ai întrebări sau vrei mai multe detalii, ne poți scrie oricând prin formularul de contact de mai jos.`
>
> VERBATIM buton (pill bleumarin): `Contactează-ne` → ancoră internă către secțiunea 7 „Formular de contact”
> VERBATIM buton (pill bleumarin): `Înscrie-te` → `https://e-uvt.questionpro.com/up-burnout` (se deschide în tab nou, `rel="noreferrer noopener"`)

---

## 7. Formular de contact  (ținta ancorei „Contactează-ne” și „Formular de contact” din footer)

[[ H2 centrat. Formular Wix Forms, lățime ~500px centrat: Nume și Prenume pe același rând, apoi Email, Telefon, textarea,
buton „Trimite” (pill bleumarin, text alb, Fahkwang 16px). Câmpurile au doar linie de subliniere (fără chenar), fundal transparent,
fără placeholder. Etichetele au „*” la câmpurile obligatorii. ]]

> VERBATIM H2: `Formular de contact`
>
> Câmpuri (etichetă verbatim · tip · obligatoriu):
> - `Nume` · text · **da**
> - `Prenume` · text · **da**
> - `Email` · email · **da**
> - `Telefon` · telefon · nu
> - `Cum te putem ajuta?` · textarea · nu
>
> VERBATIM buton: `Trimite`

[[ Mesajul de succes / eroare de după trimitere NU este în HTML (Wix îl încarcă la submit) — trebuie citit din
panoul Wix (Forms → formularul → setări → „Success message”) sau obținut printr-un test real. Vezi OPEN_QUESTIONS.
Unde ajung mesajele acum (Wix Inbox + notificare e-mail către cine?) — de verificat tot în panoul Wix. ]]

---

## 8. Footer (comun ambelor pagini)

[[ Bandă bleumarin #06103C, text alb, ~230px. Stânga: titlu bold + 3 rânduri (line-break-uri forțate în original).
Dreapta: 4 linkuri (subliniate în screenshot). Jos, centrat, credit ilustrații cu font 10px. ]]

> VERBATIM (bold, 19px): `Protocolul Unificat pentru Burnout`
> VERBATIM (3 rânduri, 15px):
> `Studiu desfășurat prin intermediul`
> `Școlii Doctorale de Psihologie a`
> `Universității de Vest din Timșoara`
>
> VERBATIM linkuri (19px): `Acasă` → sus pe pagina curentă (Wix „scroll to top”; pe Echipă duce tot la /echipă) · `Echipă` → `/echipă` · `Înscrie-te` → ancora secțiunii 6 de pe Acasă · `Formular de contact` → ancora secțiunii 7 de pe Acasă
>
> VERBATIM credit (10px): `Ilustrații` + link `Vecteezy` → `http://www.vecteezy.com`

[[ Typo în original: „Timșoara” (lipsește „i”) — apare în footer pe ambele pagini. Vezi OPEN_QUESTIONS. ]]

---

## Lucruri care NU există pe pagină (confirmat)
- Nicio adresă de e-mail, telefon sau link social vizibil.
- Niciun banner de cookie-uri, nicio politică de confidențialitate / termeni.
- Niciun blog, magazin, programări, login, chat, pop-up.
- Niciun script de analytics / pixel (Google Analytics, GTM, Meta Pixel — nimic).
- Favicon: cel implicit Wix (`pfavico.ico`), nu unul personalizat.
