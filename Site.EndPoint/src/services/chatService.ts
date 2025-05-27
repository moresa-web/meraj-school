import axios from 'axios';
import { API_URL } from '../constants';
import { ChatMessage, ChatResponse, SchoolInfo, FAQ } from '../types/chat';

export interface ConversationContext {
    lastMessages: ChatMessage[];
    userPreferences: {
        language: string;
        tone: 'formal' | 'casual';
        topics: string[];
    };
}

export class ChatService {
    private static instance: ChatService;
    private baseUrl: string;
    private token: string | null = null;
    private schoolInfo: SchoolInfo | null = null;
    private conversationContext: ConversationContext = {
        lastMessages: [],
        userPreferences: {
            language: 'fa',
            tone: 'formal',
            topics: []
        }
    };

    private constructor() {
        this.baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        this.token = localStorage.getItem('token');
        this.loadSchoolInfo();
        this.loadConversationContext();
    }

    public static getInstance(): ChatService {
        if (!ChatService.instance) {
            ChatService.instance = new ChatService();
        }
        return ChatService.instance;
    }

    private async loadSchoolInfo() {
        try {
            const response = await axios.get(`${this.baseUrl}/seo`);
            if (response.data) {
                this.schoolInfo = {
                    name: response.data.schoolName,
                    phone: response.data.phone,
                    address: response.data.address,
                    email: response.data.email,
                    website: response.data.siteUrl,
                    workingHours: 'شنبه تا چهارشنبه از ساعت 7:30 تا 14:30',
                    socialMedia: {
                        instagram: response.data.socialMedia?.instagram,
                        telegram: response.data.socialMedia?.telegram,
                        whatsapp: response.data.socialMedia?.whatsapp
                    }
                };
            }
        } catch (error) {
            console.error('خطا در دریافت اطلاعات مدرسه:', error);
            // استفاده از اطلاعات پیش‌فرض در صورت خطا
            this.schoolInfo = {
                name: 'دبیرستان پسرانه معراج',
                phone: '051-38932030',
                address: 'بلوار دانش آموز، دانش آموز 10',
                email: 'info@merajschool.ir',
                website: 'https://merajschool.ir',
                workingHours: 'شنبه تا چهارشنبه از ساعت 7:30 تا 14:30',
                socialMedia: {
                    instagram: 'https://instagram.com/merajschool',
                    telegram: 'https://t.me/merajschool',
                    whatsapp: '09123456789'
                }
            };
        }
    }

    private loadConversationContext() {
        const savedContext = localStorage.getItem('chatContext');
        if (savedContext) {
            this.conversationContext = JSON.parse(savedContext);
        }
    }

    private saveConversationContext() {
        localStorage.setItem('chatContext', JSON.stringify(this.conversationContext));
    }

    private getHeaders() {
        return {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': this.token ? `Bearer ${this.token}` : ''
        };
    }

    private async analyzeSentiment(text: string): Promise<'positive' | 'negative' | 'neutral'> {
        try {
            const response = await axios.post(
                `${this.baseUrl}/chat/analyze-sentiment`,
                { text },
                { headers: this.getHeaders() }
            );
            return response.data.sentiment;
        } catch (error) {
            console.error('خطا در تحلیل احساسات:', error);
            return 'neutral';
        }
    }

    private async detectIntent(text: string): Promise<{ intent: string; confidence: number }> {
        try {
            // اعتبارسنجی پیام
            if (!text?.trim()) {
                throw new Error('متن پیام نمی‌تواند خالی باشد');
            }

            const response = await axios.post(
                `${this.baseUrl}/chat/detect-intent`,
                {
                    text,
                    metadata: {
                        timestamp: new Date().toISOString(),
                        source: 'web'
                    }
                },
                { headers: this.getHeaders() }
            );
            return response.data;
        } catch (error) {
            console.error('Error detecting intent:', error);
            return { intent: 'unknown', confidence: 0 };
        }
    }

