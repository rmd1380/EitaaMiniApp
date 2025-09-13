class QuickEitaaApp {
    constructor() {
        this.webApp = null;
        this.init();
    }

    // راه‌اندازی اولیه
    init() {
        console.log('شروع راه‌اندازی مینی‌اپ...');
        
        // بررسی وجود API ایتا
        if (typeof window.Eitaa !== 'undefined' && window.Eitaa.WebApp) {
            this.webApp = window.Eitaa.WebApp;
            console.log('API ایتا یافت شد');
            this.setupMiniApp();
        } else {
            console.log('API ایتا یافت نشد - اجرا در حالت وب');
            this.setupWebMode();
        }
    }

    // راه‌اندازی مینی‌اپ
    setupMiniApp() {
        console.log('راه‌اندازی مینی‌اپ...');
        
        // تنظیمات اولیه
        this.webApp.ready();
        this.webApp.expand();
        this.webApp.enableClosingConfirmation();
        
        // تنظیم تم
        this.setupTheme();
        
        // دریافت اطلاعات کاربر
        this.getUserInfo();
        
        // تنظیم رویدادها
        this.setupEventListeners();
        
        // نمایش محتوا
        this.showMainContent();
    }

    // راه‌اندازی حالت وب
    setupWebMode() {
        console.log('راه‌اندازی حالت وب...');
        this.showMainContent();
        this.setupWebEventListeners();
    }

    // تنظیم تم
    setupTheme() {
        if (this.webApp && this.webApp.themeParams) {
            const theme = this.webApp.themeParams;
            console.log('تنظیم تم:', theme);
            
            // اعمال رنگ‌های تم
            document.documentElement.style.setProperty('--tg-theme-bg-color', theme.bg_color || '#ffffff');
            document.documentElement.style.setProperty('--tg-theme-text-color', theme.text_color || '#000000');
            document.documentElement.style.setProperty('--tg-theme-button-color', theme.button_color || '#2481cc');
            document.documentElement.style.setProperty('--tg-theme-button-text-color', theme.button_text_color || '#ffffff');
        }
    }

    // دریافت اطلاعات کاربر
    getUserInfo() {
        if (this.webApp && this.webApp.initDataUnsafe && this.webApp.initDataUnsafe.user) {
            const userData = this.webApp.initDataUnsafe.user;
            this.displayUserInfo(userData);
            console.log('اطلاعات کاربر:', userData);
        }
    }

    // نمایش اطلاعات کاربر
    displayUserInfo(userData) {
        const userInfoElement = document.getElementById('user-info');
        if (userInfoElement && userData) {
            const fullName = `${userData.first_name} ${userData.last_name || ''}`.trim();
            userInfoElement.textContent = `کاربر: ${fullName} (ID: ${userData.id})`;
        }
    }

    // تنظیم رویدادها
    setupEventListeners() {
        // رویدادهای مینی‌اپ
        if (this.webApp) {
            this.webApp.onEvent('themeChanged', () => {
                console.log('تم تغییر کرد');
                this.setupTheme();
            });

            this.webApp.onEvent('mainButtonClicked', () => {
                console.log('دکمه اصلی کلیک شد');
                this.showAlert('دکمه اصلی کلیک شد!');
            });

            this.webApp.onEvent('backButtonClicked', () => {
                console.log('دکمه برگشت کلیک شد');
                this.webApp.close();
            });
        }

        // رویدادهای دکمه‌ها
        this.setupButtonEventListeners();
    }

    // تنظیم رویدادهای دکمه‌ها
    setupButtonEventListeners() {
        // دکمه‌های اصلی
        document.getElementById('main-button-toggle')?.addEventListener('click', () => {
            this.toggleMainButton();
        });

        document.getElementById('back-button-toggle')?.addEventListener('click', () => {
            this.toggleBackButton();
        });

        // دکمه‌های تعامل
        document.getElementById('alert-button')?.addEventListener('click', () => {
            this.showAlert('این یک پیام هشدار است!');
        });

        document.getElementById('confirm-button')?.addEventListener('click', () => {
            this.showConfirm();
        });

        document.getElementById('popup-button')?.addEventListener('click', () => {
            this.showPopup();
        });

        // دکمه‌های تنظیمات
        document.getElementById('expand-button')?.addEventListener('click', () => {
            this.expandMiniApp();
        });

        document.getElementById('theme-button')?.addEventListener('click', () => {
            this.changeHeaderColor();
        });

        // دکمه‌های درخواست اطلاعات
        document.getElementById('contact-button')?.addEventListener('click', () => {
            this.requestContact();
        });

        document.getElementById('write-access-button')?.addEventListener('click', () => {
            this.requestWriteAccess();
        });
    }

    // تنظیم رویدادهای حالت وب
    setupWebEventListeners() {
        // در حالت وب، برخی قابلیت‌ها غیرفعال هستند
        const webOnlyButtons = ['contact-button', 'write-access-button'];
        webOnlyButtons.forEach(buttonId => {
            const button = document.getElementById(buttonId);
            if (button) {
                button.disabled = true;
                button.title = 'این قابلیت فقط در مینی‌اپ ایتا در دسترس است';
            }
        });
    }

    // نمایش محتوای اصلی
    showMainContent() {
        document.getElementById('loading').style.display = 'none';
        document.getElementById('main-content').style.display = 'block';
    }

    // کنترل دکمه اصلی
    toggleMainButton() {
        if (!this.webApp) return;

        if (this.webApp.MainButton.isVisible) {
            this.webApp.MainButton.hide();
            this.showAlert('دکمه اصلی مخفی شد');
        } else {
            this.webApp.MainButton.setText('دکمه اصلی');
            this.webApp.MainButton.show();
            this.showAlert('دکمه اصلی نمایش داده شد');
        }
    }

    // کنترل دکمه برگشت
    toggleBackButton() {
        if (!this.webApp) return;

        if (this.webApp.BackButton.isVisible) {
            this.webApp.BackButton.hide();
            this.showAlert('دکمه برگشت مخفی شد');
        } else {
            this.webApp.BackButton.show();
            this.showAlert('دکمه برگشت نمایش داده شد');
        }
    }

    // گسترش مینی‌اپ
    expandMiniApp() {
        if (this.webApp) {
            this.webApp.expand();
            this.showAlert('مینی‌اپ گسترش یافت');
        }
    }

    // تغییر رنگ هدر
    changeHeaderColor() {
        if (this.webApp) {
            const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'];
            const randomColor = colors[Math.floor(Math.random() * colors.length)];
            this.webApp.setHeaderColor(randomColor);
            this.showAlert(`رنگ هدر به ${randomColor} تغییر کرد`);
        }
    }

    // نمایش پاپ‌آپ
    showPopup() {
        if (this.webApp) {
            this.webApp.showPopup({
                title: 'پاپ‌آپ نمونه',
                message: 'این یک پاپ‌آپ نمونه است.',
                buttons: [
                    { id: 'ok', type: 'ok', text: 'تأیید' },
                    { id: 'cancel', type: 'cancel', text: 'لغو' }
                ]
            }, (buttonId) => {
                this.showAlert(`دکمه ${buttonId} کلیک شد`);
            });
        }
    }

    // نمایش هشدار
    showAlert(message) {
        if (this.webApp) {
            this.webApp.showAlert(message);
        } else {
            alert(message);
        }
    }

    // نمایش تأیید
    showConfirm() {
        if (this.webApp) {
            this.webApp.showConfirm('آیا مطمئن هستید؟', (confirmed) => {
                if (confirmed) {
                    this.showAlert('کاربر تأیید کرد');
                } else {
                    this.showAlert('کاربر لغو کرد');
                }
            });
        } else {
            const confirmed = confirm('آیا مطمئن هستید؟');
            this.showAlert(confirmed ? 'کاربر تأیید کرد' : 'کاربر لغو کرد');
        }
    }

    // درخواست شماره تماس
    requestContact() {
        if (this.webApp) {
            this.webApp.requestContact((success, contactData) => {
                if (success) {
                    this.showAlert('شماره تماس دریافت شد');
                    console.log('داده‌های تماس:', contactData);
                } else {
                    this.showAlert('درخواست شماره تماس لغو شد');
                }
            });
        }
    }

    // درخواست مجوز نوشتن
    requestWriteAccess() {
        if (this.webApp) {
            this.webApp.requestWriteAccess((granted) => {
                if (granted) {
                    this.showAlert('مجوز نوشتن اعطا شد');
                } else {
                    this.showAlert('مجوز نوشتن رد شد');
                }
            });
        }
    }
}

// راه‌اندازی مینی‌اپ پس از بارگذاری صفحه
document.addEventListener('DOMContentLoaded', () => {
    new QuickEitaaApp();
});