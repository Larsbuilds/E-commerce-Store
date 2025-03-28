const CACHE_NAME = 'ecom-store-v1';
const STATIC_CACHE = 'static-v1';
const API_CACHE = 'api-v1';

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  '/assets/index.css',
  '/assets/index.js',
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE).then((cache) => cache.addAll(STATIC_ASSETS)),
      caches.open(API_CACHE),
    ])
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => {
            return (
              cacheName.startsWith('ecom-store-') &&
              cacheName !== STATIC_CACHE &&
              cacheName !== API_CACHE
            );
          })
          .map((cacheName) => caches.delete(cacheName))
      );
    })
  );
  self.clients.claim();
});

// Fetch event - handle requests
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Handle API requests
  if (url.hostname === 'fakestoreapi.com') {
    event.respondWith(
      caches.open(API_CACHE).then((cache) => {
        return cache.match(event.request).then((response) => {
          // Return cached response if available
          if (response) {
            return response;
          }

          // Fetch and cache new response
          return fetch(event.request).then((response) => {
            // Clone the response before caching
            const responseToCache = response.clone();
            cache.put(event.request, responseToCache);
            return response;
          });
        });
      })
    );
    return;
  }

  // Handle static assets
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Return cached response if available
      if (response) {
        return response;
      }

      // Fetch and cache new response
      return fetch(event.request).then((response) => {
        // Clone the response before caching
        const responseToCache = response.clone();
        caches.open(STATIC_CACHE).then((cache) => {
          cache.put(event.request, responseToCache);
        });
        return response;
      });
    })
  );
}); 