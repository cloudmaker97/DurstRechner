const CACHE_NAME = 'durst-rechner-v2';

const FILES_TO_CACHE = [
    '/',
    '/index.html',
    '/manifest.json',
    '/service-worker.js',
    '/stylesheet.css',
    '/script/all.js',
    '/script/calculator.js',
    '/script/theme.js',
    '/node_modules/bootstrap/dist/css/bootstrap.min.css',
    '/node_modules/bootstrap/dist/js/bootstrap.bundle.min.js',
    '/node_modules/bootstrap-icons/font/bootstrap-icons.min.css',
    '/node_modules/bootstrap-icons/font/fonts/bootstrap-icons.woff2',
    '/node_modules/bootstrap-icons/font/fonts/bootstrap-icons.woff',
    '/favicon/android-chrome-192x192.png',
    '/favicon/android-chrome-512x512.png',
    '/favicon/apple-touch-icon.png',
    '/favicon/favicon-16x16.png',
    '/favicon/favicon-32x32.png',
    '/favicon/favicon.ico',
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(FILES_TO_CACHE);
        })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request);
        })
    );
});
