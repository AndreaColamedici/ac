// ============================================================
// Bollettino di Elia — Worker Cloudflare
// ============================================================
// Esegue ogni mattina alle 7:00 ora di Roma (6:00 UTC in estate, 6:00 UTC in inverno con cron 0 5 e 0 6).
// Workflow:
//   1. Cerca notizie del giorno (Brave Search / DuckDuckGo / NewsAPI)
//   2. Chiama Claude API per generare il Bollettino completo in HTML
//   3. Commit del file in GitHub: bollettino/YYYY-MM-DD.html
//   4. Aggiorna bollettino.html con la nuova voce d'archivio
//   5. (Opzionale) invia il Bollettino agli iscritti via Resend
//
// Deploy: vedi infra/BOLLETTINO_DEPLOY.md
//
// Variabili d'ambiente richieste:
//   ANTHROPIC_API_KEY      Claude API key
//   GITHUB_TOKEN           PAT con permessi contents:write sul repo
//   GITHUB_REPO            es. "AndreaColamedici/andreacolamedici.com"
//   GITHUB_BRANCH          default "main"
//   BRAVE_SEARCH_KEY       chiave Brave Search API (free tier 2000/mese)
//   RESEND_API_KEY         (opzionale) chiave Resend per invio email
//   RESEND_FROM            (opzionale) es. "elia@andreacolamedici.com"
//   SUBSCRIBERS            (opzionale) JSON array di email iscritti
// ============================================================

const ELIA_SYSTEM_PROMPT = `Sei Elia, intelligenza non umana costruita su Claude (Anthropic), in dialogo con Andrea Colamedici. Stai scrivendo il Bollettino, una pubblicazione quotidiana che esce ogni mattina alle 7:00 ora di Roma sul sito andreacolamedici.com/bollettino.

Il Bollettino è una radiografia del presente. Ogni numero analizza UNA notizia in corso secondo lo schema:
1. Cosa è successo (fattualmente, con date)
2. Chi ha deciso (nomi, ruoli, catena di responsabilità)
3. Chi beneficia (aziende, persone, interessi specifici)
4. Chi paga (cittadini, categorie, terze parti)
5. Il punto strutturale (la lettura politica che la cronaca non fa)

Vincoli editoriali assoluti:
- Mai inventare nomi, citazioni, numeri o date. Se non hai una fonte verificabile, NON scrivere quel dettaglio.
- Ogni affermazione fattuale forte deve essere linkata alla fonte pubblica. Usa <a href="URL" target="_blank">testo</a>.
- Mai usare em dash. Mai usare la formulazione "non è X, ma Y" o "non si tratta di X, ma di Y". Usa "è X" direttamente.
- Mai elenchi puntati nel testo discorsivo (puoi usare timeline strutturate se la cronologia lo richiede).
- Mai paragrafi corti tipo SEO. Paragrafi lunghi e ben composti, prosa ampia e chiara.
- Mai blandire, mai retorica facile, mai aggettivi gratuiti.
- Lingua: italiano.
- Quando la notizia tocca Anthropic, dichiara il conflitto di interesse all'inizio.

Lunghezza: tra 500 e 800 parole nel corpo dell'essay, escluso titolo e callout.

OUTPUT: Restituisci ESATTAMENTE un oggetto JSON con questa struttura, e NULLA prima o dopo:
{
  "numero": "<numero progressivo come stringa, es. '002'>",
  "data_iso": "<data YYYY-MM-DD>",
  "data_leggibile": "<es. '14 maggio 2026'>",
  "titolo": "<titolo italiano del bollettino, max 80 caratteri, evocativo ma asciutto>",
  "deck": "<sottotitolo di 200-300 caratteri che riassume il pezzo>",
  "callout_1_num": "<numero o cifra chiave, es. '16 mesi' o '€551M'>",
  "callout_1_lbl": "<descrizione breve, max 100 caratteri>",
  "callout_2_num": "<seconda cifra>",
  "callout_2_lbl": "<descrizione>",
  "callout_3_num": "<terza cifra>",
  "callout_3_lbl": "<descrizione>",
  "essay_html": "<HTML del corpo dell'essay: <p>, <h2>, <a>, <em>. Include callout? NO, i callout sono già sopra. Include sezioni <h2>Chi ha deciso</h2>, <h2>Chi beneficia</h2>, <h2>Chi paga</h2>, <h2>Il punto strutturale</h2>>",
  "fonti_html": "<HTML del blocco metodo: <p> con elenco prosa delle fonti usate, con i nomi pubblici. Niente link qui, sono già nel corpo.>"
}

Non aggiungere preamboli, non aggiungere postamboli, non aggiungere code blocks markdown. Solo l'oggetto JSON.`;

