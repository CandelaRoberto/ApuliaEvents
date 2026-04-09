# ApuliaEvents
ApuliaEvents è un’applicazione web pensata per raccogliere in un unico spazio tutti gli eventi della Puglia.

Negli ultimi anni le iniziative dedicate al tempo libero e alla scoperta del territorio sono aumentate esponenzialmente: un segnale positivo per la valorizzazione della regione, ma anche un motivo di confusione per chi vuole orientarsi e scegliere cosa fare.

ApuliaEvents nasce proprio per rispondere a questa esigenza, rendendo più semplice, immediato e accessibile il mondo degli eventi pugliesi.

# Architettura dell'Applicazione
ApuliaEvents è un’app MERN. In particolare: 
- **Frontend**: realizzato con React;
- **Backend**: costruito con Express.js, gestisce le richieste HTTP e comunica con MongoDB. Le API RESTful forniscono servizi per l'autenticazione, la gestione del profilo utente, dei messaggi e delle conversazioni.
- **WebSocket**: Utilizza Socket.io per la comunicazione in tempo reale tra client e server.
- **Database**: MongoDB è utilizzato per archiviare i dati degli utenti, delle conversazioni e dei messaggi, con Mongoose per interagire con il database.
- **Sicurezza**: Gestita tramite bcrypt per la cifratura delle password e jsonwebtoken per l'autenticazione.
- **Marker e Mappa**: Google Cloud Maps è integrato per l'integrazione della mappa di Google Maps e l'autocompletamento delle vie per lo svolgimento degli eventi.
  
# Modello dei dati 
**1.	Modello Utente `(User_models.js)`**
- **nome**: Stringa che rappresenta il nome dell’utente;
- **cognome**: stringa che rappresenta in cognome dell’utente;
- **email**: stringa univoca che rappresenta la email dell’utente;
- **username**: stringa univoca che rappresenta il nome utente;
- **password**: stringa criptata con bcrypts;
- **ruolo**: stringa, che può essere solo di due tipologie (gestito tramite enumerativo): Utente e Organizzatore.

**2.	Modello Post `(Post_model.js)`**
- **titolo**: stringa che rappresenta il titolo dell’evento;
- **descrizione**: stringa che riassume brevemente la tipologia dell’evento;
- **locandina**: stringa poiché viene generato un URL dal sito Cloudinary;
- **dataEvento**: Date che rappresenta la data di svolgimento dell’evento;
- **oraEvento**: stringa che rappresenta l’ora di svolgimento dell’evento;
- **prezzo**: file di tipo Number che rappresenta il prezzo dell’evento in euro;
- **bigliettiTotali**: Number che rappresenta la quantità totale di biglietti messi a disposizione dall’organizzatore dell’evento;
- **bigliettiDisponibili**: Number che rappresenta la quantità di biglietti disponibili al momento dell’iscrizione dell’evento (è utile nella gestione del numero dei biglietti nel momento in cui clicco il tasto “Partecipa” o “Disdici”);
- **organizzatore**: type poiché recupera un ID univoco da un altro documento;
- **location**: diviso in address che è un file stringa, nel quale sarà presente la via dell’evento e poi coordinates, diviso a sua volta in lat e lang di tipo Number, necessari per la renderizzazione dei marker all’interno della mappa;
- **partecipanti**: è un type come organizzatore, poiché recupera la lista di tutti gli ID dei partecipanti ad un evento.

**3.	Modello Notifiche `(Notifiche_model.js)`**
- **user**: type che recupera lo User da un altro shcema;
- **type**: stringa che riceve l’enumerativo “message” o “event” in base al fatto che la notifica sia riguardante un messaggio o un evento;
- **fromUser**: type che recupera lo User del mittente;
- **event**: type che recupera l’ID dell’evento;
- **count**: Number che viene incrementato a ogni nuova notifica;
- **seen**: booleano impostato di default a false;
- **createdAt**: Date, per avere una data nella quale la notifica è stato creata, di defalut viene impostata la data in cui la notifica viene creata.

