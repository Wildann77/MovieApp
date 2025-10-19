import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../src/models/user.model.js';

// Load environment variables
dotenv.config();

const setAdminRole = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Get your email (ganti dengan email Anda)
    const yourEmail = 'your-email@example.com'; // GANTI DENGAN EMAIL ANDA
    
    console.log(`🔍 Looking for user with email: ${yourEmail}`);
    
    // Find your user
    const user = await User.findOne({ email: yourEmail });
    
    if (!user) {
      console.log('❌ User not found! Please check your email or create an account first.');
      console.log('💡 You can create an account at: http://localhost:5173/signup');
      await mongoose.disconnect();
      return;
    }

    // Update user role to admin
    user.role = 'admin';
    user.isActive = true;
    await user.save();
    
    console.log('🎉 User role updated to admin successfully!');
    console.log('📧 Email:', user.email);
    console.log('👤 Username:', user.username);
    console.log('🔐 Role:', user.role);
    console.log('📊 Status:', user.isActive ? 'Active' : 'Inactive');
    console.log('');
    console.log('🚀 You can now access admin dashboard at: http://localhost:5173/admin');
    console.log('🔑 Login with your existing credentials!');

  } catch (error) {
    console.error('❌ Error updating user role:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('📡 Disconnected from MongoDB');
  }
};

// Run the script
setAdminRole();

