import { seedEmailTemplates } from './emailTemplates';

export const seedAll = async () => {
  try {
    await seedEmailTemplates();
    // ... existing code ...
  } catch (error) {
    console.error('خطا در ایجاد داده‌های اولیه:', error);
  }
}; 