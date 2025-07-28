import mongoose from 'mongoose';
import { seedDatabase } from '../seed/seedDatabase';
import { config } from '../config';

const runSeed = async () => {
  try {
    // اتصال به دیتابیس
    await mongoose.connect(config.database.url);
    console.log('اتصال به دیتابیس برقرار شد.');

    // اجرای seed
    await seedDatabase();

    console.log('عملیات seed با موفقیت انجام شد.');
    process.exit(0);
  } catch (error) {
    console.error('خطا در اجرای seed:', error);
    process.exit(1);
  }
};

runSeed(); 