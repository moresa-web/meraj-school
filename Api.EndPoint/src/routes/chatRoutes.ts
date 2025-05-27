import { Router } from 'express';
import { ChatController } from '../controllers/chatController';
import { authMiddleware } from '../middleware/authMiddleware';
import { rateLimitMiddleware } from '../middleware/rateLimitMiddleware';

const router = Router();
const chatController = ChatController.getInstance();

// مسیرهای عمومی
router.post('/analyze-sentiment', rateLimitMiddleware, chatController.analyzeSentiment.bind(chatController));
router.post('/detect-intent', rateLimitMiddleware, chatController.detectIntent.bind(chatController));
router.post('/send', rateLimitMiddleware, chatController.sendMessage.bind(chatController));

// مسیرهای نیازمند احراز هویت
router.post('/learn', authMiddleware, rateLimitMiddleware, chatController.learnFromConversation.bind(chatController));

// مسیر تولید پیشنهادات
router.post('/suggestions', authMiddleware, chatController.generateSuggestions.bind(chatController));

// مسیر دریافت پاسخ سوالات متداول
router.post('/faq', authMiddleware, chatController.getFAQResponse.bind(chatController));

// مسیر دریافت تاریخچه مکالمات
router.get('/history', authMiddleware, chatController.getConversationHistory.bind(chatController));

// مسیر ارسال پیام به پشتیبانی
router.post('/support', authMiddleware, chatController.sendSupportMessage.bind(chatController));

export default router; 