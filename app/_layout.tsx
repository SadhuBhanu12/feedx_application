import { DarkTheme, DefaultTheme, ThemeProvider, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import * as SplashScreen from 'expo-splash-screen';
import 'react-native-reanimated';
import { UserProvider, useUser } from '@/context/UserContext';

// Prevent splash screen from auto-hiding before asset loading and user context initialization
SplashScreen.preventAutoHideAsync().catch(() => { });

// Sanitize verbose logging in production builds to prevent PII and token leakage into system logcat
if (!__DEV__) {
  console.log = () => {};
  console.info = () => {};
  console.debug = () => {};
}

import { useColorScheme } from '@/hooks/use-color-scheme';
import { QueryClient, QueryClientProvider, onlineManager } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { OfflineBanner } from '@/components/OfflineBanner';
import NetInfo from '@react-native-community/netinfo';
import { setupQueryPersistence } from '@/lib/queryPersist';

// Bind onlineManager to NetInfo
onlineManager.setEventListener(setOnline => {
  return NetInfo.addEventListener(state => {
    setOnline(!!state.isConnected);
  });
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2, // Automatic retries for network failures
      staleTime: 1000 * 60 * 5, // 5 minutes fresh data
      gcTime: 1000 * 60 * 60, // 1 hour garbage collection
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
    },
  },
});

setupQueryPersistence(queryClient);

