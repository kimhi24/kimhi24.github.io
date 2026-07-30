// js/api.js

export const GoldProvider = {
    lastData: null,

    async getLatestPrice() {
        try {
            // 1. ใช้ Timestamp เพื่อป้องกันแคช
            const timeStamp = new Date().getTime();
            const targetUrl = `http://www.thaigold.info/RealTimeDataV2/gtdata_.txt?v=${timeStamp}`;
            
            // 2. เปลี่ยนมาใช้ /raw ของ allorigins เพื่อให้ได้ข้อมูลดิบตรงๆ เหมือน PHP
            const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(targetUrl)}`;

            const response = await fetch(proxyUrl, { cache: 'no-store' });
            
            if (!response.ok) throw new Error('API Response not ok');
            
            // 3. แปลงข้อมูลดิบเป็น JSON Array โดยตรง
            const rawData = await response.json();
            
            // 🚨 Safety Check 1: ตรวจสอบว่าข้อมูลที่ได้มาเป็น Array จริงๆ ไม่ใช่ข้อความ Error
            if (!Array.isArray(rawData) || rawData.length === 0) {
                throw new Error('โครงสร้างข้อมูลที่ได้รับมาไม่ถูกต้อง');
            }

            // 🚨 Safety Check 2: ฟังก์ชันแปลงตัวเลขที่เข้มงวดขึ้น
            const parsePrice = (priceStr) => {
                if (!priceStr) throw new Error('ไม่มีข้อมูลราคาถูกส่งมา');
                
                const parsed = parseFloat(priceStr.toString().replace(/,/g, ''));
                
                // ถ้าแปลงเลขไม่ได้ หรือราคากลายเป็น 0 ให้หยุดการทำงานทันที
                if (isNaN(parsed) || parsed === 0) {
                    throw new Error('ราคาผิดพลาด (ราคาเป็น 0 หรือไม่ใช่ตัวเลข)');
                }
                return parsed;
            };

            const standardData = {
                bar: {
                    buy: parsePrice(rawData[0]?.bid),
                    sell: parsePrice(rawData[0]?.ask)
                },
                ornament: {
                    buy: parsePrice(rawData[1]?.bid),
                    sell: parsePrice(rawData[1]?.ask)
                },
                updateTime: rawData[0]?.time || new Date().toLocaleTimeString('th-TH'),
                status: 'connected'
            };

            this.lastData = standardData;
            return standardData;

        } catch (error) {
            console.error("ระบบทำงานผิดพลาด หรือขาดการเชื่อมต่อ:", error);
            // ตัดเข้าโหมดปลอดภัย (หน้าจอแสดงเป็นขีด ---) เพื่อป้องกันการซื้อขายผิดราคา
            return { status: 'disconnected' };
        }
    }
};
