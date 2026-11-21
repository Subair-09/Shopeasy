import React from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../constants/colors';

interface PromoCodeInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onApply: () => void;
  appliedPromo?: string | null;
  onRemovePromo?: () => void;
  placeholder?: string;
}

export const PromoCodeInput: React.FC<PromoCodeInputProps> = ({
  value,
  onChangeText,
  onApply,
  appliedPromo,
  onRemovePromo,
  placeholder = 'Enter promo code',
}) => {
  if (appliedPromo) {
    return (
      <View style={styles.appliedContainer}>
        <View style={styles.appliedLeft}>
          <Ionicons name="checkmark-circle" size={20} color={Colors.success} />
          <Text style={styles.appliedText}>
            Promo <Text style={styles.appliedCode}>{appliedPromo}</Text> active
          </Text>
        </View>
        <TouchableOpacity
          onPress={onRemovePromo}
          style={styles.removeBtn}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="close" size={18} color={Colors.error} />
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Ionicons name="pricetag-outline" size={20} color={Colors.secondaryText} style={styles.icon} />
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={Colors.secondaryText}
        value={value}
        onChangeText={onChangeText}
        autoCapitalize="characters"
        autoCorrect={false}
      />
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={onApply}
        style={styles.applyBtn}
      >
        <Text style={styles.applyBtnText}>Apply</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 18,
    height: 52,
    paddingLeft: 14,
    paddingRight: 6,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 20,
    shadowColor: '#15152D',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 5,
    elevation: 1,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 14,
    color: Colors.primaryText,
    fontWeight: '600',
    paddingVertical: 0,
  },
  applyBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyBtnText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '700',
  },
  appliedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.successLight,
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#C6F6D5',
    marginBottom: 20,
  },
  appliedLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  appliedText: {
    fontSize: 14,
    color: Colors.success,
    fontWeight: '600',
  },
  appliedCode: {
    fontWeight: '800',
  },
  removeBtn: {
    padding: 4,
  },
});
