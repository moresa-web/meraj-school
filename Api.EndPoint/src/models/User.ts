import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

// تعریف interface برای کاربر
export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
  fullName?: string;
  phone?: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
  studentName: string;
  studentPhone: string;
  parentPhone: string;
}

// تعریف schema برای کاربر
const UserSchema = new Schema<IUser>({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user'
  },
  fullName: {
    type: String,
    trim: true
  },
  phone: {
    type: String,
    unique: true,
    sparse: true
  },
  studentName: {
    type: String,
    required: true,
    trim: true
  },
  studentPhone: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  parentPhone: {
    type: String,
    required: true,
    trim: true
  }
}, {
  timestamps: true
});

// رمزنگاری رمز عبور قبل از ذخیره
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password') || !this.password) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// متد مقایسه رمز عبور
UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

// ایجاد مدل
export const User = mongoose.model<IUser>('User', UserSchema); 