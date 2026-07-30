// js/app.js
import { AppConfig } from './config.js';
import { initClock } from './clock.js';
import { initTicker } from './ticker.js';
import { initTVMode } from './tv-mode.js';
import { GoldProvider } from './api.js';
import { updateGoldUI } from './gold.js';

async function bootstrap() {
    // 1. ลงทะเบียน Service Worker สำหรับ PWA และ Offline Mode เพื่อแคชไฟล์ระบบ
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./service-worker.js').catch(err => console.error("Service Worker registration failed:", err));
    }

    // 2. ตรวจสอบและเปิดใช้งานโหมด TV (?mode=tv)
    initTVMode();
    
    // 3. โหลดไฟล์ตั้งค่าจาก config.json
    const configLoaded = await AppConfig.load();
    
    if (!configLoaded) {
        document.getElementById('loading-text').textContent = "ระบบขัดข้อง: ไม่สามารถโหลดข้อมูลตั้งค่าร้านได้";
        return;
    }

    // 4. เริ่มต้นระบบ UI ต่างๆ โดยอิงจากข้อมูลที่โหลดมา
    initClock(AppConfig.data.features.showDate, AppConfig.data.features.showClock);
    initTicker(AppConfig.data.ticker);

    const apiUrl = AppConfig.data.api.providerUrl;
    const refreshInterval = AppConfig.data.api.refreshIntervalMs;

    // ฟังก์ชันย่อยสำหรับดึงข้อมูลราคาทองและอัปเดตหน้าจอ
    async function fetchAndUpdatePrice() {
        try {
            const priceData = await GoldProvider.getLatestPrice(apiUrl);
            updateGoldUI(priceData);
        } catch (error) {
            console.error("Error updating price UI:", error);
        }
    }

    // 5. ดึงข้อมูลครั้งแรกทันทีเมื่อเปิดเว็บ
    await fetchAndUpdatePrice();

    // 6. ปิดหน้าจอ Loading Overlay แบบ Smooth เมื่อโหลดข้อมูลชุดแรกเสร็จ
    const overlay = document.getElementById('loading-overlay');
    if (overlay) {
        overlay.style.opacity = '0';
        setTimeout(() => overlay.style.display = 'none', 500);
    }

    // 7. ตั้งเวลา (Interval) เพื่อดึงข้อมูลใหม่ทุกๆ รอบเวลาที่กำหนดใน config (เช่น 30 วิ)
    setInterval(fetchAndUpdatePrice, refreshInterval);
}

// เริ่มการทำงานของระบบ
bootstrap();