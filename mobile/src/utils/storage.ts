import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// In-memory fallback map to guarantee zero crashes/warnings in any environment
const memoryCache = new Map<string, string>();

export const storage = {
  async setItem(key: string, value: string): Promise<void> {
    memoryCache.set(key, value);

    if (Platform.OS === 'web') {
      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          window.localStorage.setItem(key, value);
        }
      } catch (err) {
        // Safe silent fallback
      }
      return;
    }

    try {
      if (AsyncStorage && typeof AsyncStorage.setItem === 'function') {
        await AsyncStorage.setItem(key, value);
      }
    } catch (e) {
      // Graceful fallback to memoryCache without noisy LogBox warning
    }
  },

  async getItem(key: string): Promise<string | null> {
    if (Platform.OS === 'web') {
      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          const val = window.localStorage.getItem(key);
          if (val !== null) return val;
        }
      } catch (err) {
        // Safe silent fallback
      }
      return memoryCache.get(key) || null;
    }

    try {
      if (AsyncStorage && typeof AsyncStorage.getItem === 'function') {
        const val = await AsyncStorage.getItem(key);
        if (val !== null) return val;
      }
    } catch (e) {
      // Fall through to memoryCache
    }

    return memoryCache.get(key) || null;
  },

  async removeItem(key: string): Promise<void> {
    memoryCache.delete(key);

    if (Platform.OS === 'web') {
      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          window.localStorage.removeItem(key);
        }
      } catch (err) {
        // Safe silent fallback
      }
      return;
    }

    try {
      if (AsyncStorage && typeof AsyncStorage.removeItem === 'function') {
        await AsyncStorage.removeItem(key);
      }
    } catch (e) {
      // Graceful fallback
    }
  },
};
