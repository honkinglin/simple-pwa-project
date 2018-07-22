importScripts('./node_modules/workbox-sw/build/workbox-sw.js');

const staticAssets = [
    './',
    './style.css',
    './app.js',
    './fallback.json',
    './images/fetch-dog.jpg'
];

workbox.setConfig({ debug: true });
workbox.precaching.precache(staticAssets);

workbox.routing.registerRoute(
    new RegExp('https://newsapi.org/(.*)'),
    workbox.strategies.networkFirst()
);
workbox.routing.registerRoute(
    /.*\.(png|jpe?g|gif)/,
    workbox.strategies.cacheFirst({
        cacheName: 'news-images',
        cacheExpiration: { maxEntries: 20, maxAgeSeconds: 12 * 60 * 60 },
        cacheableResponse: { statuses: [0, 200] }
    })
);