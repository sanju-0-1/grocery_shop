import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import {
  createDrawerNavigator,
  DrawerContentComponentProps,
  DrawerContentScrollView,
} from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import { Colors, BorderRadius, Spacing } from '../constants/theme';
import { DrawerParamList } from '../types';
import { AppTabsNavigator } from './AppTabsNavigator';
import { useGrocery } from '../context/GroceryContext';

const Drawer = createDrawerNavigator<DrawerParamList>();

const CustomDrawerContent: React.FC<DrawerContentComponentProps> = (props) => {
  const { user, role, signOut, cartItemCount, favorites } = useGrocery();

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Do you wish to log out of your session?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log Out',
        style: 'destructive',
        onPress: async () => {
          await signOut();
          props.navigation.reset({
            index: 0,
            routes: [{ name: 'Auth' as any }],
          });
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.drawerContainer}>
      <DrawerContentScrollView {...props} contentContainerStyle={styles.scrollArea}>
        
        {/* User Profile Header in Drawer */}
        <View style={styles.profileHeader}>
          <Image source={{ uri: user.avatar }} style={styles.avatar} />
          <View style={styles.profileInfo}>
            <Text style={styles.userName} numberOfLines={1}>
              {user.name}
            </Text>
            <Text style={styles.userEmail} numberOfLines={1}>
              {user.email}
            </Text>
            <View style={styles.roleBadge}>
              <Ionicons
                name={role === 'admin' ? 'shield-checkmark' : 'person'}
                size={12}
                color={Colors.textPrimary}
              />
              <Text style={styles.roleBadgeText}>
                {role === 'admin' ? 'ADMIN' : 'CUSTOMER'}
              </Text>
            </View>
          </View>
        </View>

        {/* Store Navigation Links */}
        <View style={styles.menuGroup}>
          <Text style={styles.menuGroupTitle}>STORE NAVIGATION</Text>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              props.navigation.navigate('MainTabs', { screen: 'HomeTab' });
            }}>
            <View style={[styles.menuIconBox, { backgroundColor: '#EBF3D9' }]}>
              <Ionicons name="storefront-outline" size={20} color={Colors.textPrimary} />
            </View>
            <Text style={styles.menuText}>Grocery Store</Text>
          </TouchableOpacity>

          {role === 'customer' && (
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                props.navigation.navigate('MainTabs', { screen: 'FavouriteTab' });
              }}>
              <View style={[styles.menuIconBox, { backgroundColor: '#FDECEC' }]}>
                <Ionicons name="heart-outline" size={20} color={Colors.heartRed} />
              </View>
              <Text style={styles.menuText}>Favourites ({favorites.length})</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              props.navigation.navigate('MainTabs', { screen: 'CartTab' });
            }}>
            <View style={[styles.menuIconBox, { backgroundColor: '#FEF9D9' }]}>
              <Ionicons name="cart-outline" size={20} color={Colors.textPrimary} />
            </View>
            <Text style={styles.menuText}>My Cart ({cartItemCount})</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              props.navigation.navigate('MainTabs', { screen: 'ProfileTab' });
            }}>
            <View style={[styles.menuIconBox, { backgroundColor: '#E6F4FE' }]}>
              <Ionicons name="person-outline" size={20} color={Colors.textPrimary} />
            </View>
            <Text style={styles.menuText}>
              {role === 'admin' ? 'Admin Profile' : 'Customer Profile'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={18} color={Colors.danger} />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </DrawerContentScrollView>
    </SafeAreaView>
  );
};

export const AppDrawerNavigator: React.FC = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          backgroundColor: Colors.background,
          width: 300,
        },
      }}>
      <Drawer.Screen
        name="MainTabs"
        component={AppTabsNavigator}
        options={{ drawerLabel: 'Store' }}
      />
    </Drawer.Navigator>
  );
};

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollArea: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8D5',
    marginBottom: Spacing.md,
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    marginRight: Spacing.md,
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  userEmail: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.accentYellow,
    alignSelf: 'flex-start',
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: BorderRadius.full,
  },
  roleBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  menuGroup: {
    marginBottom: Spacing.xl,
  },
  menuGroupTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textMuted,
    marginBottom: Spacing.sm,
    letterSpacing: 0.5,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: BorderRadius.lg,
    marginBottom: 4,
  },
  menuIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  menuText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FEE2E2',
    height: 48,
    borderRadius: BorderRadius.full,
    marginTop: Spacing.lg,
    marginBottom: Spacing.xxl,
  },
  logoutText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.danger,
  },
});
