/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useMemo, useCallback } from "react";
import useLocalStorage from "../hooks/useLocalStorage";
import { authAPI } from "../services/api";

const AuthContext = createContext(null);

const TOKEN_KEY = "luxegear-token";
const REFRESH_KEY = "luxegear-refresh-token";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useLocalStorage("luxegear-user", null);
  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback(async (email, password) => {
    setIsLoading(true);
    try {
      const data = await authAPI.login({ email, password });
      localStorage.setItem(TOKEN_KEY, data.accessToken);
      localStorage.setItem(REFRESH_KEY, data.refreshToken);
      const newUser = { ...data.user, joinedDate: new Date().toISOString(), orders: [] };
      setUser(newUser);
      return { success: true, user: newUser };
    } catch (err) {
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  }, [setUser]);

  const register = useCallback(async (name, email, password) => {
    setIsLoading(true);
    try {
      const data = await authAPI.register({ name, email, password });
      localStorage.setItem(TOKEN_KEY, data.accessToken);
      localStorage.setItem(REFRESH_KEY, data.refreshToken);
      const newUser = { ...data.user, joinedDate: new Date().toISOString(), orders: [] };
      setUser(newUser);
      return { success: true, user: newUser };
    } catch (err) {
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  }, [setUser]);

  const logout = useCallback(async () => {
    try {
      const refreshToken = localStorage.getItem(REFRESH_KEY);
      if (refreshToken) {
        await authAPI.logout(refreshToken);
      }
    } catch {
      // Logout endpoint may fail if token expired — still clear local state
    } finally {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(REFRESH_KEY);
      setUser(null);
    }
  }, [setUser]);

  const changePassword = useCallback(async (currentPassword, newPassword) => {
    setIsLoading(true);
    try {
      const data = await authAPI.changePassword(currentPassword, newPassword);
      // Update tokens with the new ones from the server
      localStorage.setItem(TOKEN_KEY, data.accessToken);
      localStorage.setItem(REFRESH_KEY, data.refreshToken);
      return { success: true, message: data.message };
    } catch (err) {
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const value = useMemo(
    () => ({ user, isAuthenticated: !!user, isLoading, login, register, logout, changePassword }),
    [user, isLoading, login, register, logout, changePassword]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export default AuthContext;
