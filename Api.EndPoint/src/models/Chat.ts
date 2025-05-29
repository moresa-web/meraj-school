import mongoose, { Schema, Document } from 'mongoose';

export interface IChat extends Document {
    userId: string;
    userName: string;
    adminId?: string;
    adminName?: string;
    status: 'open' | 'closed';
    lastMessage?: string;
    lastMessageTime?: Date;
    unreadCount: number;
    createdAt: Date;
    updatedAt: Date;
    closedAt?: Date;
}

const ChatSchema: Schema = new Schema({
    userId: { type: String, required: true, index: true },
    userName: { type: String, required: true },
    adminId: { type: String, index: true },
    adminName: { type: String },
    status: { type: String, enum: ['open', 'closed'], default: 'open', index: true },
    lastMessage: { type: String },
    lastMessageTime: { type: Date },
    unreadCount: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    closedAt: { type: Date }
}, {
    timestamps: true
});

export default mongoose.model<IChat>('Chat', ChatSchema); 