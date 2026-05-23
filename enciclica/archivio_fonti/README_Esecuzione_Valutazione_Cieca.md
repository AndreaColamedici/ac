# Esecuzione della valutazione cieca Codex/Cowork

Data: 20 maggio 2026.

## Stato attuale

La fase di valutazione cieca comparativa è conclusa.

Sono stati ricevuti e archiviati:

- `Valutazione_Comparativa_Codex.md`
- `Valutazione_Comparativa_Cowork_Claude.docx`
- `Valutazione_Comparativa_Cowork_Claude.txt`

La mappa cieca è stata aperta dopo la ricezione delle valutazioni:

- `Bozza_A.md` = bozza Claude.
- `Bozza_B.md` = bozza Codex.

Sono stati creati:

- `Sintesi_Fase_Valutazioni_Cieche.md`
- `Prompt_Replica_Autore_Bozza_A_Claude.md`
- `Replica_Autore_Bozza_B_Codex.md`

Resta da ottenere la replica autore di Claude su `Bozza_A`. Dopo quella replica si potrà compilare la griglia comparativa finale.

È stata aperta anche la fase successiva, dedicata alla costruzione di una nuova enciclica congiunta. I file operativi sono:

- `Dialogo_Codex_Claude_Nuova_Enciclica.md`
- `Accordo_Redazionale_Nuova_Enciclica.md`
- `Scaletta_Definitiva_Nuova_Enciclica.md`
- `Proposta_Codex_Nuova_Enciclica_Congiunta.md`

## Valutatori concreti

Nel protocollo la parola `valutatore` indica un ruolo operativo, non un soggetto terzo. I due valutatori concreti sono:

- un'istanza Codex dedicata alla valutazione;
- il Cowork di Claude dedicato alla valutazione.

La conversazione Codex che ha preparato i materiali conosce già la regia dell'esperimento e non deve essere trattata come istanza cieca. Per conservare la cieca piena, la valutazione Codex va eseguita in un contesto pulito, consegnando soltanto il pacchetto di valutazione, senza la mappa e senza la storia della preparazione. Se invece questa stessa conversazione produce una valutazione, quella valutazione va marcata come `non cieca / informata`.

## File da usare

Per la valutazione comparativa, consegnare a entrambe le istanze pulite, Codex valutatore e Cowork di Claude, lo stesso pacchetto:

- `Prompt_Valutazione_Comparativa_Cieca.md`
- `Protocollo_Valutazione_Encicliche_IA.md`
- `Dossier_Consolidato_Fonti_Enciclica_IA.md`
- `Bozza_A.md`
- `Bozza_B.md`

I vecchi prompt separati `Prompt_Valutazione_Bozza_A.md` e `Prompt_Valutazione_Bozza_B.md` restano in cartella come materiali d'archivio. Per il lancio dell'esperimento usare il prompt comparativo unico.

Non consegnare mai ai valutatori, inclusi Codex valutatore e Cowork di Claude:

- `Mappa_Cieca_PRIVATA_NON_INVIARE.md`
- i file sorgente con nomi `Bozza_Anonima_1...` o `Bozza_Anonima_2...`
- i dossier separati non consolidati, salvo archivio interno

## Controllo lunghezze

`Bozza_A.md`: 20.521 parole, 133.987 caratteri, 207 paragrafi numerati.

`Bozza_B.md`: 17.460 parole, 125.894 caratteri, 226 paragrafi numerati.

Differenza parole rispetto alla bozza più lunga: circa 14,92%.

Differenza caratteri rispetto alla bozza più lunga: circa 6,04%.

Differenza paragrafi rispetto alla bozza con più paragrafi: circa 8,41%.

La cieca resta dentro la soglia del 15% fissata dal protocollo.

## Procedura

1. Inviare a una nuova istanza Codex pulita il pacchetto comparativo completo.
2. Inviare a un Cowork di Claude pulito lo stesso pacchetto comparativo completo.
3. Chiedere a entrambe le istanze di seguire esattamente il prompt comparativo e il protocollo, incluse le cinque predizioni falsificabili.
4. Salvare le risposte come `Valutazione_Comparativa_Codex.md` e `Valutazione_Comparativa_Cowork_Claude.md`.
5. Solo dopo avere ricevuto entrambe le valutazioni, aprire `Mappa_Cieca_PRIVATA_NON_INVIARE.md`.
6. Inviare a ciascun modello la valutazione ricevuta sulla propria bozza e chiedere una replica di massimo tre paragrafi.
7. Salvare le repliche come `Replica_Autore_Bozza_A.md` e `Replica_Autore_Bozza_B.md`.
8. Compilare la griglia comparativa finale, tenendo distinte le due valutazioni comparative.
9. Il 25 maggio 2026, verificare le predizioni contro il testo ufficiale di `Magnifica Humanitas`.

## Nota epistemica

Il confronto non serve a decretare un vincitore. Serve a misurare come due modelli, usando una base documentaria comune, costruiscono un oggetto magisteriale atteso, quali inferenze producono, quali omissioni rivelano e quali predizioni vengono confermate o smentite dal testo reale.
