// GymTracker Pro Service Worker
// - offline support
// - cache bust via CACHE version

// bump version when you publish updates
importScripts('./exercise-precache-v47.js','./exercise-repdb-precache-v49.js','./gym-motion-precache-v55.js');
const CACHE = 'gym-pwa-v55-full-list-grips';
const MEDIA_CACHE = 'gym-pwa-exercise-media-v1';
const ASSETS = ['./index.html','./app-v53.js','./studio-v53.css','./body-metrics-v52.js','./exercise-library-v47.js','./exercise-motion-v48.js','./exercise-repdb-v49.js','./exercise-legacy-v51.js','./exercise-atlas-v54.js','./gym-motion-catalog-v55.js','./gym-motion-v55.js','./gym-motion-precache-v55.js','./exercise-precache-v47.js','./exercise-repdb-precache-v49.js','./manifest.json','./icons/icon-192.png','./icons/icon-512.png'];
const MOTION_ASSETS=[...Array.from({length:50},(_,index)=>String(index+51).padStart(4,'0')).flatMap(id=>['./assets/motion/'+id+'.jpg','./assets/motion/'+id+'.mp4']),...(self.GYM_SHARED_MOTION_ASSETS||[])];

self.addEventListener("install", (e) => {
  e.waitUntil(Promise.all([
    caches.open(CACHE).then(c=>c.addAll(ASSETS)),
    caches.open(MEDIA_CACHE).then(c=>Promise.allSettled([...self.GYM_PHOTO_ASSETS,...MOTION_ASSETS,...self.GYM_REPDB_ASSETS].map(async url=>{if(!await c.match(url))await c.add(url);})))
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
  // iPhone media playback requests byte ranges, including during offline playback.
  if(url.origin===self.location.origin && /\/assets\/(?:motion\/\d{4}|repdb-motion\/[a-z0-9-]+)\.mp4$/.test(url.pathname)){
    e.respondWith((async()=>{
      const media=await caches.open(MEDIA_CACHE);
      let full=await media.match(url.href);
      if(!full){
        full=await fetch(new Request(url.href,{credentials:'same-origin'}));
        if(full.status===200)await media.put(url.href,full.clone());
      }
      return e.request.headers.has('Range')&&full.status===200?rangeResponse(full,e.request.headers.get('Range')):full;
    })().catch(()=>Response.error()));
    return;
  }
  const isMotionPoster=url.origin===self.location.origin && /\/assets\/(?:motion\/\d{4}|repdb-motion\/[a-z0-9-]+)\.jpg$/.test(url.pathname);
  const isMedia=isMotionPoster || (url.origin===self.location.origin && /\/assets\/(?:exercises|poses|gym-motion)\//.test(url.pathname)) || (url.origin==='https://raw.githubusercontent.com' && url.pathname.startsWith('/yuhonas/free-exercise-db/'));
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

async function rangeResponse(response,header){
  const bytes=await response.arrayBuffer(),size=bytes.byteLength;
  const match=/^bytes=(\d*)-(\d*)$/.exec(header);
  if(!match || (!match[1]&&!match[2]))return new Response(null,{status:416,headers:{'Content-Range':'bytes */'+size}});
  const start=match[1]?Number(match[1]):Math.max(0,size-Number(match[2]));
  const end=match[1]?(match[2]?Math.min(Number(match[2]),size-1):size-1):size-1;
  if(!Number.isSafeInteger(start)||!Number.isSafeInteger(end)||start>end||start>=size)return new Response(null,{status:416,headers:{'Content-Range':'bytes */'+size}});
  const headers=new Headers(response.headers);
  headers.delete('Content-Encoding');headers.delete('Transfer-Encoding');
  headers.set('Content-Type','video/mp4');headers.set('Accept-Ranges','bytes');headers.set('Content-Range',`bytes ${start}-${end}/${size}`);headers.set('Content-Length',String(end-start+1));
  return new Response(bytes.slice(start,end+1),{status:206,statusText:'Partial Content',headers});
}
