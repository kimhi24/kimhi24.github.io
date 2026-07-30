// js/api.js

export const GoldProvider = {
    lastData: null,

    async getLatestPrice(apiUrl) {
        try {
            // ดึงข้อมูลจาก API จริง
            const response = await fetch(apiUrl, { cache: 'no-store' });
            
            if (!response.ok) throw new Error('API Response not ok');
            
            const rawData = await response.json();
            
            const standardData = {
                bar: {
                    buy: parseFloat(rawData[0]?.bid || 0),
                    sell: parseFloat(rawData[0]?.ask || 0)
                },
                ornament: {
                    buy: parseFloat(rawData[1]?.bid || 0),
                    sell: parseFloat(rawData[1]?.ask || 0)
                },
                updateTime: rawData[0]?.time || new Date().toLocaleTimeString('th-TH'),
                status: 'connected' // เพิ่ม Flag สถานะการเชื่อมต่อ
            };

            this.lastData = standardData;
            return standardData;

        } catch (error) {
            console.error("Connection lost or API error:", error);
            // คืนค่าสถานะตัดการเชื่อมต่อ ห้ามส่งข้อมูลปลอมเด็ดขาด
            return { status: 'disconnected' };
        }
    }
};