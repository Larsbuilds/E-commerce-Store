const CACHE_NAME = 'fakestore-cache-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.svg',
  '/assets/css/main.css',
  '/assets/js/main.js'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Cache each asset individually to handle failures gracefully
      return Promise.allSettled(
        STATIC_ASSETS.map(asset => 
          cache.add(asset).catch(error => {
            console.warn(`Failed to cache ${asset}:`, error);
          })
        )
      );
    })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
});

// Fetch event - handle requests
self.addEventListener('fetch', (event) => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  // Handle favicon requests
  if (event.request.url.endsWith('favicon.ico')) {
    event.respondWith(
      fetch('/favicon.svg')
        .catch(() => new Response('', { status: 404 }))
    );
    return;
  }

  // Handle API requests
  if (event.request.url.includes('/api/')) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // Cache successful API responses
          if (response.ok) {
            const cacheResponse = response.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, cacheResponse);
            });
          }
          return response;
        })
        .catch(() => {
          // Return cached response if available
          return caches.match(event.request);
        })
    );
    return;
  }

  // Handle static assets
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached response if available
        if (response) {
          return response;
        }
        // Otherwise fetch from network
        return fetch(event.request).then(response => {
          // Cache successful responses
          if (response.ok) {
            const cacheResponse = response.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, cacheResponse);
            });
          }
          return response;
        });
      })
  );
}); 