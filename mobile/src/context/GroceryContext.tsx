import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import {
  User,
  UserRole,
  Product,
  CartItem,
  Order,
} from '../types';
import {
  INITIAL_PRODUCTS,
  INITIAL_FAVORITES,
  INITIAL_CART_ITEMS,
  INITIAL_CUSTOMER,
  INITIAL_ADMIN,
  HARDCODED_ADMIN,
  INITIAL_REGISTERED_USERS,
} from '../constants/mockData';
import { storage } from '../utils/storage';

interface RegisteredUserRecord extends User {
  password?: string;
}

interface GroceryContextType {
  // User & Auth
  user: User;
  role: UserRole;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (userData: { name: string; email: string; password: string; phone: string; address: string }) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;

  // Products
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  deleteProduct: (productId: string) => void;
  updateProduct: (productId: string, data: Partial<Product>) => void;
  getProductById: (id: string) => Product | undefined;

  // Favorites
  favorites: string[];
  toggleFavorite: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
  clearFavorites: () => void;

  // Cart
  cart: CartItem[];
  addToCart: (productId: string, quantity?: number) => void;
  updateCartQuantity: (productId: string, delta: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  cartTotal: number;
  cartItemCount: number;

  // Orders / Checkout
  orders: Order[];
  placeOrder: (deliveryAddress: string) => Order;
}

const GroceryContext = createContext<GroceryContextType | undefined>(undefined);

const STORAGE_KEYS = {
  ADMIN_CREDS: 'grocery_admin_credentials',
  REGISTERED_USERS: 'grocery_registered_users',
  CURRENT_USER: 'grocery_current_user',
};

export const GroceryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Current user & authentication state
  const [user, setUser] = useState<User>(INITIAL_CUSTOMER);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [registeredUsers, setRegisteredUsers] = useState<RegisteredUserRecord[]>(INITIAL_REGISTERED_USERS);

