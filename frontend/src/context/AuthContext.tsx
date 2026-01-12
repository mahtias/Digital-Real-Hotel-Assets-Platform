import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);
const API = import.meta.env.VITE_API_URL;

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("authToken"));
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem("authToken") && !!localStorage.getItem("user");
  });

  const [loading, setLoading] = useState(true);

  // ============================
  // VERIFY TOKEN ON REFRESH
  // ============================
  useEffect(() => {
    const checkAuth = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API}/api/v1/auth/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.ok) {
          const data = await response.json();
          const userData = data.user || data;

          setUser(userData);
          localStorage.setItem("user", JSON.stringify(userData));
          setIsAuthenticated(true);
        } else {
          logout();
        }
      } catch (err) {
        console.error("Auth check failed:", err);
        if (user) setIsAuthenticated(true);
      }

      setLoading(false);
    };

    checkAuth();
  }, [token]);

  // ============================
  // LOGIN
  // ============================
  const login = async ({ email, password }) => {
    try {
      const response = await fetch(`${API}/api/v1/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.token) {
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
         setToken(data.token + ""); 
        setUser(data.user);
        setIsAuthenticated(true);

        return { success: true };
      }

      return { success: false, message: data.message || "Login failed" };
    } catch (err) {
      console.error("Login error:", err);
      return { success: false, message: "Network error. Please try again." };
    }
  };

  // ============================
  // REGISTER
  // ============================
  const register = async ({ firstName, lastName, email, password }) => {
    try {
      const response = await fetch(`${API}/api/v1/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        return { success: true };
      }

      return { success: false, message: data.message || "Registration failed" };
    } catch (err) {
      return { success: false, message: "Network error. Try again." };
    }
  };

  // ============================
  // LOGOUT
  // ============================
  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");

    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  // ============================
  // AUTH FETCH (automatically attach token)
  // ============================
  const authFetch = async (url: string, options: RequestInit = {}) => {
  const t = localStorage.getItem("authToken");

  return fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${t}`,
      ...(options.headers || {})
    }
  });
};
  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        token,
        loading,
        login,
        register,
        logout,
        authFetch, 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
