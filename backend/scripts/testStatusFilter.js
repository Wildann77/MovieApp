import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { adminService } from '../src/services/admin.service.js';

// Load environment variables
dotenv.config();

const testStatusFilter = async () => {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/mern-movie';
    console.log('🔌 Connecting to MongoDB...');
    
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    console.log('\n🔍 Testing status filters...');

    // Test 1: Get all users
    console.log('\n1️⃣ Getting all users:');
    const allUsers = await adminService.getAllUsers({ page: 1, limit: 10 });
    console.log(`📊 Total users: ${allUsers.users.length}`);
    allUsers.users.forEach(user => {
      console.log(`  - ${user.email} (${user.username}) - Active: ${user.isActive}, Role: ${user.role}`);
    });

    // Test 2: Filter active users
    console.log('\n2️⃣ Getting active users only:');
    const activeUsers = await adminService.getAllUsers({ status: 'active', page: 1, limit: 10 });
    console.log(`📊 Active users: ${activeUsers.users.length}`);
    activeUsers.users.forEach(user => {
      console.log(`  - ${user.email} (${user.username}) - Active: ${user.isActive}`);
    });

    // Test 3: Filter inactive users
    console.log('\n3️⃣ Getting inactive users only:');
    const inactiveUsers = await adminService.getAllUsers({ status: 'inactive', page: 1, limit: 10 });
    console.log(`📊 Inactive users: ${inactiveUsers.users.length}`);
    inactiveUsers.users.forEach(user => {
      console.log(`  - ${user.email} (${user.username}) - Active: ${user.isActive}`);
    });

    // Test 4: Filter with empty status (should get all)
    console.log('\n4️⃣ Getting users with empty status filter:');
    const emptyStatusUsers = await adminService.getAllUsers({ status: '', page: 1, limit: 10 });
    console.log(`📊 Users with empty status filter: ${emptyStatusUsers.users.length}`);

    // Test 5: Filter with undefined status (should get all)
    console.log('\n5️⃣ Getting users with undefined status filter:');
    const undefinedStatusUsers = await adminService.getAllUsers({ page: 1, limit: 10 });
    console.log(`📊 Users with undefined status filter: ${undefinedStatusUsers.users.length}`);

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n📡 Disconnected from MongoDB');
  }
};

// Run the script
testStatusFilter();
