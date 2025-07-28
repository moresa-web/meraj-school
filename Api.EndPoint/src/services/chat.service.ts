import Chat, { IChat } from '../models/Chat';
import { ChatMessageModel as ChatMessage, IChatMessage } from '../models/ChatMessage';
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
        try {
            console.log('Creating chat message with data:', {
                chatId,
                senderId,
                senderName,
                message,
                fileData
            });

            const messageData: any = {
                chatId,
                senderId,
                senderName,
                message,
                text: message, // اضافه کردن فیلد text که required است
            };

            // اضافه کردن اطلاعات فایل فقط اگر fileData موجود باشد و url معتبر باشد
            if (fileData && fileData.url) {
                // اگر url با http شروع نشود، آن را به عنوان relative path در نظر بگیر
                const fileUrl = fileData.url.startsWith('http') ? fileData.url : `${process.env.API_URL || 'http://localhost:5000'}${fileData.url}`;
                messageData.fileUrl = fileUrl;
                messageData.fileName = fileData.name;
                messageData.fileType = fileData.type;
            }

            const chatMessage = new ChatMessage(messageData);

            console.log('ChatMessage object created:', chatMessage);

            // به‌روزرسانی آخرین پیام در چت
            await Chat.findByIdAndUpdate(chatId, {
                lastMessage: message,
                lastMessageTime: new Date(),
                $inc: { unreadCount: 1 }
            });

            const savedMessage = await chatMessage.save();
            console.log('Message saved successfully:', savedMessage);
            return savedMessage;
        } catch (error) {
            console.error('Error in sendMessage service:', error);
            if (error instanceof Error) {
                console.error('Error name:', error.name);
                console.error('Error message:', error.message);
                if ('errors' in error) {
                    console.error('Validation errors:', (error as any).errors);
                }
            }
            throw error;
        }
    }

    // دریافت پیام‌های یک چت
    async getChatMessages(chatId: string, limit: number = 50, before?: Date): Promise<IChatMessage[]> {
        try {
            console.log('Getting chat messages for chatId:', chatId);
            
            if (!chatId) {
                throw new Error('شناسه چت الزامی است');
            }

            const query: any = { chatId };
            if (before) {
                query.timestamp = { $lt: before };
            }
            
            console.log('Query:', query);
            
            const messages = await ChatMessage.find(query)
                .sort({ timestamp: -1 })
                .limit(limit);
                
            console.log('Found messages:', messages.length);
            return messages;
        } catch (error) {
            console.error('Error in getChatMessages service:', error);
            throw error;
        }
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