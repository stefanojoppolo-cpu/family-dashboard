const CACHE_NAME = 'family-dashboard-v1';
const urlsToCache = ['./', './index.html', './manifest.json', './icon-192.png', './icon-512.png'];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  // Non intercettare richieste esterne (Firebase, Google, ecc.) - solo i file dell'app stessa
  if(url.origin !== location.origin) return;
  event.respondWith(
    caches.match(event.request).then((response) => response || fetch(event.request))
  );
});
