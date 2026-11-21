import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Product, Category, Order } from '../types';

// Live Vercel Backend URL (Defaults directly to your deployed backend, optionally overridable with EXPO_PUBLIC_API_URL)
export const PRODUCTION_API_URL =
  process.env.EXPO_PUBLIC_API_URL ||
  'https://backend-9e74cbhds-subair-09s-projects.vercel.app/api/v1';
export const ALT_PRODUCTION_API_URL =
  'https://backend-subair-09s-projects.vercel.app/api/v1';

// Local Development URL
export const DEV_API_URL = Platform.select({
  android: 'http://10.0.2.2:5000/api/v1',
  ios: 'http://localhost:5000/api/v1',
  default: 'http://localhost:5000/api/v1',
});

// Storage keys
const TOKEN_KEY = '@shopeasy_customer_jwt_token';
const CUSTOM_API_URL_KEY = '@shopeasy_custom_api_url';

export let API_URL = PRODUCTION_API_URL;

// Initialize or override active API URL
export const getActiveApiUrl = async (): Promise<string> => {
  try {
    const custom = await AsyncStorage.getItem(CUSTOM_API_URL_KEY);
    if (custom) {
      API_URL = custom;
      return custom;
    }
  } catch {}
  API_URL = PRODUCTION_API_URL;
  return PRODUCTION_API_URL;
};

export const setCustomApiUrl = async (url: string): Promise<void> => {
  API_URL = url;
  await AsyncStorage.setItem(CUSTOM_API_URL_KEY, url);
};

// Auth Token Helpers
export const getStoredToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
};

export const setStoredToken = async (token: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(TOKEN_KEY, token);
  } catch {}
};

export const clearStoredToken = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(TOKEN_KEY);
  } catch {}
};

// Generic fetch wrapper with timeout and Bearer auth header
const request = async (endpoint: string, options: RequestInit = {}): Promise<any> => {
  const token = await getStoredToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 7000);

  try {
    // Try primary URL first
    let url = `${API_URL}${endpoint}`;
    let res = await fetch(url, {
      ...options,
      headers,
      signal: controller.signal,
    });

    // If primary returned 302 or redirect or 401 Vercel Protection, try alternate URL
    if ((res.status === 401 || res.status === 302 || !res.ok) && API_URL === PRODUCTION_API_URL) {
      const altUrl = `${ALT_PRODUCTION_API_URL}${endpoint}`;
      try {
        const altRes = await fetch(altUrl, {
          ...options,
          headers,
          signal: controller.signal,
        });
        if (altRes.ok) {
          res = altRes;
        }
      } catch {}
    }

    clearTimeout(timeoutId);

    const json = await res.json().catch(() => null);
    if (!res.ok) {
      throw new Error(json?.message || `HTTP ${res.status}: ${res.statusText}`);
    }
    return json;
  } catch (err: any) {
    clearTimeout(timeoutId);
    throw err;
  }
};

// Data mappers to keep mobile UI state strongly typed
export const mapBackendProductToMobile = (p: any): Product => ({
  id: p._id || p.id,
  name: p.name,
  price: p.discountedPriceKobo ? Math.round(p.discountedPriceKobo / 100) : (p.price || 0),
  originalPrice: p.regularPriceKobo ? Math.round(p.regularPriceKobo / 100) : (p.originalPrice || undefined),
  rating: p.rating || 4.5,
  reviewCount: p.reviewCount || 12,
  image: (p.images && p.images[0]) || p.image || 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&q=80',
  category: p.category || 'general',
  description: p.description || '',
  colors: p.colors && p.colors.length > 0 ? p.colors : ['#15152D'],
  sizes: p.sizes && p.sizes.length > 0 ? p.sizes : ['M', 'L'],
  stock: p.stock ?? 10,
  isFeatured: Boolean(p.isFeatured),
  isPopular: (p.salesCount || 0) > 15,
});

export const mapBackendCategoryToMobile = (c: any): Category => ({
  id: c.slug || c.id || c._id,
  name: c.name,
  icon: c.icon || 'grid-outline',
  itemCount: c.productCount || 100,
  countLabel: c.countLabel || `(${c.productCount || 100}+)`,
  image: c.image || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80',
  color: '#5135ED',
  backgroundColor: '#F7F7FC',
});

// ==========================================
// 1. Catalog APIs
// ==========================================
export const fetchProductsFromAPI = async (category?: string): Promise<Product[] | null> => {
  try {
    const endpoint = category && category !== 'all' && category !== 'All'
      ? `/customer/products?category=${encodeURIComponent(category.toLowerCase())}`
      : '/customer/products';
    const json = await request(endpoint);
    if (json?.data?.products && Array.isArray(json.data.products)) {
      return json.data.products.map(mapBackendProductToMobile);
    }
    return null;
  } catch (e) {
    return null;
  }
};

