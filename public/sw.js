self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open('better-chatgpt-cache').then((cache) => {
            return cache.addAll([
                '/',
                '/apple-touch-icon.png',
                '/favicon-32x32.png',
                '/favicon-16x16.png'
            ]);
        })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});
