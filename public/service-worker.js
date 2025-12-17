/* Lightweight asset caching for images/videos */
const STATIC_CACHE = 'pcb-static-v1';
const MEDIA_CACHE = 'pcb-media-v1';

const STATIC_ASSETS = ['/', '/index.html'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => cache.addAll(STATIC_ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((key) => {
        if (![STATIC_CACHE, MEDIA_CACHE].includes(key)) {
          return caches.delete(key);
        }
        return null;
      }))
    ).then(() => self.clients.claim())
  );
});

const isMediaRequest = (request) => {
  const { destination, url } = request;
  if (destination === 'image' || destination === 'video') return true;
  return /\.(png|jpe?g|gif|webp|svg|mp4|webm|mov|ogg)$/i.test(url);
};

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  if (isMediaRequest(request)) {
    event.respondWith((async () => {
      const cache = await caches.open(MEDIA_CACHE);
      const cached = await cache.match(request);
      const fetchPromise = fetch(request)
        .then((response) => {
          if (response && response.ok) cache.put(request, response.clone());
          return response;
        })
        .catch(() => cached);
      return cached || fetchPromise;
    })());
    return;
  }
});

