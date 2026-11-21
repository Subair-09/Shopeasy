import { Platform } from 'react-native';

// In development:
// Android Emulator uses 10.0.2.2
// iOS Simulator uses localhost
// Physical device uses your machine's LAN IP or ngrok tunnel
const DEV_API_URL = Platform.select({
  android: 'http://10.0.2.2:5000/api/v1',
  ios: 'http://localhost:5000/api/v1',
  default: 'http://localhost:5000/api/v1',
});

export const API_URL = DEV_API_URL;

export const fetchProductsFromAPI = async (category?: string) => {
  try {
    const url = category && category !== 'All'
      ? `${API_URL}/customer/products?category=${encodeURIComponent(category.toLowerCase())}`
      : `${API_URL}/customer/products`;
    const res = await fetch(url, { headers: { 'Content-Type': 'application/json' } });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data?.products || null;
  } catch (e) {
    return null;
  }
};

export const fetchCategoriesFromAPI = async () => {
  try {
    const res = await fetch(`${API_URL}/customer/categories`);
    if (!res.ok) return null;
    const json = await res.json();
    return json.data?.categories || null;
  } catch (e) {
    return null;
  }
};
