import mongoose from 'mongoose';
import { Content } from '../models/Content';

async function resetIndexes() {
  try {
    // اتصال به دیتابیس
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/meraj-school');
    console.log('Connected to MongoDB');

    // حذف تمام ایندکس‌های موجود
    await Content.collection.dropIndexes();
    console.log('Dropped all indexes');

    // ایجاد ایندکس جدید
    await Content.collection.createIndex({ page: 1, section: 1 }, { unique: true });
    console.log('Created new compound index');

    console.log('Index reset completed successfully');
  } catch (error) {
    console.error('Error resetting indexes:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

resetIndexes(); 