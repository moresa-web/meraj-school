// controllers/contactController.ts
import { Request, Response } from 'express';
import { ContactMessage } from '../models/ContactMessage';

// ذخیره پیام جدید
export const sendMessage = async (req: Request, res: Response) => {
    try {
        const { name, email, subject, message } = req.body;
        const newMessage = new ContactMessage({ name, email, subject, message });
        await newMessage.save();
        res.status(201).json({ message: 'پیام شما با موفقیت ارسال شد' });
    } catch (error) {
        console.error('Error in sendMessage:', error);
        res.status(500).json({ message: 'خطا در ارسال پیام' });
    }
};

// دریافت لیست پیام‌ها برای ادمین
export const getMessages = async (req: Request, res: Response) => {
    try {
        const messages = await ContactMessage.find().sort({ createdAt: -1 });
        res.json(messages);
    } catch (error) {
        console.error('Error in getMessages:', error);
        res.status(500).json({ message: 'خطا در دریافت پیام‌ها' });
    }
};

// علامت زدن پیام به عنوان خوانده شده
export const markAsRead = async (req: Request, res: Response) => {
    try {
        const message = await ContactMessage.findByIdAndUpdate(
            req.params.id,
            { isRead: true },
            { new: true }
        );
        if (!message) {
            return res.status(404).json({ message: 'پیام یافت نشد' });
        }
        res.json(message);
    } catch (error) {
        console.error('Error in markAsRead:', error);
        res.status(500).json({ message: 'خطا در بروزرسانی پیام' });
    }
};
