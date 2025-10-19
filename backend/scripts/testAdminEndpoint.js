import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../src/models/user.model.js';

// Load environment variables
dotenv.config();

const testAdminEndpoint = async () => {
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

    // Generate JWT token
    const token = jwt.sign(
      { userId: adminUser._id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    console.log('🔑 Generated admin token:', token.substring(0, 50) + '...');

    // Test API endpoint with curl commands
    console.log('\n🧪 Testing admin API endpoints:');
    console.log('\n1️⃣ Test getting all users:');
    console.log(`curl -X GET "http://localhost:5001/api/admin/users" -H "Authorization: Bearer ${token}"`);

    console.log('\n2️⃣ Test filtering active users:');
    console.log(`curl -X GET "http://localhost:5001/api/admin/users?status=active" -H "Authorization: Bearer ${token}"`);

    console.log('\n3️⃣ Test filtering inactive users:');
    console.log(`curl -X GET "http://localhost:5001/api/admin/users?status=inactive" -H "Authorization: Bearer ${token}"`);

    console.log('\n4️⃣ Test filtering admin users:');
    console.log(`curl -X GET "http://localhost:5001/api/admin/users?role=admin" -H "Authorization: Bearer ${token}"`);

    console.log('\n5️⃣ Test filtering regular users:');
    console.log(`curl -X GET "http://localhost:5001/api/admin/users?role=user" -H "Authorization: Bearer ${token}"`);

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n📡 Disconnected from MongoDB');
  }
};

// Run the script
testAdminEndpoint();
