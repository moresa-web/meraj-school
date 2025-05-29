import { Request, Response } from 'express';
import { ChatService } from '../services/chatService';
import { AppError } from '../utils/AppError';
import { logger } from '../utils/logger';
import mongoose from 'mongoose';
import { IChatMessage } from '../models/ChatMessage';

export class ChatController {
    private static instance: ChatController;
    private chatService: ChatService;
    private readonly RATE_LIMIT = 100; // تعداد درخواست مجاز در 24 ساعت
    private readonly RATE_LIMIT_WINDOW = 24 * 60 * 60 * 1000; // 24 ساعت به میلی‌ثانیه
    private requestCounts: Map<string, { count: number; timestamp: number }> = new Map();

    private constructor() {
        this.chatService = ChatService.getInstance();
        // پاکسازی خودکار محدودیت‌های قدیمی
        setInterval(() => this.cleanupRateLimits(), 60 * 60 * 1000); // هر ساعت
    }

    public static getInstance(): ChatController {
        if (!ChatController.instance) {
            ChatController.instance = new ChatController();
        }
        return ChatController.instance;
    }

    // متد جدید برای بررسی محدودیت درخواست
    private async checkRateLimit(userId: string): Promise<void> {
        const now = Date.now();
        const userLimit = this.requestCounts.get(userId);

        if (!userLimit || now - userLimit.timestamp > this.RATE_LIMIT_WINDOW) {
            this.requestCounts.set(userId, { count: 1, timestamp: now });
            return;
        }

        if (userLimit.count >= this.RATE_LIMIT) {
            throw new AppError('تعداد درخواست‌های شما بیش از حد مجاز است', 429);
        }

        userLimit.count++;
        this.requestCounts.set(userId, userLimit);
    }

    // پاکسازی محدودیت‌های قدیمی
    private cleanupRateLimits(): void {
        const now = Date.now();
        for (const [userId, data] of this.requestCounts.entries()) {
            if (now - data.timestamp > this.RATE_LIMIT_WINDOW) {
                this.requestCounts.delete(userId);
            }
        }
    }

    // متد جدید برای اعتبارسنجی ورودی
    private validateMessageInput(text: string): void {
        if (!text?.trim()) {
            throw new AppError('متن پیام نمی‌تواند خالی باشد', 400);
        }

        if (text.length > 1000) {
            throw new AppError('طول پیام نمی‌تواند بیشتر از 1000 کاراکتر باشد', 400);
        }
    }

    public async processMessage(req: Request, res: Response) {
        try {
            const { text, schoolInfo } = req.body;
            
            if (!text) {
                throw new AppError('متن پیام الزامی است', 400);
            }

            let timeoutTriggered = false;
            // تنظیم timeout برای درخواست
            const timeout = setTimeout(() => {
                timeoutTriggered = true;
                res.status(408).json({
                    status: 'error',
                    error: 'زمان پاسخگویی به پایان رسید'
                });
            }, 30000); // 30 ثانیه

            try {
                // تولید پاسخ هوش مصنوعی
                const aiResponse = await this.chatService.processMessage(text);

                if (timeoutTriggered) return;
                clearTimeout(timeout);
                // ساختار پاسخ
                const response = {
                    status: 'success',
                    message: {
                        id: `msg-${Date.now()}`,
                        text: aiResponse,
                        sender: 'ai',
                        timestamp: new Date(),
                        type: 'text',
                        metadata: {
                            isRead: false,
                            status: 'sent'
                        }
                    },
                    conversationId: `conv-${Date.now()}`
                };

                res.status(200).json(response);
            } catch (error) {
                if (!timeoutTriggered) {
                    clearTimeout(timeout);
                    throw error;
                }
            }
        } catch (error) {
            logger.error('Error processing message:', error);
            
            if (error instanceof AppError) {
                res.status(error.statusCode).json({
                    status: 'error',
                    error: error.message
                });
            } else {
                res.status(500).json({
                    status: 'error',
                    error: 'خطا در پردازش پیام'
                });
            }
        }
    }

