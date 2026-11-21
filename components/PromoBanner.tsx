import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../constants/colors';

interface PromoBannerProps {
  onPressShopNow?: () => void;
}

export const PromoBanner: React.FC<PromoBannerProps> = ({ onPressShopNow }) => {
  return (
    <LinearGradient
      colors={['#5135ED', '#3925C5', '#281B9B']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.bannerContainer}
    >
      {/* Decorative background glow accents */}
      <View style={styles.glowCircleOne} />
      <View style={styles.glowCircleTwo} />

      {/* Left Content */}
      <View style={styles.textContainer}>
        <View style={styles.tagBadge}>
          <Text style={styles.tagText}>LIMITED OFFER</Text>
        </View>
        <Text style={styles.mainHeading}>Mega Sale</Text>
        <Text style={styles.subHeading}>Up to 50% OFF</Text>

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={onPressShopNow}
          style={styles.shopNowButton}
        >
          <Text style={styles.shopNowText}>Shop Now</Text>
          <Ionicons name="arrow-forward" size={14} color="#15152D" />
        </TouchableOpacity>
      </View>

      {/* Right Product Image (Headphones) */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80' }}
          style={styles.productImage}
          resizeMode="contain"
        />
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  bannerContainer: {
    borderRadius: 24,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 160,
    overflow: 'hidden',
    position: 'relative',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.28,
    shadowRadius: 12,
    elevation: 6,
    marginVertical: 12,
  },
  glowCircleOne: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    top: -40,
    left: -20,
  },
  glowCircleTwo: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 201, 40, 0.12)',
    bottom: -30,
    right: 60,
  },
  textContainer: {
    flex: 1.2,
    zIndex: 2,
    justifyContent: 'center',
  },
  tagBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 201, 40, 0.25)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    marginBottom: 6,
  },
  tagText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFD752',
    letterSpacing: 0.6,
  },
  mainHeading: {
    fontSize: 24,
    fontWeight: '900',
    color: Colors.white,
    letterSpacing: -0.5,
  },
  subHeading: {
    fontSize: 16,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 14,
  },
  shopNowButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.accentYellow,
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  shopNowText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#15152D',
  },
  imageContainer: {
    flex: 1,
    height: 140,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  productImage: {
    width: '100%',
    height: '100%',
    transform: [{ scale: 1.15 }],
  },
});
