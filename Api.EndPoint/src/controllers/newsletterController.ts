import { Request, Response } from 'express';
import Newsletter from '../models/Newsletter';
import { sendEmail } from '../utils/mailer';

export const subscribeToNewsletter = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'ایمیل الزامی است' });
    }

    // بررسی فرمت ایمیل با یک regex ساده
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: 'فرمت ایمیل نامعتبر است' });
    }

    // بررسی اینکه ایمیل قبلا ثبت شده یا نه
    const existingSubscription = await Newsletter.findOne({ email });
    if (existingSubscription) {
      // اگر قبلا ثبت شده ولی غیرفعال بوده، فعال کن
      if (!existingSubscription.active) {
        existingSubscription.active = true;
        await existingSubscription.save();
        return res.status(200).json({ 
          success: true, 
          message: 'اشتراک شما با موفقیت دوباره فعال شد'
        });
      }
      return res.status(400).json({ 
        success: false, 
        message: 'این ایمیل قبلا در خبرنامه ثبت شده است'
      });
    }

    // ایجاد رکورد جدید
    const newSubscription = new Newsletter({ email });
    await newSubscription.save();

    return res.status(201).json({
      success: true,
      message: 'ثبت نام شما در خبرنامه با موفقیت انجام شد',
    });
  } catch (error) {
    console.error('خطا در ثبت نام خبرنامه:', error);
    return res.status(500).json({
      success: false,
      message: 'خطایی در سیستم رخ داده است. لطفا بعدا تلاش کنید',
    });
  }
};

export const unsubscribeFromNewsletter = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'ایمیل الزامی است' });
    }

    const subscription = await Newsletter.findOne({ email });
    
    if (!subscription) {
      return res.status(404).json({ 
        success: false, 
        message: 'این ایمیل در سیستم خبرنامه یافت نشد' 
      });
    }

    subscription.active = false;
    await subscription.save();

    return res.status(200).json({
      success: true,
      message: 'شما با موفقیت از خبرنامه لغو اشتراک شدید',
    });
  } catch (error) {
    console.error('خطا در لغو اشتراک خبرنامه:', error);
    return res.status(500).json({
      success: false,
      message: 'خطایی در سیستم رخ داده است. لطفا بعدا تلاش کنید',
    });
  }
};

export const getSubscribers = async (req: Request, res: Response) => {
  try {
    let filter = {};
    if (!req.query.all || req.query.all === 'false') {
      filter = { active: true };
    }
    const subscribers = await Newsletter.find(filter).sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      data: subscribers,
    });
  } catch (error) {
    console.error('خطا در دریافت لیست مشترکین خبرنامه:', error);
    return res.status(500).json({
      success: false,
      message: 'خطایی در سیستم رخ داده است. لطفا بعدا تلاش کنید',
    });
  }
};

// دریافت همه خبرنامه‌ها
export const getNewsletters = async (req: Request, res: Response) => {
  try {
    const newsletters = await Newsletter.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      data: newsletters
    });
  } catch (error) {
    console.error('خطا در دریافت خبرنامه‌ها:', error);
    res.status(500).json({
      success: false,
      message: 'خطایی در سیستم رخ داده است'
    });
  }
};

// دریافت یک خبرنامه
export const getNewsletter = async (req: Request, res: Response) => {
  try {
    const newsletter = await Newsletter.findById(req.params.id);
    if (!newsletter) {
      return res.status(404).json({
        success: false,
        message: 'خبرنامه مورد نظر یافت نشد'
      });
    }
    res.json({
      success: true,
      data: newsletter
    });
  } catch (error) {
    console.error('خطا در دریافت خبرنامه:', error);
    res.status(500).json({
      success: false,
      message: 'خطایی در سیستم رخ داده است'
    });
  }
};

// ایجاد خبرنامه جدید
export const createNewsletter = async (req: Request, res: Response) => {
  try {
    const { title, subject, content } = req.body;

    if (!title || !subject || !content) {
      return res.status(400).json({
        success: false,
        message: 'تمام فیلدها الزامی هستند'
      });
    }

    const newsletter = new Newsletter({
      title,
      subject,
      content,
      sent: false
    });

    await newsletter.save();

    res.status(201).json({
      success: true,
      message: 'خبرنامه با موفقیت ایجاد شد',
      data: newsletter
    });
  } catch (error) {
    console.error('خطا در ایجاد خبرنامه:', error);
    res.status(500).json({
      success: false,
      message: 'خطایی در سیستم رخ داده است'
    });
  }
};

