import { Class } from '../models/Class';
import { SchoolInfo } from '../models/SchoolInfo';
import { AppError } from '../utils/AppError';

export class SchoolInfoService {
    private static instance: SchoolInfoService;

    private constructor() {}

    public static getInstance(): SchoolInfoService {
        if (!SchoolInfoService.instance) {
            SchoolInfoService.instance = new SchoolInfoService();
        }
        return SchoolInfoService.instance;
    }

    // دریافت اطلاعات مدرسه
    public async getSchoolInfo(): Promise<any> {
        try {
            const schoolInfo = await SchoolInfo.findOne();
            if (!schoolInfo) {
                throw AppError.notFound('اطلاعات مدرسه یافت نشد');
            }
            return schoolInfo;
        } catch (error) {
            throw error;
        }
    }

    // دریافت بهترین کلاس‌های تقویتی
    public async getBestReinforcementClasses(userId: string): Promise<any[]> {
        try {
            // دریافت کلاس‌های تقویتی با بالاترین امتیاز
            const classes = await Class.find({
                type: 'reinforcement',
                isActive: true
            })
            .sort({ rating: -1 })
            .limit(3);

            if (!classes.length) {
                throw AppError.notFound('کلاس تقویتی فعالی یافت نشد');
            }

            return classes;
        } catch (error) {
            throw error;
        }
    }

    // جستجوی کلاس بر اساس نیاز کاربر
    public async findSuitableClass(userId: string, subject: string, level: string): Promise<any | null> {
        try {
            const suitableClass = await Class.findOne({
                subject,
                level,
                isActive: true
            }).sort({ rating: -1 });

            return suitableClass;
        } catch (error) {
            throw error;
        }
    }
} 