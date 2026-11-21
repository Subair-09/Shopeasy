import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from '../context/AuthContext';
import { CartProvider } from '../context/CartContext';
import { FavoritesProvider } from '../context/FavoritesContext';
import { OrdersProvider } from '../context/OrdersContext';
import { NotificationsProvider } from '../context/NotificationsContext';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <CartProvider>
          <FavoritesProvider>
            <OrdersProvider>
              <NotificationsProvider>
                <StatusBar style="auto" />
                <Stack
                  screenOptions={{
                    headerShown: false,
                    animation: 'slide_from_right',
                  }}
                >
                  <Stack.Screen name="index" />
                  <Stack.Screen name="(auth)" options={{ headerShown: false }} />
                  <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                  <Stack.Screen name="products/index" options={{ headerShown: false }} />
                  <Stack.Screen name="products/[id]" options={{ headerShown: false }} />
                  <Stack.Screen name="checkout/index" options={{ headerShown: false }} />
                  <Stack.Screen name="checkout/success" options={{ headerShown: false }} />
                  <Stack.Screen name="notifications/index" options={{ headerShown: false }} />
                  <Stack.Screen name="profile/edit" options={{ headerShown: false }} />
                  <Stack.Screen name="profile/addresses" options={{ headerShown: false }} />
                  <Stack.Screen name="profile/payment-methods" options={{ headerShown: false }} />
                  <Stack.Screen name="profile/settings" options={{ headerShown: false }} />
                </Stack>
              </NotificationsProvider>
            </OrdersProvider>
          </FavoritesProvider>
        </CartProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
