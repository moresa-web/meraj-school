import { Request, Response } from 'express';
import Newsletter from '../models/Newsletter';

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
    const subscribers = await Newsletter.find({ active: true }).sort({ subscribedAt: -1 });
    
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