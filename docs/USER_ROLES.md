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
| Dezvoltator / administrator | Bogdan (client) | GitHub (repo), Cloudflare (worker + zona DNS), Resend (e-mail), Wix (colaborator pe cont), registrarul domeniului (după transfer) | Toate conturile cu 2FA (`SECURITY_PLAN.md`) |
| Destinatar formular | Bogdan (test, Yahoo) → final `athena.gandila@e-uvt.ro` după verificarea domeniului în Resend (#7) | primește e-mailurile din formular | configurabil prin `CONTACT_TO_EMAIL` |
| Registrar domeniu | Wix (contul sorei) → în transfer către un registrar extern (Wix nu permite NS custom) | reînnoire domeniu, nameservere | contul nou: al clientului, sora persoană de contact |

### Principii
- Un singur cont Cloudflare deține și worker-ul, și zona DNS `upburnout.com` (evită împărțirea accesului).
- Sora clientului poate fi adăugată ca membru cu drepturi limitate în Cloudflare / GitHub dacă vrea vizibilitate, dar nu e necesar pentru funcționare.
- Nicio parolă/cheie nu circulă prin chat sau repo; secretele stau doar în Cloudflare → worker `upburnout-website` → Settings → Runtime variables and secrets (vezi `MAINTENANCE.md` §4).
