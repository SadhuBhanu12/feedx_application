import { useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View, ActivityIndicator, ScrollView } from 'react-native';
import { COLORS, FONT, RADIUS, SHADOWS, SPACING } from '@/constants/theme';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { uploadResourceFile } from '@/services/supabaseService';
import { supabase } from '@/lib/supabase';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import Animated, { FadeInDown, FadeInRight, Layout } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import * as DocumentPicker from 'expo-document-picker';
import { useUser } from '@/context/UserContext';

interface CollegeItem {
  id: string;
  name: string;
  location: string;
  placements: string;
  rating: string | number;
  website: string;
  brochure_url: string;
}

export default function AdminCollegesScreen() {
  const router = useRouter();
  const { user } = useUser();
  const [items, setItems] = useState<CollegeItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const [form, setForm] = useState({ 
    id: '', name: '', location: '', placements: '', rating: '4.5', website: '', brochure_url: '' 
  });

  const setFormRow = (item: CollegeItem) => {
    setForm({
      id: item.id || '',
      name: item.name || '',
      location: item.location || '',
      placements: item.placements || '',
      rating: String(item.rating || '4.5'),
      website: item.website || '',
      brochure_url: item.brochure_url || '',
    });
  };

  const isCollegeAdmin = !!user?.college_id;

  const loadItems = async () => {
    setLoading(true);
    try {
      let query = supabase.from('colleges').select('*');
      if (user?.college_id) {
        query = query.eq('id', user.college_id);
      }
      const { data, error } = await query.order('name');
      if (error) throw error;
      setItems(data || []);
    } catch (e: any) {
      console.log('Colleges load error', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();

    const channel = supabase.channel(`admin-colleges-realtime-${Date.now()}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'colleges' },
        () => {
          loadItems();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.college_id]);

  useEffect(() => {
    if (isCollegeAdmin && items.length > 0) {
      const myCol = items[0];
      setForm({
        id: myCol.id,
        name: myCol.name,
        location: myCol.location,
        placements: myCol.placements || '',
        rating: String(myCol.rating || '4.5'),
        website: myCol.website || '',
        brochure_url: myCol.brochure_url || '',
      });
    }
  }, [items, isCollegeAdmin]);

  const handlePickBrochure = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: 'application/pdf' });
      if (!result.canceled && result.assets && result.assets[0]) {
        setUploading(true);
        const file = result.assets[0];
        const fileName = `brochure_${Date.now()}_${file.name}`;
        const url = await uploadResourceFile(file.uri, fileName, 'application/pdf');
        setForm(f => ({ ...f, brochure_url: url }));
        Alert.alert('Uploaded', 'Brochure uploaded successfully.');
      }
    } catch (e: any) {
      Alert.alert('Upload Failed', e.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      return Alert.alert('Validation Error', 'College Name is required.');
    }
    setSyncing(true);
    try {
      const payload: any = {
        name: form.name.trim(),
        location: form.location.trim(),
        placements: form.placements.trim(),
        rating: parseFloat(form.rating) || 4.5,
        website: form.website.trim(),
        brochure_url: form.brochure_url.trim(),
      };
      // Only include id if it exists (meaning it's an update), otherwise omit for auto-generation
      if (form.id && form.id.trim() !== '') {
        payload.id = form.id;
      }

      const { error } = await supabase.from('colleges').upsert(payload);
      if (error) throw error;

      Alert.alert('Success', 'College profile updated successfully!');
      if (!isCollegeAdmin) {
        setForm({ id: '', name: '', location: '', placements: '', rating: '4.5', website: '', brochure_url: '' });
      }
      loadItems();
    } catch (e: any) {
      Alert.alert('Save Failed', e.message);
    } finally {
      setSyncing(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (isCollegeAdmin) {
      return Alert.alert('Permission Denied', 'College Admins cannot delete institutions.');
    }
    Alert.alert('Delete College', 'Are you sure? This will delete all branches, students, and materials associated with this college.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
        setLoading(true);
        try {
          const { error } = await supabase.from('colleges').delete().eq('id', id);
          if (error) throw error;
          loadItems();
        } catch (e: any) {
          Alert.alert('Failed', e.message);
        } finally {
          setLoading(false);
        }
      }},
    ]);
  };

  const renderEditorForm = () => (
    <BlurView intensity={10} tint="light" style={styles.card}>
      <Text style={styles.sectionTitle}>
        {isCollegeAdmin ? 'Edit College Profile' : 'Institution Editor'}
      </Text>
      
      <View style={styles.field}>
        <Text style={styles.label}>College Name</Text>
        <TextInput 
          style={[styles.input, isCollegeAdmin && styles.disabledInput]} 
          value={form.name} 
          onChangeText={t => setForm(f => ({ ...f, name: t }))} 
          placeholder="e.g. Govt Polytechnic" 
          placeholderTextColor="rgba(255,255,255,0.3)" 
          editable={!isCollegeAdmin}
        />
      </View>

      <View style={styles.inputGrid}>
        <View style={styles.inputWrapper}>
          <Text style={styles.label}>Location</Text>
          <TextInput style={styles.input} value={form.location} onChangeText={t => setForm(f => ({ ...f, location: t }))} placeholder="City, State" placeholderTextColor="rgba(255,255,255,0.3)" />
        </View>
        <View style={styles.inputWrapper}>
          <Text style={styles.label}>Rating</Text>
          <TextInput style={styles.input} value={form.rating} onChangeText={t => setForm(f => ({ ...f, rating: t }))} placeholder="4.5" placeholderTextColor="rgba(255,255,255,0.3)" keyboardType="numeric" />
        </View>
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Placements Overview</Text>
        <TextInput style={styles.input} value={form.placements} onChangeText={t => setForm(f => ({ ...f, placements: t }))} placeholder="High placement records..." placeholderTextColor="rgba(255,255,255,0.3)" />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Website / URL</Text>
        <TextInput style={styles.input} value={form.website} onChangeText={t => setForm(f => ({ ...f, website: t }))} placeholder="https://college.edu" placeholderTextColor="rgba(255,255,255,0.3)" autoCapitalize="none" />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>College Brochure (PDF)</Text>
        <View style={styles.uploadRow}>
           <TextInput style={[styles.input, { flex: 1, borderTopRightRadius: 0, borderBottomRightRadius: 0 }]} value={form.brochure_url} onChangeText={t => setForm(f => ({ ...f, brochure_url: t }))} placeholder="https://..." placeholderTextColor="rgba(255,255,255,0.3)" autoCapitalize="none" />
           <TouchableOpacity style={styles.uploadTrigger} onPress={handlePickBrochure} disabled={uploading}>
              {uploading ? <ActivityIndicator color="#FFF" size="small" /> : <Feather name="file-plus" size={20} color="#FFF" />}
           </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity style={styles.primaryButton} onPress={handleSave} disabled={syncing}>
        <LinearGradient colors={['#3B82F6', '#2563EB']} style={styles.buttonGradient}>
           {syncing ? <ActivityIndicator color="#FFF" size="small" /> : <Text style={styles.primaryButtonText}>Sync College Data</Text>}
        </LinearGradient>
      </TouchableOpacity>
    </BlurView>
  );

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#0F172A', '#1E293B']} style={StyleSheet.absoluteFillObject} />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
           <Feather name="chevron-left" size={24} color="#FFF" />
        </TouchableOpacity>
        <View style={styles.headerText}>
          <Text style={styles.headerTitle}>College Profile</Text>
          <Text style={styles.headerSubtitle}>Manage Institution Details</Text>
        </View>
      </View>

      {isCollegeAdmin ? (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {renderEditorForm()}
        </ScrollView>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id.toString()}
          refreshing={loading}
          onRefresh={loadItems}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={
            <Animated.View entering={FadeInDown} style={styles.headerContent}>
              {renderEditorForm()}
              <Text style={styles.listTitle}>Registered Colleges</Text>
            </Animated.View>
          }
          renderItem={({ item, index }) => (
            <Animated.View entering={FadeInRight.delay(index * 100)} style={styles.itemCardContainer}>
              <BlurView intensity={8} tint="light" style={styles.itemCard}>
                <View style={styles.itemMain}>
                  <Text style={styles.itemTitle}>{item.name}</Text>
                  <Text style={styles.itemMeta}>{item.location} • {item.rating} ⭐</Text>
                  {item.brochure_url && <Text style={styles.brochureTag}>Brochure Available</Text>}
                </View>
                <View style={styles.itemActions}>
                  <TouchableOpacity style={styles.actionBtn} onPress={() => setFormRow(item)}>
                    <Feather name="edit-3" size={16} color="#FFF" />
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.actionBtn, { backgroundColor: 'rgba(239, 68, 68, 0.1)' }]} onPress={() => handleDelete(item.id)}>
                    <Feather name="trash-2" size={16} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              </BlurView>
            </Animated.View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A' },
  header: { paddingTop: 60, paddingHorizontal: 24, paddingBottom: 20, flexDirection: 'row', alignItems: 'center', gap: 16 },
  headerText: { flex: 1 },
  headerTitle: { fontSize: 24, fontWeight: '900', color: '#FFF' },
  headerSubtitle: { fontSize: 12, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: 1 },
  headerContent: { padding: 20 },
  card: { padding: 24, borderRadius: 24, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', overflow: 'hidden' },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: '#FFF', marginBottom: 20 },
  field: { marginBottom: 16 },
  label: { fontSize: 10, fontWeight: '700', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', marginBottom: 8, letterSpacing: 0.5 },
  input: { height: 48, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 12, paddingHorizontal: 16, color: '#FFF', fontSize: 15, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  disabledInput: { backgroundColor: 'rgba(255,255,255,0.02)', opacity: 0.6 },
  scrollContent: { padding: 24, paddingBottom: 120 },
  inputGrid: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  inputWrapper: { flex: 1 },
  uploadRow: { flexDirection: 'row', alignItems: 'center' },
  uploadTrigger: { width: 56, height: 48, backgroundColor: '#3B82F6', borderTopRightRadius: 12, borderBottomRightRadius: 12, alignItems: 'center', justifyContent: 'center' },
  primaryButton: { height: 52, borderRadius: 16, overflow: 'hidden', marginTop: 10 },
  buttonGradient: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  primaryButtonText: { color: '#fff', fontWeight: '800', fontSize: 15 },
  listTitle: { color: '#FFF', fontSize: 18, fontWeight: '800', marginTop: 32, marginBottom: 8, marginLeft: 4 },
  listContent: { paddingBottom: 120 },
  itemCardContainer: { marginHorizontal: 20, marginBottom: 12, borderRadius: 20, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  itemCard: { flexDirection: 'row', padding: 20, alignItems: 'center' },
  itemMain: { flex: 1 },
  itemTitle: { color: '#FFF', fontSize: 17, fontWeight: '800' },
  itemMeta: { color: 'rgba(255,255,255,0.4)', fontSize: 13, marginTop: 4 },
  brochureTag: { color: '#10B981', fontSize: 10, fontWeight: '700', marginTop: 4 },
  itemActions: { flexDirection: 'row', gap: 8 },
  actionBtn: { width: 38, height: 38, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.08)', alignItems: 'center', justifyContent: 'center' }
});
