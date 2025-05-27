import { Schema, model, Document } from 'mongoose';

export interface IFAQ extends Document {
    question: string;
    answer: string;
    category: string;
    order: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const FAQSchema = new Schema<IFAQ>({
    question: {
        type: String,
        required: true,
        trim: true
    },
    answer: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: String,
        required: true,
        trim: true
    },
    order: {
        type: Number,
        default: 0
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

export const FAQ = model<IFAQ>('FAQ', FAQSchema); 