import axios from 'axios';
import { SchoolInfo } from '../models/SchoolInfo';
import { AppError } from '../utils/AppError';
import { logger } from '../utils/logger';
import { ChatMessageModel, IChatMessage } from '../models/ChatMessage';
import { User } from '../models/User';
import mongoose from 'mongoose';

// تنظیمات Hugging Face
const HUGGINGFACE_API_URL = "https://api-inference.huggingface.co/models/facebook/blenderbot-400M-distill";
const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY;

// تنظیمات حافظه موقت
const CACHE_TTL = 30 * 60 * 1000; // 30 دقیقه
const MAX_CACHE_SIZE = 1000; // حداکثر تعداد مکالمات ذخیره شده
const MEMORY_CHECK_INTERVAL = 5 * 60 * 1000; // هر 5 دقیقه
const MEMORY_THRESHOLD = 0.8; // 80% حافظه

// حافظه موقت برای ذخیره مکالمات با TTL
const conversationCache = new Map<string, { messages: IChatMessage[], timestamp: number }>();

// پاکسازی خودکار حافظه موقت
setInterval(() => {
    try {
        const now = Date.now();
        let deletedCount = 0;

        // پاکسازی مکالمات قدیمی
        for (const [key, value] of conversationCache.entries()) {
            if (now - value.timestamp > CACHE_TTL) {
                conversationCache.delete(key);
                deletedCount++;
            }
        }

        // اگر تعداد مکالمات از حد مجاز بیشتر شد، قدیمی‌ترین‌ها را حذف کن
        if (conversationCache.size > MAX_CACHE_SIZE) {
            const entries = Array.from(conversationCache.entries())
                .sort((a, b) => a[1].timestamp - b[1].timestamp);
            const toDelete = entries.slice(0, entries.length - MAX_CACHE_SIZE);
            toDelete.forEach(([key]) => {
                conversationCache.delete(key);
                deletedCount++;
            });
        }

        // بررسی وضعیت حافظه
        const memoryUsage = process.memoryUsage();
        const heapUsed = memoryUsage.heapUsed / memoryUsage.heapTotal;

        if (heapUsed > MEMORY_THRESHOLD) {
            logger.warn(`Memory usage high: ${(heapUsed * 100).toFixed(2)}%`);
            // پاکسازی حافظه
            if (global.gc) {
                global.gc();
            }
            // پاکسازی کامل حافظه موقت در صورت نیاز
            if (heapUsed > 0.9) {
                conversationCache.clear();
                logger.warn('Cache cleared due to high memory usage');
            }
        }

        if (deletedCount > 0) {
            logger.info(`Cleaned up ${deletedCount} old conversations`);
        }
    } catch (error) {
        logger.error('Error in cache cleanup:', error);
    }
}, MEMORY_CHECK_INTERVAL);

export class ChatService {
    private static instance: ChatService;

    private constructor() {
        if (!HUGGINGFACE_API_KEY) {
            logger.warn('HUGGINGFACE_API_KEY is not set in environment variables');
        }
    }

    public static getInstance(): ChatService {
        if (!ChatService.instance) {
            ChatService.instance = new ChatService();
        }
        return ChatService.instance;
    }

    public async processMessage(message: string): Promise<string> {
        try {
            if (!message.trim()) {
                throw new AppError('متن پیام نمی‌تواند خالی باشد', 400);
            }
            const aiResponse = await this.generateAIResponse(message);
            return aiResponse;
        } catch (error) {
            logger.error('Error in processMessage:', error);
            if (error instanceof AppError) {
                throw error;
            }
            throw new AppError('خطا در پردازش پیام', 500);
        }
    }

    private async generateAIResponse(message: string): Promise<string> {
        try {
            // اگر کلید API تنظیم نشده باشد، از پاسخ‌های پیش‌فرض استفاده می‌کنیم
            if (!HUGGINGFACE_API_KEY) {
                logger.warn('Using default responses due to missing HUGGINGFACE_API_KEY');
                return this.getDefaultResponse(message);
            }

            const response = await axios.post(
                HUGGINGFACE_API_URL,
                { 
                    inputs: message,
                    options: {
                        wait_for_model: true,
                        use_cache: false
                    }
                },
                {
                    headers: {
                        'Authorization': `Bearer ${HUGGINGFACE_API_KEY}`,
                        'Content-Type': 'application/json'
                    },
                    timeout: 10000,
                    maxContentLength: 1024 * 1024,
                    maxBodyLength: 1024 * 1024
                }
            );

            if (!response.data || !response.data[0]?.generated_text) {
                logger.warn('Invalid response from AI API, using default response');
                return this.getDefaultResponse(message);
            }

            return response.data[0].generated_text;
        } catch (error) {
            logger.error('Error generating AI response:', error);
            return this.getDefaultResponse(message);
        }
    }

