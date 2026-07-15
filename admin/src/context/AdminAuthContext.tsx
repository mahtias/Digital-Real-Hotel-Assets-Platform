import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";

const API = (import.meta.env.VITE_API_URL || "") + "/api/v1";

interface AdminUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

interface AdminAuthContextType {
  admin: AdminUser | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType | null>(null);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin]       = useState<AdminUser | null>(null);
  const [token, setToken]       = useState<string | null>(null);
  const [isLoading, setLoading] = useState(true);

  // Restore session on page refresh
  useEffect(() => {
    const saved = sessionStorage.getItem("adminToken");
    const user  = sessionStorage.getItem("adminUser");
    if (saved && user) {
      setToken(saved);
      setAdmin(JSON.parse(user));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const res = await axios.post(`${API}/auth/admin-login`, { email, password });

    if (!res.data.success) throw new Error(res.data.message);

    const { token: t, user } = res.data;

    // sessionStorage — cleared when browser tab closes
    sessionStorage.setItem("adminToken", t);
    sessionStorage.setItem("adminUser", JSON.stringify(user));

    setToken(t);
    setAdmin(user);
  };

  const logout = () => {
    sessionStorage.removeItem("adminToken");
    sessionStorage.removeItem("adminUser");
    setToken(null);
    setAdmin(null);
  };

  return (
    <AdminAuthContext.Provider value={{ admin, token, login, logout, isLoading }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used inside AdminAuthProvider");
  return ctx;
}

// Axios helper — always sends the admin token
export function adminApi() {
  const token = sessionStorage.getItem("adminToken");
  return axios.create({
    baseURL: API,
    headers: { Authorization: `Bearer ${token}` },
  });
}
