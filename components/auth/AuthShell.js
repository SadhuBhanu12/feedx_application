import React, { useCallback } from 'react';
import { BackHandler, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import { COLORS, SPACING } from '@/constants/theme';

import { useTheme } from '@/context/ThemeContext';

export default function AuthShell({ title, subtitle, children, showBack = true, onBack }) {
  const router = useRouter();
  const { colors, isDark } = useTheme();

  useFocusEffect(
    useCallback(() => {
      if (Platform.OS !== 'android') return;
      const handleBackPress = () => {
        if (onBack) {
          onBack();
          return true;
        }
        if (router.canGoBack()) {
          router.back();
          return true;
        }
        router.replace('/login');
        return true;
      };

      const sub = BackHandler.addEventListener('hardwareBackPress', handleBackPress);
      return () => sub.remove();
    }, [onBack, router])
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {isDark && <LinearGradient colors={COLORS.gradientHome} style={StyleSheet.absoluteFill} />}
      {isDark && <View style={[styles.glow, { top: -80, left: -80, backgroundColor: COLORS.primaryGlow }]} />}
      {isDark && <View style={[styles.glow, { bottom: -80, right: -80, backgroundColor: COLORS.purpleLight }]} />}

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.flex}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          {showBack ? (
            <TouchableOpacity style={styles.backBtn} onPress={onBack || (() => router.back())}>
              <Feather name="arrow-left" size={20} color={colors.textPrimary} />
              <Text style={[styles.backText, { color: colors.textSecondary }]}>Back to Login</Text>
            </TouchableOpacity>
          ) : null}

          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.textPrimary }]}>{title}</Text>
            {subtitle ? <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{subtitle}</Text> : null}
          </View>

          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>{children}</View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  flex: { flex: 1 },
  glow: { position: 'absolute', width: 280, height: 280, borderRadius: 140, opacity: 0.25 },
  scroll: { flexGrow: 1, padding: SPACING.xl, paddingTop: 56 },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: SPACING.lg },
  backText: { color: 'rgba(255,255,255,0.7)', fontWeight: '700', fontSize: 14 },
  header: { marginBottom: SPACING.lg },
  title: { fontSize: 28, fontWeight: '900', color: '#FFF', letterSpacing: -0.5 },
  subtitle: { marginTop: 8, color: 'rgba(255,255,255,0.55)', fontSize: 14, lineHeight: 20 },
  card: {
    borderRadius: 28,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    backgroundColor: 'rgba(255,255,255,0.03)',
    padding: 24,
    gap: 16,
  },
});
