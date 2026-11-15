import { supabase } from '@/lib/supabase';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { safeBack } from '@/utils/navigation';
import React, { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, Text, TextInput, TouchableOpacity, View, ScrollView } from 'react-native';
import { SkeletonLoader } from '@/components/ui/Loaders';
import Animated, { FadeInDown, Layout, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SHADOWS, SPACING, RADIUS } from '@/constants/theme';
import { OptimizedImage } from '@/components/ui/OptimizedImage';
import { FlashList } from '@shopify/flash-list';
import { useSupabaseList } from '@/hooks/useQueries';
import { useTheme } from '@/context/ThemeContext';

const { width } = Dimensions.get('window');
const FILTERS = ['All', 'Government', 'Private', 'University', 'Autonomous'];

const CollegeCard = React.memo(function CollegeCard({ item, index, router }) {
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <Animated.View entering={FadeInDown.delay(index * 100).springify()} layout={Layout.springify()}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => router.push(`/college-detail?id=${item.id}`)}
        onPressIn={() => { scale.value = withSpring(0.98); }}
        onPressOut={() => { scale.value = withSpring(1); }}
      >
        <Animated.View style={[styles.collegeCard, animStyle]}>
          <OptimizedImage
            source={item.banner_url || 'https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=2000&auto=format&fit=crop'}
            style={styles.cardBanner}
            contentFit="cover"
          />
          <LinearGradient colors={['transparent', 'rgba(0,0,0,0.9)']} style={styles.cardOverlay} />
          
          <View style={styles.cardContent}>
            <View style={styles.cardTop}>
               <View style={styles.rankBadge}>
                  <Text style={styles.rankText}>RANK #{item.ranking || 'N/A'}</Text>
               </View>
               <TouchableOpacity style={styles.favBtn}>
                  <Feather name="heart" size={18} color="#FFF" />
               </TouchableOpacity>
            </View>

            <View style={styles.cardBottom}>
               <Text style={styles.collegeName}>{item.college_name || item.name}</Text>
               <View style={styles.locationRow}>
                  <Feather name="map-pin" size={12} color={COLORS.primary} />
                  <Text style={styles.locationText}>{item.location}</Text>
               </View>

               <View style={styles.statsGrid}>
                  <View style={styles.statItem}>
                     <MaterialCommunityIcons name="currency-inr" size={14} color="rgba(255,255,255,0.6)" />
                     <Text style={styles.statText}>{item.fee || '₹35k'}/yr</Text>
                  </View>
                  <View style={styles.statItem}>
                     <MaterialCommunityIcons name="office-building" size={14} color="rgba(255,255,255,0.6)" />
                     <Text style={styles.statText}>{item.type}</Text>
                  </View>
                  <View style={styles.statItem}>
                     <MaterialCommunityIcons name="star" size={14} color="#F59E0B" />
                     <Text style={styles.statText}>4.8</Text>
                  </View>
               </View>
            </View>
          </View>
        </Animated.View>
      </TouchableOpacity>
    </Animated.View>
  );
});

