const V="ams-guide-20261123-01",RT="ams-runtime";
const CORE=["./","index.html","manifest.webmanifest","icon-192.png","icon-512.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()));});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V&&k!==RT).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener("fetch",e=>{
 const r=e.request;if(r.method!=="GET")return;const u=new URL(r.url);
 if(u.origin===location.origin){
  e.respondWith(fetch(r).then(res=>{const cp=res.clone();caches.open(V).then(c=>c.put(r,cp));return res;}).catch(()=>caches.match(r).then(m=>m||caches.match("index.html"))));return;
 }
 if(/tile\.openstreetmap|cartocdn|wikimedia|wikipedia\.org\/api/.test(u.host+u.pathname)){
  e.respondWith(caches.open(RT).then(c=>c.match(r).then(m=>{const f=fetch(r).then(res=>{if(res&&(res.ok||res.type==="opaque"))c.put(r,res.clone());return res;}).catch(()=>m);return m||f;})));return;
 }
 if(/open-meteo|frankfurter|er-api/.test(u.host)){
  e.respondWith(fetch(r).then(res=>{const cp=res.clone();caches.open(RT).then(c=>c.put(r,cp));return res;}).catch(()=>caches.match(r)));
 }
});
