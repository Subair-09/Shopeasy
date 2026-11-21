import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/colors';
import { CustomInput } from '../../components/CustomInput';
import { CustomButton } from '../../components/CustomButton';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = () => {
    if (!email.trim() || !email.includes('@')) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 800);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        enabled={Platform.OS === 'ios'}
      >
        <View style={styles.container}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => router.back()}
            style={styles.backButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="arrow-back" size={22} color={Colors.primaryText} />
          </TouchableOpacity>

          <View style={styles.iconCircle}>
            <Ionicons name="key-outline" size={32} color={Colors.primary} />
          </View>

          <Text style={styles.heading}>Reset Password</Text>
          <Text style={styles.subtitle}>
            Enter your registered email address and we will send password reset instructions to your inbox.
          </Text>

          {submitted ? (
            <View style={styles.successBox}>
              <Ionicons name="checkmark-circle" size={48} color={Colors.success} />
              <Text style={styles.successHeading}>Check Your Email</Text>
              <Text style={styles.successText}>
                We sent a password recovery link to {email}. Follow the instructions to reset your password.
              </Text>
              <CustomButton
                title="Return to Login"
                onPress={() => router.replace('/(auth)/login')}
                style={{ marginTop: 24 }}
              />
            </View>
          ) : (
            <View style={styles.formContainer}>
              <CustomInput
                label="Email Address"
                placeholder="e.g. nurudeen@example.com"
                iconName="mail-outline"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
              />
              <CustomButton
                title="Send Instructions"
                onPress={handleSubmit}
                loading={loading}
                style={{ marginTop: 8 }}
              />
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.inputBackground,
    marginBottom: 20,
  },
  iconCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: Colors.lightPurple,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  heading: {
    fontSize: 26,
    fontWeight: '900',
    color: Colors.primaryText,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.secondaryText,
    lineHeight: 20,
    marginBottom: 28,
  },
  formContainer: {
    width: '100%',
  },
  successBox: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: Colors.subtlePurple,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  successHeading: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.primaryText,
    marginTop: 12,
  },
  successText: {
    fontSize: 13,
    color: Colors.secondaryText,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 19,
  },
});
