const APP_CACHE = "mood-bank-app-shell-v1";
const STATIC_CACHE = "mood-bank-static-v1";
const APP_SHELL_URLS = [
  "/",
  "/index.html",
  "/manifest.webmanifest",
  "/icons/icon-192.svg",
  "/icons/icon-512.svg",
];

self.addEventListener("install", (event) => {
  event.waitUntil(precacheAppShell().then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) =>
        Promise.all(
          cacheNames
            .filter((cacheName) => cacheName.startsWith("mood-bank-"))
            .filter((cacheName) => cacheName !== APP_CACHE && cacheName !== STATIC_CACHE)
            .map((cacheName) => caches.delete(cacheName)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;

  if (request.method !== "GET") {
    return;
  }

  const url = new URL(request.url);

  if (url.origin !== self.location.origin) {
    return;
  }

  if (request.mode === "navigate") {
    event.respondWith(handleNavigation(request));
    return;
  }

  if (url.pathname.startsWith("/assets/")) {
    event.respondWith(cacheFirst(request, STATIC_CACHE));
    return;
  }

  if (APP_SHELL_URLS.includes(url.pathname)) {
    event.respondWith(cacheFirst(request, APP_CACHE));
  }
});

async function handleNavigation(request) {
  try {
    const response = await fetch(request);

    if (response.ok) {
      const cache = await caches.open(APP_CACHE);
      cache.put("/index.html", response.clone());
    }

    return response;
  } catch {
    const cachedShell = await caches.match("/index.html");
    return cachedShell ?? Response.error();
  }
}

async function cacheFirst(request, cacheName) {
  const cachedResponse = await caches.match(request);

  if (cachedResponse) {
    return cachedResponse;
  }

  const response = await fetch(request);

  if (response.ok) {
    const cache = await caches.open(cacheName);
    cache.put(request, response.clone());
  }

  return response;
}

async function precacheAppShell() {
  const cache = await caches.open(APP_CACHE);
  await cache.addAll(APP_SHELL_URLS);

  const cachedIndex = await cache.match("/index.html");

  if (!cachedIndex) {
    return;
  }

  const indexHtml = await cachedIndex.text();
  const buildAssets = getBuildAssetUrls(indexHtml);

  if (buildAssets.length > 0) {
    await cache.addAll(buildAssets);
  }
}

function getBuildAssetUrls(html) {
  const urls = new Set();
  const attributePattern = /\b(?:src|href)="([^"]+)"/g;

  for (const match of html.matchAll(attributePattern)) {
    const url = new URL(match[1], self.location.origin);

    if (url.origin === self.location.origin && url.pathname.startsWith("/assets/")) {
      urls.add(url.pathname);
    }
  }

  return Array.from(urls);
}
