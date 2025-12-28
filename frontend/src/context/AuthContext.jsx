import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("authToken") || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = localStorage.getItem('authToken');
      const savedUser = localStorage.getItem('user');

      console.log(' Checking auth on mount...');
      console.log('Token exists:', !!storedToken);
      console.log('Saved user exists:', !!savedUser);

      if (storedToken) {
        setToken(storedToken);
      }

      if (storedToken && savedUser) {
        try {
          const parsedUser = JSON.parse(savedUser);
          setUser(parsedUser);
          setIsAuthenticated(true);
          console.log('User restored from localStorage:', parsedUser);
        } catch (err) {
          console.error('Failed to parse user:', err);
          localStorage.removeItem('user');
          localStorage.removeItem('authToken');
        }
      }

      // Try validating token with backend
      if (storedToken) {
        try {
          const response = await fetch('http://localhost:5000/api/v1/auth/me', {
            headers: {
              'Authorization': `Bearer ${storedToken}`
            }
          });

          if (response.ok) {
            const data = await response.json();
            const userData = data.user || data;

            setUser(userData);
            setIsAuthenticated(true);
            localStorage.setItem('user', JSON.stringify(userData));

            console.log('User verified with backend:', userData);
          } else {
            console.warn('Token invalid — removing auth');
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
            setUser(null);
            setToken(null);
            setIsAuthenticated(false);
          }
        } catch (err) {
          console.error('Backend unreachable — using cached user if exists');
        }
      }

      setLoading(false);
    };

    checkAuth();
  }, []);

  // LOGIN
  const login = async ({ email, password }) => {
    try {
      console.log('Attempting login for:', email);

      const response = await fetch('http://localhost:5000/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        setToken(data.token);
        setUser(data.user);
        setIsAuthenticated(true);

        console.log('Login successful!');
        return { success: true };
      } else {
        return { success: false, message: data.message || 'Login failed' };
      }
    } catch (err) {
      console.error('Login error:', err);
      return { success: false, message: 'Network error. Please try again.' };
    }
  };

  // REGISTER
  const register = async ({ firstName, lastName, email, password }) => {
    try {
      console.log('Attempting registration for:', email);

      const response = await fetch('http://localhost:5000/api/v1/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, lastName, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        setToken(data.token);
        setUser(data.user);
        setIsAuthenticated(true);

        console.log('Registration successful!');
        return { success: true };
      } else {
        return { success: false, message: data.message || 'Registration failed' };
      }
    } catch (err) {
      console.error('Registration error:', err);
      return { success: false, message: 'Network error. Please try again.' };
    }
  };

  // LOGOUT
  const logout = () => {
    console.log('Logging out...');

    localStorage.removeItem('authToken');
    localStorage.removeItem('user');

    setToken(null);
    setUser(null);
    setIsAuthenticated(false);

    console.log('Logged out successfully');
  };

  const value = {
    isAuthenticated,
    user,
    token,
    loading,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
};
