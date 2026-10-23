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
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Shadows, BorderRadius, Spacing } from '../constants/theme';
import { CartItem, RootStackParamList } from '../types';
import { useGrocery } from '../context/GroceryContext';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const CartScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const {
    cart,
    updateCartQuantity,
    removeFromCart,
    cartTotal,
    cartItemCount,
    user,
    placeOrder,
  } = useGrocery();

  // Search filter inside cart
  const [searchActive, setSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Checkout Modal State
  const [isCheckoutVisible, setIsCheckoutVisible] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState(user.address);
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'UPI' | 'Card'>('COD');
  const [isOrderSuccess, setIsOrderSuccess] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState<string>('');

  const filteredCart = cart.filter((item) =>
    item.product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCheckoutPress = () => {
    if (cart.length === 0) {
      Alert.alert('Empty Cart', 'Your cart is empty. Add products before checkout.');
      return;
    }
    setDeliveryAddress(user.address);
    setIsCheckoutVisible(true);
  };

  const handleConfirmOrder = () => {
    if (!deliveryAddress.trim()) {
      Alert.alert('Validation Error', 'Please specify a valid delivery address.');
      return;
    }

    const order = placeOrder(deliveryAddress.trim());
    setPlacedOrderId(order.id);
    setIsCheckoutVisible(false);
    setIsOrderSuccess(true);
  };

  const renderCartItem = ({ item }: { item: CartItem }) => {
    return (
      <View style={styles.cartCard}>
        {/* Left Product Image */}
        <View style={styles.imageBox}>
          <Image
            source={{ uri: item.product.image }}
            style={styles.productImage}
            resizeMode="contain"
          />
        </View>

        {/* Middle Info */}
        <View style={styles.itemInfo}>
          <Text style={styles.productName}>{item.product.name}</Text>
          <Text style={styles.categorySubtitle}>
            {item.product.subtitle || (item.product.category === 'Fruits' ? 'Fresh fruits' : 'Fresh vegetable')}
          </Text>
          <Text style={styles.itemPrice}>
            Rs {item.product.price}/{item.product.unit}
          </Text>
        </View>

        {/* Right Side Quantity Stepper matching Figma */}
        <View style={styles.stepperContainer}>
          <TouchableOpacity
            style={styles.stepBtn}
            activeOpacity={0.7}
            onPress={() => updateCartQuantity(item.product.id, 1)}>
            <Ionicons name="add" size={14} color={Colors.textPrimary} />
          </TouchableOpacity>

          <Text style={styles.qtyText}>{item.quantity}</Text>

          <TouchableOpacity
            style={styles.stepBtn}
            activeOpacity={0.7}
            onPress={() => updateCartQuantity(item.product.id, -1)}>
            <Ionicons name="remove" size={14} color={Colors.textPrimary} />
          </TouchableOpacity>
        </View>

        {/* Delete Item */}
        <TouchableOpacity
          style={styles.deleteBtn}
          onPress={() => removeFromCart(item.product.id)}>
          <Ionicons name="trash-outline" size={16} color={Colors.textMuted} />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
      <View style={styles.container}>
        
        {/* Top Header Bar matching Figma Screen 7 */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.iconCircle}
            onPress={() => navigation.canGoBack() ? navigation.goBack() : navigation.dispatch(DrawerActions.toggleDrawer())}>
            <Ionicons name="arrow-back" size={22} color={Colors.textPrimary} />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>My Cart</Text>

          <TouchableOpacity
            style={styles.iconCircle}
            onPress={() => setSearchActive(!searchActive)}>
            <Ionicons
              name={searchActive ? 'close' : 'search'}
              size={20}
              color={Colors.textPrimary}
            />
          </TouchableOpacity>
        </View>

        {/* Cart Search Bar (Expandable) */}
        {searchActive && (
          <View style={styles.searchBarBox}>
            <Ionicons name="search" size={18} color={Colors.textMuted} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search items in cart..."
              placeholderTextColor={Colors.textMuted}
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus
            />
          </View>
        )}

        {/* Cart Item Count Subheader */}
        <View style={styles.subHeader}>
          <Text style={styles.subHeaderText}>
            {cartItemCount} {cartItemCount === 1 ? 'item' : 'items'} in your cart
          </Text>
        </View>

        {/* List of Cart Items */}
        <FlatList
          data={filteredCart}
          keyExtractor={(item) => item.product.id}
          renderItem={renderCartItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="cart-outline" size={68} color={Colors.textMuted} />
              <Text style={styles.emptyTitle}>Your Cart is Empty</Text>
              <Text style={styles.emptySubtitle}>
                Add fresh fruits and vegetables from our catalog to get started.
              </Text>
              <TouchableOpacity
                style={styles.browseBtn}
                onPress={() => navigation.navigate('MainDrawer')}>
                <Text style={styles.browseBtnText}>Start Shopping</Text>
              </TouchableOpacity>
            </View>
          }
        />

        {/* Bottom Total & "Book Now >>>" Bar matching Figma Screen 7 */}
        {cart.length > 0 && (
          <View style={styles.bottomBar}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total Amount</Text>
              <Text style={styles.totalAmount}>Rs {cartTotal.toFixed(2)}</Text>
            </View>

            <TouchableOpacity
              style={styles.bookNowBtn}
              activeOpacity={0.88}
              onPress={handleCheckoutPress}>
              <Text style={styles.bookNowText}>Book Now &gt;&gt;&gt;</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Checkout Modal */}
        <Modal
          visible={isCheckoutVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setIsCheckoutVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Confirm Order</Text>
                <TouchableOpacity onPress={() => setIsCheckoutVisible(false)}>
                  <Ionicons name="close" size={24} color={Colors.textPrimary} />
                </TouchableOpacity>
              </View>

              <Text style={styles.inputLabel}>Delivery Address *</Text>
              <TextInput
                style={styles.addressInput}
                value={deliveryAddress}
                onChangeText={setDeliveryAddress}
                placeholder="Enter complete delivery address"
                multiline
              />

              <Text style={styles.inputLabel}>Payment Method</Text>
              <View style={styles.paymentRow}>
                {(['COD', 'UPI', 'Card'] as const).map((method) => (
                  <TouchableOpacity
                    key={method}
                    style={[
                      styles.paymentOption,
                      paymentMethod === method && styles.paymentOptionActive,
                    ]}
                    onPress={() => setPaymentMethod(method)}>
                    <Text
                      style={[
                        styles.paymentText,
                        paymentMethod === method && styles.paymentTextActive,
                      ]}>
                      {method === 'COD' ? '💵 Cash on Delivery' : method === 'UPI' ? '📱 UPI / GPay' : '💳 Credit Card'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.summaryBox}>
                <View style={styles.summaryLine}>
                  <Text style={styles.summaryLabel}>Items ({cartItemCount}):</Text>
                  <Text style={styles.summaryValue}>Rs {cartTotal.toFixed(2)}</Text>
                </View>
                <View style={styles.summaryLine}>
                  <Text style={styles.summaryLabel}>Delivery Fee:</Text>
                  <Text style={[styles.summaryValue, { color: Colors.success }]}>FREE</Text>
                </View>
                <View style={[styles.summaryLine, { marginTop: 6, borderTopWidth: 1, borderTopColor: Colors.border, paddingTop: 6 }]}>
                  <Text style={[styles.summaryLabel, { fontWeight: '700' }]}>Grand Total:</Text>
                  <Text style={[styles.summaryValue, { fontWeight: '800', color: Colors.textPrimary }]}>
                    Rs {cartTotal.toFixed(2)}
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.confirmOrderBtn}
                onPress={handleConfirmOrder}>
                <Text style={styles.confirmOrderBtnText}>Place Order Now</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Order Success Receipt Modal */}
        <Modal
          visible={isOrderSuccess}
          animationType="fade"
          transparent={true}
          onRequestClose={() => setIsOrderSuccess(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.successCard}>
              <View style={styles.successIconCircle}>
                <Ionicons name="checkmark-circle" size={60} color={Colors.success} />
              </View>

              <Text style={styles.successTitle}>Order Confirmed!</Text>
              <Text style={styles.successSub}>
                Thank you for shopping with Grocery Shop!
              </Text>

              <View style={styles.receiptBox}>
                <Text style={styles.receiptRow}>
                  <Text style={styles.receiptBold}>Order ID: </Text>
                  {placedOrderId}
                </Text>
                <Text style={styles.receiptRow}>
                  <Text style={styles.receiptBold}>Recipient: </Text>
                  {user.name}
                </Text>
                <Text style={styles.receiptRow}>
                  <Text style={styles.receiptBold}>Delivery: </Text>
                  {deliveryAddress}
                </Text>
                <Text style={styles.receiptRow}>
                  <Text style={styles.receiptBold}>Amount Paid: </Text>
                  Rs {cartTotal.toFixed(2)} (Cash on Delivery)
                </Text>
              </View>

              <TouchableOpacity
                style={styles.successBtn}
                onPress={() => {
                  setIsOrderSuccess(false);
                  navigation.navigate('MainDrawer');
                }}>
                <Text style={styles.successBtnText}>Continue Shopping</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
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
  searchBarBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.lg,
    height: 46,
    marginVertical: Spacing.sm,
    gap: 8,
    ...Shadows.card,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: Colors.textPrimary,
  },
  subHeader: {
    paddingVertical: Spacing.xs,
    marginBottom: Spacing.sm,
  },
  subHeaderText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  listContent: {
    paddingBottom: 160,
  },
  cartCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.xxl,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: '#EFF3E4',
    ...Shadows.card,
  },
  imageBox: {
    width: 65,
    height: 65,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productImage: {
    width: '90%',
    height: '90%',
  },
  itemInfo: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  productName: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  categorySubtitle: {
    fontSize: 12,
    color: Colors.textMuted,
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  stepperContainer: {
    alignItems: 'center',
    gap: 2,
    marginRight: Spacing.sm,
  },
  stepBtn: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#FAFAF0',
    borderWidth: 1,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
    paddingVertical: 2,
  },
  deleteBtn: {
    padding: 6,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.md,
    paddingBottom: 25,
    borderTopLeftRadius: BorderRadius.xxl,
    borderTopRightRadius: BorderRadius.xxl,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
    paddingHorizontal: 4,
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  bookNowBtn: {
    backgroundColor: Colors.primary,
    height: 52,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.button,
  },
  bookNowText: {
    fontSize: 16,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: BorderRadius.xxl,
    borderTopRightRadius: BorderRadius.xxl,
    padding: Spacing.xl,
    paddingBottom: Spacing.xxxl,
    ...Shadows.modal,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 6,
    marginTop: Spacing.sm,
  },
  addressInput: {
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    fontSize: 14,
    minHeight: 70,
    textAlignVertical: 'top',
    backgroundColor: '#FAFCF5',
  },
  paymentRow: {
    flexDirection: 'column',
    gap: 8,
    marginVertical: Spacing.xs,
  },
  paymentOption: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: '#FAFAF5',
  },
  paymentOptionActive: {
    borderColor: Colors.primary,
    backgroundColor: '#FDFCEB',
  },
  paymentText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  paymentTextActive: {
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  summaryBox: {
    backgroundColor: '#F7FAF0',
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginTop: Spacing.md,
  },
  summaryLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  summaryValue: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  confirmOrderBtn: {
    backgroundColor: Colors.primary,
    height: 52,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.lg,
    ...Shadows.button,
  },
  confirmOrderBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  successCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.xxl,
    margin: Spacing.xl,
    padding: Spacing.xl,
    alignItems: 'center',
    ...Shadows.modal,
  },
  successIconCircle: {
    marginBottom: Spacing.md,
  },
  successTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  successSub: {
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  receiptBox: {
    width: '100%',
    backgroundColor: '#F6F9EE',
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
    gap: 6,
  },
  receiptRow: {
    fontSize: 13,
    color: Colors.textPrimary,
    lineHeight: 18,
  },
  receiptBold: {
    fontWeight: '700',
  },
  successBtn: {
    backgroundColor: Colors.primary,
    width: '100%',
    height: 50,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.button,
  },
  successBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
});
