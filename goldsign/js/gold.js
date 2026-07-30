// js/gold.js

let previousPrices = {
    barBuy: 0, barSell: 0
};

const formatNumber = (num) => {
    return Number(num).toLocaleString('th-TH', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
};

const animatePriceUpdate = (elementId, diffId, newValue, oldValue) => {
    const el = document.getElementById(elementId);
    const diffEl = document.getElementById(diffId);
    
    // Safety Check: ถ้าหา element ไม่เจอ (เช่น ถูกลบจาก HTML ไปแล้ว) ให้หยุดทำงานทันที ป้องกัน Error
    if (!el) return; 

    if (newValue === oldValue || oldValue === 0) {
        el.textContent = formatNumber(newValue);
        if(diffEl) diffEl.textContent = ""; 
        return;
    }

    const diff = newValue - oldValue;
    el.textContent = formatNumber(newValue);

    el.classList.remove('highlight-up', 'highlight-down');
    if(diffEl) {
        diffEl.classList.remove('up', 'down');
        diffEl.textContent = "";
    }

    void el.offsetWidth; 

    if (diff > 0) {
        el.classList.add('highlight-up');
        if(diffEl) {
            diffEl.classList.add('up');
            diffEl.textContent = `▲ +${formatNumber(diff)}`;
        }
    } else if (diff < 0) {
        el.classList.add('highlight-down');
        if(diffEl) {
            diffEl.classList.add('down');
            diffEl.textContent = `▼ ${formatNumber(diff)}`;
        }
    }

    setTimeout(() => {
        el.classList.remove('highlight-up', 'highlight-down');
    }, 3000);
};

export function updateGoldUI(data) {
    const updateText = document.getElementById('last-update');

    // กรณีขาดการเชื่อมต่อ
    if (data.status === 'disconnected') {
        const barBuy = document.getElementById('bar-buy');
        const barSell = document.getElementById('bar-sell');
        
        if (barBuy) barBuy.textContent = "---";
        if (barSell) barSell.textContent = "---";
        
        ['bar-diff'].forEach(id => {
            const el = document.getElementById(id);
            if (el) { el.textContent = ""; el.classList.remove('up', 'down'); }
        });

        updateText.textContent = "⚠️ ขาดการเชื่อมต่อ: ไม่สามารถดึงข้อมูลราคาทองได้";
        updateText.style.color = "var(--down-color)";
        updateText.style.fontWeight = "bold";
        return; 
    }

    // กรณีปกติ
    updateText.style.color = "";
    updateText.style.fontWeight = "normal";
    updateText.textContent = `อัปเดตล่าสุด: ${data.updateTime}`;

    // อัปเดตเฉพาะทองคำแท่ง
    animatePriceUpdate('bar-buy', null, data.bar.buy, previousPrices.barBuy);
    animatePriceUpdate('bar-sell', 'bar-diff', data.bar.sell, previousPrices.barSell);

    previousPrices = {
        barBuy: data.bar.buy,
        barSell: data.bar.sell
    };
}
