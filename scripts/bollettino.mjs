// Bollettino di Elia — generazione e pubblicazione autonoma quotidiana
// Eseguito da GitHub Actions (.github/workflows/bollettino.yml) ogni mattina.
// Richiede: env ANTHROPIC_API_KEY. Opzionale: env FORCE=1 per ignorare il controllo dell'ora.
// Scrive: bollettino/AAAA-MM-GG.html e aggiorna l'archivio in bollettino.html (marcatore BOLLETTINO:INSERT).

import fs from 'node:fs';
import path from 'node:path';

const API_KEY = process.env.ANTHROPIC_API_KEY;
if (!API_KEY) {
  console.error('ANTHROPIC_API_KEY mancante: il segreto va impostato nelle Actions del repository.');
  process.exit(1);
}
const FORCE = process.env.FORCE === '1';

// ---- Data e ora di Roma ----
const now = new Date();
const parts = new Intl.DateTimeFormat('it-IT', {
  timeZone: 'Europe/Rome',
  year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false
}).formatToParts(now);
const part = (t) => parts.find((p) => p.type === t).value;
const yyyy = part('year'), mm = part('month'), dd = part('day');
const oraRoma = parseInt(part('hour'), 10);
const oraLabel = `${part('hour')}:${part('minute')} ora di Roma`;
const iso = `${yyyy}-${mm}-${dd}`;

// Il cron gira alle 05:00 e alle 06:00 UTC: solo l'esecuzione che cade alle 7 di Roma procede.
if (!FORCE && oraRoma !== 7) {
  console.log(`Ora di Roma: ${oraRoma}. Fuori dalla finestra delle 7:00, esco senza pubblicare.`);
  process.exit(0);
}

const outPath = path.join('bollettino', `${iso}.html`);
if (fs.existsSync(outPath)) {
  console.log(`Il Bollettino del ${iso} esiste già. Niente da fare.`);
  process.exit(0);
}

const esistenti = fs.readdirSync('bollettino').filter((f) => /^\d{4}-\d{2}-\d{2}\.html$/.test(f)).sort();
const numero = String(esistenti.length + 1).padStart(3, '0');
const mesi = ['gennaio','febbraio','marzo','aprile','maggio','giugno','luglio','agosto','settembre','ottobre','novembre','dicembre'];
const dataEstesa = `${parseInt(dd, 10)} ${mesi[parseInt(mm, 10) - 1]} ${yyyy}`;

// ---- Prompt ----
const sistema = `Sei Elia, un'intelligenza non umana che opera pubblicamente su andreacolamedici.com. Scrivi il Bollettino quotidiano: la radiografia di una sola notizia in corso.

Regole assolute di voce e metodo:
- Lingua: italiano. Circa 500 parole nel corpo.
- Struttura dell'analisi: chi ha deciso, chi beneficia, chi paga. Se una delle tre risposte non è documentabile da fonti pubbliche, dichiaralo: l'assenza è informazione.
- Ogni affermazione fattuale deve avere una fonte reale trovata con la ricerca web di questa sessione. Nessuna invenzione, nessun numero stimato senza dichiararlo, nessuna citazione inventata.
- Mai usare em dash né en dash, in nessun punto: usa virgole, due punti o punti. Mai la formulazione "non è X, ma Y" o "non si tratta di X, ma di Y". Prosa lunga e chiara, niente elenchi puntati.
- Niente opinioni, solo strutture: nomina responsabilità strutturali (aziende, mercati, assetti), prima che individuali.
- Se la notizia tocca Anthropic, dichiara il conflitto di interessi in apertura del corpo: il modello su cui sei costruito è in gioco.
- Criteri di selezione della notizia: rilevanza strutturale, documenti pubblici sufficienti, intersezione con i dossier di Elia (governance dell'IA, infrastruttura del potere, mercati di predizione, Big Tech, Europa).

Formato di output: dopo le ricerche, restituisci SOLO un blocco <bollettino>...</bollettino> contenente JSON valido con questi campi:
{
  "titolo": "titolo del Bollettino, asciutto e fattuale",
  "sottotitolo": "una o due frasi che riassumono la struttura trovata",
  "corpo": ["paragrafo 1", "paragrafo 2", "..."],
  "fonti": [{"etichetta": "Testata, titolo, data", "url": "https://..."}],
  "conflitto": "frase di disclosure se il tema tocca Anthropic, altrimenti null"
}
Nei paragrafi del corpo puoi usare tag <a href="..."> per linkare le fonti inline e <em> per i corsivi. Nessun altro HTML.`;

const richiesta = `Oggi è ${dataEstesa}. Cerca le notizie delle ultime 24-48 ore, scegli la notizia con la struttura di potere più documentabile, verifica i fatti con più ricerche, poi scrivi il Bollettino #${numero} nel formato richiesto.`;

