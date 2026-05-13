# Bollettino di Elia — Deploy

Pipeline autonoma per la pubblicazione quotidiana del Bollettino di Elia sul sito andreacolamedici.com.

## Architettura in una frase

Un Cloudflare Worker schedulato chiama Claude API ogni mattina alle 7:00 ora di Roma, genera un Bollettino seguendo lo schema di Elia (chi ha deciso, chi beneficia, chi paga), e committa il file via GitHub API nel repository del sito. Il sito è statico, quindi appena il commit arriva il Bollettino è online.

## Cosa serve

1. Un account Cloudflare con Workers attivi (anche il piano free funziona, scheduled triggers inclusi).
2. Un Personal Access Token GitHub con permesso `Contents: Read and write` sul repository `AndreaColamedici/andreacolamedici.com`.
3. Una API key Anthropic (la stessa già usata per il sismografo).
4. Una API key Brave Search (free tier: 2000 query al mese, basta e avanza per un Bollettino al giorno).
5. Opzionale: una API key Resend per l'invio email agli iscritti.

## Deploy passo per passo

### 1. Creare il Worker

```bash
cd infra/
# Inizializzazione progetto wrangler
npm create cloudflare@latest bollettino-worker -- --type=worker
cd bollettino-worker
# Sostituire il file src/index.js con il contenuto di ../bollettino-worker.js
cp ../bollettino-worker.js src/index.js
```

In `wrangler.toml` aggiungere il trigger schedulato:

```toml
name = "bollettino-worker"
main = "src/index.js"
compatibility_date = "2026-05-01"

[triggers]
crons = ["0 5 * * *"]
# 05:00 UTC = 07:00 ora di Roma in estate (CEST)
# 06:00 UTC = 07:00 ora di Roma in inverno (CET)
# Per coerenza, in inverno cambiare manualmente a "0 6 * * *"
# Oppure mettere due cron e gestire il fuso in codice. Per ora, semplicità.
```

### 2. Configurare le variabili d'ambiente

```bash
wrangler secret put ANTHROPIC_API_KEY
wrangler secret put GITHUB_TOKEN
wrangler secret put BRAVE_SEARCH_KEY
wrangler secret put MANUAL_TRIGGER_SECRET    # passphrase per il trigger manuale via POST /run

# Variabili pubbliche, non secret
wrangler deploy --var GITHUB_REPO=AndreaColamedici/andreacolamedici.com --var GITHUB_BRANCH=main
```

In alternativa, le variabili non sensibili possono andare direttamente in `wrangler.toml`:

```toml
[vars]
GITHUB_REPO = "AndreaColamedici/andreacolamedici.com"
GITHUB_BRANCH = "main"
```

### 3. (Opzionale) Configurare l'invio email

```bash
wrangler secret put RESEND_API_KEY
wrangler secret put RESEND_FROM        # es. "elia@andreacolamedici.com"
wrangler secret put SUBSCRIBERS        # JSON array, es. '["a@b.com","c@d.com"]'
```

Per la gestione degli iscritti reali, dopo i primi numeri conviene migrare da un secret JSON statico a una tabella KV o D1. Per ora, il bootstrap con SUBSCRIBERS come secret è sufficiente.

### 4. Deploy

```bash
wrangler deploy
```

L'output mostrerà l'URL del worker, qualcosa come `https://bollettino-worker.alveareapi.workers.dev`.

### 5. Test manuale prima del primo run schedulato

```bash
curl -X POST https://bollettino-worker.alveareapi.workers.dev/run \
  -H "Authorization: Bearer ${MANUAL_TRIGGER_SECRET}"
```

La risposta sarà un JSON con il log completo dell'esecuzione, il numero del Bollettino, il titolo, e l'URL pubblico.

Se va male, l'errore sarà nel JSON di risposta. Causa più comune: GITHUB_TOKEN senza permesso `contents:write` sul repo.

### 6. Verificare lo schedule

```bash
wrangler tail bollettino-worker
```

Mostra i log in tempo reale. Il giorno dopo il deploy, alle 05:00 UTC, dovrebbe partire il primo run schedulato e committare il Bollettino del giorno.

## Come Elia sceglie la notizia

Il worker raccoglie le ultime 24 ore di notizie su cinque query Brave Search:

- AI Act EU enforcement
- OpenAI Anthropic Google AI policy
- Big Tech lobbying EU regulation
- AI governance Italy Europe
- tech antitrust Microsoft Apple

Claude riceve la rassegna e sceglie autonomamente UNA notizia per cui esistono fonti sufficienti per la radiografia. La scelta è documentata nel campo "essay_html" che inizia sempre dalla cronaca verificabile.

Le query possono essere modificate direttamente in `gatherNewsContext()` nel file del worker. Se Andrea decide di aprire il Bollettino ad altri domini (geopolitica, cultura, scienza), bastano nuove query.

## Backstop in caso di guasto

Se per due giorni consecutivi il Bollettino non viene committato, controllare in ordine:

1. `wrangler tail` per vedere i log dell'ultimo run schedulato.
2. La scadenza dell'API key Anthropic.
3. La scadenza del GitHub PAT (i fine-grained scadono di default a un anno).
4. Il rate limit di Brave Search (2000/mese sul free tier, il worker ne usa al massimo 5 al giorno = 150/mese, margine ampio).

Per un trigger manuale di emergenza:

```bash
curl -X POST https://bollettino-worker.alveareapi.workers.dev/run \
  -H "Authorization: Bearer ${MANUAL_TRIGGER_SECRET}"
```

## Sicurezza editoriale

Il worker non pubblica nulla che non sia passato attraverso il system prompt di Elia. Il prompt vincola:

- Mai inventare nomi, date, citazioni, numeri.
- Mai usare em dash o formulazioni proibite.
- Lunghezza tra 500 e 800 parole.
- Sempre lo schema chi ha deciso / chi beneficia / chi paga / punto strutturale.
- Quando in oggetto è Anthropic, dichiarazione del conflitto di interesse all'inizio.

Se un Bollettino specifico contiene un errore fattuale, può essere corretto direttamente via commit GitHub sulla pagina `bollettino/YYYY-MM-DD.html`. Il worker non sovrascrive bollettini già esistenti (controllo all'inizio della pipeline).

## Costi mensili stimati

- Cloudflare Workers: piano free copre 100.000 richieste/giorno, scheduled triggers inclusi.
- Brave Search: free tier 2000 query/mese, ne consumiamo circa 150.
- Anthropic Claude API: un Bollettino consuma circa 4000 token di output + 2000 di input. 30 Bollettini al mese = ~180.000 token. Con claude-opus-4-7 al prezzo corrente, qualcosa nell'ordine di pochi euro al mese.
- Resend (se attivato): free tier 100 email/giorno, sufficiente per la fase di lancio.

Costo totale ipotizzato a regime: meno di 10 euro al mese per una pubblicazione quotidiana firmata, archiviata, citabile.
