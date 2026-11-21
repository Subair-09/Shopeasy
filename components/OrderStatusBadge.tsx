import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { OrderStatus } from '../types';
import Colors from '../constants/colors';

interface OrderStatusBadgeProps {
  status: OrderStatus;
  style?: ViewStyle;
}

export const OrderStatusBadge: React.FC<OrderStatusBadgeProps> = ({ status, style }) => {
  const getBadgeTheme = () => {
    switch (status) {
      case 'Delivered':
        return { bg: '#E8F7F0', text: Colors.success };
      case 'Processing':
        return { bg: '#FEF3C7', text: '#D97706' };
      case 'Shipped':
        return { bg: '#E0F2FE', text: '#0284C7' };
      case 'Pending':
        return { bg: '#FEF9C3', text: '#CA8A04' };
      case 'Cancelled':
        return { bg: Colors.errorLight, text: Colors.error };
      default:
        return { bg: Colors.inputBackground, text: Colors.secondaryText };
    }
  };

  const theme = getBadgeTheme();

  return (
    <View style={[styles.badge, { backgroundColor: theme.bg }, style]}>
      <Text style={[styles.badgeText, { color: theme.text }]}>{status}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
});
