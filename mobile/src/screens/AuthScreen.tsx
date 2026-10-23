import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { Colors, BorderRadius, Spacing, Shadows } from '../constants/theme';
import { RootStackParamList } from '../types';
import { useGrocery } from '../context/GroceryContext';

type RouteProps = RouteProp<RootStackParamList, 'Auth'>;
type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Auth'>;

export const AuthScreen: React.FC = () => {
  const route = useRoute<RouteProps>();
  const navigation = useNavigation<NavigationProp>();
  const { signIn, signUp } = useGrocery();

  const [isSignUp, setIsSignUp] = useState<boolean>(route.params?.isSignUp || false);

  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Validation Errors
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validate = () => {
    const errs: { [key: string]: string } = {};

    if (isSignUp && !name.trim()) {
      errs.name = 'Full name is required';
    }

    if (!email.trim()) {
      errs.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(email.trim())) {
      errs.email = 'Please enter a valid email address';
    }

    if (!password) {
      errs.password = 'Password is required';
    } else if (password.length < 6) {
      errs.password = 'Password must be at least 6 characters';
    }

    if (isSignUp) {
      const cleanPhone = phone.replace(/\D/g, '');
      if (!cleanPhone) {
        errs.phone = 'Mobile number is required';
      } else if (cleanPhone.length < 10) {
        errs.phone = 'Enter a valid 10-digit mobile number';
      }

      if (!address.trim()) {
        errs.address = 'Delivery address is required';
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    if (isSignUp) {
      const result = await signUp({
        name: name.trim(),
        email: email.trim(),
        password: password.trim(),
        phone: phone.trim(),
        address: address.trim(),
      });

      if (result.success) {
        Alert.alert('Account Created!', 'Welcome to Grocery Shop!', [
          { text: 'Continue', onPress: () => navigation.replace('MainDrawer') },
        ]);
      } else {
        Alert.alert('Sign Up Error', result.error || 'Failed to create account.');
      }
    } else {
      const result = await signIn(email.trim(), password.trim());
      if (result.success) {
        navigation.replace('MainDrawer');
      } else {
        Alert.alert('Sign In Failed', result.error || 'Invalid credentials.');
      }
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled">
          
          {/* Header Bar */}
          <View style={styles.topBar}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.canGoBack() ? navigation.goBack() : navigation.replace('Onboarding')}>
              <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>
              {isSignUp ? 'Create Account' : 'Welcome Back'}
            </Text>
            <View style={{ width: 40 }} />
          </View>

          {/* Sign In vs Sign Up Tabs */}
          <View style={styles.authTabs}>
            <TouchableOpacity
              style={[styles.authTab, !isSignUp && styles.authTabActive]}
              onPress={() => {
                setIsSignUp(false);
                setErrors({});
              }}>
              <Text style={[styles.authTabText, !isSignUp && styles.authTabTextActive]}>
                Sign In
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.authTab, isSignUp && styles.authTabActive]}
              onPress={() => {
                setIsSignUp(true);
                setErrors({});
              }}>
              <Text style={[styles.authTabText, isSignUp && styles.authTabTextActive]}>
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>

          {/* Form Fields with Validation */}
          <View style={styles.formCard}>
            {isSignUp && (
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Full Name *</Text>
                <View style={styles.inputBox}>
                  <Ionicons name="person-outline" size={20} color={Colors.textMuted} />
                  <TextInput
                    style={styles.textInput}
                    placeholder="Enter your name"
                    placeholderTextColor={Colors.textMuted}
                    value={name}
                    onChangeText={setName}
                  />
                </View>
                {errors.name ? <Text style={styles.errorText}>{errors.name}</Text> : null}
              </View>
            )}

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email Address *</Text>
              <View style={styles.inputBox}>
                <Ionicons name="mail-outline" size={20} color={Colors.textMuted} />
                <TextInput
                  style={styles.textInput}
                  placeholder="name@example.com"
                  placeholderTextColor={Colors.textMuted}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
              {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password *</Text>
              <View style={styles.inputBox}>
                <Ionicons name="lock-closed-outline" size={20} color={Colors.textMuted} />
                <TextInput
                  style={styles.textInput}
                  placeholder="Min. 6 characters"
                  placeholderTextColor={Colors.textMuted}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Ionicons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color={Colors.textMuted}
                  />
                </TouchableOpacity>
              </View>
              {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}
            </View>

            {isSignUp && (
              <>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Mobile Phone Number *</Text>
                  <View style={styles.inputBox}>
                    <Ionicons name="call-outline" size={20} color={Colors.textMuted} />
                    <TextInput
                      style={styles.textInput}
                      placeholder="10-digit mobile number"
                      placeholderTextColor={Colors.textMuted}
                      value={phone}
                      onChangeText={setPhone}
                      keyboardType="phone-pad"
                    />
                  </View>
                  {errors.phone ? <Text style={styles.errorText}>{errors.phone}</Text> : null}
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Delivery Address *</Text>
                  <View style={[styles.inputBox, { height: 76, alignItems: 'flex-start', paddingTop: 8 }]}>
                    <Ionicons name="location-outline" size={20} color={Colors.textMuted} style={{ marginTop: 2 }} />
                    <TextInput
                      style={[styles.textInput, { height: 60, textAlignVertical: 'top' }]}
                      placeholder="Street, City, Postal code"
                      placeholderTextColor={Colors.textMuted}
                      value={address}
                      onChangeText={setAddress}
                      multiline
                    />
                  </View>
                  {errors.address ? <Text style={styles.errorText}>{errors.address}</Text> : null}
                </View>
              </>
            )}

            {/* Submit Action Button */}
            <TouchableOpacity
              style={styles.submitBtn}
              activeOpacity={0.85}
              onPress={handleSubmit}>
              <Text style={styles.submitBtnText}>
                {isSignUp ? 'Sign Up' : 'Sign In'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xxxl,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
    marginBottom: Spacing.sm,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.card,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  authTabs: {
    flexDirection: 'row',
    marginBottom: Spacing.lg,
    borderBottomWidth: 2,
    borderBottomColor: Colors.border,
  },
  authTab: {
    flex: 1,
    paddingVertical: Spacing.md,
    alignItems: 'center',
  },
  authTabActive: {
    borderBottomWidth: 3,
    borderBottomColor: Colors.primary,
  },
  authTabText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  authTabTextActive: {
    color: Colors.textPrimary,
    fontWeight: '800',
  },
  formCard: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.xxl,
    padding: Spacing.xl,
    ...Shadows.card,
  },
  inputGroup: {
    marginBottom: Spacing.md,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 6,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    height: 50,
    backgroundColor: '#FAFCF5',
    gap: 10,
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    color: Colors.textPrimary,
  },
  errorText: {
    color: Colors.danger,
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
  },
  submitBtn: {
    backgroundColor: Colors.primary,
    height: 54,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.lg,
    ...Shadows.button,
  },
  submitBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
});
