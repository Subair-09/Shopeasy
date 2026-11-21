import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CartItem, Product } from '../types';
import { validatePromoCodeAPI, fetchStoreSettingsFromAPI } from '../services/api';

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, color?: string, size?: string) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  toggleSelect: (productId: string) => void;
  toggleSelectAll: () => void;
  isAllSelected: boolean;
  clearCart: () => void;
  promoCode: string;
  appliedPromo: string | null;
  discountRate: number;
  applyPromoCode: (code: string) => Promise<{ success: boolean; message: string }>;
  removePromoCode: () => void;
  itemCount: number;
  selectedCount: number;
  subtotal: number;
  deliveryFee: number;
  discountAmount: number;
  total: number;
}

const CART_STORAGE_KEY = '@shopeasy_cart_v3';

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [promoCode, setPromoCode] = useState<string>('');
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [discountAmountState, setDiscountAmountState] = useState<number>(0);
  const [discountRate, setDiscountRate] = useState<number>(0);
  const [standardShippingFee, setStandardShippingFee] = useState<number>(2000);
  const [freeShippingThreshold, setFreeShippingThreshold] = useState<number>(50000);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  useEffect(() => {
    loadCart();
    fetchStoreSettingsFromAPI().then((settings) => {
      if (settings) {
        setStandardShippingFee(settings.standardShippingFee);
        setFreeShippingThreshold(settings.freeShippingThreshold);
      }
    });
  }, []);

  useEffect(() => {
    if (isLoaded) {
      AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart)).catch(() => {});
    }
  }, [cart, isLoaded]);

  const loadCart = async () => {
    try {
      const stored = await AsyncStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        setCart(JSON.parse(stored));
      } else {
        setCart([]);
      }
    } catch {
      setCart([]);
    } finally {
      setIsLoaded(true);
    }
  };

  const addToCart = (
    product: Product,
    quantity: number = 1,
    color?: string,
    size?: string
  ) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex((item) => item.product.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        const newQty = updated[existingIndex].quantity + quantity;
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: product.stock ? Math.min(newQty, product.stock) : newQty,
          selectedColor: color || updated[existingIndex].selectedColor,
          selectedSize: size || updated[existingIndex].selectedSize,
        };
        return updated;
      } else {
        return [
          ...prev,
          {
            product,
            quantity: product.stock ? Math.min(quantity, product.stock) : quantity,
            selectedColor: color,
            selectedSize: size,
            selected: true,
          },
        ];
      }
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => {
        if (item.product.id === productId) {
          const maxStock = item.product.stock || 99;
          return {
            ...item,
            quantity: Math.min(quantity, maxStock),
          };
        }
        return item;
      })
    );
  };

  const toggleSelect = (productId: string) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.product.id === productId) {
          return { ...item, selected: !item.selected };
        }
        return item;
      })
    );
  };

  const toggleSelectAll = () => {
    const allSelected = cart.every((item) => item.selected);
    setCart((prev) => prev.map((item) => ({ ...item, selected: !allSelected })));
  };

  const isAllSelected = useMemo(() => {
    return cart.length > 0 && cart.every((item) => item.selected);
  }, [cart]);

  const clearCart = () => {
    setCart([]);
    setAppliedPromo(null);
    setPromoCode('');
    setDiscountRate(0);
    setDiscountAmountState(0);
  };

  const applyPromoCode = async (code: string): Promise<{ success: boolean; message: string }> => {
    const trimmed = code.trim().toUpperCase();
    if (!trimmed) {
      return { success: false, message: 'Please enter a promo code' };
    }

    try {
      const res = await validatePromoCodeAPI(trimmed, subtotal);
      if (res.success) {
        setAppliedPromo(trimmed);
        setPromoCode(trimmed);
        setDiscountAmountState(res.discountNaira);
        return { success: true, message: `Code applied: ₦${res.discountNaira.toLocaleString()} discount!` };
      } else {
        return { success: false, message: res.message };
      }
    } catch {
      return { success: false, message: 'Could not validate promo code with server' };
    }
  };

  const removePromoCode = () => {
    setAppliedPromo(null);
    setPromoCode('');
    setDiscountRate(0);
    setDiscountAmountState(0);
  };

  const itemCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  const selectedCount = useMemo(() => {
    return cart.filter((item) => item.selected).reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  const subtotal = useMemo(() => {
    return cart
      .filter((item) => item.selected)
      .reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  }, [cart]);

  const deliveryFee = useMemo(() => {
    if (subtotal === 0) return 0;
    if (subtotal >= freeShippingThreshold) return 0;
    return standardShippingFee;
  }, [subtotal, freeShippingThreshold, standardShippingFee]);

  const discountAmount = useMemo(() => {
    if (discountAmountState > 0) return discountAmountState;
    if (discountRate > 0) return Math.round(subtotal * discountRate);
    return 0;
  }, [subtotal, discountRate, discountAmountState]);

  const total = useMemo(() => {
    return Math.max(0, subtotal + deliveryFee - discountAmount);
  }, [subtotal, deliveryFee, discountAmount]);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        toggleSelect,
        toggleSelectAll,
        isAllSelected,
        clearCart,
        promoCode,
        appliedPromo,
        discountRate,
        applyPromoCode,
        removePromoCode,
        itemCount,
        selectedCount,
        subtotal,
        deliveryFee,
        discountAmount,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
