# Referință de design — site-ul actual (măsurat în browser, 2026-09-20)

Scop: remaster = **design nou, conținut vechi**. Clientul a cerut „clean, în ideea de studiu clinic, frumos, fără roșu
și culori care dau triggere; se poate păstra tematica actuală”. Documentul de față fixează ce există acum, ca punct de
plecare pentru propunerea de design din Sesiunea 2 (Website Frontend Foundation).

## 1. Paletă folosită efectiv (nu paleta teoretică Wix)

| Rol | Valoare | Unde |
|---|---|---|
| Bleumarin principal (text + butoane + footer) | `#06103C` = rgb(6,16,60) | tot textul, H1–H6, butoane pill, footer |
| Alb | `#FFFFFF` | fundal pagină, header, text pe footer/butoane |
| Lavandă (buton secundar) | `#A2A3E9` = rgb(162,163,233) | „Descoperă echipa proiectului” |
| Gri deschis (card slideshow) | `#F3F3F3` = rgb(243,243,243) | cardul cu cele 8 ședințe |
| Gri-albastru (bloc hero) | `#C1C3CE` = rgb(193,195,206) | bloc 676×738 în spatele ilustrației hero (vizibil doar parțial) |
| Voal alb 50% | `rgba(255,255,255,0.5)` | strat peste secțiunea „Ce presupune participarea ta?” |

Culori din ilustrații (nu din UI): mov/violet (păr, puzzle), portocaliu (tricou, steag), roz (inimă, creier), verde (plante),
lavandă (fundal ilustrație „Despre noi”). **Nu există roșu în UI**; singurul roșu e cel din paleta Wix nefolosită (`#ED1C24`).

## 2. Tipografie

- **Fahkwang** (Google Fonts; weights încărcate: 400, 400 italic, 700) — practic tot site-ul: titluri, paragrafe, butoane, etichete formular, footer.
- **Raleway** 400 — doar textul butonului lavandă „Descoperă echipa proiectului” (13px).
- Fallback-uri Wix: Helvetica/Arial (nevizibile).

| Element | Font | Mărime | Line-height | Letter-spacing | Weight | Culoare |
|---|---|---|---|---|---|---|
| H1 (hero) | Fahkwang | 67px | 80.4px (1.2) | −0.67px | 400 | #06103C |
| H2 (secțiuni) | Fahkwang | 51px | 63.75px (1.25) | −0.51px | 400 | #06103C |
| H2 „Înscrie-te acum!” | Fahkwang | 51px | — | — | **700** | #06103C |
| H3 „Scopul cercetării” | Fahkwang | 42px | 50.4px | −1.68px | 400 | #06103C |
| Paragraf standard (Acasă) | Fahkwang | 17px | 23.8px (1.4) | 0 | 400 | #06103C |
| Paragraf „Despre noi” (Echipă) | Fahkwang | 15px | 22.5px (1.5) | 0 | 400 | #06103C |
| Subtitlu hero / lista 1–5 / nume echipă | Fahkwang | 19px | 26.6px | −0.19px | 400 (numerele 1.–5. sunt 700) | #06103C |
| Nume site în header | Fahkwang | 17px | — | — | 400 | #06103C |
| Etichete + valori formular | Fahkwang | 17px | — | — | 400 | #06103C |
| Buton pill | Fahkwang | 15px (Trimite: 16px) | — | — | 400 | alb |
| Footer titlu | Fahkwang | 19px | — | — | 700 | alb |
| Footer text | Fahkwang | 15px | — | — | 400 | alb |
| Footer linkuri | Fahkwang | 19px | — | — | 400 | alb (subliniate) |
| Credit „Ilustrații Vecteezy” | Fahkwang | 10px | — | — | 400 | alb |
| Italic unic | Fahkwang italic | 17px | — | — | 400 | „Ne dorim să fie totul clar pentru tine!” |

## 3. Componente

- **Buton primar (pill)**: fundal #06103C, text alb 15px, 154×50px, `border-radius: 100px`, chenar 1px #06103C. Apare de 4 ori (Înscrie-te acum!, Contactează-ne, Înscrie-te, Trimite 135×43).
- **Buton secundar**: fundal #A2A3E9, text alb Raleway 13px, 263×50px, `border-radius: 20px`. **Contrast slab** (alb pe lavandă ≈ 2.1:1, sub WCAG AA) — de corectat în remaster.
- **Card slideshow**: #F3F3F3, ~830×290px, umbră difuză, titlu 24–26px centrat + listă cu „•” ca text; săgeți subțiri „<” „>” în afara cardului; 8 buline jos; navigare manuală (fără autoplay observat).
- **Formular**: câmpuri fără chenar, doar linie de subliniere 1px #06103C, fundal transparent, fără placeholder; etichete deasupra; „Nume*” și „Prenume*” pe același rând (2 coloane), restul pe rând întreg; lățime container ~500px.
- **Carduri echipă**: imagine 263×351 (raport 3:4), `object-fit: cover`, fără rotunjire, fără umbră; nume centrat sub imagine, 19px.
- **Header**: alb, 85px, sticky; fără umbră; nume site stânga, meniu dreapta; pe mobil „UP-Burnout” + hamburger.
- **Footer**: #06103C, ~230px, text alb; 2 coloane (identitate stânga, linkuri dreapta), credit centrat jos.

## 4. Layout și spațiere

- Canvas Wix desktop: 980px centrat; conținutul respectă în mare o grilă de 2 coloane 50/50 cu ilustrații 340–680px.
- Secțiuni separate doar prin spațiu alb (fără linii, fără fundaluri colorate alternante), cu excepția cardului gri și a footerului.
- Breakpoint Wix: ≤750px → layout mobil separat (coloană unică, ordine ușor diferită în secțiunea „Înscrie-te acum!”: QR înaintea textului).

## 5. Mișcare

- Intrări animate Wix „reveal in” (`motion-revealIn`: opacity 0 → 1) pe titluri, butoane și paragrafe la intrarea în viewport.
- Wix respectă `prefers-reduced-motion` (cu reduced-motion elementele apar direct) — comportament de păstrat.
- Slideshow: tranziție glisantă între slide-uri la click pe săgeți/buline.

## 6. Imagini

- Toate servite de Wix ca AVIF, cu `usm` (unsharp mask) și recadrare `fill` centrată. Originalele (vezi `assets/manifest.md`)
  sunt mult mai mari decât afișarea (până la 7973×7972 și 9843×10835) → pipeline de optimizare obligatoriu la implementare.
- Ilustrații: stil vector „flat” Vecteezy (licența cere creditul „Vecteezy” — există în footer; **de păstrat**).
- Logo: UVT + FPSE, PNG cu transparență, 1754×816.
