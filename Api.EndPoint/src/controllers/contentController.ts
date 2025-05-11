import { Request, Response } from 'express';
import { Content } from '../models/Content';

// دریافت محتوای صفحه
export const getContent = async (req: Request, res: Response) => {
  try {
    const content = await Content.findOne({ page: req.params.page });
    if (!content) {
      // اگر محتوا وجود نداشت، یک محتوای پیش‌فرض ایجاد می‌کنیم
      const defaultContent = new Content({
        page: req.params.page,
        title: 'عنوان صفحه',
        content: 'محتوای صفحه',
        images: []
      });
      await defaultContent.save();
      return res.json(defaultContent);
    }
    res.json(content);
  } catch (error) {
    console.error('Error in getContent:', error);
    res.status(500).json({ message: 'خطا در دریافت محتوا' });
  }
};

// بروزرسانی محتوا
export const updateContent = async (req: Request, res: Response) => {
  try {
    const content = await Content.findOneAndUpdate(
      { page: req.params.page },
      { $set: req.body },
      { new: true, upsert: true }
    );
    res.json(content);
  } catch (error) {
    console.error('Error in updateContent:', error);
    res.status(500).json({ message: 'خطا در بروزرسانی محتوا' });
  }
}; 