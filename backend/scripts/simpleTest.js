import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../src/models/user.model.js';

// Load environment variables
dotenv.config();

const simpleTest = async () => {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/mern-movie';
    console.log('🔌 Connecting to MongoDB...');
    
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // Check admin user
    const adminUser = await User.findOne({ email: 'admin@movieapp.com' });
    if (!adminUser) {
      console.log('❌ Admin user not found!');
      return;
    }

    console.log('✅ Admin user found:');
    console.log('  - ID:', adminUser._id);
    console.log('  - Email:', adminUser.email);
    console.log('  - Username:', adminUser.username);
    console.log('  - Role:', adminUser.role);
    console.log('  - Active:', adminUser.isActive);

    // Check inactive user
    const inactiveUser = await User.findOne({ isActive: false });
    if (inactiveUser) {
      console.log('\n✅ Inactive user found:');
      console.log('  - ID:', inactiveUser._id);
      console.log('  - Email:', inactiveUser.email);
      console.log('  - Username:', inactiveUser.username);
      console.log('  - Role:', inactiveUser.role);
      console.log('  - Active:', inactiveUser.isActive);
    } else {
      console.log('\n❌ No inactive users found!');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n📡 Disconnected from MongoDB');
  }
};

// Run the script
simpleTest();
