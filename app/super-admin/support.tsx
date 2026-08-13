import React, { useEffect, useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  Alert, 
  ActivityIndicator, 
  RefreshControl, 
  TextInput, 
  Modal, 
  Platform 
} from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useRouter } from 'expo-router';
import { useUser } from '@/context/UserContext';
import { supabase } from '@/lib/supabase';
import { superAdminApproveIssue, superAdminRejectIssue } from '@/services/supabaseService';
import { COLORS, FONT, RADIUS, SHADOWS, SPACING } from '@/constants/theme';
import Animated, { FadeInDown } from 'react-native-reanimated';

interface IssueItem {
  id: string;
  title: string;
  description: string;
  category: string;
  triage_status: string;
  status: string;
  response?: string;
  created_at: string;
  users?: {
    full_name: string;
    email?: string;
    phone?: string;
    branch?: string;
    year?: string;
    pin_number?: string;
  };
}

export default function SuperAdminSupportTriage() {
  const router = useRouter();
  const { user } = useUser();
  const [issues, setIssues] = useState<IssueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  // Tab control state
  const [activeTab, setActiveTab] = useState<'Pending' | 'Approved' | 'Resolved' | 'Rejected'>('Pending');

  // Detail Modal state
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState<IssueItem | null>(null);

  // Reject modal action state
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [selectedIssueId, setSelectedIssueId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const fetchIssues = async () => {
    try {
      let query = supabase
        .from('issues')
        .select(`
          *,
          users:user_id(
            full_name,
            email,
            phone,
            branch,
            year,
            pin_number
          )
        `);

      if (activeTab === 'Pending') {
        query = query.eq('triage_status', 'pending_review');
      } else if (activeTab === 'Approved') {
        query = query.eq('triage_status', 'approved').neq('status', 'resolved');
      } else if (activeTab === 'Resolved') {
        query = query.eq('status', 'resolved');
      } else if (activeTab === 'Rejected') {
        query = query.eq('triage_status', 'rejected');
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      setIssues(data || []);
    } catch (err: any) {
      console.error(err);
      Alert.alert('Database Error', 'Could not load triage queue: ' + err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchIssues();

    // Subscribe to issues changes in real-time
    const channel = supabase.channel(`super-admin-triage-realtime-${Date.now()}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'issues' },
        () => {
          fetchIssues();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [activeTab]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchIssues();
  };

  const handleApprove = async (issueId: string) => {
    Alert.alert(
      'Approve Ticket',
      'This will forward the issue to the respective College Admin queue for resolution. Proceed?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Approve', 
          onPress: async () => {
            setActionLoading(true);
            try {
              await superAdminApproveIssue(issueId, undefined, user?.id);
              Alert.alert('Success', 'Ticket approved and dispatched to college desk.');
              fetchIssues();
            } catch (err: any) {
              Alert.alert('Action Failed', err.message);
            } finally {
              setActionLoading(false);
            }
          }
        }
      ]
    );
  };

  const openRejectModal = (issueId: string) => {
    setSelectedIssueId(issueId);
    setRejectReason('');
    setRejectModalVisible(true);
  };

  const handleRejectSubmit = async () => {
    if (!rejectReason.trim()) {
      return Alert.alert('Error', 'Please provide a reason for rejection.');
    }
    if (!selectedIssueId) return;

    setActionLoading(true);
    try {
      await superAdminRejectIssue(selectedIssueId, rejectReason.trim(), user?.id);
      Alert.alert('Success', 'Ticket rejected and returned to student.');
      setRejectModalVisible(false);
      fetchIssues();
    } catch (err: any) {
      Alert.alert('Action Failed', err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const renderItem = ({ item, index }: { item: IssueItem; index: number }) => (
    <Animated.View entering={FadeInDown.delay(index * 50).duration(400)}>
      <TouchableOpacity 
        activeOpacity={0.9} 
        onPress={() => { setSelectedIssue(item); setDetailModalVisible(true); }}
      >
        <BlurView intensity={20} tint="dark" style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{item.category.toUpperCase()}</Text>
            </View>
            <Text style={styles.dateText}>
              {new Date(item.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
            </Text>
          </View>

          <Text style={styles.cardTitle}>{item.title}</Text>
          <Text style={styles.cardDesc} numberOfLines={3}>{item.description}</Text>

          <View style={styles.divider} />

          <View style={styles.cardFooter}>
            <View style={styles.authorGroup}>
              <Feather name="user" size={14} color="rgba(255,255,255,0.4)" />
              <Text style={styles.authorName}>{item.users?.full_name || 'Anonymous Student'}</Text>
            </View>
            
            {activeTab === 'Pending' && (
              <View style={styles.actionGroup}>
                <TouchableOpacity 
                  style={[styles.actionBtn, styles.rejectBtn]} 
                  onPress={(e) => { e.stopPropagation(); openRejectModal(item.id); }}
                  disabled={actionLoading}
                >
                  <Feather name="x" size={16} color="#EF4444" />
                  <Text style={[styles.actionBtnText, { color: '#EF4444' }]}>Reject</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.actionBtn, styles.approveBtn]} 
                  onPress={(e) => { e.stopPropagation(); handleApprove(item.id); }}
                  disabled={actionLoading}
                >
                  <Feather name="check" size={16} color="#10B981" />
                  <Text style={[styles.actionBtnText, { color: '#10B981' }]}>Approve</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </BlurView>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#0B0F19', '#020408']} style={StyleSheet.absoluteFillObject} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Feather name="arrow-left" size={24} color="#FFF" />
        </TouchableOpacity>
        <View style={{ flex: 1, marginLeft: 15 }}>
          <Text style={styles.headerTitle}>Support Triage</Text>
          <Text style={styles.headerSubtitle}>Triage & Solved History</Text>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabRow}>
        {(['Pending', 'Approved', 'Resolved', 'Rejected'] as const).map(tab => (
          <TouchableOpacity
            key={tab}
            style={[styles.tabBtn, activeTab === tab && styles.tabBtnActive]}
            onPress={() => {
              setActiveTab(tab);
            }}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Main List */}
      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#F59E0B" />
        </View>
      ) : (
        <FlashList
          data={issues}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#FFF" />}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Feather name="check-circle" size={48} color="#10B981" style={{ marginBottom: 15 }} />
              <Text style={styles.emptyText}>Queue is Clean!</Text>
              <Text style={styles.emptySubText}>No tickets in the {activeTab.toLowerCase()} list.</Text>
            </View>
          }
        />
      )}

      {/* Reject Reason Modal */}
      <Modal visible={rejectModalVisible} animationType="fade" transparent>
        <BlurView intensity={45} tint="dark" style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Reject Ticket</Text>
            <Text style={styles.modalSubTitle}>Provide a reason for rejecting this ticket. This will be visible to the student.</Text>
            
            <TextInput 
              style={styles.reasonInput}
              multiline
              numberOfLines={4}
              placeholder="e.g. Duplicate issue. Already resolved in another ticket."
              placeholderTextColor="rgba(255,255,255,0.3)"
              value={rejectReason}
              onChangeText={setRejectReason}
            />

            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={[styles.modalBtn, styles.cancelBtn]}
                onPress={() => setRejectModalVisible(false)}
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.modalBtn, styles.confirmRejectBtn]}
                onPress={handleRejectSubmit}
                disabled={actionLoading}
              >
                {actionLoading ? <ActivityIndicator size="small" color="#000" /> : <Text style={styles.confirmRejectBtnText}>Reject</Text>}
              </TouchableOpacity>
            </View>
          </View>
        </BlurView>
      </Modal>

      {/* Detail Dossier Modal */}
      <Modal visible={detailModalVisible} animationType="slide" transparent>
        <BlurView intensity={50} tint="dark" style={styles.modalOverlay}>
          <View style={[styles.modalContent, { width: '90%', maxHeight: '80%' }]}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <Text style={styles.modalTitle}>Ticket Dossier</Text>
              <TouchableOpacity onPress={() => setDetailModalVisible(false)}>
                <Feather name="x" size={24} color="#FFF" />
              </TouchableOpacity>
            </View>

            {selectedIssue && (
              <FlashList
                data={[selectedIssue]}
                keyExtractor={() => 'details'}
                contentContainerStyle={{ gap: 16 }}
                renderItem={() => (
                  <View style={{ gap: 16 }}>
                    <View>
                      <Text style={styles.fieldLabel}>Title</Text>
                      <Text style={styles.detailText}>{selectedIssue.title}</Text>
                    </View>

                    <View>
                      <Text style={styles.fieldLabel}>Description</Text>
                      <Text style={[styles.detailText, { color: 'rgba(255,255,255,0.7)', fontSize: 14, lineHeight: 20, fontWeight: '500' }]}>
                        {selectedIssue.description}
                      </Text>
                    </View>

                    <View style={styles.detailGrid}>
                      <View style={styles.gridItem}>
                        <Text style={styles.fieldLabel}>Category</Text>
                        <Text style={styles.gridValue}>{selectedIssue.category.toUpperCase()}</Text>
                      </View>
                      <View style={styles.gridItem}>
                        <Text style={styles.fieldLabel}>Triage Status</Text>
                        <Text style={[styles.gridValue, { color: selectedIssue.triage_status === 'approved' ? '#10B981' : selectedIssue.triage_status === 'rejected' ? '#EF4444' : '#F59E0B' }]}>
                          {selectedIssue.triage_status.toUpperCase()}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.detailGrid}>
                      <View style={styles.gridItem}>
                        <Text style={styles.fieldLabel}>Ticket Status</Text>
                        <Text style={[styles.gridValue, { color: selectedIssue.status === 'resolved' ? '#10B981' : '#3B82F6' }]}>
                          {selectedIssue.status.toUpperCase()}
                        </Text>
                      </View>
                      <View style={styles.gridItem}>
                        <Text style={styles.fieldLabel}>Date Created</Text>
                        <Text style={styles.gridValue}>{new Date(selectedIssue.created_at).toLocaleDateString()}</Text>
                      </View>
                    </View>

                    <View style={styles.sectionDivider} />

                    <View>
                      <Text style={styles.sectionTitle}>Student Details</Text>
                      
                      <View style={styles.infoRow}>
                        <Feather name="user" size={14} color="rgba(255,255,255,0.4)" style={{ marginRight: 8 }} />
                        <Text style={styles.infoLabel}>Name: </Text>
                        <Text style={styles.infoValue}>{selectedIssue.users?.full_name || 'Anonymous Student'}</Text>
                      </View>

                      {selectedIssue.users?.pin_number && (
                        <View style={styles.infoRow}>
                          <Feather name="credit-card" size={14} color="rgba(255,255,255,0.4)" style={{ marginRight: 8 }} />
                          <Text style={styles.infoLabel}>Roll / PIN: </Text>
                          <Text style={styles.infoValue}>{selectedIssue.users.pin_number}</Text>
                        </View>
                      )}

                      {selectedIssue.users?.email && (
                        <View style={styles.infoRow}>
                          <Feather name="mail" size={14} color="rgba(255,255,255,0.4)" style={{ marginRight: 8 }} />
                          <Text style={styles.infoLabel}>Email: </Text>
                          <Text style={styles.infoValue}>{selectedIssue.users.email}</Text>
                        </View>
                      )}

                      {selectedIssue.users?.branch && (
                        <View style={styles.infoRow}>
                          <Feather name="book-open" size={14} color="rgba(255,255,255,0.4)" style={{ marginRight: 8 }} />
                          <Text style={styles.infoLabel}>Branch: </Text>
                          <Text style={styles.infoValue}>{selectedIssue.users.branch}</Text>
                        </View>
                      )}
                    </View>

                    {selectedIssue.response && (
                      <View style={styles.responseContainer}>
                        <Text style={styles.fieldLabel}>Admin Response / Rejection Reason</Text>
                        <Text style={styles.responseText}>{selectedIssue.response}</Text>
                      </View>
                    )}
                  </View>
                )}
              />
            )}
          </View>
        </BlurView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020408' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: Platform.OS === 'ios' ? 70 : 50, paddingBottom: 15 },
  backBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.03)', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' },
  headerTitle: { fontSize: 24, fontWeight: '900', color: '#FFF', letterSpacing: -0.5 },
  headerSubtitle: { fontSize: 12, color: 'rgba(255,255,255,0.5)', fontWeight: '600', marginTop: 2, textTransform: 'uppercase', letterSpacing: 0.5 },
  
  // Segmented Tabs
  tabRow: { flexDirection: 'row', paddingHorizontal: 20, gap: 6, marginBottom: 15 },
  tabBtn: { flex: 1, paddingVertical: 10, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.02)', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  tabBtnActive: { backgroundColor: 'rgba(245, 158, 11, 0.12)', borderColor: 'rgba(245, 158, 11, 0.3)' },
  tabText: { color: 'rgba(255,255,255,0.4)', fontWeight: '700', fontSize: 12 },
  tabTextActive: { color: '#F59E0B', fontWeight: '800' },

  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  listContent: { padding: 20, paddingBottom: 100, gap: 16 },
  
  card: { padding: 18, borderRadius: 24, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)', overflow: 'hidden' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  categoryBadge: { backgroundColor: 'rgba(245, 158, 11, 0.1)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  categoryText: { color: '#F59E0B', fontSize: 10, fontWeight: '800' },
  dateText: { color: 'rgba(255,255,255,0.4)', fontSize: 11, fontWeight: '600' },
  
  cardTitle: { fontSize: 16, fontWeight: '800', color: '#FFF', marginBottom: 8 },
  cardDesc: { fontSize: 13, color: 'rgba(255,255,255,0.6)', lineHeight: 18, marginBottom: 16, fontWeight: '500' },
  
  divider: { height: 1, backgroundColor: 'rgba(255,255,255,0.06)', marginBottom: 14 },
  
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  authorGroup: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  authorName: { color: 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: '600' },
  
  actionGroup: { flexDirection: 'row', gap: 10 },
  actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, borderWidth: 1 },
  rejectBtn: { backgroundColor: 'rgba(239, 68, 68, 0.05)', borderColor: 'rgba(239, 68, 68, 0.15)' },
  approveBtn: { backgroundColor: 'rgba(16, 185, 129, 0.05)', borderColor: 'rgba(16, 185, 129, 0.15)' },
  actionBtnText: { fontSize: 12, fontWeight: '700' },

  emptyContainer: { alignItems: 'center', marginTop: 100, padding: 30 },
  emptyText: { fontSize: 18, fontWeight: '800', color: '#FFF', marginBottom: 6 },
  emptySubText: { fontSize: 13, color: 'rgba(255,255,255,0.4)', textAlign: 'center', lineHeight: 18, fontWeight: '500' },

  // Modal styles
  modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.75)' },
  modalContent: { width: '85%', backgroundColor: '#0F131E', padding: 24, borderRadius: 24, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  modalTitle: { fontSize: 18, fontWeight: '900', color: '#FFF' },
  modalSubTitle: { fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 18, marginBottom: 15, fontWeight: '500' },
  reasonInput: { height: 100, backgroundColor: 'rgba(255,255,255,0.03)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', borderRadius: 12, padding: 12, color: '#FFF', fontSize: 14, textAlignVertical: 'top', marginBottom: 20 },
  modalActions: { flexDirection: 'row', gap: 12 },
  modalBtn: { flex: 1, height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  cancelBtn: { backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' },
  cancelBtnText: { color: '#FFF', fontSize: 14, fontWeight: '700' },
  confirmRejectBtn: { backgroundColor: '#FFF' },
  confirmRejectBtnText: { color: '#000', fontSize: 14, fontWeight: '700' },

  // Dossier details modal
  fieldLabel: { fontSize: 10, fontWeight: '800', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', marginBottom: 4, letterSpacing: 0.5 },
  detailText: { fontSize: 15, fontWeight: '700', color: '#FFF' },
  detailGrid: { flexDirection: 'row', gap: 16 },
  gridItem: { flex: 1 },
  gridValue: { fontSize: 14, fontWeight: '700', color: '#FFF' },
  sectionDivider: { height: 1, backgroundColor: 'rgba(255,255,255,0.08)', marginVertical: 4 },
  sectionTitle: { fontSize: 14, fontWeight: '800', color: '#F59E0B', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 12 },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  infoLabel: { fontSize: 13, color: 'rgba(255,255,255,0.5)', fontWeight: '600' },
  infoValue: { fontSize: 13, color: '#FFF', fontWeight: '700' },
  responseContainer: { marginTop: 10, padding: 12, backgroundColor: 'rgba(239, 68, 68, 0.05)', borderRadius: 12, borderWidth: 1, borderColor: 'rgba(239, 68, 68, 0.15)' },
  responseText: { fontSize: 13, color: '#EF4444', fontWeight: '600', marginTop: 4 }
});