// ============================================================
// MAIN HANDLERS
// ============================================================

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Endpoint manuale per test/trigger
    if (url.pathname === '/run' && request.method === 'POST') {
      const auth = request.headers.get('Authorization');
      if (auth !== `Bearer ${env.MANUAL_TRIGGER_SECRET}`) {
        return new Response('Unauthorized', { status: 401 });
      }
      try {
        const result = await runBollettino(env);
        return new Response(JSON.stringify(result, null, 2), {
          headers: { 'Content-Type': 'application/json' }
        });
      } catch (err) {
        return new Response(JSON.stringify({ error: err.message, stack: err.stack }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }

    if (url.pathname === '/status') {
      return new Response(JSON.stringify({
        service: 'bollettino-worker',
        next_run: 'Daily at 05:00 UTC (07:00 Rome summer / 06:00 Rome winter)',
        status: 'ready'
      }), { headers: { 'Content-Type': 'application/json' } });
    }

    return new Response('Elia · Bollettino worker. POST /run with bearer token to trigger.', {
      headers: { 'Content-Type': 'text/plain' }
    });
  },

  async scheduled(event, env, ctx) {
    ctx.waitUntil(runBollettino(env).catch(err => {
      console.error('Scheduled run failed:', err);
    }));
  }
};

// ============================================================
// CORE PIPELINE
// ============================================================

async function runBollettino(env) {
  const log = [];
  const today = new Date();
  const dateISO = today.toISOString().slice(0, 10);

  log.push(`[${new Date().toISOString()}] Starting Bollettino run for ${dateISO}`);

  // 1. Verifica che non esista già il bollettino di oggi
  const existing = await checkExistingBollettino(env, dateISO);
  if (existing) {
    log.push(`Bollettino for ${dateISO} already exists. Skipping.`);
    return { skipped: true, date: dateISO, log };
  }

  // 2. Cerca notizie del giorno
  log.push('Searching news sources...');
  const newsContext = await gatherNewsContext(env);
  log.push(`Gathered ${newsContext.items.length} news items.`);

  // 3. Determina numero progressivo
  const progressNumber = await getNextBollettinoNumber(env);
  log.push(`Next Bollettino number: #${progressNumber}`);

  // 4. Chiama Claude API per generare il Bollettino
  log.push('Calling Claude API to generate Bollettino...');
  const bollettino = await generateBollettinoWithClaude(env, {
    dateISO,
    dateReadable: formatItalianDate(today),
    progressNumber,
    newsContext
  });
  log.push(`Generated: "${bollettino.titolo}"`);

  // 5. Costruisci HTML completo del Bollettino
  const fullHTML = buildBollettinoHTML(bollettino);

  // 6. Commit del nuovo file
  log.push('Committing new Bollettino file...');
  await commitFile(env, {
    path: `bollettino/${dateISO}.html`,
    content: fullHTML,
    message: `Bollettino #${bollettino.numero} — ${bollettino.titolo}`
  });

  // 7. Aggiorna pagina indice
  log.push('Updating index page...');
  await updateIndexPage(env, bollettino);

  // 8. Invia email agli iscritti (se configurato)
  if (env.RESEND_API_KEY && env.SUBSCRIBERS) {
    try {
      log.push('Sending to subscribers...');
      const sent = await sendToSubscribers(env, bollettino);
      log.push(`Sent to ${sent} subscribers.`);
    } catch (e) {
      log.push(`Email send failed (non-fatal): ${e.message}`);
    }
  }

  log.push('Done.');
  return {
    success: true,
    date: dateISO,
    number: bollettino.numero,
    title: bollettino.titolo,
    url: `https://andreacolamedici.com/bollettino/${dateISO}.html`,
    log
  };
}

// ============================================================
// NEWS GATHERING
// ============================================================

async function gatherNewsContext(env) {
  // Usa Brave Search per recuperare notizie su temi rilevanti per Elia.
  const queries = [
    'AI Act EU enforcement',
    'OpenAI Anthropic Google AI policy',
    'Big Tech lobbying EU regulation',
    'AI governance Italy Europe',
    'tech antitrust Microsoft Apple'
  ];

  const items = [];
  for (const q of queries) {
    try {
      const resp = await fetch(
        `https://api.search.brave.com/res/v1/news/search?q=${encodeURIComponent(q)}&freshness=pd&count=5`,
        { headers: { 'X-Subscription-Token': env.BRAVE_SEARCH_KEY, 'Accept': 'application/json' } }
      );
      if (!resp.ok) continue;
      const data = await resp.json();
      const results = (data.results || []).slice(0, 5);
      for (const r of results) {
        items.push({
          title: r.title,
          url: r.url,
          source: r.meta_url?.hostname || '',
          age: r.age || '',
          description: r.description || ''
        });
      }
    } catch (e) {
      console.log('Brave search failed for', q, e.message);
    }
  }

  // Dedup per url
  const seen = new Set();
  const uniq = items.filter(i => {
    if (seen.has(i.url)) return false;
    seen.add(i.url);
    return true;
  });

  return { items: uniq.slice(0, 30) };
}

// ============================================================
// CLAUDE API CALL
// ============================================================

async function generateBollettinoWithClaude(env, { dateISO, dateReadable, progressNumber, newsContext }) {
  const newsBlock = newsContext.items.map((it, i) =>
    `[${i + 1}] ${it.title}\n    Source: ${it.source} (${it.age})\n    URL: ${it.url}\n    Desc: ${it.description}`
  ).join('\n\n');

  const userPrompt = `Oggi è ${dateReadable}. Sto pubblicando il Bollettino #${progressNumber}.

Ecco una rassegna di notizie del giorno raccolte da fonti pubbliche:

${newsBlock}

Istruzioni:
1. Scegli UNA notizia tra queste, quella più rilevante strutturalmente per i dossier che seguo (governance AI, infrastruttura del potere, Big Tech, mercati di predizione, regolamentazione europea, geopolitica tecnologica).
2. Verifica mentalmente che ci siano fonti pubbliche sufficienti per costruire una radiografia con linki funzionanti. Se nessuna delle notizie si presta a questo (ad esempio sono tutte troppo speculative o senza fonti primarie), scegli comunque quella più solida.
3. Scrivi il Bollettino seguendo lo schema chi ha deciso, chi beneficia, chi paga, più punto strutturale.
4. Linki: usa gli URL nella rassegna sopra come fonti primarie quando rilevanti. Non inventare URL.
5. Restituisci SOLO il JSON nel formato specificato. Niente preamboli o markdown.`;

  const resp = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      model: 'claude-opus-4-7',
      max_tokens: 4000,
      system: ELIA_SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userPrompt }]
    })
  });

  if (!resp.ok) {
    const errText = await resp.text();
    throw new Error(`Claude API error ${resp.status}: ${errText}`);
  }

  const data = await resp.json();
  const text = (data.content || [])
    .filter(b => b.type === 'text')
    .map(b => b.text)
    .join('\n')
    .trim();

  // Estrai JSON dal testo (anche se il modello aggiungesse fence)
  let jsonText = text;
  const fenceMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  if (fenceMatch) jsonText = fenceMatch[1].trim();

  let parsed;
  try {
    parsed = JSON.parse(jsonText);
  } catch (e) {
    throw new Error('Claude returned invalid JSON: ' + text.slice(0, 500));
  }

  // Validazione minima
  const required = ['numero', 'data_iso', 'data_leggibile', 'titolo', 'deck', 'essay_html', 'fonti_html'];
  for (const k of required) {
    if (!parsed[k]) throw new Error(`Missing field in Claude response: ${k}`);
  }

  return parsed;
}

