import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../src/models/user.model.js';
import { exec } from 'child_process';
import { promisify } from 'util';

// Load environment variables
dotenv.config();

const execAsync = promisify(exec);

const testRealAPICall = async () => {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/mern-movie';
    console.log('🔌 Connecting to MongoDB...');
    
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // Get admin user and generate token
    const adminUser = await User.findOne({ email: 'admin@movieapp.com' });
    if (!adminUser) {
      console.log('❌ Admin user not found!');
      return;
    }

    const token = jwt.sign(
      { userId: adminUser._id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    console.log('🔑 Generated admin token');
    console.log('Token (first 50 chars):', token.substring(0, 50) + '...');

    // Test API calls with curl
    const testCases = [
      {
        name: 'All users',
        url: 'http://localhost:5001/api/admin/users'
      },
      {
        name: 'Active users',
        url: 'http://localhost:5001/api/admin/users?status=active'
      },
      {
        name: 'Inactive users',
        url: 'http://localhost:5001/api/admin/users?status=inactive'
      },
      {
        name: 'Admin users',
        url: 'http://localhost:5001/api/admin/users?role=admin'
      },
      {
        name: 'Regular users',
        url: 'http://localhost:5001/api/admin/users?role=user'
      }
    ];

    for (const testCase of testCases) {
      console.log(`\n🧪 Testing: ${testCase.name}`);
      console.log(`📤 URL: ${testCase.url}`);
      
      try {
        const curlCommand = `curl -s -H "Authorization: Bearer ${token}" "${testCase.url}"`;
        console.log(`🔧 Curl command: ${curlCommand}`);
        
        const { stdout, stderr } = await execAsync(curlCommand);
        
        if (stderr) {
          console.log('❌ Curl error:', stderr);
          continue;
        }
        
        console.log('✅ Response received');
        
        try {
          const response = JSON.parse(stdout);
          console.log('📊 Response structure:', {
            success: response.success,
            message: response.message,
            hasData: !!response.data,
            dataKeys: response.data ? Object.keys(response.data) : null
          });
          
          if (response.success && response.data) {
            console.log(`👥 Users count: ${response.data.users?.length || 0}`);
            console.log(`📄 Pagination:`, response.data.pagination);
            
            if (response.data.users && response.data.users.length > 0) {
              console.log('👤 Users:');
              response.data.users.forEach(user => {
                console.log(`  - ${user.email} (${user.username}) - Active: ${user.isActive}, Role: ${user.role}`);
              });
            }
          } else {
            console.log('❌ Response indicates failure:', response);
          }
        } catch (parseError) {
          console.log('❌ Failed to parse JSON response:', parseError.message);
          console.log('Raw response:', stdout);
        }
        
      } catch (error) {
        console.log('❌ Request failed:', error.message);
      }
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n📡 Disconnected from MongoDB');
  }
};

// Run the script
testRealAPICall();
