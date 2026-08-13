import { Redirect } from 'expo-router';
import { useUser } from '@/context/UserContext';
import { useEffect, useState } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import AppLoader from '@/components/ui/AppLoader';
import { storage, storageReady } from '@/store/storage';

export default function Index() {
  const { user, booting, mustChangePassword } = useUser();
  const [termsChecked, setTermsChecked] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const checkStorage = async () => {
      try {
        await storageReady;
        const val = storage.getString('terms_accepted_v1');
        if (isMounted) {
          if (val === 'true') {
            setTermsAccepted(true);
          } else {
            setTermsAccepted(false);
          }
        }
      } catch (e) {
        console.warn('[Index] Storage check notice:', e);
      } finally {
        if (isMounted) setTermsChecked(true);
      }
    };

    checkStorage();

    const timer = setTimeout(() => {
      if (isMounted) setTermsChecked(true);
    }, 1000);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (!booting && termsChecked) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [booting, termsChecked]);

  if (booting || !termsChecked) {
    return <AppLoader />;
  }

  if (!termsAccepted) {
    return <Redirect href="/terms-conditions" />;
  }

  if (!user) {
    return <Redirect href="/login" />;
  }

  if (mustChangePassword) {
    return <Redirect href="/change-password" />;
  }

  if (user?.role === 'super_admin') {
    return <Redirect href="/super-admin" />;
  }

  return <Redirect href="/(tabs)" />;
}