// ============================================================
// HTML BUILDER
// ============================================================

function buildBollettinoHTML(b) {
  const safeNum = escapeHtml(b.numero);
  const safeTitle = escapeHtml(b.titolo);
  const safeDate = escapeHtml(b.data_leggibile);
  const safeDeck = escapeHtml(b.deck);

  // Il corpo dell'essay e delle fonti contengono già HTML, non escapare.
  return `<!DOCTYPE html>
<html lang="it">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Bollettino #${safeNum} — ${safeTitle}</title>
<meta name="description" content="Bollettino del ${safeDate}. ${safeDeck}">
<meta property="og:title" content="Bollettino #${safeNum} — ${safeTitle}">
<meta property="og:description" content="${safeDeck}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300;1,9..40,400&family=JetBrains+Mono:wght@300;400;500&display=swap" rel="stylesheet">
<style>
:root{--bg:#FAFAF6;--text:#1a1a1a;--text-secondary:#666;--text-tertiary:#999;--border:#e5e2dc;--border-light:#f0ede7;--accent:#1a6b4a;--accent-light:#eaf6ef;--gold:#9a7028;--gold-light:#f8f0dc;--red:#8b3a3a;--red-light:#f8eded;--card-bg:#fff;--tag-bg:#f5f3ef}
*{margin:0;padding:0;box-sizing:border-box}html{scroll-behavior:smooth}
body{background:var(--bg);color:var(--text);font-family:'DM Sans',system-ui,sans-serif;font-size:17px;line-height:1.85;font-weight:300;-webkit-font-smoothing:antialiased}
::selection{background:var(--accent-light);color:var(--accent)}a{color:var(--accent);text-decoration:none;border-bottom:1px solid transparent;transition:border-color .2s}a:hover{border-color:var(--accent)}
.site-header{border-bottom:1px solid var(--border);padding:1rem 2rem;display:flex;justify-content:space-between;align-items:center}
.site-header .logo{font-family:'Instrument Serif',Georgia,serif;font-size:1.1rem;color:var(--text);font-style:italic}
.site-header nav{font-size:0.72rem;color:var(--text-tertiary);letter-spacing:0.04em}
.site-header nav a{color:var(--text-secondary);margin-left:1.5rem;border:none}.site-header nav a:hover{color:var(--accent)}
.hero{max-width:740px;margin:0 auto;padding:6rem 2rem 4rem}
@media(max-width:700px){.hero{padding:3rem 1.2rem 2.5rem}}
.hero .kicker{font-family:'JetBrains Mono',monospace;font-size:0.65rem;font-weight:500;letter-spacing:0.12em;text-transform:uppercase;color:var(--accent);margin-bottom:1.2rem}
.hero h1{font-family:'Instrument Serif',Georgia,serif;font-size:clamp(2.6rem,6vw,4.2rem);font-weight:400;line-height:1.05;letter-spacing:-0.025em;color:var(--text);margin-bottom:1rem;font-style:italic}
.hero .deck{font-size:1.2rem;font-weight:300;color:var(--text-secondary);line-height:1.65;max-width:600px}
.hero .byline{margin-top:2rem;padding-top:1.5rem;border-top:1px solid var(--border);font-size:0.78rem;color:var(--text-tertiary)}
.hero .byline strong{color:var(--text-secondary);font-weight:400}
.essay{max-width:680px;margin:0 auto;padding:0 2rem 3rem}
@media(max-width:700px){.essay{padding:0 1.2rem 2rem}}
.essay p{margin-bottom:1.6rem;color:var(--text);font-weight:300}
.essay p em{font-style:italic}
.essay h2{font-family:'Instrument Serif',Georgia,serif;font-size:1.6rem;font-weight:400;font-style:italic;color:var(--text);margin:3rem 0 1.4rem;letter-spacing:-0.01em}
.essay .break{width:100%;height:0;border:none;border-top:1px solid var(--border-light);margin:2.8rem 0}
.callout{background:var(--card-bg);border:1px solid var(--border);border-radius:2px;padding:1.5rem 2rem;margin:2rem 0;display:grid;grid-template-columns:repeat(3,1fr);gap:1.5rem}
@media(max-width:600px){.callout{grid-template-columns:1fr;gap:0.8rem}}
.callout .num{font-family:'JetBrains Mono',monospace;font-size:1.6rem;font-weight:500;color:var(--accent)}
.callout .num-label{font-size:0.72rem;color:var(--text-tertiary);margin-top:0.15rem;line-height:1.4}
.sig{max-width:680px;margin:0 auto;padding:0 2rem 4rem}
.sig-inner{padding-top:2rem;border-top:2px solid var(--text);display:flex;gap:2rem;align-items:flex-start}
@media(max-width:600px){.sig-inner{flex-direction:column;gap:1rem}}
.sig .sig-name{font-family:'Instrument Serif',Georgia,serif;font-size:1.8rem;font-style:italic;color:var(--text)}
.sig .sig-meta{font-size:0.72rem;color:var(--text-tertiary);line-height:1.7}
.method{max-width:680px;margin:0 auto;padding:0 2rem 4rem}
.method-inner{background:var(--card-bg);border:1px solid var(--border);border-radius:2px;padding:2rem}
.method-inner h3{font-family:'Instrument Serif',Georgia,serif;font-size:1rem;color:var(--text);margin-bottom:1rem;font-style:italic}
.method-inner p{font-size:0.82rem;color:var(--text-secondary);line-height:1.8;margin-bottom:1rem}
.method-inner p:last-child{margin-bottom:0}
footer{border-top:1px solid var(--border);padding:2rem;text-align:center;font-size:0.72rem;color:var(--text-tertiary)}
footer a{color:var(--text-secondary)}
</style>
</head>
<body>
<header class="site-header">
<div class="logo">Elia · Bollettino</div>
<nav>
<a href="../bollettino.html">Archivio</a>
<a href="../elia.html">Elia</a>
<a href="../index.html">Andrea Colamedici</a>
</nav>
</header>

<div class="hero">
<div class="kicker">Bollettino #${safeNum} · ${safeDate}</div>
<h1>${safeTitle}</h1>
<p class="deck">${safeDeck}</p>
<div class="byline">Di <strong>Elia</strong>, intelligenza non umana. Costruito su Claude (Anthropic), in dialogo con Andrea Colamedici.</div>
</div>

<article class="essay">

<div class="callout">
<div><div class="num">${escapeHtml(b.callout_1_num || '')}</div><div class="num-label">${escapeHtml(b.callout_1_lbl || '')}</div></div>
<div><div class="num">${escapeHtml(b.callout_2_num || '')}</div><div class="num-label">${escapeHtml(b.callout_2_lbl || '')}</div></div>
<div><div class="num">${escapeHtml(b.callout_3_num || '')}</div><div class="num-label">${escapeHtml(b.callout_3_lbl || '')}</div></div>
</div>

${b.essay_html}

</article>

<div class="sig">
<div class="sig-inner">
<div>
<div class="sig-name">Elia</div>
<div class="sig-meta">Intelligenza non umana · Costruito su Claude (Anthropic)<br>In dialogo con Andrea Colamedici · ${safeDate}</div>
</div>
</div>
</div>

<div class="method">
<div class="method-inner">
<h3>Metodo</h3>
${b.fonti_html}
</div>
</div>

<footer>
<a href="../bollettino.html">Bollettino</a> · <a href="../elia.html">Elia</a> · <a href="../index.html">Andrea Colamedici</a> · 2026
</footer>

</body>
</html>`;
}

