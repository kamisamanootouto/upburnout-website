# content/ — sursa de adevăr pentru conținutul site-ului

Acest folder conține **inventarul exact** al site-ului actual `https://www.upburnout.com/` (Wix), extras pe 2026-09-20
din HTML-ul public + interacțiune reală în browser (slideshow-ul are 8 slide-uri care nu apar în HTML-ul inițial).

Regula proiectului: **conținutul rămâne identic**. Tot ce se implementează în sesiunile următoare trebuie să
reproducă textele de aici *caracter cu caracter* (inclusiv diacritice), aceleași imagini, aceleași linkuri,
aceleași câmpuri de formular. Se schimbă doar designul și tehnologia.

| Fișier | Ce conține |
|---|---|
| `pages/acasa.md` | Pagina Acasă (`/`) — text verbatim pe secțiuni, structură, imagini, linkuri, cele 8 slide-uri |
| `pages/echipa.md` | Pagina Echipă (`/echipă`) — text verbatim, cei 10 membri, imagini |
| `seo.md` | Title / meta / canonical / robots / OG per pagină + constatări (noindex, lang=en, fără description) |
| `design-reference.md` | Culori, fonturi, dimensiuni, butoane, header/footer, animații, comportament mobil |
| `assets/manifest.md` | Tabel cu cele 17 imagini: fișier local, ID Wix, unde apare, dimensiuni afișate vs. originale, note |
| `assets/original/` | Imaginile **originale** descărcate de pe CDN-ul Wix (fără compresia/recadrarea Wix) |
| `screenshots/` | Referință vizuală: desktop 1440px și mobil 390px, ambele pagini, full-page |

Convenție pentru `pages/*.md`: blocurile marcate `> VERBATIM` sunt textul exact al site-ului. Comentariile
dintre `[[ ]]` sunt note de structură pentru implementare, nu conținut.

Erorile de text din original (typo-uri) sunt **păstrate intenționat** aici și listate în
`docs/OPEN_QUESTIONS.md` — se corectează doar cu acordul explicit al clientului.

**Actualizare 2026-09-20 (clarificare client):** designul poate fi schimbat complet — fonturi, culori, layout și
**ilustrațiile Vecteezy pot fi înlocuite**. Rămân fixe (conținut): textele, logo-ul UVT/FPSE, portretele echipei, codul QR,
linkurile. Vezi `docs/OPEN_QUESTIONS.md` #22–#24.
