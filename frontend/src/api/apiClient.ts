import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const apiClient = axios.create({
  baseURL: `${API_URL}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
  // ✅ Remove withCredentials unless using cookies
  // withCredentials: true,
});

// REQUEST INTERCEPTOR - Add Bearer token from localStorage
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// RESPONSE INTERCEPTOR - Handle global errors
apiClient.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`, response.data);
    return response;
  },
  (error) => {
    console.error('Response Error:', error.response?.status, error.response?.data);

    // 401 Unauthorized
    if (error.response?.status === 401) {
      console.warn('Unauthorized - Clearing token');
      localStorage.removeItem('authToken');
      // window.location.href = '/login';
    }

    // 403 Forbidden
    if (error.response?.status === 403) {
      console.warn('Forbidden - Access Denied');
    }

    return Promise.reject(error);
  }
);

export default apiClient;