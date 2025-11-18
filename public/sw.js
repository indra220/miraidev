// Service Worker untuk dukungan offline MiraiDev

const CACHE_NAME = 'mirai-dev-v1';
const urlsToCache = [
  '/',
  '/layanan',
  '/template',
  '/tentang',
  '/kontak',
  '/globals.css', // atau file CSS yang Anda gunakan
];

self.addEventListener('install', function(event) {
  // Instal service worker dan cache sumber daya
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', function(event) {
  // Tangani permintaan fetch
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Kembalikan respons dari cache jika tersedia
        if (response) {
          return response;
        }
        // Jika tidak, fetch dari jaringan
        return fetch(event.request);
      }
    )
  );
});