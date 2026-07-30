// js/api.js

export const GoldProvider = {
    lastData: null,

    async getLatestPrice(apiUrl) {
        try {
            // ดึงข้อมูลจาก API ตัวใหม่ (api.chnwt.dev)
            const response = await fetch(apiUrl, { cache: 'no-store' });
            
            if (!response.ok) throw new Error('API Response not ok');
            
            const result = await response.json();
            
            // ตรวจสอบว่ามีข้อมูลส่งกลับมาถูกต้องหรือไม่
            if (result.status !== "success") throw new Error('Invalid API Status');

            const data = result.response;
            
            // ฟังก์ชันสำหรับลบลูกน้ำ (,) ออกจากตัวเลข และแปลงเป็นทศนิยม
            const parsePrice = (priceStr) => {
                if (!priceStr) return 0;
                return parseFloat(priceStr.toString().replace(/,/g, ''));
            };

            // ดึงข้อมูลมาจับคู่ (Mapping) ให้ตรงกับระบบหน้าจอของเรา
            const standardData = {
                bar: {
                    buy: parsePrice(data.price.gold_bar.buy),
                    sell: parsePrice(data.price.gold_bar.sell)
                },
                ornament: {
                    buy: parsePrice(data.price.gold.buy),     // ทองรูปพรรณ รับซื้อ
                    sell: parsePrice(data.price.gold.sell)    // ทองรูปพรรณ ขายออก
                },
                updateTime: data.update_time, // เวลาที่สมาคมประกาศ
                status: 'connected'
            };

            this.lastData = standardData;
            return standardData;

        } catch (error) {
            console.error("Connection lost or API error:", error);
            // หากดึงไม่ได้ ให้แสดงสถานะขาดการเชื่อมต่อ (หน้าจอจะขึ้น ---)
            return { status: 'disconnected' };
        }
    }
};
