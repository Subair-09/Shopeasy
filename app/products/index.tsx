import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/colors';
import { Header } from '../../components/Header';
import { SearchBar } from '../../components/SearchBar';
import { ProductCard } from '../../components/ProductCard';
import { PRODUCTS } from '../../constants/products';
import { CATEGORIES } from '../../constants/categories';
import { Product, Category } from '../../types';
import { fetchProductsFromAPI, fetchCategoriesFromAPI } from '../../services/api';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 44) / 2;

type SortOption = 'popular' | 'price_asc' | 'price_desc' | 'rating';

export default function ProductsListScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ category?: string; query?: string }>();

  const [searchQuery, setSearchQuery] = useState<string>(params.query || '');
  const [selectedCategory, setSelectedCategory] = useState<string>(params.category || 'all');
  const [sortBy, setSortBy] = useState<SortOption>('popular');
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [categories, setCategories] = useState<Category[]>(CATEGORIES);

  useEffect(() => {
    fetchProductsFromAPI(selectedCategory).then((res) => {
      if (res && res.length > 0) setProducts(res);
    });
    fetchCategoriesFromAPI().then((res) => {
      if (res && res.length > 0) setCategories(res);
    });
  }, [selectedCategory]);

  const filteredAndSortedProducts = useMemo(() => {
    let list = products.filter((p) => {
      const matchesCategory =
        selectedCategory === 'all' || p.category === selectedCategory;
      const matchesSearch = searchQuery
        ? p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase())
        : true;
      return matchesCategory && matchesSearch;
    });

    switch (sortBy) {
      case 'price_asc':
        return [...list].sort((a, b) => a.price - b.price);
      case 'price_desc':
        return [...list].sort((a, b) => b.price - a.price);
      case 'rating':
        return [...list].sort((a, b) => b.rating - a.rating);
      case 'popular':
      default:
        return [...list].sort((a, b) => (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0));
    }
  }, [selectedCategory, searchQuery, sortBy]);

  const handleProductPress = (product: Product) => {
    router.push({
      pathname: '/products/[id]',
      params: { id: product.id },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <Header title="Explore Products" />

      {/* Search Input */}
      <View style={styles.searchContainer}>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search products, brands..."
        />
      </View>

      {/* Category Filter Chips */}
      <View style={styles.categoriesRow}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScroll}
        >
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setSelectedCategory('all')}
            style={[
              styles.categoryChip,
              selectedCategory === 'all' && styles.categoryChipActive,
            ]}
          >
            <Text
              style={[
                styles.categoryChipText,
                selectedCategory === 'all' && styles.categoryChipTextActive,
              ]}
            >
              All Items
            </Text>
          </TouchableOpacity>

          {categories.filter((c) => c.id !== 'more').map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <TouchableOpacity
                key={cat.id}
                activeOpacity={0.8}
                onPress={() => setSelectedCategory(cat.id)}
                style={[styles.categoryChip, isSelected && styles.categoryChipActive]}
              >
                <Text
                  style={[
                    styles.categoryChipText,
                    isSelected && styles.categoryChipTextActive,
                  ]}
                >
                  {cat.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Sort Options Bar */}
      <View style={styles.sortBar}>
        <Text style={styles.resultCount}>
          {filteredAndSortedProducts.length} Product
          {filteredAndSortedProducts.length === 1 ? '' : 's'}
        </Text>

        <View style={styles.sortOptions}>
          <TouchableOpacity
            onPress={() => setSortBy('popular')}
            style={[styles.sortTag, sortBy === 'popular' && styles.sortTagActive]}
          >
            <Text
              style={[
                styles.sortTagText,
                sortBy === 'popular' && styles.sortTagTextActive,
              ]}
            >
              Popular
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setSortBy('price_asc')}
            style={[styles.sortTag, sortBy === 'price_asc' && styles.sortTagActive]}
          >
            <Text
              style={[
                styles.sortTagText,
                sortBy === 'price_asc' && styles.sortTagTextActive,
              ]}
            >
              Price ↑
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setSortBy('rating')}
            style={[styles.sortTag, sortBy === 'rating' && styles.sortTagActive]}
          >
            <Text
              style={[
                styles.sortTagText,
                sortBy === 'rating' && styles.sortTagTextActive,
              ]}
            >
              Rating ★
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Products Grid */}
      {filteredAndSortedProducts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="search-outline" size={54} color={Colors.mutedText} />
          <Text style={styles.emptyTitle}>No matching products</Text>
          <Text style={styles.emptyDesc}>Try adjusting your search terms or category filter.</Text>
        </View>
      ) : (
        <FlatList
          data={filteredAndSortedProducts}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.listContent}
          columnWrapperStyle={styles.columnWrapper}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <ProductCard
              product={item}
              onPress={handleProductPress}
              style={{ width: CARD_WIDTH, marginRight: 0 }}
            />
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 6,
    backgroundColor: Colors.white,
  },
  categoriesRow: {
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  categoryScroll: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: Colors.inputBackground,
    marginRight: 6,
  },
  categoryChipActive: {
    backgroundColor: Colors.primary,
  },
  categoryChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.secondaryText,
  },
  categoryChipTextActive: {
    color: Colors.white,
    fontWeight: '700',
  },
  sortBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  resultCount: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.secondaryText,
  },
  sortOptions: {
    flexDirection: 'row',
    gap: 6,
  },
  sortTag: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sortTagActive: {
    backgroundColor: Colors.lightPurple,
    borderColor: Colors.primary,
  },
  sortTagText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.secondaryText,
  },
  sortTagTextActive: {
    color: Colors.primary,
    fontWeight: '800',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 6,
    paddingBottom: 32,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.primaryText,
    marginTop: 12,
  },
  emptyDesc: {
    fontSize: 13,
    color: Colors.secondaryText,
    textAlign: 'center',
    marginTop: 6,
  },
});
