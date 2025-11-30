import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../src/models/user.model.js';
import { adminService } from '../src/services/admin.service.js';

// Load environment variables
dotenv.config();

const testFrontendSimulation = async () => {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/mern-movie';
    console.log('🔌 Connecting to MongoDB...');
    
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // Simulate frontend parameter building
    console.log('\n🎭 Simulating frontend parameter building...');
    
    // These are the exact parameters that frontend would send
    const testParams = [
      { search: '', role: undefined, status: undefined, page: 1, limit: 10 }, // All users
      { search: '', role: undefined, status: 'active', page: 1, limit: 10 },  // Active users
      { search: '', role: undefined, status: 'inactive', page: 1, limit: 10 }, // Inactive users
      { search: '', role: 'admin', status: undefined, page: 1, limit: 10 },   // Admin users
      { search: '', role: 'user', status: undefined, page: 1, limit: 10 },    // Regular users
    ];

    for (let i = 0; i < testParams.length; i++) {
      const params = testParams[i];
      console.log(`\n${i + 1}️⃣ Testing params:`, JSON.stringify(params, null, 2));
      
      try {
        const result = await adminService.getAllUsers(params);
        console.log(`✅ Success - Users count: ${result.users.length}`);
        console.log(`📄 Pagination:`, result.pagination);
        
        if (result.users.length > 0) {
          console.log(`👥 Users:`);
          result.users.forEach(user => {
            console.log(`  - ${user.email} (${user.username}) - Active: ${user.isActive}, Role: ${user.role}`);
          });
        } else {
          console.log(`❌ No users found`);
        }
      } catch (error) {
        console.log(`❌ Error:`, error.message);
      }
    }

    // Test edge cases
    console.log('\n🔍 Testing edge cases...');
    
    // Test with empty string status
    console.log('\n6️⃣ Testing with empty string status:');
    const emptyStatusParams = { search: '', role: undefined, status: '', page: 1, limit: 10 };
    try {
      const result = await adminService.getAllUsers(emptyStatusParams);
      console.log(`✅ Empty status - Users count: ${result.users.length}`);
    } catch (error) {
      console.log(`❌ Empty status error:`, error.message);
    }

    // Test with null status
    console.log('\n7️⃣ Testing with null status:');
    const nullStatusParams = { search: '', role: undefined, status: null, page: 1, limit: 10 };
    try {
      const result = await adminService.getAllUsers(nullStatusParams);
      console.log(`✅ Null status - Users count: ${result.users.length}`);
    } catch (error) {
      console.log(`❌ Null status error:`, error.message);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n📡 Disconnected from MongoDB');
  }
};

// Run the script
testFrontendSimulation();
