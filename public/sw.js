const CACHE_NAME = 'memorize-cache-v1';

const PRECACHE_ASSETS = [
  '/',
  '/en',
  '/ko',
  '/ja',
  '/en/records',
  '/ko/records',
  '/ja/records',
  '/en/data-management',
  '/ko/data-management',
  '/ja/data-management',
  '/en/data-preparation',
  '/ko/data-preparation',
  '/ja/data-preparation',
  '/icon',
  '/apple-icon',
  '/manifest.webmanifest',
  '/manifest.json',
  '/api/sample-decks'
];

// Install: Pre-cache critical App Shell and resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      // Use individual puts so a single route failure does not abort installation
      await Promise.allSettled(
        PRECACHE_ASSETS.map(async (url) => {
          try {
            const res = await fetch(url, { cache: 'no-cache' });
            if (res.ok) {
              await cache.put(url, res);
            }
          } catch {
            // Ignore pre-cache network misses during install
          }
        })
      );
    }).then(() => self.skipWaiting())
  );
});

// Activate: Clean up old caches and claim clients immediately
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch: Intelligent routing and caching strategies
self.addEventListener('fetch', (event) => {
  const request = event.request;

  // Only handle GET requests
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // Ignore chrome-extension schemes or foreign origins
  if (!url.protocol.startsWith('http')) return;
  if (url.origin !== self.location.origin) return;

  // 1. Navigation requests (HTML pages): Network-First with Cache Fallback
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.ok) {
            const copy = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return networkResponse;
        })
        .catch(async () => {
          const cache = await caches.open(CACHE_NAME);
          const cachedResponse = await cache.match(request);
          if (cachedResponse) return cachedResponse;

          // Fallback to localized dashboard shell if specific subpage is not cached
          const pathname = url.pathname;
          if (pathname.startsWith('/ko')) {
            const koFallback = await cache.match('/ko');
            if (koFallback) return koFallback;
          } else if (pathname.startsWith('/ja')) {
            const jaFallback = await cache.match('/ja');
            if (jaFallback) return jaFallback;
          } else {
            const enFallback = await cache.match('/en');
            if (enFallback) return enFallback;
          }

          const rootFallback = await cache.match('/');
          if (rootFallback) return rootFallback;

          return new Response('Offline - Memorize Supporter', {
            status: 503,
            statusText: 'Service Unavailable',
            headers: { 'Content-Type': 'text/plain; charset=utf-8' }
          });
        })
    );
    return;
  }

  // 2. Next.js static assets (_next/static/*): Cache-First with Network fallback
  if (url.pathname.startsWith('/_next/static/')) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) return cachedResponse;

        return fetch(request).then((networkResponse) => {
          if (networkResponse && networkResponse.ok) {
            const copy = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return networkResponse;
        });
      })
    );
    return;
  }

  // 3. Sample decks API: Stale-While-Revalidate with safe fallback
  if (url.pathname.startsWith('/api/sample-decks')) {
    event.respondWith(
      caches.open(CACHE_NAME).then(async (cache) => {
        const cached = await cache.match(request);
        const fetchPromise = fetch(request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.ok) {
              cache.put(request, networkResponse.clone());
            }
            return networkResponse;
          })
          .catch(() => {
            if (cached) return cached;
            return new Response(JSON.stringify({ decks: [] }), {
              headers: { 'Content-Type': 'application/json' }
            });
          });

        return cached || fetchPromise;
      })
    );
    return;
  }

  // 4. Default: Stale-While-Revalidate for images, icons, and fonts
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      const fetchPromise = fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.ok) {
            const copy = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return networkResponse;
        })
        .catch(() => cachedResponse);

      return cachedResponse || fetchPromise;
    })
  );
});
