const CACHE_NAME = 'durst-rechner-v2';

const BASE_PATH = self.location.pathname.includes('DurstRechner') ? '/DurstRechner' : ''; // Handle GitHub Pages vs. Localhost

const FILES_TO_CACHE = [
    '/',
    `${BASE_PATH}/index.html`,
    `${BASE_PATH}/assets/manifest.json`,
    `${BASE_PATH}/assets/script/service-worker.js`,
    `${BASE_PATH}/assets/style/stylesheet.css`,
    `${BASE_PATH}/assets/script/all.js`,
    `${BASE_PATH}/assets/script/calculator.js`,
    `${BASE_PATH}/assets/script/theme.js`,
    `${BASE_PATH}/node_modules/bootstrap/dist/css/bootstrap.min.css`,
    `${BASE_PATH}/node_modules/bootstrap/dist/js/bootstrap.bundle.min.js`,
    `${BASE_PATH}/node_modules/bootstrap-icons/font/bootstrap-icons.min.css`,
    `${BASE_PATH}/node_modules/bootstrap-icons/font/fonts/bootstrap-icons.woff2`,
    `${BASE_PATH}/node_modules/bootstrap-icons/font/fonts/bootstrap-icons.woff`,
    `${BASE_PATH}/assets/favicon/android-chrome-192x192.png`,
    `${BASE_PATH}/assets/favicon/android-chrome-512x512.png`,
    `${BASE_PATH}/assets/favicon/apple-touch-icon.png`,
    `${BASE_PATH}/assets/favicon/favicon-16x16.png`,
    `${BASE_PATH}/assets/favicon/favicon-32x32.png`,
    `${BASE_PATH}/assets/favicon/favicon.ico`,
];

// Cache files with the correct base path
const FILES_TO_CACHE_PREFIXED = FILES_TO_CACHE;

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            const cachePromises = FILES_TO_CACHE_PREFIXED.map(url => {
                return fetch(url).then(response => {
                    if (response.ok) {
                        return cache.put(url, response);
                    } else {
                        console.error(`Failed to fetch: ${url}`);
                    }
                }).catch(err => {
                    console.error(`Failed to fetch (network error): ${url}`, err);
                });
            });
            return Promise.all(cachePromises);
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

self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (!cacheWhitelist.includes(cacheName)) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
