import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User } from '../models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// ثبت‌نام کاربر جدید
export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password, studentName, studentPhone, parentPhone } = req.body;

    // بررسی وجود کاربر
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'کاربری با این ایمیل یا نام کاربری قبلاً ثبت‌نام کرده است' });
    }

    // ایجاد کاربر جدید
    const user = new User({
      username,
      email,
      password,
      studentName,
      studentPhone,
      parentPhone
    });

    await user.save();

    // ایجاد توکن
    const token = jwt.sign(
      { _id: user._id, username: user.username, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({ token, user: { ...user.toJSON(), password: undefined } });
  } catch (error) {
    res.status(500).json({ message: 'خطا در ثبت‌نام' });
  }
};

// ورود کاربر
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt:', { email }); // لاگ درخواست

    // پیدا کردن کاربر
    const user = await User.findOne({ email });
    console.log('User found:', user ? 'Yes' : 'No'); // لاگ نتیجه جستجوی کاربر

    if (!user) {
      console.log('Login failed: User not found'); // لاگ خطای عدم وجود کاربر
      return res.status(401).json({ message: 'ایمیل یا رمز عبور اشتباه است' });
    }

    // بررسی رمز عبور
    const isMatch = await user.comparePassword(password);
    console.log('Password match:', isMatch ? 'Yes' : 'No'); // لاگ نتیجه بررسی رمز عبور

    if (!isMatch) {
      console.log('Login failed: Incorrect password'); // لاگ خطای رمز عبور اشتباه
      return res.status(401).json({ message: 'ایمیل یا رمز عبور اشتباه است' });
    }

    // ایجاد توکن
    const token = jwt.sign(
      { _id: user._id, username: user.username, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    console.log('Login successful'); // لاگ موفقیت‌آمیز بودن لاگین
    res.json({ token, user: { ...user.toJSON(), password: undefined } });
  } catch (error) {
    console.error('Login error:', error); // لاگ خطای کلی
    res.status(500).json({ message: 'خطا در ورود' });
  }
};

// دریافت پروفایل کاربر
export const getProfile = async (req: Request, res: Response) => {
  try {
    console.log('Get profile request:', req.user);
    const user = await User.findById(req.user?._id).select('-password');
    console.log('Found user:', user);
    
    if (!user) {
      return res.status(404).json({ message: 'کاربر یافت نشد' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error in getProfile:', error);
    res.status(500).json({ message: 'خطا در دریافت پروفایل' });
  }
};

// بروزرسانی پروفایل کاربر
export const updateProfile = async (req: Request, res: Response) => {
  try {
    const updates = req.body;
    delete updates.password; // جلوگیری از تغییر رمز عبور از این مسیر

    const user = await User.findByIdAndUpdate(
      req.user?._id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'کاربر یافت نشد' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'خطا در بروزرسانی پروفایل' });
  }
};

// تغییر رمز عبور
export const changePassword = async (req: Request, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user?._id);

    if (!user) {
      return res.status(404).json({ message: 'کاربر یافت نشد' });
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ message: 'رمز عبور فعلی اشتباه است' });
    }

    user.password = newPassword;
    await user.save();

    res.json({ message: 'رمز عبور با موفقیت تغییر کرد' });
  } catch (error) {
    res.status(500).json({ message: 'خطا در تغییر رمز عبور' });
  }
};

// دریافت لیست کاربران (فقط ادمین)
export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'خطا در دریافت لیست کاربران' });
  }
};

// دریافت اطلاعات یک کاربر
export const getUserById = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'کاربر یافت نشد' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'خطا در دریافت اطلاعات کاربر' });
  }
};

// بروزرسانی اطلاعات کاربر (فقط ادمین)
export const updateUser = async (req: Request, res: Response) => {
  try {
    const updates = req.body;
    delete updates.password; // جلوگیری از تغییر رمز عبور از این مسیر

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'کاربر یافت نشد' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'خطا در بروزرسانی اطلاعات کاربر' });
  }
};

// حذف کاربر (فقط ادمین)
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'کاربر یافت نشد' });
    }
    res.json({ message: 'کاربر با موفقیت حذف شد' });
  } catch (error) {
    res.status(500).json({ message: 'خطا در حذف کاربر' });
  }
};

// دریافت آمار کاربران (فقط ادمین)
export const getUserStats = async (req: Request, res: Response) => {
  try {
    const totalUsers = await User.countDocuments();
    const adminUsers = await User.countDocuments({ role: 'admin' });
    const regularUsers = await User.countDocuments({ role: 'user' });

    res.json({
      total: totalUsers,
      admins: adminUsers,
      regular: regularUsers
    });
  } catch (error) {
    res.status(500).json({ message: 'خطا در دریافت آمار کاربران' });
  }
};

export const loginOrRegister = async (req: Request, res: Response) => {
  try {
    const { studentName, studentPhone, parentPhone } = req.body;

    // Check if user exists
    let user = await User.findOne({ studentPhone });

    if (user) {
      // User exists, generate token
      const token = jwt.sign(
        { userId: user._id },
        JWT_SECRET,
        { expiresIn: '30d' }
      );

      return res.status(200).json({
        success: true,
        message: 'ورود موفقیت‌آمیز',
        token,
        user: {
          id: user._id,
          studentName: user.studentName,
          studentPhone: user.studentPhone
        }
      });
    }

    // User doesn't exist, create new user
    user = await User.create({
      studentName,
      studentPhone,
      parentPhone
    });

    // Generate token for new user
    const token = jwt.sign(
      { userId: user._id },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.status(201).json({
      success: true,
      message: 'ثبت‌نام موفقیت‌آمیز',
      token,
      user: {
        id: user._id,
        studentName: user.studentName,
        studentPhone: user.studentPhone
      }
    });
  } catch (error) {
    console.error('Error in loginOrRegister:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در ورود یا ثبت‌نام'
    });
  }
}; 

// ایجاد کاربر ادمین
export const createAdmin = async (req: Request, res: Response) => {
  try {
    const { email, password, username, studentName, studentPhone, parentPhone } = req.body;

    // بررسی وجود کاربر
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'کاربری با این ایمیل یا نام کاربری قبلاً ثبت‌نام کرده است' });
    }

    // ایجاد کاربر ادمین
    const user = new User({
      username,
      email,
      password,
      role: 'admin',
      studentName,
      studentPhone,
      parentPhone
    });

    await user.save();

    res.status(201).json({ message: 'کاربر ادمین با موفقیت ایجاد شد' });
  } catch (error) {
    console.error('Create admin error:', error);
    res.status(500).json({ message: 'خطا در ایجاد کاربر ادمین' });
  }
}; 