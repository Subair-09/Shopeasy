import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Product } from '../types';
import Colors from '../constants/colors';
import { formatNaira } from '../utils/currency';
import { useFavorites } from '../context/FavoritesContext';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  product: Product;
  onPress: (product: Product) => void;
  style?: ViewStyle;
  variant?: 'grid' | 'horizontal';
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onPress,
  style,
  variant = 'grid',
}) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const { addToCart } = useCart();
  const favorited = isFavorite(product.id);

  const formattedReviews =
    product.reviewCount >= 1000
      ? `${(product.reviewCount / 1000).toFixed(1)}k`
      : `${product.reviewCount}`;

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => onPress(product)}
      style={[
        styles.cardContainer,
        variant === 'horizontal' ? styles.horizontalCard : styles.gridCard,
        style,
      ]}
    >
      {/* Product Image & Floating Favorite */}
      <View style={styles.imageWrapper}>
        <Image
          source={{ uri: product.image }}
          style={styles.productImage}
          resizeMode="cover"
        />
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => toggleFavorite(product.id)}
          style={styles.favoriteButton}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons
            name={favorited ? 'heart' : 'heart-outline'}
            size={18}
            color={favorited ? Colors.error : Colors.secondaryText}
          />
        </TouchableOpacity>

        {product.originalPrice && product.originalPrice > product.price && (
          <View style={styles.discountPill}>
            <Text style={styles.discountText}>
              -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
            </Text>
          </View>
        )}
      </View>

      {/* Details */}
      <View style={styles.detailsContainer}>
        <Text style={styles.productName} numberOfLines={1}>
          {product.name}
        </Text>

        <Text style={styles.priceText}>{formatNaira(product.price)}</Text>

        {/* Rating Row & Quick Add */}
        <View style={styles.bottomRow}>
          <View style={styles.ratingRow}>
            <Ionicons name="star" size={14} color={Colors.accentYellow} />
            <Text style={styles.ratingScore}>{product.rating.toFixed(1)}</Text>
            <Text style={styles.reviewCount}>({formattedReviews})</Text>
          </View>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={(e) => {
              e.stopPropagation?.();
              addToCart(product);
            }}
            style={styles.quickAddButton}
            hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
          >
            <Ionicons name="add" size={18} color={Colors.white} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
    shadowColor: Colors.shadowColor,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 16,
  },
  gridCard: {
    width: 160,
    marginRight: 14,
  },
  horizontalCard: {
    width: '100%',
    flexDirection: 'row',
  },
  imageWrapper: {
    width: '100%',
    height: 140,
    backgroundColor: '#F5F5FA',
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  favoriteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  discountPill: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: Colors.accentYellow,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  discountText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#15152D',
  },
  detailsContainer: {
    padding: 12,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primaryText,
    marginBottom: 4,
  },
  priceText: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.primary,
    marginBottom: 6,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  ratingScore: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primaryText,
  },
  reviewCount: {
    fontSize: 11,
    color: Colors.secondaryText,
  },
  quickAddButton: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