    public async analyzeSentiment(req: Request, res: Response) {
        try {
            const { text } = req.body;
            if (!text) {
                throw new AppError('متن پیام الزامی است', 400);
            }

            const sentiment = await this.chatService.analyzeSentiment(text);
            res.status(200).json({ sentiment });
        } catch (error) {
            logger.error('Error analyzing sentiment:', error);
            if (error instanceof AppError) {
                res.status(error.statusCode).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'خطا در تحلیل احساسات' });
            }
        }
    }

    public async detectIntent(req: Request, res: Response) {
        try {
            const { text } = req.body;
            if (!text) {
                throw new AppError('متن پیام الزامی است', 400);
            }

            const intent = await this.chatService.detectIntent(text);
            res.status(200).json(intent);
        } catch (error) {
            logger.error('Error detecting intent:', error);
            if (error instanceof AppError) {
                res.status(error.statusCode).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'خطا در تشخیص منظور پیام' });
            }
        }
    }

    public async generateSuggestions(req: Request, res: Response) {
        try {
            const { text, intent } = req.body;
            const suggestions = await this.chatService.generateSuggestions(text, intent);
            res.status(200).json({ suggestions });
        } catch (error) {
            logger.error('Error generating suggestions:', error);
            if (error instanceof AppError) {
                res.status(error.statusCode).json({ message: error.message });
            } else {
                res.status(500).json({ message: 'خطا در تولید پیشنهادات' });
            }
        }
    }

    public async learnFromConversation(req: Request, res: Response) {
        try {
            const { message, context } = req.body;
            if (!message || !context) {
                throw new AppError('پیام و زمینه مکالمه الزامی است', 400);
            }

            const messageData: Partial<IChatMessage> = {
                chatId: `conv-${Date.now()}`,
                senderId: req.user?._id || 'system',
                senderName: req.user?.username || 'System',
                message: message,
                text: message,
                timestamp: new Date(),
                isRead: false,
                isDeleted: false,
                metadata: {
                    isAI: false
                }
            };

            await this.chatService.learnFromConversation(messageData as IChatMessage);
            res.status(200).json({ status: 'success' });
        } catch (error) {
            logger.error('Error learning from conversation:', error);
            if (error instanceof AppError) {
                res.status(error.statusCode).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'خطا در یادگیری از مکالمه' });
            }
        }
    }

    public async getFAQResponse(req: Request, res: Response) {
        try {
            const { question } = req.body;
            const response = await this.chatService.getFAQResponse(question);
            res.status(200).json(response);
        } catch (error) {
            logger.error('Error getting FAQ response:', error);
            if (error instanceof AppError) {
                res.status(error.statusCode).json({ message: error.message });
            } else {
                res.status(500).json({ message: 'خطا در دریافت پاسخ سوالات متداول' });
            }
        }
    }

    public async getConversationHistory(req: Request, res: Response) {
        try {
            const userId = req.user?._id?.toString();
            if (!userId) {
                return res.status(401).json({
                    status: 'error',
                    message: 'کاربر احراز هویت نشده است',
                    timestamp: new Date()
                });
            }

            // بررسی محدودیت درخواست
            await this.checkRateLimit(userId);

            const history = await this.chatService.getConversationHistory(userId);
            
            res.status(200).json({ 
                status: 'success',
                data: history,
                timestamp: new Date()
            });
        } catch (error) {
            logger.error('Error getting conversation history:', error);
            
            if (error instanceof AppError) {
                res.status(error.statusCode).json({ 
                    status: 'error',
                    message: error.message,
                    timestamp: new Date()
                });
            } else {
                res.status(500).json({ 
                    status: 'error',
                    message: 'خطا در دریافت تاریخچه مکالمات',
                    timestamp: new Date()
                });
            }
        }
    }

    public async sendSupportMessage(req: Request, res: Response) {
        try {
            const { text } = req.body;
            const userId = req.user?._id?.toString();
            
            if (!text) {
                throw new AppError('متن پیام الزامی است', 400);
            }

            if (!userId) {
                throw new AppError('کاربر احراز هویت نشده است', 401);
            }

            const result = await this.chatService.sendSupportMessage(text, userId);
            res.status(200).json(result);
        } catch (error) {
            logger.error('Error sending support message:', error);
            if (error instanceof AppError) {
                res.status(error.statusCode).json({ message: error.message });
            } else {
                res.status(500).json({ message: 'خطا در ارسال پیام به پشتیبانی' });
            }
        }
    }
} 