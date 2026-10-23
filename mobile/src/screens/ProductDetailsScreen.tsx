import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Dimensions,
  FlatList,
} from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Shadows, BorderRadius, Spacing } from '../constants/theme';
import { Product, RootStackParamList } from '../types';
import { useGrocery } from '../context/GroceryContext';

type RouteProps = RouteProp<RootStackParamList, 'ProductDetails'>;
type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'ProductDetails'>;

const { width } = Dimensions.get('window');

export const ProductDetailsScreen: React.FC = () => {
  const route = useRoute<RouteProps>();
  const navigation = useNavigation<NavigationProp>();
  const { getProductById, products, isFavorite, toggleFavorite, addToCart, role } = useGrocery();

  const productId = route.params.productId;
  const product = getProductById(productId) || products[0];

  const favorited = isFavorite(product.id);
  const [quantityKg, setQuantityKg] = useState<number>(3); // 3kg default matching Figma Screen 5
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [activeSlide, setActiveSlide] = useState<number>(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleIncrement = () => {
    setQuantityKg((prev) => prev + 1);
  };

  const handleDecrement = () => {
    if (quantityKg > 1) {
      setQuantityKg((prev) => prev - 1);
    }
  };

  const handleAddToCart = () => {
    addToCart(product.id, quantityKg);
    setToastMessage(`Added ${quantityKg}kg ${product.name} to Cart!`);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Related items list
  const relatedProducts = (product.relatedIds || [])
    .map((id) => getProductById(id))
    .filter((p): p is Product => p !== undefined);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
      <View style={styles.container}>
        
        {/* Top Header Bar matching Figma */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={22} color={Colors.textPrimary} />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Details</Text>

          {role === 'customer' ? (
            <TouchableOpacity
              style={styles.heartButton}
              onPress={() => toggleFavorite(product.id)}>
              <Ionicons
                name={favorited ? 'heart' : 'heart-outline'}
                size={22}
                color={favorited ? Colors.heartRed : Colors.textMuted}
              />
            </TouchableOpacity>
          ) : (
            <View style={{ width: 44 }} />
          )}
        </View>

        {/* Scrollable Body */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}>
          
          {/* Hero Image Presentation */}
          <View style={styles.heroCard}>
            <Image
              source={{ uri: product.image }}
              style={styles.heroImage}
              resizeMode="contain"
            />
          </View>

          {/* Carousel Indicator Dots matching Figma */}
          <View style={styles.carouselDots}>
            {[0, 1, 2].map((dotIndex) => (
              <TouchableOpacity
                key={dotIndex}
                onPress={() => setActiveSlide(dotIndex)}
                style={[
                  styles.dot,
                  activeSlide === dotIndex ? styles.dotActive : styles.dotInactive,
                ]}
              />
            ))}
          </View>

          {/* Product Title and Quantity Stepper Row */}
          <View style={styles.titleRow}>
            <View>
              <Text style={styles.productTitle}>Fresh {product.name}</Text>
              
              {/* Star Rating matching Figma */}
              <View style={styles.ratingRow}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Ionicons
                    key={star}
                    name="star"
                    size={16}
                    color={Colors.starYellow}
                  />
                ))}
              </View>
            </View>

            {/* Quantity Stepper Pill [-] 3kg [+] matching Figma */}
            <View style={styles.stepperPill}>
              <TouchableOpacity
                style={styles.stepperBtn}
                onPress={handleDecrement}>
                <Ionicons name="remove" size={16} color={Colors.textPrimary} />
              </TouchableOpacity>
              <Text style={styles.stepperText}>{quantityKg}kg</Text>
              <TouchableOpacity
                style={styles.stepperBtn}
                onPress={handleIncrement}>
                <Ionicons name="add" size={16} color={Colors.textPrimary} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Description Section matching Figma */}
          <View style={styles.descSection}>
            <Text style={styles.sectionHeading}>Description</Text>
            <Text style={styles.descText} numberOfLines={isExpanded ? undefined : 3}>
              {product.description}
            </Text>
            <TouchableOpacity onPress={() => setIsExpanded(!isExpanded)}>
              <Text style={styles.seeMoreText}>
                {isExpanded ? 'See less' : '... See more'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Related Items Section matching Figma */}
          <View style={styles.relatedSection}>
            <Text style={styles.sectionHeading}>Related Items</Text>
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={relatedProducts}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.relatedList}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.relatedCard}
                  activeOpacity={0.8}
                  onPress={() => navigation.push('ProductDetails', { productId: item.id })}>
                  <Image
                    source={{ uri: item.image }}
                    style={styles.relatedImage}
                    resizeMode="contain"
                  />
                  <Text style={styles.relatedName} numberOfLines={1}>
                    {item.name}
                  </Text>
                  <Text style={styles.relatedPrice}>Rs {item.price}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </ScrollView>

        {/* Added Toast */}
        {toastMessage && (
          <View style={styles.toast}>
            <Ionicons name="checkmark-circle" size={18} color="#FFFFFF" />
            <Text style={styles.toastText}>{toastMessage}</Text>
          </View>
        )}

        {/* Bottom Sticky Action Bar matching Figma */}
        <View style={styles.bottomBar}>
          <View style={styles.priceContainer}>
            <Text style={styles.priceLabel}>Price</Text>
            <Text style={styles.priceValue}>
              Rs {product.price}/{product.unit}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.addToCartBtn}
            activeOpacity={0.85}
            onPress={handleAddToCart}>
            <Text style={styles.addToCartText}>Add to Cart &gt;&gt;&gt;</Text>
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
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  backButton: {
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
  heartButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.card,
  },
  scrollContent: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: 110,
  },
  heroCard: {
    width: '100%',
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  heroImage: {
    width: '90%',
    height: '90%',
  },
  carouselDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    marginVertical: Spacing.sm,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dotActive: {
    backgroundColor: Colors.accentYellow,
    width: 18,
  },
  dotInactive: {
    backgroundColor: Colors.inactivePill,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.md,
    marginBottom: Spacing.lg,
  },
  productTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.textPrimary,
    letterSpacing: -0.3,
  },
  ratingRow: {
    flexDirection: 'row',
    gap: 3,
    marginTop: 4,
  },
  stepperPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.accentYellow,
    borderRadius: BorderRadius.full,
    paddingHorizontal: 10,
    paddingVertical: 6,
    gap: 8,
    ...Shadows.card,
  },
  stepperBtn: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepperText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
    minWidth: 32,
    textAlign: 'center',
  },
  descSection: {
    marginBottom: Spacing.xl,
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 6,
  },
  descText: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  seeMoreText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginTop: 4,
  },
  relatedSection: {
    marginBottom: Spacing.lg,
  },
  relatedList: {
    gap: Spacing.md,
    paddingTop: Spacing.sm,
  },
  relatedCard: {
    width: 80,
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    padding: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EFF3E4',
    ...Shadows.card,
  },
  relatedImage: {
    width: 50,
    height: 50,
    marginBottom: 4,
  },
  relatedName: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  relatedPrice: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.card,
    borderTopLeftRadius: BorderRadius.xxl,
    borderTopRightRadius: BorderRadius.xxl,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#EFF3E4',
    ...Shadows.modal,
  },
  priceContainer: {},
  priceLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  priceValue: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  addToCartBtn: {
    backgroundColor: '#FAFAF0',
    borderWidth: 1.5,
    borderColor: Colors.accentYellow,
    paddingVertical: 14,
    paddingHorizontal: 26,
    borderRadius: BorderRadius.full,
    ...Shadows.card,
  },
  addToCartText: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  toast: {
    position: 'absolute',
    top: 80,
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
});
