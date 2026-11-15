import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View, Platform } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { COLORS, FONT, RADIUS, SHADOWS, SPACING } from '@/constants/theme';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { supabase } from '@/lib/supabase';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import { useUser } from '@/context/UserContext';

interface UserIdentity {
  id: string;
  email: string;
  role: string;
  full_name?: string;
  created_at?: string;
}

export default function SecurityConsole() {
  const router = useRouter();
  const [users, setUsers] = useState<UserIdentity[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      // Fetch user identities from users table
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setUsers(data || []);
    } catch (e: any) {
      console.log('Security Load Error', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // Real-time Identity Matrix Sync
    const channel = supabase.channel(`security-matrix-rt-${Date.now()}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'users' }, loadData)
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  const handleUpdateRole = async (userId: string, newRole: string) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('users')
        .update({ role: newRole })
        .eq('id', userId);

      if (error) throw error;
      Alert.alert('Privilege Escalation', `User role successfully migrated to ${newRole.toUpperCase()}.`);
      loadData();
    } catch (e: any) {
      Alert.alert('Security Violation', e.message);
    } finally {
      setLoading(false);
    }
  };

  const filtered = users.filter(u => 
    u.email?.toLowerCase().includes(search.toLowerCase()) ||
    u.full_name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#0F172A', '#020617']} style={StyleSheet.absoluteFill} />
      
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
           <Feather name="arrow-left" size={22} color="#FFF" />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
           <Text style={styles.headerTitle}>Security Console</Text>
           <View style={styles.statusRow}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>ROOT ACCESS AUTHORIZED</Text>
           </View>
        </View>
        <View style={styles.logoBox}>
           <MaterialCommunityIcons name="shield-lock" size={26} color="#6366F1" />
        </View>
      </View>

      <FlashList
        data={filtered}
        keyExtractor={(item) => item.id}
        refreshing={loading}
        onRefresh={loadData}
        ListHeaderComponent={
          <Animated.View entering={FadeInDown} style={styles.formSection}>
            <View style={styles.searchSection}>
               <View style={styles.searchBox}>
                  <Feather name="shield" size={18} color="rgba(255,255,255,0.3)" />
                  <TextInput 
                    style={styles.searchInput} 
                    placeholder="Search Identity Matrix..." 
                    placeholderTextColor="rgba(255,255,255,0.2)"
                    value={search}
                    onChangeText={setSearch}
                  />
               </View>
            </View>
          </Animated.View>
        }
        renderItem={({ item, index }) => (
          <Animated.View entering={FadeInRight.delay(index * 50)} style={styles.itemCardContainer}>
            <View style={styles.itemCard}>
               <View style={styles.iconCircle}>
                  <MaterialCommunityIcons 
                    name={item.role === 'admin' ? 'account-tie' : 'account'} 
                    size={22} 
                    color={item.role === 'admin' ? '#F59E0B' : '#6366F1'} 
                  />
               </View>
               <View style={styles.itemInfo}>
                  <View style={styles.cardHeader}>
                     <Text style={styles.itemTitle}>{item.full_name || 'Generic Identity'}</Text>
                     <View style={[styles.roleBadge, { backgroundColor: item.role === 'admin' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(99, 102, 241, 0.1)' }]}>
                        <Text style={[styles.roleText, { color: item.role === 'admin' ? '#F59E0B' : '#6366F1' }]}>{item.role?.toUpperCase()}</Text>
                     </View>
                  </View>
                  <Text style={styles.itemMeta}>{item.email}</Text>
                  <View style={styles.itemFooter}>
                     <TouchableOpacity 
                       style={styles.actionBtn} 
                       onPress={() => {
                         const nextRole = item.role === 'admin' ? 'student' : 'admin';
                         Alert.alert('Confirm Authority', `Modify access level to ${nextRole.toUpperCase()}?`, [
                           { text: 'Cancel', style: 'cancel' },
                           { text: 'Authorize', onPress: () => handleUpdateRole(item.id, nextRole) }
                         ]);
                       }}
                     >
                        <Feather name="refresh-cw" size={14} color="rgba(255,255,255,0.4)" />
                        <Text style={styles.actionText}>TOGGLE ROLE</Text>
                     </TouchableOpacity>
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
  container: { flex: 1, backgroundColor: '#020617' },
  header: { paddingTop: Platform.OS === 'ios' ? 56 : 42, paddingHorizontal: 20, paddingBottom: 16, flexDirection: 'row', alignItems: 'center', gap: 14 },
  backBtn: { width: 44, height: 44, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.05)', alignItems: 'center', justifyContent: 'center' },
  headerInfo: { flex: 1 },
  headerTitle: { fontSize: 22, fontWeight: '900', color: '#FFF' },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  statusDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#10B981' },
  statusText: { fontSize: 10, color: 'rgba(255,255,255,0.4)', fontWeight: '800', letterSpacing: 1 },
  logoBox: { width: 44, height: 44, borderRadius: 14, backgroundColor: 'rgba(99, 102, 241, 0.1)', alignItems: 'center', justifyContent: 'center' },
  formSection: { padding: 20 },
  composerCard: { padding: 24, borderRadius: 28, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', overflow: 'hidden' },
  composerHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 20 },
  composerLabel: { fontSize: 10, fontWeight: '900', color: '#6366F1', letterSpacing: 1.5 },
  composerLine: { flex: 1, height: 1, backgroundColor: 'rgba(99, 102, 241, 0.2)' },
  field: { marginBottom: 16 },
  label: { fontSize: 10, fontWeight: '800', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', marginBottom: 8, letterSpacing: 1 },
  input: { height: 50, backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 14, paddingHorizontal: 16, color: '#FFF', fontSize: 15, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)' },
  primaryButton: { height: 54, borderRadius: 16, overflow: 'hidden', marginTop: 8 },
  buttonGradient: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  primaryButtonText: { color: '#FFF', fontWeight: '900', fontSize: 14, letterSpacing: 1 },
  searchSection: { marginTop: 32, marginBottom: 20 },
  searchBox: { height: 54, backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: 16, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 18, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  searchInput: { flex: 1, marginLeft: 12, color: '#FFF', fontSize: 15 },
  listContent: { paddingBottom: 120 },
  itemCardContainer: { marginHorizontal: 20, marginBottom: 12 },
  itemCard: { flexDirection: 'row', alignItems: 'center', padding: 20, backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: 24, borderWidth: 1, borderColor: 'rgba(255,255,255,0.04)', gap: 16 },
  iconCircle: { width: 50, height: 50, borderRadius: 18, backgroundColor: 'rgba(99, 102, 241, 0.1)', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(99, 102, 241, 0.2)' },
  itemInfo: { flex: 1 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  itemTitle: { fontSize: 16, fontWeight: '800', color: '#FFF' },
  roleBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  roleText: { fontSize: 9, fontWeight: '900' },
  itemMeta: { fontSize: 12, color: 'rgba(255,255,255,0.3)', marginTop: 4, fontWeight: '600' },
  itemFooter: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 12 },
  actionBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.03)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10, gap: 6 },
  actionText: { fontSize: 10, fontWeight: '800', color: 'rgba(255,255,255,0.4)', letterSpacing: 0.5 }
});
