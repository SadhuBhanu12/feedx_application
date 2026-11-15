import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Dimensions, Linking, Alert, Image, Share, AppState, Modal } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { SkeletonLoader } from '@/components/ui/Loaders';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { safeBack } from '@/utils/navigation';
import { supabase } from '@/lib/supabase';
import { useUser } from '@/context/UserContext';
import { toggleBookmark, isBookmarked, trackOpportunityApply, getUserAppliedOpportunityIds } from '@/services/supabaseService';
import { COLORS } from '@/constants/theme';
import Animated, { FadeInDown } from 'react-native-reanimated';
import FeedbackModal from '@/components/ui/FeedbackModal';
import { useTheme } from '@/context/ThemeContext';

const { width } = Dimensions.get('window');

export default function OpportunityDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useUser();
  const { colors, isDark } = useTheme();
  const [opportunity, setOpportunity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookmarked, setBookmarked] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [companyExpanded, setCompanyExpanded] = useState(true);
  const [isNavigating, setIsNavigating] = useState(false);
  const [logoError, setLogoError] = useState(false);

  const scrollViewRef = useRef(null);

  const scrollToTop = () => {
    if (isNavigating) return;
    setIsNavigating(true);
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ y: 0, animated: true });
    }
    setTimeout(() => setIsNavigating(false), 500);
  };

  const scrollToBottom = () => {
    if (isNavigating) return;
    setIsNavigating(true);
    if (!companyExpanded) setCompanyExpanded(true);
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
    setTimeout(() => setIsNavigating(false), 500);
  };

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    fetchDetails();
  }, [id, user?.id]);

  const fetchDetails = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('opportunities')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      setOpportunity(data);

      if (user?.id) {
        const isBmk = await isBookmarked(user.id, 'opportunity', data.id);
        setBookmarked(isBmk);
        
        const applied = await getUserAppliedOpportunityIds(user.id);
        setHasApplied(applied.includes(data.id));
      }
    } catch (e) {
      console.warn('Error fetching opportunity detail:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleBookmark = async () => {
    if (!user?.id || !opportunity) return;
    const result = await toggleBookmark(user.id, 'opportunity', opportunity.id);
    setBookmarked(result.bookmarked);
  };

  const handleShare = async () => {
    if (!opportunity) return;
    try {
      const shareUrl = opportunity.company_website || opportunity.apply_url || opportunity.apply_link || 'https://feedxpolytechnic.com';
      const stipendMsg = opportunity.stipend ? `\n💰 Stipend/Salary: ${opportunity.stipend}` : '';
      const locationMsg = opportunity.location ? `\n📍 Location: ${opportunity.location}` : '';
      const typeMsg = opportunity.type ? `\n💼 Type: ${opportunity.type}` : '';

      let deadlineMsg = '';
      let availabilityMsg = '';

      if (opportunity.deadline) {
        const deadlineDate = new Date(opportunity.deadline);
        const isValidDate = !isNaN(deadlineDate.getTime());
        const formattedDeadline = isValidDate
          ? deadlineDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
          : opportunity.deadline;

        deadlineMsg = `\n⏳ Last Date to Apply: ${formattedDeadline}`;

        if (isValidDate) {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          deadlineDate.setHours(0, 0, 0, 0);

          const diffTime = deadlineDate.getTime() - today.getTime();
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

          if (diffDays > 0) {
            availabilityMsg = `\n🟢 Status: Active & Available (${diffDays} day${diffDays === 1 ? '' : 's'} left)`;
          } else if (diffDays === 0) {
            availabilityMsg = `\n⚠️ Status: Available (Last Day Today!)`;
          } else {
            availabilityMsg = `\n🔴 Status: Expired (Deadline Passed)`;
          }
        } else {
          availabilityMsg = `\n🟢 Status: Available`;
        }
      } else {
        deadlineMsg = `\n⏳ Last Date to Apply: Open / Apply Soon`;
        availabilityMsg = `\n🟢 Status: Available`;
      }

      const message = `🚀 ${opportunity.title} at ${opportunity.company || opportunity.company_name || 'FEEDX'}${typeMsg}${stipendMsg}${locationMsg}${deadlineMsg}${availabilityMsg}\n\n👉 Apply directly on FEEDX: ${shareUrl}`;

      await Share.share({
        message,
        title: opportunity.title,
        url: shareUrl,
      });
    } catch (error) {
      console.warn("Sharing failed", error);
    }
  };

  const [showPostApplyModal, setShowPostApplyModal] = useState(false);
  const [awaitingReturn, setAwaitingReturn] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active' && awaitingReturn) {
        setAwaitingReturn(false);
        setShowPostApplyModal(true);
      }
    });
    return () => subscription.remove();
  }, [awaitingReturn]);

  const handleApply = async () => {
    if (!opportunity) return;
    const link = opportunity.apply_link || opportunity.apply_url || opportunity.link;
    if (link) {
      setAwaitingReturn(true);
      Linking.openURL(link);
    } else {
      Alert.alert('Apply', 'Application link not available yet.');
    }
  };

  const handleConfirmApplied = async () => {
    setShowPostApplyModal(false);
    if (!user?.id || !opportunity) return;
    try {
      await trackOpportunityApply(user.id, opportunity.id, {
        applied_status: 'Applied',
        applied_date: new Date().toISOString(),
        application_completed: true,
      });
      setHasApplied(true);
      setShowSuccessModal(true);
    } catch (e) {
      console.warn('Apply tracking failed:', e);
      setHasApplied(true);
      setShowSuccessModal(true);
    }
  };

  const handleNotYetApplied = () => {
    setShowPostApplyModal(false);
  };


  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: '#070A13', padding: 24, paddingTop: 60 }}>
        <SkeletonLoader height={180} borderRadius={24} style={{ marginBottom: 24 }} />
        <SkeletonLoader width="70%" height={24} borderRadius={6} style={{ marginBottom: 16 }} />
        <SkeletonLoader width="50%" height={16} borderRadius={4} style={{ marginBottom: 32 }} />
        <SkeletonLoader height={80} borderRadius={16} style={{ marginBottom: 16 }} />
        <SkeletonLoader height={120} borderRadius={16} />
      </View>
    );
  }

  if (!opportunity) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>Details not found</Text>
        <TouchableOpacity style={styles.backBtnFallback} onPress={() => safeBack('/(tabs)')}>
          <Text style={styles.backBtnText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const parseList = (text) => {
    if (!text) return [];
    return text.split('\n').filter(t => t.trim().length > 0);
  };

  const skills = opportunity.skills ? opportunity.skills.split(',').map(s => s.trim()) : ['Communication', 'Management'];
  const qualificationsList = parseList(opportunity.qualifications || 'No specific qualifications listed.');
  const rolesList = parseList(opportunity.responsibilities || 'No specific responsibilities listed.');

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Top Header */}
      <View style={[styles.header, { borderBottomColor: colors.border, backgroundColor: colors.background }]}>
        <TouchableOpacity onPress={() => safeBack('/(tabs)')} style={[styles.iconBtn, { backgroundColor: colors.inputBg, borderColor: colors.border }]}>
          <Feather name="chevron-left" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={[styles.headerTitle, { color: colors.textPrimary }]} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.8}>{opportunity.title || 'Opportunity Details'}</Text>
          <Text style={[styles.headerSubtitle, { color: colors.textMuted }]}>Job Description</Text>
        </View>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView ref={scrollViewRef} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.delay(100).springify()}>
          {/* Company Banner */}
          <TouchableOpacity 
            style={[styles.companyBanner, { backgroundColor: isDark ? '#24252B' : colors.card, borderColor: colors.border, borderWidth: 1 }]} 
            activeOpacity={0.8}
            onPress={() => setCompanyExpanded(!companyExpanded)}
          >
            <View style={styles.companyLogoBox}>
               {opportunity.company_logo && !logoError ? (
                  <Image 
                    source={{ uri: opportunity.company_logo }} 
                    style={styles.companyLogoImg} 
                    onError={() => setLogoError(true)}
                  />
               ) : (
                  <Text style={styles.companyLogoText}>{opportunity.company?.charAt(0) || 'C'}</Text>
               )}
            </View>
            <View style={styles.companyBannerInfo}>
              <Text style={[styles.companyName, { color: colors.textPrimary }]}>{opportunity.company}</Text>
              <Text style={[styles.companyLocation, { color: colors.textMuted }]}>{opportunity.location || 'Remote'}</Text>
            </View>
            <Feather name={companyExpanded ? "chevron-up" : "chevron-down"} size={20} color={colors.textPrimary} />
          </TouchableOpacity>

          {/* Badges */}
          <View style={styles.badgesRow}>
            <View style={[styles.badge, { backgroundColor: isDark ? '#24252B' : colors.card, borderColor: colors.border, borderWidth: 1 }]}><Text style={[styles.badgeText, { color: colors.textPrimary }]}>{opportunity.type || 'Full time'}</Text></View>
            <View style={[styles.badge, { backgroundColor: isDark ? '#24252B' : colors.card, borderColor: colors.border, borderWidth: 1 }]}><Text style={[styles.badgeText, { color: colors.textPrimary }]}>{opportunity.location ? 'Onsite' : 'Remote'}</Text></View>
            {opportunity.duration && <View style={[styles.badge, { backgroundColor: isDark ? '#24252B' : colors.card, borderColor: colors.border, borderWidth: 1 }]}><Text style={[styles.badgeText, { color: colors.textPrimary }]}>{opportunity.duration}</Text></View>}
          </View>

          {/* Expandable Details Section */}
          {companyExpanded && (
            <Animated.View entering={FadeInDown.duration(300)}>
              {opportunity.description ? (
                <>
                  <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Company Overview & Description</Text>
                  <Text style={[styles.listText, { color: colors.textSecondary, marginBottom: 20 }]}>{opportunity.description}</Text>
                </>
              ) : null}

              {/* Skills Required */}
              <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Skills Required</Text>
              <View style={styles.skillsRow}>
                {skills.map((skill, index) => (
                  <View key={index} style={[styles.skillBadge, { backgroundColor: isDark ? '#24252B' : colors.card, borderColor: colors.border }]}>
                    <Text style={[styles.skillText, { color: colors.textPrimary }]}>{skill}</Text>
                  </View>
                ))}
              </View>

              {/* Qualifications */}
              <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Qualifications</Text>
              <View style={styles.listContainer}>
                {qualificationsList.map((item, index) => (
                  <View key={index} style={styles.listItem}>
                    <View style={[styles.bullet, { backgroundColor: colors.textPrimary }]} />
                    <Text style={[styles.listText, { color: colors.textSecondary }]}>{item.replace(/^- /, '')}</Text>
                  </View>
                ))}
              </View>

              {/* Roles and Responsibilities */}
              <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Roles and Responsibilities</Text>
              <View style={styles.listContainer}>
                {rolesList.map((item, index) => (
                  <View key={index} style={styles.listItem}>
                    <View style={[styles.bullet, { backgroundColor: colors.textPrimary }]} />
                    <Text style={[styles.listText, { color: colors.textSecondary }]}>{item.replace(/^- /, '')}</Text>
                  </View>
                ))}
              </View>
            </Animated.View>
          )}
        </Animated.View>
      </ScrollView>

      {/* Fixed Bottom Bar */}
      <View style={[styles.bottomBar, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
        <View style={styles.salaryContainer}>
           <Text style={[styles.salaryAmount, { color: colors.textPrimary }]}>
              {opportunity.stipend ? (opportunity.stipend.includes('₹') ? opportunity.stipend : `₹ ${opportunity.stipend}`) : 'Competitive'}
           </Text>
           <Text style={[styles.salarySub, { color: colors.textMuted }]}>Per Year</Text>
        </View>
        <TouchableOpacity 
           style={[styles.applyBtn, hasApplied && styles.applyBtnDisabled]} 
           activeOpacity={0.8}
           onPress={handleApply}
           disabled={hasApplied}
        >
           <Text style={styles.applyBtnText}>{hasApplied ? 'Applied' : 'Apply'}</Text>
        </TouchableOpacity>
      </View>

      {/* Post Apply Confirmation Modal */}
      <Modal visible={showPostApplyModal} transparent animationType="fade">

        <View style={modalStyles.overlay}>
          <View style={modalStyles.card}>
            <View style={modalStyles.iconCircle}>
              <Feather name="help-circle" size={44} color="#3B82F6" />
            </View>
            <Text style={modalStyles.title}>Did you complete your application?</Text>
            <Text style={modalStyles.message}>We hope your application process went smoothly.</Text>
            
            <View style={modalStyles.btnRow}>
              <TouchableOpacity style={[modalStyles.btn, modalStyles.yesBtn]} onPress={handleConfirmApplied}>
                <Text style={modalStyles.yesBtnText}>✅ Yes, I Applied</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[modalStyles.btn, modalStyles.noBtn]} onPress={handleNotYetApplied}>
                <Text style={modalStyles.noBtnText}>⏳ Not Yet</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Success Notification Modal */}
      <FeedbackModal
        visible={showSuccessModal}
        type="success"
        title="Application Confirmed"
        message="Your application status has been recorded successfully. Keep building your career!"
        confirmText="Awesome"
        onConfirm={() => setShowSuccessModal(false)}
      />
    </View>
  );
}

