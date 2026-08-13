import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Linking,
  useWindowDimensions,
  Platform,
  Image as RNImage,
} from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import GlassCard from '@/components/ui/GlassCard';
import { useTheme } from '@/context/ThemeContext';

const METRICS = [
  { value: '5+', label: 'Partner Colleges' },
  { value: '4K+', label: 'Students' },
  { value: '24/7', label: 'Support Desk' },
  { value: '100%', label: 'Student Built' },
];

const SOCIAL_CHANNELS = [
  {
    title: 'Official Web Portal',
    subtitle: 'feedxpolytechnic.com',
    url: 'https://feedxpolytechnic.com',
    icon: 'globe',
    iconFamily: 'Feather',
    colors: ['#2563EB', '#1D4ED8'],
    badge: 'Web Portal',
    desc: 'Access official updates, study resources, opportunities, and student services in one place.',
  },
  {
    title: 'WhatsApp Public Channel',
    subtitle: 'Official Broadcast Channel',
    url: 'https://whatsapp.com/channel/0029Vaqm8e4IN9iqTfXumX1r',
    icon: 'whatsapp',
    iconFamily: 'FontAwesome5',
    colors: ['#16A34A', '#15803D'],
    badge: 'Live Updates',
    desc: 'Get instant alerts for scholarships, internships, events, examinations, placements, and important announcements.',
  },
  {
    title: 'Instagram Community',
    subtitle: '@feedx_official',
    url: 'https://instagram.com/feedx_official',
    icon: 'instagram',
    iconFamily: 'FontAwesome5',
    colors: ['#E1306C', '#C13584'],
    badge: 'Highlights',
    desc: 'Explore student achievements, innovation stories, technology updates, entrepreneurship content, and community highlights.',
  },
  {
    title: 'LinkedIn Network',
    subtitle: 'FEEDX TG Polytechnic Community',
    url: 'https://linkedin.com/company/feedx-tg-polytechnic-community',
    icon: 'linkedin',
    iconFamily: 'FontAwesome5',
    colors: ['#0A66C2', '#004182'],
    badge: 'Careers',
    desc: 'Connect with recruiters, alumni, mentors, internships, and professional opportunities.',
  },
  {
    title: 'YouTube Learning Hub',
    subtitle: 'FEEDX TG POLYTECHNIC',
    url: 'https://youtube.com/@feedx_official',
    icon: 'youtube',
    iconFamily: 'FontAwesome5',
    colors: ['#DC2626', '#991B1B'],
    badge: 'Learning',
    desc: 'Watch tutorials, project demonstrations, career guidance, placement preparation, and skill development content.',
  },
];

const CORE_PILLARS = [
  {
    title: 'Skills',
    tagline: '💡 Practical & Technical',
    desc: 'Develop practical, technical, and professional skills to become career and industry ready.',
    icon: 'award',
    color: '#8B5CF6',
  },
  {
    title: 'Opportunities',
    tagline: '🚀 Career-Defining Pathway',
    desc: 'Discover internships, scholarships, jobs, hackathons, workshops, and other career-defining opportunities.',
    icon: 'briefcase',
    color: '#F97316',
  },
  {
    title: 'Knowledge',
    tagline: '📚 Information & Resources',
    desc: 'Gain the right information, guidance, and resources to make career decisions.',
    icon: 'book-open',
    color: '#10B981',
  },
];

