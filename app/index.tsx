import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { ShopEasyLogo } from '../components/Illustrations';
import Colors from '../constants/colors';
import { useAuth } from '../context/AuthContext';

export default function SplashScreen() {
  const router = useRouter();
  const { hasCompletedOnboarding, isAuthenticated, isLoading } = useAuth();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.85)).current;

  useEffect(() => {
    // Entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    // Auto navigate after delay
    if (!isLoading) {
      const timer = setTimeout(() => {
        if (!hasCompletedOnboarding) {
          router.replace('/(auth)/onboarding');
        } else if (isAuthenticated) {
          router.replace('/(tabs)/home');
        } else {
          router.replace('/(auth)/login');
        }
      }, 2200);

      return () => clearTimeout(timer);
    }
  }, [isLoading, hasCompletedOnboarding, isAuthenticated]);

  return (
    <LinearGradient
      colors={['#5135ED', '#3925C5', '#281B9B']}
      start={{ x: 0.1, y: 0.1 }}
      end={{ x: 0.9, y: 0.9 }}
      style={styles.container}
    >
      <StatusBar style="light" />

      {/* Decorative background waves */}
      <View style={styles.waveOne} />
      <View style={styles.waveTwo} />

      <Animated.View
        style={[
          styles.contentCenter,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {/* Shopping bag logo with smile */}
        <ShopEasyLogo size={84} smileColor="#FFC928" />

        {/* Brand Name: Shop (white) + Easy (yellow) */}
        <View style={styles.brandTitleRow}>
          <Text style={styles.brandShop}>Shop</Text>
          <Text style={styles.brandEasy}>Easy</Text>
        </View>

        {/* Tagline */}
        <Text style={styles.tagline}>Shop Smart. Live Better.</Text>
      </Animated.View>

      {/* Bottom Loading Indicator */}
      <View style={styles.bottomLoader}>
        <ActivityIndicator size="small" color="rgba(255, 255, 255, 0.75)" />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  waveOne: {
    position: 'absolute',
    width: 380,
    height: 380,
    borderRadius: 190,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    top: -80,
    right: -100,
  },
  waveTwo: {
    position: 'absolute',
    width: 440,
    height: 440,
    borderRadius: 220,
    backgroundColor: 'rgba(255, 201, 40, 0.03)',
    bottom: -120,
    left: -120,
  },
  contentCenter: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  brandShop: {
    fontSize: 38,
    fontWeight: '900',
    color: Colors.white,
    letterSpacing: -0.5,
  },
  brandEasy: {
    fontSize: 38,
    fontWeight: '900',
    color: Colors.accentYellow,
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: 15,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.85)',
    marginTop: 8,
    letterSpacing: 0.2,
  },
  bottomLoader: {
    position: 'absolute',
    bottom: 54,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
