import { Platform } from 'react-native';

export const Colors = {
  // Figma Theme Palette
  background: '#F3F6E9',        // Soft pale lime-cream background
  backgroundSecondary: '#EBF1DF',
  card: '#FFFFFF',
  cardBorder: '#E5ECD6',
  
  // Signature Olive / Lime Yellows
  primary: '#C7BD2E',           // Button & CTA color
  primaryDark: '#A89F20',
  primaryLight: '#FAF4B6',
  accentYellow: '#DCD42E',       // Active category pill & stepper
  inactivePill: '#E8EEDC',
  inactivePillText: '#7A866D',

  // Typography
  textPrimary: '#1E2515',       // Bold titles, labels
  textSecondary: '#7A856D',     // Subtitles, descriptions
  textMuted: '#9DA891',
  textLight: '#FFFFFF',

  // Status & Accents
  heartRed: '#FF4141',
  heartBg: '#EFF5DE',
  starYellow: '#F8B810',
  success: '#38A169',
  danger: '#E53E3E',
  border: '#E2E8D5',
  inputBg: '#FFFFFF',

  // Bottom Nav
  tabBarBg: '#F3F6E9',
  tabActive: '#DE3C36',         // Active tab red-orange matching Figma
  tabInactive: '#7C876E',

  // Template backward compatibility
  light: {
    text: '#1E2515',
    background: '#F3F6E9',
    backgroundElement: '#E8EEDC',
    backgroundSelected: '#DCD42E',
    textSecondary: '#7A856D',
  },
  dark: {
    text: '#ffffff',
    background: '#1A1F12',
    backgroundElement: '#2B3320',
    backgroundSelected: '#3E492E',
    textSecondary: '#A0AB94',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,

  // Compatibility tokens
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 26,
  full: 9999,
};

export const Shadows = {
  card: {
    shadowColor: '#1E2515',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  button: {
    shadowColor: '#A89F20',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  modal: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
};
