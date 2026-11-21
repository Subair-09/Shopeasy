import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/colors';
import { Header } from '../../components/Header';
import { CustomButton } from '../../components/CustomButton';
import { useCart } from '../../context/CartContext';
import { useOrders } from '../../context/OrdersContext';
import { useAuth } from '../../context/AuthContext';
import { formatNaira } from '../../utils/currency';

type DeliveryMethod = 'standard' | 'express';
type PaymentMethod = 'paystack' | 'bank_transfer' | 'cod';

export default function CheckoutScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { cart, subtotal, discountAmount, clearCart } = useCart();
  const { placeOrder } = useOrders();

  const [selectedAddressIndex, setSelectedAddressIndex] = useState<number>(0);
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>('standard');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('paystack');
  const [placingOrder, setPlacingOrder] = useState<boolean>(false);

  const deliveryFee = deliveryMethod === 'standard' ? (subtotal >= 80000 ? 0 : 2500) : 5000;
  const finalTotal = Math.max(0, subtotal - discountAmount + deliveryFee);

  const activeAddress = user?.addresses[selectedAddressIndex] || {
    id: 'default',
    title: 'Home',
    street: '14 Admiralty Way, Lekki Phase 1',
    city: 'Lagos',
    state: 'Lagos State',
    isDefault: true,
  };

  const handlePlaceOrder = async () => {
    const checkoutItems = cart.filter((item) => item.selected !== false);
    if (checkoutItems.length === 0) {
      Alert.alert('No Items Selected', 'Please select at least one item from your cart before proceeding.');
      return;
    }

    setPlacingOrder(true);

    try {
      const orderItems = checkoutItems.map((item) => ({
        productId: item.product.id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        image: item.product.image,
        selectedColor: item.selectedColor,
        selectedSize: item.selectedSize,
      }));

      const paymentLabel =
        paymentMethod === 'paystack'
          ? 'Paystack (Card / USSD)'
          : paymentMethod === 'bank_transfer'
          ? 'Direct Bank Transfer'
          : 'Cash on Delivery';

      const placedOrder = await placeOrder({
        items: orderItems,
        subtotal,
        deliveryFee,
        discount: discountAmount,
        total: finalTotal,
        status: 'Processing',
        deliveryAddress: `${activeAddress.street}, ${activeAddress.city}, ${activeAddress.state}`,
        paymentMethod: paymentLabel,
      });

      clearCart();

      router.replace({
        pathname: '/checkout/success',
        params: {
          orderId: placedOrder.id,
          total: `${placedOrder.total}`,
        },
      });
    } catch {
      Alert.alert('Error', 'Unable to complete order. Please try again.');
    } finally {
      setPlacingOrder(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <Header title="Checkout" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Delivery Address Card */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Ionicons name="location-outline" size={20} color={Colors.primary} />
              <Text style={styles.sectionTitle}>Delivery Address</Text>
            </View>
            <TouchableOpacity onPress={() => router.push('/profile/addresses')}>
              <Text style={styles.changeLink}>Change</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.addressBox}>
            <View style={styles.addressTop}>
              <Text style={styles.addressTag}>{activeAddress.title}</Text>
              <Text style={styles.contactName}>{user?.name || 'Customer'}</Text>
            </View>
            <Text style={styles.addressStreet}>{activeAddress.street}</Text>
            <Text style={styles.addressCity}>
              {activeAddress.city}, {activeAddress.state}
            </Text>
            <Text style={styles.addressPhone}>Phone: {user?.phone || '+234 812 345 6789'}</Text>
          </View>
        </View>

        {/* Delivery Method */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Ionicons name="car-outline" size={20} color={Colors.primary} />
              <Text style={styles.sectionTitle}>Delivery Method</Text>
            </View>
          </View>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setDeliveryMethod('standard')}
            style={[
              styles.methodOption,
              deliveryMethod === 'standard' && styles.methodOptionActive,
            ]}
          >
            <View style={styles.methodRadio}>
              {deliveryMethod === 'standard' && <View style={styles.methodRadioInner} />}
            </View>
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={styles.methodTitle}>Standard Delivery</Text>
              <Text style={styles.methodSubtitle}>Estimated 2-3 business days</Text>
            </View>
            <Text style={styles.methodPrice}>
              {subtotal >= 80000 ? 'FREE' : '₦2,500'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setDeliveryMethod('express')}
            style={[
              styles.methodOption,
              deliveryMethod === 'express' && styles.methodOptionActive,
            ]}
          >
            <View style={styles.methodRadio}>
              {deliveryMethod === 'express' && <View style={styles.methodRadioInner} />}
            </View>
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={styles.methodTitle}>Express Same-Day Delivery</Text>
              <Text style={styles.methodSubtitle}>Delivered within 6 hours in Lagos</Text>
            </View>
            <Text style={styles.methodPrice}>₦5,000</Text>
          </TouchableOpacity>
        </View>

        {/* Ordered Items Preview */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Ionicons name="bag-check-outline" size={20} color={Colors.primary} />
              <Text style={styles.sectionTitle}>
                Order Items ({cart.filter((i) => i.selected !== false).length})
              </Text>
            </View>
          </View>

          <View style={styles.itemsPreviewRow}>
            {cart
              .filter((i) => i.selected !== false)
              .map((item) => (
                <View key={item.product.id} style={styles.itemThumbWrapper}>
                  <Image source={{ uri: item.product.image }} style={styles.itemThumb} />
                  <View style={styles.qtyBadge}>
                    <Text style={styles.qtyBadgeText}>{item.quantity}</Text>
                  </View>
                </View>
              ))}
          </View>
        </View>

        {/* Payment Method Selector */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Ionicons name="wallet-outline" size={20} color={Colors.primary} />
              <Text style={styles.sectionTitle}>Payment Method</Text>
            </View>
          </View>

          {/* Paystack Option */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setPaymentMethod('paystack')}
            style={[
              styles.methodOption,
              paymentMethod === 'paystack' && styles.methodOptionActive,
            ]}
          >
            <View style={styles.methodRadio}>
              {paymentMethod === 'paystack' && <View style={styles.methodRadioInner} />}
            </View>
            <View style={{ flex: 1, marginLeft: 10 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Text style={styles.methodTitle}>Paystack Payment</Text>
                <View style={styles.paystackPill}>
                  <Text style={styles.paystackPillText}>RECOMMENDED</Text>
                </View>
              </View>
              <Text style={styles.methodSubtitle}>Debit Card, USSD, Bank Account</Text>
            </View>
            <Ionicons name="card" size={22} color={Colors.primary} />
          </TouchableOpacity>

          {/* Bank Transfer */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setPaymentMethod('bank_transfer')}
            style={[
              styles.methodOption,
              paymentMethod === 'bank_transfer' && styles.methodOptionActive,
            ]}
          >
            <View style={styles.methodRadio}>
              {paymentMethod === 'bank_transfer' && <View style={styles.methodRadioInner} />}
            </View>
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={styles.methodTitle}>Direct Bank Transfer</Text>
              <Text style={styles.methodSubtitle}>Transfer via Nigerian bank apps</Text>
            </View>
            <Ionicons name="business-outline" size={20} color={Colors.secondaryText} />
          </TouchableOpacity>

          {/* Cash on Delivery */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setPaymentMethod('cod')}
            style={[
              styles.methodOption,
              paymentMethod === 'cod' && styles.methodOptionActive,
            ]}
          >
            <View style={styles.methodRadio}>
              {paymentMethod === 'cod' && <View style={styles.methodRadioInner} />}
            </View>
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={styles.methodTitle}>Cash on Delivery</Text>
              <Text style={styles.methodSubtitle}>Pay upon receiving package</Text>
            </View>
            <Ionicons name="cash-outline" size={20} color={Colors.secondaryText} />
          </TouchableOpacity>
        </View>

        {/* Order Summary */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Order Summary</Text>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>{formatNaira(subtotal)}</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Delivery Fee</Text>
            <Text
              style={[
                styles.summaryValue,
                deliveryFee === 0 && { color: Colors.success, fontWeight: '700' },
              ]}
            >
              {deliveryFee === 0 ? 'FREE' : formatNaira(deliveryFee)}
            </Text>
          </View>

          {discountAmount > 0 && (
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: Colors.success }]}>Discount</Text>
              <Text style={[styles.summaryValue, { color: Colors.success, fontWeight: '700' }]}>
                -{formatNaira(discountAmount)}
              </Text>
            </View>
          )}

          <View style={styles.summaryDivider} />

          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Total Payable</Text>
            <Text style={styles.totalValue}>{formatNaira(finalTotal)}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Place Order Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.bottomPriceCol}>
          <Text style={styles.bottomPriceLabel}>Total Amount</Text>
          <Text style={styles.bottomPriceValue}>{formatNaira(finalTotal)}</Text>
        </View>

        <CustomButton
          title="Place Order"
          onPress={handlePlaceOrder}
          loading={placingOrder}
          icon={<Ionicons name="checkmark-circle" size={18} color={Colors.white} />}
          style={styles.placeOrderButton}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 24,
    gap: 14,
  },
  sectionCard: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.primaryText,
  },
  changeLink: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primary,
  },
  addressBox: {
    backgroundColor: Colors.inputBackground,
    borderRadius: 14,
    padding: 12,
  },
  addressTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  addressTag: {
    backgroundColor: Colors.lightPurple,
    color: Colors.primary,
    fontSize: 11,
    fontWeight: '700',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  contactName: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primaryText,
  },
  addressStreet: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primaryText,
    marginBottom: 2,
  },
  addressCity: {
    fontSize: 13,
    color: Colors.secondaryText,
    marginBottom: 4,
  },
  addressPhone: {
    fontSize: 12,
    color: Colors.secondaryText,
  },
  methodOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: Colors.border,
    marginBottom: 8,
    backgroundColor: Colors.white,
  },
  methodOptionActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.subtlePurple,
  },
  methodRadio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  methodRadioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.primary,
  },
  methodTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primaryText,
  },
  methodSubtitle: {
    fontSize: 12,
    color: Colors.secondaryText,
    marginTop: 2,
  },
  methodPrice: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.primaryText,
  },
  paystackPill: {
    backgroundColor: '#FFEAA7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  paystackPillText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#D68910',
  },
  itemsPreviewRow: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
  },
  itemThumbWrapper: {
    position: 'relative',
  },
  itemThumb: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: '#F5F5FA',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  qtyBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: Colors.primary,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  qtyBadgeText: {
    color: Colors.white,
    fontSize: 10,
    fontWeight: '800',
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  summaryLabel: {
    fontSize: 14,
    color: Colors.secondaryText,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primaryText,
  },
  summaryDivider: {
    height: 1,
    backgroundColor: Colors.divider,
    marginVertical: 12,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.primaryText,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '900',
    color: Colors.primary,
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 8,
  },
  bottomPriceCol: {
    marginRight: 14,
  },
  bottomPriceLabel: {
    fontSize: 11,
    color: Colors.secondaryText,
    fontWeight: '600',
  },
  bottomPriceValue: {
    fontSize: 18,
    fontWeight: '900',
    color: Colors.primary,
  },
  placeOrderButton: {
    flex: 1,
    borderRadius: 16,
  },
});
