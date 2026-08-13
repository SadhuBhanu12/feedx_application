import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SHADOWS, RADIUS } from '@/constants/theme';
import { useRouter } from 'expo-router';
import AnimatedBackground from '@/components/ui/AnimatedBackground';
import Animated, { FadeInDown } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

const TOOLS = [
  {
    id: 'passwords',
    title: 'Manage Passwords',
    description: 'Reset passwords for college admins and students',
    icon: 'key-outline',
    route: '/super-admin/settings', // Assuming settings or a specific password route
    color: COLORS.primary,
  },
  {
    id: 'quiz',
    title: 'Daily Quiz Manager',
    description: 'Create, edit 10 MCQs, set coin rewards & publish Daily Quiz for students',
    icon: 'help-circle-outline',
    route: '/admin/quiz-manager',
    color: '#F59E0B',
  },
  {
    id: 'innovations',
    title: 'Startup Innovations',
    description: 'Review, feedback, and verify student startup ideas',
    icon: 'lightbulb-on-outline',
    route: '/super-admin/innovations',
    color: COLORS.warning,
  },
  {
    id: 'support',
    title: 'Support Triage',
    description: 'Resolve platform tickets, issues and user feedback',
    icon: 'inbox',
    route: '/super-admin/support',
    color: COLORS.danger,
  },
  {
    id: 'events',
    title: 'Event Hub',
    description: 'Publish and manage global & college events',
    icon: 'calendar-star',
    route: '/super-admin/events',
    color: COLORS.primary, // or pick a color like '#F43F5E' if desired, but we'll use theme colors
  },
  {
    id: 'colleges',
    title: 'Institution Manager',
    description: 'Add new colleges, campuses and configure branches',
    icon: 'domain-plus',
    route: '/super-admin/colleges',
    color: COLORS.info,
  },
  {
    id: 'admins',
    title: 'Campus Administrators',
    description: 'Provision and assign administrative permissions',
    icon: 'account-multiple-plus-outline',
    route: '/super-admin/admins',
    color: COLORS.success,
  },
  {
    id: 'community',
    title: 'Community Feed',
    description: 'Create and moderate academic community posts & forums',
    icon: 'forum-outline',
    route: '/community',
    color: COLORS.textMuted,
  },
  {
    id: 'reports',
    title: 'System Reports',
    description: 'View usage analytics and detailed reports',
    icon: 'chart-box-outline',
    route: '/super-admin', 
    color: COLORS.info,
  }
];

export default function SuperAdminTools() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <AnimatedBackground />
      
      <View style={styles.header}>
        <View style={styles.headerIcon}>
          <MaterialCommunityIcons name="toolbox-outline" size={24} color={COLORS.primary} />
        </View>
        <View>
          <Text style={styles.title}>Admin Tools</Text>
          <Text style={styles.subtitle}>Quick shortcuts and management utilities</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.grid}>
          {TOOLS.map((tool, index) => (
            <Animated.View 
              key={tool.id} 
              entering={FadeInDown.delay(index * 100).springify()}
              style={styles.cardWrapper}
            >
              <TouchableOpacity 
                style={styles.card}
                activeOpacity={0.8}
                onPress={() => router.push(tool.route as any)}
              >
                <View style={[styles.iconContainer, { backgroundColor: `${tool.color}15` }]}>
                  <MaterialCommunityIcons name={tool.icon as any} size={32} color={tool.color} />
                </View>
                <Text style={styles.cardTitle}>{tool.title}</Text>
                <Text style={styles.cardDesc}>{tool.description}</Text>
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
    backgroundColor: COLORS.backgroundDark,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.2)',
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: COLORS.textPrimary,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textMuted,
    marginTop: 2,
    fontWeight: '500',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'space-between',
  },
  cardWrapper: {
    width: (width - 56) / 2, // 2 columns with 20 padding on sides and 16 gap
    marginBottom: 8,
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.medium,
    height: 180,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: 8,
  },
  cardDesc: {
    fontSize: 12,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 18,
  }
});
