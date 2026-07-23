const CACHE = "techaneh-shell-v6";
const CORE = [
  "./",
  "./index.html",
  "./config.js",
  "./manifest.webmanifest",
  "./favicon.svg",
  "./assets/techaneh-mark.svg",
  "./assets/apple-touch-icon.png",
  "./assets/icon-192.png",
  "./assets/icon-512.png",
  "./assets/og-cover.png",
  "./assets/site.css",
  "./assets/v5.css",
  "./assets/v6.css",
  "./assets/v5-preflight.js",
  "./assets/app.js",
  "./assets/v5.js",
  "./assets/v6.js",
  "./articles.js",
  "./products.js",
  "./data/knowledge.json",
  "./feed.xml",
  "./opensearch.xml"
];

self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(CORE)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== "GET" || url.origin !== location.origin) return;

  if (request.mode === "navigate" || url.pathname.endsWith("/data/knowledge.json")) {
    event.respondWith(
      fetch(request)
        .then(response => {
          const copy = response.clone();
          caches.open(CACHE).then(cache => cache.put(request, copy));
          return response;
        })
        .catch(() => caches.match(request).then(hit => hit || (request.mode === "navigate" ? caches.match("./index.html") : undefined)))
    );
    return;
  }

  event.respondWith(
    caches.match(request).then(cached => {
      const network = fetch(request).then(response => {
        if (response.ok) caches.open(CACHE).then(cache => cache.put(request, response.clone()));
        return response;
      });
      return cached || network;
    })
  );
});
