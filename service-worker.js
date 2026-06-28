/* Captain Match Planner PWA service worker */
const CACHE_NAME = 'captain-match-planner-v4-0-cache';
const CORE_ASSETS = [
  './',
  './index.html',
  './database-check.html',
  './manifest.webmanifest',
  './src/app.js',
  './src/styles.css',
  './assets/soccer-background.png',
  './assets/field-background.png',
  './assets/icons/icon-192.png',
  './assets/icons/icon-512.png',
  './assets/icons/maskable-icon-512.png',
  './assets/icons/apple-touch-icon.png',
  './assets/avatars/avatars.json',
  './assets/avatars/avatar-01.png',
  './assets/avatars/avatar-02.png',
  './assets/avatars/avatar-03.png',
  './assets/avatars/avatar-04.png',
  './assets/avatars/avatar-05.png',
  './assets/avatars/avatar-06.png',
  './assets/avatars/avatar-07.png',
  './assets/avatars/avatar-08.png',
  './assets/avatars/avatar-09.png',
  './assets/avatars/avatar-10.png',
  './assets/avatars/avatar-11.png',
  './assets/avatars/avatar-12.png',
  './assets/avatars/avatar-13.png',
  './assets/avatars/avatar-14.png',
  './assets/avatars/avatar-15.png',
  './assets/avatars/avatar-16.png',
  './assets/avatars/avatar-17.png',
  './assets/avatars/avatar-18.png',
  './assets/avatars/avatar-19.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(CORE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(() => {
          const page = url.pathname.endsWith('/database-check.html') ? './database-check.html' : './index.html';
          return caches.match(request).then((cached) => cached || caches.match(page));
        })
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request).then((response) => {
        if (!response || response.status !== 200 || response.type !== 'basic') return response;
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
        return response;
      });
    })
  );
});
