self.addEventListener('install', (event) => {
    console.log('Service Worker installé');
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        fetch(event.request).catch(() =>
            caches.match(event.request)
        )
    );
});
