import mongoose from 'mongoose';
import News from '../models/News';
import slugify from 'slugify';

const updateNewsSlugs = async () => {
  try {
    // اتصال به دیتابیس
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/meraj');

    // دریافت تمام اخبار
    const news = await News.find({});
    console.log(`Found ${news.length} news items to update`);

    // به‌روزرسانی slug برای هر خبر
    for (const item of news) {
      const slug = slugify(item.title, {
        lower: true,
        strict: true,
        locale: 'fa'
      });

      // بررسی تکراری نبودن slug
      let uniqueSlug = slug;
      let counter = 1;
      while (await News.findOne({ slug: uniqueSlug, _id: { $ne: item._id } })) {
        uniqueSlug = `${slug}-${counter}`;
        counter++;
      }

      // به‌روزرسانی خبر با slug جدید
      await News.findByIdAndUpdate(item._id, { slug: uniqueSlug });
      console.log(`Updated slug for news: ${item.title} -> ${uniqueSlug}`);
    }

    console.log('All news slugs have been updated successfully');
  } catch (error) {
    console.error('Error updating news slugs:', error);
  } finally {
    // بستن اتصال به دیتابیس
    await mongoose.disconnect();
  }
};

// اجرای اسکریپت
updateNewsSlugs(); 