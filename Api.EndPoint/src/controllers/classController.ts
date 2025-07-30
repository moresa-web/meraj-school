import { Request, Response } from 'express';
import { Class, IClass } from '../models/Class';
import path from 'path';
import fs from 'fs';
import { sendEmail } from '../utils/mailer';
import Newsletter from '../models/Newsletter';
import { getActiveTemplateByType, sendTemplatedEmail } from '../utils/emailTemplate';

// دریافت همه کلاس‌ها
export const getAllClasses = async (req: Request, res: Response) => {
  try {
    const { category, level, sortBy, search } = req.query;
    
    // ساخت فیلتر
    const filter: any = { isActive: true };
    if (category) filter.category = category;
    if (level) filter.level = level;
    if (search) {
      filter.$text = { $search: search as string };
    }

    // ساخت سورت
    let sort: any = { createdAt: -1 }; // پیش‌فرض: جدیدترین
    if (sortBy === 'newest') sort = { createdAt: -1 };
    if (sortBy === 'views') sort = { views: -1 };
    if (sortBy === 'likes') sort = { likes: -1 };
    if (sortBy === 'price-asc') sort = { price: 1 };
    if (sortBy === 'price-desc') sort = { price: -1 };

    const classes = await Class.find(filter).sort(sort);
    res.json(classes);
  } catch (error) {
    console.error('Error in getAllClasses:', error);
    res.status(500).json({ message: 'خطا در دریافت کلاس‌ها' });
  }
};

// دریافت همه کلاس‌ها برای ادمین
export const getAllClassesForAdmin = async (req: Request, res: Response) => {
  try {
    // بررسی دسترسی ادمین
    if (req.user?.role !== 'admin') {
      return res.status(403).json({ message: 'شما دسترسی لازم برای مشاهده این اطلاعات را ندارید' });
    }

    const { category, level, sortBy, search } = req.query;
    
    // ساخت فیلتر - برای ادمین همه کلاس‌ها را نشان می‌دهیم
    const filter: any = {};
    if (category) filter.category = category;
    if (level) filter.level = level;
    if (search) {
      filter.$text = { $search: search as string };
    }

    // ساخت سورت
    let sort: any = { createdAt: -1 }; // پیش‌فرض: جدیدترین
    if (sortBy === 'newest') sort = { createdAt: -1 };
    if (sortBy === 'views') sort = { views: -1 };
    if (sortBy === 'likes') sort = { likes: -1 };
    if (sortBy === 'price-asc') sort = { price: 1 };
    if (sortBy === 'price-desc') sort = { price: -1 };

    const classes = await Class.find(filter).sort(sort);
    res.json({
      success: true,
      data: classes
    });
  } catch (error) {
    console.error('Get all classes for admin error:', error);
    res.status(500).json({ 
      success: false,
      message: 'خطا در دریافت لیست کلاس‌ها' 
    });
  }
};

// دریافت یک کلاس با ID
export const getClassById = async (req: Request, res: Response) => {
  try {
    const classId = req.params.id;
    const classData = await Class.findById(classId);
    
    if (!classData) {
      return res.status(404).json({ message: 'کلاس مورد نظر یافت نشد' });
    }

    // افزایش تعداد بازدید
    classData.views += 1;
    await classData.save();

    const { _id, ...response } = classData.toObject() as IClass & { _id: { toString(): string } };
    const result = { ...response, id: _id.toString() };

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'خطا در دریافت اطلاعات کلاس' });
  }
};

// دریافت یک کلاس با slug
export const getClassBySlug = async (req: Request, res: Response) => {
  try {
    const slug = req.params.slug;
    const classData = await Class.findOne({ slug });
    
    if (!classData) {
      return res.status(404).json({ message: 'کلاس مورد نظر یافت نشد' });
    }

    // افزایش تعداد بازدید
    classData.views += 1;
    await classData.save();

    res.json(classData);
  } catch (error) {
    console.error('Error in getClassBySlug:', error);
    res.status(500).json({ message: 'خطا در دریافت اطلاعات کلاس' });
  }
};

