import { Router } from 'express';
import { ChatController } from '../controllers/chat.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { rateLimitMiddleware } from '../middleware/rateLimitMiddleware';

const router = Router();
const chatController = new ChatController();

// مسیرهای عمومی
router.post('/send', rateLimitMiddleware, chatController.sendMessage.bind(chatController));

export default router; 