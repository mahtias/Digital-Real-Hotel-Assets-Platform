// frontend/src/api/auth.ts
import api from '../services/api';

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  walletAddress?: string;
}

// ✅ REGISTER (Returns verification message)
export const register = async (data: RegisterData) => {
  const response = await api.post('/auth/register', data);
  return response.data; // Don't auto-login - wait for email verification
};

// ✅ LOGIN (Stores token)
export const login = async (data: LoginData) => {
  const response = await api.post('/auth/login', data);
  
  if (response.data.success) {
    const { accessToken, refreshToken, user } = response.data.data;
    
    localStorage.setItem('token', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('user', JSON.stringify(user));
  }
  
  return response.data;
};

// ✅ LOGOUT
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
  window.location.href = '/login';
};

// ✅ GET CURRENT USER (from localStorage)
export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

// ✅ CHECK IF AUTHENTICATED
export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('token');
};

// ✅ GET CURRENT USER (from API)
export const fetchCurrentUser = async () => {
  return api.get('/auth/me');
};

// ✅ UPDATE PROFILE
export const updateProfile = async (data: Partial<RegisterData>) => {
  return api.patch('/auth/profile', data);
};

// ✅ VERIFY EMAIL
export const verifyEmail = async (token: string) => {
  const response = await api.post('/auth/verify-email', { token });
  return response.data;
};

// ✅ RESEND VERIFICATION EMAIL
export const resendVerificationEmail = async (email: string) => {
  const response = await api.post('/auth/resend-verification', { email });
  return response.data;
};

// ✅ FORGOT PASSWORD
export const forgotPassword = async (email: string) => {
  const response = await api.post('/auth/forgot-password', { email });
  return response.data;
};

// ✅ RESET PASSWORD
export const resetPassword = async (token: string, newPassword: string) => {
  const response = await api.post('/auth/reset-password', {
    token,
    password: newPassword,
  });
  return response.data;
};
