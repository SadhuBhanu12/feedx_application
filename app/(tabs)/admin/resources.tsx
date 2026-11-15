import { useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View, ActivityIndicator , Modal, Platform } from 'react-native';
import { COLORS, FONT, RADIUS, SHADOWS, SPACING } from '@/constants/theme';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { adminDeleteNote, adminListNotes, adminUpsertNote, uploadResourceFile , adminListColleges } from '@/services/supabaseService';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import Animated, { FadeInDown, FadeInRight, Layout } from 'react-native-reanimated';
import * as DocumentPicker from 'expo-document-picker';
import AdminFilter from '../../../components/admin/AdminFilter';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { useUser } from '@/context/UserContext';



interface ResourceItem {
  id: string;
  title: string;
  file_url: string;
  type: string;
  college_id?: string | null;
  uploaded_by?: string;
}

export default function MaterialRegistry() {
  const router = useRouter();
  const { user } = useUser();
  const [items, setItems] = useState<ResourceItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const PREDEFINED_TYPES = ['Previous Paper', 'Notes', 'Syllabus', 'Lab Manual', 'Reference Book', 'Other'];
  const [selectedType, setSelectedType] = useState('Previous Paper');
  const [customType, setCustomType] = useState('');
  const [form, setForm] = useState({ 
    id: '', title: '', type: 'Previous Paper', file_url: ''
  });

  const isSuperAdmin = user?.role === 'super_admin';
  const effectiveCollegeId = user?.college_id || (!isSuperAdmin ? '6dd12d63-e276-4ff8-8e58-bcd2cc878626' : null);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await adminListNotes(effectiveCollegeId || undefined);
      setItems(data || []);
    } catch (e: any) {
      console.log('Resource load error', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // Real-time Asset Sync
    const channelName = `material-registry-rt-${effectiveCollegeId || 'all'}-${Date.now()}`;
    const channel = supabase.channel(channelName)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'resources', ...(effectiveCollegeId ? { filter: `college_id=eq.${effectiveCollegeId}` } : {}) }, loadData)
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [effectiveCollegeId]);

  const handlePickFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: '*/*' });
      if (!result.canceled && result.assets && result.assets[0]) {
        setUploading(true);
        const file = result.assets[0];
        const publicUrl = await uploadResourceFile(file.uri, file.name, file.mimeType);
        setForm((f: any) => ({ ...f, file_url: publicUrl }));
        Alert.alert('Cloud Sync Success', 'Document successfully hosted on encrypted storage.');
      }
    } catch (e: any) {
      Alert.alert('Sync Error', e.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!form.title.trim() || !form.file_url.trim()) {
      Alert.alert('Registry Error', 'Asset Title and File Source are mandatory.');
      return;
    }
    const finalType = selectedType === 'Other' ? customType.trim() : selectedType;
    if (selectedType === 'Other' && !finalType) {
      Alert.alert('Validation Error', 'Please specify the custom resource type.');
      return;
    }

    setLoading(true);
    try {
      await adminUpsertNote({
        id: form.id || undefined,
        title: form.title.trim(),
        file_url: form.file_url.trim(),
        type: finalType || 'Notes',
        college_id: effectiveCollegeId || null,
        uploaded_by: user?.id,
      });
      Alert.alert('Asset Live', 'Resource successfully published to institutional library.');
      setForm({ id: '', title: '', type: 'Notes', file_url: '' });
      setSelectedType('Previous Paper');
      setCustomType('');
      loadData();
    } catch (e: any) {
      Alert.alert('Publication Error', e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    Alert.alert('Delete Resource', 'Are you sure you want to remove this academic asset?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await adminDeleteNote(id, user?.college_id);
            Alert.alert('Removed', 'Resource deleted from campus library.');
            loadData();
          } catch (e: any) {
            Alert.alert('Delete Error', e.message);
          }
        },
      },
    ]);
  };

  const setFromRow = (row: ResourceItem) => {
    const isPredefined = PREDEFINED_TYPES.filter(t => t !== 'Other').includes(row.type);
    setSelectedType(isPredefined ? row.type : 'Other');
    setCustomType(isPredefined ? '' : row.type);
    setForm({
      id: row.id,
      title: row.title || '',
      type: row.type || 'Notes',
      file_url: row.file_url || ''
    });
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#0F172A', '#020617']} style={StyleSheet.absoluteFill} />
      
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
           <Feather name="arrow-left" size={22} color="#FFF" />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
           <Text style={styles.headerTitle}>Previous Papers</Text>
           <View style={styles.statusRow}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>QUESTION PAPERS & MATERIALS</Text>
           </View>
        </View>
        <View style={styles.logoBox}>
           <MaterialCommunityIcons name="layers-triple" size={26} color="#8B5CF6" />
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
                 <Text style={styles.composerLabel}>NEW ASSET COMPOSER</Text>
                 <View style={styles.composerLine} />
              </View>
              
              <View style={styles.field}>
                <Text style={styles.label}>Asset Heading</Text>
                <TextInput 
                  style={styles.input} 
                  value={form.title} 
                  onChangeText={t => setForm(f => ({ ...f, title: t }))} 
                  placeholder="E.g. Unit 4: Neural Networks" 
                  placeholderTextColor="rgba(255,255,255,0.2)" 
                />
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>Asset Type</Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: selectedType === 'Other' ? 12 : 0 }}>
                  {PREDEFINED_TYPES.map(type => (
                    <TouchableOpacity
                      key={type}
                      style={{
                        paddingHorizontal: 12,
                        paddingVertical: 8,
                        borderRadius: 10,
                        backgroundColor: selectedType === type ? '#8B5CF6' : 'rgba(255,255,255,0.05)',
                        borderWidth: 1,
                        borderColor: selectedType === type ? '#8B5CF6' : 'rgba(255,255,255,0.1)'
                      }}
                      onPress={() => setSelectedType(type)}
                    >
                      <Text style={{ color: selectedType === type ? '#FFF' : 'rgba(255,255,255,0.7)', fontSize: 12, fontWeight: '700' }}>
                        {type}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {selectedType === 'Other' && (
                  <View style={{ marginTop: 8 }}>
                    <Text style={[styles.label, { color: '#8B5CF6' }]}>Specify Resource Type *</Text>
                    <TextInput 
                      style={styles.input} 
                      value={customType} 
                      onChangeText={setCustomType} 
                      placeholder="e.g. Lab Manual, Blueprint, Case Study" 
                      placeholderTextColor="rgba(255,255,255,0.2)" 
                    />
                  </View>
                )}
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>File Source (Cloud Hosting)</Text>
                <View style={styles.uploadRow}>
                   <TextInput 
                    style={[styles.input, { flex: 1, borderTopRightRadius: 0, borderBottomRightRadius: 0 }]} 
                    value={form.file_url} 
                    onChangeText={t => setForm(f => ({ ...f, file_url: t }))} 
                    placeholder="https://cloud.feedx.app/..." 
                    placeholderTextColor="rgba(255,255,255,0.2)" 
                    autoCapitalize="none" 
                   />
                   <TouchableOpacity style={styles.uploadBtn} onPress={handlePickFile} disabled={uploading}>
                      {uploading ? <ActivityIndicator color="#FFF" size="small" /> : <Feather name="upload-cloud" size={20} color="#FFF" />}
                   </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity style={styles.primaryButton} onPress={handleSave}>
                <LinearGradient colors={['#8B5CF6', '#7C3AED']} style={styles.buttonGradient}>
                   <Text style={styles.primaryButtonText}>PUBLISH ASSET</Text>
                </LinearGradient>
              </TouchableOpacity>
            </BlurView>

            <View style={styles.historyHeader}>
               <Text style={styles.historyTitle}>VAULT LOG</Text>
               <View style={styles.historyLine} />
            </View>
          </Animated.View>
        }
        renderItem={({ item, index }) => (
          <Animated.View entering={FadeInRight.delay(index * 50)} style={styles.itemCardContainer}>
            <View style={styles.itemCard}>
               <View style={styles.iconCircle}>
                  <Feather name={item.type?.toLowerCase().includes('paper') ? 'file-text' : 'book-open'} size={20} color="#8B5CF6" />
               </View>
               <View style={styles.itemInfo}>
                  <View style={styles.cardHeader}>
                     <Text style={styles.itemTitle}>{item.title}</Text>
                     <View style={styles.typeBadge}>
                        <Text style={styles.typeText}>{item.type || 'Notes'}</Text>
                     </View>
                  </View>
                  <Text style={styles.itemMeta}>Global Academic Resource</Text>
                  <View style={styles.itemFooter}>
                     <View style={styles.targetPill}>
                        <Text style={styles.targetText}>{item.college_id ? 'CAMPUS ACCESS' : 'GLOBAL ACCESS'}</Text>
                     </View>
                     <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
                       <TouchableOpacity style={styles.editBtn} onPress={() => setFromRow(item)}>
                          <Feather name="edit-3" size={16} color="#8B5CF6" />
                       </TouchableOpacity>
                       <TouchableOpacity style={[styles.editBtn, { backgroundColor: 'rgba(239, 68, 68, 0.1)' }]} onPress={() => handleDelete(item.id)}>
                          <Feather name="trash-2" size={16} color="#EF4444" />
                       </TouchableOpacity>
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
  container: { flex: 1, backgroundColor: '#020617' },
  header: { paddingTop: Platform.OS === 'ios' ? 56 : 42, paddingHorizontal: 20, paddingBottom: 16, flexDirection: 'row', alignItems: 'center', gap: 14 },
  backBtn: { width: 44, height: 44, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.05)', alignItems: 'center', justifyContent: 'center' },
  headerInfo: { flex: 1 },
  headerTitle: { fontSize: 22, fontWeight: '900', color: '#FFF' },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  statusDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#10B981' },
  statusText: { fontSize: 10, color: 'rgba(255,255,255,0.4)', fontWeight: '800', letterSpacing: 1 },
  logoBox: { width: 44, height: 44, borderRadius: 14, backgroundColor: 'rgba(139, 92, 246, 0.1)', alignItems: 'center', justifyContent: 'center' },
  formSection: { padding: 20 },
  composerCard: { padding: 24, borderRadius: 28, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', overflow: 'hidden' },
  composerHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 20 },
  composerLabel: { fontSize: 10, fontWeight: '900', color: '#8B5CF6', letterSpacing: 1.5 },
  composerLine: { flex: 1, height: 1, backgroundColor: 'rgba(139, 92, 246, 0.2)' },
  inputGrid: { flexDirection: 'row', gap: 12 },
  field: { marginBottom: 16 },
  label: { fontSize: 10, fontWeight: '800', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', marginBottom: 8, letterSpacing: 1 },
  input: { height: 50, backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 14, paddingHorizontal: 16, color: '#FFF', fontSize: 15, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)' },
  uploadRow: { flexDirection: 'row' },
  uploadBtn: { width: 54, height: 50, backgroundColor: '#8B5CF6', borderTopRightRadius: 14, borderBottomRightRadius: 14, alignItems: 'center', justifyContent: 'center' },
  targetSection: { marginTop: 8, marginBottom: 20 },
  targetHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  targetLabel: { fontSize: 10, fontWeight: '800', color: 'rgba(255,255,255,0.4)', letterSpacing: 1 },
  primaryButton: { height: 54, borderRadius: 16, overflow: 'hidden', marginTop: 8 },
  buttonGradient: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  primaryButtonText: { color: '#FFF', fontWeight: '900', fontSize: 14, letterSpacing: 1 },
  historyHeader: { marginTop: 32, marginBottom: 20, flexDirection: 'row', alignItems: 'center', gap: 16 },
  historyTitle: { fontSize: 12, fontWeight: '900', color: 'rgba(255,255,255,0.3)', letterSpacing: 2 },
  historyLine: { flex: 1, height: 1, backgroundColor: 'rgba(255,255,255,0.05)' },
  listContent: { paddingBottom: 120 },
  itemCardContainer: { marginHorizontal: 20, marginBottom: 12 },
  itemCard: { flexDirection: 'row', alignItems: 'center', padding: 20, backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: 24, borderWidth: 1, borderColor: 'rgba(255,255,255,0.04)', gap: 16 },
  iconCircle: { width: 50, height: 50, borderRadius: 18, backgroundColor: 'rgba(139, 92, 246, 0.1)', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(139, 92, 246, 0.2)' },
  itemInfo: { flex: 1 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  itemTitle: { fontSize: 17, fontWeight: '800', color: '#FFF' },
  typeBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6, backgroundColor: 'rgba(255,255,255,0.05)' },
  typeText: { fontSize: 9, fontWeight: '900', color: 'rgba(255,255,255,0.4)' },
  itemMeta: { fontSize: 12, color: 'rgba(255,255,255,0.3)', marginTop: 6, fontWeight: '600' },
  itemFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 },
  targetPill: { backgroundColor: 'rgba(255,255,255,0.03)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  targetText: { fontSize: 10, fontWeight: '700', color: 'rgba(255,255,255,0.4)' },
  editBtn: { width: 36, height: 36, borderRadius: 12, backgroundColor: 'rgba(139, 92, 246, 0.05)', alignItems: 'center', justifyContent: 'center' },
  modalOverlay: { flex: 1, justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: '#1E293B', borderRadius: 20, padding: 20, maxHeight: '80%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  modalTitle: { color: '#FFF', fontSize: 18, fontWeight: '700' },
  searchInput: { backgroundColor: 'rgba(255,255,255,0.05)', color: '#FFF', borderRadius: 12, padding: 12, marginBottom: 12 },
  collegeItem: { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.1)' },
  collegeName: { color: '#FFF', fontSize: 16, fontWeight: '600' },
  collegeLoc: { color: 'rgba(255,255,255,0.5)', fontSize: 12, marginTop: 4 }
});
