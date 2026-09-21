# PROJECT_CONTEXT.md — UP Burnout, remaster website

## Ce este proiectul

Remaster-ul site-ului `https://www.upburnout.com/` — pagina de prezentare a studiului **„Protocolul Unificat pentru
Burnout”**, desfășurat prin Școala Doctorală de Psihologie a Universității de Vest din Timișoara (UVT). Site-ul actual
este construit în **Wix** de sora clientului (coordonatoarea studiului, Drd. Athena Gândilă, apare în echipa de cercetare).

Obiectivul remaster-ului: **același conținut, design nou (clean, „studiu clinic”), tehnologie nouă (cod propriu,
Cloudflare Workers), performanță și accesibilitate de nivel premium.** Nu se adaugă funcționalități, pagini sau texte
fără aprobare explicită.

## Constrângeri fixe (nu se renegociază fără client)

1. **Conținut identic** — texte caracter cu caracter (inclusiv diacritice), aceleași imagini, aceleași linkuri, aceleași
   câmpuri de formular. Sursa de adevăr: `content/` (inventar complet făcut în Sesiunea 1, vezi `content/README.md`).
   **Regulă fermă (client, 2026-09-21): nu adăugăm niciun text** — conținutul e scris și verificat de doctori/profesori;
   excepțiile aprobate (typo-uri) sunt în `content/approved-deviations.json`; mesajele de interfață sunt listate în `OPEN_QUESTIONS.md` #33.
2. **Domeniul rămâne cumpărat la Wix** (expiră/reînnoiește 5 feb 2027). Se schimbă doar nameserverele către Cloudflare;
   transferul la Cloudflare Registrar este opțional, mai târziu.
3. **Fără CRM** — decizie client 2026-09-20. Formularul de contact trimite e-mail; nu se stochează nimic într-o bază de date.
4. **Fără roșu / culori și imagini „trigger”** în design; ton calm, clinic, curat. În rest, **libertate completă de design**
   (fonturi, culori, layout, ilustrații — clarificat de client 2026-09-20). Rămân fixe, ca *conținut*: textele, logo-ul
   UVT/FPSE, portretele echipei, codul QR, linkurile. Regulile „anti-trigger” sunt în `OPEN_QUESTIONS.md` #24.
5. **Prompt-ul MergeIT** (`C:\Users\kinat\Desktop\uoak\prompt_MergeIT_ClaudeCode_Website.txt`) se respectă strict:
   Sesiunea 1 = doar analiză + documente; fiecare sesiune se oprește cu raport; nimic nu începe fără aprobare explicită.
