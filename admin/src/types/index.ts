export type AdminRole =
  | 'Super Admin'
  | 'Store Admin'
  | 'Order Manager'
  | 'Product Manager'
  | 'Customer Support';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  avatar?: string;
}

export interface MetricCardData {
  title: string;
  value: string | number;
  change: string;
  isPositive?: boolean;
  icon: string;
  color: 'purple' | 'blue' | 'green' | 'yellow' | 'orange';
}

export interface ProductItem {
  _id: string;
  id?: string;
  name: string;
  sku: string;
  category: string;
  subcategory?: string;
  description: string;
  price: number;
  originalPrice?: number;
  regularPriceKobo?: number;
  discountedPriceKobo?: number;
  stock: number;
  rating: number;
  reviewCount: number;
  salesCount: number;
  images: string[];
  isFeatured: boolean;
  isActive: boolean;
  createdAt?: string;
}

export interface OrderCustomer {
  id?: string;
  _id?: string;
  name: string;
  email: string;
  avatar?: string;
  phone?: string;
}

export interface OrderItem {
  product?: any;
  productId?: string;
  name: string;
  image: string;
  priceKobo?: number;
  quantity: number;
  subtotalKobo?: number;
  selectedColor?: string;
  selectedSize?: string;
}

export interface OrderRecord {
  _id: string;
  orderNumber: string;
  orderId?: string;
  customer?: OrderCustomer;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  items: OrderItem[];
  totalAmount?: number;
  totalKobo: number;
  subtotalKobo: number;
  shippingFeeKobo: number;
  taxKobo: number;
  orderDate?: string;
  createdAt: string;
  orderStatus: 'Pending' | 'Confirmed' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  paymentStatus: 'Pending' | 'Paid' | 'Failed' | 'Refunded';
  paymentMethod: string;
  shippingAddress?: any;
  deliveryAddress?: string;
  trackingNumber?: string;
  timeline?: { status: string; timestamp: string; note?: string; updatedBy?: string }[];
}

export interface CustomerRecord {
  _id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  totalOrders: number;
  totalSpent: number;
  totalSpentKobo?: number;
  isActive: boolean;
  createdAt: string;
  addressList?: any[];
}

export interface CategoryRecord {
  _id: string;
  name: string;
  slug: string;
  image: string;
  productCount: number;
  isActive: boolean;
  description?: string;
}

export interface CampaignRecord {
  _id: string;
  title: string;
  subtitle: string;
  badge: string;
  bannerType: 'discount' | 'delivery';
  discountText: string;
  reach: string;
  orders: string;
  revenue: string;
  endsAt: string;
  isActive: boolean;
}

export interface PromotionRecord {
  _id: string;
  code: string;
  discount: string;
  minOrder: string;
  validUntil: string;
  status: 'Active' | 'Inactive';
}
