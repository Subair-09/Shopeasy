import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/colors';
import { Header } from '../../components/Header';
import { CustomButton } from '../../components/CustomButton';
import { CustomInput } from '../../components/CustomInput';
import { useAuth } from '../../context/AuthContext';
import { Address } from '../../types';

export default function AddressesScreen() {
  const { user, updateProfile } = useAuth();
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  // New Address form state
  const [title, setTitle] = useState<string>('Home');
  const [street, setStreet] = useState<string>('');
  const [city, setCity] = useState<string>('Lagos');
  const [state, setState] = useState<string>('Lagos State');

  const addresses = user?.addresses || [];

  const handleSetDefault = async (id: string) => {
    const updated = addresses.map((addr) => ({
      ...addr,
      isDefault: addr.id === id,
    }));
    await updateProfile({ addresses: updated });
  };

  const handleDeleteAddress = (id: string) => {
    Alert.alert('Delete Address', 'Are you sure you want to remove this address?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          const updated = addresses.filter((addr) => addr.id !== id);
          await updateProfile({ addresses: updated });
        },
      },
    ]);
  };

  const handleAddAddress = async () => {
    if (!street.trim()) {
      Alert.alert('Required', 'Please enter your street address.');
      return;
    }

    const newAddr: Address = {
      id: `addr-${Date.now()}`,
      title: title.trim(),
      street: street.trim(),
      city: city.trim(),
      state: state.trim(),
      isDefault: addresses.length === 0,
    };

    const updated = [...addresses, newAddr];
    await updateProfile({ addresses: updated });

    setStreet('');
    setModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <Header
        title="My Addresses"
        rightAction={
          <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.addBtn}>
            <Ionicons name="add" size={24} color={Colors.primary} />
          </TouchableOpacity>
        }
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {addresses.map((address) => (
          <View
            key={address.id}
            style={[
              styles.addressCard,
              address.isDefault && styles.defaultAddressCard,
            ]}
          >
            <View style={styles.cardHeader}>
              <View style={styles.tagRow}>
                <View style={styles.tagBadge}>
                  <Text style={styles.tagText}>{address.title}</Text>
                </View>
                {address.isDefault && (
                  <View style={styles.defaultBadge}>
                    <Text style={styles.defaultBadgeText}>DEFAULT</Text>
                  </View>
                )}
              </View>

              <TouchableOpacity
                onPress={() => handleDeleteAddress(address.id)}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Ionicons name="trash-outline" size={18} color={Colors.error} />
              </TouchableOpacity>
            </View>

            <Text style={styles.streetText}>{address.street}</Text>
            <Text style={styles.cityText}>
              {address.city}, {address.state}
            </Text>

            {!address.isDefault && (
              <TouchableOpacity
                onPress={() => handleSetDefault(address.id)}
                style={styles.setDefaultRow}
              >
                <Ionicons name="radio-button-off" size={16} color={Colors.primary} />
                <Text style={styles.setDefaultText}>Set as default address</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}

        <CustomButton
          title="Add New Address"
          variant="outline"
          onPress={() => setModalVisible(true)}
          icon={<Ionicons name="add-circle-outline" size={20} color={Colors.primary} />}
          iconPosition="left"
          style={{ marginTop: 8 }}
        />
      </ScrollView>

      {/* Add Address Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Delivery Address</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color={Colors.primaryText} />
              </TouchableOpacity>
            </View>

            <CustomInput
              label="Address Label"
              placeholder="e.g. Home, Office, Studio"
              value={title}
              onChangeText={setTitle}
            />

            <CustomInput
              label="Street Address"
              placeholder="e.g. 14 Admiralty Way, Lekki Phase 1"
              value={street}
              onChangeText={setStreet}
            />

            <CustomInput
              label="City"
              placeholder="e.g. Lagos"
              value={city}
              onChangeText={setCity}
            />

            <CustomInput
              label="State"
              placeholder="e.g. Lagos State"
              value={state}
              onChangeText={setState}
            />

            <CustomButton
              title="Save Address"
              onPress={handleAddAddress}
              style={{ marginTop: 10 }}
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
  addBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.lightPurple,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
    gap: 12,
  },
  addressCard: {
    backgroundColor: Colors.white,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1.5,
    borderColor: Colors.border,
    shadowColor: Colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  defaultAddressCard: {
    borderColor: Colors.primary,
    backgroundColor: '#FAF9FF',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  tagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tagBadge: {
    backgroundColor: Colors.lightPurple,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primary,
  },
  defaultBadge: {
    backgroundColor: Colors.accentYellow,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  defaultBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#15152D',
  },
  streetText: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.primaryText,
    marginBottom: 4,
  },
  cityText: {
    fontSize: 13,
    color: Colors.secondaryText,
    marginBottom: 10,
  },
  setDefaultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
  },
  setDefaultText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primary,
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
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.primaryText,
  },
});
