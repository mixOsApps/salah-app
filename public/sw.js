// Bump this to force every client to drop its old cache on next activate -- see the comment on
// the "activate" handler below. Not tied to the app's own version; there is no build-time hook
// available here (adding one would mean a Vite plugin, which needs registering in vite.config.js,
// off limits for this port -- see WEB_TASK_PROMPTS.md's workspace decision).
const CACHE_NAME = "salah-app-v1";
const BASE = "/salah-app/";
const PRECACHE_URLS = [BASE, BASE + "manifest.webmanifest", BASE + "icons/icon-192.png", BASE + "icons/icon-512.png"];

self.addEventListener("install", (event) => {
  // Take over from any previous worker immediately rather than waiting for every open tab to
  // close -- the goal here (per the task) is that a reader is never stranded on a stale build.
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      cache.addAll(PRECACHE_URLS).catch(() => {
        // A flaky network at install time shouldn't block registration -- everything here also
        // gets cached opportunistically the first time it's actually requested (see "fetch"
        // below), this just means offline support isn't ready quite as early.
      })
    )
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((names) => Promise.all(names.filter((name) => name !== CACHE_NAME).map((name) => caches.delete(name))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // The app shell: this is a hash router (see useHashRoute.js), so every real navigation the
  // browser makes is to the same document regardless of which screen is showing -- there is no
  // separate URL per screen to fall back to the way a history-routed SPA would need. Network-first
  // so a reader who's online always gets the build that references the current build's hashed
  // asset filenames; falls back to the last-cached shell when offline.
  if (request.mode === "navigate" || url.pathname === BASE || url.pathname === BASE + "index.html") {
    event.respondWith(networkFirst(request));
    return;
  }

  // Everything else -- JS/CSS/images/the PDF under assets/, the manifest, the icons -- is either
  // content-hashed (Vite fingerprints every build's output) or otherwise static, so cache-first is
  // safe: a given URL's content never changes once published. A build that changes something
  // ships it under a new hashed URL, which is simply a cache miss here and gets fetched fresh.
  event.respondWith(cacheFirst(request));
});

async function networkFirst(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await caches.match(request, { ignoreSearch: true });
    return cached || caches.match(BASE);
  }
}

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  if (response.ok) {
    const cache = await caches.open(CACHE_NAME);
    cache.put(request, response.clone());
  }
  return response;
}
