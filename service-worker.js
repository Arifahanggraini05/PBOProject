const CACHE_NAME = 'kafe-kami-cache-v2';
const urlsToCache = [
    '/',
    '/index.html',
    '/styles.css',
    '/app.js',
    '/manifest.json',
    '/icon-192x192.jpg',
    '/icon-512x512.jpg',
];

// Install Service Worker
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Cache dibuka');
                // Tambahkan penanganan error untuk setiap file
                return Promise.all(
                    urlsToCache.map(url => {
                        return cache.add(url).catch(err => {
                            console.error(`Failed to cache ${url}:`, err);
                        });
                    })
                );
            })
            .then(() => {
                console.log('Semua file berhasil di-cache');
            })
            .catch(error => {
                console.error('Gagal meng-cache files:', error);
            })
    );
    self.skipWaiting();
});

// Activate Service Worker
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log(`Menghapus cache lama: ${cacheName}`);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
        .then(() => {
            console.log('Service Worker aktif dan mengontrol halaman');
            return self.clients.claim();
        })
    );
});

// Fetch Strategy
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                if (response) {
                    console.log('Menggunakan cache untuk:', event.request.url);
                    return response;
                }
                
                console.log('Mengambil dari network:', event.request.url);
                return fetch(event.request)
                    .then((networkResponse) => {
                        // Check valid response
                        if (!networkResponse || networkResponse.status !== 200) {
                            console.log('Dapat response tidak valid dari network');
                            return networkResponse;
                        }

                        // Clone response untuk cache
                        const responseToCache = networkResponse.clone();

                        caches.open(CACHE_NAME)
                            .then((cache) => {
                                cache.put(event.request, responseToCache);
                                console.log('File baru di-cache:', event.request.url);
                            });

                        return networkResponse;
                    })
                    .catch((error) => {
                        console.error('Fetch gagal:', error);
                        // Jika request adalah navigasi (HTML), kembalikan halaman offline
                        if (event.request.mode === 'navigate') {
                            return caches.match('/index.html');
                        }
                        throw error;
                    });
            })
    );
});

// Log errors
self.addEventListener('error', (event) => {
    console.error('Service Worker error:', event.error);
});
