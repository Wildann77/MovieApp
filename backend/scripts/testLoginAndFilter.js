import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../src/models/user.model.js';
import { adminService } from '../src/services/admin.service.js';

// Load environment variables
dotenv.config();

const testLoginAndFilter = async () => {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/mern-movie';
    console.log('🔌 Connecting to MongoDB...');
    
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // Simulate login process
    console.log('\n🔐 Simulating admin login...');
    
    const adminUser = await User.findOne({ email: 'admin@movieapp.com' });
    if (!adminUser) {
      console.log('❌ Admin user not found!');
      return;
    }

    // Verify password (simulating login)
    const password = 'admin123';
    const isPasswordValid = await bcrypt.compare(password, adminUser.password);
    
    if (!isPasswordValid) {
      console.log('❌ Invalid password!');
      return;
    }

    console.log('✅ Admin login successful!');
    console.log('👤 User:', adminUser.email, 'Role:', adminUser.role);

    // Test admin service directly
    console.log('\n🧪 Testing admin service filters...');

    // Test all users
    console.log('\n1️⃣ All users:');
    const allUsers = await adminService.getAllUsers({});
    console.log(`📊 Count: ${allUsers.users.length}`);
    allUsers.users.forEach(user => {
      console.log(`  - ${user.email} (${user.username}) - Active: ${user.isActive}, Role: ${user.role}`);
    });

    // Test inactive filter
    console.log('\n2️⃣ Inactive users only:');
    const inactiveUsers = await adminService.getAllUsers({ status: 'inactive' });
    console.log(`📊 Count: ${inactiveUsers.users.length}`);
    inactiveUsers.users.forEach(user => {
      console.log(`  - ${user.email} (${user.username}) - Active: ${user.isActive}`);
    });

    // Test active filter
    console.log('\n3️⃣ Active users only:');
    const activeUsers = await adminService.getAllUsers({ status: 'active' });
    console.log(`📊 Count: ${activeUsers.users.length}`);
    activeUsers.users.forEach(user => {
      console.log(`  - ${user.email} (${user.username}) - Active: ${user.isActive}`);
    });

    // Test role filter
    console.log('\n4️⃣ Admin users only:');
    const adminUsers = await adminService.getAllUsers({ role: 'admin' });
    console.log(`📊 Count: ${adminUsers.users.length}`);
    adminUsers.users.forEach(user => {
      console.log(`  - ${user.email} (${user.username}) - Role: ${user.role}`);
    });

    // Test combined filters
    console.log('\n5️⃣ Inactive admin users:');
    const inactiveAdminUsers = await adminService.getAllUsers({ status: 'inactive', role: 'admin' });
    console.log(`📊 Count: ${inactiveAdminUsers.users.length}`);
    inactiveAdminUsers.users.forEach(user => {
      console.log(`  - ${user.email} (${user.username}) - Active: ${user.isActive}, Role: ${user.role}`);
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n📡 Disconnected from MongoDB');
  }
};

// Run the script
testLoginAndFilter();