    private getDefaultResponse(message: string): string {
        const lowerMessage = message.toLowerCase();
        
        // پاسخ به سلام
        if (lowerMessage.includes('سلام') || lowerMessage.includes('درود')) {
            return 'سلام! چطور می‌تونم کمکتون کنم؟';
        }

        // پاسخ به سوالات معرفی
        if (lowerMessage.includes('نام') || lowerMessage.includes('کی هستی') || lowerMessage.includes('تو کی هستی')) {
            return 'من یک دستیار هوشمند هستم که برای کمک به شما طراحی شده‌ام. می‌تونم در مورد مدرسه، کلاس‌ها، برنامه‌ها و سوالات دیگه کمکتون کنم.';
        }

        // پاسخ به سوالات مدرسه
        if (lowerMessage.includes('نام مدرسه')) {
            return 'دبیرستان پسرانه معراج یک مدرسه معتبر و پیشرفته است که با هدف تربیت دانش‌آموزان موفق و خلاق تأسیس شده است.';
        }

        // پاسخ به سوالات کلاس
        if (lowerMessage.includes('کلاس')) {
            return 'کلاس‌های ما با امکانات پیشرفته و اساتید مجرب برگزار می‌شوند. می‌تونید در مورد کلاس خاصی اطلاعات بیشتری بخواید.';
        }

        // پاسخ به سوالات برنامه
        if (lowerMessage.includes('برنامه') || lowerMessage.includes('زمان')) {
            return 'برنامه کلاس‌ها و فعالیت‌های مدرسه به صورت هفتگی تنظیم می‌شه. می‌تونید در مورد برنامه خاصی اطلاعات بیشتری بخواید.';
        }

        // پاسخ به سوالات ثبت‌نام
        if (lowerMessage.includes('ثبت‌نام') || lowerMessage.includes('شرکت') || lowerMessage.includes('مراحل ثبت نام')) {
            return 'مراحل ثبت نام به شرح زیر است:\n1. مراجعه به دفتر مدرسه\n2. تکمیل فرم ثبت نام\n3. ارائه مدارک مورد نیاز\n4. پرداخت هزینه ثبت نام\n5. دریافت کارت دانش‌آموزی\n\nبرای اطلاعات بیشتر می‌تونید با شماره 051-38932030 تماس بگیرید.';
        }

        // پاسخ به سوالات تماس
        if (lowerMessage.includes('تماس') || lowerMessage.includes('شماره')) {
            return 'شماره تماس مدرسه: 051-38932030\nآدرس: بلوار دانش آموز، دانش آموز 10\nایمیل: info@merajschool.ir';
        }

        // پاسخ به سوالات آدرس
        if (lowerMessage.includes('آدرس') || lowerMessage.includes('کجا')) {
            return 'آدرس مدرسه: بلوار دانش آموز، دانش آموز 10\n\nدسترسی‌ها:\n- مترو: ایستگاه دانش آموز\n- اتوبوس: خط 1 و 2\n- تاکسی: خط 3 و 4';
        }

        // پاسخ به سوالات شبکه‌های اجتماعی
        if (lowerMessage.includes('اینستاگرام') || lowerMessage.includes('تلگرام') || lowerMessage.includes('واتساپ')) {
            return 'شما می‌تونید از طریق شبکه‌های اجتماعی زیر با ما در ارتباط باشید:\nاینستاگرام: @merajschool\nتلگرام: @merajschool\nواتساپ: 09123456789';
        }

        // پاسخ به تشکر
        if (lowerMessage.includes('ممنون') || lowerMessage.includes('تشکر')) {
            return 'خواهش می‌کنم. اگر سوال دیگه‌ای دارید، خوشحال میشم کمکتون کنم.';
        }

        // پاسخ به خداحافظی
        if (lowerMessage.includes('خداحافظ') || lowerMessage.includes('بای') || lowerMessage.includes('خدانگهدار')) {
            return 'خدانگهدار. امیدوارم بتونم باز هم کمکتون کنم.';
        }

        // پاسخ پیش‌فرض برای سوالات دیگر
        return 'متوجه شدم. لطفاً سوال خود را به صورت دقیق‌تر مطرح کنید تا بتوانم بهتر کمکتان کنم.';
    }

