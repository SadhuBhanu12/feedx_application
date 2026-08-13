import { useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View, ActivityIndicator, Linking } from 'react-native';
import { COLORS, FONT, RADIUS, SHADOWS, SPACING } from '@/constants/theme';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { adminCreateNotification, getNotifications } from '@/services/supabaseService';
import { useUser } from '@/context/UserContext';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import Animated, { FadeInDown, FadeInRight, Layout } from 'react-native-reanimated';
import AdminFilter from '../../../components/admin/AdminFilter';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  apply_url: string;
  created_at: string;
  branch?: string;
  year?: string;
  section?: string;
  target_branch?: string;
  target_year?: string;
}

export default function AdminNotificationsScreen() {
  const router = useRouter();
  const { user } = useUser();
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [applyUrl, setApplyUrl] = useState('');
  const [filters, setFilters] = useState({ branch: 'All', year: 'All', section: 'All' });
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);

  const loadNotifications = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const data = await getNotifications(user.id, user.college_id);
      setItems(data || []);
    } catch (e: any) {
      console.log('Load error', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();

    // Subscribe to notifications changes in real-time
    const channel = supabase.channel(`admin-notifications-realtime-${Date.now()}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'notifications' },
        () => {
          loadNotifications();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.college_id]);

  const handleCreate = async () => {
    if (!title.trim() || !message.trim()) {
      Alert.alert('Incomplete Draft', 'Please provide both a title and a message body.');
      return;
    }
    setSyncing(true);
    try {
      await adminCreateNotification({
        title: title.trim(),
        message: message.trim(),
        apply_url: applyUrl.trim() || null,
        branch: filters.branch,
        year: filters.year,
        section: filters.section,
        type: 'Announcement',
        college_id: user?.college_id || null,
      });
      Alert.alert('Broadcast Success', 'Message blasted to targeted students.');
      setTitle(''); setMessage(''); setApplyUrl('');
      loadNotifications();
    } catch (e: any) {
      Alert.alert('Broadcast Failed', e.message);
    } finally {
      setSyncing(false);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#0F172A', '#020617']} style={StyleSheet.absoluteFillObject} />
      
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
           <Feather name="arrow-left" size={22} color="#FFF" />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
           <Text style={styles.headerTitle}>Broadcast Hub</Text>
           <View style={styles.statusRow}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>TRANSMISSION READY</Text>
           </View>
        </View>
        <View style={styles.logoBox}>
           <MaterialCommunityIcons name="broadcast" size={28} color="#F59E0B" />
        </View>
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        refreshing={loading}
        onRefresh={loadNotifications}
        ListHeaderComponent={
          <Animated.View entering={FadeInDown} style={styles.formSection}>
            <BlurView intensity={15} tint="light" style={styles.composerCard}>
              <View style={styles.composerHeader}>
                 <Text style={styles.composerLabel}>NEW TRANSMISSION</Text>
                 <View style={styles.composerLine} />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.fieldLabel}>Transmission Heading</Text>
                <TextInput 
                  style={styles.textInput} 
                  value={title} 
                  onChangeText={setTitle} 
                  placeholder="E.g. Academic Holiday Announcement" 
                  placeholderTextColor="rgba(255,255,255,0.2)" 
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.fieldLabel}>Message Content</Text>
                <TextInput 
                  style={[styles.textInput, styles.areaInput]} 
                  value={message} 
                  onChangeText={setMessage} 
                  placeholder="Enter detailed message for students..." 
                  placeholderTextColor="rgba(255,255,255,0.2)" 
                  multiline 
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.fieldLabel}>Call to Action (Optional Link)</Text>
                <TextInput 
                  style={styles.textInput} 
                  value={applyUrl} 
                  onChangeText={setApplyUrl} 
                  placeholder="https://apply-link.com" 
                  placeholderTextColor="rgba(255,255,255,0.2)" 
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.targetBox}>
                <View style={styles.targetHeader}>
                   <Feather name="target" size={14} color="#F59E0B" />
                   <Text style={styles.targetLabel}>TARGET AUDIENCE</Text>
                </View>
                <AdminFilter filters={filters} setFilters={setFilters} />
              </View>

              <TouchableOpacity style={styles.blastBtn} onPress={handleCreate} disabled={syncing}>
                <LinearGradient colors={['#F59E0B', '#D97706']} style={styles.blastGradient}>
                   {syncing ? <ActivityIndicator color="#FFF" size="small" /> : (
                     <>
                        <Text style={styles.blastText}>DEPLOY BROADCAST</Text>
                        <Feather name="send" size={18} color="#FFF" style={{ marginLeft: 10 }} />
                     </>
                   )}
                </LinearGradient>
              </TouchableOpacity>
            </BlurView>

            <View style={styles.historyHeader}>
               <Text style={styles.historyTitle}>TRANSMISSION LOG</Text>
               <View style={styles.historyLine} />
            </View>
          </Animated.View>
        }
        renderItem={({ item, index }) => (
          <Animated.View entering={FadeInRight.delay(index * 50)} style={styles.logCardContainer}>
            <View style={styles.logCard}>
               <View style={styles.logIndicator}>
                  <View style={styles.logDot} />
                  <View style={styles.logVertical} />
               </View>
               <View style={styles.logContent}>
                  <View style={styles.logHeader}>
                     <Text style={styles.logTitle}>{item.title}</Text>
                     <Text style={styles.logTime}>{new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
                  </View>
                  <Text style={styles.logBody} numberOfLines={2}>{item.message}</Text>
                  <View style={styles.logFooter}>
                     <View style={{ flexDirection: 'row', gap: 8 }}>
                        <View style={styles.badge}>
                           <Text style={styles.badgeText}>{item.target_branch || 'Global'}</Text>
                        </View>
                        {item.apply_url && (
                          <TouchableOpacity 
                            style={[styles.badge, { backgroundColor: 'rgba(59, 130, 246, 0.1)', flexDirection: 'row', alignItems: 'center', gap: 4 }]}
                            onPress={() => Linking.openURL(item.apply_url)}
                          >
                             <Text style={[styles.badgeText, { color: '#60A5FA' }]}>VIEW LINK</Text>
                             <Feather name="external-link" size={10} color="#60A5FA" />
                          </TouchableOpacity>
                        )}
                     </View>
                     <Text style={styles.logDate}>{new Date(item.created_at).toLocaleDateString()}</Text>
                  </View>
               </View>
            </View>
          </Animated.View>
        )}
        contentContainerStyle={styles.scrollContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020617' },
  header: { paddingTop: 60, paddingHorizontal: 24, paddingBottom: 24, flexDirection: 'row', alignItems: 'center', gap: 16 },
  backBtn: { width: 44, height: 44, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.03)', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  headerInfo: { flex: 1 },
  headerTitle: { fontSize: 24, fontWeight: '900', color: '#FFF' },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  statusDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#10B981' },
  statusText: { fontSize: 10, color: 'rgba(255,255,255,0.4)', fontWeight: '800', letterSpacing: 1.5 },
  logoBox: { width: 48, height: 48, borderRadius: 16, backgroundColor: 'rgba(245, 158, 11, 0.1)', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(245, 158, 11, 0.2)' },
  formSection: { padding: 20 },
  composerCard: { padding: 24, borderRadius: 32, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', overflow: 'hidden', backgroundColor: 'rgba(255,255,255,0.01)' },
  composerHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 24 },
  composerLabel: { fontSize: 11, fontWeight: '800', color: '#F59E0B', letterSpacing: 1 },
  composerLine: { flex: 1, height: 1, backgroundColor: 'rgba(245, 158, 11, 0.2)' },
  inputGroup: { marginBottom: 20 },
  fieldLabel: { fontSize: 10, fontWeight: '700', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', marginBottom: 8, letterSpacing: 0.5 },
  textInput: { height: 52, backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 16, paddingHorizontal: 16, color: '#FFF', fontSize: 15, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)' },
  areaInput: { height: 100, textAlignVertical: 'top', paddingTop: 14 },
  targetBox: { marginTop: 8, marginBottom: 24 },
  targetHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  targetLabel: { fontSize: 10, fontWeight: '800', color: 'rgba(255,255,255,0.4)', letterSpacing: 1 },
  blastBtn: { height: 56, borderRadius: 18, overflow: 'hidden', marginTop: 8 },
  blastGradient: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  blastText: { color: '#FFF', fontWeight: '900', fontSize: 14, letterSpacing: 1 },
  historyHeader: { marginTop: 40, marginBottom: 20, flexDirection: 'row', alignItems: 'center', gap: 16 },
  historyTitle: { fontSize: 12, fontWeight: '900', color: 'rgba(255,255,255,0.3)', letterSpacing: 2 },
  historyLine: { flex: 1, height: 1, backgroundColor: 'rgba(255,255,255,0.05)' },
  scrollContainer: { paddingBottom: 120 },
  logCardContainer: { paddingHorizontal: 20, marginBottom: 4 },
  logCard: { flexDirection: 'row', gap: 16 },
  logIndicator: { alignItems: 'center', width: 20 },
  logDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: 'rgba(245, 158, 11, 0.3)', borderWidth: 2, borderColor: '#F59E0B' },
  logVertical: { flex: 1, width: 1, backgroundColor: 'rgba(255,255,255,0.05)', marginVertical: 4 },
  logContent: { flex: 1, backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: 24, padding: 20, marginBottom: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.04)' },
  logHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
  logTitle: { fontSize: 17, fontWeight: '800', color: '#FFF', flex: 1, marginRight: 12 },
  logTime: { fontSize: 11, color: 'rgba(255,255,255,0.3)', fontWeight: '600' },
  logBody: { fontSize: 14, color: 'rgba(255,255,255,0.5)', lineHeight: 22 },
  logFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.05)' },
  badgeText: { fontSize: 10, fontWeight: '800', color: '#3B82F6', textTransform: 'uppercase' },
  logDate: { fontSize: 11, color: 'rgba(255,255,255,0.2)', fontWeight: '600' }
});
