import React, { useEffect, useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  Platform, 
  TouchableOpacity, 
  ScrollView, 
  TextInput, 
  ActivityIndicator, 
  Alert, 
  Switch 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { useUser } from '@/context/UserContext';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'expo-router';

export default function SuperAdminSettings() {
  const { signOut, globalSettings, refreshSettings } = useUser();
  const router = useRouter();

  // Local state for settings object
  const [settings, setSettings] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState<string | null>(null);

  // Text Inputs State
  const [mTitle, setMTitle] = useState('');
  const [mDesc, setMDesc] = useState('');
  const [mEta, setMEta] = useState('');
  const [appVersion, setAppVersion] = useState('');
  const [bannerText, setBannerText] = useState('');

  useEffect(() => {
    if (globalSettings) {
      setSettings(globalSettings);
      setMTitle(globalSettings.maintenance_title || 'System Maintenance');
      setMDesc(globalSettings.maintenance_description || 'Database optimize upgrade in progress.');
      setMEta(globalSettings.maintenance_expected_time || '2 Hours');
      setAppVersion(globalSettings.app_version || '1.0.0');
      setBannerText(globalSettings.announcement_banner?.text || '');
      setLoading(false);
    }
  }, [globalSettings]);

  const handleToggle = async (key: string) => {
    const currentValue = !!settings[key];
    const newValue = !currentValue;

    // Optimistic Update
    setSettings(prev => ({ ...prev, [key]: newValue }));

    try {
      const { error } = await supabase
        .from('settings')
        .upsert({ key, value: newValue });
      
      if (error) throw error;
      await refreshSettings();
    } catch (e: any) {
      // Revert
      setSettings(prev => ({ ...prev, [key]: currentValue }));
      Alert.alert('Update Failed', e.message);
    }
  };

  const handleSaveTextValue = async (key: string, rawValue: any) => {
    setSavingKey(key);
    try {
      const { error } = await supabase
        .from('settings')
        .upsert({ key, value: rawValue });
      
      if (error) throw error;
      await refreshSettings();
      Alert.alert('Saved', `${key.replace('_', ' ').toUpperCase()} updated successfully.`);
    } catch (e: any) {
      Alert.alert('Failed to save', e.message);
    } finally {
      setSavingKey(null);
    }
  };

  const handleLogout = async () => {
    await signOut();
    router.replace('/login');
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <LinearGradient colors={['#0F172A', '#000000']} style={StyleSheet.absoluteFill} />
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#0B0F19', '#020408']} style={StyleSheet.absoluteFill} />
      
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Feather name="arrow-left" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Global Governance</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Maintenance Config */}
        <Animated.View entering={FadeInDown.delay(100).duration(400)} style={styles.section}>
          <Text style={styles.sectionTitle}>Maintenance Control</Text>
          <View style={styles.card}>
            <View style={styles.settingRow}>
              <View style={styles.iconBox}>
                <Feather name="shield" size={20} color="#8B5CF6" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.settingTitle}>Maintenance Blocker</Text>
                <Text style={styles.settingDesc}>Suspend student access to the client applications.</Text>
              </View>
              <Switch 
                value={!!settings.maintenance_mode} 
                onValueChange={() => handleToggle('maintenance_mode')}
                trackColor={{ false: '#1E293B', true: '#8B5CF6' }}
                thumbColor="#FFF"
              />
            </View>

            <View style={[styles.settingRow, { marginTop: 15 }]}>
              <View style={[styles.iconBox, { backgroundColor: 'rgba(16,185,129,0.1)' }]}>
                <Feather name="users" size={20} color="#10B981" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.settingTitle}>Bypass Campus Admins</Text>
                <Text style={styles.settingDesc}>Allow institutional administrators to bypass block.</Text>
              </View>
              <Switch 
                value={!!settings.admin_bypass_maintenance} 
                onValueChange={() => handleToggle('admin_bypass_maintenance')}
                trackColor={{ false: '#1E293B', true: '#10B981' }}
                thumbColor="#FFF"
              />
            </View>

            <View style={styles.divider} />

            <Text style={styles.inputLabel}>Alert Banner Title</Text>
            <View style={styles.inputContainer}>
              <TextInput style={styles.textInput} value={mTitle} onChangeText={setMTitle} />
              <TouchableOpacity style={styles.saveInputBtn} onPress={() => handleSaveTextValue('maintenance_title', mTitle)}>
                {savingKey === 'maintenance_title' ? <ActivityIndicator size="small" color="#000" /> : <Feather name="save" size={16} color="#000" />}
              </TouchableOpacity>
            </View>

            <Text style={styles.inputLabel}>Maintenance Description</Text>
            <View style={styles.inputContainer}>
              <TextInput style={styles.textInput} value={mDesc} onChangeText={setMDesc} multiline />
              <TouchableOpacity style={styles.saveInputBtn} onPress={() => handleSaveTextValue('maintenance_description', mDesc)}>
                {savingKey === 'maintenance_description' ? <ActivityIndicator size="small" color="#000" /> : <Feather name="save" size={16} color="#000" />}
              </TouchableOpacity>
            </View>

            <Text style={styles.inputLabel}>Expected Recovery duration</Text>
            <View style={styles.inputContainer}>
              <TextInput style={styles.textInput} value={mEta} onChangeText={setMEta} />
              <TouchableOpacity style={styles.saveInputBtn} onPress={() => handleSaveTextValue('maintenance_expected_time', mEta)}>
                {savingKey === 'maintenance_expected_time' ? <ActivityIndicator size="small" color="#000" /> : <Feather name="save" size={16} color="#000" />}
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>

        {/* Deployments & Updates */}
        <Animated.View entering={FadeInDown.delay(150).duration(400)} style={styles.section}>
          <Text style={styles.sectionTitle}>Updates & Build Governance</Text>
          <View style={styles.card}>
            <Text style={styles.inputLabel}>Production App Version</Text>
            <View style={styles.inputContainer}>
              <TextInput style={styles.textInput} value={appVersion} onChangeText={setAppVersion} />
              <TouchableOpacity style={styles.saveInputBtn} onPress={() => handleSaveTextValue('app_version', appVersion)}>
                {savingKey === 'app_version' ? <ActivityIndicator size="small" color="#000" /> : <Feather name="save" size={16} color="#000" />}
              </TouchableOpacity>
            </View>

            <View style={[styles.settingRow, { marginTop: 15 }]}>
              <View style={[styles.iconBox, { backgroundColor: 'rgba(239,68,68,0.1)' }]}>
                <Feather name="alert-octagon" size={20} color="#EF4444" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.settingTitle}>Force Upgrade Version</Text>
                <Text style={styles.settingDesc}>Mandate download before students can continue.</Text>
              </View>
              <Switch 
                value={!!settings.force_update} 
                onValueChange={() => handleToggle('force_update')}
                trackColor={{ false: '#1E293B', true: '#EF4444' }}
                thumbColor="#FFF"
              />
            </View>
          </View>
        </Animated.View>

        {/* Global Module Toggles */}
        <Animated.View entering={FadeInDown.delay(200).duration(400)} style={styles.section}>
          <Text style={styles.sectionTitle}>Global Module Access</Text>
          <View style={styles.card}>
            {/* Registrations */}
            <View style={styles.toggleRow}>
              <Text style={styles.toggleTitle}>Student Onboarding Signups</Text>
              <Switch value={!!settings.registration_enabled} onValueChange={() => handleToggle('registration_enabled')} trackColor={{ false: '#1E293B', true: '#3B82F6' }} thumbColor="#FFF" />
            </View>
            <View style={styles.itemDivider} />

            {/* Community */}
            <View style={styles.toggleRow}>
              <Text style={styles.toggleTitle}>Student Community Feed</Text>
              <Switch value={!!settings.community_enabled} onValueChange={() => handleToggle('community_enabled')} trackColor={{ false: '#1E293B', true: '#3B82F6' }} thumbColor="#FFF" />
            </View>
            <View style={styles.itemDivider} />

            {/* Events */}
            <View style={styles.toggleRow}>
              <Text style={styles.toggleTitle}>Campus Events & Feedback</Text>
              <Switch value={!!settings.event_module_enabled} onValueChange={() => handleToggle('event_module_enabled')} trackColor={{ false: '#1E293B', true: '#3B82F6' }} thumbColor="#FFF" />
            </View>
            <View style={styles.itemDivider} />

            {/* Resources */}
            <View style={styles.toggleRow}>
              <Text style={styles.toggleTitle}>Academic Resources & Papers</Text>
              <Switch value={!!settings.resource_module_enabled} onValueChange={() => handleToggle('resource_module_enabled')} trackColor={{ false: '#1E293B', true: '#3B82F6' }} thumbColor="#FFF" />
            </View>
            <View style={styles.itemDivider} />

            {/* Opportunities */}
            <View style={styles.toggleRow}>
              <Text style={styles.toggleTitle}>Career Opportunities Desk</Text>
              <Switch value={!!settings.opportunity_module_enabled} onValueChange={() => handleToggle('opportunity_module_enabled')} trackColor={{ false: '#1E293B', true: '#3B82F6' }} thumbColor="#FFF" />
            </View>
            <View style={styles.itemDivider} />

            {/* Support */}
            <View style={styles.toggleRow}>
              <Text style={styles.toggleTitle}>Grievance & Support Desk</Text>
              <Switch value={!!settings.support_desk_enabled} onValueChange={() => handleToggle('support_desk_enabled')} trackColor={{ false: '#1E293B', true: '#3B82F6' }} thumbColor="#FFF" />
            </View>
          </View>
        </Animated.View>

        {/* Global Broadcasts */}
        <Animated.View entering={FadeInDown.delay(250).duration(400)} style={styles.section}>
          <Text style={styles.sectionTitle}>Announcement Banner</Text>
          <View style={styles.card}>
            <View style={styles.settingRow}>
              <View style={[styles.iconBox, { backgroundColor: 'rgba(59,130,246,0.1)' }]}>
                <Feather name="bell" size={20} color="#3B82F6" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.settingTitle}>Broadcast Banner</Text>
                <Text style={styles.settingDesc}>Render global banner at the top of client dashboard.</Text>
              </View>
              <Switch 
                value={!!settings.announcement_banner?.enabled} 
                onValueChange={async () => {
                  const currentBanner = settings.announcement_banner || { enabled: false, text: '' };
                  const newBanner = { ...currentBanner, enabled: !currentBanner.enabled };
                  setSettings(prev => ({ ...prev, announcement_banner: newBanner }));
                  try {
                    await supabase.from('settings').upsert({ key: 'announcement_banner', value: newBanner });
                    await refreshSettings();
                  } catch (e) {
                    setSettings(prev => ({ ...prev, announcement_banner: currentBanner }));
                  }
                }}
                trackColor={{ false: '#1E293B', true: '#3B82F6' }}
                thumbColor="#FFF"
              />
            </View>
            
            <Text style={styles.inputLabel}>Banner Broadcast Message</Text>
            <View style={[styles.inputContainer, { marginTop: 10 }]}>
              <TextInput style={styles.textInput} value={bannerText} onChangeText={setBannerText} />
              <TouchableOpacity 
                style={styles.saveInputBtn} 
                onPress={() => {
                  const currentBanner = settings.announcement_banner || { enabled: false, text: '' };
                  const newBanner = { ...currentBanner, text: bannerText };
                  handleSaveTextValue('announcement_banner', newBanner);
                }}
              >
                {savingKey === 'announcement_banner' ? <ActivityIndicator size="small" color="#000" /> : <Feather name="save" size={16} color="#000" />}
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(300).duration(400)} style={{ marginTop: 20 }}>
          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.8}>
            <LinearGradient colors={['rgba(239, 68, 68, 0.1)', 'rgba(239, 68, 68, 0.05)']} style={styles.logoutGradient}>
              <Feather name="log-out" size={20} color="#EF4444" />
              <Text style={styles.logoutText}>Sign Out Enterprise Session</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020617' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: Platform.OS === 'ios' ? 56 : 42, paddingBottom: 20 },
  backBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.03)', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', marginRight: 15 },
  headerTitle: { fontSize: 24, fontWeight: '900', color: '#FFF' },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 120 },
  
  section: { marginBottom: 25 },
  sectionTitle: { fontSize: 12, color: 'rgba(255,255,255,0.4)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10, marginLeft: 4 },
  card: { backgroundColor: 'rgba(255,255,255,0.02)', padding: 18, borderRadius: 24, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  settingRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconBox: { width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(139, 92, 246, 0.1)', alignItems: 'center', justifyContent: 'center' },
  settingTitle: { fontSize: 15, fontWeight: '800', color: '#FFF' },
  settingDesc: { fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 2, fontWeight: '500' },
  
  divider: { height: 1, backgroundColor: 'rgba(255,255,255,0.05)', marginVertical: 18 },
  itemDivider: { height: 1, backgroundColor: 'rgba(255,255,255,0.03)', marginVertical: 12 },

  inputLabel: { fontSize: 10, color: 'rgba(255,255,255,0.4)', fontWeight: '800', textTransform: 'uppercase', marginTop: 12, marginBottom: 6, letterSpacing: 0.5 },
  inputContainer: { flexDirection: 'row', gap: 10, alignItems: 'center' },
  textInput: { flex: 1, height: 42, backgroundColor: 'rgba(255,255,255,0.03)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', borderRadius: 10, paddingHorizontal: 12, color: '#FFF', fontSize: 13 },
  saveInputBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#FFF', alignItems: 'center', justifyContent: 'center' },

  toggleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 4 },
  toggleTitle: { color: '#FFF', fontSize: 14, fontWeight: '800' },

  logoutBtn: { borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(239, 68, 68, 0.3)' },
  logoutGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, paddingVertical: 16 },
  logoutText: { color: '#EF4444', fontWeight: '800', fontSize: 15 }
});
