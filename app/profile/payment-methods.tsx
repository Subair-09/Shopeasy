import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '../../constants/colors';
import { Header } from '../../components/Header';
import { CustomButton } from '../../components/CustomButton';

interface SavedCard {
  id: string;
  type: 'mastercard' | 'visa';
  bank: string;
  lastFour: string;
  expiry: string;
  isDefault: boolean;
}

export default function PaymentMethodsScreen() {
  const [cards, setCards] = useState<SavedCard[]>([
    {
      id: 'card-1',
      type: 'mastercard',
      bank: 'Guaranty Trust Bank (GTB)',
      lastFour: '4092',
      expiry: '09/28',
      isDefault: true,
    },
    {
      id: 'card-2',
      type: 'visa',
      bank: 'Zenith Bank PLC',
      lastFour: '8114',
      expiry: '12/27',
      isDefault: false,
    },
  ]);

  const handleSetDefault = (id: string) => {
    setCards((prev) =>
      prev.map((c) => ({
        ...c,
        isDefault: c.id === id,
      }))
    );
  };

  const handleAddNew = () => {
    Alert.alert(
      'Add Card via Paystack',
      'Paystack secure PCI-DSS tokenization allows saving your Nigerian debit or credit card safely for 1-click checkout.',
      [
        {
          text: 'Add Mock Test Card',
          onPress: () => {
            const newCard: SavedCard = {
              id: `card-${Date.now()}`,
              type: 'visa',
              bank: 'Access Bank PLC',
              lastFour: `${Math.floor(1000 + Math.random() * 9000)}`,
              expiry: '05/29',
              isDefault: false,
            };
            setCards([...cards, newCard]);
          },
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <Header title="Payment Methods" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionHeader}>Saved Payment Cards</Text>

        {cards.map((card) => (
          <LinearGradient
            key={card.id}
            colors={card.isDefault ? ['#5135ED', '#3925C5'] : ['#2D3436', '#1E1B4B']}
            style={styles.cardBox}
          >
            <View style={styles.cardTopRow}>
              <Text style={styles.bankName}>{card.bank}</Text>
              <Ionicons
                name="card"
                size={26}
                color={card.isDefault ? Colors.accentYellow : Colors.white}
              />
            </View>

            <Text style={styles.cardNumber}>•••• •••• •••• {card.lastFour}</Text>

            <View style={styles.cardBottomRow}>
              <View>
                <Text style={styles.cardExpiryLabel}>EXPIRES</Text>
                <Text style={styles.cardExpiryValue}>{card.expiry}</Text>
              </View>

              {card.isDefault ? (
                <View style={styles.defaultPill}>
                  <Text style={styles.defaultPillText}>DEFAULT</Text>
                </View>
              ) : (
                <TouchableOpacity
                  onPress={() => handleSetDefault(card.id)}
                  style={styles.setDefaultBtn}
                >
                  <Text style={styles.setDefaultBtnText}>Set Default</Text>
                </TouchableOpacity>
              )}
            </View>
          </LinearGradient>
        ))}

        <CustomButton
          title="Add New Card"
          variant="outline"
          onPress={handleAddNew}
          icon={<Ionicons name="add" size={20} color={Colors.primary} />}
          iconPosition="left"
          style={{ marginTop: 12 }}
        />

        {/* Security badge note */}
        <View style={styles.securityBox}>
          <Ionicons name="shield-checkmark" size={24} color={Colors.success} />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.securityTitle}>Bank-Grade Security</Text>
            <Text style={styles.securityDesc}>
              Your payments are processed securely through Paystack with 256-bit SSL encryption.
            </Text>
          </View>
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
  sectionHeader: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.primaryText,
    marginBottom: 14,
  },
  cardBox: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 14,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  bankName: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.white,
  },
  cardNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.white,
    letterSpacing: 2,
    marginBottom: 20,
  },
  cardBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardExpiryLabel: {
    fontSize: 9,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '700',
  },
  cardExpiryValue: {
    fontSize: 13,
    color: Colors.white,
    fontWeight: '700',
    marginTop: 2,
  },
  defaultPill: {
    backgroundColor: Colors.accentYellow,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  defaultPillText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#15152D',
  },
  setDefaultBtn: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  setDefaultBtnText: {
    fontSize: 11,
    color: Colors.white,
    fontWeight: '700',
  },
  securityBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    marginTop: 24,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  securityTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primaryText,
  },
  securityDesc: {
    fontSize: 12,
    color: Colors.secondaryText,
    marginTop: 2,
    lineHeight: 17,
  },
});
