const CACHE_NAME = "my-planner-v92";
const FILES = ["./","./index.html","./style.css?v=92","./script.js?v=92","./manifest.json?v=92","./icon.svg"];
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
  if (event.request.mode === "navigate") {
    event.respondWith(fetch(event.request).then(response => {
      if (response.ok) { const copy=response.clone(); caches.open(CACHE_NAME).then(cache=>cache.put("./index.html",copy)); }
      return response;
    }).catch(()=>caches.match("./index.html")));
    return;
  }
  if (/\/(script\.js|style\.css)$/.test(new URL(event.request.url).pathname)) {
    event.respondWith(fetch(event.request).catch(()=>caches.match(event.request)));
    return;
  }
  event.respondWith(caches.match(event.request).then(cached => cached || fetch(event.request).then(response => {
    const copy = response.clone(); caches.open(CACHE_NAME).then(cache => cache.put(event.request,copy)); return response;
  }).catch(() => caches.match("./index.html"))));
});
self.addEventListener("push", event => {
  let data = {};
  try { data = event.data ? event.data.json() : {}; } catch { data = { body: event.data ? event.data.text() : "有一项任务需要处理。" }; }
  const title = data.title || "My Planner 提醒";
  const options = {
    body: data.body || "你设置的任务提醒时间到了。",
    icon: "./icon.svg",
    badge: "./icon.svg",
    data: { url: data.url || "./" }
  };
  event.waitUntil(self.registration.showNotification(title, options));
});
self.addEventListener("notificationclick", event => {
  event.notification.close();
  const target = new URL(event.notification.data?.url || "./", self.location.origin).href;
  event.waitUntil(self.clients.matchAll({ type: "window", includeUncontrolled: true }).then(clients => {
    for (const client of clients) {
      if (client.url.startsWith(self.location.origin) && "focus" in client) return client.focus();
    }
    return self.clients.openWindow(target);
  }));
});