// به‌روزرسانی خبرنامه
export const updateNewsletter = async (req: Request, res: Response) => {
  try {
    const { title, subject, content } = req.body;

    if (!title || !subject || !content) {
      return res.status(400).json({
        success: false,
        message: 'تمام فیلدها الزامی هستند'
      });
    }

    const newsletter = await Newsletter.findByIdAndUpdate(
      req.params.id,
      {
        title,
        subject,
        content
      },
      { new: true, runValidators: true }
    );

    if (!newsletter) {
      return res.status(404).json({
        success: false,
        message: 'خبرنامه مورد نظر یافت نشد'
      });
    }

    res.json({
      success: true,
      message: 'خبرنامه با موفقیت به‌روزرسانی شد',
      data: newsletter
    });
  } catch (error) {
    console.error('خطا در به‌روزرسانی خبرنامه:', error);
    res.status(500).json({
      success: false,
      message: 'خطایی در سیستم رخ داده است'
    });
  }
};

// حذف خبرنامه
export const deleteNewsletter = async (req: Request, res: Response) => {
  try {
    const newsletter = await Newsletter.findByIdAndDelete(req.params.id);

    if (!newsletter) {
      return res.status(404).json({
        success: false,
        message: 'خبرنامه مورد نظر یافت نشد'
      });
    }

    res.json({
      success: true,
      message: 'خبرنامه با موفقیت حذف شد'
    });
  } catch (error) {
    console.error('خطا در حذف خبرنامه:', error);
    res.status(500).json({
      success: false,
      message: 'خطایی در سیستم رخ داده است'
    });
  }
};

// ارسال خبرنامه
export const sendNewsletter = async (req: Request, res: Response) => {
  try {
    // فقط ایمیل همه مشترکین فعال را بگیر
    const subscribers = await Newsletter.find({ active: true });
    if (!subscribers || subscribers.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'هیچ مشترک فعالی یافت نشد'
      });
    }

    // فرض: متن ایمیل و موضوع از بدنه درخواست دریافت می‌شود
    const { subject, html } = req.body;
    if (!subject || !html) {
      return res.status(400).json({
        success: false,
        message: 'موضوع و متن ایمیل الزامی است'
      });
    }

    // ارسال ایمیل به همه مشترکین
    let successCount = 0;
    let failCount = 0;
    for (const subscriber of subscribers) {
      try {
        await sendEmail(subscriber.email, subject, html);
        successCount++;
      } catch (error) {
        failCount++;
      }
    }

    res.json({
      success: true,
      message: `ایمیل برای ${successCount} مشترک ارسال شد. ${failCount > 0 ? failCount + ' ارسال ناموفق.' : ''}`
    });
  } catch (error) {
    console.error('خطا در ارسال خبرنامه:', error);
    res.status(500).json({
      success: false,
      message: 'خطایی در سیستم رخ داده است'
    });
  }
};

// حذف مشترک خبرنامه بر اساس id
export const deleteSubscriber = async (req: Request, res: Response) => {
  try {
    const subscriber = await Newsletter.findByIdAndDelete(req.params.id);
    if (!subscriber) {
      return res.status(404).json({
        success: false,
        message: 'مشترک مورد نظر یافت نشد'
      });
    }
    res.json({
      success: true,
      message: 'مشترک با موفقیت حذف شد'
    });
  } catch (error) {
    console.error('خطا در حذف مشترک خبرنامه:', error);
    res.status(500).json({
      success: false,
      message: 'خطایی در سیستم رخ داده است'
    });
  }
};

// غیرفعال کردن مشترک خبرنامه بر اساس id
export const deactivateSubscriber = async (req: Request, res: Response) => {
  try {
    const subscriber = await Newsletter.findById(req.params.id);
    if (!subscriber) {
      return res.status(404).json({
        success: false,
        message: 'مشترک مورد نظر یافت نشد'
      });
    }
    subscriber.active = false;
    await subscriber.save();
    res.json({
      success: true,
      message: 'مشترک با موفقیت غیرفعال شد'
    });
  } catch (error) {
    console.error('خطا در غیرفعال کردن مشترک خبرنامه:', error);
    res.status(500).json({
      success: false,
      message: 'خطایی در سیستم رخ داده است'
    });
  }
};

// فعال‌سازی مشترک خبرنامه بر اساس id
export const activateSubscriber = async (req: Request, res: Response) => {
  try {
    const subscriber = await Newsletter.findById(req.params.id);
    if (!subscriber) {
      return res.status(404).json({
        success: false,
        message: 'مشترک مورد نظر یافت نشد'
      });
    }
    subscriber.active = true;
    await subscriber.save();
    res.json({
      success: true,
      message: 'مشترک با موفقیت فعال شد'
    });
  } catch (error) {
    console.error('خطا در فعال‌سازی مشترک خبرنامه:', error);
    res.status(500).json({
      success: false,
      message: 'خطایی در سیستم رخ داده است'
    });
  }
}; 