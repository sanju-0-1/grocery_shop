import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { OnboardingScreen } from '../screens/OnboardingScreen';
import { AuthScreen } from '../screens/AuthScreen';
import { AppDrawerNavigator } from './AppDrawerNavigator';
import { ProductDetailsScreen } from '../screens/ProductDetailsScreen';
import { EditProfileScreen } from '../screens/EditProfileScreen';
import { AdminAddProductScreen } from '../screens/AdminAddProductScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="Onboarding"
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}>
      {/* 1. Onboarding Screen matching Figma Screen 1 */}
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />

      {/* 2. Authentication Screen (Sign In & Sign Up for Admin and Customer) */}
      <Stack.Screen name="Auth" component={AuthScreen} />

      {/* 3. Main App with Drawer Navigation & Bottom Tabs Navigation */}
      <Stack.Screen name="MainDrawer" component={AppDrawerNavigator} />

      {/* 4. Product Details Screen matching Figma Screen 5 & 6 */}
      <Stack.Screen name="ProductDetails" component={ProductDetailsScreen} />

      {/* 5. Customer Edit Profile Screen */}
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />

      {/* 6. Admin Add Product Screen */}
      <Stack.Screen name="AdminAddProduct" component={AdminAddProductScreen} />
    </Stack.Navigator>
  );
};
