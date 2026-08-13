import { useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View, ActivityIndicator, Linking } from 'react-native';
import { COLORS, FONT, RADIUS, SHADOWS, SPACING } from '@/constants/theme';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { adminDeleteOpportunity, adminListOpportunities, adminUpsertOpportunity } from '@/services/supabaseService';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import Animated, { FadeInDown, FadeInRight, Layout } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { useUser } from '@/context/UserContext';

interface OpportunityItem {
  id: string;
  title: string;
  company: string;
  type: string;
  stipend: string;
  deadline: string;
  eligible_branches: string;
  apply_link: string;
  description: string;
}

export default function PlacementHub() {
  const router = useRouter();
  const { user } = useUser();
  const [items, setItems] = useState<OpportunityItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [form, setForm] = useState({ 
    id: '', title: '', company: '', type: 'Full-time', 
    stipend: '', deadline: '', 
    eligible_branches: 'All', 
    apply_link: '', description: ''
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await adminListOpportunities(user?.college_id);
      setItems((data as any) || []);
    } catch (e: any) {
      console.log('Placement Sync Error', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // Real-time Corporate Sync
    const channel = supabase.channel('placement-sync-rt')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'opportunities' }, loadData)
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [user?.college_id]);

  const handleSave = async () => {
    if (!form.title.trim() || !form.company.trim()) {
      Alert.alert('Incomplete Draft', 'Position and Company are mandatory for placement sync.');
      return;
    }
    setSyncing(true);
    try {
      await adminUpsertOpportunity({
        id: form.id || undefined,
        title: form.title.trim(),
        company: form.company.trim(),
        type: form.type.trim(),
        stipend: form.stipend.trim(),
        deadline: form.deadline || null,
        eligible_branches: [form.eligible_branches],
        apply_link: form.apply_link.trim() || null,
        description: form.description.trim(),
        college_id: user?.college_id || null,
      });
      Alert.alert('Corporate Sync Success', 'Career opportunity successfully published to student feed.');
      setForm({ id: '', title: '', company: '', type: 'Full-time', stipend: '', deadline: '', eligible_branches: 'All', apply_link: '', description: '' });
      loadData();
    } catch (e: any) {
      Alert.alert('Sync Failed', e.message);
    } finally {
      setSyncing(false);
    }
  };

  const setFromRow = (row: OpportunityItem) => {
    setForm({
      id: row.id,
      title: row.title || '',
      company: row.company || '',
      type: row.type || 'Full-time',
      stipend: row.stipend || '',
      deadline: row.deadline || '',
      eligible_branches: Array.isArray(row.eligible_branches) ? row.eligible_branches[0] : 'All',
      apply_link: row.apply_link || '',
      description: row.description || ''
    });
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#0F172A', '#020617']} style={StyleSheet.absoluteFillObject} />
      
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
           <Feather name="arrow-left" size={22} color="#FFF" />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
           <Text style={styles.headerTitle}>Placement Cell</Text>
           <View style={styles.statusRow}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>CORPORATE GRID ENCRYPTED</Text>
           </View>
        </View>
        <View style={styles.logoBox}>
           <MaterialCommunityIcons name="briefcase-check" size={26} color="#EC4899" />
        </View>
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        refreshing={loading}
        onRefresh={loadData}
        ListHeaderComponent={
          <Animated.View entering={FadeInDown} style={styles.formSection}>
            <BlurView intensity={15} tint="light" style={styles.composerCard}>
              <View style={styles.composerHeader}>
                 <Text style={styles.composerLabel}>OPPORTUNITY COMPOSER</Text>
                 <View style={styles.composerLine} />
              </View>
              
              <View style={styles.inputGrid}>
                <View style={[styles.field, { flex: 2 }]}>
                  <Text style={styles.label}>Position Title</Text>
                  <TextInput 
                    style={styles.input} 
                    value={form.title} 
                    onChangeText={t => setForm(f => ({ ...f, title: t }))} 
                    placeholder="E.g. SDE-1" 
                    placeholderTextColor="rgba(255,255,255,0.2)" 
                  />
                </View>
                <View style={[styles.field, { flex: 1 }]}>
                  <Text style={styles.label}>Type</Text>
                  <TextInput 
                    style={styles.input} 
                    value={form.type} 
                    onChangeText={t => setForm(f => ({ ...f, type: t }))} 
                    placeholder="Full-time" 
                    placeholderTextColor="rgba(255,255,255,0.2)" 
                  />
                </View>
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>Company & Remuneration</Text>
                <View style={styles.inputGrid}>
                   <TextInput 
                    style={[styles.input, { flex: 1 }]} 
                    value={form.company} 
                    onChangeText={t => setForm(f => ({ ...f, company: t }))} 
                    placeholder="Company Name" 
                    placeholderTextColor="rgba(255,255,255,0.2)" 
                  />
                  <TextInput 
                    style={[styles.input, { flex: 1 }]} 
                    value={form.stipend} 
                    onChangeText={t => setForm(f => ({ ...f, stipend: t }))} 
                    placeholder="Salary / Stipend" 
                    placeholderTextColor="rgba(255,255,255,0.2)" 
                  />
                </View>
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>Detailed Description</Text>
                <TextInput 
                  style={[styles.input, styles.areaInput]} 
                  value={form.description} 
                  onChangeText={t => setForm(f => ({ ...f, description: t }))} 
                  placeholder="Responsibilities & Eligibility..." 
                  placeholderTextColor="rgba(255,255,255,0.2)" 
                  multiline 
                />
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>Application Link (URL)</Text>
                <TextInput 
                  style={styles.input} 
                  value={form.apply_link} 
                  onChangeText={t => setForm(f => ({ ...f, apply_link: t }))} 
                  placeholder="https://career.link" 
                  placeholderTextColor="rgba(255,255,255,0.2)" 
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>Valid Till / Deadline (YYYY-MM-DD)</Text>
                <TextInput 
                  style={styles.input} 
                  value={form.deadline} 
                  onChangeText={t => setForm(f => ({ ...f, deadline: t }))} 
                  placeholder="YYYY-MM-DD (e.g. 2026-08-31)" 
                  placeholderTextColor="rgba(255,255,255,0.2)" 
                  autoCapitalize="none"
                />
              </View>

              <TouchableOpacity style={styles.primaryButton} onPress={handleSave} disabled={syncing}>
                <LinearGradient colors={['#EC4899', '#DB2777']} style={styles.buttonGradient}>
                   {syncing ? <ActivityIndicator color="#FFF" size="small" /> : (
                     <Text style={styles.primaryButtonText}>PUBLISH CAREER HUB</Text>
                   )}
                </LinearGradient>
              </TouchableOpacity>
            </BlurView>

            <View style={styles.historyHeader}>
               <Text style={styles.historyTitle}>LIVE CAREER TRACKER</Text>
               <View style={styles.historyLine} />
            </View>
          </Animated.View>
        }
        renderItem={({ item, index }) => (
          <Animated.View entering={FadeInRight.delay(index * 50)} style={styles.itemCardContainer}>
            <View style={styles.itemCard}>
               <View style={styles.iconCircle}>
                  <Text style={styles.iconText}>{(item.company || 'C')[0]}</Text>
               </View>
               <View style={styles.itemInfo}>
                  <View style={styles.cardHeader}>
                     <Text style={styles.itemTitle}>{item.title}</Text>
                     <View style={styles.typeBadge}>
                        <Text style={styles.typeText}>{item.type}</Text>
                     </View>
                  </View>
                  <Text style={styles.itemCompany}>{item.company} • {item.stipend || 'Competitive'}</Text>
                  <View style={styles.itemFooter}>
                     <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, flex: 1 }}>
                        <View style={styles.targetPill}>
                           <Feather name="users" size={10} color="rgba(255,255,255,0.4)" style={{ marginRight: 4 }} />
                           <Text style={styles.targetText}>{Array.isArray(item.eligible_branches) ? item.eligible_branches[0] : 'Open'}</Text>
                        </View>
                        {item.deadline && (
                           <View style={[styles.targetPill, { backgroundColor: 'rgba(239, 68, 68, 0.08)' }]}>
                              <Feather name="clock" size={10} color="#EF4444" style={{ marginRight: 4 }} />
                              <Text style={[styles.targetText, { color: '#EF4444' }]}>Till: {item.deadline}</Text>
                           </View>
                        )}
                      </View>
                      <View style={{ flexDirection: 'row', gap: 8 }}>
                         <TouchableOpacity style={styles.editBtn} onPress={() => setFromRow(item)}>
                           <Feather name="edit-3" size={14} color="#EC4899" />
                        </TouchableOpacity>
                        {item.apply_link && (
                          <TouchableOpacity 
                            style={[styles.editBtn, { backgroundColor: 'rgba(59, 130, 246, 0.05)' }]} 
                            onPress={() => Linking.openURL(item.apply_link)}
                          >
                             <Feather name="external-link" size={14} color="#3B82F6" />
                          </TouchableOpacity>
                        )}
                      </View>
                  </View>
               </View>
            </View>
          </Animated.View>
        )}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A' },
  header: { paddingTop: 60, paddingHorizontal: 24, paddingBottom: 20, flexDirection: 'row', alignItems: 'center', gap: 16 },
  backBtn: { width: 44, height: 44, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.05)', alignItems: 'center', justifyContent: 'center' },
  headerInfo: { flex: 1 },
  headerTitle: { fontSize: 22, fontWeight: '900', color: '#FFF' },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  statusDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#10B981' },
  statusText: { fontSize: 10, color: 'rgba(255,255,255,0.4)', fontWeight: '800', letterSpacing: 1 },
  logoBox: { width: 44, height: 44, borderRadius: 14, backgroundColor: 'rgba(236, 72, 153, 0.1)', alignItems: 'center', justifyContent: 'center' },
  formSection: { padding: 20 },
  composerCard: { padding: 24, borderRadius: 28, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', overflow: 'hidden' },
  composerHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 20 },
  composerLabel: { fontSize: 10, fontWeight: '900', color: '#EC4899', letterSpacing: 1.5 },
  composerLine: { flex: 1, height: 1, backgroundColor: 'rgba(236, 72, 153, 0.2)' },
  inputGrid: { flexDirection: 'row', gap: 12 },
  field: { marginBottom: 16 },
  label: { fontSize: 10, fontWeight: '800', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', marginBottom: 8, letterSpacing: 1 },
  input: { height: 50, backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 14, paddingHorizontal: 16, color: '#FFF', fontSize: 15, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)' },
  areaInput: { height: 80, textAlignVertical: 'top', paddingTop: 14 },
  primaryButton: { height: 54, borderRadius: 16, overflow: 'hidden', marginTop: 8 },
  buttonGradient: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  primaryButtonText: { color: '#FFF', fontWeight: '900', fontSize: 14, letterSpacing: 1 },
  historyHeader: { marginTop: 32, marginBottom: 20, flexDirection: 'row', alignItems: 'center', gap: 16 },
  historyTitle: { fontSize: 12, fontWeight: '900', color: 'rgba(255,255,255,0.3)', letterSpacing: 2 },
  historyLine: { flex: 1, height: 1, backgroundColor: 'rgba(255,255,255,0.05)' },
  listContent: { paddingBottom: 120 },
  itemCardContainer: { marginHorizontal: 20, marginBottom: 12 },
  itemCard: { flexDirection: 'row', alignItems: 'center', padding: 20, backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: 24, borderWidth: 1, borderColor: 'rgba(255,255,255,0.04)', gap: 16 },
  iconCircle: { width: 50, height: 50, borderRadius: 18, backgroundColor: 'rgba(236, 72, 153, 0.1)', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(236, 72, 153, 0.2)' },
  iconText: { fontSize: 20, fontWeight: '900', color: '#EC4899' },
  itemInfo: { flex: 1 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  itemTitle: { fontSize: 17, fontWeight: '800', color: '#FFF' },
  typeBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6, backgroundColor: 'rgba(255,255,255,0.05)' },
  typeText: { fontSize: 9, fontWeight: '900', color: 'rgba(255,255,255,0.4)' },
  itemCompany: { fontSize: 12, color: 'rgba(255,255,255,0.3)', marginTop: 6, fontWeight: '600' },
  itemFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 },
  targetPill: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.03)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  targetText: { fontSize: 10, fontWeight: '700', color: 'rgba(255,255,255,0.4)' },
  editBtn: { width: 36, height: 36, borderRadius: 12, backgroundColor: 'rgba(236, 72, 153, 0.05)', alignItems: 'center', justifyContent: 'center' }
});
