import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('authToken');
      const savedUser = localStorage.getItem('user'); // 
      
      console.log(' Checking auth on mount...');
      console.log('Token exists:', !!token);
      console.log('Saved user exists:', !!savedUser);

      if (token && savedUser) {
        try {
          const parsedUser = JSON.parse(savedUser);
          setUser(parsedUser);
          setIsAuthenticated(true);
          console.log('User restored from localStorage:', parsedUser);
        } catch (error) {
          console.error(' Failed to parse saved user:', error);
          localStorage.removeItem('user');
          localStorage.removeItem('authToken');
        }
      }

      if (token) {
        try {
          const response = await fetch('http://localhost:5000/api/v1/auth/me', {
            headers: {
              'Authorization': `Bearer ${token}`
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
            // Token invalid, clear everything
            console.warn(' Token verification failed');
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
            setUser(null);
            setIsAuthenticated(false);
          }
        } catch (error) {
          console.error('Auth verification failed:', error);
          // Keep the saved user if backend is down
          if (savedUser) {
            console.log(' Backend down, using cached user');
          } else {
            localStorage.removeItem('authToken');
            setUser(null);
            setIsAuthenticated(false);
          }
        }
      }
      
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async ({ email, password }) => {
    try {
      console.log(' Attempting login for:', email);
      
      const response = await fetch('http://localhost:5000/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log('Login response:', data);

      if (response.ok && data.success) {
        // Store BOTH token AND user
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('user', JSON.stringify(data.user)); 
        
        setUser(data.user);
        setIsAuthenticated(true);
        
        console.log(' Login successful!');
        console.log(' User:', data.user);
        console.log(' Token saved');
        console.log(' User saved to localStorage');
        
        return { success: true };
      } else {
        console.error(' Login failed:', data.message);
        return { success: false, message: data.message || 'Login failed' };
      }
    } catch (error) {
      console.error(' Login error:', error);
      return { success: false, message: 'Network error. Please try again.' };
    }
  };

  const register = async ({ firstName, lastName, email, password }) => {
    try {
      console.log(' Attempting registration for:', email);
      
      const response = await fetch('http://localhost:5000/api/v1/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ firstName, lastName, email, password }),
      });

      const data = await response.json();
      console.log('Registration response:', data);

      if (response.ok) {
        // Store BOTH token AND user
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        setUser(data.user);
        setIsAuthenticated(true);
        
        console.log(' Registration successful!');
        console.log(' User:', data.user);
        
        return { success: true };
      } else {
        console.error(' Registration failed:', data.message);
        return { success: false, message: data.message || 'Registration failed' };
      }
    } catch (error) {
      console.error(' Registration error:', error);
      return { success: false, message: 'Network error. Please try again.' };
    }
  };

  const logout = () => {
    console.log(' Logging out...');
    
    //  Clear BOTH token AND user
    localStorage.removeItem('authToken');
    localStorage.removeItem('user'); //
    
    setUser(null);
    setIsAuthenticated(false);
    
    console.log(' Logged out successfully');
  };

  const value = {
    isAuthenticated,
    user,
    loading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
