import { Redirect, Stack } from 'expo-router';
import { useUser } from '@/context/UserContext';

export default function AdminLayout() {
  const { user, booting, mustChangePassword } = useUser();
  const role = String(user?.role || '').trim().toLowerCase();
  const isAdmin = role === 'admin' || role === 'super_admin' || role === 'inst_admin';

  if (booting) return null;
  if (!user) return <Redirect href="/login" />;
  if (mustChangePassword) return <Redirect href="/change-password" />;
  if (!isAdmin) return <Redirect href="/(tabs)" />;

  return (
    <Stack screenOptions={{ headerShown: false }} initialRouteName="index">
      <Stack.Screen name="index" options={{ title: 'Command Deck' }} />
      <Stack.Screen name="students" options={{ title: 'Student Registry' }} />
      <Stack.Screen name="notifications" options={{ title: 'Broadcast Hub' }} />
      <Stack.Screen name="opportunities" options={{ title: 'Placement Hub' }} />
      <Stack.Screen name="resources" options={{ title: 'Material Registry' }} />
      <Stack.Screen name="timetable" options={{ title: 'Academic Control' }} />
      <Stack.Screen name="attendance" />
      <Stack.Screen name="tasks" />
      <Stack.Screen name="issues" />
      <Stack.Screen name="security" />
      <Stack.Screen name="events" />
      <Stack.Screen name="colleges" />
    </Stack>
  );
}
