import nodemailer from 'nodemailer';

// تنظیمات SMTP برای ایمیل سایت
const transporter = nodemailer.createTransport({
  host: 'mail.hasab.ir',
  port: 587, // پورت TLS
  secure: false, // استفاده از TLS
  auth: {
    user: process.env.EMAIL_USER || 'info@moresa-web.ir',
    pass: process.env.EMAIL_PASS || 'M0resaMail',
  },
  tls: {
    rejectUnauthorized: false // برای حل مشکل گواهینامه SSL
  }
});

export const sendEmail = async (to: string, subject: string, html: string) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER || 'info@moresa-web.ir',
      to,
      subject,
      html,
    });
    console.log('Email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}; 