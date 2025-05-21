import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

// تعریف interface برای کاربر
export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  role: 'admin' | 'user' | 'student' | 'parent';
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
    unique: true,
    trim: true,
    lowercase: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['admin', 'user', 'student', 'parent'],
    default: 'user'
  },
  fullName: {
    type: String,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  studentName: {
    type: String,
    required: function() {
      return this.role === 'student';
    },
    trim: true
  },
  studentPhone: {
    type: String,
    required: function() {
      return this.role === 'student';
    },
    sparse: true,
    unique: true
  },
  parentPhone: {
    type: String,
    required: function() {
      return this.role === 'student';
    },
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// رمزنگاری رمز عبور قبل از ذخیره
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// متد مقایسه رمز عبور
UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
};

// ایجاد مدل
export const User = mongoose.model<IUser>('User', UserSchema); 

// Remove password from JSON
UserSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.password;
  return obj;
}; 