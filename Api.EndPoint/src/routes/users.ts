import express from 'express';
import { User, IUser } from '../models/User';
import { authMiddleware as auth } from '../middleware/auth.middleware';

const router = express.Router();

// دریافت لیست کاربران
router.get('/', auth, async (req, res) => {
  try {
    const users = await User.find({}, {
      password: 0
    }).sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'خطا در دریافت لیست کاربران' });
  }
});

// دریافت اطلاعات یک کاربر
router.get('/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id, { password: 0 });
    if (!user) {
      return res.status(404).json({ error: 'کاربر یافت نشد' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'خطا در دریافت اطلاعات کاربر' });
  }
});

// ایجاد کاربر جدید
router.post('/', auth, async (req, res) => {
  try {
    let { username, email, password, role, fullName, phone, studentName, studentPhone, parentPhone } = req.body;
    if (!username) username = email;
    if (role === 'student') {
      studentName = fullName;
      if (!studentPhone && !parentPhone) {
        return res.status(400).json({ error: 'حداقل یکی از شماره‌های دانش‌آموز یا والد الزامی است' });
      }
      if (!phone) {
        phone = studentPhone || parentPhone;
      }
    }
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ error: 'کاربری با این ایمیل یا نام کاربری قبلاً ثبت شده است' });
    }
    const user = new User({
      username,
      email,
      password,
      role: role || 'user',
      fullName,
      phone,
      studentName,
      studentPhone,
      parentPhone
    });
    await user.save();
    const { password: _, ...userWithoutPassword } = user.toObject();
    res.status(201).json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ error: 'خطا در ایجاد کاربر' });
  }
});

// ویرایش کاربر
router.put('/:id', auth, async (req, res) => {
  try {
    const { name, email, role, fullName, phone, studentName, studentPhone, parentPhone } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          name,
          email,
          role,
          fullName,
          phone,
          studentName,
          studentPhone,
          parentPhone
        }
      },
      { new: true, projection: { password: 0 } }
    );
    if (!user) {
      return res.status(404).json({ error: 'کاربر یافت نشد' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'خطا در ویرایش کاربر' });
  }
});

// حذف کاربر
router.delete('/:id', auth, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'کاربر یافت نشد' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'خطا در حذف کاربر' });
  }
});

export default router; 