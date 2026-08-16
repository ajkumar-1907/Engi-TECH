import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const API_URL = process.env.REACT_APP_BACKEND_URL || '';

function formatApiErrorDetail(detail) {
  if (detail == null) return "Something went wrong. Please try again.";
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail))
    return detail.map((e) => (e && typeof e.msg === "string" ? e.msg : JSON.stringify(e))).filter(Boolean).join(" ");
  if (detail && typeof detail.msg === "string") return detail.msg;
  return String(detail);
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/auth/me`, { withCredentials: true });
      setUser(data);
    } catch (error) {
      setUser(false);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password, rememberMe = false) => {
    try {
      const { data } = await axios.post(
        `${API_URL}/api/auth/login`,
        { email, password, remember_me: rememberMe },
        { withCredentials: true }
      );
      setUser(data);
      return { success: true };
    } catch (error) {
      return { success: false, error: formatApiErrorDetail(error.response?.data?.detail) || error.message };
    }
  };

  const register = async (email, password, name) => {
    try {
      const { data } = await axios.post(
        `${API_URL}/api/auth/register`,
        { email, password, name },
        { withCredentials: true }
      );
      setUser(data);
      return { success: true };
    } catch (error) {
      return { success: false, error: formatApiErrorDetail(error.response?.data?.detail) || error.message };
    }
  };

  const logout = async () => {
    try {
      await axios.post(`${API_URL}/api/auth/logout`, {}, { withCredentials: true });
      setUser(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const googleLogin = async (credential) => {
    try {
      const { data } = await axios.post(`${API_URL}/api/auth/google`, { credential }, { withCredentials: true });
      setUser(data);
      return { success: true };
    } catch (error) {
      return { success: false, error: formatApiErrorDetail(error.response?.data?.detail) || error.message };
    }
  };

  const githubLogin = async (code) => {
    try {
      const { data } = await axios.post(`${API_URL}/api/auth/github`, { code }, { withCredentials: true });
      setUser(data);
      return { success: true };
    } catch (error) {
      return { success: false, error: formatApiErrorDetail(error.response?.data?.detail) || error.message };
    }
  };

  const forgotPassword = async (email) => {
    try {
      const { data } = await axios.post(`${API_URL}/api/auth/forgot-password`, { email });
      return { success: true, message: data.message };
    } catch (error) {
      return { success: false, error: formatApiErrorDetail(error.response?.data?.detail) || error.message };
    }
  };

  const resetPassword = async (token, newPassword) => {
    try {
      const { data } = await axios.post(`${API_URL}/api/auth/reset-password`, { token, new_password: newPassword });
      return { success: true, message: data.message };
    } catch (error) {
      return { success: false, error: formatApiErrorDetail(error.response?.data?.detail) || error.message };
    }
  };

  const verifyEmail = async (token) => {
    try {
      const { data } = await axios.post(`${API_URL}/api/auth/verify-email`, { token });
      await checkAuth();
      return { success: true, message: data.message };
    } catch (error) {
      return { success: false, error: formatApiErrorDetail(error.response?.data?.detail) || error.message };
    }
  };

  const resendVerification = async () => {
    try {
      const { data } = await axios.post(`${API_URL}/api/auth/resend-verification`, {}, { withCredentials: true });
      return { success: true, message: data.message };
    } catch (error) {
      return { success: false, error: formatApiErrorDetail(error.response?.data?.detail) || error.message };
    }
  };

  return (
    <AuthContext.Provider value={{
      user, loading, login, register, logout, checkAuth,
      googleLogin, githubLogin, forgotPassword, resetPassword, verifyEmail, resendVerification
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};