import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Shadows, BorderRadius, Spacing } from '../constants/theme';
import { RootStackParamList } from '../types';
import { useGrocery } from '../context/GroceryContext';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'EditProfile'>;

export const EditProfileScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { user, updateProfile } = useGrocery();

  // Form inputs initialized from current profile
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone);
  const [address, setAddress] = useState(user.address);

  // Validation errors
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validate = () => {
    const errs: { [key: string]: string } = {};

    if (!name.trim()) {
      errs.name = 'Full name is required';
    } else if (name.trim().length < 2) {
      errs.name = 'Name must be at least 2 characters';
    }

    if (!email.trim()) {
      errs.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(email.trim())) {
      errs.email = 'Please enter a valid email address';
    }

    const cleanPhone = phone.replace(/\D/g, '');
    if (!cleanPhone) {
      errs.phone = 'Mobile number is required';
    } else if (cleanPhone.length < 10) {
      errs.phone = 'Mobile number must be 10 digits';
    }

    if (!address.trim()) {
      errs.address = 'Delivery address is required';
    } else if (address.trim().length < 5) {
      errs.address = 'Address must be at least 5 characters';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;

    updateProfile({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      address: address.trim(),
    });

    Alert.alert('Profile Updated', 'Your customer profile has been saved successfully!', [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}>
        <View style={styles.container}>
          
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.iconCircle}
              onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={22} color={Colors.textPrimary} />
            </TouchableOpacity>

            <Text style={styles.headerTitle}>Edit Profile</Text>
            <View style={{ width: 44 }} />
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled">
            
            <View style={styles.formCard}>
              {/* Full Name */}
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

              {/* Email Address */}
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

              {/* Phone Number */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Mobile Phone (10 digits) *</Text>
                <View style={styles.inputBox}>
                  <Ionicons name="call-outline" size={20} color={Colors.textMuted} />
                  <TextInput
                    style={styles.textInput}
                    placeholder="10-digit phone number"
                    placeholderTextColor={Colors.textMuted}
                    value={phone}
                    onChangeText={setPhone}
                    keyboardType="phone-pad"
                  />
                </View>
                {errors.phone ? <Text style={styles.errorText}>{errors.phone}</Text> : null}
              </View>

              {/* Delivery Address */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Delivery Address *</Text>
                <View style={[styles.inputBox, { height: 90, alignItems: 'flex-start', paddingTop: 10 }]}>
                  <Ionicons name="location-outline" size={20} color={Colors.textMuted} style={{ marginTop: 2 }} />
                  <TextInput
                    style={[styles.textInput, { height: 70, textAlignVertical: 'top' }]}
                    placeholder="Full street address and city"
                    placeholderTextColor={Colors.textMuted}
                    value={address}
                    onChangeText={setAddress}
                    multiline
                  />
                </View>
                {errors.address ? <Text style={styles.errorText}>{errors.address}</Text> : null}
              </View>

              {/* Save Button */}
              <TouchableOpacity
                style={styles.saveBtn}
                activeOpacity={0.85}
                onPress={handleSave}>
                <Text style={styles.saveBtnText}>Save Changes</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing.xl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.card,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  scrollContent: {
    paddingBottom: Spacing.xxxl,
    paddingTop: Spacing.sm,
  },
  formCard: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.xxl,
    padding: Spacing.xl,
    borderWidth: 1,
    borderColor: '#EFF3E4',
    ...Shadows.card,
  },
  inputGroup: {
    marginBottom: Spacing.lg,
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
    height: 52,
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
  saveBtn: {
    backgroundColor: Colors.primary,
    height: 52,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.md,
    ...Shadows.button,
  },
  saveBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
});
