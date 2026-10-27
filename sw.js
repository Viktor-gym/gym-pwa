// GymTracker Pro Service Worker
// - offline support
// - cache bust via CACHE version

// bump version when you publish updates
importScripts('./exercise-precache-v47.js');
const CACHE = 'gym-pwa-v47-movement-atlas';
const MEDIA_CACHE = 'gym-pwa-exercise-media-v1';
const ASSETS = ['./index.html','./app-v47.js','./studio-v47.css','./exercise-library-v47.js','./exercise-atlas-v47.js','./exercise-precache-v47.js','./manifest.json','./icons/icon-192.png','./icons/icon-512.png'];

self.addEventListener("install", (e) => {
  e.waitUntil(Promise.all([
    caches.open(CACHE).then(c=>c.addAll(ASSETS)),
    caches.open(MEDIA_CACHE).then(c=>Promise.allSettled(self.GYM_PHOTO_ASSETS.map(url=>c.add(url))))
  ]));
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter(k=>k.startsWith('gym-pwa-') && k !== CACHE && k !== MEDIA_CACHE).map(k=>caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  if(e.request.method!=='GET') return;
  const url=new URL(e.request.url);
  const isMedia=(url.origin===self.location.origin && url.pathname.includes('/assets/exercises/')) || (url.origin==='https://raw.githubusercontent.com' && url.pathname.startsWith('/yuhonas/free-exercise-db/'));
  if(isMedia){
    const network=()=>fetch(e.request).then(async response=>{
      if(response.ok || response.type==='opaque'){
        const media=await caches.open(MEDIA_CACHE);
        await media.put(e.request,response.clone());
        const keys=await media.keys();
        // Bound only on-demand remote images; bundled photos remain available offline.
        const remote=keys.filter(key=>new URL(key.url).origin!==self.location.origin);
        if(remote.length>240) await Promise.all(remote.slice(0,remote.length-240).map(key=>media.delete(key)));
      }
      return response;
    });
    e.respondWith(caches.match(e.request).then(cached=>cached || network()).catch(()=>Response.error()));
    return;
  }
  if (e.request.mode === "navigate") {
    e.respondWith(
      fetch(e.request)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((cache) => cache.put("./index.html", copy));
          return res;
        })
        .catch(() => caches.match("./index.html"))
    );
    return;
  }

  e.respondWith(
    caches.match(e.request).then((cached) => {
      if (cached) return cached;
      return fetch(e.request).then((res) => {
        if (e.request.method === "GET" && res.ok) {
          const copy = res.clone();
          caches.open(CACHE).then((cache) => cache.put(e.request, copy));
        }
        return res;
      });
    })
  );
});