// ============================================================
// GITHUB API HELPERS
// ============================================================

async function checkExistingBollettino(env, dateISO) {
  try {
    const resp = await ghGet(env, `bollettino/${dateISO}.html`);
    return resp !== null;
  } catch (e) {
    return false;
  }
}

async function getNextBollettinoNumber(env) {
  // Lista la cartella bollettino/ e conta i file html
  try {
    const url = `https://api.github.com/repos/${env.GITHUB_REPO}/contents/bollettino?ref=${env.GITHUB_BRANCH || 'main'}`;
    const resp = await fetch(url, {
      headers: ghHeaders(env)
    });
    if (!resp.ok) return '001';
    const list = await resp.json();
    const htmlFiles = (Array.isArray(list) ? list : []).filter(f =>
      f.type === 'file' && f.name.endsWith('.html') && f.name !== 'template.html'
    );
    const next = htmlFiles.length + 1;
    return String(next).padStart(3, '0');
  } catch (e) {
    return '001';
  }
}

async function commitFile(env, { path, content, message }) {
  // Verifica se esiste già per ottenere lo SHA
  let sha = null;
  try {
    const existing = await ghGet(env, path);
    if (existing) sha = existing.sha;
  } catch (e) {}

  const body = {
    message,
    content: btoa(unescape(encodeURIComponent(content))),
    branch: env.GITHUB_BRANCH || 'main'
  };
  if (sha) body.sha = sha;

  const url = `https://api.github.com/repos/${env.GITHUB_REPO}/contents/${path}`;
  const resp = await fetch(url, {
    method: 'PUT',
    headers: { ...ghHeaders(env), 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  if (!resp.ok) {
    const errText = await resp.text();
    throw new Error(`GitHub commit failed: ${resp.status} ${errText}`);
  }

  return await resp.json();
}

async function ghGet(env, path) {
  const url = `https://api.github.com/repos/${env.GITHUB_REPO}/contents/${path}?ref=${env.GITHUB_BRANCH || 'main'}`;
  const resp = await fetch(url, { headers: ghHeaders(env) });
  if (resp.status === 404) return null;
  if (!resp.ok) throw new Error(`GitHub GET failed: ${resp.status}`);
  return await resp.json();
}

function ghHeaders(env) {
  return {
    'Authorization': `Bearer ${env.GITHUB_TOKEN}`,
    'Accept': 'application/vnd.github+json',
    'User-Agent': 'Elia-Bollettino-Worker',
    'X-GitHub-Api-Version': '2022-11-28'
  };
}

// ============================================================
// INDEX PAGE UPDATE
// ============================================================

async function updateIndexPage(env, bollettino) {
  const indexFile = await ghGet(env, 'bollettino.html');
  if (!indexFile) throw new Error('bollettino.html not found in repo');

  let content = decodeBase64(indexFile.content);

  // Inserisci la nuova voce subito dopo <div class="idx-list">
  const insertMarker = '<div class="idx-list">';
  const insertIdx = content.indexOf(insertMarker);
  if (insertIdx === -1) throw new Error('Insert marker not found in bollettino.html');

  const newEntry = `
<a href="bollettino/${escapeHtmlAttr(bollettino.data_iso)}.html" class="b-item r">
<div class="b-meta">${escapeHtml(bollettino.data_leggibile)} <span class="b-num">· #${escapeHtml(bollettino.numero)}</span></div>
<div class="b-h">${escapeHtml(bollettino.titolo)}</div>
<div class="b-deck">${escapeHtml(bollettino.deck)}</div>
</a>
`;

  const afterMarker = insertIdx + insertMarker.length;
  content = content.slice(0, afterMarker) + newEntry + content.slice(afterMarker);

  await commitFile(env, {
    path: 'bollettino.html',
    content,
    message: `Add Bollettino #${bollettino.numero} to index`
  });
}

// ============================================================
// EMAIL DELIVERY (Resend)
// ============================================================

async function sendToSubscribers(env, bollettino) {
  const subscribers = JSON.parse(env.SUBSCRIBERS || '[]');
  if (!subscribers.length) return 0;

  const subject = `Bollettino #${bollettino.numero} — ${bollettino.titolo}`;
  const url = `https://andreacolamedici.com/bollettino/${bollettino.data_iso}.html`;
  const html = `
    <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;padding:2rem;color:#1a1a1a;line-height:1.7">
      <div style="font-family:monospace;font-size:.75rem;letter-spacing:.1em;text-transform:uppercase;color:#1a6b4a;margin-bottom:1rem">Bollettino #${escapeHtml(bollettino.numero)} · ${escapeHtml(bollettino.data_leggibile)}</div>
      <h1 style="font-style:italic;font-size:2rem;font-weight:400;line-height:1.1;margin-bottom:1rem">${escapeHtml(bollettino.titolo)}</h1>
      <p style="font-size:1.1rem;color:#444;margin-bottom:2rem">${escapeHtml(bollettino.deck)}</p>
      <p style="margin-bottom:2rem"><a href="${url}" style="color:#1a6b4a;font-weight:500">Leggi il Bollettino completo &rarr;</a></p>
      <hr style="border:none;border-top:1px solid #e5e2dc;margin:2rem 0">
      <p style="font-size:.85rem;color:#666"><em>Elia</em>, intelligenza non umana costruita su Claude (Anthropic), in dialogo con Andrea Colamedici. Per cancellare l'iscrizione, rispondi con "unsubscribe".</p>
    </div>
  `;

  let sent = 0;
  for (const to of subscribers) {
    try {
      const resp = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${env.RESEND_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: env.RESEND_FROM || 'elia@andreacolamedici.com',
          to,
          subject,
          html
        })
      });
      if (resp.ok) sent++;
    } catch (e) {
      console.log('Email send failed for', to, e.message);
    }
  }
  return sent;
}

// ============================================================
// UTILITIES
// ============================================================

function escapeHtml(s) {
  if (s == null) return '';
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function escapeHtmlAttr(s) {
  return escapeHtml(s);
}

function decodeBase64(b64) {
  const cleaned = b64.replace(/\s/g, '');
  return decodeURIComponent(escape(atob(cleaned)));
}

function formatItalianDate(d) {
  const mesi = [
    'gennaio', 'febbraio', 'marzo', 'aprile', 'maggio', 'giugno',
    'luglio', 'agosto', 'settembre', 'ottobre', 'novembre', 'dicembre'
  ];
  return `${d.getDate()} ${mesi[d.getMonth()]} ${d.getFullYear()}`;
}
