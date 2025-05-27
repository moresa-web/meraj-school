import express from 'express';
import { faqController } from '../controllers/faqController';
import { authMiddleware } from '../middleware/auth.middleware';

const router = express.Router();

// مسیرهای عمومی
router.get('/', faqController.getAllActive);
router.get('/category/:category', faqController.getByCategory);

// مسیرهای محافظت شده
router.post('/', authMiddleware, faqController.create);
router.put('/:id', authMiddleware, faqController.update);
router.delete('/:id', authMiddleware, faqController.delete);

export default router; 