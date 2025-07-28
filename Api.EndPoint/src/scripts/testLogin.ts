import axios from 'axios';

async function testLogin() {
  try {
    console.log('Testing login API...');
    
    const loginData = {
      email: 'info@moresa-web.ir',
      password: 'M0resa'
    };
    
    console.log('Login data:', loginData);
    
    const response = await axios.post('http://localhost:5000/api/auth/login', loginData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Login successful!');
    console.log('Response:', response.data);
    
  } catch (error: any) {
    console.log('❌ Login failed!');
    console.log('Error status:', error.response?.status);
    console.log('Error message:', error.response?.data);
    console.log('Full error:', error.message);
  }
}

testLogin(); 