// ایجاد کلاس جدید
export const createClass = async (req: Request, res: Response) => {
  try {
    const { title, teacher, schedule, description, price, level, category, capacity, startDate, endDate, isActive } = req.body;
    let image = '';

    if (req.file) {
      image = `/uploads/${req.file.filename}`;
    } else {
      return res.status(400).json({ message: 'تصویر کلاس الزامی است' });
    }

    const classData = new Class({
      title,
      teacher,
      schedule,
      description,
      price: Number(price),
      level,
      category,
      capacity: Number(capacity),
      startDate,
      endDate,
      isActive: isActive === 'true',
      image,
      views: 0,
      likes: 0,
      enrolledStudents: 0,
      likedBy: [],
      registrations: []
    });

    await classData.save();

    // ارسال ایمیل به مشترکین خبرنامه
    try {
      const subscribers = await Newsletter.find({ active: true });
      const template = await getActiveTemplateByType('new_class');

      if (template && subscribers.length > 0) {
        const variables = {
          title: classData.title,
          description: classData.description,
          teacher: classData.teacher,
          schedule: classData.schedule,
          capacity: classData.capacity,
          startDate: new Date(classData.startDate).toLocaleDateString('fa-IR'),
          endDate: new Date(classData.endDate).toLocaleDateString('fa-IR'),
          image: `${process.env.API_URL}${classData.image}`
        };

        for (const subscriber of subscribers) {
          await sendTemplatedEmail(template, subscriber.email, variables);
        }
      }
    } catch (error) {
      console.error('خطا در ارسال ایمیل به مشترکین:', error);
    }

    res.status(201).json(classData);
  } catch (error) {
    console.error('Error creating class:', error);
    res.status(400).json({ message: 'خطا در ایجاد کلاس', error });
  }
};

