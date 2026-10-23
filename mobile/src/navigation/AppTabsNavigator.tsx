import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Shadows, Spacing } from '../constants/theme';
import { TabParamList } from '../types';
import { HomeScreen } from '../screens/HomeScreen';
import { FavoritesScreen } from '../screens/FavoritesScreen';
import { CartScreen } from '../screens/CartScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { useGrocery } from '../context/GroceryContext';

const Tab = createBottomTabNavigator<TabParamList>();

export const AppTabsNavigator: React.FC = () => {
  const { cartItemCount, favorites, role } = useGrocery();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: Colors.tabActive,
        tabBarInactiveTintColor: Colors.tabInactive,
        tabBarLabelStyle: styles.tabBarLabel,
      }}>
      
      {/* 1. Home Tab matching Figma */}
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'home' : 'home-outline'}
              size={22}
              color={color}
            />
          ),
        }}
      />

      {/* 2. Favourite Tab matching Figma (Only for Customer) */}
      {role === 'customer' && (
        <Tab.Screen
          name="FavouriteTab"
          component={FavoritesScreen}
          options={{
            tabBarLabel: 'Favourite',
            tabBarBadge: favorites.length > 0 ? favorites.length : undefined,
            tabBarBadgeStyle: styles.badge,
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? 'heart' : 'heart-outline'}
                size={22}
                color={color}
              />
            ),
          }}
        />
      )}

      {/* 3. My Cart Tab matching Figma */}
      <Tab.Screen
        name="CartTab"
        component={CartScreen}
        options={{
          tabBarLabel: 'My Cart',
          tabBarBadge: cartItemCount > 0 ? cartItemCount : undefined,
          tabBarBadgeStyle: styles.badge,
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'cart' : 'cart-outline'}
              size={22}
              color={color}
            />
          ),
        }}
      />

      {/* 4. Profile Tab matching Figma */}
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'person' : 'person-outline'}
              size={22}
              color={color}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#F3F6E9',
    borderTopWidth: 1,
    borderTopColor: '#E8EEDC',
    height: Platform.OS === 'ios' ? 84 : 64,
    paddingBottom: Platform.OS === 'ios' ? 24 : 8,
    paddingTop: 8,
    elevation: 8,
    shadowColor: '#1E2515',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  tabBarLabel: {
    fontSize: 11,
    fontWeight: '700',
    marginTop: 2,
  },
  badge: {
    backgroundColor: Colors.accentYellow,
    color: Colors.textPrimary,
    fontSize: 10,
    fontWeight: '800',
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    lineHeight: 16,
  },
});
