import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProfile } from '../types';
import {
  loginCustomerAPI,
  registerCustomerAPI,
  clearStoredToken,
  fetchCustomerProfileAPI,
  updateCustomerProfileAPI,
  addCustomerAddressAPI,
} from '../services/api';

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  hasCompletedOnboarding: boolean;
  login: (email: string, password?: string) => Promise<boolean>;
  register: (name: string, email: string, phone: string, password?: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (updatedData: Partial<UserProfile>) => Promise<void>;
  addAddress: (addr: { title: string; street: string; city: string; state: string; isDefault?: boolean }) => Promise<void>;
  completeOnboarding: () => Promise<void>;
  resetOnboarding: () => Promise<void>;
}

const USER_STORAGE_KEY = '@shopeasy_user_v2';
const ONBOARDING_STORAGE_KEY = '@shopeasy_onboarded_v2';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
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
        const parsed = JSON.parse(storedUser);
        setUser(parsed);
        setIsAuthenticated(true);

        // Verify session with backend to ensure account is not suspended by admin
        fetchCustomerProfileAPI()
          .then((liveCust) => {
            if (liveCust) {
              const updatedUser: UserProfile = {
                id: liveCust._id || liveCust.id,
                name: liveCust.name || parsed.name,
                email: liveCust.email || parsed.email,
                phone: liveCust.phone || parsed.phone,
                avatar: liveCust.avatar || parsed.avatar,
                isPremium: Boolean(liveCust.isVip),
                addresses: liveCust.addressList?.length > 0
                  ? liveCust.addressList.map((a: any, idx: number) => ({
                      id: a._id || `addr-${idx}`,
                      title: a.title || 'Address',
                      street: a.street || a.addressLine1 || '',
                      city: a.city || '',
                      state: a.state || '',
                      isDefault: Boolean(a.isDefault),
                    }))
                  : parsed.addresses || [],
              };
              setUser(updatedUser);
              AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedUser)).catch(() => {});
            }
          })
          .catch((err) => {
            // If backend says 401 or deactivated, log user out immediately
            if (err.message?.includes('401') || err.message?.includes('disabled') || err.message?.includes('deactivated')) {
              logout();
            }
          });
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password?: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const liveData = await loginCustomerAPI(email.trim().toLowerCase(), password);
      if (liveData?.customer) {
        const cust = liveData.customer;
        const loggedInUser: UserProfile = {
          id: cust._id || cust.id,
          name: cust.name || email.split('@')[0],
          email: cust.email || email,
          phone: cust.phone || '',
          avatar: cust.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&q=80',
          isPremium: Boolean(cust.isVip),
          addresses: cust.addressList?.length > 0
            ? cust.addressList.map((a: any, idx: number) => ({
                id: a._id || `addr-${idx}`,
                title: a.title || 'Address',
                street: a.street || a.addressLine1 || '',
                city: a.city || '',
                state: a.state || '',
                isDefault: Boolean(a.isDefault),
              }))
            : [
                {
                  id: 'addr-default',
                  title: 'Home',
                  street: '14 Admiralty Way, Lekki Phase 1',
                  city: 'Lagos',
                  state: 'Lagos State',
                  isDefault: true,
                },
              ],
        };
        await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(loggedInUser));
        setUser(loggedInUser);
        setIsAuthenticated(true);
        return true;
      }
      return false;
    } catch (err: any) {
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (
    name: string,
    email: string,
    phone: string,
    password?: string
  ): Promise<boolean> => {
    setIsLoading(true);
    try {
      const liveData = await registerCustomerAPI(name, email, phone, password);
      if (liveData?.customer) {
        const cust = liveData.customer;
        const newUser: UserProfile = {
          id: cust._id || cust.id,
          name: cust.name || name,
          email: cust.email || email,
          phone: cust.phone || phone,
          avatar: cust.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&q=80',
          isPremium: false,
          addresses: [
            {
              id: `addr-${Date.now()}`,
              title: 'Home',
              street: '14 Admiralty Way, Lekki Phase 1',
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
      }
      return false;
    } catch {
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await Promise.all([
        AsyncStorage.removeItem(USER_STORAGE_KEY),
        clearStoredToken(),
      ]);
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
    try {
      await updateCustomerProfileAPI({
        name: updatedData.name,
        phone: updatedData.phone,
        avatar: updatedData.avatar,
      });
    } catch {}
  };

  const addAddress = async (addr: {
    title: string;
    street: string;
    city: string;
    state: string;
    isDefault?: boolean;
  }) => {
    if (!user) return;
    const newAddress = {
      id: `addr-${Date.now()}`,
      ...addr,
      isDefault: Boolean(addr.isDefault),
    };
    const updatedAddresses = [...(user.addresses || []), newAddress];
    const updatedUser = { ...user, addresses: updatedAddresses };
    setUser(updatedUser);
    await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedUser));
    try {
      await addCustomerAddressAPI(addr);
    } catch {}
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
        addAddress,
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
