import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '../../constants/colors';
import { useAuth } from '../../context/AuthContext';
import { CustomButton } from '../../components/CustomButton';

interface MenuItem {
  id: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  route?: string;
  action?: () => void;
  badge?: string;
  isDestructive?: boolean;
}

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [benefitsModalVisible, setBenefitsModalVisible] = useState<boolean>(false);

  const handleLogout = () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out of ShopEasy?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Log Out',
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/(auth)/login');
          },
        },
      ]
    );
  };

  const menuItems: MenuItem[] = [
    {
      id: 'orders',
      title: 'My Orders',
      icon: 'receipt-outline',
      action: () => router.push('/(tabs)/orders'),
    },
    {
      id: 'addresses',
      title: 'My Addresses',
      icon: 'location-outline',
      action: () => router.push('/profile/addresses'),
    },
    {
      id: 'payments',
      title: 'Payment Methods',
      icon: 'card-outline',
      action: () => router.push('/profile/payment-methods'),
    },
    {
      id: 'notifications',
      title: 'Notifications',
      icon: 'notifications-outline',
      action: () => router.push('/notifications'),
    },
    {
      id: 'support',
      title: 'Help & Support',
      icon: 'headset-outline',
      action: () => {
        Alert.alert(
          'ShopEasy Support 24/7',
          'Live chat: support@shopeasy.ng\nPhone: +234 1 800 SHOPEASY\nOur agents are available 24/7.'
        );
      },
    },
    {
      id: 'about',
      title: 'About ShopEasy',
      icon: 'information-circle-outline',
      action: () => {
        Alert.alert(
          'ShopEasy Mobile v1.0.0',
          'Shop Smart. Live Better.\n\nShopEasy is Nigeria’s modern e-commerce mobile application delivering genuine electronics, fashion, beauty, and home lifestyle products.'
        );
      },
    },
    {
      id: 'settings',
      title: 'Settings',
      icon: 'settings-outline',
      action: () => router.push('/profile/settings'),
    },
    {
      id: 'logout',
      title: 'Log Out',
      icon: 'log-out-outline',
      action: handleLogout,
      isDestructive: true,
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      {/* Top Header */}
      <View style={styles.topHeader}>
        <View style={{ width: 40 }} />
        <Text style={styles.headerTitle}>My Profile</Text>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => router.push('/profile/settings')}
          style={styles.settingsIconBtn}
        >
          <Ionicons name="settings-outline" size={22} color={Colors.primaryText} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Customer Profile Card */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => router.push('/profile/edit')}
          style={styles.profileCard}
        >
          <Image
            source={{
              uri:
                user?.avatar ||
                'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
            }}
            style={styles.avatarImage}
          />
          <View style={styles.profileTextCol}>
            <Text style={styles.profileName}>{user?.name || 'Nurudeen Adewale'}</Text>
            <Text style={styles.profileEmail}>
              {user?.email || 'nurudeen@example.com'}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={Colors.secondaryText} />
        </TouchableOpacity>

        {/* Premium Membership Card (Purple gradient from reference image) */}
        <LinearGradient
          colors={['#5135ED', '#3925C5', '#281B9B']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.premiumCard}
        >
          <View style={styles.premiumLeft}>
            <View style={styles.crownCircle}>
              <Ionicons name="sparkles" size={18} color="#FFC928" />
            </View>
            <View style={styles.premiumTextCol}>
              <Text style={styles.premiumTitle}>Premium Member</Text>
              <Text style={styles.premiumSubtitle}>Enjoy exclusive benefits</Text>
            </View>
          </View>

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => setBenefitsModalVisible(true)}
            style={styles.viewBenefitsButton}
          >
            <Text style={styles.viewBenefitsText}>View Benefits</Text>
          </TouchableOpacity>
        </LinearGradient>

        {/* Profile Menu Items List */}
        <View style={styles.menuContainer}>
          {menuItems.map((item, index) => {
            const isLast = index === menuItems.length - 1;
            return (
              <React.Fragment key={item.id}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={item.action}
                  style={styles.menuItemRow}
                >
                  <View style={styles.menuItemLeft}>
                    <View
                      style={[
                        styles.menuIconContainer,
                        item.isDestructive && styles.destructiveIconContainer,
                      ]}
                    >
                      <Ionicons
                        name={item.icon}
                        size={20}
                        color={item.isDestructive ? Colors.error : Colors.primary}
                      />
                    </View>
                    <Text
                      style={[
                        styles.menuItemTitle,
                        item.isDestructive && styles.destructiveItemTitle,
                      ]}
                    >
                      {item.title}
                    </Text>
                  </View>

                  <Ionicons
                    name="chevron-forward"
                    size={18}
                    color={item.isDestructive ? Colors.error : Colors.secondaryText}
                  />
                </TouchableOpacity>
                {!isLast && <View style={styles.menuDivider} />}
              </React.Fragment>
            );
          })}
        </View>

        {/* Version info */}
        <Text style={styles.appVersionText}>ShopEasy v1.0.0 • Made with ❤️ for Nigeria</Text>
      </ScrollView>

      {/* Benefits Modal */}
      <Modal
        visible={benefitsModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setBenefitsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <Ionicons name="shield-checkmark" size={26} color={Colors.primary} />
                <Text style={styles.modalTitle}>Premium Member Perks</Text>
              </View>
              <TouchableOpacity onPress={() => setBenefitsModalVisible(false)}>
                <Ionicons name="close" size={24} color={Colors.primaryText} />
              </TouchableOpacity>
            </View>

            <View style={styles.benefitsList}>
              <View style={styles.benefitRow}>
                <Ionicons name="flash" size={20} color={Colors.accentYellow} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.benefitHeading}>Free Express Delivery</Text>
                  <Text style={styles.benefitDesc}>Zero shipping charges on all eligible Lagos and Abuja orders.</Text>
                </View>
              </View>

              <View style={styles.benefitRow}>
                <Ionicons name="pricetag" size={20} color={Colors.success} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.benefitHeading}>VIP Discounts</Text>
                  <Text style={styles.benefitDesc}>Additional 10% discount on all electronics and fashion.</Text>
                </View>
              </View>

              <View style={styles.benefitRow}>
                <Ionicons name="gift" size={20} color={Colors.primary} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.benefitHeading}>Early Access to Mega Sales</Text>
                  <Text style={styles.benefitDesc}>Shop Black Friday & Mega Sales 24 hours before the public.</Text>
                </View>
              </View>
            </View>

            <CustomButton
              title="Got It"
              onPress={() => setBenefitsModalVisible(false)}
              style={{ marginTop: 20 }}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  topHeader: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.primaryText,
  },
  settingsIconBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 36,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
    marginBottom: 16,
  },
  avatarImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 14,
    borderWidth: 2,
    borderColor: Colors.lightPurple,
  },
  profileTextCol: {
    flex: 1,
  },
  profileName: {
    fontSize: 17,
    fontWeight: '800',
    color: Colors.primaryText,
    marginBottom: 2,
  },
  profileEmail: {
    fontSize: 13,
    color: Colors.secondaryText,
  },
  premiumCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 18,
    marginBottom: 20,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  premiumLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  crownCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  premiumTextCol: {
    justifyContent: 'center',
  },
  premiumTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.white,
  },
  premiumSubtitle: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.85)',
    marginTop: 1,
  },
  viewBenefitsButton: {
    backgroundColor: Colors.white,
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 20,
  },
  viewBenefitsText: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.primary,
  },
  menuContainer: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 16,
    shadowColor: Colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  menuItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  menuIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.subtlePurple,
    alignItems: 'center',
    justifyContent: 'center',
  },
  destructiveIconContainer: {
    backgroundColor: Colors.errorLight,
  },
  menuItemTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.primaryText,
  },
  destructiveItemTitle: {
    color: Colors.error,
  },
  menuDivider: {
    height: 1,
    backgroundColor: Colors.divider,
  },
  appVersionText: {
    textAlign: 'center',
    fontSize: 12,
    color: Colors.mutedText,
    marginTop: 24,
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
    padding: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.primaryText,
  },
  benefitsList: {
    gap: 16,
  },
  benefitRow: {
    flexDirection: 'row',
    gap: 14,
    alignItems: 'flex-start',
  },
  benefitHeading: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primaryText,
  },
  benefitDesc: {
    fontSize: 12,
    color: Colors.secondaryText,
    marginTop: 2,
    lineHeight: 17,
  },
});
