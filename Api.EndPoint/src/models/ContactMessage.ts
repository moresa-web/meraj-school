// models/ContactMessage.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IContactMessage extends Document {
    name: string;
    email: string;
    subject?: string;
    message: string;
    isRead: boolean;
    createdAt: Date;
}

const ContactMessageSchema: Schema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    subject: { type: String },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false }
}, {
    timestamps: true // برای createdAt و updatedAt
});

export const ContactMessage = mongoose.model<IContactMessage>('ContactMessage', ContactMessageSchema);
