// js/api.js

export const GoldProvider = {
    lastData: null,

    async getLatestPrice() {
        try {
            // 1. ใช้ Timestamp เพื่อป้องกันแคช (ดึงข้อมูลใหม่เสมอ)
            const timeStamp = new Date().getTime();
            const targetUrl = `http://www.thaigold.info/RealTimeDataV2/gtdata_.txt?v=${timeStamp}`;
            
            // 2. เปลี่ยน Proxy ตัวใหม่ที่เร็วกว่า (corsproxy.io)
            const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(targetUrl)}`;

            // 3. สร้างระบบตั้งเวลา (Timeout) 8 วินาที ป้องกันหน้าเว็บค้างถ้าระบบสมาคมฯ ช้า
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 8000); 

            // เริ่มดึงข้อมูล
            const response = await fetch(proxyUrl, { 
                cache: 'no-store',
                signal: controller.signal // ผูกระบบ Timeout
            });
            
            clearTimeout(timeoutId); // ดึงสำเร็จ ให้ยกเลิกการนับเวลา

            if (!response.ok) throw new Error('API Response not ok');
            
            const rawData = await response.json();
            
            if (!Array.isArray(rawData) || rawData.length === 0) {
                throw new Error('โครงสร้างข้อมูลที่ได้รับมาไม่ถูกต้อง');
            }

            const parsePrice = (priceStr) => {
                if (!priceStr) throw new Error('ไม่มีข้อมูลราคา');
                const parsed = parseFloat(priceStr.toString().replace(/,/g, ''));
                if (isNaN(parsed) || parsed === 0) throw new Error('ราคาผิดพลาดเป็น 0');
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
            console.error("ระบบดึงข้อมูลขัดข้อง หรือใช้เวลานานเกินไป:", error);
            // ตัดเข้าโหมดปลอดภัย (หน้าจอแสดงเป็นขีด ---)
            return { status: 'disconnected' };
        }
    }
};
