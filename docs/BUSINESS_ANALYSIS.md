# BUSINESS_ANALYSIS.md — Protocolul Unificat pentru Burnout (UP Burnout)

> Sursa: exclusiv conținutul public al site-ului (`content/pages/*.md`) + deducții logice marcate explicit ca atare.
> Nu este o afacere comercială — este un **studiu de cercetare doctorală** cu o intervenție psihologică gratuită.

## 1. Ce face „organizația”

Un grup de cercetare de la Școala Doctorală de Psihologie a Universității de Vest din Timișoara (UVT) testează
**fezabilitatea și acceptabilitatea** unei intervenții de terapie de grup pentru burnout, bazată pe „Protocolul Unificat”.

*Deducție (nemarcată pe site, dar consistentă cu conținutul):* „UP” = *Unified Protocol for Transdiagnostic Treatment
of Emotional Disorders* (Barlow și colab.). Cele 8 ședințe de pe site corespund aproape 1:1 modulelor UP (înțelegerea
emoțiilor, observare conștientă, flexibilitate cognitivă, contracararea comportamentelor emoționale, expuneri la emoții,
recunoașterea meritelor), iar Prof. Dr. Shannon Sauer-Zavala din echipă este co-autoare a protocolului. Această deducție
poate fi folosită doar pentru context (ex. metadate SEO, dacă clientul aprobă), **nu** pentru a adăuga text pe site.

## 2. Cui se adresează

- Adulți care resimt simptome de burnout (epuizare, cinism, retragere din muncă) — descrierea din secțiunea „Despre această terapie”.
- Geografic: participarea presupune **8 ședințe fizice la UVT, Timișoara** (2 ore fiecare) → publicul e local/regional.
- Limba: română.

## 3. Ce problemă rezolvă

Pentru participant: o abordare structurată, gratuită, în grup, pentru a face față burnoutului, cu suport de la
psihoterapeuți instruiți și supervizați. Pentru cercetare: date despre cât de ușor de folosit și cât de bine primită este intervenția.

## 4. Procesul operațional (exact cum e descris pe site)

1. Vizitatorul citește site-ul → apasă „Înscrie-te” (QuestionPro) sau scanează QR-ul.
2. Completează formularul de înscriere pe `e-uvt.questionpro.com/up-burnout` (platformă externă, nu o controlăm).
3. Parcurge și acceptă consimțământul informat.
4. Discuție online de 50 de minute cu un membru al echipei de cercetare (screening).
5. 8 ședințe de terapie de grup, 2 ore/ședință, la UVT.
6. Focus grup voluntar.
7. La 1 lună după: chestionar de follow-up.

Site-ul intervine **doar la pasul 1** (informare + trimitere către QuestionPro) și oferă un **formular de contact** pentru întrebări.

## 5. Servicii / produse

- „Serviciul”: programul de terapie de grup (gratuit, în cadrul studiului).
- Nu există produse, prețuri, plăți, abonamente, magazin.

## 6. Cum generează venit

**Nu generează venit.** Proiect academic (cercetare doctorală). Consecință pentru arhitectură: costurile de rulare
trebuie să fie **zero sau aproape zero** (Cloudflare Pages free, Resend free, fără servere plătite) — vezi `TECH_STACK_RECOMMENDATIONS.md`.

## 7. Cum interacționează cu „clienții” (participanții)

- Canal principal de conversie: linkul/QR-ul QuestionPro (extern).
- Canal secundar: formularul de contact de pe site (Nume, Prenume, Email, Telefon, mesaj) → în prezent Wix Forms
  (mesajele ajung în Wix Inbox și, probabil, pe e-mail — de verificat în panoul Wix).
- Nu există e-mail, telefon, social media afișate public; nu există newsletter, chat, programări.

## 8. Ce diferențiază proiectul

- Protocol bazat pe dovezi, adaptat pentru burnout, cu autor internațional în echipă.
- Girat de UVT / Școala Doctorală de Psihologie (logo FPSE în hero, mențiune în footer).
- Participare gratuită + contribuție la cercetare („Un pas pentru tine, un pas pentru cercetare”).
- Echipă vizibilă cu nume și fotografii (încredere).

## 9. Obiectivele website-ului (derivate)

| Obiectiv | Cum se măsoară | Observație |
|---|---|---|
| Înscrieri în studiu | click-uri pe „Înscrie-te” / scanări QR (măsurabile doar pe QuestionPro) | site-ul nu are analytics acum; parity = fără analytics (OPEN_QUESTIONS #14) |
| Întrebări de la potențiali participanți | mesaje primite prin formular | trebuie să ajungă sigur pe e-mail (Sesiunea 3) |
| Credibilitate / claritate | timp de încărcare, lizibilitate, accesibilitate | ținte în `FEATURE_REQUIREMENTS.md` §3 |

## 10. Riscuri de business relevante pentru remaster

- **Pierderea unui mesaj din formular** = pierderea unui potențial participant → livrarea e-mailului trebuie testată end-to-end și monitorizată (`SECURITY_PLAN.md` §backup, `API_DESIGN.md` §erori).
- **Date personale** colectate fără politică de confidențialitate / consimțământ explicit — risc GDPR pentru un studiu academic (comisia de etică a UVT probabil cere asta). Clientul a amânat discuția; se marchează ca **blocker de lansare** în `OPEN_QUESTIONS.md` #13.
- **Fotografiile membrilor echipei** sunt date personale publicate cu acordul lor (presupus) — se păstrează identic, nu se re-procesează în afara optimizării tehnice.
- Site-ul nu e indexat: dacă recrutarea depinde de Google, e o oportunitate ratată; dacă e intenționat (recrutare doar prin canale controlate), rămâne așa. Decizie: `OPEN_QUESTIONS.md` #2.
