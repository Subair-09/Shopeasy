import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/colors';
import { useCart } from '../../context/CartContext';
import { CartItemCard } from '../../components/CartItemCard';
import { PromoCodeInput } from '../../components/PromoCodeInput';
import { OrderSummary } from '../../components/OrderSummary';
import { EmptyCart } from '../../components/EmptyCart';
import { CustomButton } from '../../components/CustomButton';
import { Toast } from '../../components/Toast';

export default function CartScreen() {
  const router = useRouter();
  const {
    cart,
    removeFromCart,
    updateQuantity,
    toggleSelect,
    clearCart,
    subtotal,
    deliveryFee,
    discountAmount,
    total,
    appliedPromo,
    applyPromoCode,
    removePromoCode,
    selectedCount,
  } = useCart();

  const [inputCode, setInputCode] = useState<string>('');
  const [toastVisible, setToastVisible] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>('');
  const [toastType, setToastType] = useState<'success' | 'error' | 'info'>('success');

  const handleApplyPromo = () => {
    const res = applyPromoCode(inputCode);
    setToastMessage(res.message);
    setToastType(res.success ? 'success' : 'error');
    setToastVisible(true);
    if (res.success) {
      setInputCode('');
    }
  };

  const confirmRemoveItem = (id: string, name: string) => {
    Alert.alert('Remove Item', `Remove "${name}" from your cart?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: () => removeFromCart(id),
      },
    ]);
  };

  const confirmClearAll = () => {
    Alert.alert('Clear Cart', 'Are you sure you want to remove all items from your cart?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Clear All',
        style: 'destructive',
        onPress: () => {
          clearCart();
          setToastMessage('Cart has been cleared');
          setToastType('info');
          setToastVisible(true);
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      {/* Top Header matching reference image (Phone 3) */}
      <View style={styles.headerBar}>
        <Text style={styles.headerTitle}>My Cart</Text>

        {cart.length > 0 && (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={confirmClearAll}
            style={styles.clearAllBtn}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="trash-outline" size={18} color={Colors.error} />
            <Text style={styles.clearAllText}>Clear All</Text>
          </TouchableOpacity>
        )}
      </View>

      <Toast
        visible={toastVisible}
        message={toastMessage}
        type={toastType}
        onHide={() => setToastVisible(false)}
      />

      {cart.length === 0 ? (
        <EmptyCart onStartShopping={() => router.push('/(tabs)/home')} />
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Cart Products List */}
          <View style={styles.itemsSection}>
            {cart.map((item) => (
              <CartItemCard
                key={item.product.id}
                item={item}
                onToggleSelect={toggleSelect}
                onIncrement={(id) => updateQuantity(id, item.quantity + 1)}
                onDecrement={(id) => updateQuantity(id, item.quantity - 1)}
                onRemove={confirmRemoveItem}
              />
            ))}
          </View>

          {/* Promo Code Input */}
          <PromoCodeInput
            value={inputCode}
            onChangeText={setInputCode}
            onApply={handleApplyPromo}
            appliedPromo={appliedPromo}
            onRemovePromo={removePromoCode}
            placeholder="Enter promo code"
          />

          {/* Dynamic Order Summary */}
          <OrderSummary
            subtotal={subtotal}
            deliveryFee={deliveryFee}
            discountAmount={discountAmount}
            total={total}
          />

          {/* Proceed to Checkout Button matching reference image */}
          <CustomButton
            title="Proceed to Checkout"
            onPress={() => router.push('/checkout')}
            disabled={selectedCount === 0}
            icon={<Ionicons name="arrow-forward" size={18} color={Colors.white} />}
            iconPosition="right"
            style={styles.checkoutBtn}
          />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
    backgroundColor: Colors.background,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: Colors.primaryText,
    letterSpacing: -0.5,
  },
  clearAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 6,
  },
  clearAllText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.error,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 28,
  },
  itemsSection: {
    marginBottom: 8,
  },
  checkoutBtn: {
    marginTop: 10,
    marginBottom: 16,
    borderRadius: 20,
    height: 56,
  },
});
