import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '../constants/colors';

// Screen 1: Discover Amazing Products (Shopping cart with bags & items)
export const CartIllustration: React.FC = () => {
  return (
    <View style={styles.illustrationContainer}>
      {/* Soft circular background glow */}
      <View style={[styles.circleGlow, { backgroundColor: '#F0EEFF' }]} />
      
      {/* Decorative floating items */}
      <View style={[styles.floatingBadge, { top: 20, right: 30, backgroundColor: '#FFEAA7' }]}>
        <Ionicons name="gift" size={24} color="#D68910" />
      </View>
      <View style={[styles.floatingBadge, { top: 70, left: 25, backgroundColor: '#FFD2D2' }]}>
        <Ionicons name="heart" size={20} color="#E74C3C" />
      </View>
      <View style={[styles.floatingBadge, { bottom: 40, right: 20, backgroundColor: '#D4EDDA' }]}>
        <Ionicons name="pricetag" size={20} color="#19A76B" />
      </View>

      {/* Main Cart Presentation */}
      <View style={styles.cartCenterWrapper}>
        {/* Bags inside cart */}
        <View style={styles.bagsInsideRow}>
          {/* Yellow Bag */}
          <LinearGradient
            colors={['#FFD13B', '#FFA800']}
            style={[styles.shoppingBag, styles.yellowBag]}
          >
            <View style={styles.bagHandle} />
            <Ionicons name="sparkles" size={14} color="#FFFFFF" />
          </LinearGradient>

          {/* Purple/Indigo Bag */}
          <LinearGradient
            colors={['#6C5CE7', '#5135ED']}
            style={[styles.shoppingBag, styles.purpleBag]}
          >
            <View style={styles.bagHandle} />
            <Text style={styles.bagText}>%</Text>
          </LinearGradient>

          {/* Coral Bag */}
          <LinearGradient
            colors={['#FF7675', '#E84118']}
            style={[styles.shoppingBag, styles.coralBag]}
          >
            <View style={styles.bagHandle} />
            <Ionicons name="star" size={12} color="#FFFFFF" />
          </LinearGradient>
        </View>

        {/* 3D Purple Shopping Cart Basket */}
        <LinearGradient
          colors={['#6347EB', '#4A2AD4']}
          style={styles.cartBasket}
        >
          {/* Basket Grid Lines */}
          <View style={styles.basketInnerGrid}>
            <View style={styles.gridLineHorizontal} />
            <View style={styles.gridLineHorizontal} />
            <View style={styles.gridLineVertical} />
            <View style={styles.gridLineVertical} />
          </View>
        </LinearGradient>

        {/* Cart Base and Wheels */}
        <View style={styles.cartChassis}>
          <View style={styles.cartLegLeft} />
          <View style={styles.cartLegRight} />
        </View>
        <View style={styles.cartWheelsRow}>
          <View style={styles.cartWheel}>
            <View style={styles.cartWheelInner} />
          </View>
          <View style={styles.cartWheel}>
            <View style={styles.cartWheelInner} />
          </View>
        </View>
      </View>
    </View>
  );
};

