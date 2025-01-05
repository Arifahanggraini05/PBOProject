const CACHE_NAME = 'kafe-kami-cache-v2'; // Pastikan versi cache diperbarui
const urlsToCache = [
    '/',
    '/index.html',
    '/styles.css',
    '/app.js',
    '/manifest.json',
    '/cappuccino.jpg',
    '/espresso.jpg',
    '/icon-192x192.jpg',
    '/icon-512x512.jpg',
];
// Install Service Worker dan cache semua file
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('Caching files...');
            return cache.addAll(urlsToCache);
        })
    );
    self.skipWaiting(); // Memastikan SW langsung aktif setelah instalasi
});
// Activate Service Worker dan hapus cache lama
self.addEventListener('activate', (event) => {
    console.log('Service worker activated.');
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log(`Deleting old cache: ${cacheName}`);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    self.clients.claim(); // Mengambil alih semua tab tanpa reload
});
// Fetch file dari cache atau jaringan
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            // Jika file ditemukan di cache, gunakan itu
            if (response) {
                return response;
            }
            // Jika tidak, ambil dari jaringan dan tambahkan ke cache
            return fetch(event.request).then((networkResponse) => {
                if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
                    return networkResponse;
                }
                // Clone respon jaringan dan simpan ke cache
                const responseToCache = networkResponse.clone();
                caches.open(CACHE_NAME).then((cache) => {
                    cache.put(event.request, responseToCache);
                });
                return networkResponse;
            });
        }).catch(() => {
            // Fallback offline: tampilkan halaman default jika tidak ada koneksi
            if (event.request.mode === 'navigate') {
                return caches.match('/index.html');
            }
        })
    );
}); 
