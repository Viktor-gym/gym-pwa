// GymTracker Pro Service Worker
// - offline support
// - cache bust via CACHE version

// bump version when you publish updates
const CACHE = "gym-pwa-v6";
const ASSETS = ["./", "./index.html", "./app.js", "./manifest.json"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches
      .match(e.request, { ignoreSearch: true })
      .then((res) => res || fetch(e.request).catch(() => caches.match("./index.html")))
  );
});
