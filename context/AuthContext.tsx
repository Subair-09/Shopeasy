import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProfile } from '../types';

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  hasCompletedOnboarding: boolean;
  login: (email?: string, password?: string) => Promise<boolean>;
  register: (name: string, email: string, phone: string, password?: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (updatedData: Partial<UserProfile>) => Promise<void>;
  completeOnboarding: () => Promise<void>;
  resetOnboarding: () => Promise<void>;
}

const DEFAULT_USER: UserProfile = {
  id: 'user-001',
  name: 'Nurudeen Adewale',
  email: 'nurudeen@example.com',
  phone: '+234 812 345 6789',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
  isPremium: true,
  addresses: [
    {
      id: 'addr-1',
      title: 'Home',
      street: '14 Admiralty Way, Lekki Phase 1',
      city: 'Lagos',
      state: 'Lagos State',
      isDefault: true,
    },
    {
      id: 'addr-2',
      title: 'Office',
      street: 'Plot 5, Victoria Island Commercial District',
      city: 'Lagos',
      state: 'Lagos State',
      isDefault: false,
    },
  ],
};

const USER_STORAGE_KEY = '@shopeasy_user_v1';
const ONBOARDING_STORAGE_KEY = '@shopeasy_onboarded_v1';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(DEFAULT_USER);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    loadStoredData();
  }, []);

  const loadStoredData = async () => {
    try {
      const [storedUser, storedOnboarded] = await Promise.all([
        AsyncStorage.getItem(USER_STORAGE_KEY),
        AsyncStorage.getItem(ONBOARDING_STORAGE_KEY),
      ]);

      if (storedOnboarded === 'true') {
        setHasCompletedOnboarding(true);
      }

      if (storedUser) {
        setUser(JSON.parse(storedUser));
        setIsAuthenticated(true);
      } else {
        // default to mock user for instant preview, but allow user logout/login
        setUser(DEFAULT_USER);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.warn('Failed to load auth state', error);
      setUser(DEFAULT_USER);
      setIsAuthenticated(true);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email?: string, password?: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const loggedInUser: UserProfile = {
        ...DEFAULT_USER,
        email: email || DEFAULT_USER.email,
        name: email ? email.split('@')[0].replace('.', ' ') : DEFAULT_USER.name,
      };
      await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(loggedInUser));
      setUser(loggedInUser);
      setIsAuthenticated(true);
      return true;
    } catch {
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, phone: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const newUser: UserProfile = {
        id: `user-${Date.now()}`,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&q=80',
        isPremium: false,
        addresses: [
          {
            id: `addr-${Date.now()}`,
            title: 'Home',
            street: '12 Marina Road',
            city: 'Lagos',
            state: 'Lagos State',
            isDefault: true,
          },
        ],
      };
      await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(newUser));
      setUser(newUser);
      setIsAuthenticated(true);
      return true;
    } catch {
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await AsyncStorage.removeItem(USER_STORAGE_KEY);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (updatedData: Partial<UserProfile>) => {
    if (!user) return;
    const updated = { ...user, ...updatedData };
    setUser(updated);
    await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updated));
  };

  const completeOnboarding = async () => {
    setHasCompletedOnboarding(true);
    await AsyncStorage.setItem(ONBOARDING_STORAGE_KEY, 'true');
  };

  const resetOnboarding = async () => {
    setHasCompletedOnboarding(false);
    await AsyncStorage.removeItem(ONBOARDING_STORAGE_KEY);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        hasCompletedOnboarding,
        login,
        register,
        logout,
        updateProfile,
        completeOnboarding,
        resetOnboarding,
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
