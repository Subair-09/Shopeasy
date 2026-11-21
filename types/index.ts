export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  image: string;
  category: string;
  description: string;
  colors?: string[];
  sizes?: string[];
  stock: number;
  isFeatured?: boolean;
  isPopular?: boolean;
}

export interface Category {
  id: string;
  name: string;
  icon: string; // Ionicons name
  itemCount: number;
  countLabel?: string; // e.g. "(120+)"
  image?: string; // Product photo URL for category card
  color?: string;
  backgroundColor?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
  selected?: boolean;
}

export type OrderStatus = 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  selectedColor?: string;
  selectedSize?: string;
}

export interface Order {
  id: string;
  date: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  status: OrderStatus;
  deliveryAddress: string;
  paymentMethod: string;
  trackingNumber: string;
  estimatedDelivery?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  isPremium: boolean;
  addresses: Address[];
}

export interface Address {
  id: string;
  title: string;
  street: string;
  city: string;
  state: string;
  isDefault: boolean;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  type: 'order' | 'promo' | 'system' | 'payment';
}