    private getPredefinedResponse(text: string): string | null {
        const lowerText = text.toLowerCase();
        
        // پاسخ‌های از پیش تعریف شده
        const responses: { [key: string]: string } = {
            'نام مدرسه': `نام مدرسه ما ${this.schoolInfo?.name || 'دبیرستان پسرانه معراج'} است.`,
            'شماره تماس': `شماره تماس مدرسه ${this.schoolInfo?.phone || '051-38932030'} است.`,
            'آدرس': `آدرس مدرسه: ${this.schoolInfo?.address || 'بلوار دانش آموز، دانش آموز 10'}`,
            'ساعات کاری': `ساعات کاری مدرسه: ${this.schoolInfo?.workingHours || 'شنبه تا چهارشنبه از ساعت 7:30 تا 14:30'}`,
            'ایمیل': `ایمیل مدرسه: ${this.schoolInfo?.email || 'info@merajschool.ir'}`,
            'سایت': `آدرس وب‌سایت مدرسه: ${this.schoolInfo?.website || 'https://merajschool.ir'}`,
            'اینستاگرام': `صفحه اینستاگرام مدرسه: ${this.schoolInfo?.socialMedia?.instagram || 'https://instagram.com/merajschool'}`,
            'تلگرام': `کانال تلگرام مدرسه: ${this.schoolInfo?.socialMedia?.telegram || 'https://t.me/merajschool'}`,
            'واتساپ': `شماره واتساپ مدرسه: ${this.schoolInfo?.socialMedia?.whatsapp || '09123456789'}`
        };

        // جستجوی کلیدهای تطبیق‌پذیر
        for (const [key, response] of Object.entries(responses)) {
            if (lowerText.includes(key.toLowerCase())) {
                return response;
            }
        }

        return null;
    }

    private async generateSuggestions(text: string, intent: string): Promise<string[]> {
        try {
            const response = await axios.post(
                `${this.baseUrl}/chat/generate-suggestions`,
                { text, intent },
                { headers: this.getHeaders() }
            );
            return response.data.suggestions;
        } catch (error) {
            console.error('خطا در تولید پیشنهادات:', error);
            return [];
        }
    }

    private async learnFromConversation(message: string, context: ConversationContext): Promise<void> {
        try {
            // اعتبارسنجی ورودی
            if (!message?.trim() || !context) {
                console.warn('Invalid input for learning:', { message, context });
                return;
            }

            const messageData: ChatMessage = {
                id: `msg-${Date.now()}`,
                text: message,
                sender: 'user',
                timestamp: new Date(),
                type: 'text',
                metadata: {
                    isRead: false,
                    status: 'sent',
                    sentiment: 'neutral',
                    intent: 'unknown',
                    confidence: 0
                }
            };

            await axios.post(
                `${this.baseUrl}/chat/learn`,
                {
                    message: messageData,
                    context: {
                        lastMessages: context.lastMessages || [],
                        userPreferences: context.userPreferences || {
                            language: 'fa',
                            tone: 'formal',
                            topics: []
                        }
                    }
                },
                { headers: this.getHeaders() }
            );
        } catch (error) {
            console.error('Error in learning from conversation:', error);
        }
    }

    /**
     * ارسال پیام به چت بات
     * @param text متن پیام
     * @param schoolInfo اطلاعات مدرسه
     * @returns پاسخ چت بات
     */
    public async sendMessage(text: string, schoolInfo: SchoolInfo): Promise<ChatResponse> {
        try {
            // بررسی اتصال به اینترنت
            if (!navigator.onLine) {
                throw new Error('اتصال به اینترنت برقرار نیست');
            }

            // بررسی اعتبارسنجی ورودی
            if (!text.trim()) {
                throw new Error('متن پیام نمی‌تواند خالی باشد');
            }

            // تنظیم headers
            const headers = {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': this.token ? `Bearer ${this.token}` : ''
            };

            // تحلیل احساسات و منظور پیام
            const sentiment = await this.analyzeSentiment(text);
            const intent = await this.detectIntent(text);

            // ارسال درخواست به API با اطلاعات اضافی
            const response = await axios.post(
                `${this.baseUrl}/chat/send`,
                {
                    text,
                    schoolInfo,
                    timestamp: new Date().toISOString(),
                    metadata: {
                        language: 'fa',
                        platform: 'web',
                        sentiment,
                        intent: intent.intent,
                        confidence: intent.confidence,
                        context: {
                            lastMessages: this.conversationContext.lastMessages.slice(-5),
                            userPreferences: this.conversationContext.userPreferences
                        }
                    }
                },
                {
                    headers,
                    timeout: 10000,
                    validateStatus: (status) => status >= 200 && status < 300
                }
            );

            // بررسی پاسخ
            if (!response.data) {
                throw new Error('پاسخ نامعتبر از سرور');
            }

            // بررسی ساختار پاسخ
            if (response.status === 200 && response.data) {
                // ذخیره پیام در تاریخچه
                const message: ChatMessage = {
                    id: response.data.id || `msg-${Date.now()}`,
                    text: response.data.text,
                    sender: response.data.sender,
                    timestamp: new Date(response.data.timestamp),
                    type: response.data.type,
                    metadata: response.data.metadata || {
                        isRead: false,
                        status: 'sent'
                    }
                };

                // به‌روزرسانی تاریخچه مکالمه
                this.conversationContext.lastMessages.push(message);
                if (this.conversationContext.lastMessages.length > 10) {
                    this.conversationContext.lastMessages.shift();
                }
                this.saveConversationContext();

                // یادگیری از مکالمه
                await this.learnFromConversation(text, this.conversationContext);

                return {
                    status: 'success',
                    message,
                    conversationId: `conv-${Date.now()}`
                };
            } else {
                throw new Error('خطا در دریافت پاسخ');
            }
        } catch (error: any) {
            console.error('Error sending message:', error);
            
            // مدیریت خطاهای مختلف
            if (error.code === 'ECONNABORTED') {
                throw new Error('زمان پاسخگویی سرور به پایان رسید. لطفاً دوباره تلاش کنید.');
            }

            if (error.response) {
                switch (error.response.status) {
                    case 400:
                        throw new Error('درخواست نامعتبر است');
                    case 401:
                        throw new Error('لطفاً ابتدا وارد حساب کاربری خود شوید');
                    case 403:
                        throw new Error('شما دسترسی لازم برای این عملیات را ندارید');
                    case 404:
                        throw new Error('سرویس مورد نظر یافت نشد');
                    case 429:
                        throw new Error('تعداد درخواست‌های شما بیش از حد مجاز است. لطفاً کمی صبر کنید.');
                    case 500:
                        throw new Error('خطای داخلی سرور');
                    default:
                        throw new Error(error.response.data?.message || 'خطا در ارتباط با سرور');
                }
            }

            if (error.request) {
                throw new Error('سرور در دسترس نیست. لطفاً اتصال اینترنت خود را بررسی کنید.');
            }

            throw new Error('خطا در ارتباط با سرور. لطفاً دوباره تلاش کنید.');
        }
    }

