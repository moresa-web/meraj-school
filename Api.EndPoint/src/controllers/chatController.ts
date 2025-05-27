import { Request, Response } from 'express';
import { ChatService } from '../services/chatService';
import { AppError } from '../utils/AppError';
import { logger } from '../utils/logger';
import mongoose from 'mongoose';

export class ChatController {
    private static instance: ChatController;
    private chatService: ChatService;

    private constructor() {
        this.chatService = ChatService.getInstance();
    }

    public static getInstance(): ChatController {
        if (!ChatController.instance) {
            ChatController.instance = new ChatController();
        }
        return ChatController.instance;
    }

    public async processMessage(req: Request, res: Response) {
        try {
            const { text, schoolInfo } = req.body;
            
            if (!text) {
                throw new AppError('متن پیام الزامی است', 400);
            }

            // تنظیم timeout برای درخواست
            const timeout = setTimeout(() => {
                throw new AppError('زمان پاسخگویی به پایان رسید', 408);
            }, 30000); // 30 ثانیه

            try {
                // تولید پاسخ هوش مصنوعی
                const aiResponse = await this.chatService.processMessage(text);

                // ساختار پاسخ
                const response = {
                    status: 'success',
                    message: {
                        id: `msg-${Date.now()}`,
                        text: aiResponse.text,
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

                clearTimeout(timeout);
                res.json(response);
            } catch (error) {
                clearTimeout(timeout);
                throw error;
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
            res.json({ sentiment });
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
            res.json(intent);
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
            res.json({ suggestions });
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

            await this.chatService.learnFromConversation(message, context);
            res.json({ status: 'success' });
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
            res.json(response);
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
                throw new AppError('کاربر احراز هویت نشده است', 401);
            }
            const history = await this.chatService.getConversationHistory(userId);
            res.json({ data: history });
        } catch (error) {
            logger.error('Error getting conversation history:', error);
            if (error instanceof AppError) {
                res.status(error.statusCode).json({ message: error.message });
            } else {
                res.status(500).json({ message: 'خطا در دریافت تاریخچه مکالمات' });
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
            res.json(result);
        } catch (error) {
            logger.error('Error sending support message:', error);
            if (error instanceof AppError) {
                res.status(error.statusCode).json({ message: error.message });
            } else {
                res.status(500).json({ message: 'خطا در ارسال پیام به پشتیبانی' });
            }
        }
    }

    public async sendMessage(req: Request, res: Response) {
        try {
            const { text, schoolInfo, metadata } = req.body;
            if (!text) {
                throw new AppError('متن پیام الزامی است', 400);
            }

            const response = await this.chatService.processMessage(text);
            res.json(response);
        } catch (error) {
            logger.error('Error sending message:', error);
            if (error instanceof AppError) {
                res.status(error.statusCode).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'خطا در ارسال پیام' });
            }
        }
    }
} 