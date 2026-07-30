// js/tv-mode.js
export function initTVMode() {
    const urlParams = new URLSearchParams(window.location.search);
    
    if (urlParams.get('mode') === 'tv') {
        document.body.classList.add('tv-mode'); // class นี้จะไปซ่อนเคอร์เซอร์เมาส์ใน CSS
        
        // ปิดการใช้งาน Context Menu (คลิกขวา)
        document.addEventListener('contextmenu', event => event.preventDefault());
        
        // ปิดการใช้ Drag (ลากข้อความ/รูปภาพ)
        document.addEventListener('dragstart', event => event.preventDefault());
    }
}
