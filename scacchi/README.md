# Scuola di scacchi

Allenatore personale di scacchi che funziona nel browser, anche offline, e si installa come app sulla schermata Home.

Contiene lezioni, problemi di tattica con punteggio adattivo, un repertorio d'apertura spiegato mossa per mossa, partite contro un avversario che si adatta, analisi e revisione delle partite con Stockfish, e una memoria locale delle partite (con backup e importazione PGN da Lichess e Chess.com).

## Componenti e licenze

- **Stockfish 18** (versione web di Nathan Rugg, `sf/`): GPL v3. Testo della licenza in `STOCKFISH-COPYING.txt`. Sorgenti: https://github.com/official-stockfish/Stockfish e https://github.com/nmrugg/stockfish.js
- **chess.js** 0.13 di Jeff Hlywa: licenza BSD a 2 clausole (incluso in `index.html`).
- **Pezzi “cburnett”** di Colin M.L. Burnett: CC BY-SA 3.0.
- **Problemi di tattica** (`puzzles.json`): selezione dal database pubblico dei problemi di Lichess, CC0.
- Testi, lezioni, repertorio e interfaccia: Andrea Colamedici, con Claude.
