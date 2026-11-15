import { ScrollView, StyleSheet, Text, View, Image, Dimensions, TouchableOpacity, Linking, Platform } from 'react-native';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { SkeletonLoader } from '@/components/ui/Loaders';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { safeBack } from '@/utils/navigation';
import React, { useEffect, useState } from 'react';
import { COLORS, FONT, RADIUS, SHADOWS, SPACING } from '@/constants/theme';
import { getCollegeById } from '@/services/supabaseService';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/context/ThemeContext';
import Animated, { FadeIn, FadeInDown, FadeInUp, Layout } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

const InfoPill = ({ icon, label, value, colors }) => (
  <View style={[styles.infoPill, { backgroundColor: colors.card, borderColor: colors.border }]}>
    <MaterialCommunityIcons name={icon} size={18} color="#3B82F6" />
    <View style={{ marginLeft: 8 }}>
      <Text style={[styles.pillLabel, { color: colors.textMuted }]}>{label}</Text>
      <Text style={[styles.pillValue, { color: colors.textPrimary }]}>{value}</Text>
    </View>
  </View>
);

export default function CollegeDetailScreen() {
  const { id } = useLocalSearchParams();
  const [college, setCollege] = useState(null);
  const [activeTab, setActiveTab] = useState('Overview');
  const router = useRouter();
  const { colors, isDark } = useTheme();

  useEffect(() => {
    if (!id) return;
    (async () => {
      const data = await getCollegeById(String(id));
      setCollege(data);
    })();
  }, [id]);

  if (!college) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, padding: 24, paddingTop: 60 }}>
        <SkeletonLoader height={200} borderRadius={24} style={{ marginBottom: 24 }} />
        <SkeletonLoader width="80%" height={24} borderRadius={6} style={{ marginBottom: 16 }} />
        <SkeletonLoader width="50%" height={16} borderRadius={4} style={{ marginBottom: 32 }} />
        <SkeletonLoader height={60} borderRadius={16} style={{ marginBottom: 16 }} />
        <SkeletonLoader height={140} borderRadius={16} />
      </View>
    );
  }

  const tabs = ['Overview', 'Courses', 'Gallery', 'Placement', 'Review'];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {isDark && <LinearGradient colors={['#0F172A', '#1E293B']} style={StyleSheet.absoluteFill} />}
      
      <Animated.ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Banner Section */}
        <View style={styles.bannerContainer}>
          <Image 
            source={{ uri: college.banner_url || 'https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=2000&auto=format&fit=crop' }} 
            style={styles.banner} 
          />
          <LinearGradient colors={['transparent', isDark ? 'rgba(15, 23, 42, 0.9)' : 'rgba(255, 255, 255, 0.9)']} style={styles.bannerOverlay} />
          
          <TouchableOpacity style={styles.backBtn} onPress={() => safeBack('/(tabs)/college')}>
            <BlurView intensity={20} tint={isDark ? "dark" : "light"} style={styles.iconCircle}>
              <Feather name="chevron-left" size={24} color={colors.textPrimary} />
            </BlurView>
          </TouchableOpacity>

          <View style={styles.collegeInfo}>
             <View style={styles.rankPill}>
                <Text style={styles.rankText}>#{college.ranking || '1'} in Technical</Text>
             </View>
             <Text style={[styles.name, { color: colors.textPrimary }]}>{college.name}</Text>
             <View style={styles.locationRow}>
                <Feather name="map-pin" size={14} color="#3B82F6" />
                <Text style={[styles.locationText, { color: colors.textSecondary }]}>{college.location}</Text>
             </View>
          </View>
        </View>

        {/* Tab Navigation (College Dunia Style) */}
        <View style={[styles.tabSection, { borderColor: colors.border }]}>
           <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabList}>
              {tabs.map(tab => (
                <TouchableOpacity key={tab} onPress={() => setActiveTab(tab)} style={styles.tabItem}>
                   <Text style={[styles.tabText, { color: colors.textMuted }, activeTab === tab && styles.tabTextActive]}>{tab}</Text>
                   {activeTab === tab && <Animated.View layout={Layout.springify()} style={styles.tabLine} />}
                </TouchableOpacity>
              ))}
           </ScrollView>
        </View>

        <View style={styles.content}>
           {activeTab === 'Overview' && (
             <Animated.View entering={FadeInDown}>
                <View style={styles.statsRow}>
                   <InfoPill icon="currency-inr" label="Avg Fee" value={college.fee || '₹3.5K'} colors={colors} />
                   <InfoPill icon="school-outline" label="Type" value={college.type || 'Govt'} colors={colors} />
                   <InfoPill icon="star-outline" label="Rating" value={college.rating || '4.5'} colors={colors} />
                </View>

                <View style={styles.section}>
                   <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>About Institution</Text>
                   <Text style={[styles.sectionDesc, { color: colors.textSecondary }]}>
                      {college.description || `Established with a vision for technical excellence, ${college.name} provides state-of-the-art labs and industry-aligned curriculum for polytechnic and engineering aspirants.`}
                   </Text>
                </View>

                <View style={styles.section}>
                   <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Key Highlights</Text>
                   <View style={styles.highlightsGrid}>
                      {['Practical Training', 'Industry Experts', 'Campus Placements', 'Sports Complex'].map(h => (
                        <View key={h} style={styles.highlightItem}>
                           <Ionicons name="checkmark-circle" size={16} color="#10B981" />
                           <Text style={[styles.highlightText, { color: colors.textSecondary }]}>{h}</Text>
                        </View>
                      ))}
                   </View>
                </View>
             </Animated.View>
           )}

           {activeTab === 'Placement' && (
             <Animated.View entering={FadeInDown} style={styles.section}>
                <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Placement Statistics</Text>
                <View style={[styles.placementBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
                   <View style={styles.placementStat}>
                      <Text style={styles.statLarge}>{college.placements || '85%'}</Text>
                      <Text style={[styles.statSmall, { color: colors.textMuted }]}>Overall Placement</Text>
                   </View>
                   <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
                   <View style={styles.placementStat}>
                      <Text style={styles.statLarge}>₹4.5 LPA</Text>
                      <Text style={[styles.statSmall, { color: colors.textMuted }]}>Average Package</Text>
                   </View>
                </View>
                <Text style={[styles.sectionDesc, { color: colors.textSecondary }]}>Top Recruiters: Tata Motors, L&T, Infosys, and more.</Text>
             </Animated.View>
           )}
        </View>

        <View style={styles.actions}>
           <TouchableOpacity style={styles.applyBtn} onPress={() => college.brochure_url && Linking.openURL(college.brochure_url)}>
              <LinearGradient colors={['#3B82F6', '#2563EB']} style={styles.btnGradient}>
                 <Feather name="download" size={18} color="#FFF" />
                 <Text style={styles.btnText}>Download Brochure</Text>
              </LinearGradient>
           </TouchableOpacity>
           
           <TouchableOpacity style={styles.visitBtn} onPress={() => college.website && Linking.openURL(college.website)}>
              <Text style={styles.visitText}>Visit Official Site</Text>
           </TouchableOpacity>
        </View>
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A' },
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  scroll: { paddingBottom: 60 },
  bannerContainer: { height: 320, width: '100%' },
  banner: { ...StyleSheet.absoluteFill },
  bannerOverlay: { ...StyleSheet.absoluteFill },
  backBtn: { position: 'absolute', top: 60, left: 24, zIndex: 10 },
  iconCircle: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  collegeInfo: { position: 'absolute', bottom: 30, left: 24, right: 24 },
  rankPill: { backgroundColor: '#F59E0B', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, alignSelf: 'flex-start', marginBottom: 12 },
  rankText: { color: '#FFF', fontSize: 10, fontWeight: '900', textTransform: 'uppercase' },
  name: { fontSize: 28, fontWeight: '900', color: '#FFF' },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8 },
  locationText: { color: 'rgba(255,255,255,0.6)', fontSize: 14, fontWeight: '600' },
  tabSection: { marginTop: 20, borderBottomWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  tabList: { paddingHorizontal: 24, gap: 24 },
  tabItem: { paddingBottom: 16, alignItems: 'center' },
  tabText: { fontSize: 14, fontWeight: '700', color: 'rgba(255,255,255,0.4)' },
  tabTextActive: { color: '#3B82F6' },
  tabLine: { position: 'absolute', bottom: 0, width: '100%', height: 3, backgroundColor: '#3B82F6', borderRadius: 2 },
  content: { padding: 24 },
  statsRow: { flexDirection: 'row', gap: 12, marginBottom: 32 },
  infoPill: { flex: 1, backgroundColor: 'rgba(255,255,255,0.03)', padding: 12, borderRadius: 16, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  pillLabel: { fontSize: 8, color: 'rgba(255,255,255,0.4)', fontWeight: '700', textTransform: 'uppercase' },
  pillValue: { fontSize: 13, fontWeight: '800', color: '#FFF' },
  section: { marginBottom: 32 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#FFF', marginBottom: 12 },
  sectionDesc: { fontSize: 15, color: 'rgba(255,255,255,0.5)', lineHeight: 24 },
  highlightsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16, marginTop: 8 },
  highlightItem: { flexDirection: 'row', alignItems: 'center', gap: 8, width: (width - 64) / 2 },
  highlightText: { fontSize: 13, color: 'rgba(255,255,255,0.7)', fontWeight: '600' },
  placementBox: { flexDirection: 'row', backgroundColor: 'rgba(16, 185, 129, 0.05)', borderRadius: 20, padding: 20, gap: 20, marginBottom: 16, borderWidth: 1, borderColor: 'rgba(16, 185, 129, 0.1)' },
  placementStat: { flex: 1, alignItems: 'center' },
  statLarge: { fontSize: 24, fontWeight: '900', color: '#10B981' },
  statSmall: { fontSize: 10, color: 'rgba(255,255,255,0.4)', fontWeight: '700', marginTop: 4 },
  statDivider: { width: 1, height: '100%', backgroundColor: 'rgba(255,255,255,0.1)' },
  actions: { paddingHorizontal: 24, gap: 12 },
  applyBtn: { height: 56, borderRadius: 20, overflow: 'hidden' },
  btnGradient: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
  btnText: { color: '#FFF', fontWeight: '800', fontSize: 16 },
  visitBtn: { height: 56, alignItems: 'center', justifyContent: 'center' },
  visitText: { color: '#3B82F6', fontWeight: '700', fontSize: 14 }
});
