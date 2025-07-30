import mongoose from 'mongoose';
import { Class } from '../models/Class';
import dotenv from 'dotenv';

dotenv.config();

const checkClasses = async () => {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/meraj-school';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    // Get all classes
    const classes = await Class.find({});
    console.log(`Found ${classes.length} classes in database:`);
    
    classes.forEach((cls, index) => {
      console.log(`${index + 1}. ${cls.title} - ${cls.category} - ${cls.teacher}`);
    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

// Run the function
checkClasses(); 