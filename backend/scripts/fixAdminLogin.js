import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../src/models/user.model.js';

// Load environment variables
dotenv.config();

const fixAdminLogin = async () => {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/mern-movie';
    console.log('🔌 Connecting to MongoDB...');
    
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    console.log('\n🔍 Checking and fixing admin user...');
    
    // Find admin user (case insensitive)
    let adminUser = await User.findOne({ 
      email: { $regex: /^admin@movieapp\.com$/i }
    });
    
    if (adminUser) {
      console.log('✅ Found admin user:');
      console.log('📧 Email:', adminUser.email);
      console.log('👤 Username:', adminUser.username);
      console.log('🔐 Role:', adminUser.role);
      
      // Ensure it's active and has admin role
      adminUser.role = 'admin';
      adminUser.isActive = true;
      await adminUser.save();
      
      console.log('✅ Updated admin user settings');
    } else {
      console.log('❌ Admin user not found, creating new one...');
      
      // Create new admin user
      const bcrypt = await import('bcryptjs');
      const hashedPassword = await bcrypt.hash('admin123', 10);
      
      adminUser = new User({
        username: 'admin',
        email: 'admin@movieapp.com',
        password: hashedPassword,
        role: 'admin',
        isActive: true,
        profilePic: ''
      });
      
      await adminUser.save();
      console.log('✅ Created new admin user');
    }

    console.log('\n🎉 ADMIN USER READY!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Email:    admin@movieapp.com');
    console.log('🔑 Password: admin123');
    console.log('👤 Username: admin');
    console.log('🔐 Role:     admin');
    console.log('📊 Status:   Active');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    // Test login query
    console.log('\n🧪 Testing login query...');
    const testUser = await User.findOne({ email: 'admin@movieapp.com' });
    if (testUser) {
      console.log('✅ Login query works!');
      console.log('📧 Found user:', testUser.email);
    } else {
      console.log('❌ Login query failed!');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n📡 Disconnected from MongoDB');
  }
};

// Run the script
fixAdminLogin();

