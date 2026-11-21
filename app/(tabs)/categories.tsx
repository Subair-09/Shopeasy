import React, { useState, useMemo, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/colors';
import { CATEGORIES } from '../../constants/categories';
import { CategoryCard } from '../../components/CategoryCard';
import { CategorySearchBar } from '../../components/CategorySearchBar';
import { Category } from '../../types';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 44) / 2;

export default function CategoriesScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const searchInputRef = useRef<any>(null);

  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return CATEGORIES;
    return CATEGORIES.filter((c) =>
      c.name.toLowerCase().includes(searchQuery.trim().toLowerCase())
    );
  }, [searchQuery]);

  const handleCategoryPress = (category: Category) => {
    if (category.id === 'more') {
      router.push({
        pathname: '/products',
        params: { category: 'all' },
      });
      return;
    }
    router.push({
      pathname: '/products',
      params: { category: category.id },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      {/* Top Header Bar matching reference image (Phone 1) */}
      <View style={styles.headerBar}>
        <Text style={styles.headerTitle}>Categories</Text>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => searchInputRef.current?.focus()}
          style={styles.searchIconButton}
        >
          <Ionicons name="search-outline" size={24} color={Colors.primaryText} />
        </TouchableOpacity>
      </View>

      {/* Search Input matching reference image */}
      <View style={styles.searchSection}>
        <CategorySearchBar
          ref={searchInputRef}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search categories..."
        />
      </View>

      {/* 2-Column Responsive Category Grid */}
      {filteredCategories.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="search-outline" size={48} color={Colors.mutedText} />
          <Text style={styles.emptyTitle}>No Categories Found</Text>
          <Text style={styles.emptyDesc}>Try searching for phones, fashion, shoes, etc.</Text>
        </View>
      ) : (
        <FlatList
          data={filteredCategories}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.gridList}
          columnWrapperStyle={styles.columnWrapper}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <CategoryCard
              category={item}
              variant="grid"
              onPress={handleCategoryPress}
              style={{ width: CARD_WIDTH }}
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
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
    backgroundColor: Colors.background,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: Colors.primaryText,
    letterSpacing: -0.5,
  },
  searchIconButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchSection: {
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 14,
  },
  gridList: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.primaryText,
    marginTop: 12,
    marginBottom: 6,
  },
  emptyDesc: {
    fontSize: 13,
    color: Colors.secondaryText,
    textAlign: 'center',
  },
});
