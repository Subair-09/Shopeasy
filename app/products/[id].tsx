import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/colors';
import { Header } from '../../components/Header';
import { CustomButton } from '../../components/CustomButton';
import { QuantitySelector } from '../../components/QuantitySelector';
import { Toast } from '../../components/Toast';
import { PRODUCTS } from '../../constants/products';
import { formatNaira } from '../../utils/currency';
import { useCart } from '../../context/CartContext';
import { useFavorites } from '../../context/FavoritesContext';

const { width } = Dimensions.get('window');

export default function ProductDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { addToCart } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();

  const product = useMemo(() => {
    return PRODUCTS.find((p) => p.id === id) || PRODUCTS[0];
  }, [id]);

  const [quantity, setQuantity] = useState<number>(1);
  const [selectedColor, setSelectedColor] = useState<string>(
    product.colors?.[0] || '#15152D'
  );
  const [selectedSize, setSelectedSize] = useState<string>(
    product.sizes?.[0] || 'M'
  );
  const [toastVisible, setToastVisible] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>('');

  const favorited = isFavorite(product.id);

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedColor, selectedSize);
    setToastMessage(`Added ${quantity} × ${product.name} to Cart`);
    setToastVisible(true);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, selectedColor, selectedSize);
    router.push('/checkout');
  };

  const formattedReviews =
    product.reviewCount >= 1000
      ? `${(product.reviewCount / 1000).toFixed(1)}k`
      : `${product.reviewCount}`;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <Header
        title="Product Details"
        rightAction={
          <TouchableOpacity
            onPress={() => router.push('/(tabs)/cart')}
            style={styles.cartIconHeader}
          >
            <Ionicons name="cart-outline" size={24} color={Colors.primaryText} />
          </TouchableOpacity>
        }
      />

      <Toast
        visible={toastVisible}
        message={toastMessage}
        type="success"
        onHide={() => setToastVisible(false)}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Large Product Image Gallery Container */}
        <View style={styles.imageGalleryWrapper}>
          <Image
            source={{ uri: product.image }}
            style={styles.mainImage}
            resizeMode="cover"
          />

          {/* Floating Favorite Button */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => toggleFavorite(product.id)}
            style={styles.floatingHeartBtn}
          >
            <Ionicons
              name={favorited ? 'heart' : 'heart-outline'}
              size={22}
              color={favorited ? Colors.error : Colors.secondaryText}
            />
          </TouchableOpacity>

          {/* Stock Availability Tag */}
          <View style={styles.stockTag}>
            <View style={styles.stockDot} />
            <Text style={styles.stockText}>
              In Stock ({product.stock} available)
            </Text>
          </View>
        </View>

        {/* Content Box */}
        <View style={styles.contentBox}>
          {/* Title & Rating */}
          <Text style={styles.productTitle}>{product.name}</Text>

          <View style={styles.metaRow}>
            <View style={styles.ratingBadge}>
              <Ionicons name="star" size={16} color={Colors.accentYellow} />
              <Text style={styles.ratingScore}>{product.rating.toFixed(1)}</Text>
              <Text style={styles.reviewsCount}>({formattedReviews} reviews)</Text>
            </View>

            <View style={styles.verifiedBadge}>
              <Ionicons name="shield-checkmark" size={14} color={Colors.success} />
              <Text style={styles.verifiedText}>100% Genuine</Text>
            </View>
          </View>

          {/* Price Container */}
          <View style={styles.priceRow}>
            <Text style={styles.currentPrice}>{formatNaira(product.price)}</Text>
            {product.originalPrice && product.originalPrice > product.price && (
              <View style={styles.discountRow}>
                <Text style={styles.originalPrice}>
                  {formatNaira(product.originalPrice)}
                </Text>
                <View style={styles.discountPill}>
                  <Text style={styles.discountPillText}>
                    SAVE {formatNaira(product.originalPrice - product.price)}
                  </Text>
                </View>
              </View>
            )}
          </View>

          <View style={styles.divider} />

          {/* Color Selector */}
          {product.colors && product.colors.length > 0 && (
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionLabel}>Select Color</Text>
              <View style={styles.colorsRow}>
                {product.colors.map((c, i) => {
                  const isSelected = selectedColor === c;
                  return (
                    <TouchableOpacity
                      key={i}
                      activeOpacity={0.8}
                      onPress={() => setSelectedColor(c)}
                      style={[
                        styles.colorRing,
                        isSelected && { borderColor: Colors.primary },
                      ]}
                    >
                      <View style={[styles.colorInner, { backgroundColor: c }]} />
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}

          {/* Size Selector */}
          {product.sizes && product.sizes.length > 0 && (
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionLabel}>Select Size</Text>
              <View style={styles.sizesRow}>
                {product.sizes.map((s, i) => {
                  const isSelected = selectedSize === s;
                  return (
                    <TouchableOpacity
                      key={i}
                      activeOpacity={0.8}
                      onPress={() => setSelectedSize(s)}
                      style={[styles.sizeBox, isSelected && styles.sizeBoxActive]}
                    >
                      <Text
                        style={[
                          styles.sizeText,
                          isSelected && styles.sizeTextActive,
                        ]}
                      >
                        {s}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}

          {/* Quantity Selector */}
          <View style={styles.quantitySection}>
            <Text style={styles.sectionLabel}>Quantity</Text>
            <QuantitySelector
              quantity={quantity}
              onIncrement={() => setQuantity(quantity + 1)}
              onDecrement={() => setQuantity(Math.max(1, quantity - 1))}
              max={product.stock}
            />
          </View>

          <View style={styles.divider} />

          {/* Product Description */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionLabel}>Product Description</Text>
            <Text style={styles.descriptionText}>{product.description}</Text>
          </View>

          {/* Features Highlights */}
          <View style={styles.highlightsCard}>
            <View style={styles.highlightItem}>
              <Ionicons name="airplane-outline" size={20} color={Colors.primary} />
              <Text style={styles.highlightText}>Free Delivery over ₦80k</Text>
            </View>
            <View style={styles.highlightItem}>
              <Ionicons name="refresh-outline" size={20} color={Colors.primary} />
              <Text style={styles.highlightText}>7 Days Free Returns</Text>
            </View>
            <View style={styles.highlightItem}>
              <Ionicons name="card-outline" size={20} color={Colors.primary} />
              <Text style={styles.highlightText}>Paystack Secure Checkout</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Fixed Bottom Action Bar */}
      <View style={styles.bottomBar}>
        <CustomButton
          title="Add to Cart"
          variant="outline"
          onPress={handleAddToCart}
          icon={<Ionicons name="cart-outline" size={18} color={Colors.primary} />}
          iconPosition="left"
          style={styles.addCartBtn}
        />
        <CustomButton
          title="Buy Now"
          variant="primary"
          onPress={handleBuyNow}
          icon={<Ionicons name="flash" size={16} color={Colors.white} />}
          iconPosition="left"
          style={styles.buyNowBtn}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  cartIconHeader: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingBottom: 30,
  },
  imageGalleryWrapper: {
    width: '100%',
    height: 320,
    backgroundColor: '#F5F5FA',
    position: 'relative',
  },
  mainImage: {
    width: '100%',
    height: '100%',
  },
  floatingHeartBtn: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  stockTag: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    gap: 6,
  },
  stockDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.success,
  },
  stockText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.success,
  },
  contentBox: {
    padding: 20,
  },
  productTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: Colors.primaryText,
    letterSpacing: -0.4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingScore: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.primaryText,
  },
  reviewsCount: {
    fontSize: 13,
    color: Colors.secondaryText,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.successLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  verifiedText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.success,
  },
  priceRow: {
    marginTop: 4,
    marginBottom: 10,
  },
  currentPrice: {
    fontSize: 26,
    fontWeight: '900',
    color: Colors.primary,
  },
  discountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 4,
  },
  originalPrice: {
    fontSize: 15,
    color: Colors.secondaryText,
    textDecorationLine: 'line-through',
  },
  discountPill: {
    backgroundColor: '#FFEAA7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  discountPillText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#D68910',
  },
  divider: {
    height: 1,
    backgroundColor: Colors.divider,
    marginVertical: 14,
  },
  sectionContainer: {
    marginVertical: 8,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primaryText,
    marginBottom: 10,
  },
  colorsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  colorRing: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  colorInner: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sizesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  sizeBox: {
    minWidth: 44,
    height: 44,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
  },
  sizeBoxActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.lightPurple,
  },
  sizeText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.secondaryText,
  },
  sizeTextActive: {
    color: Colors.primary,
  },
  quantitySection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 6,
  },
  descriptionText: {
    fontSize: 14,
    color: Colors.secondaryText,
    lineHeight: 22,
  },
  highlightsCard: {
    backgroundColor: Colors.inputBackground,
    borderRadius: 16,
    padding: 16,
    marginTop: 16,
    gap: 12,
  },
  highlightItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  highlightText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.primaryText,
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 8,
  },
  addCartBtn: {
    flex: 1,
    borderRadius: 16,
  },
  buyNowBtn: {
    flex: 1,
    borderRadius: 16,
  },
});
