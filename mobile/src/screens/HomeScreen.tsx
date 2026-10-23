import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  Image,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Alert,
} from 'react-native';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Shadows, BorderRadius, Spacing } from '../constants/theme';
import { Product, ProductCategory, RootStackParamList } from '../types';
import { useGrocery } from '../context/GroceryContext';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - Spacing.xl * 2 - Spacing.md) / 2;

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const {
    products,
    role,
    deleteProduct,
  } = useGrocery();

  // Active Category Pill ('Fruits' vs 'Vegetables')
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('Fruits');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchActive, setIsSearchActive] = useState(false);

  // Filter products by category and search
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory = p.category === selectedCategory;
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase());
      return isSearchActive ? matchesSearch : matchesCategory;
    });
  }, [products, selectedCategory, searchQuery, isSearchActive]);

  const handleDeleteProduct = (product: Product) => {
    Alert.alert(
      'Delete Product',
      `Are you sure you want to remove "${product.name}" from the store catalog?`,
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

  const renderProductCard = ({ item }: { item: Product }) => {
    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.88}
        onPress={() => navigation.navigate('ProductDetails', { productId: item.id })}>
        
        {/* Admin Delete Action */}
        {role === 'admin' && (
          <View style={styles.cardTopRow}>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDeleteProduct(item)}>
              <Ionicons name="trash-outline" size={16} color={Colors.danger} />
            </TouchableOpacity>
          </View>
        )}

        {/* Product Image */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: item.image }}
            style={styles.productImage}
            resizeMode="contain"
          />
        </View>

        {/* Product Info */}
        <View style={styles.cardContent}>
          <Text style={styles.productName} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={styles.productPrice}>
            Rs {item.price}/{item.unit}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
      <View style={styles.container}>
        
        {/* Header Bar matching Figma */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            {/* Drawer Navigator Toggle */}
            <TouchableOpacity
              style={styles.iconCircle}
              onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}>
              <Ionicons name="menu" size={24} color={Colors.textPrimary} />
            </TouchableOpacity>
            
            <View>
              <Text style={styles.headerTitle}>Daily</Text>
              <Text style={styles.headerTitle}>Grocery Food</Text>
            </View>
          </View>

          <View style={styles.headerRight}>
            {/* Admin Add Item Shortcut */}
            {role === 'admin' && (
              <TouchableOpacity
                style={styles.adminAddBtn}
                onPress={() => navigation.navigate('AdminAddProduct')}>
                <Ionicons name="add" size={20} color={Colors.textPrimary} />
              </TouchableOpacity>
            )}

            {/* Search Circle Button */}
            <TouchableOpacity
              style={styles.searchCircle}
              onPress={() => setIsSearchActive(!isSearchActive)}>
              <Ionicons
                name={isSearchActive ? 'close' : 'search'}
                size={20}
                color={Colors.textPrimary}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Search Input Bar (Expandable) */}
        {isSearchActive && (
          <View style={styles.searchBarBox}>
            <Ionicons name="search" size={18} color={Colors.textMuted} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search fruits, vegetables..."
              placeholderTextColor={Colors.textMuted}
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={18} color={Colors.textMuted} />
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Category Pills (Fruits vs Vegetables) matching Figma */}
        <View style={styles.categoryPillsRow}>
          <TouchableOpacity
            style={[
              styles.categoryPill,
              selectedCategory === 'Fruits' && styles.categoryPillActive,
            ]}
            onPress={() => {
              setSelectedCategory('Fruits');
              setIsSearchActive(false);
            }}>
            <Text
              style={[
                styles.categoryPillText,
                selectedCategory === 'Fruits' && styles.categoryPillTextActive,
              ]}>
              Fruits
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.categoryPill,
              selectedCategory === 'Vegetables' && styles.categoryPillActive,
            ]}
            onPress={() => {
              setSelectedCategory('Vegetables');
              setIsSearchActive(false);
            }}>
            <Text
              style={[
                styles.categoryPillText,
                selectedCategory === 'Vegetables' && styles.categoryPillTextActive,
              ]}>
              Vegetables
            </Text>
          </TouchableOpacity>
        </View>

        {/* Subtitle matching Figma ("Found more fruits !" / "Found more vegetables !") */}
        <View style={styles.subHeaderRow}>
          <Text style={styles.foundText}>
            {isSearchActive
              ? `Search results (${filteredProducts.length})`
              : selectedCategory === 'Fruits'
              ? 'Found more fruits !'
              : 'Found more vegetables !'}
          </Text>
        </View>

        {/* Products 2-Column Grid matching Figma */}
        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => item.id}
          renderItem={renderProductCard}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="nutrition-outline" size={54} color={Colors.textMuted} />
              <Text style={styles.emptyText}>No grocery items found.</Text>
            </View>
          }
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
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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
    fontSize: 22,
    fontWeight: '800',
    color: Colors.textPrimary,
    lineHeight: 26,
    letterSpacing: -0.3,
  },
  searchCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.card,
  },
  adminAddBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.accentYellow,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.card,
  },
  searchBarBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.lg,
    height: 46,
    marginBottom: Spacing.md,
    gap: 8,
    ...Shadows.card,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: Colors.textPrimary,
  },
  categoryPillsRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginVertical: Spacing.sm,
  },
  categoryPill: {
    paddingVertical: 10,
    paddingHorizontal: 26,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.inactivePill,
  },
  categoryPillActive: {
    backgroundColor: Colors.accentYellow,
  },
  categoryPillText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.inactivePillText,
  },
  categoryPillTextActive: {
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  subHeaderRow: {
    marginTop: Spacing.sm,
    marginBottom: Spacing.md,
  },
  foundText: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  listContent: {
    paddingBottom: 90,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.xxl,
    padding: Spacing.md,
    alignItems: 'center',
    position: 'relative',
    borderWidth: 1,
    borderColor: '#EFF3E4',
    ...Shadows.card,
  },
  cardTopRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'absolute',
    top: Spacing.sm,
    left: Spacing.sm,
    right: Spacing.sm,
    zIndex: 2,
  },
  heartButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F5F8ED',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FEE2E2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  imageContainer: {
    width: '100%',
    height: 110,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  productImage: {
    width: '85%',
    height: '85%',
  },
  cardContent: {
    alignItems: 'center',
    width: '100%',
    marginTop: 4,
    marginBottom: 4,
  },
  productName: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  productPrice: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 15,
    color: Colors.textSecondary,
    marginTop: Spacing.md,
  },
});
