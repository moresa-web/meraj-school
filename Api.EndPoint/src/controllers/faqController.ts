import { Request, Response } from 'express';
import { FAQ } from '../models/FAQ';

export const faqController = {
    // دریافت همه سوالات متداول فعال
    async getAllActive(req: Request, res: Response) {
        try {
            const faqs = await FAQ.find({ isActive: true })
                .sort({ order: 1, createdAt: -1 });
            res.json({ status: 'success', data: faqs });
        } catch (error) {
            res.status(500).json({ 
                status: 'error', 
                message: 'خطا در دریافت سوالات متداول' 
            });
        }
    },

    // دریافت سوالات متداول بر اساس دسته‌بندی
    async getByCategory(req: Request, res: Response) {
        try {
            const { category } = req.params;
            const faqs = await FAQ.find({ 
                category, 
                isActive: true 
            }).sort({ order: 1, createdAt: -1 });
            res.json({ status: 'success', data: faqs });
        } catch (error) {
            res.status(500).json({ 
                status: 'error', 
                message: 'خطا در دریافت سوالات متداول' 
            });
        }
    },

    // ایجاد سوال متداول جدید
    async create(req: Request, res: Response) {
        try {
            const faq = new FAQ(req.body);
            await faq.save();
            res.status(201).json({ 
                status: 'success', 
                data: faq 
            });
        } catch (error) {
            res.status(400).json({ 
                status: 'error', 
                message: 'خطا در ایجاد سوال متداول' 
            });
        }
    },

    // به‌روزرسانی سوال متداول
    async update(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const faq = await FAQ.findByIdAndUpdate(
                id,
                req.body,
                { new: true, runValidators: true }
            );
            if (!faq) {
                return res.status(404).json({ 
                    status: 'error', 
                    message: 'سوال متداول یافت نشد' 
                });
            }
            res.json({ status: 'success', data: faq });
        } catch (error) {
            res.status(400).json({ 
                status: 'error', 
                message: 'خطا در به‌روزرسانی سوال متداول' 
            });
        }
    },

    // حذف سوال متداول
    async delete(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const faq = await FAQ.findByIdAndDelete(id);
            if (!faq) {
                return res.status(404).json({ 
                    status: 'error', 
                    message: 'سوال متداول یافت نشد' 
                });
            }
            res.json({ 
                status: 'success', 
                message: 'سوال متداول با موفقیت حذف شد' 
            });
        } catch (error) {
            res.status(400).json({ 
                status: 'error', 
                message: 'خطا در حذف سوال متداول' 
            });
        }
    }
}; 