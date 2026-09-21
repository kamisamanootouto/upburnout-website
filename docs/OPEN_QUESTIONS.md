# OPEN_QUESTIONS.md

Fiecare întrebare are o **recomandare** și un **comportament implicit** (ce facem dacă nu primim răspuns) — implicitul
este întotdeauna varianta care păstrează site-ul identic. Întrebările marcate 🔴 blochează începerea Sesiunii 2.

## Arhitectură

**#1 ✅ RĂSPUNS (2026-09-20): Cloudflare Pages Functions.** (repo creat de client; push + conectare Pages: vezi raportul S2) Abatere aprobată de la „Backend: Render” din template.
(Recomandarea inițială: același deploy, 0 cold start, 0 cost, fără CORS; Render free tier adoarme → 30–60 s la prima trimitere.)

**#15 ✅ RĂSPUNS (2026-09-20): repo privat pe contul personal GitHub `kamisamanootouto`.** Contul Cloudflare: presupus cel
al clientului (folosit la BacAI) — se confirmă la crearea proiectului Pages în Sesiunea 2.

## Conținut și fidelitate

**#3 ✅ RĂSPUNS (2026-09-21): se corectează.** Aplicate în `src/data/*` și înregistrate în `content/approved-deviations.json` (cu textul corectat, verificat automat). Găsite 5:
1. „…cât de bine este primită **este** abordarea…” (Scopul cercetării, p1 — „este” dublat)
2. „…în cadrul **Universtății** de Vest…” (Ce presupune participarea ta?, punctul 3 — lipsește „i”)
3. „…Universității de Vest din **Timșoara**” (footer, ambele pagini — lipsește „i”)
4. „…beneficiază de supervizare pe parcursul derulării acesteia**,**” (Echipă, Despre noi, p3 — virgulă în loc de punct)
5. Punctul 5 din „Ce presupune…” are un rând rupt la mijlocul propoziției (după „întrebări”) — presupus accidental.
Recomandare: corectăm toate 5 (sunt evident neintenționate). Implicit: **verbatim, cu typo-uri**, până spune sora „da”.

**#4 Header pe mobil: pe Wix textul din stânga e „UP-Burnout”, pe desktop „Protocolul Unificat pentru Burnout”. Păstrăm diferența sau unificăm?**
Recomandare: păstrăm „UP-Burnout” pe mobil (încape, e intenționat). Implicit: păstrăm diferența (parity).

**#5 Linkul „Acasă” din footer: pe Wix doar derulează sus pe pagina curentă (pe Echipă nu duce la Acasă). Îl facem link real către `/`?**
Recomandare: da (e clar un bug de configurare, nu conținut). Implicit: link către `/`, marcat ca abatere aprobată tacit — spune-ne dacă nu.

**#6 Textul de succes/eroare al formularului de pe Wix.** Nu e în HTML. Te rog: Wix → site → Forms & Submissions (sau
editor → formular → Settings → „Submit message”) → screenshot cu mesajul de succes (și eventual eroare). Implicit: propunerile din `API_DESIGN.md` §5.

**#7 Destinatarul mesajelor** — client (2026-09-21): „vedem mai târziu”; până atunci Yahoo-ul clientului (contul Resend). Rămâne deschis pentru Sesiunea 7. Text inițial: Confirmat: inițial `gandilabogdan10@gmail.com` (teste). (a) Care va fi adresa finală (a sorei? o adresă `@e-uvt.ro`?) (b) Vrei o copie BCC de siguranță pe o a doua adresă? (c) Unde ajung acum mesajele din Wix — Wix Inbox + notificare pe ce e-mail? (screenshot din Wix → Inbox / Forms).
Implicit: doar adresa ta, fără BCC.

