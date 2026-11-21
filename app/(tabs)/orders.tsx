import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/colors';
import { useOrders } from '../../context/OrdersContext';
import { useNotifications } from '../../context/NotificationsContext';
import { Order, OrderStatus } from '../../types';
import { formatNaira } from '../../utils/currency';
import { OrderCard } from '../../components/OrderCard';
import { OrderFilterTabs, FilterTab } from '../../components/OrderFilterTabs';
import { OrderStatusBadge } from '../../components/OrderStatusBadge';
import { EmptyOrders } from '../../components/EmptyOrders';
import { CustomButton } from '../../components/CustomButton';

const FILTER_TABS: FilterTab[] = [
  'All',
  'Pending',
  'Processing',
  'Shipped',
  'Delivered',
  'Cancelled',
];

export default function OrdersScreen() {
  const router = useRouter();
  const { orders } = useOrders();
  const { unreadCount } = useNotifications();

  const [activeTab, setActiveTab] = useState<FilterTab>('All');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filteredOrders = useMemo(() => {
    if (activeTab === 'All') return orders;
    return orders.filter((o) => o.status === activeTab);
  }, [orders, activeTab]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      {/* Top Header matching reference image (Phone 2) */}
      <View style={styles.headerBar}>
        <Text style={styles.headerTitle}>My Orders</Text>

        <TouchableOpacity
          activeOpacity={0.75}
          onPress={() => router.push('/notifications')}
          style={styles.notificationBtn}
        >
          <Ionicons name="notifications-outline" size={24} color={Colors.primaryText} />
          {unreadCount > 0 && (
            <View style={styles.badgeContainer}>
              <Text style={styles.badgeText}>
                {unreadCount > 9 ? '9+' : unreadCount}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Horizontally Scrollable Filter Tabs */}
      <OrderFilterTabs
        tabs={FILTER_TABS}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
      />

      {/* Orders List / Empty State */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredOrders.length === 0 ? (
          <EmptyOrders
            statusFilter={activeTab}
            onExploreProducts={() => router.push('/(tabs)/home')}
          />
        ) : (
          filteredOrders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onPressDetails={(ord) => setSelectedOrder(ord)}
            />
          ))
        )}
      </ScrollView>

      {/* Order Details Modal */}
      <Modal
        visible={!!selectedOrder}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedOrder(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalOrderId}>Order #{selectedOrder?.id}</Text>
                <Text style={styles.modalDate}>{selectedOrder?.date}</Text>
              </View>
              <TouchableOpacity
                onPress={() => setSelectedOrder(null)}
                style={styles.modalCloseBtn}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Ionicons name="close" size={24} color={Colors.primaryText} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 420 }}>
              {/* Status Header */}
              {selectedOrder && (
                <View style={styles.modalStatusRow}>
                  <Text style={styles.modalStatusLabel}>Order Status:</Text>
                  <OrderStatusBadge status={selectedOrder.status} />
                </View>
              )}

              {/* Items List */}
              <Text style={styles.sectionHeading}>Items in Order</Text>
              {selectedOrder?.items.map((item, index) => (
                <View key={index} style={styles.modalItemRow}>
                  <Image source={{ uri: item.image }} style={styles.modalItemImage} />
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={styles.modalItemName} numberOfLines={1}>
                      {item.name}
                    </Text>
                    <Text style={styles.modalItemMeta}>
                      Qty: {item.quantity} • {formatNaira(item.price)}
                    </Text>
                  </View>
                  <Text style={styles.modalItemPrice}>
                    {formatNaira(item.price * item.quantity)}
                  </Text>
                </View>
              ))}

              {/* Shipping Address */}
              <Text style={styles.sectionHeading}>Delivery Address</Text>
              <View style={styles.infoBox}>
                <Ionicons name="location-outline" size={18} color={Colors.primary} />
                <Text style={styles.infoBoxText}>{selectedOrder?.deliveryAddress}</Text>
              </View>

              {/* Payment Details */}
              <Text style={styles.sectionHeading}>Payment Method</Text>
              <View style={styles.infoBox}>
                <Ionicons name="card-outline" size={18} color={Colors.primary} />
                <Text style={styles.infoBoxText}>{selectedOrder?.paymentMethod}</Text>
              </View>

              {/* Summary Breakdown */}
              <View style={styles.breakdownBox}>
                <View style={styles.breakdownRow}>
                  <Text style={styles.breakdownLabel}>Subtotal</Text>
                  <Text style={styles.breakdownValue}>
                    {formatNaira(selectedOrder?.subtotal || 0)}
                  </Text>
                </View>
                <View style={styles.breakdownRow}>
                  <Text style={styles.breakdownLabel}>Delivery Fee</Text>
                  <Text style={styles.breakdownValue}>
                    {selectedOrder?.deliveryFee === 0
                      ? 'FREE'
                      : formatNaira(selectedOrder?.deliveryFee || 0)}
                  </Text>
                </View>
                {selectedOrder && selectedOrder.discount > 0 && (
                  <View style={styles.breakdownRow}>
                    <Text style={[styles.breakdownLabel, { color: Colors.success }]}>
                      Discount
                    </Text>
                    <Text style={[styles.breakdownValue, { color: Colors.success }]}>
                      -{formatNaira(selectedOrder.discount)}
                    </Text>
                  </View>
                )}
                <View style={styles.breakdownDivider} />
                <View style={styles.breakdownRow}>
                  <Text style={styles.breakdownTotalLabel}>Total Paid</Text>
                  <Text style={styles.breakdownTotalValue}>
                    {formatNaira(selectedOrder?.total || 0)}
                  </Text>
                </View>
              </View>
            </ScrollView>

            <CustomButton
              title="Close Details"
              onPress={() => setSelectedOrder(null)}
              style={{ marginTop: 16 }}
            />
          </View>
        </View>
      </Modal>
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
    paddingBottom: 6,
    backgroundColor: Colors.background,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: Colors.primaryText,
    letterSpacing: -0.5,
  },
  notificationBtn: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  badgeContainer: {
    position: 'absolute',
    top: 6,
    right: 4,
    backgroundColor: Colors.error,
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    color: Colors.white,
    fontSize: 9,
    fontWeight: '900',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 24,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: Colors.overlay,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  modalOrderId: {
    fontSize: 18,
    fontWeight: '900',
    color: Colors.primaryText,
  },
  modalDate: {
    fontSize: 12,
    color: Colors.secondaryText,
    marginTop: 2,
  },
  modalCloseBtn: {
    padding: 4,
  },
  modalStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.inputBackground,
    padding: 12,
    borderRadius: 14,
    marginBottom: 16,
  },
  modalStatusLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primaryText,
  },
  sectionHeading: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.primaryText,
    marginTop: 12,
    marginBottom: 8,
  },
  modalItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: Colors.inputBackground,
    padding: 10,
    borderRadius: 12,
  },
  modalItemImage: {
    width: 48,
    height: 48,
    borderRadius: 10,
    backgroundColor: Colors.white,
  },
  modalItemName: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primaryText,
  },
  modalItemMeta: {
    fontSize: 11,
    color: Colors.secondaryText,
    marginTop: 2,
  },
  modalItemPrice: {
    fontSize: 13,
    fontWeight: '900',
    color: Colors.primary,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: Colors.inputBackground,
    padding: 12,
    borderRadius: 12,
  },
  infoBoxText: {
    fontSize: 13,
    color: Colors.primaryText,
    flex: 1,
    lineHeight: 18,
  },
  breakdownBox: {
    backgroundColor: Colors.inputBackground,
    borderRadius: 14,
    padding: 14,
    marginTop: 16,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  breakdownLabel: {
    fontSize: 13,
    color: Colors.secondaryText,
  },
  breakdownValue: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.primaryText,
  },
  breakdownDivider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 8,
  },
  breakdownTotalLabel: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.primaryText,
  },
  breakdownTotalValue: {
    fontSize: 16,
    fontWeight: '900',
    color: Colors.primary,
  },
});
