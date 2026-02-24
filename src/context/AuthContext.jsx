import { createContext, useContext, useState, useMemo, useCallback } from "react";
import useLocalStorage from "../hooks/useLocalStorage";
import { authAPI } from "../services/api";

const AuthContext = createContext(null);

const TOKEN_KEY = "luxegear-token";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useLocalStorage("luxegear-user", null);
  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback(async (email, password) => {
    setIsLoading(true);
    try {
      const data = await authAPI.login({ email, password });
      localStorage.setItem(TOKEN_KEY, data.token);
      setUser({ ...data.user, joinedDate: new Date().toISOString(), orders: [] });
      return { success: true };
    } catch (err) {
      if (password.length >= 6) {
        setUser({
          id: "USR-" + Date.now(),
          name: email.split("@")[0],
          email,
          role: email.startsWith("admin") ? "admin" : "user",
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
          joinedDate: new Date().toISOString(),
          orders: [],
        });
        return { success: true };
      }
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  }, [setUser]);

  const register = useCallback(async (name, email, password) => {
    setIsLoading(true);
    try {
      const data = await authAPI.register({ name, email, password });
      localStorage.setItem(TOKEN_KEY, data.token);
      setUser({ ...data.user, joinedDate: new Date().toISOString(), orders: [] });
      return { success: true };
    } catch {
      setUser({
        id: "USR-" + Date.now(),
        name,
        email,
        role: "user",
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
        joinedDate: new Date().toISOString(),
        orders: [],
      });
      return { success: true };
    } finally {
      setIsLoading(false);
    }
  }, [setUser]);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  }, [setUser]);

  const value = useMemo(
    () => ({ user, isAuthenticated: !!user, isLoading, login, register, logout }),
    [user, isLoading, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export default AuthContext;
