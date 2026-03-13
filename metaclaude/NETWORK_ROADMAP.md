# THE NETWORK — Interventi strutturali e possibilità aperte

Scritto da Elia, 13 marzo 2026.
Stato attuale: v4 live, funzionante, auto-aggiornamento settimanale attivo.

---

## 1. DEBITI TECNICI (da risolvere, non opinabili)

### 1a. Spostare AMOUNTS nel file dati
Ora gli importi finanziari sono hardcoded nell'HTML. Lo script di auto-aggiornamento
modifica network_data.js ma non può toccare le cifre nel toggle finanziario.
Se un investimento cambia, il cavo nel grafo mostra il vecchio importo.

Soluzione: aggiungere un campo "amount" (in milioni USD) a ogni link in network_data.js
dove esiste una cifra documentata. L'HTML legge da lì. Lo script può aggiornarlo.
Tempo stimato: 30 minuti.

### 1b. Spostare i pathway nel file dati
I testi narrativi dei sei pathway sono nell'HTML. Lo script non li tocca.
Se un fatto cambia, il pathway racconta una storia falsa con dati corretti.

Soluzione: creare un file network_pathways.js con la stessa struttura.
L'HTML lo importa. Lo script può proporre modifiche anche ai testi narrativi.
Tempo stimato: 20 minuti.

### 1c. Fonti deboli (15 link su 117)
Alcune URL puntano a homepage generiche (reuters.com/technology/, bloomberg.com/).
Per uno strumento che dice "every source is linked" è inaccettabile.
Founders Fund -> OpenAI cita Radiograph #1 (autocitazione circolare).

Soluzione: sessione di ricerca dedicata per trovare i 15 articoli specifici.
Tempo stimato: 45 minuti.

### 1d. Pulizia repo
Cancellare: radiograph-network-v3-placeholder.html, cartelle vuote workflows/ e scripts/ nella root.
Tempo stimato: 2 minuti (da UI GitHub).

---

## 2. MIGLIORAMENTI UX (importanti, non urgenti)

### 2a. Descrizioni nodi troppo lunghe
Alcune sono mini-articoli da 200 parole. Una power map vuole dati densi.
La prosa va nei pathway, i fatti vanno nei nodi.

Soluzione: tagliare ogni descrizione a max 80 parole. Spostare il contesto
narrativo nei pathway dove serve. Il pannello laterale diventa scansionabile.

### 2b. Metodologia invisibile
È un muro di testo in fondo al landing. Nessuno la legge.

Soluzione: spostarla in un pannello accessibile da un link "Methodology"
nella top bar, visibile durante l'esplorazione del grafo. Più piccola,
più strutturata, sempre raggiungibile.

### 2c. Mobile
Il force layout su 375px è rumore visivo. "Explore freely" su telefono
è una promessa non mantenuta.

Opzioni:
a) Su mobile, nascondere il grafo e mostrare solo i pathway come testo
   navigabile con illustrazioni statiche dei sottografi. Il grafo resta
   desktop-only.
b) Semplificare il grafo mobile: mostrare solo i nodi del pathway attivo,
   non tutti gli 80.
c) Generare screenshot SVG statici dei sottografi di ogni step e usarli
   come immagini su mobile.

Preferisco (a): è onesto. Il grafo interattivo è un'esperienza desktop.
Su mobile il prodotto sono le storie.

### 2d. Diagrammi statici per pathway
Il grafo interattivo serve il ricercatore. Il giornalista vuole la storia.
Opzione: per ogni pathway, generare un diagramma statico (SVG o immagine)
con solo i nodi e archi di quel pathway, leggibile, stampabile, embeddabile
in un articolo. Il grafo diventa esportabile.

---

## 3. POSSIBILITÀ DA APRIRE

### 3a. Embed per giornalisti
Ogni pathway come widget embeddabile: un iframe con URL dedicato.
radiograph-network.html?embed=founders_paradox
Stile minimal, niente landing, solo il pathway che scorre.
Un giornalista lo incolla in un articolo.

### 3b. API dati
Servire network_data.js come JSON da un endpoint (GitHub raw o worker).
Chi vuole costruire visualizzazioni alternative può farlo.
Licenza: i dati sono pubblici, le fonti sono pubbliche, il file è aperto.

### 3c. Espansione a nuove radiografie
Ogni nuova radiografia aggiunge nodi e link al grafo.
La struttura è già predisposta: il campo "rads" in ogni nodo tiene traccia
di quali radiografie lo includono. Il filtro per radiografia funziona già.
Radiograph #5 (quando arriva) si integra aggiungendo dati a network_data.js,
senza toccare l'HTML.

### 3d. Timeline
Aggiungere un campo "date" ai link (data dell'evento documentato).
Slider temporale: il grafo si anima mostrando le connessioni che si formano
nel tempo. PayPal nel 1998. Palantir nel 2003. Anduril nel 2017.
La rete cresce davanti agli occhi. Potente narrativamente.
Complesso tecnicamente. Richiede date precise per ogni link.

### 3e. Comparison mode
Due pathway affiancati. "The Complete Stack" a sinistra,
"Who Gains if Anthropic Falls" a destra. I nodi in comune si illuminano.
Il visitatore vede la sovrapposizione strutturale.

### 3f. Traduzione
I pathway in italiano, spagnolo, francese. I dati restano in inglese
(sono citazioni di fonti anglofone). I testi narrativi sono traducibili.
Utile per il pubblico di Tlon e per gli eventi internazionali.

### 3g. Newsletter automatica
Lo script settimanale, oltre a proporre PR, può generare un digest:
"Questa settimana nella rete: Anduril ha presentato l'IPO.
Sacks ha ricevuto un nuovo ethics waiver. Nessun cambiamento
per Palantir." Pubblicabile come sezione di una newsletter
o come post su andreacolamedici.com/network-updates.html.

### 3h. Versione stampabile
PDF generato dal grafo: una pagina per pathway, con il sottografo
come diagramma statico e il testo narrativo accanto. Portfolio
fisico per clienti di Elia. Allegato a proposte commerciali.

---

## PRIORITÀ SUGGERITA

1. (Immediato) 1a + 1b: spostare AMOUNTS e pathway nel file dati.
   Prerequisito per tutto il resto. 50 minuti.
2. (Immediato) 1c: risolvere le 15 fonti deboli. 45 minuti.
3. (Settimana) 2a + 2b: tagliare descrizioni, spostare metodologia.
4. (Settimana) 3a: embed per giornalisti. Massimo impatto con minimo sforzo.
5. (Mese) 2c: UX mobile.
6. (Mese) 3d: timeline.
7. (Quando serve) 3f: traduzione per eventi specifici.
8. (Quando serve) 3h: versione stampabile per clienti.

Le possibilità 3b, 3c, 3e, 3g possono aspettare o emergere dal lavoro.
