import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Order } from '../types';
import Colors from '../constants/colors';
import { formatNaira } from '../utils/currency';
import { OrderStatusBadge } from './OrderStatusBadge';

interface OrderCardProps {
  order: Order;
  onPressDetails: (order: Order) => void;
  style?: ViewStyle;
}

export const OrderCard: React.FC<OrderCardProps> = ({ order, onPressDetails, style }) => {
  const firstItem = order.items[0];

  return (
    <View style={[styles.card, style]}>
      {/* Top Header: Order ID & Status Badge */}
      <View style={styles.topRow}>
        <Text style={styles.orderId}>#{order.id}</Text>
        <OrderStatusBadge status={order.status} />
      </View>

      {/* Date Row with Calendar icon */}
      <View style={styles.dateRow}>
        <Ionicons name="calendar-outline" size={14} color={Colors.secondaryText} />
        <Text style={styles.dateText}>{order.date}</Text>
      </View>

      {/* Middle Item Row */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => onPressDetails(order)}
        style={styles.itemRow}
      >
        <View style={styles.imageWrapper}>
          {firstItem && (
            <Image
              source={{ uri: firstItem.image }}
              style={styles.productImage}
              resizeMode="cover"
            />
          )}
        </View>

        <View style={styles.itemInfo}>
          <Text style={styles.productName} numberOfLines={1}>
            {firstItem?.name || 'Order Item'}
          </Text>
          <Text style={styles.productPrice}>
            {formatNaira(firstItem?.price || order.total)}
          </Text>
          <Text style={styles.qtyText}>
            Qty: {firstItem?.quantity || 1}
            {order.items.length > 1 ? ` (+${order.items.length - 1} more)` : ''}
          </Text>
        </View>

        <Ionicons name="chevron-forward" size={18} color={Colors.secondaryText} />
      </TouchableOpacity>

      {/* Bottom Button: View Details */}
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => onPressDetails(order)}
        style={styles.detailsButton}
      >
        <Text style={styles.detailsButtonText}>View Details</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 16,
    shadowColor: '#15152D',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  orderId: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.primaryText,
    letterSpacing: -0.2,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 14,
  },
  dateText: {
    fontSize: 13,
    color: Colors.secondaryText,
    fontWeight: '500',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  imageWrapper: {
    width: 68,
    height: 68,
    borderRadius: 14,
    backgroundColor: '#F5F5FA',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  itemInfo: {
    flex: 1,
    marginLeft: 14,
    justifyContent: 'center',
  },
  productName: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.primaryText,
    marginBottom: 3,
  },
  productPrice: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.primary,
    marginBottom: 3,
  },
  qtyText: {
    fontSize: 12,
    color: Colors.secondaryText,
    fontWeight: '500',
  },
  detailsButton: {
    width: '100%',
    height: 44,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: Colors.primary,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailsButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primary,
  },
});
