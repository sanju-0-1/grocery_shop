export type UserRole = 'customer' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  role: UserRole;
  avatar: string;
}

export type ProductCategory = 'Fruits' | 'Vegetables';

export interface Product {
  id: string;
  name: string;
  subtitle?: string;
  category: ProductCategory;
  price: number; // in INR Rs
  unit: string;  // e.g. "kg"
  rating: number; // e.g. 5.0
  reviewsCount?: number;
  image: string;
  description: string;
  relatedIds?: string[];
  inStock?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number; // in kg or units
}

export interface Order {
  id: string;
  items: CartItem[];
  totalAmount: number;
  date: string;
  status: 'Pending' | 'Confirmed' | 'Delivered';
  deliveryAddress: string;
}

// Navigation Parameter Types
export type RootStackParamList = {
  Onboarding: undefined;
  Auth: { isSignUp?: boolean } | undefined;
  MainDrawer: undefined;
  ProductDetails: { productId: string };
  EditProfile: undefined;
  AdminAddProduct: { productToEdit?: Product } | undefined;
};

import { NavigatorScreenParams } from '@react-navigation/native';

export type DrawerParamList = {
  MainTabs: NavigatorScreenParams<TabParamList> | undefined;
};

export type TabParamList = {
  HomeTab: undefined;
  FavouriteTab: undefined;
  CartTab: undefined;
  ProfileTab: undefined;
};
