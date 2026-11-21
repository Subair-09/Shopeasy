import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/colors';
import { CustomButton } from '../../components/CustomButton';
import { formatNaira } from '../../utils/currency';

export default function CheckoutSuccessScreen() {
  const router = useRouter();
  const { orderId, total } = useLocalSearchParams<{ orderId?: string; total?: string }>();

  const numTotal = total ? parseFloat(total) : 0;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Celebration Circle */}
        <View style={styles.successIconCircle}>
          <Ionicons name="checkmark-circle" size={80} color={Colors.success} />
        </View>

        <Text style={styles.heading}>Order Placed Successfully!</Text>
        <Text style={styles.subheading}>
          Thank you for choosing ShopEasy. We have received your order and are preparing it for delivery.
        </Text>

        {/* Order Details Card */}
        <View style={styles.orderSummaryBox}>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Order Number</Text>
            <Text style={styles.valueHighlight}>#{orderId || 'SE-98241'}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Total Amount</Text>
            <Text style={styles.value}>{formatNaira(numTotal)}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Payment Status</Text>
            <Text style={[styles.value, { color: Colors.success, fontWeight: '700' }]}>
              Payment Confirmed
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Estimated Delivery</Text>
            <Text style={styles.value}>2-3 Business Days</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonsContainer}>
          <CustomButton
            title="Track Order"
            onPress={() => router.replace('/(tabs)/orders')}
            icon={<Ionicons name="receipt-outline" size={18} color={Colors.white} />}
            iconPosition="left"
            style={{ marginBottom: 12 }}
          />

          <CustomButton
            title="Continue Shopping"
            variant="outline"
            onPress={() => router.replace('/(tabs)/home')}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  successIconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.successLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  heading: {
    fontSize: 24,
    fontWeight: '900',
    color: Colors.primaryText,
    textAlign: 'center',
    marginBottom: 10,
  },
  subheading: {
    fontSize: 14,
    color: Colors.secondaryText,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 16,
    marginBottom: 28,
  },
  orderSummaryBox: {
    width: '100%',
    backgroundColor: Colors.inputBackground,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 32,
    gap: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 13,
    color: Colors.secondaryText,
  },
  value: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primaryText,
  },
  valueHighlight: {
    fontSize: 14,
    fontWeight: '900',
    color: Colors.primary,
  },
  buttonsContainer: {
    width: '100%',
  },
});
