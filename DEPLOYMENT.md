# راهنمای کامل Deploy پروژه مدرسه معراج

## پیش‌نیازها

### 1. نصب نرم‌افزارهای مورد نیاز
```powershell
# نصب Node.js (نسخه 18 یا بالاتر)
# دانلود از: https://nodejs.org/

# نصب MongoDB
# دانلود از: https://www.mongodb.com/try/download/community

# نصب PM2
npm install -g pm2

# نصب Git
# دانلود از: https://git-scm.com/
```

### 2. تنظیمات MongoDB
```powershell
# راه‌اندازی MongoDB
mongod --dbpath "C:\data\db"

# یا به عنوان سرویس
mongod --install --dbpath "C:\data\db"
net start MongoDB
```

## مراحل Deploy

### 1. Clone پروژه
```powershell
git clone https://github.com/your-repo/meraj-school.git
cd meraj-school
```

### 2. تنظیم فایل‌های Environment
```powershell
# کپی کردن فایل‌های env.production
Copy-Item "Api.EndPoint/env.production" "Api.EndPoint/env"
Copy-Item "admin-endpoint/env.production" "admin-endpoint/env"
Copy-Item "Site.EndPoint/env.production" "Site.EndPoint/env"

# ویرایش فایل‌های env با اطلاعات واقعی
notepad Api.EndPoint/env
notepad admin-endpoint/env
notepad Site.EndPoint/env
```

### 3. نصب Dependencies
```powershell
npm run install:all
```

### 4. Build پروژه‌ها
```powershell
npm run build:all
```

### 5. راه‌اندازی با PM2
```powershell
# راه‌اندازی در production mode
npm run deploy:prod

# یا به صورت دستی
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup
```

## دستورات مفید

### مدیریت PM2
```powershell
# مشاهده وضعیت سرویس‌ها
pm2 status
pm2 monit

# مشاهده لاگ‌ها
pm2 logs
pm2 logs meraj-api
pm2 logs meraj-admin

# راه‌اندازی مجدد
pm2 restart all
pm2 restart meraj-api
pm2 restart meraj-admin

# توقف سرویس‌ها
pm2 stop all
pm2 delete all
```

### مدیریت پروژه
```powershell
# نصب dependencies
npm run install:all

# build همه پروژه‌ها
npm run build:all

# راه‌اندازی همه سرویس‌ها
npm run start:all

# توقف همه سرویس‌ها
npm run stop:all

# راه‌اندازی مجدد همه سرویس‌ها
npm run restart:all
```

## تنظیمات Nginx (اختیاری)

### 1. نصب Nginx
```powershell
# دانلود Nginx برای Windows
# https://nginx.org/en/download.html
```

### 2. تنظیم فایل nginx.conf
```nginx
# کپی کردن فایل nginx.conf به مسیر نصب Nginx
# معمولاً: C:\nginx\conf\nginx.conf
```

### 3. راه‌اندازی Nginx
```powershell
# راه‌اندازی Nginx
cd C:\nginx
start nginx

# راه‌اندازی مجدد
nginx -s reload

# توقف
nginx -s stop
```

## پورت‌های استفاده شده

- **API**: 5000
- **Admin Panel**: 3004
- **Main Site**: 5173 (development) / 80 (production)
- **MongoDB**: 27017

## آدرس‌های دسترسی

### Development
- API: http://localhost:5000
- Admin Panel: http://localhost:3004
- Main Site: http://localhost:5173

### Production
- API: https://api.merajfutureschool.ir
- Admin Panel: https://admin.merajfutureschool.ir
- Main Site: https://merajfutureschool.ir

## عیب‌یابی

### 1. مشکل CORS
```powershell
# بررسی تنظیمات CORS در Api.EndPoint/src/app.ts
# اطمینان از وجود آدرس‌های مجاز در allowedOrigins
```

### 2. مشکل اتصال به MongoDB
```powershell
# بررسی راه‌اندازی MongoDB
mongod --version
net start MongoDB

# بررسی اتصال
mongo
use meraj-school-prod
show collections
```

### 3. مشکل PM2
```powershell
# پاک کردن cache PM2
pm2 kill
pm2 cleardump

# راه‌اندازی مجدد
pm2 start ecosystem.config.js --env production
```

### 4. مشکل Build
```powershell
# پاک کردن node_modules و نصب مجدد
Remove-Item -Recurse -Force **/node_modules
npm run install:all

# پاک کردن build و build مجدد
npm run clean
npm run build:all
```

## نکات مهم

1. **امنیت**: حتماً فایل‌های env.production را با اطلاعات واقعی و امن تنظیم کنید
2. **Backup**: قبل از هر تغییر، از دیتابیس backup بگیرید
3. **Monitoring**: از PM2 monit برای نظارت بر سرویس‌ها استفاده کنید
4. **Logs**: لاگ‌ها را در پوشه logs بررسی کنید
5. **SSL**: برای production حتماً SSL certificate نصب کنید

## پشتیبانی

در صورت بروز مشکل، لاگ‌های مربوطه را بررسی کنید:
- API logs: `logs/api-error.log`
- Admin logs: `logs/admin-error.log`
- PM2 logs: `pm2 logs` 