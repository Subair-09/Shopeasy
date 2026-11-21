import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Order } from '../types';
import { createCustomerOrderAPI, fetchCustomerOrdersAPI, cancelCustomerOrderAPI } from '../services/api';

interface OrdersContextType {
  orders: Order[];
  placeOrder: (orderData: Omit<Order, 'id' | 'date' | 'trackingNumber'>) => Promise<Order>;
  getOrderById: (id: string) => Order | undefined;
  cancelOrder: (orderId: string, reason?: string) => Promise<boolean>;
  refreshOrders: () => Promise<void>;
  isLoading: boolean;
}

const ORDERS_STORAGE_KEY = '@shopeasy_orders_v2';

const OrdersContext = createContext<OrdersContextType | undefined>(undefined);

export const OrdersProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setIsLoading(true);
    try {
      // 1. Try local cache first for instant UI response
      const stored = await AsyncStorage.getItem(ORDERS_STORAGE_KEY);
      if (stored) {
        setOrders(JSON.parse(stored));
      }

      // 2. Fetch authoritative real orders directly from MongoDB
      const liveOrders = await fetchCustomerOrdersAPI();
      if (liveOrders) {
        setOrders(liveOrders);
        await AsyncStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(liveOrders));
      }
    } catch {
      // Keep existing state
    } finally {
      setIsLoading(false);
    }
  };

  const refreshOrders = async () => {
    await loadOrders();
  };

  const placeOrder = async (
    orderData: Omit<Order, 'id' | 'date' | 'trackingNumber'>
  ): Promise<Order> => {
    const randomDigits = Math.floor(100000000 + Math.random() * 900000000);
    const dateStr = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
    let newOrder: Order = {
      ...orderData,
      id: `SE${randomDigits}`,
      date: dateStr,
      trackingNumber: `TRK-${randomDigits}`,
      estimatedDelivery: 'Estimated 2-3 business days',
    };

    // Save directly to MongoDB backend
    try {
      const liveOrder = await createCustomerOrderAPI({
        items: orderData.items,
        subtotal: orderData.subtotal,
        deliveryFee: orderData.deliveryFee,
        discount: orderData.discount,
        total: orderData.total,
        deliveryAddress: orderData.deliveryAddress,
        paymentMethod: orderData.paymentMethod,
      });

      if (liveOrder) {
        newOrder = {
          ...newOrder,
          id: liveOrder.orderId || liveOrder.orderNumber || newOrder.id,
          trackingNumber: liveOrder.trackingNumber || newOrder.trackingNumber,
        };
      }
    } catch (e) {
      // Continues locally
    }

    setOrders((prev) => {
      const updated = [newOrder, ...prev];
      AsyncStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updated)).catch(() => {});
      return updated;
    });

    return newOrder;
  };

  const cancelOrder = async (orderId: string, reason?: string): Promise<boolean> => {
    try {
      await cancelCustomerOrderAPI(orderId, reason);
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: 'Cancelled' as const } : o))
      );
      return true;
    } catch {
      return false;
    }
  };

  const getOrderById = (id: string) => {
    return orders.find((o) => o.id === id);
  };

  return (
    <OrdersContext.Provider
      value={{
        orders,
        placeOrder,
        getOrderById,
        cancelOrder,
        refreshOrders,
        isLoading,
      }}
    >
      {children}
    </OrdersContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrdersContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrdersProvider');
  }
  return context;
};
