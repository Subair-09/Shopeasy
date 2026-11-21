import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  FlatList,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/colors';
import { SearchBar } from '../../components/SearchBar';
import { PromoBanner } from '../../components/PromoBanner';
import { CategoryCard } from '../../components/CategoryCard';
import { ProductCard } from '../../components/ProductCard';
import { SectionHeader } from '../../components/SectionHeader';
import { CATEGORIES } from '../../constants/categories';
import { PRODUCTS } from '../../constants/products';
import { Category, Product } from '../../types';
import { useNotifications } from '../../context/NotificationsContext';
import { useAuth } from '../../context/AuthContext';
import { fetchProductsFromAPI, fetchCategoriesFromAPI } from '../../services/api';

const LOCATIONS = ['Lagos', 'Abuja', 'Port Harcourt', 'Ibadan', 'Enugu', 'Kano'];

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { unreadCount } = useNotifications();

  const [selectedLocation, setSelectedLocation] = useState<string>('Lagos');
  const [locationModalVisible, setLocationModalVisible] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [categories, setCategories] = useState<Category[]>(CATEGORIES);

  useEffect(() => {
    loadHomeData();
  }, []);

  const loadHomeData = async () => {
    try {
      const [apiProducts, apiCategories] = await Promise.all([
        fetchProductsFromAPI(),
        fetchCategoriesFromAPI(),
      ]);
      if (apiProducts && apiProducts.length > 0) setProducts(apiProducts);
      if (apiCategories && apiCategories.length > 0) setCategories(apiCategories);
    } catch {}
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadHomeData();
    setRefreshing(false);
  };

  const handleCategoryPress = (category: Category) => {
    if (category.id === 'more') {
      router.push('/(tabs)/categories');
      return;
    }
    if (selectedCategory === category.id) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(category.id);
    }
  };

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory = selectedCategory
        ? product.category === selectedCategory
        : true;
      const matchesSearch = searchQuery
        ? product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase())
        : true;
      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  const popularProducts = useMemo(() => {
    const popular = filteredProducts.filter((p) => p.isPopular);
    return popular.length > 0 ? popular : filteredProducts.slice(0, 4);
  }, [filteredProducts]);

  const specialOffers = useMemo(() => {
    return products.filter((p) => p.originalPrice && p.originalPrice > p.price);
  }, [products]);

  const handleProductPress = (product: Product) => {
    router.push({
      pathname: '/products/[id]',
      params: { id: product.id },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      {/* Top Header Bar */}
      <View style={styles.headerBar}>
        {/* Left: Location Dropdown */}
        <TouchableOpacity
          activeOpacity={0.75}
          onPress={() => setLocationModalVisible(true)}
          style={styles.locationSelector}
        >
          <Ionicons name="location-sharp" size={18} color={Colors.primary} />
          <Text style={styles.locationText}>{selectedLocation}</Text>
          <Ionicons name="chevron-down" size={14} color={Colors.primaryText} />
        </TouchableOpacity>

        {/* Right: Notification Bell */}
        <TouchableOpacity
          activeOpacity={0.75}
          onPress={() => router.push('/notifications')}
          style={styles.notificationButton}
        >
          <Ionicons name="notifications-outline" size={22} color={Colors.primaryText} />
          {unreadCount > 0 && (
            <View style={styles.notificationBadge}>
              <View style={styles.notificationDot} />
            </View>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[Colors.primary]}
            tintColor={Colors.primary}
          />
        }
      >
        {/* Search Bar Section */}
        <View style={styles.searchSection}>
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search for products..."
            onFilterPress={() => router.push('/products')}
          />
        </View>

        {/* Promotional Banner */}
        <PromoBanner onPressShopNow={() => router.push('/products')} />

        {/* Categories Section */}
        <View style={styles.categoriesSection}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesScrollList}
          >
            {categories.map((cat) => (
              <CategoryCard
                key={cat.id}
                category={cat}
                isSelected={selectedCategory === cat.id}
                onPress={handleCategoryPress}
              />
            ))}
          </ScrollView>
        </View>

        {/* Active Filter Pill if Category is selected */}
        {selectedCategory && (
          <View style={styles.filterChipRow}>
            <View style={styles.filterChip}>
              <Text style={styles.filterChipText}>
                Category: {categories.find((c) => c.id === selectedCategory)?.name || selectedCategory}
              </Text>
              <TouchableOpacity
                onPress={() => setSelectedCategory(null)}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Ionicons name="close-circle" size={16} color={Colors.primary} />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Popular Products Header & Horizontal Scroll */}
        <SectionHeader
          title="Popular Products"
          actionTitle="See all"
          onActionPress={() => router.push('/products')}
        />

        {popularProducts.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="search-outline" size={44} color={Colors.mutedText} />
            <Text style={styles.emptyStateText}>No products found matching your search</Text>
          </View>
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.productsScrollList}
          >
            {popularProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onPress={handleProductPress}
              />
            ))}
          </ScrollView>
        )}

        {/* Special Offers / Deals Section */}
        <SectionHeader
          title="Flash Deals & Discounts"
          subtitle="Exclusive discounts for limited time"
          actionTitle="See all"
          onActionPress={() => router.push('/products')}
        />

        <View style={styles.dealsGrid}>
          {specialOffers.slice(0, 4).map((product) => (
            <ProductCard
              key={`deal-${product.id}`}
              product={product}
              onPress={handleProductPress}
              style={{ width: '48%', marginRight: 0 }}
            />
          ))}
        </View>
      </ScrollView>

      {/* Location Selection Modal */}
      <Modal
        visible={locationModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setLocationModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setLocationModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Delivery Location</Text>
              <TouchableOpacity onPress={() => setLocationModalVisible(false)}>
                <Ionicons name="close" size={24} color={Colors.primaryText} />
              </TouchableOpacity>
            </View>

            {LOCATIONS.map((loc) => {
              const isSelected = selectedLocation === loc;
              return (
                <TouchableOpacity
                  key={loc}
                  style={[styles.locationOption, isSelected && styles.locationOptionActive]}
                  onPress={() => {
                    setSelectedLocation(loc);
                    setLocationModalVisible(false);
                  }}
                >
                  <View style={styles.locationOptionLeft}>
                    <Ionicons
                      name="location-outline"
                      size={20}
                      color={isSelected ? Colors.primary : Colors.secondaryText}
                    />
                    <Text
                      style={[
                        styles.locationOptionText,
                        isSelected && styles.locationOptionTextActive,
                      ]}
                    >
                      {loc}, Nigeria
                    </Text>
                  </View>
                  {isSelected && (
                    <Ionicons name="checkmark-circle" size={20} color={Colors.primary} />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </TouchableOpacity>
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
    height: 54,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  locationSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  locationText: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.primaryText,
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.inputBackground,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: 9,
    right: 9,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.error,
  },
  notificationDot: {
    width: '100%',
    height: '100%',
    borderRadius: 4,
    backgroundColor: Colors.error,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  searchSection: {
    marginTop: 14,
  },
  categoriesSection: {
    marginTop: 10,
    marginBottom: 8,
  },
  categoriesScrollList: {
    paddingVertical: 6,
  },
  filterChipRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.lightPurple,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 8,
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primary,
  },
  productsScrollList: {
    paddingVertical: 6,
    paddingRight: 12,
  },
  dealsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 36,
  },
  emptyStateText: {
    fontSize: 14,
    color: Colors.secondaryText,
    marginTop: 10,
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
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 36,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.primaryText,
  },
  locationOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
    marginBottom: 8,
    backgroundColor: Colors.inputBackground,
  },
  locationOptionActive: {
    backgroundColor: Colors.lightPurple,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  locationOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  locationOptionText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.primaryText,
  },
  locationOptionTextActive: {
    color: Colors.primary,
    fontWeight: '700',
  },
});
