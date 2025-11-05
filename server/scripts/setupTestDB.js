import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const setupTestDatabase = async () => {
  try {
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/bug-tracker-test';
    
    console.log('Setting up test database...');
    await mongoose.connect(MONGODB_URI);
    
    // Create collections and indexes
    const db = mongoose.connection.db;
    
    console.log('Test database setup completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Test database setup failed:', error);
    process.exit(1);
  }
};

setupTestDatabase();