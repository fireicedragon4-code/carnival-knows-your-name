const CACHE = "carnival-pc-demo-v11";
const FILES = [
  "./",
  "./game",
  "./game.css?v=11",
  "./game.js?v=11",
  "./manifest.webmanifest",
  "./assets/apple-touch-icon.png",
  "./assets/carnival-bg.png",
  "./assets/lucien.png",
  "./assets/seren.png",
  "./assets/milo.png",
  "./assets/liora.png",
  "./assets/pippa.png",
  "./assets/protagonist-male.png",
  "./assets/protagonist-female.png",
  "./assets/protagonist-solstice-mask.png",
  "./assets/characters/protagonists/male-short.png",
  "./assets/characters/protagonists/male-long.png",
  "./assets/characters/protagonists/female-short.png",
  "./assets/characters/protagonists/female-long.png",
  "./assets/backgrounds/bedroom-anime.png",
  "./assets/backgrounds/night-road-anime.png",
  "./assets/backgrounds/theater-anime.png",
  "./assets/backgrounds/backstage-stairs-anime.png",
  "./assets/backgrounds/backstage-passage-anime.png",
  "./assets/backgrounds/mask-workshop-anime.png",
  "./assets/backgrounds/costume-storage-anime.png",
  "./assets/backgrounds/final-lift-anime.png"
];

self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(FILES)));
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key))))
  );
  self.clients.claim();
});

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;
  event.respondWith(
    fetch(event.request).then(response => {
      if (response.ok) {
        const copy = response.clone();
        event.waitUntil(caches.open(CACHE).then(cache => cache.put(event.request, copy)));
      }
      return response;
    }).catch(() => caches.match(event.request).then(cached => cached || caches.match("./game")))
  );
});
