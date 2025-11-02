const CACHE_NAME = "site-cache-v1";
const URLS_TO_CACHE = ["/", "/favicon.ico", "/manifest.json"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(URLS_TO_CACHE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) =>
        Promise.all(
          cacheNames
            .filter((name) => name !== CACHE_NAME)
            .map((name) => caches.delete(name))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        if (networkResponse.status === 404) {
          event.waitUntil(
            caches.open(CACHE_NAME).then((cache) => cache.delete(event.request))
          );
          return networkResponse;
        }
        const responseClone = networkResponse.clone();
        event.waitUntil(
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone))
        );
        return networkResponse;
      })
      .catch(() => {
        return caches.match(event.request);
      })
  );
});
