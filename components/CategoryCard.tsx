import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Category } from '../types';
import Colors from '../constants/colors';

interface CategoryCardProps {
  category: Category;
  isSelected?: boolean;
  onPress: (category: Category) => void;
  variant?: 'circle' | 'grid';
  style?: ViewStyle;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  isSelected = false,
  onPress,
  variant = 'circle',
  style,
}) => {
  if (variant === 'grid') {
    return (
      <TouchableOpacity
        activeOpacity={0.88}
        onPress={() => onPress(category)}
        style={[styles.gridContainer, style]}
      >
        {/* Rounded Image / Icon Backdrop */}
        <View style={styles.gridImageBackdrop}>
          {category.image ? (
            <Image
              source={{ uri: category.image }}
              style={styles.gridImage}
              resizeMode="contain"
            />
          ) : (
            <View style={styles.moreDotsWrapper}>
              <View style={styles.moreDot} />
              <View style={styles.moreDot} />
              <View style={styles.moreDot} />
            </View>
          )}
        </View>

        {/* Category Name & Count */}
        <Text style={styles.gridCategoryName} numberOfLines={1}>
          {category.name}
        </Text>
        <Text style={styles.gridCategoryCount}>
          {category.countLabel || `(${category.itemCount}+)`}
        </Text>
      </TouchableOpacity>
    );
  }

  // Circular variant for Home screen horizontal scroll
  return (
    <TouchableOpacity
      activeOpacity={0.75}
      onPress={() => onPress(category)}
      style={[styles.circleContainer, style]}
    >
      <View
        style={[
          styles.iconCircle,
          { backgroundColor: isSelected ? Colors.primary : category.backgroundColor || Colors.lightPurple },
        ]}
      >
        <Ionicons
          name={category.icon as any}
          size={24}
          color={isSelected ? Colors.white : category.color || Colors.primary}
        />
      </View>
      <Text
        style={[
          styles.categoryName,
          isSelected && styles.selectedCategoryName,
        ]}
        numberOfLines={1}
      >
        {category.name}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  // Horizontal circle variant
  circleContainer: {
    alignItems: 'center',
    marginRight: 16,
    width: 64,
  },
  iconCircle: {
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    shadowColor: Colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  categoryName: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primaryText,
    textAlign: 'center',
  },
  selectedCategoryName: {
    color: Colors.primary,
    fontWeight: '700',
  },

  // 2-Column Grid variant (matching reference image)
  gridContainer: {
    backgroundColor: Colors.white,
    borderRadius: 22,
    paddingVertical: 18,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 16,
    shadowColor: '#15152D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  gridImageBackdrop: {
    width: 98,
    height: 98,
    borderRadius: 49,
    backgroundColor: '#F3F1FD',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    overflow: 'hidden',
  },
  gridImage: {
    width: 76,
    height: 76,
  },
  moreDotsWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  moreDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.primary,
  },
  gridCategoryName: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.primaryText,
    marginBottom: 4,
    textAlign: 'center',
  },
  gridCategoryCount: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.secondaryText,
    textAlign: 'center',
  },
});
