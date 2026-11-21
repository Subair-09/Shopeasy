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

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState<string>('nurudeen@example.com');
  const [password, setPassword] = useState<string>('password123');
  const [rememberMe, setRememberMe] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    }
    if (!password) {
      newErrors.password = 'Password is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;

    setLoading(true);
    const success = await login(email, password);
    setLoading(false);

    if (success) {
      router.replace('/(tabs)/home');
    } else {
      Alert.alert('Login Failed', 'Please verify your credentials and try again.');
    }
  };

  const handleSocialPlaceholder = (provider: string) => {
    Alert.alert(
      `${provider} Login`,
      `Login with ${provider} is ready for production credentials. You can continue instantly with standard demo session.`,
      [
        {
          text: 'Continue to App',
          onPress: async () => {
            await login('nurudeen@example.com');
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

          {/* Logo Badge */}
          <View style={styles.logoBadgeContainer}>
            <View style={styles.logoCircle}>
              <Ionicons name="bag-handle" size={36} color={Colors.primary} />
            </View>
          </View>

          {/* Headings */}
          <View style={styles.headerContainer}>
            <Text style={styles.heading}>Welcome Back</Text>
            <Text style={styles.subtitle}>Login to continue shopping</Text>
          </View>

          {/* Form */}
          <View style={styles.formContainer}>
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
              label="Password"
              placeholder="Enter your password"
              iconName="lock-closed-outline"
              isPassword
              value={password}
              onChangeText={(t) => {
                setPassword(t);
                if (errors.password) setErrors({ ...errors, password: '' });
              }}
              error={errors.password}
            />

            {/* Remember Me & Forgot Password */}
            <View style={styles.rememberRow}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setRememberMe(!rememberMe)}
                style={styles.checkboxRow}
              >
                <View style={[styles.checkbox, rememberMe && styles.checkboxActive]}>
                  {rememberMe && <Ionicons name="checkmark" size={14} color={Colors.white} />}
                </View>
                <Text style={styles.rememberText}>Remember me</Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => router.push('/(auth)/forgot-password')}
              >
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </TouchableOpacity>
            </View>

            {/* Login Button */}
            <CustomButton
              title="Login"
              onPress={handleLogin}
              loading={loading}
              size="large"
              style={styles.loginButton}
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

            {/* Bottom Nav to Sign Up */}
            <View style={styles.bottomNavRow}>
              <Text style={styles.bottomNavText}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => router.push('/(auth)/signup')}>
                <Text style={styles.bottomNavHighlight}>Sign Up</Text>
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
  logoBadgeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 16,
  },
  logoCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: Colors.lightPurple,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 26,
  },
  heading: {
    fontSize: 26,
    fontWeight: '900',
    color: Colors.primaryText,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.secondaryText,
    marginTop: 6,
  },
  formContainer: {
    width: '100%',
  },
  rememberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
    marginRight: 8,
  },
  checkboxActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  rememberText: {
    fontSize: 13,
    color: Colors.primaryText,
    fontWeight: '500',
  },
  forgotPasswordText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primary,
  },
  loginButton: {
    marginTop: 4,
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
