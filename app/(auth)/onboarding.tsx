import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  TouchableOpacity,
  Animated,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/colors';
import {
  CartIllustration,
  PaymentIllustration,
  DeliveryIllustration,
} from '../../components/Illustrations';
import { CustomButton } from '../../components/CustomButton';
import { useAuth } from '../../context/AuthContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface OnboardingSlide {
  id: string;
  title: string;
  description: string;
  buttonText: string;
  illustration: React.ReactNode;
}

export default function OnboardingScreen() {
  const router = useRouter();
  const { completeOnboarding } = useAuth();
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const flatListRef = useRef<FlatList>(null);

  const slides: OnboardingSlide[] = [
    {
      id: 'slide-1',
      title: 'Discover\nAmazing Products',
      description: 'Find what you love from our wide range of products.',
      buttonText: 'Next',
      illustration: <CartIllustration />,
    },
    {
      id: 'slide-2',
      title: 'Secure & Easy\nPayments',
      description: 'Pay safely with your preferred payment method.',
      buttonText: 'Next',
      illustration: <PaymentIllustration />,
    },
    {
      id: 'slide-3',
      title: 'Fast & Reliable\nDelivery',
      description: 'Get your orders delivered right to your door.',
      buttonText: 'Get Started',
      illustration: <DeliveryIllustration />,
    },
  ];

  const handleNext = async () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
      setCurrentIndex(currentIndex + 1);
    } else {
      await completeOnboarding();
      router.replace('/(auth)/signup');
    }
  };

  const handleSkip = async () => {
    await completeOnboarding();
    router.replace('/(auth)/signup');
  };

  const onMomentumScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const newIndex = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
    setCurrentIndex(newIndex);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top Header with Skip */}
      <View style={styles.topHeader}>
        <View style={{ width: 60 }} />
        <View style={styles.topBrandLogo}>
          <Text style={styles.brandTitle}>
            Shop<Text style={{ color: Colors.accentYellow }}>Easy</Text>
          </Text>
        </View>
        {currentIndex < slides.length - 1 ? (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleSkip}
            style={styles.skipButton}
          >
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        ) : (
          <View style={{ width: 60 }} />
        )}
      </View>

      {/* Slides Horizontal FlatList */}
      <FlatList
        ref={flatListRef}
        data={slides}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onMomentumScrollEnd}
        renderItem={({ item }) => (
          <View style={styles.slideContainer}>
            <View style={styles.illustrationWrapper}>{item.illustration}</View>

            <View style={styles.textWrapper}>
              <Text style={styles.heading}>{item.title}</Text>
              <Text style={styles.description}>{item.description}</Text>
            </View>
          </View>
        )}
      />

      {/* Bottom Section: Pagination Indicators + Next Button */}
      <View style={styles.bottomSection}>
        {/* Pagination Dots */}
        <View style={styles.paginationRow}>
          {slides.map((_, index) => {
            const isActive = index === currentIndex;
            return (
              <View
                key={index}
                style={[
                  styles.dot,
                  isActive ? styles.activeDot : styles.inactiveDot,
                ]}
              />
            );
          })}
        </View>

        {/* Action Button */}
        <CustomButton
          title={slides[currentIndex].buttonText}
          icon={<Ionicons name="arrow-forward" size={18} color={Colors.white} />}
          iconPosition="right"
          onPress={handleNext}
          size="large"
          style={styles.actionButton}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.white,
    justifyContent: 'space-between',
  },
  topHeader: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  topBrandLogo: {
    alignItems: 'center',
  },
  brandTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: Colors.primary,
  },
  skipButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: Colors.subtlePurple,
  },
  skipText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
  },
  slideContainer: {
    width: SCREEN_WIDTH,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  illustrationWrapper: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  textWrapper: {
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 20,
  },
  heading: {
    fontSize: 26,
    fontWeight: '900',
    color: Colors.primaryText,
    textAlign: 'center',
    lineHeight: 34,
    letterSpacing: -0.5,
  },
  description: {
    fontSize: 15,
    color: Colors.secondaryText,
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 22,
    maxWidth: 280,
  },
  bottomSection: {
    paddingHorizontal: 24,
    paddingBottom: 28,
    alignItems: 'center',
  },
  paginationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
    gap: 8,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  activeDot: {
    width: 24,
    backgroundColor: Colors.primary,
  },
  inactiveDot: {
    width: 8,
    backgroundColor: '#E4E2F5',
  },
  actionButton: {
    width: '100%',
    borderRadius: 20,
  },
});
