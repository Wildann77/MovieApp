import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../src/models/user.model.js';

// Load environment variables
dotenv.config();

const getAdminToken = async () => {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/mern-movie';
    console.log('🔌 Connecting to MongoDB...');
    
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // Get admin user
    const adminUser = await User.findOne({ email: 'admin@movieapp.com' });
    if (!adminUser) {
      console.log('❌ Admin user not found!');
      return;
    }

    console.log('✅ Admin user found:', adminUser.email);

    // Generate token
    const token = jwt.sign(
      { userId: adminUser._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1h' }
    );

    console.log('🔑 Admin token:');
    console.log(token);
    console.log('\n📋 Use this token for API testing:');
    console.log(`curl -X GET "http://localhost:5001/api/admin/users" -H "Authorization: Bearer ${token}"`);

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n📡 Disconnected from MongoDB');
  }
};

// Run the script
getAdminToken();
