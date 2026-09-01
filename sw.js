/* Service worker — Traduction Contrôle Frontière
   Précache du shell + polices ; audio mis en cache à la première écoute. */
"use strict";

const VERSION = "apptrad-v1";
const STATIC_CACHE = VERSION + "-static";
const AUDIO_CACHE  = VERSION + "-audio";

const PRECACHE = [
  "./",
  "index.html",
  "app.js",
  "legislation.html",
  "legislation.js",
  "manifest.json",
  "fonts.css",
  "favicon.ico",
  "icons/favicon-32.png",
  "icons/icon-192.png",
  "icons/icon-512.png",
  "icons/icon-512-maskable.png",
  "icons/apple-touch-icon.png",
  "fonts/dm-sans-latin-300-normal.woff2",
  "fonts/dm-sans-latin-400-normal.woff2",
  "fonts/dm-sans-latin-500-normal.woff2",
  "fonts/dm-sans-latin-ext-300-normal.woff2",
  "fonts/dm-sans-latin-ext-400-normal.woff2",
  "fonts/dm-sans-latin-ext-500-normal.woff2",
  "fonts/playfair-display-latin-500-normal.woff2",
  "fonts/playfair-display-latin-700-normal.woff2",
  "fonts/playfair-display-latin-ext-500-normal.woff2",
  "fonts/playfair-display-latin-ext-700-normal.woff2",
];

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(STATIC_CACHE)
      .then(c => c.addAll(PRECACHE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => !k.startsWith(VERSION)).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return;
  if (req.headers.has("range")) return; // requêtes partielles → réseau

  if (url.pathname.includes("/Audio/")) {
    // Audio : cache d'abord, sinon réseau + mise en cache
    e.respondWith(
      caches.open(AUDIO_CACHE).then(cache =>
        cache.match(req).then(hit => hit || fetch(req).then(res => {
          if (res.ok) cache.put(req, res.clone());
          return res;
        }))
      )
    );
    return;
  }

  // Shell/statique : stale-while-revalidate (offline-first, mise à jour en arrière-plan)
  e.respondWith(
    caches.open(STATIC_CACHE).then(cache =>
      cache.match(req).then(hit => {
        const refresh = fetch(req).then(res => {
          if (res.ok) cache.put(req, res.clone());
          return res;
        }).catch(() => hit);
        return hit || refresh;
      })
    )
  );
});