// Screen 2: Secure & Easy Payments (Smartphone with credit card, shield, coins)
export const PaymentIllustration: React.FC = () => {
  return (
    <View style={styles.illustrationContainer}>
      <View style={[styles.circleGlow, { backgroundColor: '#EFF6FF' }]} />

      {/* Floating Gold Coins */}
      <View style={[styles.floatingCoin, { top: 35, left: 35 }]}>
        <Text style={styles.coinSymbol}>₦</Text>
      </View>
      <View style={[styles.floatingCoin, { bottom: 45, left: 25, transform: [{ scale: 0.85 }] }]}>
        <Text style={styles.coinSymbol}>₦</Text>
      </View>
      <View style={[styles.floatingCoin, { bottom: 35, right: 30, transform: [{ scale: 1.1 }] }]}>
        <Text style={styles.coinSymbol}>₦</Text>
      </View>

      {/* Smartphone Body */}
      <View style={styles.phoneFrame}>
        {/* Phone Notch/Speaker */}
        <View style={styles.phoneSpeaker} />

        {/* Screen Content */}
        <View style={styles.phoneScreen}>
          {/* Credit Card emerging */}
          <LinearGradient
            colors={['#5135ED', '#3925C5']}
            style={styles.miniCreditCard}
          >
            <View style={styles.cardChip} />
            <View style={styles.cardLines}>
              <View style={styles.cardLineLong} />
              <View style={styles.cardLineShort} />
            </View>
            <Ionicons name="card" size={16} color="rgba(255,255,255,0.7)" style={{ alignSelf: 'flex-end' }} />
          </LinearGradient>

          {/* Secure Shield Badge */}
          <View style={styles.shieldWrapper}>
            <LinearGradient
              colors={['#00CEC9', '#00B894']}
              style={styles.shieldBadge}
            >
              <Ionicons name="shield-checkmark" size={32} color="#FFFFFF" />
            </LinearGradient>
          </View>

          {/* Payment Success Indicator */}
          <View style={styles.paymentSuccessPill}>
            <Ionicons name="checkmark-circle" size={14} color="#19A76B" />
            <Text style={styles.paymentSuccessText}>Verified & Secure</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

// Screen 3: Fast & Reliable Delivery (Scooter rider with package)
export const DeliveryIllustration: React.FC = () => {
  return (
    <View style={styles.illustrationContainer}>
      <View style={[styles.circleGlow, { backgroundColor: '#F3E8FF' }]} />

      {/* Floating Speed Trails */}
      <View style={[styles.speedTrail, { top: 70, left: 30, width: 45 }]} />
      <View style={[styles.speedTrail, { top: 90, left: 20, width: 35 }]} />
      <View style={[styles.speedTrail, { bottom: 60, left: 40, width: 50 }]} />

      {/* Main Delivery Vehicle & Rider Container */}
      <View style={styles.deliveryWrapper}>
        {/* Delivery Box / Trunk */}
        <LinearGradient
          colors={['#FFC928', '#F39C12']}
          style={styles.deliveryBox}
        >
          <Ionicons name="cube" size={24} color="#FFFFFF" />
          <Text style={styles.boxLabel}>EXPRESS</Text>
        </LinearGradient>

        {/* Rider Avatar */}
        <View style={styles.riderContainer}>
          <View style={styles.riderHelmet}>
            <View style={styles.helmetVisor} />
          </View>
          <View style={styles.riderBody} />
        </View>

        {/* Purple Electric Scooter Body */}
        <LinearGradient
          colors={['#5135ED', '#3925C5']}
          style={styles.scooterBody}
        >
          <View style={styles.scooterHandle} />
          <View style={styles.scooterHeadlight} />
        </LinearGradient>

        {/* Wheels */}
        <View style={styles.scooterWheelsRow}>
          <View style={styles.scooterWheel}>
            <View style={styles.wheelHub} />
          </View>
          <View style={[styles.scooterWheel, { marginLeft: 70 }]}>
            <View style={styles.wheelHub} />
          </View>
        </View>

        {/* Road Base */}
        <View style={styles.roadLine} />
      </View>
    </View>
  );
};

// ShopEasy Logo Graphic (Bag with Smile)
export const ShopEasyLogo: React.FC<{ size?: number; color?: string; smileColor?: string }> = ({
  size = 72,
  color = '#FFFFFF',
  smileColor = '#FFC928',
}) => {
  const scale = size / 72;
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <LinearGradient
        colors={['#FFFFFF', '#F0EFF6']}
        style={{
          width: 68 * scale,
          height: 64 * scale,
          borderRadius: 20 * scale,
          alignItems: 'center',
          justifyContent: 'center',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.15,
          shadowRadius: 8,
          elevation: 6,
        }}
      >
        {/* Handle */}
        <View
          style={{
            position: 'absolute',
            top: -10 * scale,
            width: 28 * scale,
            height: 18 * scale,
            borderTopLeftRadius: 14 * scale,
            borderTopRightRadius: 14 * scale,
            borderWidth: 4 * scale,
            borderColor: color === '#FFFFFF' ? '#5135ED' : color,
            borderBottomWidth: 0,
          }}
        />
        {/* Happy smile curve */}
        <View
          style={{
            width: 26 * scale,
            height: 14 * scale,
            borderBottomLeftRadius: 14 * scale,
            borderBottomRightRadius: 14 * scale,
            borderWidth: 3.5 * scale,
            borderColor: smileColor,
            borderTopWidth: 0,
            marginTop: 6 * scale,
          }}
        />
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  illustrationContainer: {
    width: '100%',
    height: 270,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginVertical: 12,
  },
  circleGlow: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
  },
  floatingBadge: {
    position: 'absolute',
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  cartCenterWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 180,
    height: 180,
  },
  bagsInsideRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: -16,
    zIndex: 1,
  },
  shoppingBag: {
    width: 46,
    height: 52,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: -4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 3,
  },
  yellowBag: {
    width: 42,
    height: 48,
    transform: [{ rotate: '-8deg' }],
    zIndex: 2,
  },
  purpleBag: {
    width: 52,
    height: 60,
    zIndex: 3,
  },
  coralBag: {
    width: 40,
    height: 46,
    transform: [{ rotate: '10deg' }],
    zIndex: 1,
  },
  bagHandle: {
    position: 'absolute',
    top: -7,
    width: 18,
    height: 10,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderWidth: 2.5,
    borderColor: '#FFFFFF',
    borderBottomWidth: 0,
  },
  bagText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 16,
  },
  cartBasket: {
    width: 140,
    height: 80,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    zIndex: 4,
    padding: 8,
    shadowColor: '#3925C5',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 7,
  },
  basketInnerGrid: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.3)',
    borderRadius: 8,
    position: 'relative',
    justifyContent: 'space-around',
  },
  gridLineHorizontal: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.25)',
    width: '100%',
  },
  gridLineVertical: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.25)',
    left: '50%',
  },
  cartChassis: {
    width: 100,
    height: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 3,
  },
  cartLegLeft: {
    width: 5,
    height: 14,
    backgroundColor: '#7158E2',
    transform: [{ rotate: '15deg' }],
  },
  cartLegRight: {
    width: 5,
    height: 14,
    backgroundColor: '#7158E2',
    transform: [{ rotate: '-15deg' }],
  },
  cartWheelsRow: {
    width: 110,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: -4,
  },
  cartWheel: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#281B9B',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  cartWheelInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FFC928',
  },
  // Screen 2 Styles
  floatingCoin: {
    position: 'absolute',
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFC928',
    borderWidth: 3,
    borderColor: '#FFA800',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#D68910',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  coinSymbol: {
    color: '#7D4A00',
    fontWeight: '900',
    fontSize: 20,
  },
  phoneFrame: {
    width: 150,
    height: 210,
    borderRadius: 30,
    backgroundColor: '#1E1B4B',
    padding: 7,
    shadowColor: '#5135ED',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 14,
    elevation: 8,
    alignItems: 'center',
  },
  phoneSpeaker: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#3730A3',
    marginBottom: 6,
  },
  phoneScreen: {
    flex: 1,
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  miniCreditCard: {
    width: 116,
    height: 64,
    borderRadius: 12,
    padding: 8,
    justifyContent: 'space-between',
    shadowColor: '#5135ED',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  cardChip: {
    width: 18,
    height: 14,
    borderRadius: 4,
    backgroundColor: '#FFC928',
  },
  cardLines: {
    gap: 3,
  },
  cardLineLong: {
    width: 50,
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 2,
  },
  cardLineShort: {
    width: 30,
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.4)',
    borderRadius: 2,
  },
  shieldWrapper: {
    marginVertical: 4,
  },
  shieldBadge: {
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#00B894',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
  paymentSuccessPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F7F0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  paymentSuccessText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#19A76B',
  },
  // Screen 3 Styles
  speedTrail: {
    position: 'absolute',
    height: 3,
    borderRadius: 2,
    backgroundColor: '#C4B5FD',
  },
  deliveryWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 200,
    height: 190,
  },
  riderContainer: {
    alignItems: 'center',
    position: 'absolute',
    top: 15,
    left: 85,
    zIndex: 5,
  },
  riderHelmet: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#5135ED',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  helmetVisor: {
    width: 18,
    height: 8,
    backgroundColor: '#FFC928',
    borderRadius: 4,
    marginRight: -10,
  },
  riderBody: {
    width: 28,
    height: 32,
    backgroundColor: '#3925C5',
    borderRadius: 8,
    marginTop: -4,
  },
  deliveryBox: {
    position: 'absolute',
    top: 40,
    left: 20,
    width: 58,
    height: 50,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 4,
    shadowColor: '#D68910',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 4,
  },
  boxLabel: {
    fontSize: 8,
    fontWeight: '900',
    color: '#7D4A00',
    marginTop: 2,
  },
  scooterBody: {
    width: 140,
    height: 48,
    borderRadius: 18,
    marginTop: 45,
    zIndex: 3,
    shadowColor: '#5135ED',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  scooterHandle: {
    width: 6,
    height: 34,
    backgroundColor: '#A29BFE',
    borderRadius: 3,
    transform: [{ rotate: '-18deg' }],
  },
  scooterHeadlight: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FFC928',
  },
  scooterWheelsRow: {
    flexDirection: 'row',
    marginTop: -16,
    zIndex: 4,
  },
  scooterWheel: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#281B9B',
    borderWidth: 4,
    borderColor: '#E8E7F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  wheelHub: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#FFC928',
  },
  roadLine: {
    width: 180,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E8E7F0',
    marginTop: 8,
  },
});
