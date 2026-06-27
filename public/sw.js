const CACHE_NAME = 'ielts-vocabulary-pwa-v1';
const APP_ROOT = new URL('./', self.location.href);
const APP_SHELL = [
  APP_ROOT.href,
  new URL('index.html', APP_ROOT).href,
  new URL('manifest.webmanifest', APP_ROOT).href,
  new URL('icons/icon.svg', APP_ROOT).href
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) {
        return cached;
      }

      return fetch(event.request)
        .then((response) => {
          if (response.ok) {
            const copy = response.clone();
            event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy)));
          }

          return response;
        })
        .catch(async (error) => {
          if (event.request.mode === 'navigate') {
            const fallback = await caches.match(APP_ROOT.href);
            if (fallback) {
              return fallback;
            }
          }

          throw error;
        });
    })
  );
});
