import express from 'express';
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
  loginOrRegister,
  createAdmin
} from '../controllers/authController';
import { auth } from '../middleware/auth';

const router = express.Router();

// مسیرهای عمومی
router.post('/register', register);
router.post('/login', login);
router.post('/login-or-register', loginOrRegister);
router.post('/create-admin', createAdmin); // مسیر جدید برای ایجاد کاربر ادمین

// مسیرهای محافظت شده
router.get('/profile', auth, getProfile);
router.put('/profile', auth, updateProfile);
router.put('/change-password', auth, changePassword);

// مسیرهای ادمین
router.get('/users', auth, getUsers);
router.get('/users/:id', auth, getUserById);
router.put('/users/:id', auth, updateUser);
router.delete('/users/:id', auth, deleteUser);
router.get('/stats', auth, getUserStats);

export default router; 