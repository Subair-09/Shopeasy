import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons, FontAwesome, AntDesign } from '@expo/vector-icons';
import Colors from '../../constants/colors';
import { CustomInput } from '../../components/CustomInput';
import { CustomButton } from '../../components/CustomButton';
import { useAuth } from '../../context/AuthContext';

export default function SignupScreen() {
  const router = useRouter();
  const { register } = useAuth();

  const [fullName, setFullName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  // Form errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!emailRegex.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (phone.trim().length < 8) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = async () => {
    if (!validate()) return;

    setLoading(true);
    const success = await register(fullName, email, phone, password);
    setLoading(false);

    if (success) {
      router.replace('/(tabs)/home');
    } else {
      Alert.alert('Error', 'Unable to create account. Please try again.');
    }
  };

  const handleSocialPlaceholder = (provider: string) => {
    Alert.alert(
      `${provider} Sign Up`,
      `${provider} authentication will connect with your verified account. Proceeding with instant demo access.`,
      [
        {
          text: 'Continue as Guest',
          onPress: async () => {
            await register('ShopEasy User', 'user@shopeasy.ng', '+234800000000');
            router.replace('/(tabs)/home');
          },
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        enabled={Platform.OS === 'ios'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Top Back Navigation */}
          <View style={styles.topNavRow}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => router.back()}
              style={styles.backButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="arrow-back" size={22} color={Colors.primaryText} />
            </TouchableOpacity>
          </View>

          {/* Heading */}
          <View style={styles.headerContainer}>
            <Text style={styles.heading}>Create Account</Text>
            <Text style={styles.subtitle}>Join ShopEasy and start shopping</Text>
          </View>

          {/* Form Fields */}
          <View style={styles.formContainer}>
            <CustomInput
              label="Full Name"
              placeholder="e.g. Nurudeen Adewale"
              iconName="person-outline"
              value={fullName}
              onChangeText={(t) => {
                setFullName(t);
                if (errors.fullName) setErrors({ ...errors, fullName: '' });
              }}
              error={errors.fullName}
            />

            <CustomInput
              label="Email Address"
              placeholder="e.g. nurudeen@example.com"
              iconName="mail-outline"
              keyboardType="email-address"
              value={email}
              onChangeText={(t) => {
                setEmail(t);
                if (errors.email) setErrors({ ...errors, email: '' });
              }}
              error={errors.email}
            />

            <CustomInput
              label="Phone Number"
              placeholder="e.g. +234 812 345 6789"
              iconName="call-outline"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={(t) => {
                setPhone(t);
                if (errors.phone) setErrors({ ...errors, phone: '' });
              }}
              error={errors.phone}
            />

            <CustomInput
              label="Password"
              placeholder="At least 6 characters"
              iconName="lock-closed-outline"
              isPassword
              value={password}
              onChangeText={(t) => {
                setPassword(t);
                if (errors.password) setErrors({ ...errors, password: '' });
              }}
              error={errors.password}
            />

            <CustomInput
              label="Confirm Password"
              placeholder="Re-enter password"
              iconName="lock-closed-outline"
              isPassword
              value={confirmPassword}
              onChangeText={(t) => {
                setConfirmPassword(t);
                if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: '' });
              }}
              error={errors.confirmPassword}
            />

            {/* Sign Up Button */}
            <CustomButton
              title="Sign Up"
              onPress={handleSignUp}
              loading={loading}
              size="large"
              style={styles.signupButton}
            />

            {/* Social Divider */}
            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or continue with</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Social Buttons */}
            <View style={styles.socialButtonsRow}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => handleSocialPlaceholder('Google')}
                style={styles.socialCircle}
              >
                <AntDesign name="google" size={20} color="#EA4335" />
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => handleSocialPlaceholder('Apple')}
                style={styles.socialCircle}
              >
                <FontAwesome name="apple" size={22} color="#000000" />
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => handleSocialPlaceholder('Facebook')}
                style={styles.socialCircle}
              >
                <FontAwesome name="facebook" size={20} color="#1877F2" />
              </TouchableOpacity>
            </View>

            {/* Bottom Nav to Login */}
            <View style={styles.bottomNavRow}>
              <Text style={styles.bottomNavText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
                <Text style={styles.bottomNavHighlight}>Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 36,
  },
  topNavRow: {
    height: 48,
    justifyContent: 'center',
    marginTop: 4,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.inputBackground,
  },
  headerContainer: {
    marginTop: 12,
    marginBottom: 24,
  },
  heading: {
    fontSize: 28,
    fontWeight: '900',
    color: Colors.primaryText,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    color: Colors.secondaryText,
    marginTop: 6,
  },
  formContainer: {
    width: '100%',
  },
  signupButton: {
    marginTop: 10,
    borderRadius: 18,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },
  dividerText: {
    paddingHorizontal: 14,
    fontSize: 13,
    color: Colors.secondaryText,
    fontWeight: '500',
  },
  socialButtonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 18,
    marginBottom: 28,
  },
  socialCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 1.5,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
    shadowColor: Colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  bottomNavRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomNavText: {
    fontSize: 14,
    color: Colors.secondaryText,
  },
  bottomNavHighlight: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primary,
  },
});
