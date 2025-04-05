const CACHE_NAME = 'durst-rechner-v2';

const FILES_TO_CACHE = [
    '/',
    '/index.html',
    '/assets/manifest.json',
    '/assets/script/service-worker.js',
    '/assets/style/stylesheet.css',
    '/assets/script/all.js',
    '/assets/script/calculator.js',
    '/assets/script/theme.js',
    '/node_modules/bootstrap/dist/css/bootstrap.min.css',
    '/node_modules/bootstrap/dist/js/bootstrap.bundle.min.js',
    '/node_modules/bootstrap-icons/font/bootstrap-icons.min.css',
    '/node_modules/bootstrap-icons/font/fonts/bootstrap-icons.woff2',
    '/node_modules/bootstrap-icons/font/fonts/bootstrap-icons.woff',
    '/assets/favicon/android-chrome-192x192.png',
    '/assets/favicon/android-chrome-512x512.png',
    '/assets/favicon/apple-touch-icon.png',
    '/assets/favicon/favicon-16x16.png',
    '/assets/favicon/favicon-32x32.png',
    '/assets/favicon/favicon.ico',
];


const FILES_TO_CACHE_PREFIXED = FILES_TO_CACHE.map(e => {
    let origin = self.location.href.replace('index.html', '');
    return origin + e;
})

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(FILES_TO_CACHE_PREFIXED);
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
