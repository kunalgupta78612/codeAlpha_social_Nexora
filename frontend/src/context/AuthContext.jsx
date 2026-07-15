// ============================================================
// Nexora — Auth Context (Global Auth State)
// ============================================================

import { createContext, useContext, useState, useEffect } from "react";
import { loginUser, registerUser } from "../utils/api";

const AuthContext = createContext();

const STORAGE_KEY = "nexora_user";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ── Load user from localStorage on app start ─────────────
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setUser(JSON.parse(stored));
    }
    setLoading(false);
  }, []);

  // ── Login ─────────────────────────────────────────────────
  const login = async (email, password) => {
    const { data } = await loginUser({ email, password });
    setUser(data);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return data;
  };

  // ── Register ──────────────────────────────────────────────
  const register = async (username, email, password, fullName) => {
    const { data } = await registerUser({ username, email, password, fullName });
    setUser(data);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return data;
  };

  // ── Logout ────────────────────────────────────────────────
  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  // ── Update user state (after profile edit) ────────────────
  const updateUser = (updatedData) => {
    const merged = { ...user, ...updatedData };
    setUser(merged);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for easy consumption
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

export default AuthContext;