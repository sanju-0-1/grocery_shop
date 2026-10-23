import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Dimensions,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { Colors, Shadows, BorderRadius, Spacing } from '../constants/theme';
import { RootStackParamList } from '../types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Onboarding'>;

const { width, height } = Dimensions.get('window');

export const OnboardingScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();

  const handleGetStarted = () => {
    navigation.navigate('Auth');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
      <View style={styles.container}>
        {/* Top Fruit Composition Hero */}
        <View style={styles.heroWrapper}>
          <Image
            source={{
              uri: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=800&q=80',
            }}
            style={styles.heroImage}
            resizeMode="contain"
          />
        </View>

        {/* Content Section */}
        <View style={styles.contentSection}>
          {/* Pagination Indicators matching Figma */}
          <View style={styles.indicatorRow}>
            <View style={styles.indicatorActive} />
            <View style={styles.indicatorInactive} />
          </View>

          {/* Titles matching Figma */}
          <Text style={styles.title}>Grocery Shop</Text>
          <Text style={styles.subtitle}>
            The easiest way to buy your{'\n'}grocery shopping
          </Text>

          {/* Get Started Button */}
          <TouchableOpacity
            style={styles.primaryButton}
            activeOpacity={0.85}
            onPress={handleGetStarted}>
            <Text style={styles.primaryButtonText}>Get Started</Text>
          </TouchableOpacity>
        </View>
      </View>
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
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xl,
  },
  heroWrapper: {
    flex: 1.1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: Spacing.md,
  },
  heroImage: {
    width: width * 0.85,
    height: height * 0.44,
  },
  contentSection: {
    flex: 0.9,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: Spacing.xl,
  },
  indicatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: Spacing.xl,
  },
  indicatorActive: {
    width: 24,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.textPrimary,
  },
  indicatorInactive: {
    width: 6,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.textMuted,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: Colors.textPrimary,
    textAlign: 'center',
    letterSpacing: -0.5,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: Spacing.xxl,
  },
  primaryButton: {
    width: '100%',
    height: 56,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.button,
  },
  primaryButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.textPrimary,
    letterSpacing: 0.2,
  },
});