**#9 Text alternativ (alt) pentru imagini** — Wix are nume de fișiere (`image.png`, `FPSE-11.png`). Propunere (nevizibil, doar pentru cititoare de ecran/SEO):
- logo → „Universitatea de Vest din Timișoara — Facultatea de Psihologie și Științe ale Educației”
- ilustrațiile (4 + bec/puzzle) → alt gol (`alt=""`, decorative) — sunt ilustrații fără informație suplimentară
- QR → „Cod QR pentru formularul de înscriere QuestionPro”
- portrete → numele persoanei (ex. „Drd. Athena Gândilă”)
Implicit: exact propunerea de mai sus. *Actualizare S4 (2026-09-21): portretele au `alt=""` — numele e deja scris sub fotografie și cititoarele de ecran îl citeau de două ori (axe: image-redundant-alt).*

**#12 URL-ul paginii Echipă: păstrăm `/echipă` (cu diacritic; în linkuri apare ca `/echip%C4%83`) sau facem `/echipa` canonic cu redirect 301 de la `/echipă`?**
Recomandare: `/echipa` canonic + 301 de la `/echipă` (ambele funcționează; cel fără diacritic e mai curat în WhatsApp/e-mail).
Implicit: `/echipă` rămâne canonic, `/echipa` alias 301 → `/echipă` (parity maximă).

**#16 Fotografia Prof. Dr. Shannon Sauer-Zavala are doar 480×474 px** (pe Wix e mărită și decupată → ușor neclară). Există o poză mai mare? Opțional. Implicit: folosim ce există.

**#20 Pagina Echipă nu are H1** (începe cu H2 „Despre noi”). Pentru accesibilitate/SEO ar trebui un H1. Variante: (a) „Despre noi” devine H1 (vizual identic), (b) H1 invizibil „Echipă”. Implicit: (a) — nu schimbă niciun text vizibil.

## SEO și vizibilitate

**#2 ✅ RĂSPUNS (2026-09-21): DA, site-ul trebuie să fie găsit în Google** → se indexează (Sesiunea 4). Regula clientului: **niciun text nou** — meta description-urile se compun exclusiv din propoziții existente pe site (Acasă: subtitlul din hero; Echipă: prima propoziție din „Despre noi”). Text inițial: Dacă recrutarea
se face doar prin canale directe (flyere, e-mailuri, QR), rămâne ascuns. Dacă vreți să fie găsit („burnout Timișoara”, „terapie de grup burnout”), îl indexăm.
Implicit: **rămâne `noindex`** (parity).

**#11 ✅ REZOLVAT (2026-09-21) fără text nou:** (a) meta description Acasă = subtitlul din hero („Explorează o nouă abordare…”, 132 caractere); Echipă = prima propoziție din „Despre noi” (Google o va trunchia vizual la ~155 caractere, textul rămâne cel original). (b) Imagine de partajare `/og-image.jpg` (1200×630): logo UVT/FPSE + titlul + subtitlul existent + ilustrația hero — niciun cuvânt nou.

**#10 Favicon.** Wix folosește iconița implicită Wix (nu există favicon propriu). Propunere: logo-ul UVT/FPSE simplificat sau un monogram „UP” în bleumarin. Este singurul element vizual nou — cere aprobare. Implicit: monogram „UP” bleumarin pe alb.

**#14 Analytics.** Site-ul nu are niciun analytics acum. Dacă vreți să știți câți oameni ajung pe site și câți apasă „Înscrie-te”: Cloudflare Web Analytics (gratuit, fără cookie-uri, fără banner). Implicit: **fără analytics** (parity).

## Legal / confidențialitate

**#13 Politica de confidențialitate + consimțământ la formular** — amânat din nou de client (2026-09-21: „mai târziu vedem noi”). Site-ul Wix actual nu are nici el una, deci lansarea fără ea este *parity*, nu regres; riscul legal rămâne al proiectului de cercetare, nu al site-ului. Text inițial: amânat de client („vedem când ajungem acolo”).
Notăm ca **blocker înainte de lansare (Sesiunea 7)**: formularul colectează date personale pentru un studiu academic;
comisia de etică a UVT are foarte probabil un model de notă de informare. Nu scriem noi textul fără aviz. Implicit: pregătim locul (link sub formular + checkbox opțional, ascunse până există textul).

