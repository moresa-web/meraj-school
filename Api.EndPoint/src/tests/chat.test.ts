import { ChatController } from '../controllers/chatController';
import { ChatService } from '../services/chatService';
import { AppError } from '../utils/AppError';
import mongoose from 'mongoose';
import { Request, Response } from 'express';

// Mock برای setInterval
jest.useFakeTimers();

// Mock برای ChatService
jest.mock('../services/chatService', () => {
    return {
        ChatService: {
            getInstance: jest.fn().mockImplementation(() => ({
                processMessage: jest.fn().mockResolvedValue('پاسخ تست'),
                analyzeSentiment: jest.fn().mockResolvedValue({ score: 0.8, label: 'positive' }),
                detectIntent: jest.fn().mockResolvedValue({ intent: 'greeting', confidence: 0.9 }),
                generateSuggestions: jest.fn().mockImplementation((text, intent) => {
                    if (intent === 'error') {
                        throw new Error('خطای تست');
                    }
                    return ['پیشنهاد 1', 'پیشنهاد 2'];
                }),
                learnFromConversation: jest.fn().mockResolvedValue(true),
                getFAQResponse: jest.fn().mockImplementation((question) => {
                    if (question === 'error') {
                        throw new Error('خطای تست');
                    }
                    return { answer: 'پاسخ تست' };
                }),
                getConversationHistory: jest.fn().mockResolvedValue([]),
                sendSupportMessage: jest.fn().mockResolvedValue({ id: 'msg-1', status: 'sent' })
            }))
        }
    };
});

// Mock برای Request و Response
const mockRequest = (body: any = {}, user: any = {}) => ({
    body,
    user: { _id: user._id || 'test-user-id' }
} as Request);

const mockResponse = () => {
    const res: any = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res as Response;
};

