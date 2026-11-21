import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CartItem } from '../types';
import Colors from '../constants/colors';
import { formatNaira } from '../utils/currency';

interface CartItemCardProps {
  item: CartItem;
  onToggleSelect: (productId: string) => void;
  onIncrement: (productId: string) => void;
  onDecrement: (productId: string) => void;
  onRemove: (productId: string, productName: string) => void;
  style?: ViewStyle;
}

export const CartItemCard: React.FC<CartItemCardProps> = ({
  item,
  onToggleSelect,
  onIncrement,
  onDecrement,
  onRemove,
  style,
}) => {
  const isSelected = item.selected !== false;

  return (
    <View style={[styles.card, style]}>
      {/* Selection Checkbox */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => onToggleSelect(item.product.id)}
        style={styles.checkboxTouch}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
          {isSelected && <Ionicons name="checkmark" size={14} color={Colors.white} />}
        </View>
      </TouchableOpacity>

      {/* Product Image */}
      <View style={styles.imageWrapper}>
        <Image
          source={{ uri: item.product.image }}
          style={styles.productImage}
          resizeMode="contain"
        />
      </View>

      {/* Product Details & Actions */}
      <View style={styles.detailsCol}>
        <Text style={styles.productName} numberOfLines={1}>
          {item.product.name}
        </Text>
        <Text style={styles.productPrice}>
          {formatNaira(item.product.price)}
        </Text>

        {/* Bottom row: Stepper + Trash */}
        <View style={styles.actionRow}>
          {/* Stepper Pill matching reference image */}
          <View style={styles.stepperPill}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => onDecrement(item.product.id)}
              disabled={item.quantity <= 1}
              style={[styles.stepperBtn, item.quantity <= 1 && styles.stepperBtnDisabled]}
              hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
            >
              <Ionicons
                name="remove"
                size={16}
                color={item.quantity <= 1 ? Colors.mutedText : Colors.primary}
              />
            </TouchableOpacity>

            <Text style={styles.stepperCount}>{item.quantity}</Text>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => onIncrement(item.product.id)}
              style={styles.stepperBtn}
              hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
            >
              <Ionicons name="add" size={16} color={Colors.primary} />
            </TouchableOpacity>
          </View>

          {/* Individual Trash Icon */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => onRemove(item.product.id, item.product.name)}
            style={styles.trashBtn}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="trash-outline" size={18} color={Colors.primaryText} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 14,
    shadowColor: '#15152D',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  checkboxTouch: {
    paddingRight: 10,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
  },
  checkboxSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  imageWrapper: {
    width: 76,
    height: 76,
    borderRadius: 16,
    backgroundColor: '#F3F1FD',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 6,
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  detailsCol: {
    flex: 1,
    marginLeft: 14,
    justifyContent: 'center',
  },
  productName: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.primaryText,
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '900',
    color: Colors.primary,
    marginBottom: 8,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stepperPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0EEFF',
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 3,
  },
  stepperBtn: {
    width: 26,
    height: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperBtnDisabled: {
    opacity: 0.4,
  },
  stepperCount: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.primaryText,
    minWidth: 24,
    textAlign: 'center',
  },
  trashBtn: {
    padding: 6,
  },
});
