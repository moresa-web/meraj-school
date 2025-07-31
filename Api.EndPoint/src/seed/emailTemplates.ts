import { EmailTemplate } from '../models/EmailTemplate';

const defaultTemplates = [
  {
    name: 'قالب پیش‌فرض خبر جدید',
    description: 'قالب پیش‌فرض برای ارسال خبرنامه‌های جدید',
    type: 'new_news',
    subject: 'خبر جدید: {{title}}',
    html: `
      <div dir="rtl" style="font-family: Tahoma, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #2c3e50; margin-bottom: 20px;">{{title}}</h1>
        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
          {{content}}
        </div>
        <p style="color: #666; font-size: 14px;">تاریخ انتشار: {{publishDate}}</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="color: #666; font-size: 12px; text-align: center;">
          این ایمیل به صورت خودکار ارسال شده است. لطفاً به آن پاسخ ندهید.
        </p>
      </div>
    `,
    variables: ['title', 'content', 'publishDate'],
    isActive: true
  },
  {
    name: 'قالب پیش‌فرض کلاس جدید',
    description: 'قالب پیش‌فرض برای اطلاع‌رسانی کلاس‌های جدید',
    type: 'new_class',
    subject: 'کلاس جدید: {{title}}',
    html: `
      <div dir="rtl" style="font-family: Tahoma, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #2c3e50; margin-bottom: 20px;">{{title}}</h1>
        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
          <p><strong>توضیحات:</strong> {{description}}</p>
          <p><strong>مدرس:</strong> {{teacher}}</p>
          <p><strong>زمان برگزاری:</strong> {{schedule}}</p>
          <p><strong>ظرفیت:</strong> {{capacity}} نفر</p>
          <p><strong>تاریخ شروع:</strong> {{startDate}}</p>
          <p><strong>تاریخ پایان:</strong> {{endDate}}</p>
        </div>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="color: #666; font-size: 12px; text-align: center;">
          این ایمیل به صورت خودکار ارسال شده است. لطفاً به آن پاسخ ندهید.
        </p>
      </div>
    `,
    variables: ['title', 'description', 'teacher', 'schedule', 'capacity', 'startDate', 'endDate'],
    isActive: true
  }
];

export const seedEmailTemplates = async () => {
  try {
    // حذف قالب‌های موجود
    await EmailTemplate.deleteMany({});

    // ایجاد قالب‌های پیش‌فرض
    await EmailTemplate.insertMany(defaultTemplates);

    console.log('قالب‌های ایمیل با موفقیت ایجاد شدند');
  } catch (error) {
    console.error('خطا در ایجاد قالب‌های ایمیل:', error);
  }
}; 