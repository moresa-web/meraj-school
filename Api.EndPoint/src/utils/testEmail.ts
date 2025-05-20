import { sendEmail } from './mailer';

const testEmail = async () => {
  try {
    await sendEmail(
      'info@moresa-web.ir', // ایمیل گیرنده
      'تست ارسال ایمیل', // موضوع
      `
        <h1>تست ارسال ایمیل</h1>
        <p>این یک ایمیل تست است.</p>
        <p>اگر این ایمیل را دریافت کردید، تنظیمات ارسال ایمیل به درستی انجام شده است.</p>
      `
    );
    console.log('ایمیل تست با موفقیت ارسال شد');
  } catch (error) {
    console.error('خطا در ارسال ایمیل تست:', error);
  }
};

// اجرای تست
testEmail(); 