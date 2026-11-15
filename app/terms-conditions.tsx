import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/context/ThemeContext';
import { storage } from '@/store/storage';

export default function TermsConditionsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ viewOnly?: string }>();
  const { colors, isDark } = useTheme();
  const [accepted, setAccepted] = useState(false);

  const isViewOnly = params.viewOnly === 'true';

  useEffect(() => {
    const isAlreadyAccepted = storage.getString('terms_accepted_v1') === 'true';
    if (isAlreadyAccepted) {
      setAccepted(true);
    }
  }, []);

  const handleToggle = () => {
    try {
      Haptics.selectionAsync().catch(() => {});
    } catch (_) {}
    setAccepted((prev) => !prev);
  };

  const handleAcceptAndContinue = () => {
    if (!accepted) return;
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    } catch (_) {}
    storage.set('terms_accepted_v1', 'true');
    router.replace('/login');
  };

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#020617' : '#F8FAFC' }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      {isDark && (
        <LinearGradient
          colors={['#090D16', '#0F172A', '#020617']}
          style={StyleSheet.absoluteFill}
        />
      )}

      {/* Top Header Bar with Back / Close Button */}
      <View style={[styles.topNav, { borderBottomColor: isDark ? 'rgba(255,255,255,0.06)' : '#E2E8F0' }]}>
        <TouchableOpacity 
          style={[styles.backBtn, { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : '#FFFFFF', borderColor: isDark ? 'rgba(255, 255, 255, 0.12)' : '#E2E8F0' }]} 
          onPress={() => router.canGoBack() ? router.back() : router.replace('/login')}
          activeOpacity={0.7}
        >
          <Feather name="arrow-left" size={20} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.topNavTitle, { color: colors.textPrimary }]}>Terms & Conditions</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header Badge & Title */}
        <Animated.View entering={FadeInDown.delay(50).duration(400)} style={styles.header}>
          <View style={styles.badgeRow}>
            <View style={[styles.badge, { backgroundColor: isDark ? 'rgba(37, 99, 235, 0.15)' : '#EFF6FF', borderColor: isDark ? 'rgba(37, 99, 235, 0.3)' : 'rgba(37, 99, 235, 0.2)' }]}>
              <MaterialCommunityIcons name="shield-check" size={14} color="#2563EB" />
              <Text style={styles.badgeText}>OFFICIAL INSTITUTIONAL PORTAL</Text>
            </View>
          </View>
          <Text style={[styles.title, { color: colors.textPrimary }]}>Terms & Conditions</Text>
          <Text style={[styles.subtitle, { color: colors.textMuted }]}>
            Official academic usage terms, data privacy guidelines, and conduct policies for the FEEDX Student Platform.
          </Text>
        </Animated.View>

        {/* Document Sections Card */}
        <Animated.View entering={FadeInDown.delay(100).duration(450)}>
          <View style={[styles.docCard, { backgroundColor: colors.card, borderColor: isDark ? colors.cardBorder : '#E2E8F0' }]}>
            {/* Section 1 */}
            <View style={styles.sectionHeader}>
              <View style={[styles.iconBox, { backgroundColor: 'rgba(37, 99, 235, 0.12)' }]}>
                <Feather name="shield" size={16} color="#2563EB" />
              </View>
              <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>1. Authorized Access & Identity</Text>
            </View>
            <Text style={[styles.paragraph, { color: colors.textSecondary }]}>
              FEEDX is an official polytechnic student identity and career readiness platform. Access is granted to verified diploma students, faculty members, and institutional administrators with valid credentials. Unauthorized access or student identity impersonation is strictly prohibited.
            </Text>

            <View style={[styles.divider, { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : '#F1F5F9' }]} />

            {/* Section 2 */}
            <View style={styles.sectionHeader}>
              <View style={[styles.iconBox, { backgroundColor: 'rgba(139, 92, 246, 0.12)' }]}>
                <Feather name="lock" size={16} color="#8B5CF6" />
              </View>
              <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>2. Data Privacy & Encrypted Records</Text>
            </View>
            <Text style={[styles.paragraph, { color: colors.textSecondary }]}>
              Your academic profile, career roadmap progress, digital ID credentials, and support logs are securely encrypted. Student data is utilized strictly for academic tracking, skill development, and career opportunities.
            </Text>

            <View style={[styles.divider, { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : '#F1F5F9' }]} />

            {/* Section 3 */}
            <View style={styles.sectionHeader}>
              <View style={[styles.iconBox, { backgroundColor: 'rgba(16, 185, 129, 0.12)' }]}>
                <Feather name="award" size={16} color="#10B981" />
              </View>
              <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>3. Academic Integrity & Conduct</Text>
            </View>
            <Text style={[styles.paragraph, { color: colors.textSecondary }]}>
              Students must maintain academic honesty across daily quizzes, technical challenges, and community discussions. Misrepresentation or submitting unauthorized content may result in loss of reward certificates and account review.
            </Text>

            <View style={[styles.divider, { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : '#F1F5F9' }]} />

            {/* Section 4 */}
            <View style={styles.sectionHeader}>
              <View style={[styles.iconBox, { backgroundColor: 'rgba(245, 158, 11, 0.12)' }]}>
                <Feather name="bell" size={16} color="#F59E0B" />
              </View>
              <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>4. System Alerts & Notifications</Text>
            </View>
            <Text style={[styles.paragraph, { color: colors.textSecondary }]}>
              By accessing FEEDX, you receive essential collegiate notices, examination timetables, internship announcements, and campus updates related to your polytechnic curriculum.
            </Text>
          </View>
        </Animated.View>

        {/* Informational Footer when viewing from login / settings */}
        {isViewOnly ? (
          <Animated.View entering={FadeInDown.delay(150).duration(450)}>
            <View style={styles.footerInfoBox}>
              <Feather name="info" size={16} color="#2563EB" style={{ marginRight: 8 }} />
              <Text style={[styles.footerInfoText, { color: colors.textMuted }]}>
                These terms apply automatically to all authenticated FEEDX users. If you have questions, please reach out to your campus coordinator.
              </Text>
            </View>
          </Animated.View>
        ) : (
          <>
            {/* Checkbox Section for First-Time App Terms Agreement */}
            <Animated.View entering={FadeInDown.delay(150).duration(450)}>
              <TouchableOpacity 
                style={[
                  styles.checkboxContainer, 
                  { 
                    backgroundColor: isDark ? 'rgba(30, 41, 59, 0.6)' : '#FFFFFF', 
                    borderColor: accepted ? '#2563EB' : isDark ? 'rgba(255, 255, 255, 0.12)' : '#E2E8F0' 
                  }
                ]}
                onPress={handleToggle}
                activeOpacity={0.8}
              >
                <View style={[styles.customCheckbox, accepted && styles.customCheckboxChecked]}>
                  {accepted && <Feather name="check" size={16} color="#FFFFFF" />}
                </View>
                <Text style={[styles.checkboxLabel, { color: colors.textPrimary }]}>
                  I have read, understood, and agree to the <Text style={{ color: '#2563EB', fontWeight: '800' }}>Terms & Conditions</Text> and <Text style={{ color: '#2563EB', fontWeight: '800' }}>Privacy Policy</Text>.
                </Text>
              </TouchableOpacity>
            </Animated.View>

            {/* Accept & Continue Button */}
            <Animated.View entering={FadeInDown.delay(200).duration(450)}>
              <TouchableOpacity
                style={[styles.acceptBtn, !accepted && styles.acceptBtnDisabled]}
                onPress={handleAcceptAndContinue}
                disabled={!accepted}
                activeOpacity={0.85}
              >
                <LinearGradient
                  colors={accepted ? ['#2563EB', '#1D4ED8'] : ['#64748B', '#475569']}
                  style={styles.btnGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Text style={styles.acceptBtnText}>Accept & Continue</Text>
                  <Feather name="arrow-right" size={18} color="#FFFFFF" style={{ marginLeft: 8 }} />
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          </>
        )}

        <Text style={[styles.footerNote, { color: colors.textMuted }]}>
          FEEDX Polytechnic Academic Engine • Telangana State
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? 44 : 14,
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  topNavTitle: {
    fontSize: 17,
    fontWeight: '800',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 18,
  },
  badgeRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  badgeText: {
    color: '#2563EB',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginLeft: 6,
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 13,
    lineHeight: 19,
  },
  docCard: {
    padding: 18,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 10,
  },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: 14.5,
    fontWeight: '800',
    flex: 1,
  },
  paragraph: {
    fontSize: 12.5,
    lineHeight: 19,
    paddingLeft: 42,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    marginVertical: 16,
  },
  footerInfoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(37, 99, 235, 0.06)',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(37, 99, 235, 0.12)',
    marginBottom: 16,
  },
  footerInfoText: {
    flex: 1,
    fontSize: 11.5,
    lineHeight: 17,
    fontWeight: '500',
  },
  footerNote: {
    textAlign: 'center',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginTop: 8,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1.5,
    marginBottom: 16,
    gap: 12,
  },
  customCheckbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  customCheckboxChecked: {
    backgroundColor: '#2563EB',
  },
  checkboxLabel: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '600',
  },
  acceptBtn: {
    height: 52,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  acceptBtnDisabled: {
    opacity: 0.6,
    shadowOpacity: 0,
    elevation: 0,
  },
  btnGradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  acceptBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
});
