import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Shadows, BorderRadius, Spacing } from '../constants/theme';
import { Product, RootStackParamList } from '../types';
import { useGrocery } from '../context/GroceryContext';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const AdminManageScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { products, deleteProduct, role } = useGrocery();

  const handleDelete = (product: Product) => {
    Alert.alert(
      'Confirm Deletion',
      `Delete "${product.name}" from the store catalog?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteProduct(product.id),
        },
      ]
    );
  };

  const renderItem = ({ item }: { item: Product }) => (
    <View style={styles.productRow}>
      <Image source={{ uri: item.image }} style={styles.thumb} resizeMode="contain" />
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemCat}>
          {item.category} • Rs {item.price}/{item.unit}
        </Text>
      </View>
      <TouchableOpacity
        style={styles.deleteBtn}
        onPress={() => handleDelete(item)}>
        <Ionicons name="trash-outline" size={18} color={Colors.danger} />
      </TouchableOpacity>
    </View>
  );

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

          <Text style={styles.headerTitle}>Catalog Management</Text>

          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => navigation.navigate('AdminAddProduct')}>
            <Ionicons name="add" size={20} color={Colors.textPrimary} />
          </TouchableOpacity>
        </View>

        <View style={styles.infoBanner}>
          <Ionicons name="information-circle" size={18} color={Colors.primaryDark} />
          <Text style={styles.infoBannerText}>
            Admin Mode active: Add, inspect, and remove products.
          </Text>
        </View>

        <FlatList
          data={products}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
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
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  addBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.accentYellow,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.card,
  },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FAF5D8',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginVertical: Spacing.sm,
  },
  infoBannerText: {
    fontSize: 12,
    color: Colors.textPrimary,
    fontWeight: '600',
    flex: 1,
  },
  listContent: {
    paddingBottom: Spacing.xxxl,
    paddingTop: Spacing.xs,
  },
  productRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: '#EFF3E4',
    ...Shadows.card,
  },
  thumb: {
    width: 46,
    height: 46,
    borderRadius: 8,
    marginRight: Spacing.md,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  itemCat: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  deleteBtn: {
    padding: 8,
  },
});
