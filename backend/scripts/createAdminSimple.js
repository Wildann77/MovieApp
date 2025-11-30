import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from '../src/models/user.model.js';

// Load environment variables
dotenv.config();

const createAdminSimple = async () => {
  try {
    // Multiple connection options
    const connectionOptions = [
      process.env.MONGO_URI,
      'mongodb://localhost:27017/mern-movie',
      'mongodb://127.0.0.1:27017/mern-movie',
      'mongodb://localhost:27017/movieapp',
      'mongodb://127.0.0.1:27017/movieapp'
    ];

    let connected = false;
    let mongoUri = '';

    console.log('🔌 Trying to connect to MongoDB...');

    for (const uri of connectionOptions) {
      if (!uri) continue;
      
      try {
        console.log(`📍 Trying: ${uri}`);
        await mongoose.connect(uri);
        mongoUri = uri;
        connected = true;
        console.log('✅ Connected to MongoDB successfully!');
        break;
      } catch (error) {
        console.log(`❌ Failed: ${error.message}`);
        continue;
      }
    }

    if (!connected) {
      console.log('❌ Could not connect to MongoDB with any of the provided URIs');
      console.log('💡 Please check:');
      console.log('   1. MongoDB is running');
      console.log('   2. Connection string is correct');
      console.log('   3. Database name is correct');
      return;
    }

    // Admin user credentials
    const adminData = {
      username: 'admin',
      email: 'admin@movieapp.com',
      password: 'admin123',
      role: 'admin',
      isActive: true
    };

    console.log('\n🔍 Checking for existing admin user...');
    
    // Check if admin user already exists
    const existingAdmin = await User.findOne({ 
      $or: [
        { email: adminData.email },
        { username: adminData.username }
      ]
    });

    if (existingAdmin) {
      console.log('👤 Found existing user:');
      console.log(`   📧 Email: ${existingAdmin.email}`);
      console.log(`   👤 Username: ${existingAdmin.username}`);
      console.log(`   🔐 Role: ${existingAdmin.role}`);
      console.log(`   📊 Status: ${existingAdmin.isActive ? 'Active' : 'Inactive'}`);
      
      // Update to admin role
      existingAdmin.role = 'admin';
      existingAdmin.isActive = true;
      await existingAdmin.save();
      
      console.log('\n✅ Updated user to admin role!');
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

    console.log('\n🎉 ADMIN USER IS READY!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Email:    ' + adminData.email);
    console.log('🔑 Password: ' + adminData.password);
    console.log('👤 Username: ' + adminData.username);
    console.log('🔐 Role:     admin');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('');
    console.log('🚀 NEXT STEPS:');
    console.log('1. Start your backend server: npm run dev');
    console.log('2. Start your frontend: cd ../frontend && npm run dev');
    console.log('3. Login at: http://localhost:5173/login');
    console.log('4. Access admin panel: http://localhost:5173/admin');
    console.log('');
    console.log('⚠️  IMPORTANT: Change password after first login!');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\n💡 Troubleshooting:');
    console.log('1. Make sure MongoDB is running');
    console.log('2. Check your database connection');
    console.log('3. Verify your .env file has MONGO_URI');
  } finally {
    await mongoose.disconnect();
    console.log('\n📡 Disconnected from MongoDB');
  }
};

// Run the script
createAdminSimple();

