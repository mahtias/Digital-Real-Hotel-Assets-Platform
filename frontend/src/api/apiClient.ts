import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const apiClient = axios.create({
  baseURL: `${API_URL}/api/v1`, // ✅ ADD /api/v1 HERE
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

//  REQUEST INTERCEPTOR - Add token to every request
apiClient.interceptors.request.use(
  (config) => {
   
     const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log(` API Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
    return config;
  },
  (error) => {
    console.error(' Request Error:', error);
    return Promise.reject(error);
  }
);

//  RESPONSE INTERCEPTOR - Handle errors globally
apiClient.interceptors.response.use(
  (response) => {
    console.log(` API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`, response.data);
    return response;
  },
  (error) => {
    console.error(' Response Error:', error.response?.status, error.response?.data);

    // 🔓 Handle 401 Unauthorized
    if (error.response?.status === 401) {
  console.warn('🔓 Unauthorized - Clearing token');
  localStorage.removeItem('authToken');   // FIX
  //window.location.href = '/login';
}

    // 🚫 Handle 403 Forbidden
    if (error.response?.status === 403) {
      console.warn(' Forbidden - Access Denied');
    }

    return Promise.reject(error);
  }
);

export default apiClient;