import mongoose from 'mongoose';
import SEO from '../models/SEO';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/meraj-school';

async function resetSEO() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Delete all existing SEO documents
    await SEO.deleteMany({});
    console.log('Deleted all existing SEO documents');

    // Create a new SEO document with the correct schema
    const newSeo = await SEO.create({
      title: 'معراج مدرسه فردا',
      description: 'دبیرستان معراج با بیش از 20 سال سابقه درخشان در زمینه آموزش و پرورش، همواره در تلاش بوده است تا با بهره‌گیری از اساتید مجرب و امکانات آموزشی پیشرفته، محیطی مناسب برای رشد و شکوفایی استعدادهای دانش‌آموزان فراهم کند.',
      keywords: ['دبیرستان پسرانه معراج', 'کلاس تقویتی', 'ثبت‌نام آنلاین', 'اخبار مدرسه', 'مشهد', 'آموزش'],
      image: '',
      siteUrl: 'https://merajfutureschool.ir',
      schoolName: 'معراج',
      address: 'مشهد، بلوار دانش‌آموز، آموزش 9 (محله‌ی دانشجو)',
      phone: '05138932030',
      email: 'info@merajfutureschool.ir',
      socialMedia: {
        instagram: '',
        twitter: ''
      }
    });

    console.log('Created new SEO document:', newSeo._id);
    console.log('Migration completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run migration if this file is executed directly
if (require.main === module) {
  resetSEO();
}

export default resetSEO;