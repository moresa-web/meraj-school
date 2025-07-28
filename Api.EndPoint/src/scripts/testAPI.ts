import axios from 'axios';

async function testAPI() {
  try {
    console.log('🔍 Testing API connection...');
    
    // Test login directly
    console.log('\n🔐 Testing login...');
    const loginData = {
      email: 'info@moresa-web.ir',
      password: 'M0resa'
    };
    
    console.log('Login data:', loginData);
    
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', loginData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Login successful!');
    console.log('Response:', loginResponse.data);
    
  } catch (error: any) {
    console.log('❌ Error occurred!');
    
    if (error.code === 'ECONNREFUSED') {
      console.log('❌ Server is not running on port 5000');
    } else if (error.response) {
      console.log('❌ API Error:');
      console.log('Status:', error.response.status);
      console.log('Message:', error.response.data);
    } else {
      console.log('❌ Network Error:', error.message);
    }
  }
}

testAPI(); 