describe('ChatController Tests', () => {
    let chatController: ChatController;
    let chatService: ChatService;

    beforeEach(() => {
        // پاک کردن instance قبلی
        (ChatController as any).instance = null;
        (ChatService as any).instance = null;
        
        chatController = ChatController.getInstance();
        chatService = ChatService.getInstance();
    });

    afterEach(() => {
        jest.clearAllMocks();
        jest.clearAllTimers();
    });

    afterAll(() => {
        jest.useRealTimers();
    });

    describe('getConversationHistory', () => {
        it('should get conversation history successfully', async () => {
            const req = mockRequest();
            const res = mockResponse();

            await chatController.getConversationHistory(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                status: 'success',
                data: expect.any(Array),
                timestamp: expect.any(Date)
            }));
        });

        it('should throw error for unauthenticated user', async () => {
            const req = mockRequest({}, {});
            req.user = undefined;
            const res = mockResponse();

            await chatController.getConversationHistory(req, res);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                status: 'error',
                message: 'کاربر احراز هویت نشده است'
            }));
        });
    });

    describe('processMessage', () => {
        it('should process message successfully', async () => {
            const req = mockRequest({ text: 'سلام' });
            const res = mockResponse();

            await chatController.processMessage(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                status: 'success',
                message: expect.objectContaining({
                    text: expect.any(String),
                    sender: 'ai',
                    timestamp: expect.any(Date)
                })
            }));
        });

        it('should handle timeout', async () => {
            const req = mockRequest({ text: 'test' });
            const res = mockResponse();

            // شبیه‌سازی تاخیر طولانی
            const promise = chatController.processMessage(req, res);
            jest.advanceTimersByTime(31000);
            await promise;

            expect(res.status).toHaveBeenCalledWith(408);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                status: 'error',
                error: 'زمان پاسخگویی به پایان رسید'
            }));
        });
    });

    describe('analyzeSentiment', () => {
        it('should analyze sentiment successfully', async () => {
            const req = mockRequest({ text: 'من خیلی خوشحالم' });
            const res = mockResponse();

            await chatController.analyzeSentiment(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                sentiment: expect.any(Object)
            }));
        });

        it('should handle missing text', async () => {
            const req = mockRequest({});
            const res = mockResponse();

            await chatController.analyzeSentiment(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                error: 'متن پیام الزامی است'
            }));
        });
    });

    describe('detectIntent', () => {
        it('should detect intent successfully', async () => {
            const req = mockRequest({ text: 'ساعت چند است؟' });
            const res = mockResponse();

            await chatController.detectIntent(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(expect.any(Object));
        });

        it('should handle missing text', async () => {
            const req = mockRequest({});
            const res = mockResponse();

            await chatController.detectIntent(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                error: 'متن پیام الزامی است'
            }));
        });
    });

    describe('generateSuggestions', () => {
        it('should generate suggestions successfully', async () => {
            const req = mockRequest({ text: 'سلام', intent: 'greeting' });
            const res = mockResponse();

            await chatController.generateSuggestions(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                suggestions: expect.any(Array)
            }));
        });

        it('should handle service error', async () => {
            const req = mockRequest({ text: 'test', intent: 'error' });
            const res = mockResponse();

            await chatController.generateSuggestions(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                message: 'خطا در تولید پیشنهادات'
            }));
        });
    });

    describe('learnFromConversation', () => {
        it('should learn from conversation successfully', async () => {
            const req = mockRequest({
                message: 'سلام',
                context: { type: 'greeting' }
            });
            const res = mockResponse();

            await chatController.learnFromConversation(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                status: 'success'
            }));
        });

        it('should handle missing message or context', async () => {
            const req = mockRequest({});
            const res = mockResponse();

            await chatController.learnFromConversation(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                error: 'پیام و زمینه مکالمه الزامی است'
            }));
        });
    });

    describe('getFAQResponse', () => {
        it('should get FAQ response successfully', async () => {
            const req = mockRequest({ question: 'ساعت کار مدرسه' });
            const res = mockResponse();

            await chatController.getFAQResponse(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(expect.any(Object));
        });

        it('should handle service error', async () => {
            const req = mockRequest({ question: 'error' });
            const res = mockResponse();

            await chatController.getFAQResponse(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                message: 'خطا در دریافت پاسخ سوالات متداول'
            }));
        });
    });

    describe('sendSupportMessage', () => {
        it('should send support message successfully', async () => {
            const req = mockRequest({ text: 'نیاز به کمک دارم' });
            const res = mockResponse();

            await chatController.sendSupportMessage(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(expect.any(Object));
        });

        it('should handle missing text', async () => {
            const req = mockRequest({});
            const res = mockResponse();

            await chatController.sendSupportMessage(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                message: 'متن پیام الزامی است'
            }));
        });

        it('should handle unauthenticated user', async () => {
            const req = mockRequest({ text: 'test' });
            req.user = undefined;
            const res = mockResponse();

            await chatController.sendSupportMessage(req, res);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                message: 'کاربر احراز هویت نشده است'
            }));
        });
    });

    describe('Rate Limiting', () => {
        it('should handle rate limit check for new user', async () => {
            const req = mockRequest();
            const res = mockResponse();
            
            // تست getConversationHistory که از checkRateLimit استفاده می‌کند
            await chatController.getConversationHistory(req, res);
            
            expect(res.status).toHaveBeenCalledWith(200);
        });

        it('should handle rate limit exceeded', async () => {
            const req = mockRequest();
            const res = mockResponse();
            
            // شبیه‌سازی تعداد زیاد درخواست
            for (let i = 0; i < 101; i++) {
                await chatController.getConversationHistory(req, res);
            }
            
            expect(res.status).toHaveBeenCalledWith(429);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                status: 'error',
                message: 'تعداد درخواست‌های شما بیش از حد مجاز است'
            }));
        });

        it('should cleanup old rate limits', async () => {
            const req = mockRequest();
            const res = mockResponse();
            
            // شبیه‌سازی درخواست‌های قدیمی
            await chatController.getConversationHistory(req, res);
            
            // پیش‌بردن زمان به جلو
            jest.advanceTimersByTime(25 * 60 * 60 * 1000); // 25 ساعت
            
            // اجرای مجدد درخواست
            await chatController.getConversationHistory(req, res);
            
            expect(res.status).toHaveBeenCalledWith(200);
        });
    });

    describe('Message Validation', () => {
        it('should handle empty message in processMessage', async () => {
            const req = mockRequest({ text: '' });
            const res = mockResponse();

            await chatController.processMessage(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                status: 'error',
                error: 'متن پیام نمی‌تواند خالی باشد'
            }));
        });

        it('should handle long message in processMessage', async () => {
            const longText = 'a'.repeat(1001);
            const req = mockRequest({ text: longText });
            const res = mockResponse();

            await chatController.processMessage(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                status: 'error',
                error: 'طول پیام نمی‌تواند بیشتر از 1000 کاراکتر باشد'
            }));
        });
    });

    describe('Error Handling', () => {
        it('should handle service error in processMessage', async () => {
            const req = mockRequest({ text: 'error' });
            const res = mockResponse();

            // شبیه‌سازی خطای سرویس
            jest.spyOn(chatService, 'processMessage').mockRejectedValueOnce(new Error('خطای تست'));

            await chatController.processMessage(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                status: 'error',
                error: 'خطا در پردازش پیام'
            }));
        });

        it('should handle service error in analyzeSentiment', async () => {
            const req = mockRequest({ text: 'error' });
            const res = mockResponse();

            // شبیه‌سازی خطای سرویس
            jest.spyOn(chatService, 'analyzeSentiment').mockRejectedValueOnce(new Error('خطای تست'));

            await chatController.analyzeSentiment(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                error: 'خطا در تحلیل احساسات'
            }));
        });

        it('should handle service error in detectIntent', async () => {
            const req = mockRequest({ text: 'error' });
            const res = mockResponse();

            // شبیه‌سازی خطای سرویس
            jest.spyOn(chatService, 'detectIntent').mockRejectedValueOnce(new Error('خطای تست'));

            await chatController.detectIntent(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                error: 'خطا در تشخیص منظور پیام'
            }));
        });

        it('should handle service error in learnFromConversation', async () => {
            const req = mockRequest({
                message: 'error',
                context: { type: 'error' }
            });
            const res = mockResponse();

            // شبیه‌سازی خطای سرویس
            jest.spyOn(chatService, 'learnFromConversation').mockRejectedValueOnce(new Error('خطای تست'));

            await chatController.learnFromConversation(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                error: 'خطا در یادگیری از مکالمه'
            }));
        });
    });
}); 