export const fetchProductByIdFromAPI = async (id: string): Promise<Product | null> => {
  try {
    const json = await request(`/customer/products/${id}`);
    if (json?.data?.product) {
      return mapBackendProductToMobile(json.data.product);
    }
    return null;
  } catch (e) {
    return null;
  }
};

export const fetchCategoriesFromAPI = async (): Promise<Category[] | null> => {
  try {
    const json = await request('/customer/categories');
    if (json?.data?.categories && Array.isArray(json.data.categories)) {
      return json.data.categories.map(mapBackendCategoryToMobile);
    }
    return null;
  } catch (e) {
    return null;
  }
};

// ==========================================
// 2. Customer Auth APIs
// ==========================================
export const loginCustomerAPI = async (email: string, password?: string): Promise<any> => {
  const json = await request('/customer/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password: password || 'Customer@123456' }),
  });
  if (json?.data?.token) {
    await setStoredToken(json.data.token);
  }
  return json?.data;
};

export const registerCustomerAPI = async (
  name: string,
  email: string,
  phone: string,
  password?: string
): Promise<any> => {
  const json = await request('/customer/auth/register', {
    method: 'POST',
    body: JSON.stringify({
      name,
      email,
      phone,
      password: password || 'Customer@123456',
    }),
  });
  if (json?.data?.token) {
    await setStoredToken(json.data.token);
  }
  return json?.data;
};

export const fetchCustomerProfileAPI = async (): Promise<any> => {
  const json = await request('/customer/auth/profile');
  return json?.data?.customer || null;
};

// ==========================================
// 3. Customer Orders APIs
// ==========================================
export const createCustomerOrderAPI = async (orderPayload: {
  items: Array<{
    productId: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
    selectedColor?: string;
    selectedSize?: string;
  }>;
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  deliveryAddress: string;
  paymentMethod: string;
}): Promise<any> => {
  const backendPayload = {
    items: orderPayload.items.map((it) => ({
      product: it.productId,
      name: it.name,
      priceKobo: Math.round(it.price * 100),
      quantity: it.quantity,
      image: it.image,
      selectedColor: it.selectedColor,
      selectedSize: it.selectedSize,
    })),
    shippingAddress: {
      fullName: 'Customer',
      phone: '+234 800 000 0000',
      addressLine1: orderPayload.deliveryAddress,
      city: 'Lagos',
      state: 'Lagos State',
      postalCode: '100001',
      country: 'Nigeria',
    },
    paymentMethod: orderPayload.paymentMethod,
    subtotalKobo: Math.round(orderPayload.subtotal * 100),
    shippingFeeKobo: Math.round(orderPayload.deliveryFee * 100),
    discountKobo: Math.round(orderPayload.discount * 100),
    totalKobo: Math.round(orderPayload.total * 100),
  };

  const json = await request('/customer/orders', {
    method: 'POST',
    body: JSON.stringify(backendPayload),
  });
  return json?.data?.order || null;
};

export const fetchCustomerOrdersAPI = async (): Promise<Order[] | null> => {
  try {
    const json = await request('/customer/orders');
    if (json?.data?.orders && Array.isArray(json.data.orders)) {
      return json.data.orders.map((o: any) => ({
        id: o.orderId || o.orderNumber || o._id,
        date: new Date(o.createdAt).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
        status: o.orderStatus || 'Pending',
        trackingNumber: o.trackingNumber || `TRK-${o.orderNumber || '000'}`,
        deliveryAddress: typeof o.shippingAddress === 'string'
          ? o.shippingAddress
          : `${o.shippingAddress?.addressLine1 || ''}, ${o.shippingAddress?.city || ''}`,
        paymentMethod: o.paymentMethod || 'Paystack',
        subtotal: Math.round((o.subtotalKobo || 0) / 100),
        deliveryFee: Math.round((o.shippingFeeKobo || 0) / 100),
        discount: Math.round((o.discountKobo || 0) / 100),
        total: Math.round((o.totalKobo || 0) / 100),
        estimatedDelivery: 'Estimated 2-3 business days',
        items: (o.items || []).map((it: any) => ({
          productId: it.product?._id || it.product || 'prod',
          name: it.name,
          price: Math.round((it.priceKobo || 0) / 100),
          quantity: it.quantity || 1,
          image: it.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
          selectedColor: it.selectedColor,
          selectedSize: it.selectedSize,
        })),
      }));
    }
    return null;
  } catch (e) {
    return null;
  }
};

// ==========================================
// 4. Check Backend Health
// ==========================================
export const checkBackendHealth = async (): Promise<{ isConnected: boolean; message: string }> => {
  try {
    const json = await request('/health');
    return { isConnected: json?.status === 'ok', message: 'Online' };
  } catch (e: any) {
    return { isConnected: false, message: e.message || 'Offline' };
  }
};
