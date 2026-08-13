import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Dimensions,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SHADOWS } from '@/constants/theme';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useUser } from '@/context/UserContext';
import { supabase } from '@/lib/supabase';

import { useTheme } from '@/context/ThemeContext';
import { storage } from '@/store/storage';

const { width } = Dimensions.get('window');

export default function AIRoadmapComingSoonScreen() {
  const router = useRouter();
  const { user } = useUser();
  const { colors, isDark } = useTheme();
  const [notified, setNotified] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  React.useEffect(() => {
    // 1. Check local storage first
    const storageKey = user?.id ? `roadmap_notified_${user.id}` : 'roadmap_notified';
    const isLocallyNotified = storage.getBoolean(storageKey) || storage.getBoolean('roadmap_notified');
    if (isLocallyNotified) {
      setNotified(true);
    }

    // 2. Sync with Supabase database if logged in
    if (user?.id) {
      (async () => {
        try {
          const { data } = await supabase
            .from('waitlist_roadmap')
            .select('id')
            .eq('user_id', user.id)
            .maybeSingle();
          if (data) {
            setNotified(true);
            storage.set(storageKey, true);
            storage.set('roadmap_notified', true);
          }
        } catch (err) {
          console.log('Waitlist check error:', err);
        }
      })();
    }
  }, [user?.id]);

  const handleNotifyMe = async () => {
    if (notified) {
      Alert.alert('Already Registered', 'You are already on the priority waitlist for AI Roadmap Generator!');
      return;
    }

    setSubmitting(true);
    try {
      if (user?.id) {
        await supabase.from('roadmap_waitlist').insert({
          user_id: user.id,
          name: user.full_name || 'Student',
          email: user.email || '',
          created_at: new Date().toISOString(),
        });
      }
      
      const storageKey = user?.id ? `roadmap_notified_${user.id}` : 'roadmap_notified';
      storage.set(storageKey, true);
      storage.set('roadmap_notified', true);
      setNotified(true);

      Alert.alert(
        '🚀 Priority Access Requested!',
        'You have been added to the AI Roadmap early access waitlist. We will notify you as soon as it launches!'
      );
    } catch (e: any) {
      const storageKey = user?.id ? `roadmap_notified_${user.id}` : 'roadmap_notified';
      storage.set(storageKey, true);
      storage.set('roadmap_notified', true);
      setNotified(true);
      Alert.alert('Subscribed!', 'We will notify you when AI Roadmap Generator launches.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {isDark && <LinearGradient colors={['#0F172A', '#020617']} style={StyleSheet.absoluteFillObject} />}

      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity style={[styles.backBtn, { backgroundColor: colors.inputBg, borderColor: colors.border }]} onPress={() => router.back()}>
          <Feather name="arrow-left" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>AI Roadmap Generator</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Coming Soon Badge */}
        <Animated.View entering={FadeInDown.duration(400).springify()} style={styles.badgeContainer}>
          <View style={styles.comingSoonBadge}>
            <Text style={styles.badgeText}>🚀 Coming Soon</Text>
          </View>
        </Animated.View>

        {/* AI Hero Illustration */}
        <Animated.View entering={FadeInUp.duration(600).springify()} style={styles.heroContainer}>
          <LinearGradient colors={['#06B6D4', '#3B82F6', '#8B5CF6']} style={styles.heroGlow} />
          <View style={styles.heroIconWrapper}>
            <MaterialCommunityIcons name="compass-outline" size={72} color="#FFF" />
          </View>
        </Animated.View>

        {/* Titles */}
        <Animated.View entering={FadeInDown.delay(200).duration(500).springify()} style={styles.textGroup}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>AI Roadmap Generator</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Your personalized AI-powered learning roadmap with 25+ career paths.
          </Text>

          <TouchableOpacity 
            style={{ marginTop: 20, borderRadius: 16, overflow: 'hidden' }}
            onPress={() => router.push('/roadmap')}
          >
            <LinearGradient colors={['#3B82F6', '#1D4ED8']} style={{ height: 50, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8, paddingHorizontal: 20 }}>
              <MaterialCommunityIcons name="compass-outline" size={20} color="#FFF" />
              <Text style={{ color: '#FFF', fontWeight: '900', fontSize: 15 }}>Launch AI Roadmap Generator</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

        {/* Feature Preview Cards */}
        <Animated.View entering={FadeInDown.delay(300).duration(500).springify()} style={styles.previewSection}>
          <Text style={[styles.previewHeading, { color: colors.textMuted }]}>WHAT TO EXPECT IN THIS RELEASE</Text>

          <View style={styles.featureGrid}>
            <FeatureCard
              icon="map-search-outline"
              title="Personalized Learning Paths"
              desc="Tailored step-by-step roadmaps based on your branch, semester, and target goals."
            />
            <FeatureCard
              icon="folder-star-outline"
              title="Project Recommendations"
              desc="Curated industrial project suggestions to build a strong engineering portfolio."
            />
            <FeatureCard
              icon="certificate-outline"
              title="Certification & Skill Paths"
              desc="Recognized industry certification roadmaps matching market demands."
            />
            <FeatureCard
              icon="briefcase-outline"
              title="Placement & Internship Guidance"
              desc="Direct preparation timelines for top polytechnic placement opportunities."
            />
          </View>
        </Animated.View>

        {/* Action Buttons */}
        <Animated.View entering={FadeInDown.delay(400).duration(500).springify()} style={styles.actionGroup}>
          <TouchableOpacity
            style={[styles.primaryBtn, notified && styles.primaryBtnActive]}
            activeOpacity={0.85}
            onPress={handleNotifyMe}
            disabled={submitting}
          >
            <LinearGradient
              colors={notified ? ['#10B981', '#059669'] : ['#06B6D4', '#3B82F6']}
              style={styles.btnGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Feather name={notified ? 'check-circle' : 'bell'} size={20} color="#FFF" />
              <Text style={styles.primaryBtnText}>
                {notified ? 'Waitlist Joined' : 'Notify Me'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.secondaryBtn, { backgroundColor: colors.inputBg, borderColor: colors.border }]}
            activeOpacity={0.8}
            onPress={() => router.replace('/(tabs)')}
          >
            <Feather name="home" size={18} color={colors.textSecondary} />
            <Text style={[styles.secondaryBtnText, { color: colors.textSecondary }]}>Back to Home</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

function FeatureCard({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  const { colors, isDark } = useTheme();
  return (
    <View style={[styles.featureCard, { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.03)' : colors.card, borderColor: colors.cardBorder }]}>
      <View style={[styles.cardIconBox, { backgroundColor: isDark ? 'rgba(6, 182, 212, 0.1)' : 'rgba(6, 182, 212, 0.15)' }]}>
        <MaterialCommunityIcons name={icon as any} size={22} color="#06B6D4" />
      </View>
      <View style={styles.cardInfo}>
        <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>{title}</Text>
        <Text style={[styles.cardDesc, { color: colors.textSecondary }]}>{desc}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020617' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#FFF' },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 60,
    alignItems: 'center',
  },
  badgeContainer: {
    marginTop: 10,
    marginBottom: 24,
  },
  comingSoonBadge: {
    backgroundColor: 'rgba(6, 182, 212, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(6, 182, 212, 0.3)',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  badgeText: {
    color: '#06B6D4',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  heroContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    position: 'relative',
  },
  heroGlow: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 70,
    opacity: 0.2,
  },
  heroIconWrapper: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(6, 182, 212, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(6, 182, 212, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.glow('#06B6D4'),
  },
  textGroup: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 26,
    fontWeight: '900',
    color: '#FFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 10,
  },
  previewSection: {
    width: '100%',
    marginBottom: 32,
  },
  previewHeading: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.textMuted,
    letterSpacing: 1.5,
    marginBottom: 16,
    textAlign: 'center',
  },
  featureGrid: {
    gap: 12,
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 16,
    padding: 16,
    gap: 14,
  },
  cardIconBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: 'rgba(6, 182, 212, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardInfo: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFF',
    marginBottom: 4,
  },
  cardDesc: {
    fontSize: 13,
    color: COLORS.textMuted,
    lineHeight: 18,
  },
  actionGroup: {
    width: '100%',
    gap: 12,
  },
  primaryBtn: {
    height: 54,
    borderRadius: 16,
    overflow: 'hidden',
  },
  primaryBtnActive: {},
  btnGradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  primaryBtnText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFF',
  },
  secondaryBtn: {
    height: 50,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  secondaryBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.8)',
  },
});