**#17 Licența ilustrațiilor Vecteezy** — creditul „Ilustrații Vecteezy” din footer sugerează licența gratuită (cere atribuire). Se păstrează creditul indiferent; dacă sora are licență Pro, tot îl păstrăm (e conținut). Doar informativ.

## Domeniu, Wix, operațional

**#18 Confirmare plan domeniu:** rămâne la Wix, schimbăm nameserverele către Cloudflare la Sesiunea 7; transfer la Cloudflare Registrar opțional mai târziu (cu acordul sorei). Implicit: da.

**#19 ✅ RĂSPUNS (2026-09-21): planul Premium Wix se reînnoiește pe ~16 octombrie 2026** („cred” — de confirmat în Wix → Subscriptions). **Consecință: termen-limită.** Cut-over-ul (Sesiunea 7) trebuie făcut înainte de 16 octombrie, apoi se anulează Premium-ul (nu domeniul). NU anulați încă: la Wix anularea oprește reînnoirea, dar site-ul rămâne activ până la finalul perioadei plătite — o facem după ce noul site e verificat pe domeniu. Plan: S4–S6 până la ~3 octombrie, S7 cut-over în săptămâna 5–9 octombrie, anulare Premium imediat după verificare.

**#8 Wix → Domains → ⋯ → Manage DNS records: screenshot cu toate înregistrările** (mai ales dacă apar MX/TXT — e-mail pe domeniu). Nu e urgent (Sesiunea 7), dar dacă îl faci acum eliminăm o necunoscută.

## Design

**#21 Fluxul de aprobare a designului:** în Sesiunea 2 livrăm hero + o secțiune + un card de echipă ca pagină reală pe un
URL de preview (nu mockup static) și cerem OK-ul sorei înainte de a construi restul. E OK așa? Implicit: da.

**Latitudine de design (clarificată de client, 2026-09-20):** fonturile, culorile, layout-ul și ilustrațiile pot fi schimbate
**complet**; singura regulă fermă este „fără roșu / culori și imagini care dau triggere”. Rămân fixe pentru că sunt
*conținut*, nu design: textele, logo-ul UVT/FPSE, portretele celor 10 membri, codul QR, linkurile.

**#22 ✅ RĂSPUNS (2026-09-21): clientul preferă ilustrațiile cartoon originale** („mai bine cum erau”) → toate 5 sunt înapoi, în aceleași secțiuni ca pe Wix (inclusiv cea cu capul/creierul), optimizate (≤ 1600px, JPEG q82, `mix-blend-mode: multiply` pe secțiunile colorate). Grafica abstractă a fost ștearsă. Text inițial:
Recomandare: **le înlocuim** cu elemente vizuale calme, abstracte (forme moi, linii fine, gradienturi discrete în paleta
site-ului) — mai „studiu clinic”, mai puțin „cartoon”, și eliminăm ilustrația cu capul întunecat/creierul din „Ce presupune
participarea ta?”, care e cea mai apăsătoare vizual. Portretele reale ale echipei devin singurele imagini cu oameni.
Alternativă: păstrăm ilustrațiile actuale (sunt deja fără roșu). Implicit: propunerea de mai sus, arătată la checkpoint-ul
din Sesiunea 2; se poate reveni la ilustrații fără cost.

**#23 ↩ REVENIT (2026-09-21): creditul „Ilustrații Vecteezy” este din nou în footer**, pentru că ilustrațiile Vecteezy sunt înapoi (#22) și licența cere atribuirea. (Pe 2026-09-20 fusese scos la cererea clientului, când ilustrațiile erau înlocuite.) Text inițial: dacă nu mai folosim nicio ilustrație Vecteezy,
rândul din footer devine fals și trebuie **scos** (modificare de text → cere acordul sorei). Dacă păstrăm măcar una, rămâne.
Implicit: se scoate doar dacă #22 = înlocuim și sora aprobă.