    private async saveMessage(messageData: Partial<IChatMessage>): Promise<IChatMessage> {
        try {
            if (!messageData.text || !messageData.senderId) {
                throw new AppError('متن پیام و شناسه فرستنده الزامی است', 400);
            }
            const message = new ChatMessageModel({
                chatId: messageData.chatId,
                senderId: messageData.senderId,
                senderName: messageData.senderName,
                message: messageData.text,
                text: messageData.text,
                timestamp: messageData.timestamp || new Date(),
                isDeleted: false,
                fileUrl: messageData.fileUrl,
                fileName: messageData.fileName,
                fileType: messageData.fileType,
                metadata: messageData.metadata
            });
            const validationError = message.validateSync();
            if (validationError) {
                throw new AppError(`خطا در اعتبارسنجی پیام: ${validationError.message}`, 400);
            }
            return await message.save();
        } catch (error) {
            logger.error('Error saving message:', error);
            if (error instanceof AppError) throw error;
            throw new AppError('خطا در ذخیره پیام', 500);
        }
    }

    // دریافت تاریخچه مکالمه بر اساس chatId
    public async getConversationHistory(chatId: string): Promise<IChatMessage[]> {
        try {
            return await ChatMessageModel.find({ chatId, isDeleted: false })
                .sort({ timestamp: -1 })
                .limit(50);
        } catch (error) {
            logger.error('Error getting conversation history:', error);
            throw new AppError('خطا در دریافت تاریخچه مکالمات', 500);
        }
    }

    // ارسال پیام به پشتیبانی (اصلاح ساختار پیام)
    public async sendSupportMessage(text: string, userId: string): Promise<any> {
        try {
            const user = await User.findById(userId);
            if (!user) throw new AppError('کاربر یافت نشد', 404);
            const chatId = `support-${userId}`;
            const message = await this.saveMessage({
                chatId,
                senderId: userId,
                senderName: user.fullName || user.username,
                text,
                timestamp: new Date(),
                metadata: { isAI: false }
            });
            return {
                status: 'success',
                message: 'پیام شما با موفقیت به پشتیبانی ارسال شد.',
                data: message
            };
        } catch (error) {
            logger.error('Error sending support message:', error);
            if (error instanceof AppError) throw error;
            throw new AppError('خطا در ارسال پیام به پشتیبانی', 500);
        }
    }

