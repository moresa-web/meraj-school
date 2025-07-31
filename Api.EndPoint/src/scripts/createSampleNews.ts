import axios from 'axios';

const API_URL = 'http://localhost:5000';

const sampleNews = [
  {
    title: 'افتتاح آزمایشگاه جدید علوم تجربی',
    description: 'آزمایشگاه مجهز به جدیدترین تجهیزات علمی برای دانش‌آموزان دبیرستان معراج افتتاح شد.',
    content: `آزمایشگاه مجهز به جدیدترین تجهیزات علمی برای دانش‌آموزان دبیرستان معراج افتتاح شد.

این آزمایشگاه با سرمایه‌گذاری قابل توجه مدرسه و با استفاده از جدیدترین تکنولوژی‌های روز دنیا ساخته شده است. تجهیزات موجود در این آزمایشگاه شامل:

• میکروسکوپ‌های دیجیتال پیشرفته
• دستگاه‌های اندازه‌گیری دقیق
• کیت‌های آزمایشگاهی کامل
• سیستم‌های کامپیوتری مجهز

دانش‌آموزان می‌توانند از این امکانات برای انجام آزمایش‌های مختلف در دروس فیزیک، شیمی و زیست‌شناسی استفاده کنند.`,
    category: 'اخبار مدرسه',
    tags: ['آموزشی', 'علمی', 'آزمایشگاه'],
    isPublished: 'true',
    slug: 'opening-new-science-lab'
  },
  {
    title: 'قهرمانی تیم فوتبال در مسابقات منطقه‌ای',
    description: 'تیم فوتبال دبیرستان معراج با پیروزی در فینال مسابقات منطقه‌ای، عنوان قهرمانی را کسب کرد.',
    content: `تیم فوتبال دبیرستان معراج با پیروزی در فینال مسابقات منطقه‌ای، عنوان قهرمانی را کسب کرد.

این تیم که تحت هدایت مربی مجرب و با تلاش بی‌وقفه دانش‌آموزان تشکیل شده بود، در تمام مراحل مسابقات عملکردی درخشان از خود نشان داد. در فینال که در ورزشگاه اصلی شهر برگزار شد، تیم ما با نتیجه 3-1 حریف خود را شکست داد.

نکات برجسته این قهرمانی:
• عملکرد تیمی عالی
• روحیه ورزشکاری بالا
• حمایت بی‌نظیر خانواده‌ها و معلمان
• آمادگی جسمانی و تکنیکی مناسب`,
    category: 'افتخارات',
    tags: ['ورزشی', 'افتخارات', 'فوتبال'],
    isPublished: 'true',
    slug: 'football-team-championship'
  },
  {
    title: 'برگزاری مسابقه کتابخوانی مدرسه‌ای',
    description: 'مسابقه کتابخوانی سالانه مدرسه با حضور گسترده دانش‌آموزان و با هدف ترویج فرهنگ مطالعه برگزار شد.',
    content: `مسابقه کتابخوانی سالانه مدرسه با حضور گسترده دانش‌آموزان برگزار شد.

این مسابقه که با هدف ترویج فرهنگ مطالعه و کتابخوانی برگزار می‌شود، امسال با استقبال بی‌نظیر دانش‌آموزان مواجه شد. بیش از 200 دانش‌آموز در این مسابقه شرکت کردند و کتاب‌های مختلفی را مطالعه و نقد کردند.

مراحل مسابقه:
• مرحله اول: مطالعه کتاب‌های انتخابی
• مرحله دوم: ارائه خلاصه و نقد
• مرحله سوم: مسابقه حضوری
• مرحله نهایی: اعلام برندگان`,
    category: 'فرهنگی',
    tags: ['فرهنگی', 'آموزشی', 'کتابخوانی'],
    isPublished: 'true',
    slug: 'school-reading-competition'
  }
];

const createSampleNews = async () => {
  try {
    console.log('Creating sample news items...');
    
    for (const news of sampleNews) {
      try {
        // Create FormData for file upload
        const formData = new FormData();
        formData.append('title', news.title);
        formData.append('description', news.description);
        formData.append('content', news.content);
        formData.append('category', news.category);
        formData.append('tags', JSON.stringify(news.tags));
        formData.append('isPublished', news.isPublished);
        formData.append('slug', news.slug);
        
        // Add a dummy image file (you can replace this with a real image)
        const dummyImage = new Blob([''], { type: 'image/jpeg' });
        formData.append('image', dummyImage, 'sample-news.jpg');
        
        const response = await axios.post(`${API_URL}/api/news`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': 'Bearer YOUR_ADMIN_TOKEN' // You'll need to replace this with a real admin token
          }
        });
        
        console.log(`Created news: ${news.title}`);
      } catch (error) {
        console.error(`Error creating news "${news.title}":`, (error as any).response?.data || (error as any).message);
      }
    }
    
    console.log('Sample news creation completed');
  } catch (error) {
    console.error('Error:', error);
  }
};

createSampleNews(); 