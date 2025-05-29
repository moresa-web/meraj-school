import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';
import chatService from './chat.service';

export class SignalRService {
    private io: Server;

    constructor(server: HttpServer) {
        this.io = new Server(server, {
            cors: {
                origin: process.env.CORS_ORIGIN || '*',
                methods: ['GET', 'POST']
            }
        });

        this.setupEventHandlers();
    }

    private setupEventHandlers() {
        this.io.on('connection', (socket) => {
            console.log('Client connected:', socket.id);

            // پیوستن به چت
            socket.on('joinChat', async (chatId: string) => {
                socket.join(chatId);
                console.log(`Client ${socket.id} joined chat ${chatId}`);
            });

            // ترک چت
            socket.on('leaveChat', (chatId: string) => {
                socket.leave(chatId);
                console.log(`Client ${socket.id} left chat ${chatId}`);
            });

            // ارسال پیام
            socket.on('sendMessage', async (data: {
                chatId: string;
                senderId: string;
                senderName: string;
                message: string;
                fileData?: { url: string; name: string; type: string; };
            }) => {
                try {
                    const message = await chatService.sendMessage(
                        data.chatId,
                        data.senderId,
                        data.senderName,
                        data.message,
                        data.fileData
                    );

                    // ارسال پیام به همه اعضای چت
                    this.io.to(data.chatId).emit('newMessage', message);
                } catch (error) {
                    console.error('Error sending message:', error);
                    socket.emit('error', { message: 'خطا در ارسال پیام' });
                }
            });

            // به‌روزرسانی وضعیت خوانده شدن
            socket.on('markAsRead', async (data: { chatId: string; userId: string }) => {
                try {
                    await chatService.markMessagesAsRead(data.chatId, data.userId);
                    this.io.to(data.chatId).emit('messagesRead', {
                        chatId: data.chatId,
                        userId: data.userId
                    });
                } catch (error) {
                    console.error('Error marking messages as read:', error);
                    socket.emit('error', { message: 'خطا در به‌روزرسانی وضعیت پیام‌ها' });
                }
            });

            // بستن چت
            socket.on('closeChat', async (data: {
                chatId: string;
                adminId: string;
                adminName: string;
            }) => {
                try {
                    const chat = await chatService.closeChat(
                        data.chatId,
                        data.adminId,
                        data.adminName
                    );
                    this.io.to(data.chatId).emit('chatClosed', chat);
                } catch (error) {
                    console.error('Error closing chat:', error);
                    socket.emit('error', { message: 'خطا در بستن چت' });
                }
            });

            // باز کردن مجدد چت
            socket.on('reopenChat', async (data: { chatId: string }) => {
                try {
                    const chat = await chatService.reopenChat(data.chatId);
                    this.io.to(data.chatId).emit('chatReopened', chat);
                } catch (error) {
                    console.error('Error reopening chat:', error);
                    socket.emit('error', { message: 'خطا در باز کردن مجدد چت' });
                }
            });

            // حذف پیام
            socket.on('deleteMessage', async (data: {
                messageId: string;
                deletedBy: string;
            }) => {
                try {
                    const message = await chatService.deleteMessage(
                        data.messageId,
                        data.deletedBy
                    );
                    this.io.to(message.chatId).emit('messageDeleted', message);
                } catch (error) {
                    console.error('Error deleting message:', error);
                    socket.emit('error', { message: 'خطا در حذف پیام' });
                }
            });

            // قطع اتصال
            socket.on('disconnect', () => {
                console.log('Client disconnected:', socket.id);
            });
        });
    }

    // ارسال پیام به یک چت خاص
    public sendToChat(chatId: string, event: string, data: any) {
        this.io.to(chatId).emit(event, data);
    }

    // ارسال پیام به همه کاربران
    public broadcast(event: string, data: any) {
        this.io.emit(event, data);
    }
}

export default SignalRService; 