const CACHE_NAME = 'gestoke-cache-v2';

const STATIC_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon-192x192.png',
  './icon-512x512.png'
];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(STATIC_ASSETS).catch(error => {
        console.error('Failed to cache static assets during install:', error);
      });
    })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  // Ignora requisições não-GET
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Não interceptar chamadas para a API do Supabase (para evitar cache de dados dinâmicos)
  if (url.hostname.includes('supabase.co')) return;

  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      const fetchPromise = fetch(event.request).then(networkResponse => {
        // Adiciona/Atualiza o cache com a nova resposta
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, responseToCache));
        }
        return networkResponse;
      }).catch(error => {
        console.warn('Fetch failed, returning offline fallback for:', event.request.url);
        // Se a requisição falhar (offline) e for de navegação, retorna a página index
        if (event.request.mode === 'navigate') {
          return caches.match('./index.html');
        }
        throw error;
      });

      // Retorna em cache (rápido) e atualiza em background (stale-while-revalidate)
      return cachedResponse || fetchPromise;
    })
  );
});
