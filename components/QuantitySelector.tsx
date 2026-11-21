import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../constants/colors';

interface QuantitySelectorProps {
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
  min?: number;
  max?: number;
  size?: 'small' | 'medium';
}

export const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  quantity,
  onIncrement,
  onDecrement,
  min = 1,
  max = 99,
  size = 'medium',
}) => {
  const isSmall = size === 'small';

  return (
    <View style={[styles.container, isSmall && styles.containerSmall]}>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={onDecrement}
        disabled={quantity <= min}
        style={[
          styles.button,
          isSmall && styles.buttonSmall,
          quantity <= min && styles.buttonDisabled,
        ]}
        hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
      >
        <Ionicons
          name="remove"
          size={isSmall ? 14 : 18}
          color={quantity <= min ? Colors.mutedText : Colors.primaryText}
        />
      </TouchableOpacity>

      <Text style={[styles.quantityText, isSmall && styles.quantityTextSmall]}>
        {quantity}
      </Text>

      <TouchableOpacity
        activeOpacity={0.7}
        onPress={onIncrement}
        disabled={quantity >= max}
        style={[
          styles.button,
          isSmall && styles.buttonSmall,
          quantity >= max && styles.buttonDisabled,
        ]}
        hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
      >
        <Ionicons
          name="add"
          size={isSmall ? 14 : 18}
          color={quantity >= max ? Colors.mutedText : Colors.primaryText}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.inputBackground,
    borderRadius: 24,
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  containerSmall: {
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 18,
  },
  button: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  },
  buttonSmall: {
    width: 26,
    height: 26,
    borderRadius: 13,
  },
  buttonDisabled: {
    opacity: 0.4,
  },
  quantityText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.primaryText,
    minWidth: 32,
    textAlign: 'center',
  },
  quantityTextSmall: {
    fontSize: 13,
    minWidth: 24,
  },
});
