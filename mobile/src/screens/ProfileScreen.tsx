import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Alert,
} from 'react-native';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Shadows, BorderRadius, Spacing } from '../constants/theme';
import { RootStackParamList } from '../types';
import { useGrocery } from '../context/GroceryContext';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { user, role, signOut, favorites, orders, products } = useGrocery();

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: () => {
          signOut();
          navigation.replace('Auth');
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
      <View style={styles.container}>
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.iconCircle}
            onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}>
            <Ionicons name="menu" size={24} color={Colors.textPrimary} />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>
            {role === 'admin' ? 'Admin Profile' : 'Customer Profile'}
          </Text>

          <TouchableOpacity
            style={styles.iconCircle}
            onPress={() => navigation.navigate('EditProfile')}>
            <Ionicons name="create-outline" size={20} color={Colors.textPrimary} />
          </TouchableOpacity>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}>
          
          {/* Avatar & User Details Card */}
          <View style={styles.profileCard}>
            <View style={styles.avatarWrapper}>
              <Image source={{ uri: user.avatar }} style={styles.avatar} />
              <TouchableOpacity
                style={styles.avatarEditBadge}
                onPress={() => navigation.navigate('EditProfile')}>
                <Ionicons name="camera" size={14} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.userEmail}>{user.email}</Text>

            <View style={styles.roleTag}>
              <Ionicons
                name={role === 'admin' ? 'shield-checkmark' : 'person'}
                size={14}
                color={Colors.textPrimary}
              />
              <Text style={styles.roleTagText}>
                {role === 'admin' ? 'Store Administrator' : 'Verified Customer'}
              </Text>
            </View>
          </View>

          {/* Activity Metrics */}
          <View style={styles.metricsRow}>
            <View style={styles.metricCard}>
              <Text style={styles.metricNumber}>{orders.length}</Text>
              <Text style={styles.metricLabel}>Orders</Text>
            </View>
            {role === 'customer' ? (
              <View style={styles.metricCard}>
                <Text style={styles.metricNumber}>{favorites.length}</Text>
                <Text style={styles.metricLabel}>Favourites</Text>
              </View>
            ) : (
              <View style={styles.metricCard}>
                <Text style={styles.metricNumber}>{products.length}</Text>
                <Text style={styles.metricLabel}>Catalog Items</Text>
              </View>
            )}
            <View style={styles.metricCard}>
              <Text style={styles.metricNumber}>{role === 'admin' ? 'Admin' : '150'}</Text>
              <Text style={styles.metricLabel}>{role === 'admin' ? 'Access' : 'Points'}</Text>
            </View>
          </View>

          {/* Contact & Delivery Details */}
          <View style={styles.infoCard}>
            <Text style={styles.sectionTitle}>Account Details</Text>

            <View style={styles.infoRow}>
              <View style={styles.infoIconBox}>
                <Ionicons name="call-outline" size={18} color={Colors.textSecondary} />
              </View>
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Phone Number</Text>
                <Text style={styles.infoValue}>+91 {user.phone}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <View style={styles.infoIconBox}>
                <Ionicons name="location-outline" size={18} color={Colors.textSecondary} />
              </View>
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Delivery Address</Text>
                <Text style={styles.infoValue}>{user.address}</Text>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <TouchableOpacity
            style={styles.editBtn}
            onPress={() => navigation.navigate('EditProfile')}>
            <Ionicons name="pencil-outline" size={18} color={Colors.textPrimary} />
            <Text style={styles.editBtnText}>Edit Profile Information</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.signOutBtn} onPress={handleSignOut}>
            <Ionicons name="log-out-outline" size={18} color={Colors.danger} />
            <Text style={styles.signOutBtnText}>Sign Out</Text>
          </TouchableOpacity>
        </ScrollView>
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
    paddingBottom: 110,
    paddingTop: Spacing.sm,
  },
  profileCard: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.xxl,
    padding: Spacing.xl,
    alignItems: 'center',
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: '#EFF3E4',
    ...Shadows.card,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: Spacing.md,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
  },
  avatarEditBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  userName: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },
  roleTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.accentYellow,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: BorderRadius.full,
  },
  roleTagText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  metricCard: {
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.xl,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EFF3E4',
    ...Shadows.card,
  },
  metricNumber: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  metricLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  infoCard: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.xxl,
    padding: Spacing.xl,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: '#EFF3E4',
    ...Shadows.card,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  infoIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F5F8ED',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 11,
    color: Colors.textMuted,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.primary,
    height: 50,
    borderRadius: BorderRadius.full,
    marginBottom: Spacing.md,
    ...Shadows.button,
  },
  editBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
  },

  signOutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FEE2E2',
    height: 50,
    borderRadius: BorderRadius.full,
  },
  signOutBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.danger,
  },
});
