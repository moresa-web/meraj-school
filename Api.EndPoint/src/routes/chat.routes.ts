import { Router } from 'express';
import { ChatController } from '../controllers/chat.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { rateLimitMiddleware } from '../middleware/rateLimitMiddleware';

const router = Router();
const chatController = new ChatController();

// مسیرهای عمومی (بدون احراز هویت)
router.get('/list/:userId', chatController.getUserChats.bind(chatController));
router.get('/messages/:chatId', chatController.getChatMessages.bind(chatController));
router.post('/create', chatController.createChat.bind(chatController));
router.post('/send', rateLimitMiddleware, chatController.sendMessage.bind(chatController));

// مسیرهای مربوط به چت (با احراز هویت)
router.post('/', authMiddleware, chatController.createChat.bind(chatController));
router.get('/user/:userId', authMiddleware, chatController.getUserChats.bind(chatController));
router.get('/open', authMiddleware, chatController.getOpenChats.bind(chatController));
router.post('/:chatId/messages', authMiddleware, chatController.sendMessage.bind(chatController));
router.get('/:chatId/messages', authMiddleware, chatController.getChatMessages.bind(chatController));
router.post('/:chatId/read', authMiddleware, chatController.markMessagesAsRead.bind(chatController));
router.post('/:chatId/close', authMiddleware, chatController.closeChat.bind(chatController));
router.post('/:chatId/reopen', authMiddleware, chatController.reopenChat.bind(chatController));
router.delete('/messages/:messageId', authMiddleware, chatController.deleteMessage.bind(chatController));

export default router; 