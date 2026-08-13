import React, { useState } from 'react';
import { Alert, View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Linking } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SHADOWS } from '@/constants/theme';
import AnimatedBackground from '@/components/ui/AnimatedBackground';
import { useUser } from '@/context/UserContext';
import { joinFeatureWaitlist } from '@/services/supabaseService';
import { useTheme } from '@/context/ThemeContext';
import { storage } from '@/store/storage';

const { width } = Dimensions.get('window');

function ToolCard({ title, description, icon, color, route, action, index, isExternal }) {
  const router = useRouter();
  const { colors } = useTheme();
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  const handlePress = () => {
    if (action) {
      action();
    } else if (isExternal) {
      Linking.openURL(route);
    } else {
      router.push(route);
    }
  };

  return (
    <Animated.View entering={FadeInDown.delay(index * 60).springify()} style={styles.toolCardWrapper}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={handlePress}
        onPressIn={() => { scale.value = withSpring(0.96); }}
        onPressOut={() => { scale.value = withSpring(1); }}
      >
        <Animated.View style={[styles.toolCard, { backgroundColor: colors.card, borderColor: colors.cardBorder, borderWidth: 1 }, animStyle]}>
          <View style={[styles.iconCircle, { backgroundColor: `${color}15` }]}>
             <MaterialCommunityIcons name={icon} size={28} color={color} />
          </View>
          <View style={styles.toolInfo}>
            <Text style={[styles.toolTitle, { color: colors.textPrimary }]}>{title}</Text>
            <Text style={[styles.toolDesc, { color: colors.textSecondary }]} numberOfLines={2}>{description}</Text>
          </View>
          <View style={styles.cardIndicator}>
             <Feather name={isExternal ? "external-link" : "chevron-right"} size={16} color={colors.textMuted} />
          </View>
        </Animated.View>
      </TouchableOpacity>
    </Animated.View>
  );
}

