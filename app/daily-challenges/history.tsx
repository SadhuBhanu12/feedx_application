import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import GlassCard from '@/components/ui/GlassCard';
import { useUser } from '@/context/UserContext';
import { useTheme } from '@/context/ThemeContext';
import { supabase } from '@/lib/supabase';

export default function ChallengeHistoryScreen() {
  const router = useRouter();
  const { user } = useUser();
  const { colors, isDark } = useTheme();

  const [attempts, setAttempts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'All' | 'Completed' | 'Failed'>('All');

  useEffect(() => {
    loadHistory();
  }, [user?.id]);

  const loadHistory = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('challenge_attempts')
        .select('*, daily_challenges(title, category, difficulty)')
        .order('created_at', { ascending: false });

      if (user?.id) {
        query = query.eq('student_id', user.id);
      }

      const { data, error } = await query;
      if (!error && data) {
        setAttempts(data);
      }
    } catch (e) {
      console.warn('Load history exception:', e);
    } finally {
      setLoading(false);
    }
  };

  const filteredAttempts = attempts.filter((a) => {
    if (filter === 'All') return true;
    if (filter === 'Completed') return a.is_correct;
    if (filter === 'Failed') return !a.is_correct;
    return true;
  });

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {isDark && <LinearGradient colors={['#0F172A', '#020617']} style={StyleSheet.absoluteFillObject} />}

      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.cardBorder }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Challenge History</Text>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterRow}>
        {(['All', 'Completed', 'Failed'] as const).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.filterTab, filter === tab && { backgroundColor: '#3B82F6', borderColor: '#3B82F6' }]}
            onPress={() => setFilter(tab)}
          >
            <Text style={[styles.filterTabText, filter === tab && { color: '#FFF' }]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {loading ? (
          <ActivityIndicator size="large" color="#3B82F6" style={{ marginVertical: 30 }} />
        ) : filteredAttempts.length === 0 ? (
          <GlassCard style={styles.emptyBox}>
            <Ionicons name="document-text-outline" size={32} color={colors.textMuted} />
            <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>Your challenge journey starts here.</Text>
            <Text style={[styles.emptySub, { color: colors.textMuted }]}>Complete your first daily challenge to view attempt history.</Text>
          </GlassCard>
        ) : (
          filteredAttempts.map((item) => (
            <View key={item.id} style={[styles.itemCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
              <View style={styles.itemLeft}>
                <View style={[styles.statusIconBox, { backgroundColor: item.is_correct ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)' }]}>
                  <Ionicons name={item.is_correct ? 'checkmark' : 'close'} size={18} color={item.is_correct ? '#10B981' : '#EF4444'} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.itemTitle, { color: colors.textPrimary }]}>{item.daily_challenges?.title || 'Daily Challenge'}</Text>
                  <Text style={[styles.itemSub, { color: colors.textMuted }]}>
                    {item.daily_challenges?.category || 'General'} • {new Date(item.created_at).toLocaleDateString()}
                  </Text>
                </View>
              </View>

              <View style={{ alignItems: 'flex-end' }}>
                <Text style={[styles.itemXp, { color: item.is_correct ? '#10B981' : '#EF4444' }]}>
                  {item.is_correct ? `+${item.xp_earned} XP` : '0 XP'}
                </Text>
                <Text style={[styles.itemScore, { color: colors.textMuted }]}>{item.score}%</Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A' },
  header: { paddingTop: 54, paddingHorizontal: 20, paddingBottom: 14, flexDirection: 'row', alignItems: 'center', gap: 12, borderBottomWidth: 1 },
  backBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.06)', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 16, fontWeight: '900' },
  filterRow: { flexDirection: 'row', gap: 8, paddingHorizontal: 16, marginVertical: 12 },
  filterTab: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  filterTabText: { fontSize: 11, fontWeight: '800', color: '#94A3B8' },
  scrollContent: { padding: 16, paddingBottom: 100, gap: 10 },
  emptyBox: { padding: 24, alignItems: 'center', justifyContent: 'center' },
  emptyTitle: { fontSize: 14, fontWeight: '900', marginTop: 10 },
  emptySub: { fontSize: 11, textAlign: 'center', marginTop: 4 },
  itemCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 14, borderRadius: 16, borderWidth: 1 },
  itemLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  statusIconBox: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  itemTitle: { fontSize: 13, fontWeight: '800' },
  itemSub: { fontSize: 10, fontWeight: '600', marginTop: 2 },
  itemXp: { fontSize: 12, fontWeight: '900' },
  itemScore: { fontSize: 10, fontWeight: '700', marginTop: 2 },
});