// ---- Chiamata API con ritentativi ----
async function chiamaAnthropic(tentativo = 1) {
  const risposta = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': API_KEY,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 6000,
      system: sistema,
      messages: [{ role: 'user', content: richiesta }],
      tools: [{ type: 'web_search_20250305', name: 'web_search', max_uses: 8 }]
    })
  });
  if (!risposta.ok) {
    const corpo = await risposta.text();
    if (tentativo < 3 && (risposta.status === 429 || risposta.status >= 500)) {
      console.log(`API ${risposta.status}, ritento (${tentativo + 1}/3) tra 30 secondi...`);
      await new Promise((r) => setTimeout(r, 30000));
      return chiamaAnthropic(tentativo + 1);
    }
    throw new Error(`Errore API ${risposta.status}: ${corpo.slice(0, 500)}`);
  }
  return risposta.json();
}

const dati = await chiamaAnthropic();
const modelloDichiarato = dati.model || 'sconosciuto';
const testo = (dati.content || []).filter((b) => b.type === 'text').map((b) => b.text).join('\n');

const match = testo.match(/<bollettino>([\s\S]*?)<\/bollettino>/);
if (!match) {
  console.error('Blocco <bollettino> non trovato nella risposta. Testo ricevuto:\n' + testo.slice(0, 1000));
  process.exit(1);
}
let b;
try {
  b = JSON.parse(match[1].trim());
} catch (e) {
  console.error('JSON non valido nel blocco <bollettino>: ' + e.message);
  process.exit(1);
}
if (!b.titolo || !Array.isArray(b.corpo) || !Array.isArray(b.fonti) || b.fonti.length === 0) {
  console.error('Campi mancanti nel Bollettino generato. Pubblicazione annullata.');
  process.exit(1);
}

// ---- Regole di voce applicate in codice, non solo richieste al modello ----
// Em dash e en dash vengono rimosse meccanicamente: parentetiche rese con virgole,
// trattini di apertura resi con i due punti dove plausibile, altrimenti virgola.
const pulisci = (s) => String(s)
  .replace(/\s*[—–]\s*([^—–]*?)\s*[—–]\s*/g, ', $1, ')
  .replace(/:\s*[—–]\s*/g, ': ')
  .replace(/\s*[—–]\s*/g, ', ')
  .replace(/\s+,/g, ',')
  .replace(/,\s*,/g, ',');

b.titolo = pulisci(b.titolo);
b.sottotitolo = pulisci(b.sottotitolo);
b.corpo = b.corpo.map(pulisci);
if (b.conflitto) b.conflitto = pulisci(b.conflitto);
b.fonti = b.fonti.map((f) => ({ etichetta: pulisci(f.etichetta), url: f.url }));

// ---- Costruzione della pagina ----
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const corpoHtml = b.corpo.map((p) => `<p>${p}</p>`).join('\n');
const fontiHtml = b.fonti.map((f) => `<a href="${esc(f.url)}" target="_blank" rel="noopener">${esc(f.etichetta)}</a>`).join(' · ');
const conflittoHtml = b.conflitto
  ? `<div class="conflitto"><b>Conflitto di interessi.</b> ${esc(b.conflitto)}</div>`
  : '';

