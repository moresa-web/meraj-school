import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// دریافت لیست کاربران
router.get('/', authenticateToken, async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'خطا در دریافت لیست کاربران' });
  }
});

// دریافت اطلاعات یک کاربر
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    if (!user) {
      return res.status(404).json({ error: 'کاربر یافت نشد' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'خطا در دریافت اطلاعات کاربر' });
  }
});

// ایجاد کاربر جدید
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password, // در حالت واقعی باید رمزنگاری شود
        role: role || 'USER',
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: 'خطا در ایجاد کاربر' });
  }
});

// ویرایش کاربر
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { name, email, role } = req.body;
    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: {
        name,
        email,
        role,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'خطا در ویرایش کاربر' });
  }
});

// حذف کاربر
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    await prisma.user.delete({
      where: { id: req.params.id },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'خطا در حذف کاربر' });
  }
});

export default router; 