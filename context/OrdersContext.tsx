import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Order, OrderStatus } from '../types';
import { createCustomerOrderAPI, fetchCustomerOrdersAPI } from '../services/api';

interface OrdersContextType {
  orders: Order[];
  placeOrder: (orderData: Omit<Order, 'id' | 'date' | 'trackingNumber'>) => Promise<Order>;
  getOrderById: (id: string) => Order | undefined;
}

const ORDERS_STORAGE_KEY = '@shopeasy_orders_v2';

// Initial orders matching the reference image (Phone 2) and user specifications:
const INITIAL_ORDERS: Order[] = [
  {
    id: 'SE250726001',
    date: 'Jul 26, 2025',
    status: 'Delivered',
    trackingNumber: 'TRK-250726001',
    deliveryAddress: '14 Admiralty Way, Lekki Phase 1, Lagos State',
    paymentMethod: 'Paystack (Card)',
    subtotal: 25000,
    deliveryFee: 2000,
    discount: 0,
    total: 27000,
    estimatedDelivery: 'Delivered on Jul 26, 2025',
    items: [
      {
        productId: 'prod-1',
        name: 'Wireless Earbuds',
        price: 25000,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&q=80',
        selectedColor: '#15152D',
      },
    ],
  },
  {
    id: 'SE250725002',
    date: 'Jul 26, 2025',
    status: 'Processing',
    trackingNumber: 'TRK-250725002',
    deliveryAddress: '14 Admiralty Way, Lekki Phase 1, Lagos State',
    paymentMethod: 'Bank Transfer',
    subtotal: 65000,
    deliveryFee: 2000,
    discount: 0,
    total: 67000,
    estimatedDelivery: 'Preparing package',
    items: [
      {
        productId: 'prod-3',
        name: 'Smart Watch',
        price: 65000,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
        selectedColor: '#15152D',
      },
    ],
  },
  {
    id: 'SE250724003',
    date: 'Jul 24, 2025',
    status: 'Shipped',
    trackingNumber: 'TRK-250724003',
    deliveryAddress: 'Plot 5, Victoria Island Commercial District, Lagos State',
    paymentMethod: 'Paystack',
    subtotal: 45000,
    deliveryFee: 2000,
    discount: 0,
    total: 47000,
    estimatedDelivery: 'In transit with courier',
    items: [
      {
        productId: 'prod-2',
        name: 'Sports Shoes',
        price: 45000,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80',
        selectedColor: '#D63031',
        selectedSize: '42',
      },
    ],
  },
];

const OrdersContext = createContext<OrdersContextType | undefined>(undefined);

export const OrdersProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  useEffect(() => {
    loadOrders();
  }, []);

  useEffect(() => {
    if (isLoaded) {
      AsyncStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders)).catch(() => {});
    }
  }, [orders, isLoaded]);

  const loadOrders = async () => {
    try {
      const stored = await AsyncStorage.getItem(ORDERS_STORAGE_KEY);
      if (stored) {
        setOrders(JSON.parse(stored));
      } else {
        setOrders(INITIAL_ORDERS);
      }

      // Sync latest orders from live backend if online
      try {
        const liveOrders = await fetchCustomerOrdersAPI();
        if (liveOrders && liveOrders.length > 0) {
          setOrders(liveOrders);
        }
      } catch {}
    } catch {
      setOrders(INITIAL_ORDERS);
    } finally {
      setIsLoaded(true);
    }
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

    // Attempt pushing order to MongoDB backend
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
      // Continue locally seamlessly
    }

    setOrders((prev) => [newOrder, ...prev]);
    return newOrder;
  };

  const getOrderById = (id: string) => {
    return orders.find((o) => o.id === id);
  };

  return (
    <OrdersContext.Provider value={{ orders, placeOrder, getOrderById }}>
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