function AppContent() {
  const colorScheme = useColorScheme();
  const { user, globalSettings } = useUser();

  const isMaintenanceMode = globalSettings?.maintenance_mode === true;
  const adminBypass = globalSettings?.admin_bypass_maintenance === true;

  const isBlocked = useMemo(() => {
    if (!isMaintenanceMode) return false;
    if (!user) return false;

    const role = String(user.role || '').trim().toLowerCase();
    if (role === 'super_admin') return false;
    if (adminBypass && ['admin', 'inst_admin'].includes(role)) {
      return false;
    }
    return true;
  }, [user, isMaintenanceMode, adminBypass]);

  if (isBlocked) {
    return (
      <View style={styles.blockContainer}>
        <LinearGradient colors={['#090D16', '#020408']} style={StyleSheet.absoluteFill} />
        <View style={styles.iconRing}>
          <MaterialCommunityIcons name="cog-sync" size={64} color="#F59E0B" />
        </View>
        <Text style={styles.blockTitle}>
          {globalSettings?.maintenance_title || 'System Maintenance'}
        </Text>
        <Text style={styles.blockDesc}>
          {globalSettings?.maintenance_description || 'We are optimizing database indexes and syncing services. Please try again later.'}
        </Text>
        <View style={styles.etaBadge}>
          <Feather name="clock" size={14} color="#F59E0B" />
          <Text style={styles.etaText}>
            Expected offline duration: {globalSettings?.maintenance_expected_time || '2 Hours'}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'fade_from_bottom',
          animationDuration: 240,
          gestureEnabled: true,
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="terms-conditions" options={{ presentation: 'fullScreenModal', animation: 'slide_from_bottom' }} />
        <Stack.Screen name="login" />
        <Stack.Screen name="first-time-login" />
        <Stack.Screen name="create-password" />
        <Stack.Screen name="activation-success" />
        <Stack.Screen name="forgot-password" />
        <Stack.Screen name="change-password" />
        <Stack.Screen name="(tabs)" options={{ animation: 'fade' }} />
        <Stack.Screen name="opportunity-detail" options={{ presentation: 'card' }} />
        <Stack.Screen name="event-detail" options={{ presentation: 'card' }} />
        <Stack.Screen name="event-feedback" options={{ presentation: 'card' }} />
        <Stack.Screen name="colleges" options={{ presentation: 'card' }} />
        <Stack.Screen name="college-detail" options={{ presentation: 'card' }} />
        <Stack.Screen name="bookmarks" options={{ presentation: 'card' }} />
        <Stack.Screen name="custom-link" options={{ presentation: 'card' }} />
        <Stack.Screen name="join-us" options={{ presentation: 'card' }} />
        <Stack.Screen name="report-bug" options={{ presentation: 'card' }} />
        <Stack.Screen name="profile-edit" options={{ presentation: 'card' }} />
        <Stack.Screen name="profile-setup" options={{ presentation: 'card' }} />
        <Stack.Screen name="admin-issues" options={{ presentation: 'card' }} />
        <Stack.Screen name="community" options={{ presentation: 'card' }} />
        <Stack.Screen name="innovation" options={{ presentation: 'card' }} />
        <Stack.Screen name="institutional-settings" options={{ presentation: 'card' }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', animation: 'slide_from_bottom', animationDuration: 220 }} />
        <Stack.Screen name="stay-in-loop" options={{ presentation: 'modal', animation: 'slide_from_bottom', animationDuration: 220 }} />
        <Stack.Screen name="support" options={{ presentation: 'card' }} />
        <Stack.Screen name="about-feedx" options={{ presentation: 'card' }} />
        <Stack.Screen name="all-features" options={{ presentation: 'card' }} />
        <Stack.Screen name="roadmap" options={{ presentation: 'card' }} />
        <Stack.Screen name="rewards" options={{ presentation: 'card' }} />
        <Stack.Screen name="leaderboard" options={{ presentation: 'card' }} />
        <Stack.Screen name="daily-quiz" options={{ presentation: 'fullScreenModal', animation: 'slide_from_bottom' }} />
        <Stack.Screen name="daily-quiz-result" options={{ presentation: 'card' }} />
        <Stack.Screen name="quick-learn-detail" options={{ presentation: 'card' }} />
        <Stack.Screen name="certificate-view" options={{ presentation: 'card' }} />
        <Stack.Screen name="verify-qr" options={{ presentation: 'card' }} />
        <Stack.Screen name="super-admin" options={{ animation: 'fade' }} />
        <Stack.Screen name="admin/quiz-manager" options={{ presentation: 'card' }} />
        <Stack.Screen name="admin/polls" options={{ presentation: 'card' }} />
        <Stack.Screen name="admin/explore-manager" options={{ presentation: 'card' }} />
        <Stack.Screen name="admin/daily-challenges" options={{ presentation: 'card' }} />
        <Stack.Screen name="admin/organizer-dashboard" options={{ presentation: 'card' }} />
        <Stack.Screen name="admin/scanner" options={{ presentation: 'card' }} />
        <Stack.Screen name="admin/create-announcement" options={{ presentation: 'card' }} />
        <Stack.Screen name="admin/grievances" options={{ presentation: 'card' }} />
        <Stack.Screen name="community/post/[id]" options={{ presentation: 'card' }} />
        <Stack.Screen name="daily-challenges/index" options={{ presentation: 'card' }} />
        <Stack.Screen name="daily-challenges/[id]" options={{ presentation: 'card' }} />
        <Stack.Screen name="daily-challenges/history" options={{ presentation: 'card' }} />
        <Stack.Screen name="student/ticket" options={{ presentation: 'card' }} />
        <Stack.Screen name="tools/id-generator" options={{ presentation: 'card' }} />
        <Stack.Screen name="tools/percentage" options={{ presentation: 'card' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

import { ThemeProvider as CustomThemeProvider } from '@/context/ThemeContext';

import { GamificationProvider } from '@/context/GamificationContext';

export default function RootLayout() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <CustomThemeProvider>
          <UserProvider>
            <GamificationProvider>
              <OfflineBanner />
              <AppContent />
            </GamificationProvider>
          </UserProvider>
        </CustomThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  blockContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 30, backgroundColor: '#020408' },
  iconRing: { width: 110, height: 110, borderRadius: 55, backgroundColor: 'rgba(245, 158, 11, 0.05)', borderWidth: 1, borderColor: 'rgba(245, 158, 11, 0.15)', alignItems: 'center', justifyContent: 'center', marginBottom: 25 },
  blockTitle: { fontSize: 24, fontWeight: '900', color: '#FFF', textAlign: 'center', marginBottom: 12, letterSpacing: -0.5 },
  blockDesc: { fontSize: 14, color: 'rgba(255,255,255,0.5)', textAlign: 'center', lineHeight: 22, paddingHorizontal: 15, marginBottom: 30, fontWeight: '500' },
  etaBadge: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, backgroundColor: 'rgba(245, 158, 11, 0.06)', borderWidth: 1, borderColor: 'rgba(245, 158, 11, 0.15)' },
  etaText: { color: '#F59E0B', fontSize: 12, fontWeight: '700' }
});
