const staticCacheName = 'v1';
const filesToCache = [
  './',
  'styles/style.css',
  'styles/about.css',
  'styles/contact.css',
  'styles/header-footer.css',
  'styles/index.css',
  'styles/normalize.css',
  'styles/staff.css',
  'images/favicon.jfif',
  './index.html',
  './About.html',
  './Contact.html',
  './Staff.html',
  "https://fonts.googleapis.com/css?family=Lato:100,300,400&display=swap",
  "https://placekitten.com/225/175",
  "https://placekitten.com/224/175",
  "https://placekitten.com/226/175",
  "http://placekitten.com/120/120",
  "http://placekitten.com/121/121",
  "http://placekitten.com/122/122"
];


self.addEventListener('install', function(event) {
  console.log('[Service Worker] Installing Service Worker ...', event);
  event.waitUntil(
    caches.open(staticCacheName)
      .then(cache => cache.addAll(filesToCache))
      .then(() => self.skipWaiting())
  )
});

self.addEventListener('activate', function(event) {
  console.log('[Service Worker] Activating Service Worker ....', event);
  const cacheWhitelist = [staticCacheName];

  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('[Service Worker] Removing old cache.', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(caches.match(event.request)
    .then(response => {
      if (response) {
        console.log('Found ', event.request.url, ' in cache');
        return response;
      } else {
        return fetch(event.request)
          .then(res => {
            return caches.open(staticCacheName)
              .then(cache => {
                cache.put(event.request.url, res.clone());
                return res;
              })
          })
          .catch(err => console.log(err));
      }
    })
  );
});