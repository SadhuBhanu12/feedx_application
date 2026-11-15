import { Redirect, Stack } from 'expo-router';
import { useUser } from '@/context/UserContext';
import React from 'react';

export default function AdminRootLayout() {
  const { user, booting, mustChangePassword } = useUser();
  const role = String(user?.role || '').trim().toLowerCase();
  const isAdmin = ['admin', 'super_admin', 'inst_admin', 'college_admin', 'campus_admin'].includes(role);

  if (booting) return null;
  if (!user || !user.id) return <Redirect href="/login" />;
  if (mustChangePassword) return <Redirect href="/login" />;
  if (user.is_active === false) return <Redirect href="/login" />;
  if (!isAdmin) return <Redirect href="/(tabs)" />;

  return <Stack screenOptions={{ headerShown: false }} />;
}