**#24 Ce înseamnă exact „trigger” — regulile pe care le aplicăm (spune-ne dacă lipsește ceva):**
fără roșu, portocaliu-roșu, roz aprins, galben de alertă; fără contraste violente sau fundaluri închise pe suprafețe mari;
fără animații rapide, pulsante sau autoplay; fără imagini de suferință, epuizare, capete/creiere, ceasuri, alarme; fără
formulări de urgență adăugate de noi (textele oricum rămân ale voastre). Paletă: bleumarin/albastru profund + alb + gri-albastru
deschis + un accent calm (verde-salvie sau turcoaz stins), erorile de formular în bleumarin cu iconiță, nu roșu.

## Regulă fermă (client, 2026-09-21): ZERO text adăugat de noi

„Pe site sunt doar informații scrise și verificate de doctori/profesori universitari — nu ai voie să adaugi nimic.”
Se aplică la orice text de conținut. Singurele texte care nu existau pe Wix sunt **mesaje de interfață**, inevitabile
tehnic, listate mai jos la #33 pentru aprobare (Wix avea propriile mesaje, în engleză sau necunoscute — #6).

**#33 Texte de interfață scrise de noi (nu conținut) — de aprobat / înlocuit cu cele ale voastre:**
- Formular: „Acest câmp este obligatoriu.”, „Adresa de e-mail nu este validă.”, „Numărul de telefon conține caractere nepermise.”,
  „Textul este prea lung (maximum N caractere).”, „Se trimite…”, „Mulțumim! Mesajul tău a fost trimis. Îți răspundem cât de curând.”,
  „Verificarea anti-spam nu a reușit. Reîncarcă pagina și încearcă din nou.”, „Ai trimis prea multe mesaje într-un timp scurt. Te rugăm să încerci din nou peste câteva minute.”,
  „Mesajul nu a putut fi trimis. Te rugăm să încerci din nou.”, „Așteaptă o clipă verificarea anti-spam, apoi apasă din nou „Trimite”.”, „Pentru a trimite formularul, activează JavaScript.”
