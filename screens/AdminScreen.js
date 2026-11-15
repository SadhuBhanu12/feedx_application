import React, { useState, useEffect } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator
} from 'react-native';
import { useUser } from '@/context/UserContext';
import { useTheme } from '@/context/ThemeContext';
import { supabase } from '@/lib/supabase';
import { withTimeout } from '@/services/supabaseService';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown, Layout, SlideInRight } from 'react-native-reanimated';
import { COLORS } from '@/constants/theme';

const ALL_TABS = ['Opportunity', 'Resource', 'Notification', 'Timetable', 'College', 'Issue'];

const TabButton = ({ label, active, onPress, colors }) => (
  <TouchableOpacity onPress={onPress} style={{ marginRight: 8 }} activeOpacity={0.8}>
    <Animated.View layout={Layout.springify()} style={[
      styles.tabBtn, 
      { backgroundColor: active ? '#2563EB' : colors.card, borderColor: active ? '#2563EB' : colors.cardBorder }
    ]}>
      <Text style={[styles.tabText, { color: active ? '#FFFFFF' : colors.textSecondary }]}>{label}</Text>
    </Animated.View>
  </TouchableOpacity>
);

export default function AdminScreen() {
  const router = useRouter();
  const { user } = useUser();
  const { colors, isDark } = useTheme();

  const role = String(user?.role || '').trim().toLowerCase();
  const isAdmin = ['admin', 'super_admin', 'inst_admin', 'college_admin', 'campus_admin'].includes(role);
  const isSuperAdmin = role === 'super_admin';

  useEffect(() => {
    if (!user || !isAdmin) {
      Alert.alert('Access Denied', 'Administrative privileges are required to access this dashboard.');
      router.replace('/(tabs)');
    }
  }, [user, isAdmin, router]);

  const visibleTabs = isSuperAdmin 
    ? ALL_TABS 
    : ['Opportunity', 'Resource', 'Notification', 'Issue'];

  const [activeTab, setActiveTab] = useState('Opportunity');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isSuperAdmin && (activeTab === 'Timetable' || activeTab === 'College')) {
      setActiveTab('Opportunity');
    }
  }, [isSuperAdmin, activeTab]);

  if (!user || !isAdmin) {
    return null;
  }

  useEffect(() => {
    if (!user?.id) return;
    const channel = supabase.channel(`admin-dashboard-rt-${Date.now()}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'users', filter: `id=eq.${user.id}` }, () => {})
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
    if (!oppTitle || !company) return Alert.alert('Required Fields Missing', 'Please enter both opportunity title and company name.');
    setLoading(true);
    try {
      const oppPayload = {
        title: oppTitle, company, type: oppType, location: 'Remote', stipend: 'Unpaid'
      };
      if (user?.college_id) {
        oppPayload.college_id = user.college_id;
      }
      await withTimeout(supabase.from('opportunities').insert([oppPayload]));
      Alert.alert('Success 🎉', 'Opportunity published to live student feed.');
      setOppTitle(''); setCompany('');
    } catch (e) { Alert.alert('Error', e.message); }
    finally { setLoading(false); }
  };

  const handleAddNotification = async () => {
    if (!notifTitle || !notifMsg) return Alert.alert('Required Fields Missing', 'Please provide notification title and message.');
    setLoading(true);
    try {
      const notifPayload = {
        user_id: user?.id, title: notifTitle, message: notifMsg, type: notifType
      };
      if (user?.college_id) {
        notifPayload.college_id = user.college_id;
      }
      await withTimeout(supabase.from('notifications').insert([notifPayload]));
      Alert.alert('Success 🎉', 'Notification broadcasted.');
      setNotifTitle(''); setNotifMsg('');
    } catch (e) { Alert.alert('Error', e.message); }
    finally { setLoading(false); }
  };

  const handleAddTimetable = async () => {
    if (!isSuperAdmin) return Alert.alert('Access Restricted', 'Academic Roadmap configuration is reserved for Super Admins.');
    if (!ttSubject) return Alert.alert('Required Fields Missing', 'Please enter subject name.');
    setLoading(true);
    try {
      await supabase.from('timetables').insert([{
        day_of_week: ttDay, subject_name: ttSubject, start_time: ttTime
      }]);
      Alert.alert('Success 🎉', 'Class schedule saved.');
      setTtSubject('');
    } catch (e) { Alert.alert('Error', e.message); }
    finally { setLoading(false); }
  };

  const handleAddCollege = async () => {
    if (!isSuperAdmin) return Alert.alert('Access Restricted', 'College Profile management is reserved for Super Admins.');
    if (!colName || !colLocation) return Alert.alert('Required Fields Missing', 'College name and location are required.');
    setLoading(true);
    try {
      await supabase.from('colleges').insert([{
        college_name: colName, location: colLocation, type: colType, fee: colFee, description: colDesc
      }]);
      Alert.alert('Success 🎉', 'College profile created.');
      setColName(''); setColLocation(''); setColFee(''); setColDesc('');
    } catch (e) { Alert.alert('Error', e.message); }
    finally { setLoading(false); }
  };

  const handleAddResource = async () => {
    if (!resTitle || !resUrl) return Alert.alert('Required Fields Missing', 'Resource title and file URL are required.');
    setLoading(true);
    try {
      const resPayload = {
        title: resTitle,
        file_url: resUrl,
        type: resType,
        uploaded_by: user?.id
      };
      if (user?.college_id) {
        resPayload.college_id = user.college_id;
      }
      await supabase.from('resources').insert([resPayload]);
      Alert.alert('Success 🎉', 'Academic resource uploaded.');
      setResTitle(''); setResUrl('');
    } catch (e) { Alert.alert('Error', e.message); }
    finally { setLoading(false); }
  };

  const renderIconForTab = () => {
    switch(activeTab) {
      case 'Opportunity': return <Ionicons name="briefcase" size={24} color="#2563EB" />;
      case 'Notification': return <Ionicons name="notifications" size={24} color="#2563EB" />;
      case 'Timetable': return <Ionicons name="calendar" size={24} color="#2563EB" />;
      case 'College': return <Ionicons name="school" size={24} color="#2563EB" />;
      case 'Resource': return <Ionicons name="book" size={24} color="#2563EB" />;
      default: return <Ionicons name="settings" size={24} color="#2563EB" />;
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={[styles.container, { backgroundColor: colors.background }]}>
      {isDark && <LinearGradient colors={['#0F172A', '#020617']} style={StyleSheet.absoluteFill} />}

      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.cardBorder }]}>
        <TouchableOpacity 
          style={[styles.backBtn, { backgroundColor: colors.card, borderColor: colors.cardBorder }]} 
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Feather name="arrow-left" size={20} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.textPrimary }]}>System Control Panel</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabScroll}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {visibleTabs.map(tab => (
            <TabButton key={tab} label={tab} active={activeTab === tab} onPress={() => setActiveTab(tab)} colors={colors} />
          ))}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header Info */}
        <Animated.View entering={FadeInDown.duration(400)} style={styles.headerBox}>
          <View style={[styles.iconCircle, { backgroundColor: isDark ? 'rgba(37, 99, 235, 0.15)' : '#EFF6FF', borderColor: isDark ? 'rgba(37, 99, 235, 0.3)' : '#DBEAFE' }]}>
            {renderIconForTab()}
          </View>
          <Text style={[styles.subTitle, { color: colors.textPrimary }]}>Publish {activeTab}</Text>
          <Text style={[styles.descText, { color: colors.textMuted }]}>Create and distribute academic content in real-time.</Text>
        </Animated.View>

        {/* 1. Opportunity Form */}
        {activeTab === 'Opportunity' && (
          <Animated.View entering={SlideInRight.duration(350)} style={[styles.formCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.textMuted }]}>Opportunity Title</Text>
              <TextInput 
                style={[styles.input, { backgroundColor: colors.inputBg, borderColor: colors.cardBorder, color: colors.textPrimary }]} 
                placeholderTextColor={colors.textMuted} 
                placeholder="e.g. Frontend Developer Intern" 
                value={oppTitle} 
                onChangeText={setOppTitle} 
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.textMuted }]}>Company / Organization</Text>
              <TextInput 
                style={[styles.input, { backgroundColor: colors.inputBg, borderColor: colors.cardBorder, color: colors.textPrimary }]} 
                placeholderTextColor={colors.textMuted} 
                placeholder="e.g. Google India" 
                value={company} 
                onChangeText={setCompany} 
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.textMuted }]}>Type (Job / Internship / Hackathon)</Text>
              <TextInput 
                style={[styles.input, { backgroundColor: colors.inputBg, borderColor: colors.cardBorder, color: colors.textPrimary }]} 
                placeholderTextColor={colors.textMuted} 
                value={oppType} 
                onChangeText={setOppType} 
              />
            </View>
            <TouchableOpacity style={styles.submitBtn} onPress={handleAddOpportunity} disabled={loading} activeOpacity={0.85}>
              <LinearGradient colors={['#2563EB', '#1D4ED8']} style={styles.submitBtnInner}>
                {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.submitText}>Publish Opportunity</Text>}
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        )}

        {/* 2. Notification Form */}
        {activeTab === 'Notification' && (
          <Animated.View entering={SlideInRight.duration(350)} style={[styles.formCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.textMuted }]}>Broadcast Title</Text>
              <TextInput 
                style={[styles.input, { backgroundColor: colors.inputBg, borderColor: colors.cardBorder, color: colors.textPrimary }]} 
                placeholderTextColor={colors.textMuted} 
                placeholder="e.g. Semester Exam Timetable Released" 
                value={notifTitle} 
                onChangeText={setNotifTitle} 
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.textMuted }]}>Broadcast Message</Text>
              <TextInput 
                style={[styles.input, { height: 100, paddingTop: 14, backgroundColor: colors.inputBg, borderColor: colors.cardBorder, color: colors.textPrimary }]} 
                multiline 
                placeholderTextColor={colors.textMuted} 
                placeholder="Provide detailed information for students..." 
                value={notifMsg} 
                onChangeText={setNotifMsg} 
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.textMuted }]}>Notification Type (Event / Exam / Job / System)</Text>
              <TextInput 
                style={[styles.input, { backgroundColor: colors.inputBg, borderColor: colors.cardBorder, color: colors.textPrimary }]} 
                placeholderTextColor={colors.textMuted} 
                value={notifType} 
                onChangeText={setNotifType} 
              />
            </View>
            <TouchableOpacity style={styles.submitBtn} onPress={handleAddNotification} disabled={loading} activeOpacity={0.85}>
              <LinearGradient colors={['#2563EB', '#1D4ED8']} style={styles.submitBtnInner}>
                {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.submitText}>Send Campus Broadcast</Text>}
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        )}

        {/* 3. Timetable Form */}
        {activeTab === 'Timetable' && (
          <Animated.View entering={SlideInRight.duration(350)} style={[styles.formCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={[styles.label, { color: colors.textMuted }]}>Branch</Text>
                <TextInput 
                  style={[styles.input, { backgroundColor: colors.inputBg, borderColor: colors.cardBorder, color: colors.textPrimary }]} 
                  placeholderTextColor={colors.textMuted} 
                  value={ttBranch} 
                  onChangeText={setTtBranch} 
                />
              </View>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={[styles.label, { color: colors.textMuted }]}>Year</Text>
                <TextInput 
                  style={[styles.input, { backgroundColor: colors.inputBg, borderColor: colors.cardBorder, color: colors.textPrimary }]} 
                  placeholderTextColor={colors.textMuted} 
                  value={ttYear} 
                  onChangeText={setTtYear} 
                />
              </View>
            </View>
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.textMuted }]}>Day of Week</Text>
              <TextInput 
                style={[styles.input, { backgroundColor: colors.inputBg, borderColor: colors.cardBorder, color: colors.textPrimary }]} 
                placeholderTextColor={colors.textMuted} 
                value={ttDay} 
                onChangeText={setTtDay} 
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.textMuted }]}>Time Slot</Text>
              <TextInput 
                style={[styles.input, { backgroundColor: colors.inputBg, borderColor: colors.cardBorder, color: colors.textPrimary }]} 
                placeholderTextColor={colors.textMuted} 
                value={ttTime} 
                onChangeText={setTtTime} 
                placeholder="09:00 - 10:00 AM" 
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.textMuted }]}>Subject / Lab</Text>
              <TextInput 
                style={[styles.input, { backgroundColor: colors.inputBg, borderColor: colors.cardBorder, color: colors.textPrimary }]} 
                placeholderTextColor={colors.textMuted} 
                value={ttSubject} 
                onChangeText={setTtSubject} 
                placeholder="e.g. Data Structures & Algorithms" 
              />
            </View>
            <TouchableOpacity style={styles.submitBtn} onPress={handleAddTimetable} disabled={loading} activeOpacity={0.85}>
              <LinearGradient colors={['#2563EB', '#1D4ED8']} style={styles.submitBtnInner}>
                {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.submitText}>Add Subject to Schedule</Text>}
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        )}

        {/* 4. College Form */}
        {activeTab === 'College' && (
          <Animated.View entering={SlideInRight.duration(350)} style={[styles.formCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.textMuted }]}>College Name</Text>
              <TextInput 
                style={[styles.input, { backgroundColor: colors.inputBg, borderColor: colors.cardBorder, color: colors.textPrimary }]} 
                placeholderTextColor={colors.textMuted} 
                placeholder="e.g. Govt Polytechnic Hyderabad" 
                value={colName} 
                onChangeText={setColName} 
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.textMuted }]}>Location</Text>
              <TextInput 
                style={[styles.input, { backgroundColor: colors.inputBg, borderColor: colors.cardBorder, color: colors.textPrimary }]} 
                placeholderTextColor={colors.textMuted} 
                placeholder="e.g. Hyderabad, Telangana" 
                value={colLocation} 
                onChangeText={setColLocation} 
              />
            </View>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={[styles.label, { color: colors.textMuted }]}>Type (Govt / Private)</Text>
                <TextInput 
                  style={[styles.input, { backgroundColor: colors.inputBg, borderColor: colors.cardBorder, color: colors.textPrimary }]} 
                  placeholderTextColor={colors.textMuted} 
                  value={colType} 
                  onChangeText={setColType} 
                />
              </View>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={[styles.label, { color: colors.textMuted }]}>Annual Fee</Text>
                <TextInput 
                  style={[styles.input, { backgroundColor: colors.inputBg, borderColor: colors.cardBorder, color: colors.textPrimary }]} 
                  placeholderTextColor={colors.textMuted} 
                  placeholder="e.g. ₹3,500" 
                  value={colFee} 
                  onChangeText={setColFee} 
                />
              </View>
            </View>
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.textMuted }]}>Description</Text>
              <TextInput 
                style={[styles.input, { height: 90, paddingTop: 12, backgroundColor: colors.inputBg, borderColor: colors.cardBorder, color: colors.textPrimary }]} 
                multiline 
                placeholderTextColor={colors.textMuted} 
                placeholder="Short overview of the institution..." 
                value={colDesc} 
                onChangeText={setColDesc} 
              />
            </View>
            <TouchableOpacity style={styles.submitBtn} onPress={handleAddCollege} disabled={loading} activeOpacity={0.85}>
              <LinearGradient colors={['#2563EB', '#1D4ED8']} style={styles.submitBtnInner}>
                {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.submitText}>Register College Profile</Text>}
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        )}

        {/* 5. Resource Form */}
        {activeTab === 'Resource' && (
          <Animated.View entering={SlideInRight.duration(350)} style={[styles.formCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.textMuted }]}>Resource Title</Text>
              <TextInput 
                style={[styles.input, { backgroundColor: colors.inputBg, borderColor: colors.cardBorder, color: colors.textPrimary }]} 
                placeholderTextColor={colors.textMuted} 
                placeholder="e.g. ANN Unit 1 Lecture Notes" 
                value={resTitle} 
                onChangeText={setResTitle} 
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.textMuted }]}>File / Drive URL</Text>
              <TextInput 
                style={[styles.input, { backgroundColor: colors.inputBg, borderColor: colors.cardBorder, color: colors.textPrimary }]} 
                placeholderTextColor={colors.textMuted} 
                placeholder="https://drive.google.com/..." 
                value={resUrl} 
                onChangeText={setResUrl} 
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.textMuted }]}>Resource Type (Notes / Papers / Syllabus)</Text>
              <TextInput 
                style={[styles.input, { backgroundColor: colors.inputBg, borderColor: colors.cardBorder, color: colors.textPrimary }]} 
                placeholderTextColor={colors.textMuted} 
                value={resType} 
                onChangeText={setResType} 
              />
            </View>
            <TouchableOpacity style={styles.submitBtn} onPress={handleAddResource} disabled={loading} activeOpacity={0.85}>
              <LinearGradient colors={['#2563EB', '#1D4ED8']} style={styles.submitBtnInner}>
                {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.submitText}>Publish Academic Resource</Text>}
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        )}

        {/* 6. Issue / Student Support Hub */}
        {activeTab === 'Issue' && (
          <Animated.View entering={SlideInRight.duration(350)} style={[styles.formCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
            <View style={{ alignItems: 'center', marginBottom: 20 }}>
              <Ionicons name="chatbubbles-outline" size={48} color="#2563EB" />
              <Text style={[styles.subTitle, { textAlign: 'center', color: colors.textPrimary }]}>Student Support & Issues</Text>
              <Text style={[styles.descText, { textAlign: 'center', color: colors.textMuted }]}>
                Review, triage, and respond to institutional issues and student tickets.
              </Text>
            </View>
            <TouchableOpacity 
              style={styles.submitBtn} 
              onPress={() => router.push('/admin-issues')}
              activeOpacity={0.85}
            >
              <LinearGradient colors={['#2563EB', '#1D4ED8']} style={styles.submitBtnInner}>
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
  container: { flex: 1 },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingTop: Platform.OS === 'ios' ? 44 : 14, 
    paddingHorizontal: 20, 
    paddingBottom: 14, 
    borderBottomWidth: 1 
  },
  backBtn: { 
    width: 38, 
    height: 38, 
    borderRadius: 12, 
    alignItems: 'center', 
    justifyContent: 'center', 
    borderWidth: 1 
  },
  title: { 
    fontSize: 18, 
    fontWeight: '900', 
    marginLeft: 14 
  },
  tabScroll: { 
    paddingHorizontal: 20, 
    paddingVertical: 12 
  },
  tabBtn: { 
    paddingHorizontal: 16, 
    paddingVertical: 9, 
    borderRadius: 12, 
    borderWidth: 1 
  },
  tabText: { 
    fontWeight: '800', 
    fontSize: 13 
  },
  scrollContent: { 
    padding: 20, 
    paddingBottom: 100 
  },
  headerBox: { 
    marginBottom: 20 
  },
  iconCircle: { 
    width: 52, 
    height: 52, 
    borderRadius: 16, 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginBottom: 12, 
    borderWidth: 1 
  },
  subTitle: { 
    fontSize: 20, 
    fontWeight: '900', 
    marginBottom: 4 
  },
  descText: { 
    fontSize: 13, 
    fontWeight: '500' 
  },
  formCard: { 
    padding: 20, 
    borderRadius: 22, 
    borderWidth: 1, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.05, 
    shadowRadius: 8, 
    elevation: 2 
  },
  inputGroup: { 
    marginBottom: 14 
  },
  label: { 
    fontSize: 11, 
    fontWeight: '800', 
    marginBottom: 6, 
    textTransform: 'uppercase', 
    letterSpacing: 0.5 
  },
  input: { 
    height: 48, 
    borderWidth: 1, 
    borderRadius: 12, 
    paddingHorizontal: 14, 
    fontSize: 14, 
    fontWeight: '600' 
  },
  submitBtn: { 
    marginTop: 8, 
    borderRadius: 14, 
    overflow: 'hidden' 
  },
  submitBtnInner: { 
    height: 50, 
    borderRadius: 14, 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  submitText: { 
    color: '#FFF', 
    fontSize: 14.5, 
    fontWeight: '800' 
  }
});
