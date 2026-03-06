import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";

const AuthContext = createContext(null);
const API = import.meta.env.VITE_API_URL;

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("authToken"));
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() =>
    !!localStorage.getItem("authToken") && !!localStorage.getItem("user")
  );

  const [loading, setLoading] = useState(true);

  // -----------------------------
  // CHECK AUTH ON REFRESH
  // -----------------------------
  useEffect(() => {
    const checkAuth = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API}/api/v1/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
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

  // -----------------------------
  // LOGIN
  // -----------------------------
  const login = useCallback(async ({ email, password }) => {
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

        setToken(data.token);
        setUser(data.user);
        setIsAuthenticated(true);

        return { success: true };
      }

      return { success: false, message: data.message || "Login failed" };
    } catch (err) {
      console.error("Login error:", err);
      return { success: false, message: "Network error. Please try again." };
    }
  }, []);

  // -----------------------------
  // REGISTER
  // -----------------------------
  const register = useCallback(
    async ({ firstName, lastName, email, password }) => {
      try {
        const response = await fetch(`${API}/api/v1/auth/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ firstName, lastName, email, password }),
        });

        const data = await response.json();

        if (response.ok) return { success: true };

        return {
          success: false,
          message: data.message || "Registration failed",
        };
      } catch (err) {
        return { success: false, message: "Network error. Try again." };
      }
    },
    []
  );

  // -----------------------------
  // LOGOUT
  // -----------------------------
  const logout = useCallback(() => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");

    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  // -----------------------------
  // 🔥 UPDATE TOKEN (NEW)
  // -----------------------------
  const updateToken = useCallback((newToken) => {
    console.log("🔑 Updating auth token in context...");
    localStorage.setItem("authToken", newToken);
    setToken(newToken);
    
    // Decode and log new token
    try {
      const payload = JSON.parse(atob(newToken.split('.')[1]));
      console.log("✅ New token payload:", payload);
    } catch (e) {
      console.error("Failed to decode token:", e);
    }
  }, []);

  // -----------------------------
  // 🔥 REFRESH USER (UPDATED)
  // -----------------------------
  const refreshUser = useCallback(async () => {
    // 🔥 Get the latest token from localStorage
    const currentToken = localStorage.getItem("authToken");
    
    if (!currentToken) {
      console.log("❌ No token found in refreshUser");
      return;
    }

    try {
      console.log("🔄 Refreshing user data...");
      
      const response = await fetch(`${API}/api/v1/auth/me`, {
        headers: { Authorization: `Bearer ${currentToken}` },
      });

      if (response.ok) {
        const data = await response.json();
        const userData = data.user || data;

        console.log("✅ User data refreshed:", userData);
        
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));

        // 🔥 Update token state if it changed
        if (currentToken !== token) {
          setToken(currentToken);
        }

        return userData;
      }
    } catch (err) {
      console.error("❌ Failed to refresh user:", err);
    }
  }, []); // 🔥 Remove token dependency to avoid stale closures

  // -----------------------------
  // AUTH FETCH
  // -----------------------------
 const authFetch = useCallback(
  async (url, options) => {
    const currentToken = localStorage.getItem("authToken");
    
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${currentToken}`,
    };

    // Merge with existing headers if provided
    if (options && options.headers) {
      Object.assign(headers, options.headers);
    }

    return fetch(url, {
      ...(options || {}),
      headers,
    });
  },
  []
);

  // -----------------------------
  // STABLE VALUE (PREVENT RE-RENDERS)
  // -----------------------------
  const value = useMemo(
    () => ({
      isAuthenticated,
      user,
      token,
      loading,
      login,
      register,
      logout,
      authFetch,
      refreshUser,
      updateToken, // 🔥 Export new function
    }),
    [
      isAuthenticated,
      user,
      token,
      loading,
      login,
      register,
      logout,
      authFetch,
      refreshUser,
      updateToken,
    ]
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
