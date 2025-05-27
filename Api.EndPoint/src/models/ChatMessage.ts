import mongoose, { Schema, Document } from 'mongoose';

export interface IChatMessage extends Document {
    id: string;
    text: string;
    sender: 'user' | 'ai' | 'bot' | 'support';
    timestamp: Date;
    type: 'text' | 'image' | 'file';
    metadata: {
        isRead: boolean;
        status: 'sent' | 'delivered' | 'read';
    };
    userId?: mongoose.Types.ObjectId;
    conversationId?: string;
}

const ChatMessageSchema = new Schema({
    id: { type: String, required: true },
    text: { type: String, required: true },
    sender: { 
        type: String, 
        required: true,
        enum: ['user', 'ai', 'bot', 'support']
    },
    timestamp: { type: Date, default: Date.now },
    type: { 
        type: String, 
        required: true,
        enum: ['text', 'image', 'file']
    },
    metadata: {
        isRead: { type: Boolean, default: false },
        status: { 
            type: String, 
            enum: ['sent', 'delivered', 'read'],
            default: 'sent'
        }
    },
    userId: { 
        type: Schema.Types.ObjectId, 
        ref: 'User',
        required: false
    },
    conversationId: { type: String }
}, {
    timestamps: true
});

// ایندکس‌ها
ChatMessageSchema.index({ userId: 1, timestamp: -1 });
ChatMessageSchema.index({ conversationId: 1, timestamp: -1 });

export const ChatMessageModel = mongoose.model<IChatMessage>('ChatMessage', ChatMessageSchema); 