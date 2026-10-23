import { Product, User } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Banana',
    subtitle: 'Fresh fruits',
    category: 'Fruits',
    price: 50,
    unit: 'kg',
    rating: 5.0,
    reviewsCount: 142,
    image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=600&q=80',
    description:
      'Banana is a very good fruit for body health and extra vitamin and extra energy for body, this is an increase of body for baby and boys. Rich in potassium and dietary fiber for digestive well-being.',
    relatedIds: ['2', '11', '12', '13'],
    inStock: true,
  },
  {
    id: '2',
    name: 'Orange',
    subtitle: 'Fresh fruits',
    category: 'Fruits',
    price: 70,
    unit: 'kg',
    rating: 4.8,
    reviewsCount: 98,
    image: 'https://images.unsplash.com/photo-1582979512210-99b6a53386f9?auto=format&fit=crop&w=600&q=80',
    description:
      'Sweet and tangy Nagpur oranges packed with natural Vitamin C, antioxidants, and pure hydration. Great for morning fresh juice and immune boost.',
    relatedIds: ['1', '3', '4', '10'],
    inStock: true,
  },
  {
    id: '3',
    name: 'Pineapple',
    subtitle: 'Fresh fruits',
    category: 'Fruits',
    price: 120,
    unit: 'kg',
    rating: 4.9,
    reviewsCount: 115,
    image: 'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?auto=format&fit=crop&w=600&q=80',
    description:
      'Tropical golden pineapple selected for natural sweetness and refreshing juice. Contains bromelain enzyme for digestion and anti-inflammatory wellness.',
    relatedIds: ['1', '2', '4', '12'],
    inStock: true,
  },
  {
    id: '4',
    name: 'Lemon',
    subtitle: 'Fresh fruits',
    category: 'Fruits',
    price: 60,
    unit: 'kg',
    rating: 4.7,
    reviewsCount: 86,
    image: 'https://images.unsplash.com/photo-1590502593747-42a996133562?auto=format&fit=crop&w=600&q=80',
    description:
      'Zesty and crisp farm-fresh yellow lemons with high acidity and invigorating fragrance. Ideal for daily detox water, salads, and culinary zest.',
    relatedIds: ['1', '2', '3', '11'],
    inStock: true,
  },
  {
    id: '5',
    name: 'Tomato',
    subtitle: 'Fresh vegetable',
    category: 'Vegetables',
    price: 220,
    unit: 'kg',
    rating: 5.0,
    reviewsCount: 164,
    image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80',
    description:
      'Tomato is a very good fruit for body health and extra vitamin and extra energy for body, this is an increase of body for baby and boys. Rich in lycopene, heart-healthy nutrients, and cooking vitality.',
    relatedIds: ['6', '7', '8', '9'],
    inStock: true,
  },
  {
    id: '6',
    name: 'Capsicum',
    subtitle: 'Fresh vegetable',
    category: 'Vegetables',
    price: 100,
    unit: 'kg',
    rating: 4.8,
    reviewsCount: 79,
    image: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&w=600&q=80',
    description:
      'Crisp, colorful bell peppers with thick crunchy walls and gentle sweetness. Loaded with Vitamin A and C, ideal for stir fries, curries, and roasting.',
    relatedIds: ['5', '7', '8', '9'],
    inStock: true,
  },
  {
    id: '7',
    name: 'Sw.Pumpkin',
    subtitle: 'Fresh vegetable',
    category: 'Vegetables',
    price: 40,
    unit: 'kg',
    rating: 4.6,
    reviewsCount: 54,
    image: 'https://images.unsplash.com/photo-1506869640319-fe1a24fd76dc?auto=format&fit=crop&w=600&q=80',
    description:
      'Tender and naturally sweet farm pumpkin. Deep orange flesh high in beta-carotene, ideal for hearty soups, traditional sambar, and sweet halwa.',
    relatedIds: ['5', '6', '8', '9'],
    inStock: true,
  },
  {
    id: '8',
    name: 'Carrot',
    subtitle: 'Fresh vegetable',
    category: 'Vegetables',
    price: 60,
    unit: 'kg',
    rating: 4.9,
    reviewsCount: 120,
    image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=600&q=80',
    description:
      'Crunchy red Ooty carrots harvested fresh with natural earthy sweetness. Excellent source of vitamin A for vision and radiant skin health.',
    relatedIds: ['5', '6', '7', '9'],
    inStock: true,
  },
  {
    id: '9',
    name: 'Cabbage',
    subtitle: 'Fresh vegetable',
    category: 'Vegetables',
    price: 80,
    unit: 'kg',
    rating: 4.7,
    reviewsCount: 65,
    image: 'https://images.unsplash.com/photo-1594282486552-05b4d80fbb9f?auto=format&fit=crop&w=600&q=80',
    description:
      'Tightly packed organic green cabbage heads with crisp, sweet layered leaves. High in fiber and Vitamin K, perfect for salads and stir fry.',
    relatedIds: ['5', '6', '7', '8'],
    inStock: true,
  },
  {
    id: '10',
    name: 'Strawberry',
    subtitle: 'Fresh fruits',
    category: 'Fruits',
    price: 180,
    unit: 'kg',
    rating: 5.0,
    reviewsCount: 210,
    image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=600&q=80',
    description:
      'Vibrant ruby red Mahabaleshwar strawberries with luscious fragrance and sweet berry flavor. Hand-picked and packed with antioxidants.',
    relatedIds: ['1', '2', '11', '12'],
    inStock: true,
  },
  {
    id: '11',
    name: 'Cherry',
    subtitle: 'Fresh fruits',
    category: 'Fruits',
    price: 250,
    unit: 'kg',
    rating: 4.9,
    reviewsCount: 95,
    image: 'https://images.unsplash.com/photo-1528821128474-27f963b062bf?auto=format&fit=crop&w=600&q=80',
    description:
      'Premium dark sweet cherries with succulent juicy texture. Rich in anthocyanins and melatonin to help naturally regulate restful sleep.',
    relatedIds: ['1', '10', '12', '13'],
    inStock: true,
  },
  {
    id: '12',
    name: 'Kiwi',
    subtitle: 'Fresh fruits',
    category: 'Fruits',
    price: 150,
    unit: 'kg',
    rating: 4.8,
    reviewsCount: 88,
    image: 'https://images.unsplash.com/photo-1585059895524-72359e06133a?auto=format&fit=crop&w=600&q=80',
    description:
      'Tangy-sweet green kiwis loaded with dietary fiber, actinidin enzymes, and more Vitamin C than oranges. Boosts digestion and vitality.',
    relatedIds: ['1', '2', '10', '13'],
    inStock: true,
  },
  {
    id: '13',
    name: 'Mango',
    subtitle: 'Fresh fruits',
    category: 'Fruits',
    price: 110,
    unit: 'kg',
    rating: 5.0,
    reviewsCount: 340,
    image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=600&q=80',
    description:
      'The king of fruits - Alphonso mangoes with velvety smooth texture, heavenly aroma, and unmatched sweetness. A true seasonal treasure.',
    relatedIds: ['1', '2', '10', '11'],
    inStock: true,
  },
];

