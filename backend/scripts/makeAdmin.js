import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from '../src/models/user.model.js';

// Load environment variables
dotenv.config();

const makeAdmin = async () => {
  try {
    // Connect to MongoDB - try multiple connection options
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/mern-movie';
    console.log('🔌 Connecting to MongoDB...');
    console.log('📍 URI:', mongoUri);
    
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // Admin user credentials (bisa diubah sesuai kebutuhan)
    const adminData = {
      username: 'admin',
      email: 'admin@movieapp.com',
      password: 'admin123',
      role: 'admin',
      isActive: true
    };

    console.log('🔍 Checking if admin user exists...');
    
    // Check if admin user already exists
    const existingAdmin = await User.findOne({ 
      $or: [
        { email: adminData.email },
        { username: adminData.username }
      ]
    });

    if (existingAdmin) {
      console.log('👤 Found existing user:');
      console.log(`   Email: ${existingAdmin.email}`);
      console.log(`   Username: ${existingAdmin.username}`);
      console.log(`   Role: ${existingAdmin.role}`);
      
      // Update to admin role
      existingAdmin.role = 'admin';
      existingAdmin.isActive = true;
      await existingAdmin.save();
      
      console.log('✅ Updated user to admin role!');
    } else {
      console.log('🆕 Creating new admin user...');
      
      // Hash password
      const hashedPassword = await bcrypt.hash(adminData.password, 10);
      
      // Create admin user
      const adminUser = new User({
        username: adminData.username,
        email: adminData.email,
        password: hashedPassword,
        role: adminData.role,
        isActive: adminData.isActive,
        profilePic: ''
      });

      await adminUser.save();
      console.log('✅ Admin user created successfully!');
    }

    console.log('\n🎉 Admin user is ready!');
    console.log('📧 Email:', adminData.email);
    console.log('🔑 Password:', adminData.password);
    console.log('👤 Username:', adminData.username);
    console.log('🔐 Role: admin');
    console.log('');
    console.log('🚀 Access admin dashboard at: http://localhost:5173/admin');
    console.log('💡 Login with the credentials above!');
    console.log('⚠️  Remember to change the password after first login!');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('📡 Disconnected from MongoDB');
  }
};

// Run the script
makeAdmin();
