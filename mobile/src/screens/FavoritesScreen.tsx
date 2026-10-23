import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Alert,
} from 'react-native';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Shadows, BorderRadius, Spacing } from '../constants/theme';
import { Product, RootStackParamList } from '../types';
import { useGrocery } from '../context/GroceryContext';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - Spacing.xl * 2 - Spacing.md) / 2;

export const FavoritesScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const {
    favorites,
    products,
    toggleFavorite,
    clearFavorites,
    addToCart,
    role,
  } = useGrocery();

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const favoriteProducts = products.filter((p) => favorites.includes(p.id));

  const handleAddToCart = (product: Product) => {
    addToCart(product.id, 1);
    setToastMessage(`Added ${product.name} to Cart!`);
    setTimeout(() => setToastMessage(null), 2000);
  };

  const handleAddAllToCart = () => {
    if (favoriteProducts.length === 0) return;
    favoriteProducts.forEach((p) => addToCart(p.id, 1));
    setToastMessage(`Added all ${favoriteProducts.length} favorites to Cart!`);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleMenuOptions = () => {
    Alert.alert('Favourite Options', 'Choose an action for your favourites:', [
      {
        text: 'Add All to Cart',
        onPress: handleAddAllToCart,
      },
      {
        text: 'Clear All Favourites',
        style: 'destructive',
        onPress: () => {
          Alert.alert('Confirm', 'Are you sure you want to clear your favourites?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Clear', style: 'destructive', onPress: clearFavorites },
          ]);
        },
      },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const renderCard = ({ item }: { item: Product }) => {
    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.88}
        onPress={() => navigation.navigate('ProductDetails', { productId: item.id })}>
        
        {/* Remove from Favorite button */}
        <TouchableOpacity
          style={styles.heartButton}
          onPress={() => toggleFavorite(item.id)}>
          <Ionicons name="heart" size={18} color={Colors.heartRed} />
        </TouchableOpacity>

        {/* Product Image */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: item.image }}
            style={styles.productImage}
            resizeMode="contain"
          />
        </View>

        {/* Product Details */}
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

  // Access control: Favourite screen only for customer no admin
  if (role === 'admin') {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.iconCircle}
              onPress={() => (navigation.canGoBack() ? navigation.goBack() : navigation.dispatch(DrawerActions.toggleDrawer()))}>
              <Ionicons name="arrow-back" size={22} color={Colors.textPrimary} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Favourite</Text>
            <View style={{ width: 44 }} />
          </View>

          <View style={styles.adminRestrictedContainer}>
            <View style={styles.restrictedIconBox}>
              <Ionicons name="shield-checkmark" size={48} color={Colors.textPrimary} />
            </View>
            <Text style={styles.restrictedTitle}>Customer Only Feature</Text>
            <Text style={styles.restrictedSubtitle}>
              The Favourite screen is exclusively reserved for Customer accounts to save preferred grocery items. Admin accounts manage the store inventory and product catalog.
            </Text>
            <TouchableOpacity
              style={styles.browseBtn}
              onPress={() => navigation.navigate('MainDrawer')}>
              <Text style={styles.browseBtnText}>Back to Grocery Store</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
      <View style={styles.container}>
        
        {/* Header Bar matching Figma */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.iconCircle}
            onPress={() => navigation.canGoBack() ? navigation.goBack() : navigation.dispatch(DrawerActions.toggleDrawer())}>
            <Ionicons name="arrow-back" size={22} color={Colors.textPrimary} />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Favourite</Text>

          <TouchableOpacity
            style={styles.iconCircle}
            onPress={handleMenuOptions}>
            <Ionicons name="ellipsis-vertical" size={20} color={Colors.textPrimary} />
          </TouchableOpacity>
        </View>

        {/* Action Row */}
        {favoriteProducts.length > 0 && (
          <View style={styles.actionRow}>
            <Text style={styles.countText}>
              {favoriteProducts.length} {favoriteProducts.length === 1 ? 'item' : 'items'} saved
            </Text>
            <TouchableOpacity
              style={styles.addAllBtn}
              onPress={handleAddAllToCart}>
              <Ionicons name="cart" size={14} color={Colors.textPrimary} />
              <Text style={styles.addAllText}>Add All to Cart</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Toast Feedback */}
        {toastMessage && (
          <View style={styles.toast}>
            <Ionicons name="checkmark-circle" size={18} color="#FFFFFF" />
            <Text style={styles.toastText}>{toastMessage}</Text>
          </View>
        )}

        {/* 2-Column Grid matching Figma */}
        <FlatList
          data={favoriteProducts}
          keyExtractor={(item) => item.id}
          renderItem={renderCard}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="heart-dislike-outline" size={64} color={Colors.textMuted} />
              <Text style={styles.emptyTitle}>No Favourites Yet</Text>
              <Text style={styles.emptySubtitle}>
                Tap the heart icon on any grocery item to save your favorites here.
              </Text>
              <TouchableOpacity
                style={styles.browseBtn}
                onPress={() => navigation.navigate('MainDrawer')}>
                <Text style={styles.browseBtnText}>Explore Products</Text>
              </TouchableOpacity>
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
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: Spacing.sm,
  },
  countText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  addAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.accentYellow,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: BorderRadius.full,
    ...Shadows.card,
  },
  addAllText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  listContent: {
    paddingBottom: 90,
    paddingTop: Spacing.xs,
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
  heartButton: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F5F8ED',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
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
    marginBottom: 8,
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
  addToCartBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.inactivePill,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: BorderRadius.full,
  },
  addToCartText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    paddingHorizontal: Spacing.xl,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginTop: Spacing.md,
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: Spacing.xl,
  },
  browseBtn: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: BorderRadius.full,
    ...Shadows.button,
  },
  browseBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  toast: {
    position: 'absolute',
    top: 70,
    alignSelf: 'center',
    zIndex: 99,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#2D3748',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: BorderRadius.full,
    ...Shadows.modal,
  },
  toastText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  adminRestrictedContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
    paddingBottom: 80,
  },
  restrictedIconBox: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: Colors.accentYellow,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
    ...Shadows.card,
  },
  restrictedTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  restrictedSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: Spacing.xl,
    paddingHorizontal: Spacing.md,
  },
});
