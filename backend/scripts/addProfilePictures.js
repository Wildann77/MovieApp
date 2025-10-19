import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../src/models/user.model.js';

// Load environment variables
dotenv.config();

const addProfilePictures = async () => {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/mern-movie';
    console.log('🔌 Connecting to MongoDB...');
    
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // Profile pictures from UI Avatars service
    const profilePictures = {
      'admin@movieapp.com': 'https://ui-avatars.com/api/?name=Admin&background=6366f1&color=fff&size=128',
      'alice@example.com': 'https://ui-avatars.com/api/?name=Alice&background=ec4899&color=fff&size=128',
      'bob@example.com': 'https://ui-avatars.com/api/?name=Bob&background=ef4444&color=fff&size=128',
      'jane@example.com': 'https://ui-avatars.com/api/?name=Jane&background=10b981&color=fff&size=128',
      'john@example.com': 'https://ui-avatars.com/api/?name=John&background=f59e0b&color=fff&size=128'
    };

    console.log('\n🖼️ Adding profile pictures to users...');

    for (const [email, profilePic] of Object.entries(profilePictures)) {
      const user = await User.findOne({ email });
      
      if (user) {
        user.profilePic = profilePic;
        await user.save();
        console.log(`✅ Updated profile picture for ${user.username} (${email})`);
      } else {
        console.log(`❌ User not found: ${email}`);
      }
    }

    // Show updated users
    console.log('\n📋 Updated users with profile pictures:');
    const allUsers = await User.find({}, 'email username profilePic role isActive');
    allUsers.forEach((user, index) => {
      console.log(`${index + 1}. ${user.username} (${user.email})`);
      console.log(`   Profile Pic: ${user.profilePic}`);
      console.log(`   Role: ${user.role}, Active: ${user.isActive}`);
      console.log('');
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n📡 Disconnected from MongoDB');
  }
};

// Run the script
addProfilePictures();
