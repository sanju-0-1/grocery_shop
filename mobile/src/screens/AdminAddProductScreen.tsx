import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Shadows, BorderRadius, Spacing } from '../constants/theme';
import { ProductCategory, RootStackParamList } from '../types';
import { useGrocery } from '../context/GroceryContext';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'AdminAddProduct'>;

const PRESET_IMAGES = [
  { name: 'Apple', url: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=600&q=80', cat: 'Fruits' },
  { name: 'Grapes', url: 'https://images.unsplash.com/photo-1596363505729-4190a9506133?auto=format&fit=crop&w=600&q=80', cat: 'Fruits' },
  { name: 'Broccoli', url: 'https://images.unsplash.com/photo-1584270354949-c26b0d5b4a0c?auto=format&fit=crop&w=600&q=80', cat: 'Vegetables' },
  { name: 'Potato', url: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=600&q=80', cat: 'Vegetables' },
];

export const AdminAddProductScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { addProduct } = useGrocery();

  const [name, setName] = useState('');
  const [category, setCategory] = useState<ProductCategory>('Fruits');
  const [price, setPrice] = useState('');
  const [unit, setUnit] = useState('kg');
  const [imageUrl, setImageUrl] = useState(
    'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=600&q=80'
  );
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validate = () => {
    const errs: { [key: string]: string } = {};

    if (!name.trim()) {
      errs.name = 'Product name is required';
    }

    const numPrice = parseFloat(price);
    if (!price.trim()) {
      errs.price = 'Price is required';
    } else if (isNaN(numPrice) || numPrice <= 0) {
      errs.price = 'Please enter a valid price greater than 0';
    }

    if (!imageUrl.trim()) {
      errs.imageUrl = 'Image URL is required';
    }

    if (!description.trim()) {
      errs.description = 'Product description is required';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;

    addProduct({
      name: name.trim(),
      subtitle: category === 'Fruits' ? 'Fresh fruits' : 'Fresh vegetable',
      category,
      price: parseFloat(price),
      unit: unit.trim() || 'kg',
      rating: 5.0,
      reviewsCount: 1,
      image: imageUrl.trim(),
      description: description.trim(),
      inStock: true,
    });

    Alert.alert('Success', `"${name.trim()}" added to the store catalog!`, [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}>
        <View style={styles.container}>
          
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.iconCircle}
              onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={22} color={Colors.textPrimary} />
            </TouchableOpacity>

            <Text style={styles.headerTitle}>Admin: Add Product</Text>
            <View style={{ width: 44 }} />
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled">
            
            <View style={styles.formCard}>
              {/* Product Name */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Product Name *</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="e.g. Crisp Red Apples"
                  placeholderTextColor={Colors.textMuted}
                  value={name}
                  onChangeText={setName}
                />
                {errors.name ? <Text style={styles.errorText}>{errors.name}</Text> : null}
              </View>

              {/* Category Selector */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Category *</Text>
                <View style={styles.catGroup}>
                  {(['Fruits', 'Vegetables'] as const).map((cat) => (
                    <TouchableOpacity
                      key={cat}
                      style={[
                        styles.catBtn,
                        category === cat && styles.catBtnActive,
                      ]}
                      onPress={() => setCategory(cat)}>
                      <Text
                        style={[
                          styles.catBtnText,
                          category === cat && styles.catBtnTextActive,
                        ]}>
                        {cat}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Price and Unit */}
              <View style={styles.row}>
                <View style={[styles.inputGroup, { flex: 1.4 }]}>
                  <Text style={styles.label}>Price (Rs) *</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="e.g. 90"
                    placeholderTextColor={Colors.textMuted}
                    value={price}
                    onChangeText={setPrice}
                    keyboardType="numeric"
                  />
                  {errors.price ? <Text style={styles.errorText}>{errors.price}</Text> : null}
                </View>

                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={styles.label}>Unit</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="kg / pcs"
                    placeholderTextColor={Colors.textMuted}
                    value={unit}
                    onChangeText={setUnit}
                  />
                </View>
              </View>

              {/* Image URL & Preset Selection */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Image URL *</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="https://..."
                  placeholderTextColor={Colors.textMuted}
                  value={imageUrl}
                  onChangeText={setImageUrl}
                />
                {errors.imageUrl ? <Text style={styles.errorText}>{errors.imageUrl}</Text> : null}

                <Text style={styles.subLabel}>Or choose from presets:</Text>
                <View style={styles.presetsRow}>
                  {PRESET_IMAGES.map((preset) => (
                    <TouchableOpacity
                      key={preset.name}
                      style={[
                        styles.presetCard,
                        imageUrl === preset.url && styles.presetCardActive,
                      ]}
                      onPress={() => {
                        setImageUrl(preset.url);
                        setName(preset.name);
                        setCategory(preset.cat as ProductCategory);
                      }}>
                      <Image source={{ uri: preset.url }} style={styles.presetThumb} />
                      <Text style={styles.presetName}>{preset.name}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Description */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Description *</Text>
                <TextInput
                  style={[styles.textInput, { height: 80, textAlignVertical: 'top', paddingTop: 10 }]}
                  placeholder="Fresh organic farm produce benefits and details..."
                  placeholderTextColor={Colors.textMuted}
                  value={description}
                  onChangeText={setDescription}
                  multiline
                />
                {errors.description ? <Text style={styles.errorText}>{errors.description}</Text> : null}
              </View>

              {/* Save CTA */}
              <TouchableOpacity
                style={styles.saveBtn}
                activeOpacity={0.85}
                onPress={handleSave}>
                <Text style={styles.saveBtnText}>Add Product to Catalog</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
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
  scrollContent: {
    paddingBottom: Spacing.xxxl,
    paddingTop: Spacing.sm,
  },
  formCard: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.xxl,
    padding: Spacing.xl,
    borderWidth: 1,
    borderColor: '#EFF3E4',
    ...Shadows.card,
  },
  inputGroup: {
    marginBottom: Spacing.md,
  },
  row: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 6,
  },
  subLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textMuted,
    marginTop: 8,
    marginBottom: 6,
  },
  textInput: {
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    height: 50,
    backgroundColor: '#FAFCF5',
    fontSize: 14,
    color: Colors.textPrimary,
  },
  errorText: {
    color: Colors.danger,
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
  },
  catGroup: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  catBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: '#FAFCF5',
  },
  catBtnActive: {
    backgroundColor: Colors.accentYellow,
    borderColor: Colors.accentYellow,
  },
  catBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  catBtnTextActive: {
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  presetsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  presetCard: {
    alignItems: 'center',
    padding: 6,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: '#FFFFFF',
    width: 65,
  },
  presetCardActive: {
    borderColor: Colors.primary,
    backgroundColor: '#FAF7DF',
  },
  presetThumb: {
    width: 36,
    height: 36,
    borderRadius: 4,
    marginBottom: 2,
  },
  presetName: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  saveBtn: {
    backgroundColor: Colors.primary,
    height: 52,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.md,
    ...Shadows.button,
  },
  saveBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
});
