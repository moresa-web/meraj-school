import express from 'express';
import { sendMessage, getMessages, markAsRead } from '../controllers/contactController';

const router = express.Router();

router.post('/', sendMessage);
router.get('/', getMessages);
router.patch('/:id/read', markAsRead);

export default router;