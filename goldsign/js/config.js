// js/config.js
export const AppConfig = {
    data: null,

    // ฟังก์ชันโหลดข้อมูลจาก config.json
    async load() {
        try {
            // ใช้ fetch เพื่ออ่านไฟล์ JSON
            const response = await fetch('./config/config.json');
            if (!response.ok) throw new Error('Network response was not ok');
            this.data = await response.json();
            
            this.applyTheme();
            this.applyShopInfo();
            return true;
        } catch (error) {
            console.error('Failed to load config:', error);
            return false;
        }
    },

    // ฟังก์ชันนำสีจาก config มาสร้างเป็น CSS Variables
    applyTheme() {
        const theme = this.data.theme;
        const root = document.documentElement;
        
        if(theme.primaryColor) root.style.setProperty('--primary-color', theme.primaryColor);
        if(theme.secondaryColor) root.style.setProperty('--secondary-color', theme.secondaryColor);
        if(theme.backgroundColor) root.style.setProperty('--bg-color', theme.backgroundColor);
        if(theme.accentColor) root.style.setProperty('--accent-color', theme.accentColor);
        if(theme.upColor) root.style.setProperty('--up-color', theme.upColor);
        if(theme.downColor) root.style.setProperty('--down-color', theme.downColor);
    },

    // ฟังก์ชันเปลี่ยนชื่อร้านและโลโก้
    applyShopInfo() {
        const shop = this.data.shop;
        document.getElementById('shop-name').textContent = shop.name;
        
        const logo = document.getElementById('shop-logo');
        logo.src = shop.logo;
    }
};
