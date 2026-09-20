# UP Burnout — website

Remaster-ul site-ului [upburnout.com](https://www.upburnout.com/) (Protocolul Unificat pentru Burnout, UVT).
Conținut identic cu site-ul Wix original; design și tehnologie noi.

| Folder | Ce conține |
|---|---|
| `docs/` | Planificare: context, cerințe, arhitectură, securitate, deployment, roadmap, întrebări deschise |
| `content/` | Inventarul site-ului original = sursa de adevăr pentru texte (`pages/*.md`), SEO, design, screenshot-uri |
| `frontend/` | Site-ul (Astro 7 + Tailwind 4), deploy pe Cloudflare Pages (`root: frontend`, build `npm run build`, output `dist`) |

## Dezvoltare locală

```bash
cd frontend
npm ci
npm run dev            # http://localhost:4321
npm run build          # generează dist/
npm run verify-content # verifică fidelitatea textelor față de content/pages
```

`npm run images` regenerează portretele/logo-ul din `content/assets/original/` (folder local, nu în repo).

## Reguli
- Textele vin exclusiv din `frontend/src/data/*.ts`, transcrise VERBATIM din `content/pages/*.md`. Orice schimbare de text cere aprobarea clientului (`docs/OPEN_QUESTIONS.md`).
- Fără roșu / culori și imagini „trigger” în design (`docs/OPEN_QUESTIONS.md` #24).
- Lucrul e organizat în sesiuni cu aprobare explicită între ele (`docs/PROJECT_ROADMAP.md`).
