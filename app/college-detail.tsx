import { SHADOWS, COLORS, FONT, RADIUS, SPACING } from '@/constants/theme';
import { supabase } from '@/lib/supabase';
import { Feather, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { OptimizedImage } from '@/components/ui/OptimizedImage';
import Animated, { FadeInDown, FadeInUp, SlideInRight } from 'react-native-reanimated';
import { useTheme } from '@/context/ThemeContext';

export default function CollegeDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { colors, isDark } = useTheme();
  
  const [college, setCollege] = useState<any>(null);
  const [courses, setCourses] = useState<any[]>([]);
  const [facilities, setFacilities] = useState<any[]>([]);
  const [placements, setPlacements] = useState<any[]>([]);
  const [gallery, setGallery] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) fetchCollegeDetails();
  }, [id]);

  const fetchCollegeDetails = async () => {
    try {
      // Fetch core details
      const { data: collegeData } = await supabase.from('colleges').select('*').eq('id', id).maybeSingle();
      setCollege(collegeData);

      // Fetch related data in parallel, safely handling table absence or empty records
      const [
        cRes,
        fRes,
        pRes,
        gRes
      ] = await Promise.all([
        supabase.from('college_courses').select('*').eq('college_id', id),
        supabase.from('college_facilities').select('*').eq('college_id', id),
        supabase.from('college_placements').select('*').eq('college_id', id).order('year', { ascending: false }),
        supabase.from('college_gallery').select('*').eq('college_id', id)
      ]);

      if (cRes && cRes.data) setCourses(cRes.data);
      if (fRes && fRes.data) setFacilities(fRes.data);
      if (pRes && pRes.data) setPlacements(pRes.data);
      if (gRes && gRes.data) setGallery(gRes.data);

    } catch (e: any) {
      console.warn("Failed to fetch college details:", e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: colors.background }]}>
        {isDark && <LinearGradient colors={COLORS.gradientHome} style={StyleSheet.absoluteFillObject} />}
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (!college) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: colors.background }]}>
        {isDark && <LinearGradient colors={COLORS.gradientHome} style={StyleSheet.absoluteFillObject} />}
        <Feather name="alert-circle" size={48} color={COLORS.textDisabled} />
        <Text style={[styles.errorText, { color: colors.textSecondary }]}>College not found.</Text>
        <TouchableOpacity style={styles.backBtnError} onPress={() => router.back()}>
          <Text style={{ color: '#fff', fontWeight: 'bold' }}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {isDark && <LinearGradient colors={COLORS.gradientHome} style={StyleSheet.absoluteFillObject} />}

      {/* Header Back Button */}
      <View style={[styles.topNav, { borderBottomColor: colors.border }]}>
        <TouchableOpacity style={[styles.backBtn, { backgroundColor: colors.inputBg }]} onPress={() => router.back()}>
          <Feather name="arrow-left" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Banner & Logo Section */}
        <Animated.View entering={FadeInDown.duration(600).springify()} style={styles.headerSection}>
          <View style={styles.bannerContainer}>
            {college.banner_url ? (
              <OptimizedImage source={college.banner_url} style={styles.bannerImage} contentFit="cover" />
            ) : (
              <LinearGradient colors={COLORS.gradientPrimary} style={styles.bannerImage} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} />
            )}
            
            <View style={[styles.logoBox, { backgroundColor: colors.card, borderColor: colors.background }]}>
              {college.logo_url ? (
                 <OptimizedImage source={college.logo_url} style={styles.logoImage} contentFit="cover" />
              ) : (
                 <Ionicons name="business" size={40} color="#fff" />
              )}
            </View>
          </View>
          
          <View style={{ marginTop: 60, alignItems: 'center' }}>
            <Text style={[styles.title, { color: colors.textPrimary }]}>{college.name}</Text>
            <View style={styles.locationRow}>
              <Feather name="map-pin" size={14} color={colors.textMuted} />
              <Text style={[styles.locationText, { color: colors.textSecondary }]}>{college.location}</Text>
            </View>
            
            <View style={styles.badgesRow}>
              <View style={styles.typeBadge}>
                <Text style={styles.typeText}>{college.type || 'Private'}</Text>
              </View>
              {college.established_year && (
                <View style={[styles.typeBadge, { backgroundColor: colors.card, borderColor: colors.border }]}>
                  <Text style={[styles.typeText, { color: colors.textSecondary }]}>Est. {college.established_year}</Text>
                </View>
              )}
              {college.ranking && (
                <View style={styles.rankBadge}>
                  <Text style={styles.rankText}>Rank #{college.ranking}</Text>
                </View>
              )}
            </View>
          </View>
        </Animated.View>

        {/* Action Row */}
        {college.website && (
          <Animated.View entering={FadeInUp.duration(600).delay(100)} style={styles.actionRow}>
            <TouchableOpacity style={styles.websiteBtn} onPress={() => Linking.openURL(college.website)}>
              <LinearGradient colors={COLORS.gradientPrimary} style={styles.websiteBtnInner} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                <Feather name="globe" size={18} color="#fff" />
                <Text style={styles.websiteText}>Visit Official Website</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        )}

        {/* Overview Section */}
        <Animated.View entering={FadeInUp.duration(600).delay(200)} style={[styles.sectionCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Overview</Text>
          <Text style={[styles.descText, { color: colors.textSecondary }]}>{college.description || 'No detailed description provided for this institution.'}</Text>
          
          <View style={[styles.statsGrid, { borderTopColor: colors.border }]}>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Annual Fee</Text>
              <Text style={[styles.statValue, { color: colors.textPrimary }]} numberOfLines={1}>{college.fee || 'N/A'}</Text>
            </View>
            <View style={[styles.dividerVertical, { backgroundColor: colors.border }]} />
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Placements</Text>
              <Text style={[styles.statValue, { color: COLORS.success }]} numberOfLines={1}>{college.placements || 'N/A'}</Text>
            </View>
          </View>
        </Animated.View>

        {/* Courses Section */}
        {courses.length > 0 && (
          <Animated.View entering={FadeInUp.duration(600).delay(300)} style={styles.sectionContainer}>
            <Text style={[styles.sectionTitleHeader, { color: colors.textPrimary }]}>Available Branches</Text>
            {courses.map((course, index) => (
              <Animated.View key={course.id} entering={SlideInRight.delay(index * 100).springify()}>
                <View style={[styles.courseItem, { backgroundColor: colors.card, borderColor: colors.border }]}>
                  <View style={styles.courseIconBox}>
                     <Feather name="book-open" size={18} color={COLORS.primary} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.courseName, { color: colors.textPrimary }]}>{course.course_name}</Text>
                    <Text style={[styles.courseDetails, { color: colors.textMuted }]}>Duration: {course.duration || '3 Years'}  •  Seats: {course.seats || 'N/A'}</Text>
                  </View>
                </View>
              </Animated.View>
            ))}
          </Animated.View>
        )}

        {/* Placements Section */}
        {placements.length > 0 && (
          <Animated.View entering={FadeInUp.duration(600).delay(400)} style={styles.sectionContainer}>
            <Text style={[styles.sectionTitleHeader, { color: colors.textPrimary }]}>Placement Highlights</Text>
            {placements.map((placement, index) => (
              <View key={placement.id} style={[styles.placementItem, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <View style={styles.placementIconBox}>
                   <Feather name="briefcase" size={18} color={COLORS.success} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.companyName, { color: colors.textPrimary }]}>{placement.company_name}</Text>
                  <Text style={[styles.placementYear, { color: colors.textMuted }]}>Batch: {placement.year || 'N/A'}</Text>
                </View>
                <View style={styles.packageBadge}>
                  <Text style={styles.packageText}>{placement.package}</Text>
                </View>
              </View>
            ))}
          </Animated.View>
        )}

        {/* Facilities Section */}
        {facilities.length > 0 && (
          <Animated.View entering={FadeInUp.duration(600).delay(500)} style={styles.sectionContainer}>
            <Text style={[styles.sectionTitleHeader, { color: colors.textPrimary }]}>Campus Facilities</Text>
            <View style={styles.facilitiesGrid}>
              {facilities.map(facility => (
                <View key={facility.id} style={[styles.facilityBadge, { backgroundColor: colors.card, borderColor: colors.border }]}>
                  <Feather name="check-circle" size={14} color={COLORS.primary} />
                  <Text style={[styles.facilityText, { color: colors.textSecondary }]}>{facility.facility_name}</Text>
                </View>
              ))}
            </View>
          </Animated.View>
        )}

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { fontSize: FONT.size.lg, color: COLORS.textMuted, marginTop: SPACING.md, marginBottom: SPACING.lg },
  backBtnError: { backgroundColor: COLORS.primary, paddingHorizontal: 24, paddingVertical: 12, borderRadius: RADIUS.full },
  topNav: { paddingTop: 60, paddingHorizontal: SPACING.md, paddingBottom: 10, zIndex: 10, position: 'absolute', top: 0, left: 0, right: 0 },
  backBtn: { width: 44, height: 44, borderRadius: RADIUS.full, backgroundColor: 'rgba(15, 23, 42, 0.7)', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: COLORS.border, ...SHADOWS.small },
  scrollContent: { paddingBottom: 100 },
  headerSection: { alignItems: 'center', marginBottom: SPACING.xl, position: 'relative' },
  bannerContainer: { width: '100%', height: 200, position: 'relative', alignItems: 'center' },
  bannerImage: { width: '100%', height: '100%' },
  logoBox: { 
    width: 100, 
    height: 100, 
    borderRadius: RADIUS.lg, 
    backgroundColor: COLORS.surface, 
    alignItems: 'center', 
    justifyContent: 'center', 
    position: 'absolute', 
    bottom: -50, 
    borderWidth: 4, 
    borderColor: COLORS.background, 
    ...SHADOWS.medium,
    overflow: 'hidden'
  },
  logoImage: { width: '100%', height: '100%' },
  title: { fontSize: FONT.size.display, fontWeight: FONT.weight.extrabold, color: COLORS.textPrimary, textAlign: 'center', marginBottom: 4, paddingHorizontal: SPACING.md },
  locationRow: { flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.md },
  locationText: { fontSize: FONT.size.md, color: COLORS.textMuted, marginLeft: 6, fontWeight: FONT.weight.medium },
  badgesRow: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm, justifyContent: 'center', paddingHorizontal: SPACING.md },
  typeBadge: { backgroundColor: COLORS.primaryLight, paddingHorizontal: SPACING.sm, paddingVertical: 4, borderRadius: RADIUS.md, borderWidth: 1, borderColor: 'rgba(79,70,229,0.3)' },
  typeText: { color: COLORS.primary, fontWeight: FONT.weight.bold, fontSize: FONT.size.sm },
  rankBadge: { backgroundColor: 'rgba(249, 115, 22, 0.15)', paddingHorizontal: SPACING.sm, paddingVertical: 4, borderRadius: RADIUS.md, borderWidth: 1, borderColor: 'rgba(249, 115, 22, 0.3)' },
  rankText: { color: COLORS.warning, fontWeight: FONT.weight.bold, fontSize: FONT.size.sm },
  actionRow: { marginBottom: SPACING.xl, paddingHorizontal: SPACING.md },
  websiteBtn: { borderRadius: RADIUS.xl, ...SHADOWS.medium },
  websiteBtnInner: { flexDirection: 'row', height: 56, borderRadius: RADIUS.xl, justifyContent: 'center', alignItems: 'center', gap: 8 },
  websiteText: { color: '#fff', fontSize: FONT.size.md, fontWeight: FONT.weight.bold },
  sectionCard: { marginHorizontal: SPACING.md, backgroundColor: COLORS.card, padding: SPACING.lg, borderRadius: RADIUS.xxl, borderWidth: 1, borderColor: COLORS.border, ...SHADOWS.small, marginBottom: SPACING.xl },
  sectionTitle: { fontSize: FONT.size.lg, fontWeight: FONT.weight.extrabold, color: COLORS.textPrimary, marginBottom: SPACING.sm },
  descText: { fontSize: FONT.size.md, lineHeight: 24, color: COLORS.textSecondary, marginBottom: SPACING.lg },
  statsGrid: { flexDirection: 'row', alignItems: 'center', borderTopWidth: 1, borderTopColor: COLORS.border, paddingTop: SPACING.md },
  statBox: { flex: 1 },
  statLabel: { fontSize: 11, color: COLORS.textMuted, textTransform: 'uppercase', fontWeight: FONT.weight.bold, marginBottom: 4 },
  statValue: { fontSize: FONT.size.xl, fontWeight: FONT.weight.bold, color: COLORS.textPrimary },
  dividerVertical: { width: 1, height: 40, backgroundColor: COLORS.border, marginHorizontal: SPACING.md },
  sectionContainer: { marginHorizontal: SPACING.md, marginBottom: SPACING.xl },
  sectionTitleHeader: { fontSize: FONT.size.xl, fontWeight: FONT.weight.extrabold, color: COLORS.textPrimary, marginBottom: SPACING.md },
  courseItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.card, padding: SPACING.md, borderRadius: RADIUS.xl, marginBottom: SPACING.sm, borderWidth: 1, borderColor: COLORS.border },
  courseIconBox: { width: 44, height: 44, borderRadius: RADIUS.md, backgroundColor: COLORS.primaryLight, alignItems: 'center', justifyContent: 'center', marginRight: SPACING.md },
  courseName: { fontSize: FONT.size.md, fontWeight: FONT.weight.bold, color: COLORS.textPrimary, marginBottom: 4 },
  courseDetails: { fontSize: FONT.size.sm, color: COLORS.textMuted, fontWeight: FONT.weight.medium },
  placementItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.card, padding: SPACING.md, borderRadius: RADIUS.xl, marginBottom: SPACING.sm, borderWidth: 1, borderColor: COLORS.border },
  placementIconBox: { width: 44, height: 44, borderRadius: RADIUS.md, backgroundColor: COLORS.successLight, alignItems: 'center', justifyContent: 'center', marginRight: SPACING.md },
  companyName: { fontSize: FONT.size.md, fontWeight: FONT.weight.bold, color: COLORS.textPrimary, marginBottom: 4 },
  placementYear: { fontSize: FONT.size.xs, color: COLORS.textMuted, fontWeight: FONT.weight.semibold },
  packageBadge: { backgroundColor: COLORS.successLight, paddingHorizontal: 10, paddingVertical: 6, borderRadius: RADIUS.md, borderWidth: 1, borderColor: 'rgba(34,197,94,0.3)' },
  packageText: { color: COLORS.success, fontWeight: FONT.weight.bold, fontSize: FONT.size.sm },
  facilitiesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  facilityBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.card, paddingHorizontal: SPACING.md, paddingVertical: 10, borderRadius: RADIUS.full, borderWidth: 1, borderColor: COLORS.border, gap: 8 },
  facilityText: { color: COLORS.textSecondary, fontSize: FONT.size.sm, fontWeight: FONT.weight.semibold },
});
