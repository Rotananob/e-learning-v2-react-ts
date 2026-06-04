// Improved service worker for Rotana E-Learning PWA
const CACHE_NAME = 'rotana-elearning-cache-v4';
const urlsToCache = [
  '/',
  '/index.html',
    '/oldversion.html',
  '/about-us.html',
  '/team.html',
  '/vision.html',
  '/dashboard.html',
  '/login.html',
  '/register.html',
  '/privacy-policy.html',
  '/manifest.json',
  '/assets/js/router.js'
];

self.addEventListener('install', event => {
  // Pre-cache resources but avoid caching redirected responses (Safari workaround)
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await Promise.all(urlsToCache.map(async url => {
      try {
        const resp = await fetch(url, { credentials: 'same-origin' });
        if (resp && resp.ok && !resp.redirected && resp.type !== 'opaqueredirect') {
          await cache.put(url, resp.clone());
        }
      } catch (e) {
        // ignore individual failures
      }
    }));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)))
    ).then(() => self.clients.claim())
  );
});

// Allow clients to message the SW to skip waiting and activate immediately
self.addEventListener('message', event => {
  if (!event.data) return;
  if (event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Helper: try fetch request, fallback to request + '.html' for navigations
async function fetchWithHtmlFallback(request) {
  try {
    const networkResponse = await fetch(request);
    // If the response is a redirect, do not cache or serve it (Safari bug workaround)
    if (networkResponse && networkResponse.ok && !networkResponse.redirected && networkResponse.type !== 'opaqueredirect') {
      return networkResponse;
    }
  } catch (e) {
    // continue to fallback
  }

  // If navigation, try appending .html and return the file directly (not a redirect)
  try {
    const url = new URL(request.url);
    if (url.origin === self.location.origin) {
      // Only for extensionless paths (no . in last segment)
      if (!/\.[^\/]+$/.test(url.pathname)) {
        const htmlPath = url.pathname.replace(/\/$/, '') + '.html';
        const htmlUrl = new URL(htmlPath, self.location.origin).href;
        // Fetch the .html file and return it directly
        const htmlResp = await fetch(htmlUrl, { credentials: 'same-origin' });
        // If the response is a redirect, do not cache or serve it (Safari bug workaround)
        if (htmlResp && htmlResp.ok && !htmlResp.redirected && htmlResp.type !== 'opaqueredirect') {
          // Return the .html file as a 200 response (not a redirect)
          return new Response(await htmlResp.blob(), {
            status: 200,
            statusText: 'OK',
            headers: {
              'Content-Type': htmlResp.headers.get('Content-Type') || 'text/html',
              'X-Served-By-ServiceWorker': 'true'
            }
          });
        }
      }
    }
  } catch (e) {}

  return null;
}

self.addEventListener('fetch', event => {
  const req = event.request;
  // navigation requests: try cache, then network, then html fallback
  if (req.mode === 'navigate') {
    event.respondWith((async () => {
      // Prefer network for navigations to avoid serving redirects from cache
      try {
        const networkResp = await fetch(req);
        // If response is OK and not a redirected response, serve it
        if (networkResp && networkResp.ok && !networkResp.redirected && networkResp.type !== 'opaqueredirect') {
          return networkResp;
        }
        // If network gave a redirected response or not ok, try the HTML fallback
        const htmlFallback = await fetchWithHtmlFallback(req);
        if (htmlFallback && htmlFallback.ok) return htmlFallback;
      } catch (e) {
        // network failed, continue to cache fallbacks
      }

      // Fallback to cached /index.html or offline message
      const cache = await caches.open(CACHE_NAME);
      const indexCache = await cache.match('/index.html');
      if (indexCache) return indexCache;
      try {
        const indexResp = await fetch('/index.html');
        if (indexResp && indexResp.ok) {
          cache.put('/index.html', indexResp.clone()).catch(()=>{});
          return indexResp;
        }
      } catch (e) {}

      return new Response('មិនអាចបើកទំព័របានទេ (Offline)', { status: 503, statusText: 'Offline' });
    })());
    return;
  }

  // For other requests, respond from cache then network
  // For non-navigation requests, use network-first for HTML (router fetches), cache-first for others
  const acceptHeader = req.headers.get && req.headers.get('accept');
  const wantsHtml = (acceptHeader && acceptHeader.indexOf('text/html') !== -1) || req.url.endsWith('.html');

  if (req.method === 'GET' && wantsHtml) {
    event.respondWith((async () => {
      try {
        const networkResp = await fetch(req);
        if (networkResp && networkResp.ok && !networkResp.redirected && networkResp.type !== 'opaqueredirect') {
          // clone response before any body read
          const respForCache = networkResp.clone();
          caches.open(CACHE_NAME).then(c => c.put(req, respForCache)).catch(()=>{});
          return networkResp;
        }
      } catch (e) {}

      const cached = await caches.match(req);
      if (cached) return cached;
      try {
        const networkResp2 = await fetch(req);
        if (networkResp2 && networkResp2.ok) return networkResp2;
      } catch(e){ return cached; }
    })());
    return;
  }

  // default: try cache first, then network
  event.respondWith(
    caches.match(req).then(cached => cached || fetch(req).then(resp => {
      if (req.method === 'GET' && resp && resp.ok && !resp.redirected && resp.type !== 'opaqueredirect') {
        // clone response before any body read
        const respForCache = resp.clone();
        caches.open(CACHE_NAME).then(c => c.put(req, respForCache));
      }
      return resp;
    }).catch(()=> cached))
  );
});
