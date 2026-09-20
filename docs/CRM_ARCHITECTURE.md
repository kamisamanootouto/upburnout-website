# CRM_ARCHITECTURE.md

## Status: NU SE APLICĂ (decizie client, 2026-09-20)

Template-ul MergeIT pornește de la premisa că „CRM-ul este partea principală a proiectului”. Pentru UP Burnout clientul a
decis explicit: **fără CRM**. Motivele, ca să fie clare pentru oricine reia proiectul mai târziu:

1. Un singur canal de intrare (formularul de contact) cu volum mic, plus înscrierea propriu-zisă care se face pe o
   platformă externă (QuestionPro) pe care nu o controlăm → nu există date de gestionat pe site.
2. Proiect academic fără venit → costul și mentenanța unui backend + bază de date nu se justifică.
3. Fiecare componentă în plus (autentificare, roluri, DB) crește suprafața de atac și obligațiile GDPR pentru date
   sensibile (persoane cu burnout).

## Ce înlocuiește CRM-ul

- **Formular → e-mail** (`API_DESIGN.md`): mesajul ajunge în inbox-ul destinatarului cu `Reply-To` setat pe expeditor;
  „gestionarea lead-urilor” = răspunsul la e-mail.
- Opțional, copie BCC către o a doua adresă ca backup (OPEN_QUESTIONS #7).

## Dacă se va dori un CRM mai târziu (schiță, fără angajament)

Se creează proiectul separat `upburnout-crm/` conform template-ului (frontend + backend + MongoDB Atlas), iar funcția
de contact de pe site primește un al doilea „sink”: pe lângă e-mail, face `POST` către API-ul CRM-ului. Site-ul nu
trebuie rescris — doar endpoint-ul de contact se extinde. Module minime ar fi: Lead-uri (mesaje din formular),
Participanți (import din QuestionPro), Ședințe (8 × grup), Follow-up la 1 lună, cu roluri Admin / Cercetător / Psihoterapeut.