  // Products state (can be updated/deleted by Admin)
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);

  // Favorites state (array of product IDs)
  const [favorites, setFavorites] = useState<string[]>(INITIAL_FAVORITES);

  // Initial Cart matching Figma Screen 7
  const [cart, setCart] = useState<CartItem[]>(() => {
    return INITIAL_CART_ITEMS.map((item) => {
      const product = INITIAL_PRODUCTS.find((p) => p.id === item.productId)!;
      if (item.productId === '9') {
        return {
          product: { ...product, price: 50 },
          quantity: item.quantity,
        };
      }
      return { product, quantity: item.quantity };
    });
  });

  const [orders, setOrders] = useState<Order[]>([]);

  // Initialize and persist Admin and Registered Users in local storage
  useEffect(() => {
    const initStorage = async () => {
      // 1. Save hardcoded admin credentials into local storage
      const adminCreds = {
        email: HARDCODED_ADMIN.email,
        password: HARDCODED_ADMIN.password,
      };
      await storage.setItem(STORAGE_KEYS.ADMIN_CREDS, JSON.stringify(adminCreds));

      // 2. Load registered users or save initial ones
      const storedUsersRaw = await storage.getItem(STORAGE_KEYS.REGISTERED_USERS);
      if (storedUsersRaw) {
        try {
          const parsed = JSON.parse(storedUsersRaw);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setRegisteredUsers(parsed);
          }
        } catch (e) {
          console.warn('Failed to parse registered users:', e);
        }
      } else {
        await storage.setItem(STORAGE_KEYS.REGISTERED_USERS, JSON.stringify(INITIAL_REGISTERED_USERS));
      }

      // 3. Load active user session if exists
      const storedCurrent = await storage.getItem(STORAGE_KEYS.CURRENT_USER);
      if (storedCurrent) {
        try {
          const parsedUser = JSON.parse(storedCurrent);
          if (parsedUser && parsedUser.email) {
            setUser(parsedUser);
            setIsAuthenticated(true);
          }
        } catch (e) {
          console.warn('Failed to parse current user:', e);
        }
      }
    };

    initStorage();
  }, []);

  // Sign In function: Automatically verifies hardcoded Admin vs stored Customer
  const signIn = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (!cleanEmail || !cleanEmail.includes('@')) {
      return { success: false, error: 'Please enter a valid email address.' };
    }
    if (!cleanPassword || cleanPassword.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters long.' };
    }

    // 1. Check if matching hardcoded Admin
    if (
      cleanEmail === HARDCODED_ADMIN.email.toLowerCase() &&
      cleanPassword === HARDCODED_ADMIN.password
    ) {
      const adminUser: User = {
        id: HARDCODED_ADMIN.id,
        name: HARDCODED_ADMIN.name,
        email: HARDCODED_ADMIN.email,
        phone: HARDCODED_ADMIN.phone,
        address: HARDCODED_ADMIN.address,
        role: 'admin',
        avatar: HARDCODED_ADMIN.avatar,
      };
      setUser(adminUser);
      setIsAuthenticated(true);
      await storage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(adminUser));
      return { success: true };
    }

    // 2. Check registered users in storage / state
    const matchedUser = registeredUsers.find(
      (u) => u.email.toLowerCase() === cleanEmail && u.password === cleanPassword
    );

    if (matchedUser) {
      const customerUser: User = {
        id: matchedUser.id,
        name: matchedUser.name,
        email: matchedUser.email,
        phone: matchedUser.phone,
        address: matchedUser.address,
        role: 'customer',
        avatar: matchedUser.avatar || INITIAL_CUSTOMER.avatar,
      };
      setUser(customerUser);
      setIsAuthenticated(true);
      await storage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(customerUser));
      return { success: true };
    }

    return {
      success: false,
      error: 'Invalid email or password. Please check your credentials.',
    };
  };

  // Sign Up function: Registers a new Customer and saves to local storage
  const signUp = async (userData: {
    name: string;
    email: string;
    password: string;
    phone: string;
    address: string;
  }): Promise<{ success: boolean; error?: string }> => {
    const cleanEmail = userData.email.trim().toLowerCase();

    if (!userData.name.trim()) {
      return { success: false, error: 'Please enter your full name.' };
    }
    if (!cleanEmail.includes('@')) {
      return { success: false, error: 'Please enter a valid email address.' };
    }
    if (!userData.password || userData.password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters long.' };
    }
    if (!userData.phone || userData.phone.replace(/\D/g, '').length < 10) {
      return { success: false, error: 'Please enter a valid 10-digit mobile number.' };
    }
    if (!userData.address.trim()) {
      return { success: false, error: 'Please provide a valid delivery address.' };
    }

    // Disallow registering with Admin email
    if (cleanEmail === HARDCODED_ADMIN.email.toLowerCase()) {
      return {
        success: false,
        error: 'This email is reserved for Admin. Please use a different email or sign in.',
      };
    }

    // Check if user already exists
    if (registeredUsers.some((u) => u.email.toLowerCase() === cleanEmail)) {
      return {
        success: false,
        error: 'An account with this email already exists. Please sign in.',
      };
    }

    const newUser: RegisteredUserRecord = {
      id: `user_${Date.now()}`,
      name: userData.name.trim(),
      email: cleanEmail,
      password: userData.password.trim(),
      phone: userData.phone.trim(),
      address: userData.address.trim(),
      role: 'customer',
      avatar: INITIAL_CUSTOMER.avatar,
    };

    const updatedUsers = [...registeredUsers, newUser];
    setRegisteredUsers(updatedUsers);
    await storage.setItem(STORAGE_KEYS.REGISTERED_USERS, JSON.stringify(updatedUsers));

    // Automatically log in newly registered user
    const { password: _, ...sessionUser } = newUser;
    setUser(sessionUser);
    setIsAuthenticated(true);
    await storage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(sessionUser));

    return { success: true };
  };

  const signOut = async () => {
    setIsAuthenticated(false);
    await storage.removeItem(STORAGE_KEYS.CURRENT_USER);
  };

  const updateProfile = async (data: Partial<User>) => {
    setUser((prev) => {
      const updated = { ...prev, ...data };
      storage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(updated));
      return updated;
    });

    // Update in registeredUsers list as well
    setRegisteredUsers((prev) => {
      const updatedList = prev.map((u) =>
        u.id === user.id ? { ...u, ...data } : u
      );
      storage.setItem(STORAGE_KEYS.REGISTERED_USERS, JSON.stringify(updatedList));
      return updatedList;
    });
  };

  // Products management
  const addProduct = (newProdData: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...newProdData,
      id: `prod_${Date.now()}`,
      rating: newProdData.rating || 5.0,
      reviewsCount: newProdData.reviewsCount || 1,
    };
    setProducts((prev) => [newProduct, ...prev]);
  };

  const deleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    setFavorites((prev) => prev.filter((id) => id !== productId));
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateProduct = (productId: string, data: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, ...data } : p))
    );
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, product: { ...item.product, ...data } } : item
      )
    );
  };

  const getProductById = (id: string) => {
    return products.find((p) => p.id === id);
  };

  // Favorites
  const toggleFavorite = (productId: string) => {
    setFavorites((prev) => {
      if (prev.includes(productId)) {
        return prev.filter((id) => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
  };

  const isFavorite = (productId: string) => {
    return favorites.includes(productId);
  };

  const clearFavorites = () => {
    setFavorites([]);
  };

  // Cart operations
  const addToCart = (productId: string, quantity = 1) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === productId);
      if (existing) {
        return prev.map((item) =>
          item.product.id === productId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [...prev, { product, quantity }];
      }
    });
  };

  const updateCartQuantity = (productId: string, delta: number) => {
    setCart((prev) => {
      return prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null);
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartTotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  }, [cart]);

  const cartItemCount = useMemo(() => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  }, [cart]);

  const placeOrder = (deliveryAddress: string) => {
    const newOrder: Order = {
      id: `ORD_${Date.now()}`,
      items: [...cart],
      totalAmount: cartTotal,
      date: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      status: 'Confirmed',
      deliveryAddress,
    };
    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    return newOrder;
  };

  return (
    <GroceryContext.Provider
      value={{
        user,
        role: user.role,
        isAuthenticated,
        signIn,
        signUp,
        signOut,
        updateProfile,
        products,
        addProduct,
        deleteProduct,
        updateProduct,
        getProductById,
        favorites,
        toggleFavorite,
        isFavorite,
        clearFavorites,
        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        cartTotal,
        cartItemCount,
        orders,
        placeOrder,
      }}>
      {children}
    </GroceryContext.Provider>
  );
};

export const useGrocery = () => {
  const context = useContext(GroceryContext);
  if (!context) {
    throw new Error('useGrocery must be used within a GroceryProvider');
  }
  return context;
};