export default function AboutFeedXScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { colors, isDark } = useTheme();

  const isSmallScreen = width < 375;

  const handleOpenLink = async (url: string) => {
    try {
      await Linking.openURL(url);
    } catch {
      console.warn(`Failed to open URL: ${url}`);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {isDark && <LinearGradient colors={['#070A12', '#0F172A', '#131C31']} style={StyleSheet.absoluteFill} />}

      {/* Header Navigation */}
      <View style={[styles.topNav, { paddingTop: Math.max(insets.top + 12, 44), borderBottomColor: colors.border, backgroundColor: colors.background }]}>
        <TouchableOpacity 
          style={[styles.backBtn, { backgroundColor: colors.inputBg, borderColor: colors.border }]} 
          onPress={() => router.back()} 
          activeOpacity={0.8}
          accessibilityLabel="Go back"
          accessibilityRole="button"
        >
          <Feather name="arrow-left" size={20} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.navTitle, { color: colors.textPrimary }]} numberOfLines={1}>Platform & Community</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={[styles.scrollContent, { paddingBottom: Math.max(insets.bottom + 40, 60) }]}
      >
        {/* Executive Hero */}
        <Animated.View entering={FadeInDown.duration(500).springify()} style={styles.heroSection}>
          <View style={styles.logoBadgeWrap}>
            <View style={[styles.logoGlowRing, { borderColor: isDark ? 'rgba(59, 130, 246, 0.3)' : 'rgba(37, 99, 235, 0.2)' }]} />
            <RNImage 
              source={require('../assets/images/icon.png')} 
              style={styles.logoImage} 
              resizeMode="cover"
            />
            <View style={[styles.verifiedTag, { backgroundColor: colors.background }]}>
              <MaterialCommunityIcons name="check-decagram" size={16} color="#3B82F6" />
            </View>
          </View>

          <Text style={[styles.appName, { color: colors.textPrimary }]} allowFontScaling={true}>FEEDX POLYTECHNIC COMMUNITY</Text>
          <Text style={[styles.appSubtitle, { color: colors.textSecondary }]} allowFontScaling={true}>Empowering Polytechnic Students Across Telangana</Text>

          <View style={[styles.mottoBar, { backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)', borderColor: colors.border }]}>
            <View style={styles.mottoDot} />
            <Text style={[styles.mottoText, { color: colors.textSecondary }]} allowFontScaling={true}>Built by 🩵 Students, for Students</Text>
          </View>
        </Animated.View>

        {/* Platform Metrics */}
        <Animated.View entering={FadeInUp.delay(100).duration(450)} style={styles.metricsContainer}>
          {METRICS.map((m, i) => (
            <View 
              key={i} 
              style={[
                styles.metricCard,
                { backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : colors.card, borderColor: colors.border },
                isSmallScreen && { width: '48%', minWidth: 140 }
              ]}
            >
              <Text style={styles.metricValue}>{m.value}</Text>
              <Text style={[styles.metricLabel, { color: colors.textMuted }]} numberOfLines={2}>{m.label}</Text>
            </View>
          ))}
        </Animated.View>

        {/* Mission Statement */}
        <Animated.View entering={FadeInUp.delay(160).duration(450)}>
          <GlassCard style={styles.sectionCard}>
            <View style={styles.cardTitleRow}>
              <View style={styles.titleIconBox}>
                <Feather name="target" size={18} color="#3B82F6" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>Our Mission</Text>
                <Text style={[styles.cardSubtitle, { color: colors.textMuted }]}>Bridging the Gap Between Potential & Success</Text>
              </View>
            </View>

            <Text style={[styles.bodyParagraph, { color: colors.textSecondary }]} allowFontScaling={true}>
              FEEDX exists to bridge the gap between potential and success by ensuring that no Polytechnic student is left behind due to a lack of awareness. We are committed to making knowledge accessible, skills attainable, opportunities reachable, and support available to every student—empowering them to dream bigger, unlock their full potential, build successful careers, and become future innovators, leaders, and catalysts for positive change.
            </Text>
          </GlassCard>
        </Animated.View>

        {/* Leadership & Mentorship */}
        <View style={styles.sectionGroup}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTag}>LEADERSHIP & MENTORSHIP</Text>
            <Text style={[styles.sectionHeading, { color: colors.textPrimary }]}>Departmental Guidance</Text>
          </View>

          <GlassCard style={styles.mentorCard}>
            <View style={styles.mentorRow}>
              <View style={styles.mentorImageWrap}>
                <View style={[styles.mentorGlowRing, { borderColor: isDark ? 'rgba(79, 70, 229, 0.4)' : 'rgba(79, 70, 229, 0.25)' }]} />
                <Image
                  source={require('../assets/images/yogitha_rana.png')}
                  style={[styles.mentorImage, { borderColor: colors.borderStrong }]}
                  contentFit="cover"
                />
              </View>
              <View style={styles.mentorDetails}>
                <View style={styles.mentorBadge}>
                  <Text style={styles.mentorBadgeText}>PRINCIPAL SECRETARY</Text>
                </View>
                <Text style={[styles.mentorName, { color: colors.textPrimary }]} numberOfLines={2}>Dr. Yogitha Rana, IAS</Text>
                <Text style={[styles.mentorTitle, { color: colors.textSecondary }]}>Principal Secretary, Education Department</Text>
                <Text style={[styles.mentorState, { color: colors.textMuted }]}>Government of Telangana</Text>
              </View>
            </View>
            <View style={[styles.mentorQuoteContainer, { borderTopColor: colors.border }]}>
              <Text style={[styles.mentorQuote, { color: colors.textSecondary }]} allowFontScaling={true}>
                Guiding, advising, and steering the FEEDX Polytechnic Community to support technical education and student empowerment throughout the State of Telangana.
              </Text>
            </View>
          </GlassCard>

          <GlassCard style={[styles.mentorCard, { marginTop: 14 }]}>
            <View style={styles.mentorRow}>
              <View style={styles.mentorImageWrap}>
                <View style={[styles.mentorGlowRing, { borderColor: isDark ? 'rgba(16, 185, 129, 0.4)' : 'rgba(16, 185, 129, 0.25)' }]} />
                <Image
                  source={require('../assets/images/sri_devasena.png')}
                  style={[styles.mentorImage, { borderColor: colors.borderStrong }]}
                  contentFit="cover"
                />
              </View>
              <View style={styles.mentorDetails}>
                <View style={[styles.mentorBadge, { backgroundColor: 'rgba(16, 185, 129, 0.15)', borderColor: 'rgba(16, 185, 129, 0.3)' }]}>
                  <Text style={[styles.mentorBadgeText, { color: '#10B981' }]}>COMMISSIONER</Text>
                </View>
                <Text style={[styles.mentorName, { color: colors.textPrimary }]} numberOfLines={2}>Smt. A. Sri Devasena, IAS</Text>
                <Text style={[styles.mentorTitle, { color: colors.textSecondary }]}>Commissioner of Collegiate & Technical Education</Text>
                <Text style={[styles.mentorState, { color: colors.textMuted }]}>Government of Telangana</Text>
              </View>
            </View>
            <View style={[styles.mentorQuoteContainer, { borderTopColor: colors.border }]}>
              <Text style={[styles.mentorQuote, { color: colors.textSecondary }]} allowFontScaling={true}>
                Fostering academic excellence, modern curriculum integration, and industrial readiness across collegiate and technical education institutions.
              </Text>
            </View>
          </GlassCard>
        </View>

        {/* Core Pillars */}
        <Animated.View entering={FadeInUp.delay(220).duration(450)} style={styles.sectionGroup}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTag}>🧩 OUR FRAMEWORK — SOK</Text>
            <Text style={[styles.sectionHeading, { color: colors.textPrimary }]}>The Three Core Pillars</Text>
            <Text style={[styles.sectionSubheading, { color: colors.textMuted }]}>
              FEEDX is built on three core pillars that empower every Polytechnic student:
            </Text>
          </View>

          <View style={styles.pillarsGrid}>
            {CORE_PILLARS.map((item, i) => (
              <GlassCard key={i} style={styles.pillarCard}>
                <View style={styles.pillarTop}>
                  <View style={[styles.pillarIconWrap, { backgroundColor: item.color + '15', borderColor: item.color + '30' }]}>
                    <Feather name={item.icon as any} size={20} color={item.color} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.pillarTitle, { color: colors.textPrimary }]}>{item.title}</Text>
                    <Text style={[styles.pillarTagline, { color: item.color }]}>{item.tagline}</Text>
                  </View>
                </View>
                <Text style={[styles.pillarDesc, { color: colors.textSecondary }]} allowFontScaling={true}>{item.desc}</Text>
              </GlassCard>
            ))}
          </View>
        </Animated.View>

        {/* Official Social & Connect Channels */}
        <Animated.View entering={FadeInUp.delay(280).duration(450)} style={styles.sectionGroup}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTag}>CONNECT & FOLLOW</Text>
            <Text style={[styles.sectionHeading, { color: colors.textPrimary }]}>Official Community Channels</Text>
          </View>

          <View style={styles.channelList}>
            {SOCIAL_CHANNELS.map((ch, i) => (
              <TouchableOpacity
                key={i}
                style={[styles.channelCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
                onPress={() => handleOpenLink(ch.url)}
                activeOpacity={0.85}
                accessibilityRole="button"
                accessibilityLabel={`Open ${ch.title}`}
              >
                <LinearGradient colors={ch.colors as any} style={styles.channelIconWrap} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
                  {ch.iconFamily === 'FontAwesome5' ? (
                    <FontAwesome5 name={ch.icon as any} size={18} color="#FFF" />
                  ) : (
                    <Feather name={ch.icon as any} size={18} color="#FFF" />
                  )}
                </LinearGradient>

                <View style={styles.channelMain}>
                  <View style={styles.channelHeaderRow}>
                    <Text style={[styles.channelTitle, { color: colors.textPrimary }]} numberOfLines={1}>{ch.title}</Text>
                    <View style={[styles.badgePill, { backgroundColor: ch.colors[0] + '18', borderColor: ch.colors[0] + '35' }]}>
                      <Text style={[styles.badgeText, { color: ch.colors[0] }]}>{ch.badge}</Text>
                    </View>
                  </View>
                  <Text style={[styles.channelHandle, { color: colors.textMuted }]} numberOfLines={1}>{ch.subtitle}</Text>
                  <Text style={[styles.channelDesc, { color: colors.textSecondary }]} allowFontScaling={true}>{ch.desc}</Text>
                </View>

                <View style={[styles.arrowBox, { backgroundColor: colors.inputBg }]}>
                  <Feather name="arrow-up-right" size={16} color={colors.textMuted} />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        {/* Executive Footer Banner */}
        <Animated.View entering={FadeInUp.delay(340).duration(450)} style={styles.footerWrap}>
          <LinearGradient
            colors={isDark ? ['rgba(37, 99, 235, 0.12)', 'rgba(16, 185, 129, 0.08)'] : ['rgba(37, 99, 235, 0.06)', 'rgba(16, 185, 129, 0.04)']}
            style={[styles.footerCard, { borderColor: colors.cardBorder }]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.footerIconCircle}>
              <MaterialCommunityIcons name="shield-check" size={26} color="#10B981" />
            </View>
            <Text style={[styles.footerTitle, { color: colors.textPrimary }]}>FEEDX Polytechnic Community</Text>
            <Text style={[styles.footerText, { color: colors.textSecondary }]} allowFontScaling={true}>Empowering Every Polytechnic Student to Learn, Grow & Succeed.</Text>

            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <Text style={[styles.copyright, { color: colors.textMuted }]}>FEEDX Polytechnic Community • Built by 🩵 Students, for Students</Text>
          </LinearGradient>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#070A12' },
  topNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.04)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  navTitle: { fontSize: 15, fontWeight: '800', color: '#FFF', letterSpacing: 0.3, flex: 1, textAlign: 'center' },
  scrollContent: { paddingHorizontal: 16, paddingTop: 16 },
  heroSection: { alignItems: 'center', marginTop: 12, marginBottom: 20 },
  logoBadgeWrap: { width: 92, height: 92, borderRadius: 28, alignItems: 'center', justifyContent: 'center', marginBottom: 16, position: 'relative' },
  logoGlowRing: { position: 'absolute', width: 104, height: 104, borderRadius: 34, backgroundColor: 'rgba(59, 130, 246, 0.2)', borderWidth: 1, borderColor: 'rgba(59, 130, 246, 0.3)' },
  logoImage: { width: 84, height: 84, borderRadius: 24, borderWidth: 2, borderColor: 'rgba(255,255,255,0.2)', overflow: 'hidden' },
  verifiedTag: { position: 'absolute', bottom: -4, right: -4, backgroundColor: '#070A12', borderRadius: 12, padding: 2 },
  appName: { fontSize: 20, fontWeight: '900', color: '#FFF', letterSpacing: 0.5, textAlign: 'center' },
  appSubtitle: { fontSize: 12, color: 'rgba(255,255,255,0.6)', fontWeight: '600', marginTop: 4, textAlign: 'center', lineHeight: 18, paddingHorizontal: 12 },
  mottoBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 14,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  mottoDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#10B981' },
  mottoText: { fontSize: 11, fontWeight: '800', color: 'rgba(255,255,255,0.85)', letterSpacing: 0.5 },
  metricsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, justifyContent: 'space-between', marginBottom: 20 },
  metricCard: { width: '48%', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 16, paddingVertical: 14, paddingHorizontal: 8, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)', marginBottom: 4 },
  metricValue: { fontSize: 18, fontWeight: '900', color: '#3B82F6' },
  metricLabel: { fontSize: 10, fontWeight: '700', color: 'rgba(255,255,255,0.5)', marginTop: 3, textAlign: 'center' },
  sectionCard: { padding: 18, borderRadius: 22, marginBottom: 24, gap: 12 },
  cardTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  titleIconBox: { width: 38, height: 38, borderRadius: 12, backgroundColor: 'rgba(59, 130, 246, 0.1)', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(59, 130, 246, 0.2)' },
  cardTitle: { fontSize: 16, fontWeight: '800', color: '#FFF' },
  cardSubtitle: { fontSize: 11, color: 'rgba(255,255,255,0.5)', fontWeight: '600', marginTop: 1 },
  bodyParagraph: { fontSize: 13, color: 'rgba(255,255,255,0.8)', lineHeight: 21 },
  sectionGroup: { marginBottom: 24 },
  sectionHeader: { marginBottom: 12 },
  sectionTag: { fontSize: 10, fontWeight: '900', color: '#3B82F6', letterSpacing: 1, marginBottom: 2 },
  sectionHeading: { fontSize: 18, fontWeight: '900', color: '#FFF' },
  sectionSubheading: { fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 4, lineHeight: 18 },
  mentorCard: {
    padding: 16,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(79, 70, 229, 0.2)',
  },
  mentorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  mentorImageWrap: {
    position: 'relative',
    width: 72,
    height: 72,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  mentorImage: {
    width: 72,
    height: 72,
    borderRadius: 20,
    borderWidth: 2,
    zIndex: 2,
    overflow: 'hidden',
    aspectRatio: 1,
    alignSelf: 'center',
  },
  mentorGlowRing: {
    position: 'absolute',
    top: -3,
    left: -3,
    right: -3,
    bottom: -3,
    borderRadius: 23,
    borderWidth: 1,
    zIndex: 1,
  },
  mentorDetails: {
    flex: 1,
    flexShrink: 1,
    gap: 2,
  },
  mentorBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(79, 70, 229, 0.15)',
    borderColor: 'rgba(79, 70, 229, 0.3)',
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginBottom: 4,
  },
  mentorBadgeText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#8B5CF6',
    letterSpacing: 0.5,
  },
  mentorName: {
    fontSize: 15,
    fontWeight: '900',
    color: '#FFF',
  },
  mentorTitle: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.75)',
    fontWeight: '600',
    lineHeight: 15,
  },
  mentorState: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.45)',
    fontWeight: '500',
  },
  mentorQuoteContainer: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.06)',
  },
  mentorQuote: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.55)',
    fontStyle: 'italic',
    lineHeight: 17,
  },
  pillarsGrid: { gap: 12 },
  pillarCard: { padding: 16, borderRadius: 20, gap: 10 },
  pillarTop: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  pillarIconWrap: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  pillarTitle: { fontSize: 15, fontWeight: '800', color: '#FFF' },
  pillarTagline: { fontSize: 11, fontWeight: '700', marginTop: 1 },
  pillarDesc: { fontSize: 12, color: 'rgba(255,255,255,0.7)', lineHeight: 19 },
  channelList: { gap: 12 },
  channelCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 14,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    gap: 12,
  },
  channelIconWrap: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginTop: 2 },
  channelMain: { flex: 1, flexShrink: 1, gap: 3 },
  channelHeaderRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 6, flexWrap: 'wrap' },
  channelTitle: { fontSize: 14, fontWeight: '800', color: '#FFF', flexShrink: 1 },
  badgePill: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6, borderWidth: 1 },
  badgeText: { fontSize: 9, fontWeight: '900' },
  channelHandle: { fontSize: 11, color: 'rgba(255,255,255,0.5)', fontWeight: '700' },
  channelDesc: { fontSize: 11, color: 'rgba(255,255,255,0.7)', lineHeight: 17, marginTop: 2 },
  arrowBox: { width: 28, height: 28, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.04)', alignItems: 'center', justifyContent: 'center', marginTop: 2 },
  footerWrap: { marginTop: 8 },
  footerCard: { padding: 20, borderRadius: 22, alignItems: 'center', textAlign: 'center', gap: 8, borderWidth: 1, borderColor: 'rgba(59, 130, 246, 0.25)' },
  footerIconCircle: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(16, 185, 129, 0.1)', alignItems: 'center', justifyContent: 'center', marginBottom: 2 },
  footerTitle: { fontSize: 16, fontWeight: '900', color: '#FFF', textAlign: 'center' },
  footerText: { fontSize: 12, color: 'rgba(255,255,255,0.65)', textAlign: 'center', lineHeight: 18, paddingHorizontal: 12 },
  divider: { height: 1, width: '80%', backgroundColor: 'rgba(255,255,255,0.08)', marginVertical: 8 },
  copyright: { fontSize: 10, color: 'rgba(255,255,255,0.4)', fontWeight: '600', textAlign: 'center' },
});

