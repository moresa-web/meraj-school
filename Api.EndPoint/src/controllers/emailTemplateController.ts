import { Request, Response } from 'express';
import { EmailTemplate } from '../models/EmailTemplate';

// دریافت همه قالب‌ها
export const getTemplates = async (req: Request, res: Response) => {
  try {
    const { type } = req.query;
    const filter: any = {};
    
    if (type) {
      filter.type = type;
    }

    const templates = await EmailTemplate.find(filter).sort({ createdAt: -1 });
    res.json({
      success: true,
      data: templates
    });
  } catch (error) {
    console.error('خطا در دریافت قالب‌های ایمیل:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در دریافت قالب‌های ایمیل'
    });
  }
};

// دریافت یک قالب خاص
export const getTemplate = async (req: Request, res: Response) => {
  try {
    const template = await EmailTemplate.findById(req.params.id);
    
    if (!template) {
      return res.status(404).json({
        success: false,
        message: 'قالب مورد نظر یافت نشد'
      });
    }

    res.json({
      success: true,
      data: template
    });
  } catch (error) {
    console.error('خطا در دریافت قالب ایمیل:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در دریافت قالب ایمیل'
    });
  }
};

// ایجاد قالب جدید
export const createTemplate = async (req: Request, res: Response) => {
  try {
    const { name, description, subject, html, variables, type, isActive } = req.body;

    // بررسی وجود قالب با همین نام
    const existingTemplate = await EmailTemplate.findOne({ name });
    if (existingTemplate) {
      return res.status(400).json({
        success: false,
        message: 'قالبی با این نام قبلاً ثبت شده است'
      });
    }

    // اگر قالب جدید فعال است، همه قالب‌های دیگر این نوع را غیرفعال کن
    if (isActive) {
      await EmailTemplate.updateMany({ type, isActive: true }, { isActive: false });
    }

    const template = new EmailTemplate({
      name,
      description,
      subject,
      html,
      variables,
      type,
      isActive: !!isActive
    });

    await template.save();

    res.status(201).json({
      success: true,
      message: 'قالب با موفقیت ایجاد شد',
      data: template
    });
  } catch (error) {
    console.error('خطا در ایجاد قالب ایمیل:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در ایجاد قالب ایمیل'
    });
  }
};

// به‌روزرسانی قالب
export const updateTemplate = async (req: Request, res: Response) => {
  try {
    const { name, description, subject, html, variables, type, isActive } = req.body;

    // بررسی وجود قالب با همین نام (به جز خود قالب فعلی)
    const existingTemplate = await EmailTemplate.findOne({
      name,
      _id: { $ne: req.params.id }
    });

    if (existingTemplate) {
      return res.status(400).json({
        success: false,
        message: 'قالبی با این نام قبلاً ثبت شده است'
      });
    }

    // اگر قالب فعلی فعال می‌شود، همه قالب‌های دیگر این نوع را غیرفعال کن
    if (isActive) {
      await EmailTemplate.updateMany({ type, isActive: true, _id: { $ne: req.params.id } }, { isActive: false });
    }

    const template = await EmailTemplate.findByIdAndUpdate(
      req.params.id,
      {
        name,
        description,
        subject,
        html,
        variables,
        type,
        isActive: !!isActive
      },
      { new: true, runValidators: true }
    );

    if (!template) {
      return res.status(404).json({
        success: false,
        message: 'قالب مورد نظر یافت نشد'
      });
    }

    res.json({
      success: true,
      message: 'قالب با موفقیت به‌روزرسانی شد',
      data: template
    });
  } catch (error) {
    console.error('خطا در به‌روزرسانی قالب ایمیل:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در به‌روزرسانی قالب ایمیل'
    });
  }
};

// حذف قالب
export const deleteTemplate = async (req: Request, res: Response) => {
  try {
    const template = await EmailTemplate.findByIdAndDelete(req.params.id);

    if (!template) {
      return res.status(404).json({
        success: false,
        message: 'قالب مورد نظر یافت نشد'
      });
    }

    res.json({
      success: true,
      message: 'قالب با موفقیت حذف شد'
    });
  } catch (error) {
    console.error('خطا در حذف قالب ایمیل:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در حذف قالب ایمیل'
    });
  }
};

// دریافت قالب فعال برای یک نوع خاص
export const getActiveTemplate = async (req: Request, res: Response) => {
  try {
    const { type } = req.params;
    
    const template = await EmailTemplate.findOne({
      type,
      isActive: true
    });

    if (!template) {
      return res.status(404).json({
        success: false,
        message: 'قالب فعالی برای این نوع یافت نشد'
      });
    }

    res.json({
      success: true,
      data: template
    });
  } catch (error) {
    console.error('خطا در دریافت قالب فعال:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در دریافت قالب فعال'
    });
  }
}; 