import { Request, Response } from 'express';
import PageContent, { IPageContent } from '../models/PageContent';
import { isAdmin } from '../middleware/auth';

export const getPageContent = async (req: Request, res: Response) => {
  try {
    const { pageId } = req.params;
    const content = await PageContent.findOne({ pageId });
    
    if (!content) {
      return res.status(404).json({ message: 'محتوای صفحه یافت نشد' });
    }

    res.json(content);
  } catch (error) {
    res.status(500).json({ message: 'خطا در دریافت محتوای صفحه' });
  }
};

export const updatePageContent = async (req: Request, res: Response) => {
  try {
    const { pageId } = req.params;
    const { content, type } = req.body;

    if (!req.user) {
      return res.status(401).json({ message: 'دسترسی غیرمجاز' });
    }

    const updatedContent = await PageContent.findOneAndUpdate(
      { pageId },
      {
        content,
        type,
        lastModifiedBy: req.user._id,
        lastModifiedAt: new Date()
      },
      { new: true }
    );

    if (!updatedContent) {
      return res.status(404).json({ message: 'محتوای صفحه یافت نشد' });
    }

    res.json(updatedContent);
  } catch (error) {
    res.status(500).json({ message: 'خطا در به‌روزرسانی محتوای صفحه' });
  }
};

export const createPageContent = async (req: Request, res: Response) => {
  try {
    const { pageId, content, type } = req.body;

    if (!req.user) {
      return res.status(401).json({ message: 'دسترسی غیرمجاز' });
    }

    const newContent = new PageContent({
      pageId,
      content,
      type,
      lastModifiedBy: req.user._id
    });

    await newContent.save();
    res.status(201).json(newContent);
  } catch (error) {
    res.status(500).json({ message: 'خطا در ایجاد محتوای صفحه' });
  }
}; 