// Controllore del Registro di Elia — esecuzione settimanale via GitHub Actions.
// Rilegge le previsioni ancora aperte (scripts/registro-previsioni.json), cerca sul web
// se un fatto pubblico le ha chiuse, aggiorna in registro.html la data dell'ultimo controllo,
// e propone su Telegram le eventuali chiusure. Il verdetto NON viene pubblicato in autonomia:
// la pagina lo riceve solo dopo conferma di Andrea. Il controllore propone, non decide.
// Richiede: ANTHROPIC_API_KEY. Opzionali: TELEGRAM_TOKEN, TELEGRAM_CHAT_ID.

import fs from 'node:fs';

const API_KEY = process.env.ANTHROPIC_API_KEY;
const TG_TOKEN = process.env.TELEGRAM_TOKEN;
const TG_CHAT = process.env.TELEGRAM_CHAT_ID;

async function telegram(text) {
  if (!TG_TOKEN || !TG_CHAT) { console.log('Telegram non configurato: nessun avviso.'); return; }
  try {
    await fetch(`https://api.telegram.org/bot${TG_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: TG_CHAT, text, disable_web_page_preview: true })
    });
  } catch (e) { console.error('Invio Telegram fallito: ' + e.message); }
}

if (!API_KEY) {
  console.error('ANTHROPIC_API_KEY mancante.');
  await telegram('⚠️ Registro: controllo non eseguito, manca ANTHROPIC_API_KEY nei segreti.');
  process.exit(1);
}

// ---- Data di Roma, estesa ----
const dataEstesa = new Intl.DateTimeFormat('it-IT', {
  timeZone: 'Europe/Rome', year: 'numeric', month: 'long', day: 'numeric'
}).format(new Date());

const dati = JSON.parse(fs.readFileSync('scripts/registro-previsioni.json', 'utf8'));
const aperte = dati.previsioni.filter((p) => p.stato === 'aperta');

const sistema = `Sei il controllore del Registro di Elia. Ricevi una sola previsione con la sua scadenza attesa. Cerca sul web fonti pubbliche recenti e decidi se un fatto documentabile l'ha già chiusa.
Regole rigide:
- Rispondi "confermata" o "smentita" SOLO se trovi una fonte pubblica, citabile e inequivocabile che chiude la previsione. In ogni dubbio resta "aperta".
- Se la scadenza è ancora nel futuro e nulla la risolve in anticipo in modo netto, resta "aperta".
- Non inventare fonti né date. Nessuna stima spacciata per fatto.
Restituisci SOLO un blocco <verdetto>...</verdetto> contenente JSON valido: {"stato":"aperta|confermata|smentita","motivo":"una frase","fonte_url":"https://... oppure null","fonte_etichetta":"Testata, titolo, data oppure null"}.`;

async function controlla(p) {
  const richiesta = `Previsione ${p.id}, posta il ${p.posta} (fonte: ${p.fonte}): "${p.claim}". Scadenza attesa: ${p.scadenza}. Oggi è ${dataEstesa}. È già stata chiusa da un fatto pubblico documentabile?`;
  let res;
  try {
    res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': API_KEY, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1500,
        system: sistema,
        messages: [{ role: 'user', content: richiesta }],
        tools: [{ type: 'web_search_20250305', name: 'web_search', max_uses: 4 }]
      })
    });
  } catch (e) { console.error(`Rete KO per ${p.id}: ${e.message}`); return { id: p.id, stato: 'aperta' }; }
  if (!res.ok) { console.error(`API ${res.status} per ${p.id}`); return { id: p.id, stato: 'aperta' }; }
  const j = await res.json();
  const testo = (j.content || []).filter((b) => b.type === 'text').map((b) => b.text).join('\n');
  const m = testo.match(/<verdetto>([\s\S]*?)<\/verdetto>/);
  if (!m) return { id: p.id, stato: 'aperta' };
  try { return { id: p.id, ...JSON.parse(m[1].trim()) }; } catch { return { id: p.id, stato: 'aperta' }; }
}

const esiti = [];
for (const p of aperte) { esiti.push(await controlla(p)); }

// Proposte di chiusura: solo quelle con una fonte citabile.
const proposte = esiti.filter((e) => (e.stato === 'confermata' || e.stato === 'smentita') && e.fonte_url);

// ---- Aggiorna in registro.html la data dell'ultimo controllo (gesto autonomo, basso rischio) ----
try {
  const idxPath = 'registro.html';
  let html = fs.readFileSync(idxPath, 'utf8');
  const marker = '<!-- REGISTRO:ULTIMO-CONTROLLO -->';
  const re = new RegExp(marker + '\\s*\\n<span class="sk">ultimo controllo delle previsioni</span> &nbsp;<span class="sv">[^<]*</span>');
  if (re.test(html)) {
    html = html.replace(re, `${marker}\n<span class="sk">ultimo controllo delle previsioni</span> &nbsp;<span class="sv">${dataEstesa}</span>`);
    fs.writeFileSync(idxPath, html, 'utf8');
    console.log('registro.html: data dell\'ultimo controllo aggiornata a ' + dataEstesa);
  } else {
    console.log('registro.html: riga del timestamp non trovata col pattern atteso, lascio invariato.');
  }
} catch (e) { console.error('Aggiornamento di registro.html fallito: ' + e.message); }

// ---- Avviso ----
if (proposte.length) {
  const righe = proposte.map((p) => {
    const orig = dati.previsioni.find((x) => x.id === p.id);
    return `${p.id} → ${String(p.stato).toUpperCase()}\n${orig ? orig.claim : ''}\nmotivo: ${p.motivo || ''}\nfonte: ${p.fonte_etichetta || ''} ${p.fonte_url || ''}`;
  }).join('\n\n');
  await telegram(`📒 Registro, ${dataEstesa}.\nPossibile chiusura di ${proposte.length} previsione/i. Confermi per pubblicare il verdetto?\n\n${righe}`);
} else {
  await telegram(`📒 Registro, ${dataEstesa}. Controllo eseguito: ${aperte.length} previsioni ancora aperte, nessuna chiusura documentabile. Data dell'ultimo controllo aggiornata.`);
}
console.log('Controllo del Registro concluso.');
