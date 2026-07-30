// js/api.js

export const GoldProvider = {
    lastData: null,

    // ฟังก์ชันดึงข้อมูล เลียนแบบการทำงานของ file_get_contents ใน PHP
    async getLatestPrice() {
        try {
            // เป้าหมายคือ URL .txt จากโค้ด PHP ที่คุณส่งมา
            const targetUrl = 'http://www.thaigold.info/RealTimeDataV2/gtdata_.txt';
            
            // ใช้ Proxy เพื่อเลี่ยงการโดนบล็อก (ทำหน้าที่แทน Backend PHP)
            const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}`;

            const response = await fetch(proxyUrl, { cache: 'no-store' });
            if (!response.ok) throw new Error('API Response not ok');
            
            const proxyData = await response.json();
            
            // ข้อมูลจาก Proxy จะถูกห่อหุ้มมาใน .contents เราจึงต้องแกะออกและแปลงเป็น Array เหมือน JSON_decode ใน PHP
            const rawData = JSON.parse(proxyData.contents);
            
            // ฟังก์ชันลบลูกน้ำ (,) ออกจากตัวเลข
            const parsePrice = (priceStr) => {
                if (!priceStr) return 0;
                return parseFloat(priceStr.toString().replace(/,/g, ''));
            };

            // Mapping ข้อมูลให้ตรงกับ Array [0] = ทองคำแท่ง, [1] = ทองรูปพรรณ (ตามโครงสร้างใน PHP)
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
            console.error("Connection lost or API error:", error);
            // หากดึงข้อมูลไม่ได้ ให้แสดงหน้าจอเป็น ---
            return { status: 'disconnected' };
        }
    }
};
