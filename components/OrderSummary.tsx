import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Colors from '../constants/colors';
import { formatNaira } from '../utils/currency';

interface OrderSummaryProps {
  subtotal: number;
  deliveryFee: number;
  discountAmount: number;
  total: number;
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({
  subtotal,
  deliveryFee,
  discountAmount,
  total,
}) => {
  return (
    <View style={styles.container}>
      {/* Subtotal */}
      <View style={styles.row}>
        <Text style={styles.label}>Subtotal</Text>
        <Text style={styles.value}>{formatNaira(subtotal)}</Text>
      </View>

      {/* Delivery Fee */}
      <View style={styles.row}>
        <Text style={styles.label}>Delivery Fee</Text>
        <Text style={styles.value}>
          {subtotal > 0 && deliveryFee === 0 ? 'FREE' : formatNaira(deliveryFee)}
        </Text>
      </View>

      {/* Discount */}
      <View style={styles.row}>
        <Text style={styles.label}>Discount</Text>
        <Text style={[styles.value, styles.discountValue]}>
          - {formatNaira(discountAmount)}
        </Text>
      </View>

      {/* Total Row */}
      <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>Total</Text>
        <Text style={styles.totalValue}>{formatNaira(total)}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    paddingVertical: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  label: {
    fontSize: 15,
    fontWeight: '500',
    color: Colors.secondaryText,
  },
  value: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.primaryText,
  },
  discountValue: {
    color: Colors.success,
  },
  totalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 18,
    marginBottom: 8,
  },
  totalLabel: {
    fontSize: 22,
    fontWeight: '900',
    color: Colors.primaryText,
    letterSpacing: -0.3,
  },
  totalValue: {
    fontSize: 22,
    fontWeight: '900',
    color: Colors.primary,
    letterSpacing: -0.3,
  },
});
