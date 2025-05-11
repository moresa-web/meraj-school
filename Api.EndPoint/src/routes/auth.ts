import express from 'express';
import { authMiddleware, isAdmin } from '../middleware/auth.middleware';
import { 
  register, 
  login, 
  getProfile,
  updateProfile,
  changePassword,
  getUsers, 
  getUserById, 
  updateUser, 
  deleteUser,
  getUserStats,
  loginOrRegister
} from '../controllers/authController';

const router = express.Router();

// مسیرهای عمومی
router.post('/register', register);
router.post('/login', login);
router.post('/login-or-register', loginOrRegister);

// مسیرهای محافظت شده
router.get('/me', authMiddleware, getProfile);
router.put('/me', authMiddleware, updateProfile);
router.put('/change-password', authMiddleware, changePassword);

// مسیرهای ادمین
router.get('/users', authMiddleware, isAdmin, getUsers);
router.get('/users/:id', authMiddleware, isAdmin, getUserById);
router.put('/users/:id', authMiddleware, isAdmin, updateUser);
router.delete('/users/:id', authMiddleware, isAdmin, deleteUser);
router.get('/stats', authMiddleware, isAdmin, getUserStats);

export default router; 