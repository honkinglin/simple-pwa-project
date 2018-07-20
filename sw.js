const staticAssets = [
    './',
    './style.css',
    './app.js',
    './fallback.json',
    './images/fetch-dog.jpg'
];

self.addEventListener('install', async event => {
    const cache = await caches.open('news-static');
    cache.addAll(staticAssets);
})

self.addEventListener('fetch', event => {
    const req = event.request;
    const url = new URL(req.url);

    if (url.origin === location.origin) {
        event.respondWith(cacheFirst(req));
    } else if ((req.url.indexOf('http') !== -1)) {
        event.respondWith(networkFirst(req));
    }
});

async function cacheFirst(req) {
    const cachedResponse = await caches.match(req);
    return cachedResponse || fetch(req);
}

async function networkFirst(req) {
    const cache = await caches.open('news-dynamic');

    try {
        const res = await fetch(req);
        cache.put(req, res.clone());
        return res;
    } catch (error) {
        const cachedResponse = await cache.match(req);
        return cachedResponse || await caches.match('./fallback.json');
    }
}