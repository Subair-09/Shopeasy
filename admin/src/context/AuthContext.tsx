import React, { createContext, useContext, useState, useEffect } from 'react';
import { AdminUser } from '../types';
import { apiClient } from '../services/api';

export const ALLOWED_ADMIN_EMAIL = 'nuddywale@gmail.com';
export const ALLOWED_ADMIN_PASSWORD = 'Adewale009';

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
    try {
      const saved = localStorage.getItem('adminUser');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('adminToken') || null;
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const verifyMe = async () => {
      if (!token) return;
      try {
        const res = await apiClient.get('/auth/me');
        if (res.data?.success && res.data?.data?.admin) {
          const verifiedAdmin = res.data.data.admin;
          // Security check: Only ALLOWED_ADMIN_EMAIL can remain logged in
          if (verifiedAdmin.email?.toLowerCase() !== ALLOWED_ADMIN_EMAIL) {
            logout();
            return;
          }
          setAdmin(verifiedAdmin);
          localStorage.setItem('adminUser', JSON.stringify(verifiedAdmin));
        }
      } catch (err: any) {
        // If 401 or forbidden, clear session
        if (err.response?.status === 401 || err.response?.status === 403) {
          logout();
        }
      }
    };

    if (token) {
      verifyMe();
    }
  }, [token]);

  const login = async (email: string, password: string, rememberMe: boolean = false) => {
    setIsLoading(true);
    const normalizedEmail = email.trim().toLowerCase();

    // Strict validation: Only ALLOWED_ADMIN_EMAIL is permitted
    if (normalizedEmail !== ALLOWED_ADMIN_EMAIL) {
      setIsLoading(false);
      return {
        success: false,
        message: `Access denied. Only the designated administrator (${ALLOWED_ADMIN_EMAIL}) is permitted to access the ShopEasy Admin Panel.`,
      };
    }

    try {
      const res = await apiClient.post('/auth/login', {
        email: normalizedEmail,
        password,
        rememberMe,
      });

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
      return { success: false, message: res.data?.message || 'Invalid credentials' };
    } catch (err: any) {
      // Offline fallback: if backend is unreachable, check authorized admin credentials
      if (normalizedEmail === ALLOWED_ADMIN_EMAIL && password === ALLOWED_ADMIN_PASSWORD) {
        const superUser: AdminUser = {
          id: 'adm_super_01',
          name: 'Nurudeen Adewale',
          email: ALLOWED_ADMIN_EMAIL,
          role: 'Super Admin',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
        };
        const localToken = 'auth_token_' + Date.now();
        setAdmin(superUser);
        setToken(localToken);
        localStorage.setItem('adminUser', JSON.stringify(superUser));
        localStorage.setItem('adminToken', localToken);
        setIsLoading(false);
        return { success: true };
      }

      setIsLoading(false);
      return {
        success: false,
        message: err.response?.data?.message || 'Invalid email or password.',
      };
    }
  };

  const logout = () => {
    try {
      apiClient.post('/auth/logout').catch(() => {});
    } catch {}
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
        isAuthenticated: Boolean(token && admin),
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