const modalStyles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', alignItems: 'center', padding: 24 },
  card: { width: '100%', maxWidth: 360, backgroundColor: '#0F172A', borderRadius: 24, padding: 24, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  iconCircle: { width: 72, height: 72, borderRadius: 36, backgroundColor: 'rgba(59,130,246,0.12)', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  title: { fontSize: 18, fontWeight: '900', color: '#FFF', textAlign: 'center', marginBottom: 8 },
  message: { fontSize: 13, color: 'rgba(255,255,255,0.7)', textAlign: 'center', lineHeight: 18, marginBottom: 20 },
  btnRow: { gap: 10, width: '100%' },
  btn: { height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  yesBtn: { backgroundColor: '#10B981' },
  yesBtnText: { color: '#FFF', fontWeight: '800', fontSize: 14 },
  noBtn: { backgroundColor: 'rgba(255,255,255,0.06)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)' },
  noBtnText: { color: 'rgba(255,255,255,0.8)', fontWeight: '700', fontSize: 14 },
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1A1A1D' },
  loadingContainer: { flex: 1, backgroundColor: '#1A1A1D', justifyContent: 'center', alignItems: 'center' },
  errorText: { color: '#FFF', fontSize: 16, marginBottom: 16 },
  backBtnFallback: { padding: 12, backgroundColor: '#24252B', borderRadius: 8 },
  backBtnText: { color: '#FFF' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 56,
    paddingHorizontal: 12,
    paddingBottom: 16,
    backgroundColor: '#1A1A1D',
  },
  iconBtn: { padding: 8 },
  headerTitleContainer: { flex: 1, alignItems: 'center' },
  headerTitle: { fontSize: 16, fontWeight: '700', color: '#FFF' },
  headerSubtitle: { fontSize: 12, color: COLORS.textMuted, marginTop: 2 },
  headerActions: { flexDirection: 'row', alignItems: 'center' },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 120, paddingTop: 10 },
  companyBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#24252B',
    padding: 16,
    borderRadius: 16,
    marginBottom: 20,
  },
  companyLogoBox: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#FFF', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  companyLogoImg: { width: '100%', height: '100%', resizeMode: 'cover' },
  companyLogoText: { fontSize: 18, fontWeight: '900', color: '#1A1A1D' },
  companyBannerInfo: { flex: 1, marginLeft: 12 },
  companyName: { fontSize: 15, fontWeight: '700', color: '#FFF' },
  companyLocation: { fontSize: 13, color: COLORS.textMuted, marginTop: 2 },
  badgesRow: { flexDirection: 'row', gap: 10, flexWrap: 'wrap', marginBottom: 24 },
  badge: { backgroundColor: '#24252B', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  badgeText: { color: '#FFF', fontSize: 13, fontWeight: '500' },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#FFF', marginBottom: 12, marginTop: 8 },
  skillsRow: { flexDirection: 'row', gap: 10, flexWrap: 'wrap', marginBottom: 24 },
  skillBadge: { backgroundColor: '#24252B', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  skillText: { color: '#FFF', fontSize: 13, fontWeight: '500' },
  listContainer: { marginBottom: 24 },
  listItem: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 8, paddingRight: 10 },
  bullet: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#FFF', marginTop: 8, marginRight: 10 },
  listText: { fontSize: 14, color: 'rgba(255,255,255,0.85)', lineHeight: 22, flex: 1 },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#1A1A1D',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 32,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)'
  },
  salaryContainer: { flex: 1 },
  salaryAmount: { fontSize: 18, fontWeight: '800', color: '#FFF' },
  salarySub: { fontSize: 12, color: COLORS.textMuted, marginTop: 2 },
  applyBtn: { backgroundColor: COLORS.primary, paddingHorizontal: 32, paddingVertical: 14, borderRadius: 12 },
  applyBtnDisabled: { backgroundColor: '#4B5563' },
  applyBtnText: { color: '#FFF', fontSize: 15, fontWeight: '700' }
});

