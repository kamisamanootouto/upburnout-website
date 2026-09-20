# DATABASE_DESIGN.md

## Status: NU EXISTĂ BAZĂ DE DATE (decizie derivată din „fără CRM”, 2026-09-20)

Nimic din ce face site-ul nu necesită persistență:

| Date | Unde trăiesc | De ce nu în DB |
|---|---|---|
| Conținutul paginilor (texte, echipă) | În repo, ca fișiere tipizate (`src/data/*.ts`) generate din `content/` | Se schimbă rar, doar prin aprobare; versionat de git; zero latență |
| Imagini | În repo (variante pre-procesate) + `content/assets/original/` local | Statice |
| Mesajele din formular | **Nu se stochează.** Ajung pe e-mail (Resend → inbox) | Cerință client; minimizarea datelor personale (GDPR) |
| Înscrierile în studiu | QuestionPro (platformă externă a UVT) | În afara scopului |
| Configurare (adrese e-mail, chei) | Variabile de mediu Cloudflare Pages | Secrete, nu date |

## Consecințe și măsuri compensatorii

- Nu există backup de mesaje în afara inbox-ului destinatarului → recomandare: BCC către o a doua adresă (OPEN_QUESTIONS #7)
  și/sau păstrarea e-mailurilor într-un label dedicat. Resend păstrează loguri limitate (plan gratuit) — nu e un backup.
- Nu există rate-limit „cu memorie” în funcție fără KV → limitarea se face la nivel de Cloudflare (regulă de zonă) + Turnstile; suficient pentru volumul așteptat.

## Dacă se va cere stocare mai târziu

Opțiunea conformă template-ului: MongoDB Atlas (free tier), o singură colecție:

```
contact_messages {
  _id, createdAt, nume, prenume, email, telefon?, mesaj?,
  meta: { userAgent, country (din header CF), turnstileOk: bool },
  delivery: { provider: 'resend', messageId?, status: 'sent'|'failed', error? }
}
```
Indexuri: `createdAt` (desc), `email`. Retenție: ștergere automată (TTL) după N luni conform politicii de confidențialitate.
Ar necesita backend cu acces la Atlas (Render, sau Worker cu driver HTTP) și o politică GDPR scrisă. Nu se implementează acum.