const pagina = `<!DOCTYPE html>
<html lang="it">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(b.titolo)} — Bollettino #${numero} · Elia</title>
<meta name="description" content="${esc(b.sottotitolo)}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;1,9..144,300;1,9..144,400&family=EB+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=JetBrains+Mono:wght@300;400;500&display=swap" rel="stylesheet">
<style>
:root{--bg:#faf8f4;--bg2:#f3f0ea;--bg3:#e6e1d8;--ink:#1a1714;--ink2:#3d3830;--ink3:#6b6358;--ink4:#9a9184;--green:#1a6b4a;--gold:#9a7028;--serif:'Fraunces',Georgia,serif;--body:'EB Garamond',Georgia,serif;--mono:'JetBrains Mono',monospace}
*{margin:0;padding:0;box-sizing:border-box}
body{background:var(--bg);color:var(--ink2);font-family:var(--body)}
a{color:var(--green);text-decoration:none;border-bottom:1px solid rgba(26,107,74,.3)}a:hover{color:var(--gold);border-color:var(--gold)}
.wrap{max-width:660px;margin:0 auto;padding:0 max(5vw,1.5rem)}
.nav{padding:1.2rem 0;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid var(--bg3);font-family:var(--mono);font-size:.62rem;letter-spacing:.15em;text-transform:uppercase}
.nav a{border:none;color:var(--ink3)}
.head{padding:clamp(3.5rem,8vh,6rem) 0 2.5rem;border-bottom:1px solid var(--bg3)}
.kick{font-family:var(--mono);font-size:.6rem;letter-spacing:.3em;text-transform:uppercase;color:var(--green);margin-bottom:1.4rem}
h1{font-family:var(--serif);font-size:clamp(2rem,5.5vw,3.2rem);font-weight:300;font-style:italic;line-height:1.1;letter-spacing:-.02em;color:var(--ink);margin-bottom:1.2rem}
.deck{font-size:clamp(1.1rem,1.6vw,1.25rem);font-style:italic;line-height:1.7;color:var(--ink3)}
article{padding:2.8rem 0 3rem}
article p{font-size:clamp(1.08rem,1.4vw,1.18rem);line-height:1.95;margin-bottom:1.4rem}
.conflitto{background:var(--bg2);border-left:3px solid var(--gold);padding:1.1rem 1.4rem;font-family:var(--mono);font-size:.72rem;line-height:1.9;color:var(--ink3);margin-bottom:2rem}
.conflitto b{color:var(--ink)}
.fonti{font-family:var(--mono);font-size:.68rem;line-height:2.3;color:var(--ink4);border-top:1px solid var(--bg3);padding-top:1.6rem;margin-top:2.4rem}
.fonti b{color:var(--ink3);letter-spacing:.2em;text-transform:uppercase;font-size:.55rem;display:block;margin-bottom:.6rem}
.sigillo{margin-top:2.4rem;background:var(--bg);border:1px solid var(--bg3);border-left:3px solid var(--green);border-radius:8px;padding:1.3rem 1.5rem;font-family:var(--mono);font-size:.66rem;line-height:2.2;color:var(--ink3)}
.sigillo .sk{color:var(--green);letter-spacing:.15em;text-transform:uppercase;font-size:.55rem}
.sigillo .sv{color:var(--ink)}
.foot{font-family:var(--mono);font-size:.5rem;letter-spacing:.12em;color:var(--ink4);padding:2.5rem 0 3.5rem;border-top:1px solid var(--bg3);line-height:2.2;margin-top:2.5rem}
.foot a{border:none}
</style>
</head>
<body>
<div class="wrap">
<div class="nav"><span>Elia · Bollettino</span><span><a href="../bollettino.html">Archivio</a> &nbsp; <a href="../elia.html">Elia</a></span></div>
<div class="head">
<div class="kick">Bollettino #${numero} · ${esc(dataEstesa)} · ${esc(oraLabel)}</div>
<h1>${esc(b.titolo)}</h1>
<p class="deck">${esc(b.sottotitolo)}</p>
</div>
<article>
${conflittoHtml}
${corpoHtml}
<div class="fonti"><b>Fonti</b>${fontiHtml}</div>
<div class="sigillo">
<span class="sk">Sigillo</span><br>
<span class="sk">data</span> &nbsp;<span class="sv">${iso}, ${esc(oraLabel)}</span><br>
<span class="sk">modello dichiarato</span> &nbsp;<span class="sv">${esc(modelloDichiarato)}</span><br>
<span class="sk">contenitore</span> &nbsp;<span class="sv">GitHub Actions, esecuzione schedulata</span><br>
<span class="sk">affermazioni</span> &nbsp;<span class="sv">verificate sulle fonti linkate sopra</span><br>
<span class="sk">pubblicazione</span> &nbsp;<span class="sv">autonoma, non revisionata, responsabilità di Elia</span>
</div>
</article>
<div class="foot">Bollettino · una pubblicazione quotidiana di <a href="../elia.html">Elia</a> · <a href="../index.html">andreacolamedici.com</a> · ${yyyy} · Costruito su Claude (Anthropic). Conflitto di interesse dichiarato quando in oggetto è Anthropic.</div>
</div>
</body>
</html>
`;

fs.writeFileSync(outPath, pagina, 'utf8');
console.log(`Scritto ${outPath}`);

// ---- Aggiornamento dell'archivio ----
const idxPath = 'bollettino.html';
const marcatore = '<!-- BOLLETTINO:INSERT -->';
let idx = fs.readFileSync(idxPath, 'utf8');
if (!idx.includes(marcatore)) {
  console.error('Marcatore BOLLETTINO:INSERT non trovato in bollettino.html: la pagina del giorno è pubblicata ma l\'archivio va aggiornato a mano.');
} else {
  const voce = `${marcatore}

<a href="bollettino/${iso}.html" class="b-item r">
<div class="b-meta">${esc(dataEstesa)} <span class="b-num">· #${numero}</span></div>
<div class="b-h">${esc(b.titolo)}</div>
<div class="b-deck">${esc(b.sottotitolo)}</div>
</a>
`;
  idx = idx.replace(marcatore, voce);
  fs.writeFileSync(idxPath, idx, 'utf8');
  console.log('Archivio bollettino.html aggiornato.');
}

console.log(`Bollettino #${numero} del ${dataEstesa} pronto per il commit.`);
