import api from './api';

export const authService = {
  // =============================
  // REGISTER (do NOT auto-login)
  // =============================
  async register(userData) {
    const response = await api.post('/auth/register', userData);
    return response.data; // backend: "verify your email"
  },

  // =============================
  // LOGIN
  // =============================
  async login(credentials) {
    const response = await api.post('/auth/login', credentials);

    if (response.data.success) {
      const { accessToken, refreshToken, user } = response.data.data;

      // MUST store token so Axios interceptor can send it
      localStorage.setItem('token', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(user));
    }

    return response.data;
  },

  // =============================
  // FORGOT PASSWORD
  // =============================
  async forgotPassword(email) {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },

  // =============================
  // RESET PASSWORD
  // =============================
  async resetPassword(token, newPassword) {
    const response = await api.post('/auth/reset-password', {
      token,
      password: newPassword,
    });
    return response.data;
  },

  // =============================
  // VERIFY EMAIL
  // =============================
  async verifyEmail(token) {
    const response = await api.post('/auth/verify-email', { token });
    return response.data;
  },

  // =============================
  // LOGOUT
  // =============================
  logout() {
    localStorage.removeItem('token');        // fixed
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  },

  // =============================
  // GET CURRENT USER
  // =============================
  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  isAuthenticated() {
    return !!localStorage.getItem('token'); // fixed
  },
};

// =============================
// RESEND VERIFICATION EMAIL
// =============================
export async function resendVerificationEmail(email) {
  const response = await api.post('/auth/resend-verification', { email });
  return response.data;
}
