import axios from 'axios';

const testNewsletterSubscription = async () => {
  try {
    const response = await axios.post('http://localhost:5000/api/newsletter/subscribe', {
      email: 'test@moresa-web.ir'
    });
    console.log('ثبت نام در خبرنامه:', response.data);
  } catch (error) {
    console.error('خطا در ثبت نام خبرنامه:', error);
  }
};

// اجرای تست
testNewsletterSubscription(); 