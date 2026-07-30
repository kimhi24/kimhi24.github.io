// js/ticker.js
export function initTicker(messages = []) {
    const tickerEl = document.getElementById('ticker-content');
    
    if (!messages || messages.length === 0) {
        tickerEl.textContent = "ยินดีต้อนรับ";
        return;
    }
    
    // นำข้อความมาเชื่อมต่อกันด้วยจุด
    const tickerText = messages.join(' • ');
    tickerEl.textContent = tickerText;

    // คำนวณระยะเวลาของ Animation ให้สัมพันธ์กับความยาวข้อความ (ป้องกันข้อความวิ่งเร็วเกินไป)
    const duration = Math.max(15, tickerText.length * 0.25); 
    tickerEl.style.animationDuration = `${duration}s`;
}
