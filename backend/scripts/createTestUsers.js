import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from '../src/models/user.model.js';

// Load environment variables
dotenv.config();

const createTestUsers = async () => {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/mern-movie';
    console.log('🔌 Connecting to MongoDB...');
    
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // Test users to create
    const testUsers = [
      {
        username: 'john_doe',
        email: 'john@example.com',
        password: 'password123',
        role: 'user',
        isActive: true
      },
      {
        username: 'jane_smith',
        email: 'jane@example.com',
        password: 'password123',
        role: 'user',
        isActive: true
      },
      {
        username: 'bob_wilson',
        email: 'bob@example.com',
        password: 'password123',
        role: 'user',
        isActive: false
      },
      {
        username: 'alice_admin',
        email: 'alice@example.com',
        password: 'password123',
        role: 'admin',
        isActive: true
      }
    ];

    console.log('\n🔍 Checking existing users...');
    
    for (const userData of testUsers) {
      const existingUser = await User.findOne({ email: userData.email });
      
      if (existingUser) {
        console.log(`⚠️  User ${userData.email} already exists, skipping...`);
        continue;
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      
      // Create user
      const user = new User({
        ...userData,
        password: hashedPassword
      });

      await user.save();
      console.log(`✅ Created user: ${userData.email} (${userData.username}) - Role: ${userData.role}`);
    }

    // Show all users
    console.log('\n📋 All users in database:');
    const allUsers = await User.find({}, 'email username role isActive createdAt');
    allUsers.forEach((user, index) => {
      console.log(`${index + 1}. ${user.email} (${user.username}) - Role: ${user.role}, Active: ${user.isActive}, Created: ${user.createdAt.toLocaleDateString()}`);
    });

    console.log(`\n📊 Total users: ${allUsers.length}`);
    console.log(`👑 Admin users: ${allUsers.filter(u => u.role === 'admin').length}`);
    console.log(`👤 Regular users: ${allUsers.filter(u => u.role === 'user').length}`);
    console.log(`✅ Active users: ${allUsers.filter(u => u.isActive).length}`);
    console.log(`❌ Inactive users: ${allUsers.filter(u => !u.isActive).length}`);

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n📡 Disconnected from MongoDB');
  }
};

// Run the script
createTestUsers();
