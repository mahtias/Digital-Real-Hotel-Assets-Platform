// frontend/src/services/api.js
// @ts-ignore
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const API_ENDPOINTS = {
  // Auth endpoints
  LOGIN: `${API_BASE_URL}/api/v1/auth/login`,
  REGISTER: `${API_BASE_URL}/api/v1/auth/register`,
  VERIFY: `${API_BASE_URL}/api/v1/auth/verify`,
  LOGOUT: `${API_BASE_URL}/api/v1/auth/logout`,
  
  // User endpoints
  ME: `${API_BASE_URL}/api/v1/auth/me`,
  UPDATE_PROFILE: `${API_BASE_URL}/api/v1/auth/profile`,
};

export default API_ENDPOINTS;
