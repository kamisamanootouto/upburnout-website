# USER_ROLES.md

## Roluri CRM

**Nu se aplică.** Decizie client (2026-09-20): proiectul nu are CRM, autentificare sau conturi de utilizator.
Nu există nicio zonă protejată pe site. Dacă în viitor se adaugă un CRM, se reia acest document conform template-ului
(Admin / Manager / Agent / Client etc.).

## Roluri reale în acest proiect

### Vizitatori (site public)

| Rol | Ce poate face | Autentificare |
|---|---|---|
| Vizitator anonim | Citește ambele pagini, navighează slideshow-ul, trimite formularul de contact, deschide linkul QuestionPro | niciuna |

Nu există alte tipuri de vizitatori (membri, participanți logați etc.).

### Operatori (infrastructură) — cine are acces la ce

| Rol | Persoană | Acces | Notă |
|---|---|---|---|
| Proprietar conținut | Sora clientului (coordonatoare studiu) | Aprobă design + orice schimbare de text; deține contul Wix (domeniu) | Nu are nevoie de acces tehnic |
| Dezvoltator / administrator | Bogdan (client) | GitHub (repo), Cloudflare (Pages + zona DNS), Resend (e-mail), Wix (colaborator pe cont) | Toate conturile cu 2FA (`SECURITY_PLAN.md`) |
| Destinatar formular | inițial Bogdan; final: de decis (OPEN_QUESTIONS #7) | primește e-mailurile din formular | configurabil prin `CONTACT_TO_EMAIL` |
| Registrar domeniu | Wix (contul sorei) | reînnoire domeniu (5 feb 2027), schimbare nameservere | clientul are acces în cont |

### Principii
- Un singur cont Cloudflare deține și Pages, și zona DNS `upburnout.com` (evită împărțirea accesului).
- Sora clientului poate fi adăugată ca membru cu drepturi limitate în Cloudflare / GitHub dacă vrea vizibilitate, dar nu e necesar pentru funcționare.
- Nicio parolă/cheie nu circulă prin chat sau repo; secretele stau doar în Cloudflare Pages → Settings → Environment variables (vezi `DEPLOYMENT_PLAN.md`).
