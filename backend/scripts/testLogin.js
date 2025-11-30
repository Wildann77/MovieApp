import axios from 'axios';

const testLogin = async () => {
  try {
    console.log('🧪 Testing admin login...');
    
    const response = await axios.post('http://localhost:5001/api/auth/login', {
      email: 'admin@movieapp.com',
      password: 'admin123'
    });
    
    console.log('✅ Login successful!');
    console.log('📧 Email:', response.data.data.email);
    console.log('👤 Username:', response.data.data.username);
    console.log('🔐 Role:', response.data.data.role);
    console.log('🎫 Token received:', response.data.data.token ? 'Yes' : 'No');
    
  } catch (error) {
    console.log('❌ Login failed!');
    console.log('📝 Error:', error.response?.data?.message || error.message);
    console.log('📊 Status:', error.response?.status);
  }
};

testLogin();