    /**
     * دریافت تاریخچه مکالمات
     * @param userId شناسه کاربر
     * @returns لیست پیام‌ها
     */
    public async getConversationHistory(userId: string): Promise<ChatMessage[]> {
        try {
            // استفاده از localStorage برای ذخیره تاریخچه
            const history = localStorage.getItem(`chatHistory_${userId}`);
            if (history) {
                return JSON.parse(history);
            }
            return [];
        } catch (error) {
            console.error('Error getting conversation history:', error);
            return [];
        }
    }

    /**
     * ارسال پیام به پشتیبانی
     * @param text متن پیام
     * @param userId شناسه کاربر
     * @returns پاسخ پشتیبانی
     */
    public async sendSupportMessage(text: string, userId: string): Promise<ChatResponse> {
        try {
            const response = await axios.post(`${this.baseUrl}/api/chat/support`, {
                text,
                userId
            }, {
                headers: this.getHeaders(),
                timeout: 10000
            });
            return response.data;
        } catch (error) {
            console.error('Error sending support message:', error);
            throw error;
        }
    }

    public async getFAQResponse(question: string): Promise<ChatResponse> {
        try {
            const response = await axios.post(
                `${this.baseUrl}/api/chat/faq`,
                { question },
                { 
                    headers: this.getHeaders(),
                    timeout: 10000
                }
            );
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message || 'خطا در دریافت پاسخ سوالات متداول');
            }
            throw error;
        }
    }

    public updateUserPreferences(preferences: Partial<ConversationContext['userPreferences']>) {
        this.conversationContext.userPreferences = {
            ...this.conversationContext.userPreferences,
            ...preferences
        };
        this.saveConversationContext();
    }

    /**
     * دریافت لیست سوالات متداول
     * @returns لیست سوالات متداول
     */
    public async getFAQs(): Promise<FAQ[]> {
        try {
            const response = await axios.get(
                `${this.baseUrl}/api/faq`,
                { headers: this.getHeaders() }
            );
            return response.data.data;
        } catch (error) {
            console.error('خطا در دریافت سوالات متداول:', error);
            throw error;
        }
    }

    /**
     * دریافت سوالات متداول بر اساس دسته‌بندی
     * @param category دسته‌بندی مورد نظر
     * @returns لیست سوالات متداول
     */
    public async getFAQsByCategory(category: string): Promise<FAQ[]> {
        try {
            const response = await axios.get(
                `${this.baseUrl}/api/faq/category/${category}`,
                { headers: this.getHeaders() }
            );
            return response.data.data;
        } catch (error) {
            console.error('خطا در دریافت سوالات متداول بر اساس دسته‌بندی:', error);
            throw error;
        }
    }
}

// ایجاد و export کردن یک نمونه از ChatService
export const chatService = ChatService.getInstance(); 