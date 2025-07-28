import mongoose from 'mongoose';
import { User } from '../models/User';
import bcrypt from 'bcryptjs';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/meraj-school';

async function checkUsers() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const users = await User.find({}).select('+password');
    console.log(`Found ${users.length} users:`);

    users.forEach((user, index) => {
      console.log(`\nUser ${index + 1}:`);
      console.log(`- Email: ${user.email}`);
      console.log(`- Username: ${user.username}`);
      console.log(`- Full Name: ${user.fullName}`);
      console.log(`- Phone: ${user.phone}`);
      console.log(`- Role: ${user.role}`);
      console.log(`- Password (hashed): ${user.password}`);
      console.log(`- Password length: ${user.password.length}`);
      console.log(`- Is password hashed: ${user.password.startsWith('$2b$') || user.password.startsWith('$2a$')}`);
      
      if (user.role === 'student') {
        console.log(`- Student Name: ${user.studentName}`);
        console.log(`- Student Phone: ${user.studentPhone}`);
        console.log(`- Parent Phone: ${user.parentPhone}`);
      }
    });

    // Test password comparison
    if (users.length > 0) {
      const testUser = users[0];
      console.log(`\nTesting password comparison for user: ${testUser.email}`);
      
      // Test with a simple password
      const testPassword = '123456';
      const isMatch = await testUser.comparePassword(testPassword);
      console.log(`Password '${testPassword}' matches: ${isMatch}`);
      
      // Test with wrong password
      const wrongPassword = 'wrongpass';
      const isWrongMatch = await testUser.comparePassword(wrongPassword);
      console.log(`Password '${wrongPassword}' matches: ${isWrongMatch}`);
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

checkUsers(); 