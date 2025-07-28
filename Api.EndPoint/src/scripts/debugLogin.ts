import mongoose from 'mongoose';
import { User } from '../models/User';
import bcrypt from 'bcryptjs';

async function debugLogin() {
  try {
    // Try connecting to the correct database
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/meraj-school';
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to database:', MONGODB_URI);

    // Get all users
    const users = await User.find({}).select('+password');
    console.log(`Found ${users.length} users in database`);

    users.forEach((user, index) => {
      console.log(`\n=== User ${index + 1} ===`);
      console.log(`ID: ${user._id}`);
      console.log(`Email: ${user.email}`);
      console.log(`Username: ${user.username}`);
      console.log(`Full Name: ${user.fullName}`);
      console.log(`Phone: ${user.phone}`);
      console.log(`Role: ${user.role}`);
      console.log(`Password: ${user.password}`);
      console.log(`Password starts with $2a$: ${user.password.startsWith('$2a$')}`);
      console.log(`Password length: ${user.password.length}`);
    });

    // Test login with the specific user ID
    const testUserId = '688755032be68df5fd5c8430';
    const testEmail = 'info@moresa-web.ir';
    const testPassword = 'M0resa';
    
    console.log(`\n=== Testing Login with Specific User ===`);
    console.log(`User ID: ${testUserId}`);
    console.log(`Email: ${testEmail}`);
    console.log(`Password: ${testPassword}`);
    
    // Try to find by ID first
    const userById = await User.findById(testUserId).select('+password');
    if (userById) {
      console.log('✅ User found by ID');
      console.log(`User password in DB: ${userById.password}`);
      
      // Test password comparison
      const isMatch = await userById.comparePassword(testPassword);
      console.log(`Password match: ${isMatch ? '✅ YES' : '❌ NO'}`);
      
      // Test with bcrypt directly
      const directMatch = await bcrypt.compare(testPassword, userById.password);
      console.log(`Direct bcrypt match: ${directMatch ? '✅ YES' : '❌ NO'}`);
    } else {
      console.log('❌ User not found by ID');
    }
    
    // Also try by email
    const userByEmail = await User.findOne({ email: testEmail }).select('+password');
    if (userByEmail) {
      console.log('\n✅ User found by email');
      console.log(`User ID: ${userByEmail._id}`);
      console.log(`User password in DB: ${userByEmail.password}`);
      
      // Test password comparison
      const isMatch = await userByEmail.comparePassword(testPassword);
      console.log(`Password match: ${isMatch ? '✅ YES' : '❌ NO'}`);
      
      // Test with bcrypt directly
      const directMatch = await bcrypt.compare(testPassword, userByEmail.password);
      console.log(`Direct bcrypt match: ${directMatch ? '✅ YES' : '❌ NO'}`);
    } else {
      console.log('\n❌ User not found by email');
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from database');
  }
}

debugLogin(); 