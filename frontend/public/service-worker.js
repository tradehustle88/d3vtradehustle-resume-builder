// Service Worker for Trade Hustle Resume Builder
// Caches static assets, fonts, and images for faster repeat visits

const CACHE_NAME = 'tradehustle-v1'
const STATIC_ASSETS = [
  '/',
  '/assets/resumeBuilderLogo-v3.webp',
]

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS)
    })
  )
  self.skipWaiting()
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      )
    })
  )
  self.clients.claim()
})

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return

  // Skip Chrome extension requests
  if (event.request.url.startsWith('chrome-extension://')) return

  // Cache strategy for different asset types
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse
      }

      return fetch(event.request).then((response) => {
        // Cache fonts, images, and static assets
        if (
          event.request.url.includes('/assets/') ||
          event.request.url.includes('fonts.gstatic.com') ||
          event.request.url.includes('fonts.googleapis.com') ||
          event.request.destination === 'image' ||
          event.request.destination === 'font' ||
          event.request.destination === 'style'
        ) {
          const responseToCache = response.clone()
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache)
          })
        }

        return response
      })
    })
  )
})
