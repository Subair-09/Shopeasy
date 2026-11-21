import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppNotification } from '../types';

interface NotificationsContextType {
  notifications: AppNotification[];
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  unreadCount: number;
}

const NOTIFICATIONS_STORAGE_KEY = '@shopeasy_notifications_v1';

const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    title: 'Order Delivered! 🎉',
    message: 'Your package with Smart Watch (Order #SE-98241) has been delivered successfully.',
    time: '2 hours ago',
    isRead: false,
    type: 'order',
  },
  {
    id: 'notif-2',
    title: 'Payment Successful',
    message: 'Your payment of ₦65,000 for Order #SE-98241 via Paystack was confirmed.',
    time: 'Yesterday',
    isRead: false,
    type: 'payment',
  },
  {
    id: 'notif-3',
    title: 'Mega Weekend Sale is Live! 🔥',
    message: 'Get up to 50% discount on smartphones, headphones, and fashion items today.',
    time: '2 days ago',
    isRead: false,
    type: 'promo',
  },
  {
    id: 'notif-4',
    title: 'Package Dispatched 🚚',
    message: 'Order #SE-87192 has been dispatched and is on the way with rider.',
    time: '3 days ago',
    isRead: true,
    type: 'order',
  },
  {
    id: 'notif-5',
    title: 'Order Received',
    message: 'We have received your order #SE-76340 and the merchant is preparing your package.',
    time: '4 days ago',
    isRead: true,
    type: 'order',
  },
];

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

export const NotificationsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  useEffect(() => {
    loadNotifications();
  }, []);

  useEffect(() => {
    if (isLoaded) {
      AsyncStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(notifications)).catch(() => {});
    }
  }, [notifications, isLoaded]);

  const loadNotifications = async () => {
    try {
      const stored = await AsyncStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
      if (stored) {
        setNotifications(JSON.parse(stored));
      }
    } catch {
      setNotifications(INITIAL_NOTIFICATIONS);
    } finally {
      setIsLoaded(true);
    }
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isRead: true } : item))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((item) => ({ ...item, isRead: true })));
  };

  const unreadCount = useMemo(() => {
    return notifications.filter((n) => !n.isRead).length;
  }, [notifications]);

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        markAsRead,
        markAllAsRead,
        unreadCount,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationsProvider');
  }
  return context;
};
