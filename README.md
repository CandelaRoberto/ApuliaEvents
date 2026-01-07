# ApuliaEvents

Applicazione web per la gestione e visualizzazione di eventi in Puglia.  
Permette agli utenti di:
- visualizzare eventi pubblicati
- partecipare agli eventi
- visualizzare gli eventi su mappa
- comunicare tramite chat in tempo reale

Il progetto è responsive e funziona su desktop e dispositivi mobili.

---

## Tecnologie utilizzate

- Frontend: **React**, **Redux Toolkit**, **Material-UI**, **Styled-components**
- Mappe: **Google Maps API** (@vis.gl/react-google-maps)
- Backend: **Node.js + Express**
- Real-time: **Socket.io**
- Build e gestione pacchetti: **npm**
- Gestione immagini dei post: **Cloudinary**
- Sicurezza: **JWT e cookie per la gestione delle sessioni**

---

## Funzionalità principali

### Autenticazione e utenti
- Registrazione e login tramite **username o email + password**
- Due tipi di utenti:
  - **Organizzatore**
  - **Utente normale**
- Gestione sessioni tramite **JWT** e cookie

### Gestione account
- Modifica dei dati del proprio profilo

### Eventi
- Feed eventi con carosello e pulsanti di azione (partecipa, chat)
- Ordinamento eventi per data
- Filtri:
  - Eventi pubblicati dall’utente (organizzatore)
  - Eventi a cui si è iscritti
- Organizzatori possono:
  - **Pubblicare nuovi eventi**
  - **Modificare eventi esistenti**
- Tutti gli utenti possono:
  - **Iscriversi a un evento**
  - **Rimuovere la propria iscrizione**
- Mappa interattiva con tutti gli eventi:
  - Cluster di marker
  - InfoWindow con titolo, data, orario, indirizzo, prezzo
- Funzionalità di **“Mostra sulla mappa”** per singoli eventi

### Chat e notifiche
- Chat in tempo reale tra utenti
  - Selezione utente con cui chattare
- Notifiche real-time:
  - Nuovo messaggio
  - Nuova iscrizione (per organizzatori)

### Ricerca utenti
- Barra di ricerca per trovare altri utenti
- Possibilità di iniziare chat con utenti trovati

### Funzionalità tecniche
- Responsive design: desktop e mobile
- Scroll e caroselli fluidi per eventi
- Gestione immagini dei post tramite **Cloudinary**
- JWT e cookie per sicurezza delle sessioni

---
### Progetto sviluppato da Candela Roberto Saverio e Cilla Michele.