// بروزرسانی کلاس
export const updateClass = async (req: Request, res: Response) => {
  try {
    const { title, teacher, schedule, description, price, level, category, capacity, startDate, endDate, isActive } = req.body;
    const updateData: any = {
      title,
      teacher,
      schedule,
      description,
      price: Number(price),
      level,
      category,
      capacity: Number(capacity),
      startDate,
      endDate,
      isActive: isActive === 'true'
    };

    if (req.file) {
      // Delete old image if exists
      const classItem = await Class.findById(req.params.id);
      if (classItem?.image) {
        const oldImagePath = path.join(__dirname, '../../', classItem.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      updateData.image = `/uploads/${req.file.filename}`;
    }

    const updatedClass = await Class.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedClass) {
      return res.status(404).json({ message: 'کلاس مورد نظر یافت نشد' });
    }

    res.json(updatedClass);
  } catch (error) {
    console.error('Error updating class:', error);
    res.status(400).json({ message: 'خطا در بروزرسانی کلاس', error });
  }
};

// حذف کلاس
export const deleteClass = async (req: Request, res: Response) => {
  try {
    const classId = req.params.id;
    const classData = await Class.findByIdAndDelete(classId);

    if (!classData) {
      return res.status(404).json({ message: 'کلاس مورد نظر یافت نشد' });
    }

    res.json({ message: 'کلاس با موفقیت حذف شد' });
  } catch (error) {
    res.status(500).json({ message: 'خطا در حذف کلاس' });
  }
};

// افزایش/کاهش تعداد لایک
export const toggleLike = async (req: Request, res: Response) => {
  try {
    const userIP = req.ip || req.socket.remoteAddress || 'unknown';
    const classId = req.params.id;
    const classData = await Class.findById(classId);

    if (!classData) {
      return res.status(404).json({ message: 'کلاس مورد نظر یافت نشد' });
    }

    // بررسی وضعیت لایک کاربر
    const likedIndex = classData.likedBy.indexOf(userIP);
    
    if (likedIndex === -1) {
      // اگر کاربر قبلاً لایک نکرده بود
      classData.likedBy.push(userIP);
      classData.likes += 1;
    } else {
      // اگر کاربر قبلاً لایک کرده بود
      classData.likedBy.splice(likedIndex, 1);
      classData.likes -= 1;
    }

    await classData.save();
    res.json(classData);
  } catch (error) {
    console.error('Like error:', error);
    res.status(500).json({ message: 'خطا در ثبت لایک' });
  }
};

export const registerForClass = async (req: Request, res: Response) => {
  try {
    const { studentName, studentPhone, parentPhone } = req.body;
    const userIP = req.ip || req.socket.remoteAddress || 'unknown';

    // Validate required fields
    if (!studentName || !studentPhone || !parentPhone) {
      return res.status(400).json({ 
        message: 'لطفاً تمام فیلدهای ضروری را پر کنید',
        missingFields: {
          studentName: !studentName,
          studentPhone: !studentPhone,
          parentPhone: !parentPhone
        }
      });
    }

    // Validate phone numbers
    const phoneRegex = /^09\d{9}$/;
    if (!phoneRegex.test(studentPhone) || !phoneRegex.test(parentPhone)) {
      return res.status(400).json({ 
        message: 'شماره موبایل باید با ۰۹ شروع شود و ۱۱ رقم باشد',
        invalidFields: {
          studentPhone: !phoneRegex.test(studentPhone),
          parentPhone: !phoneRegex.test(parentPhone)
        }
      });
    }

    const classItem = await Class.findById(req.params.id);
    if (!classItem) {
      return res.status(404).json({ message: 'کلاس مورد نظر یافت نشد' });
    }

    if (!classItem.isActive) {
      return res.status(400).json({ message: 'این کلاس در حال حاضر فعال نیست' });
    }

    if (classItem.registrations && classItem.registrations.length >= classItem.capacity) {
      return res.status(400).json({ message: 'ظرفیت این کلاس تکمیل شده است' });
    }

    // Check if user is already registered
    const isAlreadyRegistered = classItem.registrations?.some(
      (reg: any) => reg.ip === userIP
    );

    if (isAlreadyRegistered) {
      return res.status(400).json({ message: 'شما قبلاً در این کلاس ثبت‌نام کرده‌اید' });
    }

    // Create registration object
    const registration = {
      studentName,
      studentPhone,
      parentPhone,
      registeredAt: new Date(),
      ip: userIP
    };

    // Add registration to class
    if (!classItem.registrations) {
      classItem.registrations = [];
    }
    classItem.registrations.push(registration);
    classItem.enrolledStudents = (classItem.registrations?.length || 0);

    await classItem.save();
    res.json({ 
      success: true, 
      message: 'ثبت‌نام با موفقیت انجام شد',
      registration: {
        studentName,
        registeredAt: registration.registeredAt
      }
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      message: 'خطا در ثبت‌نام',
      error: process.env.NODE_ENV === 'development' ? error?.message : undefined
    });
  }
};

export const checkRegistration = async (req: Request, res: Response) => {
  try {
    const userIP = req.ip || req.socket.remoteAddress || 'unknown';
    const classId = req.params.id;
    const classItem = await Class.findById(classId);

    if (!classItem) {
      return res.status(404).json({ message: 'کلاس مورد نظر یافت نشد' });
    }

    // Check if user is already registered
    const isAlreadyRegistered = classItem.registrations?.some(
      (reg: any) => reg.ip === userIP
    );

    res.json({ isRegistered: isAlreadyRegistered });
  } catch (error) {
    console.error('Check registration error:', error);
    res.status(500).json({ message: 'خطا در بررسی وضعیت ثبت‌نام' });
  }
};

export const unregisterFromClass = async (req: Request, res: Response) => {
  try {
    const userIP = req.ip || req.socket.remoteAddress || 'unknown';
    const classId = req.params.id;
    const classItem = await Class.findById(classId);

    if (!classItem) {
      return res.status(404).json({ message: 'کلاس مورد نظر یافت نشد' });
    }

    // پیدا کردن ثبت نام کاربر
    const registrationIndex = classItem.registrations?.findIndex(
      (reg: any) => reg.ip === userIP
    );

    if (registrationIndex === -1 || registrationIndex === undefined) {
      return res.status(400).json({ message: 'شما در این کلاس ثبت‌نام نکرده‌اید' });
    }

    // حذف ثبت نام
    classItem.registrations?.splice(registrationIndex, 1);
    classItem.enrolledStudents = (classItem.registrations?.length || 0);

    await classItem.save();
    res.json({ success: true, message: 'انصراف از کلاس با موفقیت انجام شد' });
  } catch (error) {
    console.error('Unregister error:', error);
    res.status(500).json({ message: 'خطا در انصراف از کلاس' });
  }
}; 

export const getClassStudents = async (req: Request, res: Response) => {
  try {
    const classId = req.params.id;
    const classItem = await Class.findById(classId);

    if (!classItem) {
      return res.status(404).json({ message: 'کلاس مورد نظر یافت نشد' });
    }

    // فقط ادمین می‌تواند لیست دانش‌آموزان را ببیند
    if (req.user?.role !== 'admin') {
      return res.status(403).json({ message: 'شما دسترسی لازم برای مشاهده این اطلاعات را ندارید' });
    }

    // برگرداندن لیست دانش‌آموزان
    res.json(classItem.registrations || []);
  } catch (error) {
    console.error('Get class students error:', error);
    res.status(500).json({ message: 'خطا در دریافت لیست دانش‌آموزان' });
  }
}; 