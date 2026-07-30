// เปลี่ยนชื่อเวอร์ชันเป็น v2 เพื่อบังคับให้ทีวีรู้ว่ามีอัปเดตใหม่
const CACHE_NAME = 'gold-price-tv-v2'; 
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
    './config/config.json'
];

// ติดตั้ง Service Worker ตัวใหม่และโหลดไฟล์ใหม่
self.addEventListener('install', (event) => {
    self.skipWaiting(); // บังคับให้ติดตั้งทันที ไม่ต้องรอ
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
});

// เมื่อเวอร์ชันใหม่ทำงาน ให้ลบความจำ (Cache) ของเวอร์ชันเก่าทิ้งทั้งหมด
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('ล้างแคชเวอร์ชันเก่า: ', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// ดักจับการดึงข้อมูล
self.addEventListener('fetch', (event) => {
    // 🚨 ยกเว้นลิงก์ที่เกี่ยวกับสมาคมทองและ Proxy ห้ามแคชเด็ดขาด!
    if (event.request.url.includes('thaigold') || event.request.url.includes('allorigins')) {
        return; // ปล่อยให้วิ่งผ่านอินเทอร์เน็ตไปเลย
    }

    // ไฟล์อื่นๆ (หน้าเว็บ, CSS) ให้ใช้ Cache ได้ตามปกติ
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            return cachedResponse || fetch(event.request);
        })
    );
});
