import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../src/models/user.model.js';

// Load environment variables
dotenv.config();

const debugTokenIssue = async () => {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/mern-movie';
    console.log('🔌 Connecting to MongoDB...');
    
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // Check all admin users
    console.log('\n🔍 Checking all admin users...');
    const adminUsers = await User.find({ role: 'admin' });
    console.log(`📊 Found ${adminUsers.length} admin users:`);
    
    adminUsers.forEach((user, index) => {
      console.log(`${index + 1}. ID: ${user._id}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Username: ${user.username}`);
      console.log(`   Role: ${user.role}`);
      console.log(`   Active: ${user.isActive}`);
      console.log(`   Created: ${user.createdAt}`);
      console.log('');
    });

    // Generate token with the first admin user
    if (adminUsers.length > 0) {
      const adminUser = adminUsers[0];
      console.log(`🔑 Generating token for user: ${adminUser.email}`);
      console.log(`🆔 User ID: ${adminUser._id}`);
      
      const token = jwt.sign(
        { userId: adminUser._id },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
      
      console.log(`✅ Token generated successfully`);
      console.log(`🔑 Token (first 50 chars): ${token.substring(0, 50)}...`);
      
      // Decode token to verify
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log(`🔍 Decoded token:`, decoded);
      
      // Try to find user with decoded ID
      console.log(`\n🔍 Looking for user with ID: ${decoded.userId}`);
      const foundUser = await User.findById(decoded.userId);
      
      if (foundUser) {
        console.log(`✅ User found: ${foundUser.email}`);
      } else {
        console.log(`❌ User not found with ID: ${decoded.userId}`);
        
        // Try different ID formats
        console.log(`\n🔍 Trying different ID formats...`);
        
        // Try as string
        const userByString = await User.findById(decoded.userId.toString());
        if (userByString) {
          console.log(`✅ User found with string ID: ${userByString.email}`);
        } else {
          console.log(`❌ User not found with string ID`);
        }
        
        // Try as ObjectId
        try {
          const objectId = new mongoose.Types.ObjectId(decoded.userId);
          const userByObjectId = await User.findById(objectId);
          if (userByObjectId) {
            console.log(`✅ User found with ObjectId: ${userByObjectId.email}`);
          } else {
            console.log(`❌ User not found with ObjectId`);
          }
        } catch (error) {
          console.log(`❌ Error creating ObjectId: ${error.message}`);
        }
      }
    }

    // Check if there are any issues with the database connection
    console.log('\n🔍 Database connection test...');
    const userCount = await User.countDocuments();
    console.log(`📊 Total users in database: ${userCount}`);
    
    const activeUsers = await User.countDocuments({ isActive: true });
    console.log(`📊 Active users: ${activeUsers}`);
    
    const inactiveUsers = await User.countDocuments({ isActive: false });
    console.log(`📊 Inactive users: ${inactiveUsers}`);

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n📡 Disconnected from MongoDB');
  }
};

// Run the script
debugTokenIssue();
