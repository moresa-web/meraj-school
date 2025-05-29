import mongoose, { Schema, Document } from 'mongoose';
import { logger } from '../utils/logger';

export interface IChatMessage extends Document {
    chatId: string;
    senderId: string;
    senderName: string;
    message: string;
    text: string;
    timestamp: Date;
    isRead: boolean;
    isDeleted: boolean;
    deletedAt?: Date;
    deletedBy?: string;
    fileUrl?: string;
    fileName?: string;
    fileType?: string;
    metadata?: {
        sentiment?: 'positive' | 'negative' | 'neutral';
        intent?: string;
        confidence?: number;
        isAI?: boolean;
    };
}

const ChatMessageSchema = new Schema({
    chatId: {
        type: String,
        required: [true, 'شناسه چت الزامی است'],
        index: true
    },
    senderId: {
        type: String,
        required: [true, 'شناسه فرستنده الزامی است'],
        index: true
    },
    senderName: {
        type: String,
        required: [true, 'نام فرستنده الزامی است']
    },
    message: {
        type: String,
        required: [true, 'متن پیام الزامی است'],
        trim: true,
        maxlength: [1000, 'طول پیام نمی‌تواند بیشتر از 1000 کاراکتر باشد']
    },
    text: {
        type: String,
        required: [true, 'متن پیام الزامی است'],
        trim: true,
        maxlength: [1000, 'طول پیام نمی‌تواند بیشتر از 1000 کاراکتر باشد']
    },
    timestamp: {
        type: Date,
        default: Date.now,
        required: true
    },
    isRead: {
        type: Boolean,
        default: false
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    deletedAt: {
        type: Date
    },
    deletedBy: {
        type: String
    },
    fileUrl: {
        type: String,
        validate: {
            validator: function(v: string) {
                return !v || v.startsWith('http');
            },
            message: 'آدرس فایل باید با http شروع شود'
        }
    },
    fileName: String,
    fileType: String,
    metadata: {
        sentiment: {
            type: String,
            enum: ['positive', 'negative', 'neutral']
        },
        intent: String,
        confidence: Number,
        isAI: Boolean
    }
}, {
    timestamps: true
});

// ایندکس‌ها
ChatMessageSchema.index({ chatId: 1, timestamp: -1 });
ChatMessageSchema.index({ senderId: 1, timestamp: -1 });
ChatMessageSchema.index({ isDeleted: 1 });

// متدهای استاتیک
ChatMessageSchema.statics.findByChatId = async function(chatId: string) {
    try {
        return await this.find({ chatId, isDeleted: false })
            .sort({ timestamp: -1 })
            .limit(50);
    } catch (error) {
        logger.error('Error in findByChatId:', error);
        throw error;
    }
};

// متدهای نمونه
ChatMessageSchema.methods.markAsRead = async function() {
    try {
        this.isRead = true;
        await this.save();
    } catch (error) {
        logger.error('Error in markAsRead:', error);
        throw error;
    }
};

ChatMessageSchema.methods.softDelete = async function(userId: string) {
    try {
        this.isDeleted = true;
        this.deletedAt = new Date();
        this.deletedBy = userId;
        await this.save();
    } catch (error) {
        logger.error('Error in softDelete:', error);
        throw error;
    }
};

// میدلورها
ChatMessageSchema.pre('save', function(next) {
    if (this.isModified('message')) {
        this.text = this.message; // همگام‌سازی text با message
    }
    next();
});

export const ChatMessageModel = mongoose.model<IChatMessage>('ChatMessage', ChatMessageSchema); 