export default function CollegesScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState(['All']);

  const toggleFilter = (filter) => {
    if (filter === 'All') {
      setSelectedFilters(['All']);
      return;
    }


    let updated = selectedFilters.filter(f => f !== 'All');
    if (updated.includes(filter)) {
      updated = updated.filter(f => f !== filter);
    } else {
      updated.push(filter);
    }

    if (updated.length === 0) {
      setSelectedFilters(['All']);
    } else {
      setSelectedFilters(updated);
    }
  };

  const { data: colleges, isLoading: loading } = useSupabaseList('colleges', '*', {
    order: { column: 'ranking', ascending: true }
  });

  const filteredColleges = (colleges || []).filter(c => {
    const term = searchQuery.toLowerCase().trim();
    const cType = (c.type || '').toLowerCase();
    
    // Multi-filter matching
    const typeMatch = selectedFilters.includes('All') || selectedFilters.some(f => {
      const fl = f.toLowerCase();
      if (fl === 'government' || fl === 'govt') return cType.includes('govt') || cType.includes('government');
      return cType.includes(fl);
    });

    if (!term) return typeMatch;

    const nameMatch = (c.college_name || c.name || '').toLowerCase();
    const codeMatch = (c.college_code || '').toLowerCase();
    const locMatch = (c.location || '').toLowerCase();
    const descMatch = (c.description || '').toLowerCase();
    const principalMatch = (c.principal_name || '').toLowerCase();

    const searchMatch = nameMatch.includes(term) ||
      codeMatch.includes(term) ||
      locMatch.includes(term) ||
      cType.includes(term) ||
      descMatch.includes(term) ||
      principalMatch.includes(term);

    return searchMatch && typeMatch;
  });

  const { colors, isDark } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {isDark && <LinearGradient colors={COLORS.gradientHome} style={StyleSheet.absoluteFill} />}
      
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <View style={styles.headerTop}>
           <TouchableOpacity onPress={() => safeBack('/(tabs)')} style={[styles.backBtn, { backgroundColor: colors.inputBg, borderColor: colors.border }]}>
              <Feather name="arrow-left" size={24} color={colors.textPrimary} />
           </TouchableOpacity>
           <Text style={[styles.title, { color: colors.textPrimary }]}>Institutions</Text>
           <View style={{ width: 44 }} />
        </View>
        
        <View style={[styles.searchBox, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
           <Feather name="search" size={20} color={colors.textMuted} />
           <TextInput
             style={[styles.searchInput, { color: colors.textPrimary }]}
             placeholder="Search by college name, code, location..."
             placeholderTextColor={colors.inputPlaceholder}
             value={searchQuery}
             onChangeText={setSearchQuery}
           />
           {searchQuery.trim() !== '' && (
             <TouchableOpacity onPress={() => setSearchQuery('')}>
               <Feather name="x" size={18} color={colors.textMuted} />
             </TouchableOpacity>
           )}
        </View>

        {/* Filter Chips Bar */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 14 }}>
          {FILTERS.map((f) => {
            const active = selectedFilters.includes(f);
            return (
              <TouchableOpacity
                key={f}
                style={[
                  styles.chip, 
                  { backgroundColor: colors.card, borderColor: colors.cardBorder },
                  active && styles.chipActive
                ]}
                onPress={() => toggleFilter(f)}
              >
                <Text style={[
                  styles.chipText, 
                  { color: colors.textSecondary },
                  active && styles.chipTextActive
                ]}>{f}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>


      {loading ? (
        <View style={{ paddingHorizontal: 20 }}>
          <SkeletonLoader height={240} style={{ marginBottom: 16 }} borderRadius={20} />
          <SkeletonLoader height={240} borderRadius={20} />
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          <FlashList
            data={filteredColleges}
            keyExtractor={item => item?.id?.toString() || Math.random().toString()}
            estimatedItemSize={260}
            renderItem={({ item, index }) => <CollegeCard item={item} index={index} router={router} />}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.empty}>
                 <MaterialCommunityIcons name="school-off-outline" size={64} color={COLORS.textDisabled} />
                 <Text style={styles.emptyText}>Details not found</Text>
              </View>
            }
          />
        </View>
      )}
    </View>
  );
}

import { rf, rs } from '@/constants/responsive';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { paddingTop: rs(54), paddingHorizontal: rs(20), paddingBottom: rs(16) },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: rs(16) },
  backBtn: { width: rs(44), height: rs(44), borderRadius: rs(12), backgroundColor: 'rgba(255,255,255,0.05)', alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: rf(24), fontWeight: '900', color: '#FFF' },
  searchBox: { minHeight: rs(50), backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: rs(16), flexDirection: 'row', alignItems: 'center', paddingHorizontal: rs(16), borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  searchInput: { flex: 1, marginLeft: rs(12), color: '#FFF', fontSize: rf(14) },
  filterBar: { marginBottom: rs(16) },
  chip: { paddingHorizontal: rs(18), paddingVertical: rs(8), borderRadius: rs(12), backgroundColor: 'rgba(255,255,255,0.02)', marginRight: rs(8), borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  chipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  chipText: { color: COLORS.textMuted, fontWeight: '800', fontSize: rf(12) },
  chipTextActive: { color: '#FFF' },
  list: { padding: rs(20), paddingBottom: rs(100) },
  collegeCard: { minHeight: rs(250), borderRadius: rs(24), overflow: 'hidden', marginBottom: rs(18), backgroundColor: COLORS.card, ...SHADOWS.medium },
  cardBanner: { width: '100%', height: '100%', position: 'absolute' },
  cardOverlay: { ...StyleSheet.absoluteFill },
  cardContent: { flex: 1, padding: rs(18), justifyContent: 'space-between' },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  rankBadge: { backgroundColor: 'rgba(0,0,0,0.4)', paddingHorizontal: rs(10), paddingVertical: rs(4), borderRadius: rs(8) },
  rankText: { color: '#FFF', fontSize: rf(10), fontWeight: '900' },
  favBtn: { width: rs(36), height: rs(36), borderRadius: rs(18), backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' },
  collegeName: { fontSize: rf(20), fontWeight: '900', color: '#FFF', marginBottom: rs(4) },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: rs(6), marginBottom: rs(14) },
  locationText: { color: 'rgba(255,255,255,0.6)', fontSize: rf(12), fontWeight: '600' },
  statsGrid: { flexDirection: 'row', gap: rs(12), flexWrap: 'wrap' },
  statItem: { flexDirection: 'row', alignItems: 'center', gap: rs(4), backgroundColor: 'rgba(255,255,255,0.05)', paddingHorizontal: rs(8), paddingVertical: rs(4), borderRadius: rs(6) },
  statText: { color: '#FFF', fontSize: rf(11), fontWeight: '800' },
  empty: { alignItems: 'center', marginTop: rs(80), gap: rs(16) },
  emptyText: { color: COLORS.textMuted, fontSize: rf(15), fontWeight: '700' }
});
