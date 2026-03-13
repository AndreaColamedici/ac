// Polymarket Proxy Worker for Elia Seismograph
// Deploy on Cloudflare Workers at polymarket-proxy.alveareapi.workers.dev
// Proxies read-only GET requests to Polymarket Gamma API with CORS headers

const ALLOWED_ORIGINS = [
  'https://andreacolamedici.com',
  'https://www.andreacolamedici.com',
  'http://localhost',
  'http://127.0.0.1'
];

const TARGET = 'https://gamma-api.polymarket.com';

export default {
  async fetch(request, env) {
    // Only GET
    if (request.method === 'OPTIONS') {
      return handleCORS(request);
    }
    if (request.method !== 'GET') {
      return new Response('Only GET allowed', { status: 405 });
    }

    const url = new URL(request.url);
    const targetUrl = TARGET + url.pathname + url.search;

    try {
      const resp = await fetch(targetUrl, {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Elia-Seismograph/1.0'
        }
      });

      const body = await resp.text();
      const origin = request.headers.get('Origin') || '';
      const allowOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];

      return new Response(body, {
        status: resp.status,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': allowOrigin,
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Cache-Control': 'public, max-age=60',
        }
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), {
        status: 502,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }
  }
};

function handleCORS(request) {
  const origin = request.headers.get('Origin') || '';
  const allowOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': allowOrigin,
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
    }
  });
}
