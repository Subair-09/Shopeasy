import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../constants/colors';
import { CustomButton } from './CustomButton';

interface EmptyOrdersProps {
  statusFilter?: string;
  onExploreProducts: () => void;
}

export const EmptyOrders: React.FC<EmptyOrdersProps> = ({ statusFilter, onExploreProducts }) => {
  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        <Ionicons name="receipt-outline" size={48} color={Colors.primary} />
      </View>
      <Text style={styles.title}>
        {statusFilter && statusFilter !== 'All'
          ? `No ${statusFilter} Orders`
          : 'No Orders Yet'}
      </Text>
      <Text style={styles.description}>
        {statusFilter && statusFilter !== 'All'
          ? `You don't have any orders marked as ${statusFilter.toLowerCase()} at this time.`
          : 'You have not placed any orders yet. Discover thousands of great products now!'}
      </Text>
      <CustomButton
        title="Start Shopping"
        onPress={onExploreProducts}
        size="medium"
        style={styles.button}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    paddingHorizontal: 24,
  },
  iconCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: Colors.lightPurple,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.primaryText,
    marginBottom: 6,
    textAlign: 'center',
  },
  description: {
    fontSize: 13,
    color: Colors.secondaryText,
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: 20,
    maxWidth: 280,
  },
  button: {
    paddingHorizontal: 28,
  },
});