6. Hosting: **Cloudflare Workers** (static assets + worker pentru formular) — abatere aprobată de la „Pages + Render” din
   template (`OPEN_QUESTIONS.md` #1, `DEPLOYMENT_PLAN.md` §2); bază de date **nu există** în acest proiect.

## Ce știm despre site-ul actual (rezumat; detalii în `content/`)

- 2 pagini: `/` (Acasă) și `/echipă` (Echipă). O singură limbă (română). ~4.500px / ~3.200px înălțime la desktop.
- Secțiuni Acasă: Hero · Despre această terapie · Abordarea noastră (slideshow cu 8 ședințe) · Scopul cercetării ·
  Ce presupune participarea ta? · Înscrie-te acum! (QR + link QuestionPro) · Formular de contact · Footer.
- Secțiuni Echipă: Despre noi · Echipa de cercetare (7 persoane) · Echipa de psihoterapeuți (3 persoane) · Footer.
- 1 formular (Nume*, Prenume*, Email*, Telefon, Cum te putem ajuta?) — Wix Forms.
- 1 link extern de conversie: `https://e-uvt.questionpro.com/up-burnout` (înscrierea efectivă în studiu).
- 17 imagini (logo UVT/FPSE, 5 ilustrații Vecteezy, 1 cod QR, 10 portrete). Fonturi: Fahkwang + Raleway.
- **Site-ul este `noindex`** pe ambele pagini (nu apare în Google), fără meta description, fără OG image, `lang="en"`,
  fără analytics, fără cookie banner, fără politică de confidențialitate, favicon implicit Wix.
- Wix: plan Premium activ, domeniul `upburnout.com` primar, 3 collaborators, butonul „Get a Business Email” indică
  faptul că **nu există e-mail pe domeniu** (de confirmat în panoul DNS înainte de cut-over).

## Decizii luate (jurnal)

| Data | Decizie | Cine |
|---|---|---|
| 2026-09-20 | Nu se reface pe Wix; domeniul rămâne la Wix, nameservere → Cloudflare, site pe Cloudflare Pages | Client, la propunerea noastră |
| 2026-09-20 | Fără CRM | Client |
| 2026-09-20 | Design: clean, tematică „studiu clinic”, fără roșu/culori trigger; tematica actuală se poate păstra | Client (cerința sorei) |
| 2026-09-20 | E-mailul destinatar al formularului: inițial cel al clientului (`gandilabogdan10@gmail.com`) pentru teste; final: de stabilit | Client |
| 2026-09-20 | Politica de confidențialitate: se discută când ajungem acolo (înainte de lansare) | Client |
| 2026-09-20 | Folderul proiectului: `D:\Creatii_Claude\upburnout-website` (fără `upburnout-crm`) | Client |
| 2026-09-20 | Backend formular: **Cloudflare Pages Functions** (abatere aprobată de la „Render” din template) | Client, la recomandarea noastră |
| 2026-09-20 | Repo GitHub privat pe contul personal **`kamisamanootouto`**; cont Cloudflare al clientului | Client |
| 2026-09-20 | Design: libertate completă (fonturi, culori, ilustrații înlocuibile); singura regulă: fără trigger-e | Client |
| 2026-09-20 | Hosting: Cloudflare **Workers static assets** (Git builds) în loc de Pages — dashboard-ul nou; aceeași platformă, 0 cost | Noi, la conectarea repo-ului |
| 2026-09-21 | Site-ul **se indexează** în Google (S4); meta description doar din propoziții existente | Client |
| 2026-09-21 | Typo-urile (4) se corectează; ilustrațiile cartoon originale revin (+ credit Vecteezy); zero text adăugat | Client |
| 2026-09-21 | Termen: planul Premium Wix se reînnoiește ~16 oct 2026 → cut-over înainte, apoi anulare Premium | Client |

## Structura repo-ului (țintă)

```
upburnout-website/
├── docs/                 ← cele 13 documente de planificare (această sesiune)
├── content/              ← inventarul site-ului actual = sursa de adevăr pentru conținut (această sesiune)
│   ├── pages/            ← acasa.md, echipa.md (text verbatim + structură)
│   ├── assets/original/  ← cele 17 imagini originale (~46 MB; NU se copiază ca atare în build)
│   └── screenshots/      ← referință vizuală desktop/mobil
├── frontend/             ← Astro 7 (static) + `worker/` (POST /api/contact) + `tests/e2e` (Playwright) + `scripts/`
└── (fără backend/ — formularul rulează în worker-ul Cloudflare; Render nu e folosit)
```

## Cum lucrăm (regulile din prompt, aplicate)

- Fiecare sesiune din `PROJECT_ROADMAP.md` este independentă, testabilă, verificabilă.
- La finalul fiecărei sesiuni: stop, raport (fișiere modificate, funcționalități, probleme, teste propuse), așteptăm aprobare.
- Orice abatere de la conținutul din `content/` se trece în `OPEN_QUESTIONS.md` și așteaptă răspuns — nu se „corectează” din proprie inițiativă.
- Site-ul Wix rămâne live și neatins până la cut-over-ul din Sesiunea 7; nimic din ce facem nu îl afectează înainte.

## Persoane și conturi

| Rol | Cine / ce |
|---|---|
| Client / dezvoltator-partener | Bogdan (utilizatorul), are acces la contul Wix |
| Proprietar site și conținut | Sora clientului (coordonatoare studiu) — aprobă designul și orice modificare de text |
| Cont Cloudflare | Al clientului (`Bogdan.gandila@ya…`) — zona `upburnout.com` + worker `upburnout-website` |
| Cont GitHub pentru repo | `kamisamanootouto` (privat) |
| Cont Resend (e-mail tranzacțional) | `bogdan.gandila@yahoo.com`; domeniul `upburnout.com` adăugat (eu-west-1), Pending până la activarea DNS |
| Cont Wix (domeniu + site vechi) | Al sorei; clientul are acces. Domeniul se transferă la un registrar extern (Wix nu permite NS custom) |
| Ghid de întreținere | `docs/MAINTENANCE.md` |

## Documente

`BUSINESS_ANALYSIS.md` · `FEATURE_REQUIREMENTS.md` · `USER_ROLES.md` · `CRM_ARCHITECTURE.md` (N/A) ·
`WEBSITE_ARCHITECTURE.md` · `DATABASE_DESIGN.md` (N/A) · `API_DESIGN.md` · `SECURITY_PLAN.md` · `DEPLOYMENT_PLAN.md` ·
`TECH_STACK_RECOMMENDATIONS.md` · `PROJECT_ROADMAP.md` · `OPEN_QUESTIONS.md`
