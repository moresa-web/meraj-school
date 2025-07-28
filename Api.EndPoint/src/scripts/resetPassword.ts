import mongoose from 'mongoose';
import { User } from '../models/User';
import bcrypt from 'bcryptjs';

async function resetPassword() {
  try {
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/meraj-school';
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to database:', MONGODB_URI);

    const email = 'info@moresa-web.ir';
    const newPassword = 'M0resa';
    
    console.log(`Resetting password for user: ${email}`);
    console.log(`New password: ${newPassword}`);
    
    // Find user
    const user = await User.findOne({ email });
    
    if (!user) {
      console.log('❌ User not found');
      return;
    }
    
    console.log('✅ User found');
    console.log(`Old password hash: ${user.password}`);
    
    // Reset password
    user.password = newPassword;
    await user.save();
    
    console.log('✅ Password reset successfully');
    console.log(`New password hash: ${user.password}`);
    
    // Test the new password
    const isMatch = await user.comparePassword(newPassword);
    console.log(`Password test: ${isMatch ? '✅ SUCCESS' : '❌ FAILED'}`);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from database');
  }
}

resetPassword(); 