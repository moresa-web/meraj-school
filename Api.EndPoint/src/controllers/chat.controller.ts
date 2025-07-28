import { Request, Response } from 'express';
import chatService from '../services/chat.service';

export class ChatController {
    // ایجاد چت جدید
    async createChat(req: Request, res: Response) {
        try {
            const { userId, userName } = req.body;
            const chat = await chatService.createChat(userId, userName);
            res.status(201).json(chat);
        } catch (error) {
            res.status(500).json({ error: 'خطا در ایجاد چت' });
        }
    }

    // دریافت لیست چت‌های کاربر
    async getUserChats(req: Request, res: Response) {
        try {
            const { userId } = req.params;
            const chats = await chatService.getUserChats(userId);
            res.json(chats);
        } catch (error) {
            res.status(500).json({ error: 'خطا در دریافت لیست چت‌ها' });
        }
    }

    // دریافت لیست چت‌های باز
    async getOpenChats(req: Request, res: Response) {
        try {
            const chats = await chatService.getOpenChats();
            res.json(chats);
        } catch (error) {
            res.status(500).json({ error: 'خطا در دریافت لیست چت‌های باز' });
        }
    }

    // ارسال پیام
    async sendMessage(req: Request, res: Response) {
        try {
            const { chatId, senderId, senderName, message, fileData } = req.body;
            console.log('SendMessage request body:', req.body);
            
            if (!chatId || !senderId || !senderName || !message) {
                return res.status(400).json({ 
                    error: 'خطا در ارسال پیام: فیلدهای الزامی موجود نیستند',
                    required: { chatId, senderId, senderName, message },
                    received: req.body
                });
            }
            
            const chatMessage = await chatService.sendMessage(chatId, senderId, senderName, message, fileData);
            res.status(201).json(chatMessage);
        } catch (error) {
            console.error('Error in sendMessage controller:', error);
            res.status(500).json({ 
                error: 'خطا در ارسال پیام',
                details: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }

    // دریافت پیام‌های یک چت
    async getChatMessages(req: Request, res: Response) {
        try {
            const { chatId } = req.params;
            const { limit, before } = req.query;
            console.log('GetChatMessages request:', { chatId, limit, before });
            
            if (!chatId) {
                return res.status(400).json({ error: 'شناسه چت الزامی است' });
            }
            
            const messages = await chatService.getChatMessages(
                chatId,
                limit ? parseInt(limit as string) : undefined,
                before ? new Date(before as string) : undefined
            );
            res.json(messages);
        } catch (error) {
            console.error('Error in getChatMessages controller:', error);
            res.status(500).json({ 
                error: 'خطا در دریافت پیام‌ها',
                details: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }

    // به‌روزرسانی وضعیت خوانده شدن پیام‌ها
    async markMessagesAsRead(req: Request, res: Response) {
        try {
            const { chatId } = req.params;
            const { userId } = req.body;
            await chatService.markMessagesAsRead(chatId, userId);
            res.status(200).json({ message: 'پیام‌ها به عنوان خوانده شده علامت‌گذاری شدند' });
        } catch (error) {
            res.status(500).json({ error: 'خطا در به‌روزرسانی وضعیت پیام‌ها' });
        }
    }

    // بستن چت
    async closeChat(req: Request, res: Response) {
        try {
            const { chatId } = req.params;
            const { adminId, adminName } = req.body;
            const chat = await chatService.closeChat(chatId, adminId, adminName);
            res.json(chat);
        } catch (error) {
            res.status(500).json({ error: 'خطا در بستن چت' });
        }
    }

    // باز کردن مجدد چت
    async reopenChat(req: Request, res: Response) {
        try {
            const { chatId } = req.params;
            const chat = await chatService.reopenChat(chatId);
            res.json(chat);
        } catch (error) {
            res.status(500).json({ error: 'خطا در باز کردن مجدد چت' });
        }
    }

    // حذف پیام
    async deleteMessage(req: Request, res: Response) {
        try {
            const { messageId } = req.params;
            const { deletedBy } = req.body;
            const message = await chatService.deleteMessage(messageId, deletedBy);
            res.json(message);
        } catch (error) {
            res.status(500).json({ error: 'خطا در حذف پیام' });
        }
    }
}

export default new ChatController(); 