    // تحلیل احساسات متن
    public async analyzeSentiment(text: string): Promise<'positive' | 'negative' | 'neutral'> {
        try {
            if (!HUGGINGFACE_API_KEY) {
                logger.warn('HUGGINGFACE_API_KEY not set, using default sentiment');
                return 'neutral';
            }

            const response = await fetch(HUGGINGFACE_API_URL, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${HUGGINGFACE_API_KEY}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ inputs: text })
            });

            if (!response.ok) {
                throw new Error('Failed to analyze sentiment');
            }

            const result = await response.json();
            return this.mapSentiment(result[0]?.label || 'neutral');
        } catch (error) {
            logger.error('Error in analyzeSentiment:', error);
            return 'neutral';
        }
    }

    // تشخیص منظور متن
    public async detectIntent(text: string): Promise<{ intent: string; confidence: number }> {
        try {
            if (!text?.trim()) {
                return { intent: 'unknown', confidence: 0 };
            }

            // تشخیص ساده منظور بر اساس کلمات کلیدی
            const lowerText = text.toLowerCase();
            const intents = {
                greeting: ['سلام', 'درود', 'خوش آمدید'],
                question: ['چطور', 'چگونه', 'کجا', 'چه', 'کی', 'چرا'],
                complaint: ['مشکل', 'خطا', 'ایراد', 'اشکال'],
                thanks: ['ممنون', 'تشکر', 'سپاس']
            };

            for (const [intent, keywords] of Object.entries(intents)) {
                if (keywords.some(keyword => lowerText.includes(keyword))) {
                    return { intent, confidence: 0.8 };
                }
            }

            return { intent: 'unknown', confidence: 0 };
        } catch (error) {
            logger.error('Error in detectIntent:', error);
            return { intent: 'unknown', confidence: 0 };
        }
    }

    // تولید پیشنهادات
    public async generateSuggestions(text: string, intent: string): Promise<string[]> {
        try {
            // اگر متن یا منظور خالی است، پیشنهادی تولید نمی‌کنیم
            if (!text || !intent) {
                return [];
            }

            const response = await axios.post<{ generated_text: string }[]>(
                HUGGINGFACE_API_URL,
                {
                    inputs: `بر اساس متن "${text}" و منظور "${intent}"، 3 پیشنهاد مرتبط تولید کن.`,
                    options: {
                        max_length: 100,
                        temperature: 0.7,
                        num_return_sequences: 3
                    }
                },
                {
                    headers: {
                        'Authorization': `Bearer ${HUGGINGFACE_API_KEY}`,
                        'Content-Type': 'application/json'
                    },
                    timeout: 5000 // کاهش timeout به 5 ثانیه
                }
            );

            const suggestions = response.data[0]?.generated_text?.split('\n') || [];
            return suggestions
                .filter(s => s.trim().length > 0)
                .slice(0, 3); // حداکثر 3 پیشنهاد
        } catch (error) {
            logger.error('Error in generateSuggestions:', error);
            return [];
        }
    }

    // یادگیری از مکالمه
    public async learnFromConversation(message: IChatMessage): Promise<void> {
        try {
            if (!message?.text?.trim()) {
                logger.warn('Missing message text in learnFromConversation');
                return;
            }
            if (!message.senderId) {
                logger.warn('Invalid message format in learnFromConversation:', {
                    id: message.id,
                    hasText: !!message.text,
                    hasSender: !!message.senderId,
                    metadata: message.metadata
                });
                return;
            }
            try {
                const messageToSave = new ChatMessageModel({
                    chatId: message.chatId,
                    senderId: message.senderId,
                    senderName: message.senderName,
                    message: message.text,
                    text: message.text,
                    timestamp: message.timestamp || new Date(),
                    isDeleted: false,
                    fileUrl: message.fileUrl,
                    fileName: message.fileName,
                    fileType: message.fileType,
                    metadata: message.metadata
                });
                await messageToSave.save();
            } catch (error) {
                logger.error('Error saving message in learnFromConversation:', error);
                return;
            }
            // حذف کدهای مربوط به conversationContext
            // تحلیل احساسات و منظور پیام با مدیریت خطا
            try {
                const [sentiment, intent] = await Promise.all([
                    this.analyzeSentiment(message.text),
                    this.detectIntent(message.text)
                ]);
                if (message.id) {
                    await ChatMessageModel.findByIdAndUpdate(message.id, {
                        $set: {
                            'metadata.sentiment': sentiment,
                            'metadata.intent': intent.intent,
                            'metadata.confidence': intent.confidence
                        }
                    }).exec();
                }
            } catch (error) {
                logger.error('Error in sentiment/intent analysis:', error);
            }
        } catch (error) {
            logger.error('Error in learnFromConversation:', error);
        }
    }

    // دریافت پاسخ سوالات متداول
    public async getFAQResponse(question: string): Promise<string> {
        try {
            const faqResponses: { [key: string]: string } = {
                'ثبت نام': 'برای ثبت نام می‌توانید به بخش ثبت نام در وب‌سایت مراجعه کنید یا با شماره 051-38932030 تماس بگیرید.',
                'هزینه': 'هزینه‌های تحصیلی در هر سال تحصیلی متفاوت است. برای اطلاع از هزینه‌های دقیق با بخش مالی مدرسه تماس بگیرید.',
                'زمان ثبت نام': 'ثبت نام برای سال تحصیلی جدید از خرداد ماه آغاز می‌شود.',
                'مدارک مورد نیاز': 'مدارک مورد نیاز شامل: شناسنامه، کارت ملی، عکس، کارنامه سال قبل و فرم‌های مربوطه می‌باشد.',
                'ساعات کاری': 'ساعات کاری مدرسه از 7:30 صبح تا 14:30 بعد از ظهر می‌باشد.',
                'آدرس': 'آدرس مدرسه: بلوار دانش آموز، دانش آموز 10',
                'تماس': 'شماره تماس مدرسه: 051-38932030',
                'ایمیل': 'ایمیل مدرسه: info@merajschool.ir'
            };
            for (const [key, response] of Object.entries(faqResponses)) {
                if (question.toLowerCase().includes(key.toLowerCase())) {
                    return response;
                }
            }
            return 'متأسفانه پاسخ مناسبی برای سوال شما پیدا نشد. لطفاً با پشتیبانی تماس بگیرید.';
        } catch (error) {
            logger.error('Error getting FAQ response:', error);
            throw new AppError('خطا در دریافت پاسخ سوالات متداول', 500);
        }
    }

    private mapSentiment(label: string): 'positive' | 'negative' | 'neutral' {
        const sentimentMap: { [key: string]: 'positive' | 'negative' | 'neutral' } = {
            'positive': 'positive',
            'negative': 'negative',
            'neutral': 'neutral',
            'LABEL_0': 'negative',
            'LABEL_1': 'neutral',
            'LABEL_2': 'positive'
        };
        return sentimentMap[label.toLowerCase()] || 'neutral';
    }

    // متد جدید برای بررسی محتوای نامناسب
    private async checkInappropriateContent(text: string): Promise<boolean> {
        try {
            // پیاده‌سازی فیلتر محتوای نامناسب
            const inappropriateWords = ['کلمه1', 'کلمه2']; // لیست کلمات نامناسب
            return inappropriateWords.some(word => text.includes(word));
        } catch (error) {
            logger.error('Error checking inappropriate content:', error);
            return false;
        }
    }
} 