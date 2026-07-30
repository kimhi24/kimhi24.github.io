// js/api.js

export const GoldProvider = {
    lastData: null,

    async getLatestPrice() {
        try {
            const timeStamp = new Date().getTime();
            const targetUrl = `http://www.thaigold.info/RealTimeDataV2/gtdata_.txt?v=${timeStamp}`;
            const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(targetUrl)}`;

            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 8000); 

            const response = await fetch(proxyUrl, { 
                cache: 'no-store',
                signal: controller.signal 
            });
            
            clearTimeout(timeoutId); 

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

            const updateItem = rawData.find(item => item.name === "Update");
            const timeString = updateItem ? updateItem.ask : new Date().toLocaleTimeString('th-TH');

            const associationItem = rawData.find(item => item.name === "สมาคมฯ");
            if (!associationItem) {
                throw new Error('ไม่พบข้อมูลราคาสมาคมใน API');
            }

            const barBuy = parsePrice(associationItem.bid);
            const barSell = parsePrice(associationItem.ask);

            // 3. คำนวณราคาทองรูปพรรณ (อัปเดตสูตรใหม่ตามที่ระบุ)
            // - รับซื้อรูปพรรณ = แท่งรับซื้อ - 2.03%
            // - ขายออกรูปพรรณ = แท่งขายออก + 800 (ค่ากำเหน็จ)
            const ornamentBuy = barBuy - (barBuy * 0.0203); 
            const ornamentSell = barSell + 800;

            const standardData = {
                bar: {
                    buy: barBuy,
                    sell: barSell
                },
                ornament: {
                    buy: ornamentBuy,
                    sell: ornamentSell
                },
                updateTime: timeString,
                status: 'connected'
            };

            this.lastData = standardData;
            return standardData;

        } catch (error) {
            console.error("ระบบดึงข้อมูลขัดข้อง:", error);
            return { status: 'disconnected' };
        }
    }
};
