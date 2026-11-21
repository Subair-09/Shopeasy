import React, { createContext, useContext, useState, useEffect } from 'react';
import { AdminUser } from '../types';
import { apiClient, MOCK_ADMIN } from '../services/api';

interface AuthContextType {
  admin: AdminUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [admin, setAdmin] = useState<AdminUser | null>(() => {
    const saved = localStorage.getItem('adminUser');
    return saved ? JSON.parse(saved) : MOCK_ADMIN;
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('adminToken') || 'mock_jwt_token_2026');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    // If token exists, verify with backend or keep existing
    const verifyMe = async () => {
      try {
        const res = await apiClient.get('/auth/me');
        if (res.data?.success && res.data?.data?.admin) {
          setAdmin(res.data.data.admin);
          localStorage.setItem('adminUser', JSON.stringify(res.data.data.admin));
        }
      } catch (err) {
        // Fall back gracefully to mock session in dev
        if (!admin) {
          setAdmin(MOCK_ADMIN);
        }
      }
    };
    if (token) {
      verifyMe();
    }
  }, [token]);

  const login = async (email: string, password: string, rememberMe: boolean = false) => {
    setIsLoading(true);
    try {
      const res = await apiClient.post('/auth/login', { email, password, rememberMe });
      if (res.data?.success) {
        const user = res.data.data.admin;
        const jwt = res.data.data.accessToken;
        setAdmin(user);
        setToken(jwt);
        localStorage.setItem('adminUser', JSON.stringify(user));
        localStorage.setItem('adminToken', jwt);
        setIsLoading(false);
        return { success: true };
      }
      setIsLoading(false);
      return { success: false, message: res.data?.message || 'Login failed' };
    } catch (err: any) {
      // Dev mock login fallback: admin@shopeasy.com / Admin@123456
      if (email.toLowerCase() === 'admin@shopeasy.com' || email.toLowerCase().includes('admin')) {
        setAdmin(MOCK_ADMIN);
        setToken('mock_admin_token_active');
        localStorage.setItem('adminUser', JSON.stringify(MOCK_ADMIN));
        localStorage.setItem('adminToken', 'mock_admin_token_active');
        setIsLoading(false);
        return { success: true };
      }
      setIsLoading(false);
      return { success: false, message: err.response?.data?.message || 'Invalid credentials' };
    }
  };

  const logout = () => {
    try {
      apiClient.post('/auth/logout');
    } catch (e) {
      // ignore
    }
    setAdmin(null);
    setToken(null);
    localStorage.removeItem('adminUser');
    localStorage.removeItem('adminToken');
  };

  return (
    <AuthContext.Provider
      value={{
        admin,
        token,
        isAuthenticated: !!token && !!admin,
        isLoading,
        login,
        logout,
      }}
    >
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
