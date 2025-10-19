import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

const testCurlEndpoint = async () => {
  try {
    console.log('🧪 Testing admin endpoint with curl...');
    
    // Test 1: Health check
    console.log('\n1️⃣ Testing health endpoint:');
    try {
      const { stdout: healthOutput } = await execAsync('curl -s "http://localhost:5001/api/health"');
      console.log('✅ Health check response:', healthOutput);
    } catch (error) {
      console.log('❌ Health check failed:', error.message);
    }

    // Test 2: Admin users without auth (should fail)
    console.log('\n2️⃣ Testing admin users without auth (should fail):');
    try {
      const { stdout: usersOutput } = await execAsync('curl -s "http://localhost:5001/api/admin/users"');
      console.log('Response:', usersOutput);
    } catch (error) {
      console.log('❌ Request failed:', error.message);
    }

    // Test 3: Admin users with invalid token (should fail)
    console.log('\n3️⃣ Testing admin users with invalid token (should fail):');
    try {
      const { stdout: invalidTokenOutput } = await execAsync('curl -s -H "Authorization: Bearer invalid-token" "http://localhost:5001/api/admin/users"');
      console.log('Response:', invalidTokenOutput);
    } catch (error) {
      console.log('❌ Request failed:', error.message);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
};

// Run the script
testCurlEndpoint();
