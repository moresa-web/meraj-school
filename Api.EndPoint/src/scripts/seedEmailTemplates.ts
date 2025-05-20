import mongoose from 'mongoose';
import { EmailTemplate } from '../models/EmailTemplate';
import dotenv from 'dotenv';

// لود کردن متغیرهای محیطی
dotenv.config();

const templates = [
  {
    name: 'قالب خبر جدید',
    description: 'قالب پیش‌فرض برای ارسال خبرهای جدید',
    type: 'new_news',
    subject: 'خبر جدید: {{title}}',
    html: `
      <!DOCTYPE html>
      <html dir="rtl" lang="fa">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>خبر جدید</title>
        <style>
          body {
            font-family: 'Vazirmatn', Tahoma, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
            background-color: #f9fafb;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }
          .header {
            text-align: center;
            padding: 20px 0;
            background-color: #10b981;
            color: white;
            border-radius: 8px 8px 0 0;
          }
          .content {
            padding: 20px;
          }
          .news-image {
            width: 100%;
            max-height: 300px;
            object-fit: cover;
            border-radius: 4px;
            margin: 20px 0;
          }
          .news-title {
            font-size: 24px;
            color: #1f2937;
            margin-bottom: 15px;
          }
          .news-date {
            color: #6b7280;
            font-size: 14px;
            margin-bottom: 20px;
          }
          .news-content {
            color: #4b5563;
            line-height: 1.8;
          }
          .footer {
            text-align: center;
            padding: 20px;
            background-color: #f3f4f6;
            border-radius: 0 0 8px 8px;
            color: #6b7280;
            font-size: 14px;
          }
          .button {
            display: inline-block;
            padding: 12px 24px;
            background-color: #10b981;
            color: white;
            text-decoration: none;
            border-radius: 4px;
            margin-top: 20px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>خبر جدید</h1>
          </div>
          <div class="content">
            <img src="{{image}}" alt="{{title}}" class="news-image">
            <h2 class="news-title">{{title}}</h2>
            <div class="news-date">{{date}}</div>
            <div class="news-content">{{content}}</div>
            <a href="#" class="button">مشاهده خبر</a>
          </div>
          <div class="footer">
            <p>این ایمیل به صورت خودکار ارسال شده است. لطفاً به آن پاسخ ندهید.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    variables: ['title', 'content', 'image', 'date'],
    isActive: true,
  },
  {
    name: 'قالب کلاس جدید',
    description: 'قالب پیش‌فرض برای ارسال اطلاعیه کلاس‌های جدید',
    type: 'new_class',
    subject: 'کلاس جدید: {{title}}',
    html: `
      <!DOCTYPE html>
      <html dir="rtl" lang="fa">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>کلاس جدید</title>
        <style>
          body {
            font-family: 'Vazirmatn', Tahoma, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
            background-color: #f9fafb;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }
          .header {
            text-align: center;
            padding: 20px 0;
            background-color: #10b981;
            color: white;
            border-radius: 8px 8px 0 0;
          }
          .content {
            padding: 20px;
          }
          .class-title {
            font-size: 24px;
            color: #1f2937;
            margin-bottom: 15px;
          }
          .class-info {
            background-color: #f3f4f6;
            padding: 15px;
            border-radius: 4px;
            margin: 15px 0;
          }
          .info-item {
            margin: 10px 0;
            display: flex;
            align-items: center;
          }
          .info-label {
            font-weight: bold;
            color: #4b5563;
            width: 120px;
          }
          .info-value {
            color: #1f2937;
          }
          .class-description {
            color: #4b5563;
            line-height: 1.8;
            margin: 20px 0;
          }
          .footer {
            text-align: center;
            padding: 20px;
            background-color: #f3f4f6;
            border-radius: 0 0 8px 8px;
            color: #6b7280;
            font-size: 14px;
          }
          .button {
            display: inline-block;
            padding: 12px 24px;
            background-color: #10b981;
            color: white;
            text-decoration: none;
            border-radius: 4px;
            margin-top: 20px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>کلاس جدید</h1>
          </div>
          <div class="content">
            <h2 class="class-title">{{title}}</h2>
            <div class="class-info">
              <div class="info-item">
                <span class="info-label">استاد:</span>
                <span class="info-value">{{teacher}}</span>
              </div>
              <div class="info-item">
                <span class="info-label">زمان برگزاری:</span>
                <span class="info-value">{{schedule}}</span>
              </div>
              <div class="info-item">
                <span class="info-label">ظرفیت:</span>
                <span class="info-value">{{capacity}}</span>
              </div>
              <div class="info-item">
                <span class="info-label">تاریخ شروع:</span>
                <span class="info-value">{{startDate}}</span>
              </div>
              <div class="info-item">
                <span class="info-label">تاریخ پایان:</span>
                <span class="info-value">{{endDate}}</span>
              </div>
            </div>
            <div class="class-description">{{description}}</div>
            <a href="#" class="button">ثبت‌نام در کلاس</a>
          </div>
          <div class="footer">
            <p>این ایمیل به صورت خودکار ارسال شده است. لطفاً به آن پاسخ ندهید.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    variables: ['title', 'description', 'teacher', 'schedule', 'capacity', 'startDate', 'endDate'],
    isActive: true,
  },
];

async function seedEmailTemplates() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || '');
    console.log('اتصال به دیتابیس برقرار شد');

    // حذف قالب‌های قبلی
    await EmailTemplate.deleteMany({});
    console.log('قالب‌های قبلی حذف شدند');

    // ایجاد قالب‌های جدید
    await EmailTemplate.insertMany(templates);
    console.log('قالب‌های جدید با موفقیت ایجاد شدند');

    await mongoose.disconnect();
    console.log('اتصال به دیتابیس بسته شد');
  } catch (error) {
    console.error('خطا در ایجاد قالب‌ها:', error);
    process.exit(1);
  }
}

seedEmailTemplates(); 