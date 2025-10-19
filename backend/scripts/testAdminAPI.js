import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../src/models/user.model.js';
import { adminService } from '../src/services/admin.service.js';

// Load environment variables
dotenv.config();

const testAdminAPI = async () => {
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

    // Test admin service directly
    console.log('\n🔍 Testing admin service directly...');
    try {
      const result = await adminService.getAllUsers({ page: 1, limit: 10 });
      console.log('✅ Admin service result:');
      console.log('📊 Users count:', result.data.length);
      console.log('📄 Pagination:', result.pagination);
      console.log('👥 Users:', result.data.map(u => ({ email: u.email, username: u.username, role: u.role, isActive: u.isActive })));
    } catch (error) {
      console.error('❌ Admin service error:', error.message);
    }

    // Test with different filters
    console.log('\n🔍 Testing with role filter...');
    try {
      const adminUsers = await adminService.getAllUsers({ role: 'admin', page: 1, limit: 10 });
      console.log('✅ Admin users only:', adminUsers.data.length);
    } catch (error) {
      console.error('❌ Admin filter error:', error.message);
    }

    console.log('\n🔍 Testing with search...');
    try {
      const searchResults = await adminService.getAllUsers({ search: 'john', page: 1, limit: 10 });
      console.log('✅ Search results for "john":', searchResults.data.length);
    } catch (error) {
      console.error('❌ Search error:', error.message);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n📡 Disconnected from MongoDB');
  }
};

// Run the script
testAdminAPI();
