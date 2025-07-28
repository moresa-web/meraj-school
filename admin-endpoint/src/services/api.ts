import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Cache for storing the token
let tokenCache: { token: string; timestamp: number } | null = null;
const TOKEN_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
});

// Add a request interceptor
api.interceptors.request.use(
  async (config) => {
    try {
      console.log('API Request:', {
        url: config.url,
        method: config.method,
        headers: {
          ...config.headers,
          Authorization: config.headers.Authorization ? 'Bearer [HIDDEN]' : undefined
        }
      });

      // Check if we have a valid cached token
      const now = Date.now();
      if (tokenCache && (now - tokenCache.timestamp) < TOKEN_CACHE_DURATION) {
        config.headers.Authorization = `Bearer ${tokenCache.token}`;
        return config;
      }

      // Get token from cookies
      const response = await fetch('/api/auth/token');
      const { token } = await response.json();
      
      if (token) {
        // Cache the token
        tokenCache = {
          token: token,
          timestamp: now
        };
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error getting token:', error);
    }
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Add a response interceptor
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', {
      url: response.config.url,
      status: response.status,
      data: response.data
    });
    return response;
  },
  (error) => {
    console.error('API Error:', {
      url: error.config?.url,
      status: error.response?.status,
      message: error.message,
      data: error.response?.data
    });
    return Promise.reject(error);
  }
);

export default api; 