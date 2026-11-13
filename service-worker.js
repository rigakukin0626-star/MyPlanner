const CACHE_NAME = "sovereign-v258-journal-chronological";
const FILES = ["./","./index.html","./minimal.css?v=184","./liquid-glass-v185.css?v=185.1","./liquid-glass-fix-v186.css?v=186","./liquid-glass-v187.css?v=187","./liquid-glass-v188.css?v=188","./liquid-glass-v189.css?v=189","./liquid-glass-v190.css?v=190","./liquid-glass-v191.css?v=191","./liquid-glass-v192.css?v=192","./keyboard-stability-v194.css?v=194","./chat-viewport-v210.css?v=210","./chat-composer-v211.css?v=211","./chat-latest-v212.css?v=212","./script.js?v=255","./finance-v196.js?v=252","./finance-v196.css?v=196","./english-layout-v197.css?v=197","./currency-v198.css?v=198","./native-currency-v199.css?v=199","./currency-record-v200.css?v=200","./currency-ui-v201.css?v=201","./modal-footer-v202.css?v=202","./dialog-grid-v203.css?v=203","./finance-currency-fix-v204.css?v=204","./finance-account-v205.css?v=205","./finance-trades-v214.css?v=214","./finance-quotes-v215.css?v=215","./finance-quotes-v216.css?v=216","./finance-chart-v217.css?v=217","./ios-search-zoom-v218.css?v=218","./quiet-glass-v220.css?v=220","./finance-history-v221.css?v=221","./finance-investment-v223.css?v=223","./finance-holding-manage-v225.css?v=225","./finance-quiet-actions-v226.css?v=226","./quiet-glass-pro-v227.css?v=227.1","./finance-private-banking-v228.css?v=228","./finance-hero-sizing-v229.css?v=229","./finance-investment-fit-v230.css?v=230","./quiet-gradients-v231.css?v=231","./chat-emoji-keyboard-v232.css?v=232","./luminous-pearl-light-v233.css?v=233","./dark-obsidian-violet-v234.css?v=234","./muted-obsidian-v235.css?v=235","./mufg-obsidian-gradients-v236.css?v=236","./budget-progress-gradients-v237.css?v=237","./ios-status-gradient-v238.css?v=238","./ink-blue-silver-cyan-light-v239.css?v=239","./finance-private-banking-polish-v240.css?v=240","./unified-violet-gradients-v242.css?v=242","./task-violet-surface-fix-v243.css?v=243","./finance-sync-reliability-v246.css?v=246","./sovereign-welcome-v254.css?v=254","./line-ui.js?v=184","./journal-v256.js?v=258","./journal-v256.css?v=257","./manifest.json?v=253","./icon.svg?v=245","./my-suite-icon-v245.png?v=245","./sovereign-icon-v253.png?v=253","./sovereign-icon-v253.svg?v=253"];
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
  // Charts are rendered natively; no external chart iframe is precached.
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
 const title=String(data.title|| (kind==="chat"?"SOVEREIGN · 新消息":kind==="group"?"SOVEREIGN · 群消息":"SOVEREIGN 提醒")).slice(0,90);
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
   body,icon:"./sovereign-icon-v253.png",badge:"./sovereign-icon-v253.png",tag,
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