export const INITIAL_FAVORITES: string[] = ['1', '3', '5', '9']; // Banana, Pineapple, Tomato, Cabbage (Figma Screen 4)

// Matches Screen 7:
// Banana (2kg @ 50 = 100) + Pineapple (1kg @ 120 = 120) + Tomato (2kg @ 220 = 440) + Cabbage (or Lemon 50) = Rs 710.00
export const INITIAL_CART_ITEMS = [
  { productId: '1', quantity: 2 }, // Banana 2 * 50 = 100
  { productId: '3', quantity: 1 }, // Pineapple 1 * 120 = 120
  { productId: '5', quantity: 2 }, // Tomato 2 * 220 = 440
  { productId: '9', quantity: 1 }, // Cabbage 1 * 50 = 50 (Special offer) -> Total Rs 710.00!
];

export const HARDCODED_ADMIN = {
  id: 'user_admin_01',
  name: 'RVS Grocery Admin',
  email: 'admin@groceryshop.com',
  password: 'admin123',
  phone: '9894012345',
  address: 'RVS College of Arts and Science, Coimbatore - 641402',
  role: 'admin' as const,
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
};

export const INITIAL_REGISTERED_USERS = [
  {
    id: 'user_cust_01',
    name: 'Alex Johnson',
    email: 'alex.customer@groceryshop.com',
    password: 'password123',
    phone: '9876543210',
    address: '42 Greenfield Avenue, Sulur, Coimbatore - 641402',
    role: 'customer' as const,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
  },
];

export const INITIAL_CUSTOMER: User = INITIAL_REGISTERED_USERS[0];
export const INITIAL_ADMIN: User = {
  id: HARDCODED_ADMIN.id,
  name: HARDCODED_ADMIN.name,
  email: HARDCODED_ADMIN.email,
  phone: HARDCODED_ADMIN.phone,
  address: HARDCODED_ADMIN.address,
  role: HARDCODED_ADMIN.role,
  avatar: HARDCODED_ADMIN.avatar,
};

