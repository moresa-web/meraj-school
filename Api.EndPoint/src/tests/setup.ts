import mongoose from 'mongoose';

// تنظیمات قبل از اجرای تست‌ها
beforeAll(async () => {
    // اتصال به دیتابیس تست
    await mongoose.connect(process.env.MONGODB_TEST_URI || 'mongodb://localhost:27017/meraj-test');
});

// پاکسازی بعد از هر تست
afterEach(async () => {
    if (mongoose.connection.db) {
        const collections = await mongoose.connection.db.collections();
        for (const collection of collections) {
            await collection.deleteMany({});
        }
    }
});

// قطع اتصال بعد از اتمام تست‌ها
afterAll(async () => {
    await mongoose.connection.close();
});

// تنظیم timeout برای تست‌ها
jest.setTimeout(30000); 