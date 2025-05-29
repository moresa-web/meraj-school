import Chat, { IChat } from '../models/Chat';
import ChatMessage, { IChatMessage } from '../models/ChatMessage';
import { Types } from 'mongoose';

export class ChatService {
    // ایجاد یک چت جدید
    async createChat(userId: string, userName: string): Promise<IChat> {
        const chat = new Chat({
            userId,
            userName,
            status: 'open',
            unreadCount: 0
        });
        return await chat.save();
    }

    // دریافت لیست چت‌های یک کاربر
    async getUserChats(userId: string): Promise<IChat[]> {
        return await Chat.find({ userId }).sort({ updatedAt: -1 });
    }

    // دریافت لیست چت‌های باز
    async getOpenChats(): Promise<IChat[]> {
        return await Chat.find({ status: 'open' }).sort({ updatedAt: -1 });
    }

    // ارسال پیام
    async sendMessage(chatId: string, senderId: string, senderName: string, message: string, fileData?: { url: string, name: string, type: string }): Promise<IChatMessage> {
        const chatMessage = new ChatMessage({
            chatId,
            senderId,
            senderName,
            message,
            ...(fileData && {
                fileUrl: fileData.url,
                fileName: fileData.name,
                fileType: fileData.type
            })
        });

        // به‌روزرسانی آخرین پیام در چت
        await Chat.findByIdAndUpdate(chatId, {
            lastMessage: message,
            lastMessageTime: new Date(),
            $inc: { unreadCount: 1 }
        });

        return await chatMessage.save();
    }

    // دریافت پیام‌های یک چت
    async getChatMessages(chatId: string, limit: number = 50, before?: Date): Promise<IChatMessage[]> {
        const query: any = { chatId };
        if (before) {
            query.timestamp = { $lt: before };
        }
        return await ChatMessage.find(query)
            .sort({ timestamp: -1 })
            .limit(limit);
    }

    // به‌روزرسانی وضعیت خوانده شدن پیام‌ها
    async markMessagesAsRead(chatId: string, userId: string): Promise<void> {
        await ChatMessage.updateMany(
            { chatId, senderId: { $ne: userId }, isRead: false },
            { isRead: true }
        );
        await Chat.findByIdAndUpdate(chatId, { unreadCount: 0 });
    }

    // بستن چت
    async closeChat(chatId: string, adminId: string, adminName: string): Promise<IChat> {
        return await Chat.findByIdAndUpdate(
            chatId,
            {
                status: 'closed',
                adminId,
                adminName,
                closedAt: new Date()
            },
            { new: true }
        );
    }

    // باز کردن مجدد چت
    async reopenChat(chatId: string): Promise<IChat> {
        return await Chat.findByIdAndUpdate(
            chatId,
            {
                status: 'open',
                adminId: null,
                adminName: null,
                closedAt: null
            },
            { new: true }
        );
    }

    // حذف پیام
    async deleteMessage(messageId: string, deletedBy: string): Promise<IChatMessage> {
        return await ChatMessage.findByIdAndUpdate(
            messageId,
            {
                isDeleted: true,
                deletedAt: new Date(),
                deletedBy
            },
            { new: true }
        );
    }
}

export default new ChatService(); 