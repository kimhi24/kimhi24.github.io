const CACHE_NAME = 'gold-price-tv-v1';
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './css/style.css',
    './js/app.js',
    './js/config.js',
    './js/clock.js',
    './js/ticker.js',
    './js/tv-mode.js',
    './js/api.js',
    './js/gold.js',
    './config/config.json',
    './images/logo.png'
];

// ติดตั้ง Service Worker และ Cache ไฟล์พื้นฐาน
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
});

// ดักจับการ Request
self.addEventListener('fetch', (event) => {
    // 🚨 ยกเว้นการดึงข้อมูล API ราคาทอง (ไม่ให้ Cache เด็ดขาด)
    if (event.request.url.includes('gtdata_.json')) {
        return; // ปล่อยให้ fetch ผ่านเน็ตไปเลย
    }

    // สำหรับไฟล์เว็บอื่นๆ ให้ดึงจาก Cache ก่อน ถ้าไม่มีค่อยโหลดผ่านเน็ต
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            return cachedResponse || fetch(event.request);
        })
    );
});