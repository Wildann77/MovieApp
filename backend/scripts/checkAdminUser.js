import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../src/models/user.model.js';

// Load environment variables
dotenv.config();

const checkAdminUser = async () => {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/mern-movie';
    console.log('🔌 Connecting to MongoDB...');
    
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    console.log('\n🔍 Checking admin user...');
    
    // Check for admin user with exact email
    const adminUser = await User.findOne({ email: 'admin@movieapp.com' });
    
    if (adminUser) {
      console.log('✅ Admin user found:');
      console.log('📧 Email:', adminUser.email);
      console.log('👤 Username:', adminUser.username);
      console.log('🔐 Role:', adminUser.role);
      console.log('📊 Status:', adminUser.isActive ? 'Active' : 'Inactive');
      console.log('🆔 ID:', adminUser._id);
      console.log('📅 Created:', adminUser.createdAt);
    } else {
      console.log('❌ Admin user not found!');
      
      // Check all users
      const allUsers = await User.find({}, 'email username role isActive');
      console.log('\n📋 All users in database:');
      allUsers.forEach((user, index) => {
        console.log(`${index + 1}. Email: ${user.email}, Username: ${user.username}, Role: ${user.role}, Active: ${user.isActive}`);
      });
    }

    // Check for any user with admin role
    const adminUsers = await User.find({ role: 'admin' });
    console.log(`\n👑 Users with admin role: ${adminUsers.length}`);
    adminUsers.forEach(user => {
      console.log(`- ${user.email} (${user.username})`);
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n📡 Disconnected from MongoDB');
  }
};

// Run the script
checkAdminUser();

