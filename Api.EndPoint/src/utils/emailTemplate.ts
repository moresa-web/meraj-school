import { IEmailTemplate } from '../models/EmailTemplate';
import { sendEmail } from './mailer';
import { EmailTemplate } from '../models/EmailTemplate';

/**
 * جایگزینی متغیرها در قالب HTML
 */
const replaceVariables = (template: string, variables: Record<string, any>): string => {
  let result = template;
  for (const [key, value] of Object.entries(variables)) {
    const regex = new RegExp(`{{${key}}}`, 'g');
    result = result.replace(regex, value);
  }
  return result;
};

/**
 * ارسال ایمیل با استفاده از قالب
 */
export const sendTemplatedEmail = async (
  template: IEmailTemplate,
  to: string,
  variables: Record<string, any>
): Promise<boolean> => {
  try {
    // جایگزینی متغیرها در موضوع و محتوای ایمیل
    const subject = replaceVariables(template.subject, variables);
    const html = replaceVariables(template.html, variables);

    // ارسال ایمیل
    await sendEmail(to, subject, html);
    return true;
  } catch (error) {
    console.error('خطا در ارسال ایمیل با قالب:', error);
    return false;
  }
};

/**
 * دریافت قالب فعال برای یک نوع خاص
 */
export const getActiveTemplateByType = async (type: string): Promise<IEmailTemplate | null> => {
  try {
    const template = await EmailTemplate.findOne({
      type,
      isActive: true
    });

    return template;
  } catch (error) {
    console.error('خطا در دریافت قالب فعال:', error);
    return null;
  }
}; 