import mongoose, { Document, Schema } from 'mongoose';

export interface ISchoolInfo extends Document {
    name: string;
    address: string;
    phone: string;
    email: string;
    website: string;
    description: string;
    workingHours: string;
    socialMedia: {
        instagram?: string;
        telegram?: string;
        whatsapp?: string;
    };
    updatedAt: Date;
}

const SchoolInfoSchema = new Schema({
    name: {
        type: String,
        required: [true, 'نام مدرسه الزامی است'],
        trim: true
    },
    address: {
        type: String,
        required: [true, 'آدرس مدرسه الزامی است'],
        trim: true
    },
    phone: {
        type: String,
        required: [true, 'شماره تماس مدرسه الزامی است'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'ایمیل مدرسه الزامی است'],
        trim: true,
        lowercase: true
    },
    website: {
        type: String,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    workingHours: {
        type: String,
        required: [true, 'ساعات کاری مدرسه الزامی است'],
        trim: true
    },
    socialMedia: {
        instagram: String,
        telegram: String,
        whatsapp: String
    }
}, {
    timestamps: true
});

export const SchoolInfo = mongoose.model<ISchoolInfo>('SchoolInfo', SchoolInfoSchema); 