import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/colors';
import { Header } from '../../components/Header';
import { useAuth } from '../../context/AuthContext';

export default function SettingsScreen() {
  const router = useRouter();
  const { resetOnboarding } = useAuth();

  const [pushNotifs, setPushNotifs] = useState<boolean>(true);
  const [promoEmails, setPromoEmails] = useState<boolean>(true);
  const [biometrics, setBiometrics] = useState<boolean>(false);

  const handleResetOnboarding = () => {
    Alert.alert(
      'Reset Onboarding',
      'This will reset your onboarding walkthrough so you can preview the splash & intro screens on next launch.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset & Go to Splash',
          onPress: async () => {
            await resetOnboarding();
            router.replace('/');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <Header title="Settings" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Notifications Section */}
        <Text style={styles.sectionTitle}>Notifications & Alerts</Text>
        <View style={styles.card}>
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Text style={styles.rowTitle}>Order Status Updates</Text>
              <Text style={styles.rowSubtitle}>Receive updates on dispatch and delivery</Text>
            </View>
            <Switch
              value={pushNotifs}
              onValueChange={setPushNotifs}
              trackColor={{ false: Colors.border, true: Colors.primary }}
              thumbColor={Colors.white}
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Text style={styles.rowTitle}>Promotions & Discounts</Text>
              <Text style={styles.rowSubtitle}>Receive weekly flash deals & coupons</Text>
            </View>
            <Switch
              value={promoEmails}
              onValueChange={setPromoEmails}
              trackColor={{ false: Colors.border, true: Colors.primary }}
              thumbColor={Colors.white}
            />
          </View>
        </View>

        {/* Security Section */}
        <Text style={styles.sectionTitle}>Security</Text>
        <View style={styles.card}>
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Text style={styles.rowTitle}>Face ID / Biometric Login</Text>
              <Text style={styles.rowSubtitle}>Fast & secure authentication</Text>
            </View>
            <Switch
              value={biometrics}
              onValueChange={setBiometrics}
              trackColor={{ false: Colors.border, true: Colors.primary }}
              thumbColor={Colors.white}
            />
          </View>
        </View>

        {/* App Preferences */}
        <Text style={styles.sectionTitle}>Preferences</Text>
        <View style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.rowTitle}>Currency</Text>
            <View style={styles.pillBadge}>
              <Text style={styles.pillBadgeText}>NGN (₦)</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.row}>
            <Text style={styles.rowTitle}>Language</Text>
            <View style={styles.pillBadge}>
              <Text style={styles.pillBadgeText}>English</Text>
            </View>
          </View>
        </View>

        {/* Developer & Test Options */}
        <Text style={styles.sectionTitle}>Demo & Preview Controls</Text>
        <View style={styles.card}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleResetOnboarding}
            style={styles.row}
          >
            <View style={{ flex: 1 }}>
              <Text style={[styles.rowTitle, { color: Colors.primary }]}>
                Re-test Onboarding Flow
              </Text>
              <Text style={styles.rowSubtitle}>
                Reset onboarding flag and replay welcome screens
              </Text>
            </View>
            <Ionicons name="refresh-circle-outline" size={24} color={Colors.primary} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.secondaryText,
    marginTop: 18,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 18,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
  },
  rowTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.primaryText,
  },
  rowSubtitle: {
    fontSize: 12,
    color: Colors.secondaryText,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.divider,
  },
  pillBadge: {
    backgroundColor: Colors.lightPurple,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  pillBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primary,
  },
});
