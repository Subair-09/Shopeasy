import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CartItem, Product } from '../types';
import { PRODUCTS } from '../constants/products';

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
  applyPromoCode: (code: string) => { success: boolean; message: string };
  removePromoCode: () => void;
  itemCount: number;
  selectedCount: number;
  subtotal: number;
  deliveryFee: number;
  discountAmount: number;
  total: number;
}

const CART_STORAGE_KEY = '@shopeasy_cart_v2';

// Initial items matching the exact reference image (Phone 3):
// 1. Bluetooth Headphones ₦35,000
// 2. Sports Shoes ₦45,000
// Total Subtotal = ₦80,000, Delivery Fee = ₦2,000, Total = ₦82,000
const INITIAL_CART_ITEMS: CartItem[] = [
  {
    product: PRODUCTS.find((p) => p.name === 'Bluetooth Headphones') || PRODUCTS[3],
    quantity: 1,
    selected: true,
  },
  {
    product: PRODUCTS.find((p) => p.name === 'Sports Shoes') || PRODUCTS[1],
    quantity: 1,
    selected: true,
  },
];

const VALID_PROMOS: Record<string, number> = {
  SHOP10: 0.10,
  SHOPEASY10: 0.10,
  WELCOME20: 0.20,
  MEGASALE: 0.15,
  LAGOS50: 0.05,
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(INITIAL_CART_ITEMS);
  const [promoCode, setPromoCode] = useState<string>('');
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [discountRate, setDiscountRate] = useState<number>(0);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  useEffect(() => {
    loadCart();
  }, []);

  useEffect(() => {
    if (isLoaded) {
      saveCart(cart);
    }
  }, [cart, isLoaded]);

  const loadCart = async () => {
    try {
      const stored = await AsyncStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        setCart(JSON.parse(stored));
      } else {
        setCart(INITIAL_CART_ITEMS);
      }
    } catch {
      setCart(INITIAL_CART_ITEMS);
    } finally {
      setIsLoaded(true);
    }
  };

  const saveCart = async (newCart: CartItem[]) => {
    try {
      await AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newCart));
    } catch (e) {
      console.warn('Failed to save cart', e);
    }
  };

  const addToCart = (product: Product, quantity = 1, color?: string, size?: string) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex((item) => item.product.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
          selectedColor: color || updated[existingIndex].selectedColor,
          selectedSize: size || updated[existingIndex].selectedSize,
          selected: true,
        };
        return updated;
      } else {
        return [
          ...prev,
          {
            product,
            quantity,
            selectedColor: color || product.colors?.[0],
            selectedSize: size || product.sizes?.[0],
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
    if (quantity < 1) {
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const toggleSelect = (productId: string) => {
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId
          ? { ...item, selected: item.selected === false ? true : false }
          : item
      )
    );
  };

  const isAllSelected = useMemo(() => {
    return cart.length > 0 && cart.every((item) => item.selected !== false);
  }, [cart]);

  const toggleSelectAll = () => {
    const target = !isAllSelected;
    setCart((prev) => prev.map((item) => ({ ...item, selected: target })));
  };

  const clearCart = () => {
    setCart([]);
  };

  const applyPromoCode = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    if (!cleanCode) {
      return { success: false, message: 'Please enter a coupon code' };
    }
    if (VALID_PROMOS[cleanCode]) {
      const rate = VALID_PROMOS[cleanCode];
      setAppliedPromo(cleanCode);
      setDiscountRate(rate);
      return {
        success: true,
        message: `Promo ${cleanCode} applied! ${(rate * 100).toFixed(0)}% discount.`,
      };
    }
    return { success: false, message: 'Invalid promo code. Try SHOP10 or MEGASALE' };
  };

  const removePromoCode = () => {
    setAppliedPromo(null);
    setDiscountRate(0);
    setPromoCode('');
  };

  const itemCount = useMemo(() => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  }, [cart]);

  const selectedItems = useMemo(() => {
    return cart.filter((item) => item.selected !== false);
  }, [cart]);

  const selectedCount = useMemo(() => {
    return selectedItems.reduce((total, item) => total + item.quantity, 0);
  }, [selectedItems]);

  const subtotal = useMemo(() => {
    return selectedItems.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  }, [selectedItems]);

  const deliveryFee = useMemo(() => {
    if (selectedItems.length === 0) return 0;
    return 2000;
  }, [selectedItems.length]);

  const discountAmount = useMemo(() => {
    return Math.round(subtotal * discountRate);
  }, [subtotal, discountRate]);

  const total = useMemo(() => {
    if (selectedItems.length === 0) return 0;
    return Math.max(0, subtotal - discountAmount + deliveryFee);
  }, [selectedItems.length, subtotal, discountAmount, deliveryFee]);

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
