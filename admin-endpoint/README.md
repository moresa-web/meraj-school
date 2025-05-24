# پنل مدیریت مرجع

این پروژه یک پنل مدیریت برای سیستم مرجع است که با استفاده از Next.js و MongoDB ساخته شده است.

## ویژگی‌ها

- مدیریت کلاس‌ها
- مدیریت دانش‌آموزان
- احراز هویت کاربران
- رابط کاربری زیبا و کاربرپسند
- پشتیبانی از زبان فارسی
- طراحی واکنش‌گرا

## پیش‌نیازها

- Node.js 18 یا بالاتر
- MongoDB 6 یا بالاتر
- npm یا yarn

## نصب

1. کلون کردن مخزن:
```bash
git clone https://github.com/your-username/meraj.git
cd meraj/admin-endpoint
```

2. نصب وابستگی‌ها:
```bash
npm install
# یا
yarn install
```

3. ایجاد فایل .env.local:
```bash
cp .env.example .env.local
```

4. ویرایش فایل .env.local و تنظیم متغیرهای محیطی:
```env
MONGODB_URI=mongodb://localhost:27017/meraj
MONGODB_DB=meraj
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key
```

5. اجرای پروژه در محیط توسعه:
```bash
npm run dev
# یا
yarn dev
```

## ساخت

برای ساخت پروژه برای محیط تولید:

```bash
npm run build
# یا
yarn build
```

## اجرا در محیط تولید

```bash
npm run start
# یا
yarn start
```

## تست

```bash
npm run test
# یا
yarn test
```

## لینت

```bash
npm run lint
# یا
yarn lint
```

## ساختار پروژه

```
admin-endpoint/
├── src/
│   ├── app/
│   │   ├── api/
│   │   ├── auth/
│   │   ├── classes/
│   │   └── layout.tsx
│   ├── components/
│   │   ├── classes/
│   │   └── ui/
│   ├── hooks/
│   ├── lib/
│   └── types/
├── public/
├── .env.local
├── .gitignore
├── package.json
├── README.md
└── tsconfig.json
```

## تکنولوژی‌ها

- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [MongoDB](https://www.mongodb.com/)
- [NextAuth.js](https://next-auth.js.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [Zod](https://github.com/colinhacks/zod)
- [React Hook Form](https://react-hook-form.com/)

## مشارکت

1. Fork کردن پروژه
2. ایجاد branch جدید (`git checkout -b feature/amazing-feature`)
3. Commit کردن تغییرات (`git commit -m 'Add some amazing feature'`)
4. Push کردن به branch (`git push origin feature/amazing-feature`)
5. ایجاد Pull Request

## مجوز

این پروژه تحت مجوز MIT منتشر شده است. برای اطلاعات بیشتر به فایل [LICENSE](LICENSE) مراجعه کنید.

## تماس

- ایمیل: your-email@example.com
- وب‌سایت: https://your-website.com
- توییتر: [@your-twitter](https://twitter.com/your-twitter)
