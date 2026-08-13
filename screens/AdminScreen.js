import { COLORS, FONT, RADIUS, SHADOWS, SPACING } from '@/constants/theme';
import { useUser } from '@/context/UserContext';
import { supabase } from '@/lib/supabase';
import { withTimeout } from '@/services/supabaseService';
import { Feather, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { ButtonLoading } from '@/components/ui/Loaders';
import Animated, { FadeInDown, Layout, SlideInRight } from 'react-native-reanimated';

const TABS = ['Opportunity', 'Resource', 'Notification', 'Timetable', 'College', 'Issue'];

const TabButton = ({ label, active, onPress }) => (
  <TouchableOpacity onPress={onPress} style={{ marginRight: SPACING.sm }} activeOpacity={0.8}>
    <Animated.View layout={Layout.springify()} style={[styles.tabBtn, active && styles.tabBtnActive]}>
      {active && (
        <LinearGradient colors={COLORS.gradientPrimary} style={StyleSheet.absoluteFillObject} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} />
      )}
      <Text style={[styles.tabText, active && styles.tabTextActive]}>{label}</Text>
    </Animated.View>
  </TouchableOpacity>
);

export default function AdminScreen() {
  const router = useRouter();
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState('Opportunity');
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (!user?.id) return;
    const channel = supabase.channel(`admin-dashboard-rt-${Date.now()}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'users', filter: `id=eq.${user.id}` }, () => {
        // This will trigger a re-render if the user context updates
      })
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, [user?.id]);

  // Opp Form
  const [oppTitle, setOppTitle] = useState('');
  const [company, setCompany] = useState('');
  const [oppType, setOppType] = useState('Internship');

  // Notif Form
  const [notifTitle, setNotifTitle] = useState('');
  const [notifMsg, setNotifMsg] = useState('');
  const [notifType, setNotifType] = useState('Event');

  // Timetable Form
  const [ttBranch, setTtBranch] = useState('CSE');
  const [ttYear, setTtYear] = useState('3');
  const [ttDay, setTtDay] = useState('Monday');
  const [ttSubject, setTtSubject] = useState('');
  const [ttTime, setTtTime] = useState('09:00 - 10:00');

  // College Form
  const [colName, setColName] = useState('');
  const [colLocation, setColLocation] = useState('');
  const [colType, setColType] = useState('Private');
  const [colFee, setColFee] = useState('');
  const [colDesc, setColDesc] = useState('');

  // Resource Form
  const [resTitle, setResTitle] = useState('');
  const [resUrl, setResUrl] = useState('');
  const [resType, setResType] = useState('Notes');

  const handleAddOpportunity = async () => {
    if (!oppTitle || !company) return Alert.alert('Error', 'Required fields missing.');
    setLoading(true);
    try {
      await withTimeout(supabase.from('opportunities').insert([{
        title: oppTitle, company, type: oppType, location: 'Remote', stipend: 'Unpaid'
      }]));
      Alert.alert('Success', 'Opportunity uploaded.');
      setOppTitle(''); setCompany('');
    } catch (e) { Alert.alert('Error', e.message); }
    finally { setLoading(false); }
  };

  const handleAddNotification = async () => {
    if (!notifTitle || !notifMsg) return Alert.alert('Error', 'Required fields missing.');
    setLoading(true);
    try {
      await withTimeout(supabase.from('notifications').insert([{
        user_id: user.id, title: notifTitle, message: notifMsg, type: notifType
      }]));
      Alert.alert('Success', 'Notification broadcasted.');
      setNotifTitle(''); setNotifMsg('');
    } catch (e) { Alert.alert('Error', e.message); }
    finally { setLoading(false); }
  };

  const handleAddTimetable = async () => {
    if (!ttSubject) return Alert.alert('Error', 'Required fields missing.');
    setLoading(true);
    try {
      await supabase.from('timetables').insert([{
        day_of_week: ttDay, subject_name: ttSubject, start_time: ttTime
      }]);
      Alert.alert('Success', 'Subject added to schedule.');
      setTtSubject('');
    } catch (e) { Alert.alert('Error', e.message); }
    finally { setLoading(false); }
  };

  const handleAddCollege = async () => {
    if (!colName || !colLocation) return Alert.alert('Error', 'Name and Location are required.');
    setLoading(true);
    try {
      await supabase.from('colleges').insert([{
        college_name: colName, location: colLocation, type: colType, fee: colFee, description: colDesc
      }]);
      Alert.alert('Success', 'College profile created successfully.');
      setColName(''); setColLocation(''); setColFee(''); setColDesc('');
    } catch (e) { Alert.alert('Error', e.message); }
    finally { setLoading(false); }
  };

  const handleAddResource = async () => {
    if (!resTitle || !resUrl) return Alert.alert('Error', 'Title and URL are required.');
    setLoading(true);
    try {
      await supabase.from('resources').insert([{
        title: resTitle,
        file_url: resUrl,
        type: resType,
        uploaded_by: user.id
      }]);
      Alert.alert('Success', 'Resource uploaded successfully.');
      setResTitle(''); setResUrl('');
    } catch (e) { Alert.alert('Error', e.message); }
    finally { setLoading(false); }
  };

  const renderIconForTab = () => {
    switch(activeTab) {
      case 'Opportunity': return <Ionicons name="briefcase" size={24} color={COLORS.primary} />;
      case 'Notification': return <Ionicons name="notifications" size={24} color={COLORS.primary} />;
      case 'Timetable': return <Ionicons name="calendar" size={24} color={COLORS.primary} />;
      case 'College': return <Ionicons name="school" size={24} color={COLORS.primary} />;
      default: return <Ionicons name="settings" size={24} color={COLORS.primary} />;
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <LinearGradient colors={COLORS.gradientHome} style={StyleSheet.absoluteFillObject} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Feather name="arrow-left" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.title}>System Control</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabScroll}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {TABS.map(tab => (
            <TabButton key={tab} label={tab} active={activeTab === tab} onPress={() => setActiveTab(tab)} />
          ))}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header Info */}
        <Animated.View entering={FadeInDown.duration(500)} style={styles.headerBox}>
          <View style={styles.iconCircle}>
            {renderIconForTab()}
          </View>
          <Text style={styles.subTitle}>Create {activeTab}</Text>
          <Text style={styles.descText}>Push data directly to the live feed.</Text>
        </Animated.View>

        {/* Form Container */}
        {activeTab === 'Opportunity' && (
          <Animated.View entering={SlideInRight.duration(400)} style={styles.formCard}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Title</Text>
              <TextInput style={styles.input} placeholderTextColor={COLORS.textDisabled} placeholder="Frontend Developer" value={oppTitle} onChangeText={setOppTitle} />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Company</Text>
              <TextInput style={styles.input} placeholderTextColor={COLORS.textDisabled} placeholder="Google" value={company} onChangeText={setCompany} />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Type (Job/Internship)</Text>
              <TextInput style={styles.input} placeholderTextColor={COLORS.textDisabled} value={oppType} onChangeText={setOppType} />
            </View>
            <TouchableOpacity style={styles.submitBtn} onPress={handleAddOpportunity} disabled={loading} activeOpacity={0.8}>
              <LinearGradient colors={COLORS.gradientPrimary} style={styles.submitBtnInner} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                {loading ? <ButtonLoading color="#fff" /> : <Text style={styles.submitText}>Publish Opportunity</Text>}
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        )}

        {activeTab === 'Notification' && (
          <Animated.View entering={SlideInRight.duration(400)} style={styles.formCard}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Broadcast Title</Text>
              <TextInput style={styles.input} placeholderTextColor={COLORS.textDisabled} placeholder="Important Announcement" value={notifTitle} onChangeText={setNotifTitle} />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Message</Text>
              <TextInput style={[styles.input, { height: 100, paddingTop: 14 }]} multiline placeholderTextColor={COLORS.textDisabled} placeholder="Provide details..." value={notifMsg} onChangeText={setNotifMsg} />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Type (Event/Exam/Job/System)</Text>
              <TextInput style={styles.input} placeholderTextColor={COLORS.textDisabled} value={notifType} onChangeText={setNotifType} />
            </View>
            <TouchableOpacity style={styles.submitBtn} onPress={handleAddNotification} disabled={loading} activeOpacity={0.8}>
               <LinearGradient colors={COLORS.gradientPrimary} style={styles.submitBtnInner} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                {loading ? <ButtonLoading color="#fff" /> : <Text style={styles.submitText}>Send Broadcast</Text>}
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        )}

        {activeTab === 'Timetable' && (
          <Animated.View entering={SlideInRight.duration(400)} style={styles.formCard}>
            <View style={{ flexDirection: 'row', gap: SPACING.sm }}>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>Branch</Text>
                <TextInput style={styles.input} placeholderTextColor={COLORS.textDisabled} value={ttBranch} onChangeText={setTtBranch} />
              </View>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>Year</Text>
                <TextInput style={styles.input} placeholderTextColor={COLORS.textDisabled} value={ttYear} onChangeText={setTtYear} keyboardType="numeric" />
              </View>
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Day</Text>
              <TextInput style={styles.input} placeholderTextColor={COLORS.textDisabled} value={ttDay} onChangeText={setTtDay} placeholder="Monday" />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Time Slot</Text>
              <TextInput style={styles.input} placeholderTextColor={COLORS.textDisabled} value={ttTime} onChangeText={setTtTime} placeholder="09:00 - 10:00" />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Subject</Text>
              <TextInput style={styles.input} placeholderTextColor={COLORS.textDisabled} value={ttSubject} onChangeText={setTtSubject} placeholder="Data Structures" />
            </View>
            <TouchableOpacity style={styles.submitBtn} onPress={handleAddTimetable} disabled={loading} activeOpacity={0.8}>
               <LinearGradient colors={COLORS.gradientPrimary} style={styles.submitBtnInner} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                {loading ? <ButtonLoading color="#fff" /> : <Text style={styles.submitText}>Add Class</Text>}
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        )}

        {activeTab === 'College' && (
          <Animated.View entering={SlideInRight.duration(400)} style={styles.formCard}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>College Name</Text>
              <TextInput style={styles.input} placeholderTextColor={COLORS.textDisabled} placeholder="e.g. Government Polytechnic" value={colName} onChangeText={setColName} />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Location</Text>
              <TextInput style={styles.input} placeholderTextColor={COLORS.textDisabled} placeholder="e.g. Hyderabad" value={colLocation} onChangeText={setColLocation} />
            </View>
            <View style={{ flexDirection: 'row', gap: SPACING.sm }}>
               <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={styles.label}>Type (Govt/Private)</Text>
                  <TextInput style={styles.input} placeholderTextColor={COLORS.textDisabled} value={colType} onChangeText={setColType} />
               </View>
               <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={styles.label}>Annual Fee</Text>
                  <TextInput style={styles.input} placeholderTextColor={COLORS.textDisabled} placeholder="e.g. ₹3,500" value={colFee} onChangeText={setColFee} />
               </View>
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Description</Text>
              <TextInput style={[styles.input, { height: 100, paddingTop: 14 }]} multiline placeholderTextColor={COLORS.textDisabled} placeholder="Short overview..." value={colDesc} onChangeText={setColDesc} />
            </View>
            <TouchableOpacity style={styles.submitBtn} onPress={handleAddCollege} disabled={loading} activeOpacity={0.8}>
               <LinearGradient colors={COLORS.gradientPrimary} style={styles.submitBtnInner} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                {loading ? <ButtonLoading color="#fff" /> : <Text style={styles.submitText}>Publish College</Text>}
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        )}

        {activeTab === 'Resource' && (
          <Animated.View entering={SlideInRight.duration(400)} style={styles.formCard}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Resource Title</Text>
              <TextInput style={styles.input} placeholderTextColor={COLORS.textDisabled} placeholder="ANN Unit 1 Notes" value={resTitle} onChangeText={setResTitle} />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>File URL (Google Drive/S3)</Text>
              <TextInput style={styles.input} placeholderTextColor={COLORS.textDisabled} placeholder="https://drive.google.com/..." value={resUrl} onChangeText={setResUrl} />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Type (Notes/Papers/Syllabus)</Text>
              <TextInput style={styles.input} placeholderTextColor={COLORS.textDisabled} value={resType} onChangeText={setResType} />
            </View>
            <TouchableOpacity style={styles.submitBtn} onPress={handleAddResource} disabled={loading} activeOpacity={0.8}>
               <LinearGradient colors={COLORS.gradientPrimary} style={styles.submitBtnInner} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                 {loading ? <ButtonLoading color="#fff" /> : <Text style={styles.submitText}>Upload Resource</Text>}
               </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        )}

        {activeTab === 'Issue' && (
          <Animated.View entering={SlideInRight.duration(400)} style={styles.formCard}>
            <View style={{ alignItems: 'center', marginBottom: 20 }}>
               <Ionicons name="chatbubbles-outline" size={48} color={COLORS.primary} />
               <Text style={[styles.subTitle, { textAlign: 'center' }]}>Student Feedback</Text>
               <Text style={[styles.descText, { textAlign: 'center' }]}>Manage and respond to student reports.</Text>
            </View>
            <TouchableOpacity 
              style={styles.submitBtn} 
              onPress={() => router.push('/(tabs)/admin/issues')}
            >
               <LinearGradient colors={COLORS.gradientPrimary} style={styles.submitBtnInner} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                 <Text style={styles.submitText}>Open Issues Console</Text>
               </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        )}

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: 'row', alignItems: 'center', paddingTop: 60, paddingHorizontal: SPACING.lg, paddingBottom: SPACING.md },
  backBtn: { width: 44, height: 44, borderRadius: RADIUS.full, backgroundColor: COLORS.card, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: COLORS.border, ...SHADOWS.small },
  title: { fontSize: FONT.size.xl, fontWeight: FONT.weight.extrabold, color: COLORS.textPrimary, marginLeft: SPACING.md },
  tabScroll: { paddingHorizontal: SPACING.lg, paddingBottom: SPACING.sm },
  tabBtn: { paddingHorizontal: 20, paddingVertical: 12, borderRadius: RADIUS.full, backgroundColor: COLORS.card, borderWidth: 1, borderColor: COLORS.border, overflow: 'hidden' },
  tabBtnActive: { borderColor: 'transparent' },
  tabText: { fontWeight: FONT.weight.bold, color: COLORS.textSecondary, fontSize: FONT.size.sm },
  tabTextActive: { color: '#ffffff' },
  scrollContent: { padding: SPACING.lg, paddingBottom: 100 },
  headerBox: { marginBottom: SPACING.xl },
  iconCircle: { width: 56, height: 56, borderRadius: RADIUS.full, backgroundColor: COLORS.primaryLight, alignItems: 'center', justifyContent: 'center', marginBottom: SPACING.md, ...SHADOWS.medium },
  subTitle: { fontSize: FONT.size.display, fontWeight: FONT.weight.extrabold, color: COLORS.textPrimary, marginBottom: 4 },
  descText: { fontSize: FONT.size.md, color: COLORS.textMuted, fontWeight: FONT.weight.medium },
  formCard: { backgroundColor: COLORS.card, padding: SPACING.xl, borderRadius: RADIUS.xxl, borderWidth: 1, borderColor: COLORS.border, ...SHADOWS.large },
  inputGroup: { marginBottom: SPACING.md },
  label: { fontSize: FONT.size.sm, fontWeight: FONT.weight.bold, color: COLORS.textSecondary, marginBottom: 8, textTransform: 'uppercase' },
  input: { height: 56, backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.borderStrong, borderRadius: RADIUS.xl, paddingHorizontal: SPACING.md, fontSize: FONT.size.md, color: COLORS.textPrimary, fontWeight: FONT.weight.medium },
  submitBtn: { marginTop: SPACING.sm, borderRadius: RADIUS.xl, ...SHADOWS.medium },
  submitBtnInner: { height: 60, borderRadius: RADIUS.xl, alignItems: 'center', justifyContent: 'center' },
  submitText: { color: '#fff', fontSize: FONT.size.lg, fontWeight: FONT.weight.bold }
});
