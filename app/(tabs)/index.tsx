import { Redirect } from 'expo-router';
import HomeScreen from '@/screens/HomeScreen';
import { useUser } from '@/context/UserContext';

export default function Index() {
  const { user, booting, mustChangePassword } = useUser();
  const role = String(user?.role || '').toLowerCase().trim();
  const isAdmin = role === 'admin' || role === 'super_admin' || role === 'inst_admin';

  if (booting) return null;

  if (!user) {
    return <Redirect href="/login" />;
  }

  if (mustChangePassword) {
    return <Redirect href="/change-password" />;
  }

  // Profile setup redirect removed by user request

  if (isAdmin) {
    return <Redirect href="/(tabs)/admin" />;
  }

  return <HomeScreen />;
}

