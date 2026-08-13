import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme as useDeviceColorScheme, Appearance } from 'react-native';

export type ThemeMode = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

export interface ThemeColors {
  background: string;
  surface: string;
  card: string;
  cardElevated: string;
  cardBorder: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  primary: string;
  primaryLight: string;
  secondary: string;
  accent: string;
  border: string;
  borderStrong: string;
  inputBg: string;
  inputBorder: string;
  inputPlaceholder: string;
  glassBg: string;
  statusBar: 'light' | 'dark';
  navBg: string;
  tabActive: string;
  tabInactive: string;
  skeletonBg: string;
}

export const DARK_THEME_COLORS: ThemeColors = {
  background: '#0F172A',
  surface: '#111827',
  card: '#1E293B',
  cardElevated: '#243047',
  cardBorder: 'rgba(255, 255, 255, 0.08)',
  textPrimary: '#FFFFFF',
  textSecondary: 'rgba(255, 255, 255, 0.7)',
  textMuted: 'rgba(255, 255, 255, 0.45)',
  primary: '#3B82F6',
  primaryLight: 'rgba(59, 130, 246, 0.15)',
  secondary: '#8B5CF6',
  accent: '#EC4899',
  border: 'rgba(255, 255, 255, 0.08)',
  borderStrong: 'rgba(255, 255, 255, 0.15)',
  inputBg: 'rgba(255, 255, 255, 0.03)',
  inputBorder: 'rgba(255, 255, 255, 0.08)',
  inputPlaceholder: 'rgba(255, 255, 255, 0.35)',
  glassBg: 'rgba(15, 23, 42, 0.85)',
  statusBar: 'light',
  navBg: '#0F172A',
  tabActive: '#3B82F6',
  tabInactive: 'rgba(255, 255, 255, 0.4)',
  skeletonBg: 'rgba(255, 255, 255, 0.08)',
};

export const LIGHT_THEME_COLORS: ThemeColors = {
  background: '#EAEFF5',
  surface: '#F1F5F9',
  card: '#F8FAFC',
  cardElevated: '#FFFFFF',
  cardBorder: 'rgba(15, 23, 42, 0.08)',
  textPrimary: '#0F172A',
  textSecondary: '#334155',
  textMuted: '#64748B',
  primary: '#2563EB',
  primaryLight: 'rgba(37, 99, 235, 0.1)',
  secondary: '#7C3AED',
  accent: '#DB2777',
  border: 'rgba(15, 23, 42, 0.08)',
  borderStrong: 'rgba(15, 23, 42, 0.15)',
  inputBg: '#E2E8F0',
  inputBorder: '#CBD5E1',
  inputPlaceholder: 'rgba(15, 23, 42, 0.45)',
  glassBg: 'rgba(241, 245, 249, 0.90)',
  statusBar: 'dark',
  navBg: '#EAEFF5',
  tabActive: '#2563EB',
  tabInactive: '#64748B',
  skeletonBg: 'rgba(0, 0, 0, 0.06)',
};

interface ThemeContextType {
  themeMode: ThemeMode;
  activeTheme: ResolvedTheme;
  isDark: boolean;
  colors: ThemeColors;
  toggleTheme: () => void;
  setThemeMode: (mode: ThemeMode) => void;
}

const THEME_STORAGE_KEY = 'feedx_app_theme_preference';

const ThemeContext = createContext<ThemeContextType>({
  themeMode: 'dark',
  activeTheme: 'dark',
  isDark: true,
  colors: DARK_THEME_COLORS,
  toggleTheme: () => {},
  setThemeMode: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const deviceColorScheme = useDeviceColorScheme();
  const [themeMode, setThemeModeState] = useState<ThemeMode>('dark');

  useEffect(() => {
    loadSavedTheme();
  }, []);

  const loadSavedTheme = async () => {
    try {
      const saved = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      if (saved === 'light' || saved === 'dark' || saved === 'system') {
        setThemeModeState(saved as ThemeMode);
      }
    } catch (e) {
      console.warn('Failed to load theme preference:', e);
    }
  };

  const setThemeMode = async (mode: ThemeMode) => {
    setThemeModeState(mode);
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, mode);
    } catch (e) {
      console.warn('Failed to save theme preference:', e);
    }
  };

  const toggleTheme = () => {
    const nextMode: ThemeMode = activeTheme === 'dark' ? 'light' : 'dark';
    setThemeMode(nextMode);
  };

  // Resolve active theme based on selected themeMode and device settings
  let activeTheme: ResolvedTheme = 'dark';
  if (themeMode === 'system') {
    activeTheme = (deviceColorScheme === 'light' ? 'light' : 'dark');
  } else {
    activeTheme = themeMode;
  }

  const isDark = activeTheme === 'dark';
  const colors = isDark ? DARK_THEME_COLORS : LIGHT_THEME_COLORS;

  return (
    <ThemeContext.Provider
      value={{
        themeMode,
        activeTheme,
        isDark,
        colors,
        toggleTheme,
        setThemeMode,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
