import mongoose from 'mongoose';
import SEO from '../models/SEO';
import dotenv from 'dotenv';

dotenv.config();

const updateSEO = async () => {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/meraj-school';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    // Find existing SEO data
    let seoData = await SEO.findOne();
    
    if (seoData) {
      // Update existing SEO data with correct logo
      seoData.image = '/uploads/1753700617990-616076321.png';
      await seoData.save();
      console.log('Updated existing SEO data with new logo path');
    } else {
      // Create new SEO data
      const newSEOData = new SEO({
        title: 'دبیرستان معراج - مرکز آموزش و پرورش با کیفیت',
        description: 'دبیرستان معراج - مرکز آموزش و پرورش با کیفیت و استانداردهای جهانی. ارائه خدمات آموزشی برتر با کادر مجرب و امکانات مدرن.',
        keywords: ['دبیرستان', 'معراج', 'آموزش', 'پرورش', 'مدرسه', 'دانش‌آموز', 'کلاس', 'تقویتی'],
        image: '/uploads/1753700617990-616076321.png',
        siteUrl: 'https://merajschool.ir',
        schoolName: 'دبیرستان معراج',
        address: 'بلوار دانش آموز، دانش آموز 10',
        phone: '051-38932030',
        email: 'info@merajschool.ir',
        socialMedia: {
          instagram: 'https://www.instagram.com/merajschool/',
          twitter: '@MerajSchoolIR'
        }
      });
      await newSEOData.save();
      console.log('Created new SEO data with logo path');
    }

    console.log('SEO update completed successfully');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

// Run the function
updateSEO(); 