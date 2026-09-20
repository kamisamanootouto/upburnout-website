# Manifest imagini — 17 fișiere, toate descărcate ca originale de pe `static.wixstatic.com/media/<id>`

Regulă: la implementare se folosesc **aceste originale** (nu variantele AVIF comprimate de Wix), redimensionate/convertite
de pipeline-ul de build (AVIF/WebP + `srcset`). Recadrarea vizuală se reproduce cu `object-fit: cover; object-position: center`
(echivalentul `fill / al_c` din URL-urile Wix). Nu se schimbă imaginea, doar formatul și dimensiunea servită.

## Acasă

| Fișier local (`original/`) | ID Wix | Unde | Afișat (desktop) | Original | Note |
|---|---|---|---|---|---|
| `acasa-01-logo-fpse-uvt.png` | `42dc14_bf1efed32755426786789ba8c736437a~mv2.png` | Hero, logo | 226×105 (mobil 77×36) | 1754×816 PNG RGBA | Logo UVT + FPSE; alt Wix `FPSE-11.png` |
| `acasa-02-hero-ilustratie-femeie-plante.jpg` | `42dc14_4a7c76e76d704a39a823f11148bc5eb7~mv2.jpg` | Hero, dreapta | 676×738 | 7973×7972 JPEG, 2.9 MB | Ilustrație Vecteezy; alt Wix `2944_R0lVIEFOTiAzMDEtNjk.jpg` |
| `acasa-03-despre-terapie-grup.jpg` | `42dc14_fee524b8900b4687a2a93f240d539950~mv2.jpg` | Despre această terapie | 567×285 | 1920×911 JPEG | Ilustrație Vecteezy (grup terapie); alt Wix `vecteezy_group-therapy-meeting-with-psychologist_13758405.jpg` |
| `acasa-04-scopul-cercetarii-ilustratie.jpg` | `42dc14_8d9668635226482b9e49e8a75151a35f~mv2.jpg` | Scopul cercetării | 470×470 | 7730×7730 JPEG, 1.9 MB | alt Wix gol |
| `acasa-05-participare-ilustratie-cap-creier.jpg` | `42dc14_e56a52d514214ea2bc2b812d4f18b1b9~mv2.jpg` | Ce presupune participarea ta? | 339×339 | 7973×7972 JPEG, 2.1 MB | alt Wix `2944_R0lVIEFOTiAzMDEtNjg.jpg` |
| `acasa-06-qr-questionpro.png` | `42dc14_fe543ad9c276408a92a7437968cbdf90~mv2.png` | Înscrie-te acum! | 256×256 | 256×256 PNG | Cod QR QuestionPro, textul „Powered By QuestionPro” e în PNG; alt Wix `image.png` |

## Echipă

| Fișier local (`original/`) | ID Wix | Unde | Afișat | Original | Note |
|---|---|---|---|---|---|
| `echipa-01-despre-noi-ilustratie-bec-puzzle.png` | `42dc14_c98f8c4601e24029b3fcc49f9a94ba07~mv2.png` | Despre noi | 550×444 | 5000×4000 PNG, 2.9 MB | Ilustrație; alt Wix `image.png` |
| `echipa-02-athena-gandila.png` | `42dc14_b3808ce9830045908fa8fef488cdfe09~mv2.png` | Echipa de cercetare #1 | 263×351 | 2316×3088 PNG, 8.6 MB | Portret |
| `echipa-03-andrei-rusu.jpg` | `42dc14_e8cebc26ffc24636a71b8237becb1d80~mv2.jpg` | Echipa de cercetare #2 | 263×351 | 9843×10835 JPEG **CMYK**, 13.3 MB | ⚠ CMYK → trebuie convertit în RGB la optimizare; alt Wix `Andrei Rusu.jpg` |
| `echipa-04-delia-virga.png` | `42dc14_3be91ac773d94b38bfde9ccbbfe21698~mv2.png` | Echipa de cercetare #3 | 263×351 | 768×1024 PNG | Portret |
| `echipa-05-bogdan-tulbure.png` | `42dc14_c60b91b1087445a182c35f3faf2a072a~mv2.png` | Echipa de cercetare #4 | 263×351 | 683×1024 PNG | Portret |
| `echipa-06-ioana-podina.png` | `42dc14_d8faa6ed779f4e4abf0b4f78fbd0cd0a~mv2.png` | Echipa de cercetare #5 | 263×351 | 1365×1637 PNG | Portret |
| `echipa-07-shannon-sauer-zavala.png` | `42dc14_c5d4438d23dc449f883e1cb3cc5aeaf3~mv2.png` | Echipa de cercetare #6 | 263×351 | **480×474** PNG | ⚠ Sursă mică (aproape pătrată) → afișarea 263×351 o mărește/recadrează; e la fel și pe Wix. Ideal: clientul furnizează o poză mai mare |
| `echipa-08-gianina-buruczky.png` | `42dc14_f7d5a67325374f5a886fda30e5dec211~mv2.png` | Echipa de cercetare #7 | 268×351 | 1290×1657 PNG, 4 MB | Portret |
| `echipa-09-daniel-dragulescu.jpeg` | `42dc14_98c927ff2a7d42b89ad37489684095bd~mv2.jpeg` | Echipa de psihoterapeuți #1 | 263×351 | 1080×1440 JPEG | alt Wix `WhatsApp Image 2026-01-31 at 11.31.58.jpeg` |
| `echipa-10-gabriela-micu.png` | `42dc14_02d2eccd22a34d0783d19b0abbd242ea~mv2.png` | Echipa de psihoterapeuți #2 | 263×351 | 1106×1652 PNG RGBA, 3.4 MB | Portret |
| `echipa-11-vlad-cosa.jpeg` | `42dc14_b172263d115843d396b22c856bc34e28~mv2.jpeg` | Echipa de psihoterapeuți #3 | 263×351 | 1442×1923 JPEG | alt Wix `WhatsApp Image 2026-02-04 at 16.55.44.jpeg` |

Total originale: ~46 MB. Nu se pun în repo ca atare fără procesare — vezi `docs/WEBSITE_ARCHITECTURE.md` (pipeline imagini).

## Alte resurse
- Favicon: nu există unul propriu (Wix default). Propunere în `docs/OPEN_QUESTIONS.md`.
- Fonturi: Fahkwang (400/400i/700) + Raleway 400 — disponibile pe Google Fonts, se pot self-hosta.
- Nu există video, PDF, documente descărcabile.
