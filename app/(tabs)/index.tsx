import { Redirect } from 'expo-router';
import HomeScreen from '@/screens/HomeScreen';
import { useUser } from '@/context/UserContext';
import { useAuthStore } from '@/store/useAuthStore';

export default function Index() {
  const { user, booting, mustChangePassword } = useUser();
  const role = String(user?.role || '').toLowerCase().trim();
  const isAdmin = role === 'admin' || role === 'super_admin' || role === 'inst_admin';

  if (booting) return null;

  if (!user || !user.id) {
    return <Redirect href="/login" />;
  }

  if (mustChangePassword) {
    return <Redirect href="/login" />;
  }

  // Profile setup redirect removed by user request

  if (isAdmin) {
    return <Redirect href="/(tabs)/admin" />;
  }

  return <HomeScreen />;
}

