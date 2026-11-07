const CACHE_NAME = "my-planner-v173";
const FILES = ["./","./index.html","./minimal.css?v=173","./script.js?v=171","./line-ui.js?v=171","./manifest.json?v=63","./icon.svg?v=170"];
self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(FILES)));
  self.skipWaiting();
});
self.addEventListener("activate", event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;
  const url = new URL(event.request.url);
  // Never cache authentication, Supabase data, signed media, or other cross-origin requests.
  if (url.origin !== self.location.origin) return;
  if (event.request.mode === "navigate") {
    event.respondWith(fetch(event.request,{cache:"no-store"}).then(response => {
      if (response.ok) { const copy=response.clone(); caches.open(CACHE_NAME).then(cache=>cache.put("./index.html",copy)); }
      return response;
    }).catch(()=>caches.match("./index.html")));
    return;
  }
  // Versioned app assets are immutable within a release: serve locally first.
  // New versions have new query strings and are precached during installation.
  if (/\/(script\.js|line-ui\.js|minimal\.css)$/.test(url.pathname)) {
    event.respondWith(caches.match(event.request).then(cached => cached || fetch(event.request).then(response => {
      if(response.ok && response.type === "basic"){
        const copy=response.clone();
        caches.open(CACHE_NAME).then(cache=>cache.put(event.request,copy)).catch(()=>{});
      }
      return response;
    })));
    return;
  }
  event.respondWith(caches.match(event.request).then(cached => cached || fetch(event.request).then(response => {
    if (response.ok && response.type === "basic") {
      const copy = response.clone(); caches.open(CACHE_NAME).then(cache=>cache.put(event.request,copy));
    }
    return response;
  })));
});
/* v100: privacy-aware background push and notification deep links */
self.addEventListener("push", event => {
 let data={};
 try{data=event.data?event.data.json():{}}catch{data={body:event.data?.text()||""}}
 if(!data||typeof data!=="object")data={};
 const kind=data.type==="chat"?"chat":data.type==="group"?"group":"task";
 const title=String(data.title|| (kind==="chat"?"My Planner · 新消息":kind==="group"?"My Planner · 群消息":"My Planner 提醒")).slice(0,90);
 const body=String(data.body|| (kind==="task"?"你设置的任务提醒时间到了。":"收到一条新消息")).slice(0,220);
 const requested=typeof data.url==="string"?data.url:"./";
 const target=new URL(requested,self.registration.scope);
 const safeUrl=target.origin===self.location.origin&&target.pathname.startsWith(new URL(self.registration.scope).pathname)?target.href:self.registration.scope;
 const tag=typeof data.tag==="string"?data.tag.slice(0,100):kind+"-"+(data.group_id||data.sender_id||"general");
 event.waitUntil((async()=>{
  const windows=await self.clients.matchAll({type:"window",includeUncontrolled:true});
  const visible=windows.some(client=>client.visibilityState==="visible"&&client.focused);
  if(visible&&data.silent_when_active!==false){
   for(const client of windows){if(client.visibilityState==="visible")client.postMessage({type:"MYPLANNER_PUSH_RECEIVED",kind})}
   return;
  }
  await self.registration.showNotification(title,{
   body,icon:"./icon.svg",badge:"./icon.svg",tag,
   data:{url:safeUrl,kind},renotify:false
  });
 })());
});
self.addEventListener("notificationclick",event=>{
 event.notification.close();
 const url=event.notification.data?.url||self.registration.scope;
 event.waitUntil((async()=>{
  const target=new URL(url,self.registration.scope);
  const windows=await self.clients.matchAll({type:"window",includeUncontrolled:true});
  for(const client of windows){
   const existing=new URL(client.url);
   if(existing.origin!==self.location.origin||!existing.pathname.startsWith(new URL(self.registration.scope).pathname))continue;
   if("navigate" in client){try{await client.navigate(target.href)}catch{}}
   if("focus" in client){await client.focus();return;}
  }
  return self.clients.openWindow(target.href);
 })());
});
