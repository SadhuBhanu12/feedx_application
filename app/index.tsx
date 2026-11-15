import React, { useEffect, useState, useRef, useMemo } from 'react';
import { Redirect } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import NetInfo from '@react-native-community/netinfo';
import { useUser } from '@/context/UserContext';
import AppLoader from '@/components/ui/AppLoader';
import { storage, storageReady } from '@/store/storage';
import { useAuthStore } from '@/store/useAuthStore';

const MINIMUM_SPLASH_TIME = 1500; // ms to ensure smooth, tasteful branded entrance (1.5s)
const TIMEOUT_FALLBACK_TIME = 6000; // ms before allowing manual bypass

export default function Index() {
  const { user, booting, mustChangePassword } = useUser();

  const [termsChecked, setTermsChecked] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [minTimeElapsed, setMinTimeElapsed] = useState(false);
  const [isTimedOut, setIsTimedOut] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [readyToNavigate, setReadyToNavigate] = useState(false);
  const [forceContinue, setForceContinue] = useState(false);

  // 1. Immediately hide native splash to seamlessly reveal custom animated splash with identical #0A0F1D background
  useEffect(() => {
    SplashScreen.hideAsync().catch(() => {});
  }, []);

  // 2. Check network status
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsOffline(state.isConnected === false);
    });
    return () => unsubscribe();
  }, []);

  // 3. Minimum display timer for premium animation rhythm
  useEffect(() => {
    const minTimer = setTimeout(() => {
      setMinTimeElapsed(true);
    }, MINIMUM_SPLASH_TIME);

    return () => clearTimeout(minTimer);
  }, []);

  // 4. Storage verification (Terms & conditions acceptance)
  useEffect(() => {
    let isMounted = true;
    const checkStorage = async () => {
      try {
        await storageReady;
        const val = storage.getString('terms_accepted_v1');
        if (isMounted) {
          setTermsAccepted(val === 'true');
        }
      } catch (e) {
        console.warn('[Index] Storage check notice:', e);
      } finally {
        if (isMounted) {
          setTermsChecked(true);
        }
      }
    };

    checkStorage();

    // Guard timer for storage check
    const guardTimer = setTimeout(() => {
      if (isMounted) setTermsChecked(true);
    }, 1200);

    return () => {
      isMounted = false;
      clearTimeout(guardTimer);
    };
  }, []);

  // 5. Safety fallback timer so splash NEVER hangs indefinitely
  useEffect(() => {
    const safetyTimer = setTimeout(() => {
      setIsTimedOut(true);
    }, TIMEOUT_FALLBACK_TIME);

    return () => clearTimeout(safetyTimer);
  }, []);

  // Compute realistic status message corresponding to actual app lifecycle
  const statusMessage = useMemo(() => {
    if (isOffline) {
      return 'Offline mode • Restoring local session...';
    }
    if (!termsChecked) {
      return 'Preparing your campus experience...';
    }
    if (booting && !isTimedOut) {
      return 'Verifying secure credentials...';
    }
    if (isTimedOut) {
      return 'Connecting to FeedX cloud services...';
    }
    return 'Almost ready...';
  }, [isOffline, termsChecked, booting, isTimedOut]);

  // Determine readiness for smooth exit animation
  const isAppReady = forceContinue || (!booting && termsChecked && minTimeElapsed);

  // Handle fallback button click
  const handleTimeoutContinue = () => {
    setForceContinue(true);
  };

  // If exit animation has completed, perform the final destination redirect
  if (readyToNavigate) {
    if (!termsAccepted) {
      return <Redirect href="/terms-conditions" />;
    }

    if (!user || !user.id) {
      return <Redirect href="/login" />;
    }

    if (mustChangePassword) {
      return <Redirect href="/change-password" />;
    }

    const role = String(user?.role || '').trim().toLowerCase();
    if (role === 'super_admin') {
      return <Redirect href="/super-admin" />;
    }

    if (role === 'admin' || role === 'inst_admin' || role === 'college_admin' || role === 'campus_admin') {
      return <Redirect href="/(tabs)/admin" />;
    }

    return <Redirect href="/(tabs)" />;
  }

  // Render the modern animated splash screen
  return (
    <AppLoader
      theme="dark"
      message={statusMessage}
      subMessage={isTimedOut ? 'Connection is taking longer than usual' : undefined}
      isOffline={isOffline}
      showRetry={isTimedOut}
      onRetry={handleTimeoutContinue}
      isReady={isAppReady}
      onFinish={() => setReadyToNavigate(true)}
    />
  );
}
