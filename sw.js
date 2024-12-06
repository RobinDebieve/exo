const CACHE_NAME = 'my-app-cache-v1';
const urlsToCache = [
    './index.html',
    './icon-192x192.png',
    './icon-512x512.png',
    './sw.js',
    './images/logo.png',
    './manifest.json',
    './index_files/global.css',
    './index_files/galerie.css',
    './index_files/page.css',
    './index_files/rgpd.css',
    './index_files/animation.css',
    './index_files/blocgrid.css',
];

// Installation du Service Worker
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Mise en cache des fichiers.');
                return cache.addAll(urlsToCache);
            })
    );
});

// Activation du Service Worker
self.addEventListener('activate', (event) => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (!cacheWhitelist.includes(cacheName)) {
                        console.log('Suppression de l\'ancien cache :', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Récupération des ressources
self.addEventListener('fetch', (event) => {
    event.respondWith(
        fetch(event.request)
            .then((networkResponse) => {
                return caches.open(CACHE_NAME).then((cache) => {
                    cache.put(event.request, networkResponse.clone());
                    return networkResponse;
                });
            })
            .catch(() => {
                return caches.match(event.request).then((cachedResponse) => {
                    return cachedResponse || new Response('Ressource non disponible.', { status: 404 });
                });
            })
    );
});