function ComingSoonCard({ title, description, featureKey, index, userId }) {
  const { colors } = useTheme();
  const [notified, setNotified] = useState(false);

  React.useEffect(() => {
    const isNotified = storage.getBoolean(`waitlist_${featureKey}_${userId || 'anon'}`);
    if (isNotified) setNotified(true);
  }, [featureKey, userId]);

  const handleNotify = async () => {
    if (!userId) return Alert.alert('Sign in required', 'Please log in to get notified.');
    try {
      await joinFeatureWaitlist(userId, featureKey);
      storage.set(`waitlist_${featureKey}_${userId}`, true);
      setNotified(true);
      Alert.alert('Saved', 'We will notify you when this feature launches.');
    } catch {
      storage.set(`waitlist_${featureKey}_${userId}`, true);
      setNotified(true);
      Alert.alert('Saved', 'We will notify you when this feature launches.');
    }
  };

  return (
    <Animated.View entering={FadeInDown.delay(index * 80).springify()} style={[styles.comingCard, { backgroundColor: colors.card, borderColor: colors.cardBorder, borderWidth: 1 }]}>
      <View style={styles.comingBadge}><Text style={styles.comingBadgeText}>COMING SOON</Text></View>
      <Text style={[styles.comingTitle, { color: colors.textPrimary }]}>{title}</Text>
      <Text style={[styles.comingDesc, { color: colors.textSecondary }]}>{description}</Text>
      <TouchableOpacity style={[styles.notifyBtn, notified && { backgroundColor: 'rgba(16, 185, 129, 0.2)' }]} onPress={handleNotify}>
        <Text style={[styles.notifyBtnText, notified && { color: '#10B981' }]}>{notified ? '✓ Waitlist Joined' : 'Notify Me'}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function ToolsScreen() {
  const { user } = useUser();
  const { colors, isDark } = useTheme();
  const isAdmin = user?.role?.trim().toLowerCase() === 'admin' || user?.role?.trim().toLowerCase() === 'super_admin';

  const studentUtilities = [
    { title: 'AI Roadmap Generator', description: 'Personalized step-by-step learning paths for 25+ tech careers', icon: 'map-marker-path', color: '#3B82F6', route: '/roadmap' },
    { title: 'FEEDX ID', description: 'Your Verified Digital Student Identity', icon: 'card-account-details-outline', color: '#EC4899', route: '/tools/id-generator' },
    { title: 'Percentage Calculator', description: 'CGPA to Percentage (Percentage = CGPA × 9.5)', icon: 'percent-outline', color: '#8B5CF6', route: '/tools/percentage' },
    { title: 'College Directory', description: 'Explore college directories, branches and campuses', icon: 'school-outline', color: '#14B8A6', route: '/colleges' },
    { title: 'Innovation Hub', description: 'Build projects, showcase innovative ideas, connect with mentors, develop startups, participate in hackathons, collaborate with students.', icon: 'lightbulb-on-outline', color: '#F59E0B', route: '/innovation' },
    { title: 'Event Calendar', description: 'Institutional events & holidays list', icon: 'calendar-star', color: '#06B6D4', route: '/(tabs)/events' },
    { title: 'Resume Builder', description: 'Create professional ATS-ready resumes', icon: 'file-account-outline', color: '#6366F1', route: 'https://www.overleaf.com/', isExternal: true },
  ];

  const adminTools = [
    { title: 'Daily Quiz Manager', description: 'Create, edit 10 MCQs, set coin rewards & publish Daily Quiz for students', icon: 'help-circle-outline', color: '#F59E0B', route: '/admin/quiz-manager' },
    { title: 'Command Deck', description: 'Real-time system monitoring', icon: 'monitor-dashboard', color: '#3B82F6', route: '/(tabs)/admin' },
    { title: 'Identity Console', description: 'User & enrollment management', icon: 'account-cog-outline', color: '#10B981', route: '/(tabs)/admin/students' },
    { title: 'Broadcast Hub', description: 'Mass communication engine', icon: 'broadcast', color: '#F59E0B', route: '/(tabs)/admin/notifications' },
    { title: 'Placement Cell', description: 'Career & corporate relations', icon: 'briefcase-check-outline', color: '#EC4899', route: '/(tabs)/admin/opportunities' },
    { title: 'Asset Registry', description: 'Digital material management', icon: 'layers-triple-outline', color: '#8B5CF6', route: '/(tabs)/admin/resources' },
    { title: 'Security Matrix', description: 'Audit logs & access control', icon: 'shield-lock-outline', color: '#6366F1', route: '/(tabs)/admin/security' },
    { title: 'All Features Directory', description: 'Master Index of every FEEDX feature', icon: 'grid-large', color: '#06B6D4', route: '/all-features' },
  ];

  const tools = isAdmin ? adminTools : studentUtilities;

  const comingSoon = [
    { title: 'Roadmap Generator', description: 'AI-powered career roadmap for your branch.', featureKey: 'roadmap_generator' },
    { title: 'AI Career Assistant', description: 'Personalized guidance for placements and skills.', featureKey: 'ai_career_assistant' },
    { title: 'AI Resume Builder', description: 'Build ATS-ready resumes with smart suggestions.', featureKey: 'ai_resume_builder' },
    { title: 'AI Study Planner', description: 'Plan your semester with intelligent scheduling.', featureKey: 'ai_study_planner' },
    { title: 'FX-Bot', description: 'Your FeedX campus assistant chatbot.', featureKey: 'fx_bot' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {isDark && <AnimatedBackground />}
      
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.duration(800).springify()} style={styles.header}>
           <View style={styles.headerTop}>
              <View>
                 <Text style={[styles.brandTitle, { color: colors.textPrimary }]}>FEEDX <Text style={styles.brandPro}>UTILS</Text></Text>
                 <Text style={[styles.headerSubtitle, { color: colors.textMuted }]}>{isAdmin ? 'Management Suite' : 'Academic Utility Hub'}</Text>
              </View>
              <View style={[styles.headerIconBox, { backgroundColor: colors.inputBg }]}>
                 <MaterialCommunityIcons name={isAdmin ? "shield-star-outline" : "tools"} size={28} color={colors.textPrimary} />
              </View>
           </View>
        </Animated.View>

        <View style={styles.grid}>
           {tools.map((tool, index) => (
             <ToolCard key={tool.title} {...tool} index={index} />
           ))}
        </View>

        {!isAdmin && (
          <View style={styles.comingSection}>
            <Text style={[styles.comingSectionTitle, { color: colors.textPrimary }]}>Coming Soon</Text>
            {comingSoon.map((item, index) => (
              <ComingSoonCard key={item.featureKey} {...item} index={index} userId={user?.id} />
            ))}
          </View>
        )}

        <View style={styles.footer}>
           <Text style={[styles.footerText, { color: colors.textMuted }]}>UTILITY SUITE v2.0 • ENCRYPTED ACCESS</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020617' },
  scroll: { paddingTop: 60, paddingBottom: 120 },
  header: { paddingHorizontal: 24, marginBottom: 32 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  brandTitle: { fontSize: 28, fontWeight: '900', color: '#FFF', letterSpacing: -1 },
  brandPro: { color: '#3B82F6', fontWeight: '400' },
  headerSubtitle: { fontSize: 13, color: 'rgba(255,255,255,0.4)', marginTop: 4, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 1 },
  headerIconBox: { width: 52, height: 52, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.03)', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)' },
  grid: { paddingHorizontal: 20 },
  toolCardWrapper: { marginBottom: 16 },
  toolCard: { height: 90, borderRadius: 24, overflow: 'hidden', backgroundColor: 'rgba(255,255,255,0.02)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, gap: 16 },
  iconCircle: { width: 52, height: 52, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  toolInfo: { flex: 1 },
  toolTitle: { fontSize: 17, fontWeight: '800', color: '#FFF' },
  toolDesc: { fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 4, fontWeight: '500' },
  cardIndicator: { paddingLeft: 8 },
  comingSection: { paddingHorizontal: 20, marginTop: 24 },
  comingSectionTitle: { fontSize: 12, fontWeight: '800', color: 'rgba(255,255,255,0.35)', letterSpacing: 1, marginBottom: 12, textTransform: 'uppercase' },
  comingCard: { borderRadius: 20, padding: 16, marginBottom: 12, backgroundColor: 'rgba(255,255,255,0.03)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)' },
  comingBadge: { alignSelf: 'flex-start', backgroundColor: 'rgba(245,158,11,0.15)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, marginBottom: 8 },
  comingBadgeText: { color: '#F59E0B', fontSize: 10, fontWeight: '800' },
  comingTitle: { color: '#FFF', fontSize: 16, fontWeight: '800' },
  comingDesc: { color: 'rgba(255,255,255,0.45)', fontSize: 13, marginTop: 4, lineHeight: 18 },
  notifyBtn: { marginTop: 12, alignSelf: 'flex-start', backgroundColor: 'rgba(79,70,229,0.2)', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10 },
  notifyBtnText: { color: COLORS.primary, fontWeight: '700', fontSize: 13 },
  footer: { marginTop: 40, alignItems: 'center' },
  footerText: { fontSize: 9, color: 'rgba(255,255,255,0.2)', fontWeight: '800', letterSpacing: 2 }
});