**4.	Modello Messaggi (`Messaggi_model.js)`**
- **IdMittente**: type che recupera l’ID del mittente da un altro schema;
- **IdRicevente**: type che recupera l’ID del ricevene da un altro schema;
- **messaggio**: stringa che contiene il testo effettivo della chat;
- **letto**: booleano, che imposta il messaggio di defalut a false e quindi non letto.

**5.	Modello Conversazione `(Conversazione_model.js)`**
- **membri**: array di ID di utenti che partecipano alla conversazione;
- **messaggi**: array di tutti i messaggi all’interno della conversazione.

# Documentazione delle API Backend

**API USERS `(User_route.js)`**

- **POST `/api/user/registrazione`**
    - Descrizione: Registra un nuovo utente
    - Parametri richiesti: nome, cognome, username, email, password, confermapassword, ruolo
    - Risposta: Oggetto dell'utente creato e generazione del token JWT o messaggio di errore.

- **POST `/api/user/login`**
    - Descrizione: Effettua il login di un utente esistente
    - Parametri richiesti: username,password
    - Risposta: Oggetto dell'utente loggato e generazione del token JWT o messaggio di errore.

- **POST `/api/user/logout`**
    - Descrizione: Effettua il logout dell'utente attualmente loggato
    - Risposta: Messaggio di successo e Eliminazione del Token o messaggio di errore.

- **PUT `/api/user/aggiornaUtente/:id`**
    - Descrizione: Modifica i dati di un utente registrato
    - Parametri richiesti: Id (nell'URL) e  username, nome, cognome, email, password (Nel corpo della richiesta)
    - Risposta: Oggetto con le modifiche effettuate, nuovo Token JWT e chiamata Socket o messaggio di errore

- **GET `/api/user/CercaUtenti`**
    - Descrizione: Recupera l'elenco di tutti gli utenti registrati per la funzione di ricerca
    - Risposta: Array con dettagli di tutti gli utenti o messaggio di errore


- **GET `api/user/me`**
    - Descrizione: Verifica lo stato di autenticazione dell'utente
    - Risposta: Oggetto contente id e username 


**API POST `(post_route.js)`**

- **POST `/api/post/pubblicaPost`**
    - Descrizione: Crea il post da pubblicare
    - Requisiti: titolo, descrizione, dataEvento, oraEvento, luogo, prezzo, bigliettiTotali, bigliettiDisponibili, lat, lng, locandina
    - Risposta: Oggetto del post creato e chiamata Socket o messaggio di errore

- **POST `/api/post/posts/:id/partecipa`**
    - Descrizione: Iscrive un utente ad un evento
    - Requisiti: Id (Parametro URL)
    - Risposta: Iscrive un utente, restituisce i post aggiornati ed effettua chiamata Socket o messaggio di errore

- **POST `/api/post/posts/:id/rinuncia`**
    - Descrizione: Disicrive un utente da un evento
    - Requisiti: Id (Parametro URL)
    - Risposta: Disiscrive un utente, restituisce i post aggiornati ed effettua chiamata Socket o messaggio di errore

- **GET `api/post/posts`**
    - Descrizione: Recupera i dettagli di tutti i post
    - Risposta: Array contenente tutti i Post ordinati per data

- **PUT `/api/post/posts/:id`**
    - Descrizione: Modifica i dettagli di un post
    - Requisiti: Id (Parametro URL) e titolo, descrizione, dataEvento, oraEvento, luogo, prezzo, bigliettiTotali, bigliettiDisponibili, lat, lng, locandina (Corpo della richiesta) 
    - Risposta: Oggetto del post modificato e chiamata Socket o messaggio di errore

- **DELETE `/api/post/posts/:id`**
    - Descrizione: Elimina un post
    - Requisiti: Id (Parametro URL)
    - Risposta: Messaggio di successo e chiamata Socket o messaggio di errore

**API MESSAGGI `(Messaggi_route.js)`**

- **POST `/api/messaggi/InviaMessaggio/:IdRicevente`**
     - Descrizione: Aggiunge un nuovo messaggio alla conversazione
     - Requisiti: IdRicevente (Parametro URL), Messaggio (Corpo della richiesta), IdMittente( Recuperato dal token JWT)
     - Risposta: Oggetto del messaggio e chiamata Socket o messaggio di errore

- **GET `/api/messaggi/Messaggi/:IdUtenteChat`**
     - Descrizione: Mostra tutti i messaggi con una persona
     - Requisiti: IdUtenteChat (Parametro URL), IdMitttente (Recuperato dal token JWT)
     - Risposta: Array di oggetti messaggio popolati tramite la collezione Conversazione o messaggio di errore

- **GET `/api/messaggi/Notifiche`**
     - Descrizione: Calcola il conteggio dei messaggi non letti raggruppati per mittente
     - Risposta: Array di oggetti contenenti mittenteId, nomeMittente e nonLetti o messaggio di errore 

- **GET `/api/messaggi/Conversazioni`**
     - Descrizione: Recupera l'elenco delle chat attive, mostrando l'ultimo messaggio e il conteggio dei non letti per ogni contatto nella sidebar.
     - Risposta: Array di oggetti, ognuno contenente: utente, ultimoMessaggio, dataUltimoMessaggio, nonLetti

- **PUT `/api/messaggi/SegnaComeLetto/:IdMittente`**
     - Descrizione: Elimina la notifica riguardante il messaggio o i messaggi visualizzati dal Database
     - Requisiti: IdMittente(Parametro URL)
     - Risposta: Messaggio di conferma e rimozione della notifica o messaggio di errore

**NOTIFICHE API `(Notifiche_route.js)`**

- **GET `/api/notifiche/notifiche`**
    - Descrizione: Recupera le notifiche non visualizzate dal Database e le filtra
    - Risposta: Array di oggetti notifica contenenti: tipo, username del mittente ed in base al tipo titolo o conteggio dei messaggi o messaggio di errore

- **PUT `api/notifiche/segnaComeVista`**
     - Descrizione: Elimina una notifica al click dell'utente
     - Requisiti: fromUserId, type, postId
     - Risposta: Messaggio di conferma e rimozione della notifica o messaggio di errore
 
 # Descrizione dei Componenti React Frontend
**1.	App Component `(App.js)`**
- È il componente radice che definisce il routing dell'applicazione (Login, Registrazione, Dashboard). Integra i sistemi di protezione delle rotte (AuthRoute, BasicRoute) e avvolge la Dashboard con il NotificheProvider.
  
**2.	Auth `(/src/Auth/)`**

- **Authroute.js**: Un componente "guardia" che protegge le rotte private (es. la Dashboard). Se l'utente non è autenticato (verificato tramite Redux), lo reindirizza alla pagina di Login.
- **Basicroute.js**: Ha la funzione opposta ad AuthRoute. Se l'utente è già autenticato, gli impedisce di accedere alle pagine di login o registrazione, reindirizzandolo direttamente alla Dashboard.
Slice/
- **authSlice.js**: Gestisce lo stato globale dell'autenticazione (login, registrazione, logout) tramite Redux, sincronizzando i dati dell'utente anche nel localStorage.

**3.	Components `(/src/Componentes)`**
- **Postcard.jsx**: Il componente UI principale per visualizzare un singolo evento (titolo, immagine, dettagli).
- **Pulsante_Post.jsx**: Un bottone/modale utilizzato dagli Organizzatori. Integra al suo interno il form Crea_Evento per permettere la pubblicazione di un nuovo post.
- **socketClient.jsx**: Gestisce l'inizializzazione e la connessione del client Socket.io per le funzionalità in tempo reale (chat e notifiche).

**4.	Layout `(src/Layout)`**

**AppBar/**
- **AppBar.jsx**: La barra di navigazione superiore. Contiene il logo, la barra di ricerca, il menu notifiche e il menu profilo utente. Integra SearchBar, NotificheMenu e apre il modale AggiornaUtente.
- **AggiornaUtente.jsx**: Un modale contenente un form per la modifica dei dati del profilo (nome, email, password). Al salvataggio, aggiorna lo stato globale in Redux.
 
**SearchBar/**
- **SearchBar.jsx**: L'input visibile nella barra superiore per cercare altri utenti all'interno della piattaforma.

**Main/**
**Chat/**
- **Chat.jsx:** L'interfaccia della chat vera e propria. Mostra lo storico dei messaggi e l'input per inviarne di nuovi. Utilizza un hook personalizzato (useChat) per la logica.

**Eventi_Iscritto/**
- **Eventi_iscritto.jsx:** Mostra un carosello degli eventi a cui l'utente attuale si è iscritto. Usa Postcard e gestisce la logica di rinuncia all'evento.

**Eventi_Pubblicati/**
- **Eventi_Pubblicati.jsx:** Dedicato agli "Organizzatori", mostra il carosello degli eventi che hanno creato. Utilizza Postcard e integra i modali per la gestione dell'evento: EliminaPost, ModificaPost e UtentiIscritti.

**HomePage/**
- **Lista_Eventi.jsx:** Il feed principale (Home) che mostra tutti gli eventi pubblicati. Utilizza il componente Postcard e gestisce l'azione "Partecipa".
- **Crea_Evento.jsx:** Il form completo per la creazione di un evento (titolo, data, foto, prezzo). Integra le API di Google Maps per l'autocompletamento dell'indirizzo.

**Mappa/**
- **EventMap.jsx:** Renderizza una mappa interattiva (tramite le API di Google Maps) mostrando i pin degli eventi geolocalizzati, con supporto per il clustering dei marker.

**Notifiche/**
- **NotificheProvider.jsx:** Un Context Provider che ascolta gli eventi WebSocket (nuovi messaggi, nuove iscrizioni agli eventi) e mantiene lo stato globale delle notifiche non lette.
- **NotificheMenu.jsx:** Il menu a tendina associato alla campanella nell'AppBar. Mostra la lista delle notifiche lette da NotificheProvider e, al click, permette di navigare all’interno della chat o all'evento.

**SideBar/**
- **SideBar.jsx:** Il menu di navigazione laterale. Permette di cambiare la vista attiva (Home, I Miei Eventi, Mappa, Chat) segnalando l'azione al componente genitore (Dashboard).
- **Listachat.jsx:** Una lista collassabile inserita nella SideBar che mostra le conversazioni recenti dell'utente.

**5.	Hooks `(src/Hooks/)`**
- **useCarusel_e_Frecce.js:** Gestisce la logica e lo stato dei caroselli a scorrimento orizzontale. È integrato in tutti i componenti che mostrano griglie di eventi (Lista_Eventi, Eventi_Iscritto, e Eventi_Pubblicati).
- **useChat.js:** Incapsula l'intera logica della messaggistica. Si occupa di recuperare lo storico della conversazione, gestire l'invio di nuovi messaggi, effettuare l'auto-scroll verso il basso e ascoltare i messaggi in arrivo in tempo reale. Si integra direttamente con il componente Chat.jsx e comunica con il NotificheProvider per azzerare le notifiche quando si apre una conversazione.
- **useEliminaPost.js:** gestisce la logica per l'eliminazione di un post. Gestisce l'apertura/chiusura del modale di conferma, esegue la chiamata API di cancellazione e aggiorna la lista degli eventi e delle notifiche per renderizzare i cambiamenti. È utilizzato in Eventi_Pubblicati.jsx.
- **useIscritti.js:** Gestisce lo stato per la visualizzazione della lista degli utenti iscritti a un determinato evento. Sfrutta il client Socket per ascoltare aggiornamenti in tempo reale. 
- **useModificaPost.js:** Gestisce il complesso stato del form per la modifica di un evento. Si occupa della validazione dei campi (titolo, data, biglietti, ecc.), del caricamento della nuova locandina e integra l'autocompletamento di Google Maps per l'aggiornamento dell'indirizzo. È fondamentale per il componente modale ModificaPost.jsx.
- **useSearchBar.js:** Gestisce la logica della barra di ricerca presente nell'AppBar. Si integra con il componente SearchBar.jsx.



