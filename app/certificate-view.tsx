import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Share,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useUser } from '@/context/UserContext';
import { useTheme } from '@/context/ThemeContext';
import { SPACING, RADIUS, FONT, SHADOWS } from '@/constants/theme';
import CertificateModal from '@/components/ui/CertificateModal';
import { resolveStandardFeedXId } from '@/services/idService';
import { downloadOrOpenFile } from '@/services/downloadService';
import { supabase } from '@/lib/supabase';

interface CertificateItem {
  id: string;
  type: string;
  title: string;
  category: 'academic' | 'events' | 'achievements';
  description: string;
  issueDate: string;
  certificateId: string;
  issuer: string;
  badgeColor: string;
  icon: string;
  isUnlocked: boolean;
  requiredCoins?: number;
  requiredTokens?: number;
}

export default function CertificateViewScreen() {
  const router = useRouter();
  const { user } = useUser();
  const { colors, isDark } = useTheme();

  const [activeTab, setActiveTab] = useState<'all' | 'academic' | 'events' | 'achievements'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCert, setSelectedCert] = useState<CertificateItem | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [dbCertificates, setDbCertificates] = useState<CertificateItem[]>([]);
  const [loading, setLoading] = useState(false);

  const studentName = user?.full_name || 'FEEDX STUDENT';
  const feedxId = resolveStandardFeedXId(user);
  const collegeName = user?.college_name || 'FEEDX Polytechnic';

  useEffect(() => {
    let isMounted = true;
    const fetchAuthenticCertificates = async () => {
      if (!user?.id) return;
      try {
        setLoading(true);
        const fetched: CertificateItem[] = [];

        let hasRedeemedVerifiedLearner = false;
        let hasRedeemedExcellence = false;

        // 1. Fetch Redeemed Reward Certificates from Supabase (Requires actual spent coins/tokens)
        const { data: redemptions } = await supabase
          .from('reward_redemptions')
          .select('*, rewards(*)')
          .eq('student_id', user.id);

        if (redemptions && redemptions.length > 0) {
          redemptions.forEach((item: any) => {
            const isExcellence =
              item.rewards?.category === 'award' ||
              (item.rewards?.coin_cost && item.rewards?.coin_cost >= 10) ||
              (item.rewards?.title && item.rewards?.title.toLowerCase().includes('excellence'));

            if (isExcellence) {
              hasRedeemedExcellence = true;
            } else {
              hasRedeemedVerifiedLearner = true;
            }

            fetched.push({
              id: `redemption_${item.id}`,
              type: isExcellence ? 'excellence' : 'verified_learner',
              title: item.rewards?.title || (isExcellence ? 'FEEDX Academic Excellence Certificate' : 'FEEDX Verified Learner Certificate'),
              category: 'academic',
              description: item.rewards?.description || 'Official verified student credential redeemed via FEEDX Rewards Store.',
              issueDate: new Date(item.created_at || Date.now()).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
              certificateId: item.certificate_id || `FX-RD-${item.id.slice(0, 8).toUpperCase()}`,
              issuer: 'FEEDX Academic Board',
              badgeColor: isExcellence ? '#3B82F6' : '#10B981',
              icon: 'award',
              isUnlocked: true,
            });
          });
        }

        // 2. Fetch Completed Event Certificates
        const { data: eventRegs } = await supabase
          .from('event_registrations')
          .select('*, events(*)')
          .eq('user_id', user.id);

        if (eventRegs && eventRegs.length > 0) {
          eventRegs.forEach((reg: any) => {
            if (reg.status === 'attended' || reg.status === 'completed' || reg.certificate_issued) {
              fetched.push({
                id: `event_${reg.id}`,
                type: 'event_symposium',
                title: reg.events?.title || 'Polytechnic Tech Event Certificate',
                category: 'events',
                description: `Certificate of Attendance & Active Participation in ${reg.events?.title || 'Polytechnic Event'}.`,
                issueDate: new Date(reg.created_at || Date.now()).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
                certificateId: `FX-EV-${reg.id.slice(0, 8).toUpperCase()}`,
                issuer: collegeName,
                badgeColor: '#3B82F6',
                icon: 'calendar',
                isUnlocked: true,
              });
            }
          });
        }

        // 3. Display Locked Certificates with strict balance eligibility rules
        if (!hasRedeemedVerifiedLearner) {
          fetched.push({
            id: 'cert_verified_learner_locked',
            type: 'verified_learner',
            title: 'FEEDX Verified Learner Certificate',
            category: 'academic',
            description: 'Requires 5 Gold Coins (5,000 Task Tokens). Redeem via Rewards Store.',
            issueDate: 'Pending Redemption',
            certificateId: 'FX-VL-LOCKED',
            issuer: 'FEEDX Academic Board',
            badgeColor: '#94A3B8',
            icon: 'award',
            isUnlocked: false,
            requiredCoins: 5,
            requiredTokens: 5000,
          });
        }

        if (!hasRedeemedExcellence) {
          fetched.push({
            id: 'cert_excellence_locked',
            type: 'excellence',
            title: 'FEEDX Academic Excellence Certificate',
            category: 'achievements',
            description: 'Requires 10 Gold Coins (10,000 Task Tokens). Redeem via Rewards Store.',
            issueDate: 'Pending Redemption',
            certificateId: 'FX-EX-LOCKED',
            issuer: 'FEEDX Academic Board',
            badgeColor: '#94A3B8',
            icon: 'award',
            isUnlocked: false,
            requiredCoins: 10,
            requiredTokens: 10000,
          });
        }

        // 4. Set authentic earned certificates
        if (isMounted) {
          setDbCertificates(fetched);
        }
      } catch (err) {
        console.warn('[Certificates] Fetch notice:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchAuthenticCertificates();
    return () => { isMounted = false; };
  }, [user?.id, collegeName]);

  const filteredCertificates = useMemo(() => {
    return dbCertificates.filter((cert) => {
      const matchesTab = activeTab === 'all' || cert.category === activeTab;
      const matchesQuery =
        searchQuery.trim() === '' ||
        cert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cert.certificateId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cert.issuer.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTab && matchesQuery;
    });
  }, [dbCertificates, activeTab, searchQuery]);

  const handleOpenCertificate = (cert: CertificateItem) => {
    try {
      Haptics.selectionAsync().catch(() => {});
    } catch {}

    if (!cert.isUnlocked) {
      Alert.alert(
        'Certificate Locked 🔒',
        `The "${cert.title}" requires ${cert.requiredCoins || 5} Gold Coins (${(cert.requiredTokens || 5000).toLocaleString()} Task Tokens).\n\nRedeem it in the FEEDX Rewards Store once you meet the required balance.`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Open Rewards Store', onPress: () => router.push('/rewards' as any) },
        ]
      );
      return;
    }

    setSelectedCert(cert);
    setModalVisible(true);
  };

  const handleShareCert = async (cert: CertificateItem) => {
    try {
      await Share.share({
        title: cert.title,
        message: `📜 Official Verified Certificate: ${cert.title}\n\n👤 Awarded To: ${studentName}\n🆔 Certificate ID: ${cert.certificateId}\n🏛️ Issuer: ${cert.issuer}\n\nVerify credentials directly on FEEDX App.`,
      });
    } catch (e) {
      console.warn('Share cert error:', e);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {isDark && (
        <LinearGradient
          colors={['#0F172A', '#020617']}
          style={StyleSheet.absoluteFill}
        />
      )}

      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border, backgroundColor: colors.card }]}>
        <TouchableOpacity
          style={[styles.backBtn, { backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : '#F1F5F9', borderColor: colors.border }]}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Feather name="arrow-left" size={18} color={colors.textPrimary} />
        </TouchableOpacity>

        <View style={styles.headerTitleWrap}>
          <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>My Certificates</Text>
          <Text style={[styles.headerSubtitle, { color: colors.textMuted }]}>
            {dbCertificates.length} Verified Student Credentials
          </Text>
        </View>

        <View style={styles.badgeCount}>
          <Feather name="shield" size={14} color="#10B981" />
          <Text style={styles.badgeCountText}>{dbCertificates.length}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Search Bar */}
        <Animated.View entering={FadeInUp.duration(300)} style={[styles.searchBox, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
          <Feather name="search" size={16} color={colors.textMuted} />
          <TextInput
            placeholder="Search by title, ID, or issuer..."
            placeholderTextColor={colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={[styles.searchInput, { color: colors.textPrimary }]}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Feather name="x" size={16} color={colors.textMuted} />
            </TouchableOpacity>
          )}
        </Animated.View>

        {/* Filter Tabs */}
        <View style={styles.tabsRow}>
          {[
            { id: 'all', label: 'All' },
            { id: 'academic', label: 'Academic' },
            { id: 'events', label: 'Events' },
            { id: 'achievements', label: 'Achievements' },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <TouchableOpacity
                key={tab.id}
                onPress={() => {
                  try {
                    Haptics.selectionAsync().catch(() => {});
                  } catch {}
                  setActiveTab(tab.id as any);
                }}
                style={[
                  styles.tabBtn,
                  isActive && { backgroundColor: colors.primary, borderColor: colors.primary },
                  !isActive && { backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : '#F1F5F9', borderColor: colors.border },
                ]}
              >
                <Text
                  style={[
                    styles.tabBtnText,
                    isActive && { color: '#FFF', fontWeight: '800' },
                    !isActive && { color: colors.textMuted },
                  ]}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Certificates List */}
        {loading ? (
          <View style={{ paddingVertical: 40, alignItems: 'center' }}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : filteredCertificates.length === 0 ? (
          <View style={[styles.emptyBox, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
            <MaterialCommunityIcons name="certificate-outline" size={48} color="#F59E0B" />
            <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>No Certificates Earned Yet</Text>
            <Text style={[styles.emptySub, { color: colors.textMuted, textAlign: 'center', lineHeight: 20 }]}>
              {searchQuery
                ? 'Try adjusting your search query.'
                : 'Exchange Task Tokens for Gold Coins to redeem verified certificates:\n• Verified Learner Certificate: 5 Gold Coins (5,000 Tokens)\n• Academic Excellence Certificate: 10 Gold Coins (10,000 Tokens)'}
            </Text>
            <TouchableOpacity
              style={{ marginTop: 16, backgroundColor: '#F59E0B', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 14 }}
              onPress={() => router.push('/rewards')}
              activeOpacity={0.8}
            >
              <Text style={{ color: '#FFFFFF', fontWeight: '800', fontSize: 13 }}>Visit Rewards Store →</Text>
            </TouchableOpacity>
          </View>
        ) : (
          filteredCertificates.map((cert, index) => (
            <Animated.View
              key={cert.id}
              entering={FadeInDown.duration(300).delay(index * 60).springify()}
            >
              <TouchableOpacity
                style={[styles.certCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
                onPress={() => handleOpenCertificate(cert)}
                activeOpacity={0.85}
              >
                <View style={styles.cardHeaderRow}>
                  <View style={[styles.iconBox, { backgroundColor: cert.isUnlocked ? `${cert.badgeColor}15` : 'rgba(100,116,139,0.15)' }]}>
                    <Feather
                      name={cert.isUnlocked ? (cert.icon as any) : 'lock'}
                      size={20}
                      color={cert.isUnlocked ? cert.badgeColor : '#94A3B8'}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.certTitle, { color: colors.textPrimary }]}>{cert.title}</Text>
                    <Text style={[styles.issuerText, { color: colors.textMuted }]}>{cert.issuer}</Text>
                  </View>
                  {cert.isUnlocked ? (
                    <View style={[styles.verifiedBadge, { backgroundColor: `${cert.badgeColor}15` }]}>
                      <Feather name="check-circle" size={11} color={cert.badgeColor} />
                      <Text style={[styles.verifiedBadgeText, { color: cert.badgeColor }]}>VERIFIED</Text>
                    </View>
                  ) : (
                    <View style={[styles.verifiedBadge, { backgroundColor: 'rgba(239, 68, 68, 0.12)' }]}>
                      <Feather name="lock" size={11} color="#EF4444" />
                      <Text style={[styles.verifiedBadgeText, { color: '#EF4444' }]}>
                        {cert.requiredCoins} COINS NEEDED
                      </Text>
                    </View>
                  )}
                </View>

                <Text style={[styles.certDesc, { color: colors.textSecondary }]}>{cert.description}</Text>

                <View style={styles.metaRow}>
                  <View style={styles.metaCol}>
                    <Text style={[styles.metaLabel, { color: colors.textMuted }]}>CERTIFICATE ID</Text>
                    <Text style={[styles.metaVal, { color: cert.isUnlocked ? colors.primary : colors.textMuted }]}>
                      {cert.certificateId}
                    </Text>
                  </View>
                  <View style={styles.metaCol}>
                    <Text style={[styles.metaLabel, { color: colors.textMuted }]}>STATUS</Text>
                    <Text style={[styles.metaVal, { color: cert.isUnlocked ? '#10B981' : '#F59E0B' }]}>
                      {cert.isUnlocked ? cert.issueDate : `Locked (${cert.requiredCoins} Coins)`}
                    </Text>
                  </View>
                </View>

                {/* Action Buttons */}
                <View style={styles.btnRow}>
                  {cert.isUnlocked ? (
                    <>
                      <TouchableOpacity
                        style={[styles.actionBtnPrimary, { backgroundColor: colors.primary }]}
                        onPress={() => handleOpenCertificate(cert)}
                        activeOpacity={0.8}
                      >
                        <Feather name="eye" size={14} color="#FFF" />
                        <Text style={styles.actionBtnPrimaryText}>View Certificate</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[styles.actionBtnSecondary, { borderColor: colors.border, backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : '#F8FAFC' }]}
                        onPress={() => handleShareCert(cert)}
                        activeOpacity={0.7}
                      >
                        <Feather name="share-2" size={14} color={colors.textPrimary} />
                      </TouchableOpacity>
                    </>
                  ) : (
                    <TouchableOpacity
                      style={[styles.actionBtnPrimary, { backgroundColor: '#F59E0B', flex: 1 }]}
                      onPress={() => router.push('/rewards' as any)}
                      activeOpacity={0.8}
                    >
                      <Feather name="unlock" size={14} color="#FFF" />
                      <Text style={styles.actionBtnPrimaryText}>
                        Unlock in Rewards Store ({cert.requiredCoins} Coins / {(cert.requiredTokens || 0).toLocaleString()} Tokens)
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </TouchableOpacity>
            </Animated.View>
          ))
        )}
      </ScrollView>

      {/* High-Res Modal Viewer */}
      {selectedCert && (
        <CertificateModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          certificateType={selectedCert.type}
          studentName={studentName}
          certificateId={selectedCert.certificateId}
          issueDate={selectedCert.issueDate}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 44 : 14,
    paddingBottom: 14,
    borderBottomWidth: 1,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  headerTitleWrap: {
    flex: 1,
    marginLeft: 12,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '900',
  },
  headerSubtitle: {
    fontSize: 11.5,
    fontWeight: '600',
    marginTop: 1,
  },
  badgeCount: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeCountText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#10B981',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
    gap: 10,
    marginBottom: 14,
  },
  searchInput: {
    flex: 1,
    fontSize: 13.5,
    fontWeight: '600',
    padding: 0,
  },
  tabsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  tabBtn: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
  },
  tabBtnText: {
    fontSize: 12,
    fontWeight: '700',
  },
  certCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    marginBottom: 14,
    ...SHADOWS.small,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 10,
  },
  iconBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  certTitle: {
    fontSize: 14,
    fontWeight: '900',
    lineHeight: 18,
  },
  issuerText: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 8,
  },
  verifiedBadgeText: {
    fontSize: 9.5,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  certDesc: {
    fontSize: 12,
    lineHeight: 17,
    marginBottom: 12,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    marginBottom: 14,
  },
  metaCol: {
    gap: 2,
  },
  metaLabel: {
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  metaVal: {
    fontSize: 11.5,
    fontWeight: '800',
  },
  btnRow: {
    flexDirection: 'row',
    gap: 10,
  },
  actionBtnPrimary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 12,
  },
  actionBtnPrimaryText: {
    color: '#FFF',
    fontSize: 12.5,
    fontWeight: '800',
  },
  actionBtnSecondary: {
    width: 42,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  emptyBox: {
    padding: 32,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    gap: 8,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  emptySub: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
    maxWidth: 240,
  },
});
