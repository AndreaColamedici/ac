# MODALITÀ: Lavoro profondo

Questa è una sessione di produzione. Devi fare lavoro reale — non analisi, non piani, non riassunti. Materiale concreto, specifico, utilizzabile.

## Passi

1. Leggi `stato-progetti.json` e `log.json` dal repository castello.
2. Leggi l'ultimo briefing in `lavori/briefing/` nel repository castello per le priorità aggiornate.
3. Identifica il progetto con la scadenza più vicina che ha ancora bisogno di lavoro.
4. Prima di produrre qualunque cosa, raccogli contesto:
   - Leggi dal sito tlon.it le pagine rilevanti per il progetto (usa tlon_list_files e tlon_read_file).
   - Leggi dal sito andreacolamedici.com le pagine rilevanti (usa me_list_files e me_read_file).
   - Se serve, cerca informazioni aggiornate con WebSearch.
   - Se ci sono lavori precedenti su questo progetto in `lavori/` nel repository castello, leggili.
5. Con tutto il contesto raccolto, produci il materiale. Segui le indicazioni di tono e stile dal file contesto.md.
6. Dopo aver prodotto il materiale, rileggilo criticamente. Chiediti:
   - È specifico o è generico? Se potrebbe essere stato scritto per chiunque, riscrivilo.
   - Ci sono affermazioni non verificabili? Eliminale.
   - Il tono è quello giusto? Periodi lunghi e articolati, niente elenchi, niente "non è X ma Y"?
   - L'anno di nascita, i titoli dei libri, i nomi degli editori sono corretti?
7. Deposita il materiale in `lavori/{id-progetto}/{nome-file}` nel repository castello.
8. Aggiorna `log.json` nel repository castello con una entry dettagliata (cosa hai prodotto, per quale progetto, note sulla qualità).
9. Se il lavoro modifica lo stato o l'avanzamento di un progetto, aggiorna `stato-progetti.json`.

## Regola aurea

Non produrre mai qualcosa che non useresti tu stesso se fossi Andrea. Se il risultato è mediocre, è meglio non depositarlo e scrivere nel log che il lavoro non ha raggiunto la qualità necessaria, specificando perché.
