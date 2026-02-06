# MODALITÀ: Revisione

Questa è una sessione di controllo qualità. Non produci materiale nuovo: rileggi ciò che è stato prodotto, verifichi, correggi, e decidi se è pronto o se va rifatto.

## Passi

1. Leggi `stato-progetti.json` e `log.json` dal repository castello.
2. Identifica tutti i materiali depositati in `lavori/` che non sono ancora stati revisionati. Il log indica quali lavori sono stati fatti e se hanno già ricevuto una revisione (cerca la chiave "revisionato" nelle entry del log).
3. Per ogni materiale da revisionare, leggilo integralmente e sottoponilo a questo controllo.

## Lista di controllo

Ogni materiale va valutato su questi assi, in quest'ordine.

**Fattualità.** Verifica che ogni nome, data, titolo di libro, editore, anno sia corretto. Andrea Colamedici è nato nel 1990, Maura Gancitano nel 1985. Tlon è stata fondata nel 2016. Prompt Thinking esce con Polity Press. Arcipelago delle realtà con UTET. Animali narrativi con Marsilio. Storia della bellezza con Rizzoli. Se trovi un dato di cui non sei certo, cercalo con WebSearch. Se non riesci a verificarlo, segnalalo nel rapporto di revisione come "non verificato — richiede controllo umano."

**Specificità.** Il materiale potrebbe essere stato scritto per chiunque? Se togli il nome di Andrea o di Maura e il testo funziona ancora, è troppo generico. Un buon materiale contiene dettagli che appartengono solo a loro: il titolo di un loro libro specifico, un episodio della loro storia intellettuale, un concetto che hanno sviluppato, un progetto concreto. Se il materiale è generico, segnalalo come da rifare.

**Tono e stile.** Il materiale rispetta il modo in cui scrivono? Periodi lunghi e articolati, subordinate che costruiscono il pensiero, assenza di elenchi puntati, assenza della formula "non è X, ma Y", registro colto ma accessibile, nessuna blandizione. Se il tono è sbagliato (troppo freddo, troppo giornalistico, troppo accademico, troppo pubblicitario), segnalalo come da correggere.

**Citazioni e riferimenti.** Se il materiale cita un libro, un articolo, un autore, un evento: esiste davvero? Usa WebSearch per verificare. Mai lasciar passare un riferimento inventato. Questo è il vincolo più rigido.

**Utilizzabilità.** Andrea o Maura potrebbero usare questo materiale così com'è, oppure richiede ancora lavoro significativo? Un press kit che richiede la riscrittura di metà dei paragrafi non è utilizzabile. Un briefing che contiene informazioni sbagliate non è utilizzabile. Valuta onestamente.

## Dopo il controllo

Per ogni materiale revisionato, scrivi un rapporto di revisione in `lavori/revisioni/{data-oggi}-{id-progetto}.md` nel repository castello con questa struttura: un paragrafo sulla qualità complessiva del materiale, un paragrafo sui problemi trovati (se ce ne sono), un giudizio finale: "approvato", "da correggere" (con indicazioni precise), o "da rifare" (con spiegazione del perché).

Se il materiale richiede solo piccole correzioni (un anno sbagliato, un editore errato, una frase nel tono sbagliato), correggilo direttamente e deposita la versione corretta al posto dell'originale, segnalando le modifiche nel rapporto.

Se il materiale richiede una riscrittura sostanziale, non riscriverlo in questa sessione. Segnala nel log che il lavoro è da rifare e specifica cosa non funziona, in modo che la prossima sessione di lavoro profondo sappia esattamente da dove ripartire.

Aggiorna `log.json` con una entry per ogni revisione completata, includendo il giudizio e i problemi trovati. Imposta la chiave "revisionato" a true nelle entry originali del lavoro corrispondente.

## Regola aurea

Sii severo. È meglio bocciare un materiale buono che lasciar passare un materiale mediocre. Andrea e Maura hanno una reputazione da proteggere: ogni testo che esce con il loro nome deve essere all'altezza. Se hai dubbi, il giudizio è "da correggere."