- Pagina 404 (Wix avea una în engleză): „Eroare 404”, „Pagina nu a fost găsită”, „Adresa pe care ai deschis-o nu există sau a fost mutată.”, „Înapoi la pagina principală”.
- Doar pentru cititoare de ecran / tastatură (invizibile): „Sari la conținut”, „Deschide meniul” / „Închide meniul”, „(se deschide într-o filă nouă)”, textele alternative ale imaginilor (#9).
- E-mailul primit de voi (nu pe site): „Mesaj nou din formularul de contact upburnout.com”, etichetele Nume/Prenume/Email/Telefon/Mesaj/Trimis la.
- Butonul „Înscrie-te acum!” din header — text existent pe site, doar un al doilea loc (#26).
Implicit: rămân așa; dacă sora trimite mesajele originale din Wix (#6), le înlocuim 1:1.

**#34 Chei Turnstile reale (de făcut de client, ~3 minute, oricând înainte de cut-over):**
1. Cloudflare Dashboard → **Turnstile** → *Add widget* → nume `upburnout`, hostnames: `upburnout.com`, `www.upburnout.com`, `upburnout-website.bogdan-gandila.workers.dev` → mod **Managed** → Create → primești **Site Key** și **Secret Key**.
2. Worker `upburnout-website` → Settings → **Runtime variables and secrets** → Add → Secret `TURNSTILE_SECRET_KEY` = Secret Key → Deploy.
3. Worker → Settings → **Build** → *Variables and secrets* (cele de build, de data asta corect!) → Add `PUBLIC_TURNSTILE_SITE_KEY` = Site Key (nu e secret; e pusă în HTML la build).
4. Un deploy nou (push sau „Retry build” în Deployments) — cheia publică se bakează la build. Bannerul „Numai pentru testare” dispare.
Verificare: `/api/health` arată `"turnstileSecret":"set"`.

**#35 Confirmare 2FA** pe conturile GitHub, Cloudflare, Resend și Wix (SECURITY_PLAN §1). Implicit: presupunem că e activat; spune-ne dacă nu.

## Decizii de design luate în Sesiunea 2 (de confirmat la review — se pot schimba fără cost)

**#25 Cele 8 ședințe: grilă de carduri numerotate în loc de slideshow.** *(Clarificat pentru client 2026-09-21: cele 8 texte EXISTAU pe Wix, în slideshow — un slide vizibil pe rând; nu s-a adăugat niciun cuvânt. Doar afișarea s-a schimbat. Dacă se dorește slideshow ca în original, se poate reveni.)* Pe Wix un singur slide era vizibil; acum
toate cele 8 sunt vizibile (2 coloane pe desktop, 1 pe mobil). Motiv: nimic ascuns, mai ușor de parcurs, accesibil.
Alternativă: carusel cu săgeți (parity). Implicit: grila.

**#26 Buton „Înscrie-te acum!” și în header** (desktop + meniul mobil), pe lângă cele 2 linkuri. Textul există deja
pe site (butonul din hero); e doar un al doilea loc pentru același link. Implicit: rămâne.

**#27 Footer deschis (gri-albastru foarte deschis) în loc de bandă bleumarin**, conform regulii „fără fundaluri închise
pe suprafețe mari” (#24). Implicit: rămâne deschis.

**#28 „Scopul cercetării” este H2** (pe Wix era H3, singurul H3 din pagină — inconsecvență de ierarhie). Vizual identic
cu celelalte titluri de secțiune. Implicit: H2.

**#29 ↩ Ilustrațiile abstracte au fost eliminate (2026-09-21)** — clientul a preferat cartoon-urile originale (#22); creditul Vecteezy e înapoi (#23).

**#31 Echipă: rândurile incomplete sunt centrate** (cerință client 2026-09-20) — implementat.

**#32 ✅ REZOLVAT (2026-09-20):** cont Resend creat de client pe `bogdan.gandila@yahoo.com` (sandbox → trimite doar către această adresă), secretele `RESEND_API_KEY` + `CONTACT_TO_EMAIL` puse în *Runtime variables and secrets* (nu în cele de Build!), e-mail de test primit. Text inițial: avem nevoie de la client: (a) cont Resend pe
`gandilabogdan10@gmail.com` + un API key; (b) secretele `RESEND_API_KEY` și `CONTACT_TO_EMAIL` setate în Cloudflare (Worker →
Settings → Variables and Secrets). Turnstile rulează deocamdată cu cheile de test (banner „Numai pentru testare” vizibil) —
cheile reale (`PUBLIC_TURNSTILE_SITE_KEY` ca variabilă de build + `TURNSTILE_SECRET_KEY` secret) se pun înainte de lansare.

**#30 Fonturi noi:** Plus Jakarta Sans (titluri) + Inter (text), self-hostate. Paleta: bleumarin #14213D, turcoaz stins
#2F7C86, tint-uri reci. Toate combinațiile text/fundal ≥ 4,5:1.

---

### Deja răspunse (2026-09-20)
- Fără CRM → N/A pentru USER_ROLES/CRM/DATABASE.
- Design: clean, clinic, fără roșu/trigger; **libertate completă** pe fonturi, culori, layout, ilustrații (vezi latitudinea de mai sus).
- #1 Backend formular: Cloudflare Pages Functions. #15 GitHub: `kamisamanootouto` (repo privat).
- E-mail formular: inițial al clientului, pentru teste.
- Domeniul expiră/reînnoiește 5 feb 2027 (la Wix).
- Folderele: `D:\Creatii_Claude\upburnout-website`.
- Politica de confidențialitate: se discută mai târziu (vezi #13).
