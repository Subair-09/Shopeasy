import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppNotification } from '../types';
import { fetchNotificationsAPI, markNotificationReadAPI } from '../services/api';

interface NotificationsContextType {
  notifications: AppNotification[];
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  refreshNotifications: () => Promise<void>;
  unreadCount: number;
}

const NOTIFICATIONS_STORAGE_KEY = '@shopeasy_notifications_v2';

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

export const NotificationsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      const stored = await AsyncStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
      if (stored) {
        setNotifications(JSON.parse(stored));
      }

      // Fetch live notifications from backend
      const res = await fetchNotificationsAPI();
      if (res?.notifications && Array.isArray(res.notifications)) {
        const mapped: AppNotification[] = res.notifications.map((n: any) => ({
          id: n._id || n.id,
          title: n.title,
          message: n.message,
          time: new Date(n.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          isRead: Boolean(n.isRead),
          type: (n.type === 'order' || n.type === 'payment' || n.type === 'promo') ? n.type : 'system',
        }));
        setNotifications(mapped);
        await AsyncStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(mapped));
      }
    } catch {
      // keep existing
    }
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isRead: true } : item))
    );
    markNotificationReadAPI(id).catch(() => {});
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
        refreshNotifications: loadNotifications,
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
