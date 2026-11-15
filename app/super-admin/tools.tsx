import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, Platform } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

const TOOLS = [
  {
    id: 'quiz',
    title: 'Daily Quiz Manager',
    description: 'Create 10 MCQs, configure coins & publish Daily Quiz in real-time',
    icon: 'help-circle-outline',
    route: '/admin/quiz-manager',
    color: '#F59E0B',
  },
  {
    id: 'explore',
    title: 'Content Studio',
    description: 'Publish Quick Learn micro-lessons, tech roadmap cards & tips',
    icon: 'book-open-page-variant-outline',
    route: '/admin/explore-manager',
    color: '#10B981',
  },
  {
    id: 'support',
    title: 'Support & Issues Triage',
    description: 'Resolve campus bug tickets, academic feedback & escalations',
    icon: 'inbox-outline',
    route: '/super-admin/support',
    color: '#EF4444',
  },
  {
    id: 'polls',
    title: 'Campus Polls & Surveys',
    description: 'Create multi-option student polls, monitor votes & close in real-time',
    icon: 'vote-outline',
    route: '/admin/polls',
    color: '#8B5CF6',
  },
  {
    id: 'colleges',
    title: 'Institutes & Campuses',
    description: 'Manage affiliated colleges, branches, fee structures & codes',
    icon: 'domain',
    route: '/super-admin/colleges',
    color: '#06B6D4',
  },
  {
    id: 'admins',
    title: 'Campus Administrators',
    description: 'Provision credentials & assign institutional administrative privileges',
    icon: 'shield-account-outline',
    route: '/super-admin/admins',
    color: '#8B5CF6',
  },
  {
    id: 'community',
    title: 'Community Moderator',
    description: 'Broadcast announcements, pin discussions & moderate feed',
    icon: 'forum-outline',
    route: '/super-admin/community',
    color: '#6366F1',
  },
  {
    id: 'system',
    title: 'Global Control Hub',
    description: 'Live platform telemetry, database metrics & maintenance',
    icon: 'server-network',
    route: '/super-admin',
    color: '#14B8A6',
  }
];

export default function SuperAdminTools() {
  const router = useRouter();
  const { colors, isDark } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {isDark && <LinearGradient colors={['#0F172A', '#020617']} style={StyleSheet.absoluteFill} />}
      
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.cardBorder }]}>
        <View style={[styles.headerIcon, { backgroundColor: isDark ? 'rgba(245, 158, 11, 0.12)' : '#FEF3C7', borderColor: isDark ? 'rgba(245, 158, 11, 0.25)' : '#FDE68A' }]}>
          <MaterialCommunityIcons name="toolbox-outline" size={24} color="#F59E0B" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>Super Admin Tools</Text>
          <Text style={[styles.subtitle, { color: colors.textMuted }]}>Management console & shortcuts</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.grid}>
          {TOOLS.map((tool, index) => (
            <Animated.View 
              key={tool.id} 
              entering={FadeInDown.delay(index * 60).springify()}
              style={styles.cardWrapper}
            >
              <TouchableOpacity 
                style={[styles.card, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
                activeOpacity={0.8}
                onPress={() => router.push(tool.route as any)}
              >
                <View style={[styles.iconContainer, { backgroundColor: isDark ? `${tool.color}15` : `${tool.color}10`, borderColor: `${tool.color}30` }]}>
                  <MaterialCommunityIcons name={tool.icon as any} size={28} color={tool.color} />
                </View>
                <Text style={[styles.cardTitle, { color: colors.textPrimary }]} numberOfLines={1}>{tool.title}</Text>
                <Text style={[styles.cardDesc, { color: colors.textMuted }]} numberOfLines={3}>{tool.description}</Text>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 56 : 42,
    paddingHorizontal: 20,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderBottomWidth: 1,
  },
  headerIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 12,
    marginTop: 2,
    fontWeight: '600',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
  },
  cardWrapper: {
    width: (width - 44) / 2,
    marginBottom: 4,
  },
  card: {
    borderRadius: 20,
    padding: 16,
    alignItems: 'flex-start',
    borderWidth: 1,
    minHeight: 165,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    borderWidth: 1,
  },
  cardTitle: {
    fontSize: 14.5,
    fontWeight: '800',
    marginBottom: 4,
  },
  cardDesc: {
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '500',
  }
});
