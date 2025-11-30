import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../src/models/user.model.js';
import bcrypt from 'bcryptjs';

// Load environment variables
dotenv.config();

async function createAdminUser() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URL);
    console.log('✅ Connected to MongoDB');

    // Check if admin user already exists
    const existingAdmin = await User.findOne({ email: 'admin@movieapp.com' });
    
    if (existingAdmin) {
      console.log('👤 Admin user already exists:');
      console.log('  Email:', existingAdmin.email);
      console.log('  Role:', existingAdmin.role);
      console.log('  Is Active:', existingAdmin.isActive);
      
      // Update role to admin if not already
      if (existingAdmin.role !== 'admin') {
        existingAdmin.role = 'admin';
        await existingAdmin.save();
        console.log('✅ Updated user role to admin');
      }
    } else {
      // Create new admin user
      const hashedPassword = await bcrypt.hash('admin123', 12);
      
      const adminUser = new User({
        username: 'admin',
        email: 'admin@movieapp.com',
        password: hashedPassword,
        role: 'admin',
        isActive: true
      });

      await adminUser.save();
      console.log('✅ Created new admin user:');
      console.log('  Email: admin@movieapp.com');
      console.log('  Password: admin123');
      console.log('  Role: admin');
    }

    // List all admin users
    const adminUsers = await User.find({ role: 'admin' });
    console.log('\n📋 All admin users:');
    adminUsers.forEach((user, index) => {
      console.log(`  ${index + 1}. ${user.email} (${user.username}) - Active: ${user.isActive}`);
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('📡 Disconnected from MongoDB');
  }
}

// Run the script
createAdminUser();
