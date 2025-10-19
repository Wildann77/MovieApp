import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from '../src/models/user.model.js';

// Load environment variables (same as backend server)
dotenv.config();

const createAdminAtlas = async () => {
  try {
    // Use the same MongoDB URI as the backend server
    const mongoUri = process.env.MONGODB_URL;
    
    if (!mongoUri) {
      console.log('❌ MONGO_URI not found in environment variables');
      console.log('💡 Make sure your .env file has MONGO_URI set');
      return;
    }
    
    console.log('🔌 Connecting to MongoDB Atlas...');
    console.log('📍 URI:', mongoUri.replace(/\/\/[^:]+:[^@]+@/, '//***:***@')); // Hide credentials
    
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB Atlas successfully!');

    console.log('\n🔍 Checking for existing admin user...');
    
    // Check if admin user already exists
    const existingAdmin = await User.findOne({ 
      email: { $regex: /^admin@movieapp\.com$/i }
    });
    
    if (existingAdmin) {
      console.log('👤 Found existing admin user:');
      console.log('📧 Email:', existingAdmin.email);
      console.log('👤 Username:', existingAdmin.username);
      console.log('🔐 Role:', existingAdmin.role);
      console.log('📊 Status:', existingAdmin.isActive ? 'Active' : 'Inactive');
      
      // Update to admin role and active status
      existingAdmin.role = 'admin';
      existingAdmin.isActive = true;
      await existingAdmin.save();
      
      console.log('\n✅ Updated existing user to admin role!');
    } else {
      console.log('🆕 Creating new admin user...');
      
      // Hash password
      const hashedPassword = await bcrypt.hash('admin123', 10);
      
      // Create admin user
      const adminUser = new User({
        username: 'admin',
        email: 'admin@movieapp.com',
        password: hashedPassword,
        role: 'admin',
        isActive: true,
        profilePic: ''
      });
      
      await adminUser.save();
      console.log('✅ Created new admin user successfully!');
    }

    // Verify the admin user exists
    const verifyAdmin = await User.findOne({ 
      email: { $regex: /^admin@movieapp\.com$/i }
    });
    
    if (verifyAdmin) {
      console.log('\n🎉 ADMIN USER IS READY!');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('📧 Email:    admin@movieapp.com');
      console.log('🔑 Password: admin123');
      console.log('👤 Username: admin');
      console.log('🔐 Role:     admin');
      console.log('📊 Status:   Active');
      console.log('🆔 ID:       ' + verifyAdmin._id);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('');
      console.log('🚀 NEXT STEPS:');
      console.log('1. Your backend server is already running');
      console.log('2. Start your frontend: cd ../frontend && npm run dev');
      console.log('3. Login at: http://localhost:5173/login');
      console.log('4. Access admin panel: http://localhost:5173/admin');
      console.log('');
      console.log('⚠️  IMPORTANT: Change password after first login!');
    } else {
      console.log('❌ Failed to verify admin user creation');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\n💡 Troubleshooting:');
    console.log('1. Check your .env file has correct MONGO_URI');
    console.log('2. Ensure MongoDB Atlas cluster is accessible');
    console.log('3. Verify network access in MongoDB Atlas');
  } finally {
    await mongoose.disconnect();
    console.log('\n📡 Disconnected from MongoDB Atlas');
  }
};

// Run the script
createAdminAtlas();
