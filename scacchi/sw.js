// Scuola di scacchi: lavoro offline
var CACHE = 'scacchi-v2';
var CORE = ['./', './index.html', './puzzles.json', './manifest.webmanifest', './icon-192.png', './icon-512.png', './sf/stockfish-18-lite-single.js', './sf/stockfish-18-lite-single.wasm'];
self.addEventListener('install', function(e){ e.waitUntil(caches.open(CACHE).then(function(c){ return c.addAll(CORE); }).then(function(){ return self.skipWaiting(); })); });
self.addEventListener('activate', function(e){ e.waitUntil(caches.keys().then(function(ks){ return Promise.all(ks.filter(function(k){ return k !== CACHE; }).map(function(k){ return caches.delete(k); })); }).then(function(){ return self.clients.claim(); })); });
self.addEventListener('fetch', function(e){
  var req = e.request; if (req.method !== 'GET') return;
  var url = new URL(req.url);
  // la pagina: prima la rete (per gli aggiornamenti), poi la copia salvata
  if (req.mode === 'navigate') {
    e.respondWith(fetch(req).then(function(r){ var cp = r.clone(); caches.open(CACHE).then(function(c){ c.put('./index.html', cp); }); return r; }).catch(function(){ return caches.match('./index.html'); }));
    return;
  }
  // tutto il resto: prima la copia salvata, poi la rete (font compresi)
  e.respondWith(caches.match(req).then(function(hit){
    return hit || fetch(req).then(function(r){
      if (r && (r.ok || r.type === 'opaque') && (url.origin === location.origin || /fonts\.(googleapis|gstatic)\.com$/.test(url.hostname))) { var cp = r.clone(); caches.open(CACHE).then(function(c){ c.put(req, cp); }); }
      return r;
    });
  }));
});
