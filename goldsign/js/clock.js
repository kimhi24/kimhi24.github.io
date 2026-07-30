// js/clock.js
export function initClock(showDate = true, showClock = true) {
    const dateEl = document.getElementById('date-display');
    const timeEl = document.getElementById('time-display');

    if (!showDate) dateEl.style.display = 'none';
    if (!showClock) timeEl.style.display = 'none';

    function updateTime() {
        const now = new Date();
        
        // แสดงวันที่แบบไทย (เช่น 30 ก.ค. 2569)
        if (showDate) {
            const dateOptions = { year: 'numeric', month: 'short', day: 'numeric' };
            dateEl.textContent = now.toLocaleDateString('th-TH', dateOptions);
        }
        
        // แสดงเวลา (เช่น 11:12:40)
        if (showClock) {
            const timeOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
            timeEl.textContent = now.toLocaleTimeString('th-TH', timeOptions);
        }
    }

    updateTime(); // เรียกใช้ครั้งแรกทันที
    setInterval(updateTime, 1000); // อัปเดตทุกๆ 1 วินาที
}
