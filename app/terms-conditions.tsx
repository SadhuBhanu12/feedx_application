import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Alert,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import GlassCard from '@/components/ui/GlassCard';
import { storage } from '@/store/storage';
import { useUser } from '@/context/UserContext';

const { width } = Dimensions.get('window');

export default function TermsConditionsScreen() {
  const router = useRouter();
  const { user } = useUser();
  const [hasAgreed, setHasAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // If user is logged in or navigating from app, render read-only informational document
  const isReadOnly = !!user;

  const handleAcceptTerms = () => {
    if (!hasAgreed) {
      Alert.alert(
        'Agreement Required',
        'Please check the box to confirm you agree to the Terms & Conditions before proceeding.'
      );
      return;
    }

    setSubmitting(true);
    try {
      storage.set('terms_accepted_v1', 'true');
      router.replace('/login');
    } catch (e) {
      console.warn('[TermsConditions] Save error:', e);
      router.replace('/login');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={['#090D16', '#0F172A', '#020617']}
        style={StyleSheet.absoluteFillObject}
      />

      {/* Decorative Glow Blobs */}
      <View style={[styles.glowBlob, { top: -80, right: -60, backgroundColor: 'rgba(59, 130, 246, 0.15)' }]} />
      <View style={[styles.glowBlob, { bottom: 100, left: -60, backgroundColor: 'rgba(139, 92, 246, 0.12)' }]} />

      {/* Top Header Bar with Back Button */}
      <View style={styles.topNav}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Feather name="arrow-left" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.topNavTitle}>Terms & Conditions</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Animated.View entering={FadeInDown.delay(50).duration(400)} style={styles.header}>
          <View style={styles.badgeRow}>
            <View style={styles.badge}>
              <MaterialCommunityIcons name="shield-check" size={14} color="#3B82F6" />
              <Text style={styles.badgeText}>OFFICIAL INSTITUTIONAL PORTAL</Text>
            </View>
          </View>
          <Text style={styles.title}>Terms & Conditions</Text>
          <Text style={styles.subtitle}>
            Official academic usage terms, data privacy guidelines, and conduct policies for FEEDX.
          </Text>
        </Animated.View>

        {/* Document Sections */}
        <Animated.View entering={FadeInDown.delay(100).duration(450)}>
          <GlassCard style={styles.docCard}>
            <View style={styles.sectionHeader}>
              <Feather name="shield" size={18} color="#3B82F6" style={{ marginRight: 8 }} />
              <Text style={styles.sectionTitle}>1. Authorized Access & Identity</Text>
            </View>
            <Text style={styles.paragraph}>
              FEEDX is an official technical education platform. Access is restricted to authenticated diploma students, faculty members, and collegiate administrators with valid credentials. Unauthorized access or identity impersonation is strictly prohibited.
            </Text>

            <View style={styles.divider} />

            <View style={styles.sectionHeader}>
              <Feather name="lock" size={18} color="#8B5CF6" style={{ marginRight: 8 }} />
              <Text style={styles.sectionTitle}>2. Data Privacy & Encrypted Records</Text>
            </View>
            <Text style={styles.paragraph}>
              Your academic grades, PIN records, attendance data, and support grievances are encrypted according to State Technical Education data privacy standards. Anonymous ticket reporting options strip personal identifiers before database logging.
            </Text>

            <View style={styles.divider} />

            <View style={styles.sectionHeader}>
              <Feather name="file-text" size={18} color="#10B981" style={{ marginRight: 8 }} />
              <Text style={styles.sectionTitle}>3. Academic Integrity & Conduct</Text>
            </View>
            <Text style={styles.paragraph}>
              Users must maintain academic integrity when utilizing the SGPA/CGPA Grade Engine, submitting Innovation Hub pitches, or participating in institutional discussions. Submitting false data or spam ticket logs will result in account suspension.
            </Text>

            <View style={styles.divider} />

            <View style={styles.sectionHeader}>
              <Feather name="bell" size={18} color="#F59E0B" style={{ marginRight: 8 }} />
              <Text style={styles.sectionTitle}>4. System Alerts & Notifications</Text>
            </View>
            <Text style={styles.paragraph}>
              By utilizing FEEDX, you agree to receive essential academic notifications, SBTET examination updates, placement opportunity notices, and event check-in alerts related to your Polytechnic program.
            </Text>
          </GlassCard>
        </Animated.View>

        {/* Checkbox & Agree Action (Only for onboarding/unauthenticated mode) */}
        {!isReadOnly && (
          <>
            <Animated.View entering={FadeInUp.delay(150).duration(400)} style={styles.checkboxContainer}>
              <TouchableOpacity
                style={styles.checkboxTouch}
                onPress={() => setHasAgreed(!hasAgreed)}
                activeOpacity={0.8}
              >
                <View style={[styles.checkboxBox, hasAgreed && styles.checkboxBoxChecked]}>
                  {hasAgreed && <Feather name="check" size={14} color="#FFF" />}
                </View>
                <Text style={styles.checkboxLabel}>
                  I have read and agree to the <Text style={styles.linkText}>Terms of Service</Text> and{' '}
                  <Text style={styles.linkText}>Privacy Policy</Text>.
                </Text>
              </TouchableOpacity>
            </Animated.View>

            <Animated.View entering={FadeInUp.delay(200).duration(400)}>
              <TouchableOpacity
                style={[styles.acceptBtn, !hasAgreed && styles.acceptBtnDisabled]}
                onPress={handleAcceptTerms}
                disabled={submitting}
                activeOpacity={0.85}
              >
                <LinearGradient
                  colors={hasAgreed ? ['#3B82F6', '#1D4ED8'] : ['#334155', '#1E293B']}
                  style={styles.acceptGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Text style={styles.acceptBtnText}>
                    {submitting ? 'Setting up...' : 'I Agree & Continue'}
                  </Text>
                  <Feather name="arrow-right" size={18} color="#FFF" style={{ marginLeft: 8 }} />
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          </>
        )}

        <Text style={styles.footerNote}>
          FEEDX Polytechnic Academic Engine • Telangana State
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#070A12',
  },
  glowBlob: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 130,
  },
  topNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 54,
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  topNavTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFF',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 20,
  },
  badgeRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(59, 130, 246, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.25)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  badgeText: {
    color: '#60A5FA',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginLeft: 6,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.6)',
    lineHeight: 18,
  },
  docCard: {
    padding: 18,
    borderRadius: 20,
    marginBottom: 18,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  sectionTitle: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '700',
  },
  paragraph: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12.5,
    lineHeight: 18,
    marginLeft: 26,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    marginVertical: 14,
  },
  checkboxContainer: {
    marginBottom: 20,
  },
  checkboxTouch: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 14,
    padding: 14,
  },
  checkboxBox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  checkboxBoxChecked: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  checkboxLabel: {
    flex: 1,
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 12.5,
    lineHeight: 17,
  },
  linkText: {
    color: '#60A5FA',
    fontWeight: '700',
  },
  acceptBtn: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    elevation: 4,
  },
  acceptBtnDisabled: {
    opacity: 0.6,
  },
  acceptGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  acceptBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  footerNote: {
    textAlign: 'center',
    color: 'rgba(255, 255, 255, 0.35)',
    fontSize: 11,
    marginTop: 8,
  },
});
