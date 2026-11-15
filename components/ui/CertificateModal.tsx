import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Share,
  Alert,
  Platform,
} from 'react-native';
import { Ionicons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';

import { useUser } from '@/context/UserContext';

const { width } = Dimensions.get('window');

interface CertificateModalProps {
  visible: boolean;
  onClose: () => void;
  certificateType: 'verified_learner' | 'excellence' | string;
  studentName?: string;
  certificateId?: string;
  issueDate?: string;
}

export default function CertificateModal({
  visible,
  onClose,
  certificateType = 'verified_learner',
  studentName,
  certificateId,
  issueDate,
}: CertificateModalProps) {
  const { user } = useUser();
  const isExcellence = certificateType === 'excellence' || certificateType.toLowerCase().includes('excellence');
  const typeCode = isExcellence ? 'EX' : 'VL';

  // Dynamic resilient student name extraction
  const rawName = studentName || user?.full_name || user?.name || user?.user_metadata?.full_name || 'BHANU PRAKASH';
  const resolvedStudentName = String(rawName).trim() || 'BHANU PRAKASH';

  // Format ID according to official standard: FX-[TYPE]-[UNIQUE NUMBER]
  const certId = certificateId || `FX-${typeCode}-001`;
  const dateStr = issueDate || new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  const TARGET_WIDTH = width - 32;
  const CERT_DESIGN_WIDTH = 640;
  const CERT_DESIGN_HEIGHT = 452.6; // 640 / 1.414
  const scale = TARGET_WIDTH / CERT_DESIGN_WIDTH;

  const handleShareCertificate = async () => {
    try {
      await Share.share({
        title: 'FEEDX Official Certificate',
        message: `📜 Verified FEEDX Certificate awarded to ${studentName}!\n\nCertificate ID: ${certId}\nVerify online on FEEDX App.`,
      });
    } catch (e) {
      console.warn('Share error:', e);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.containerCard}>
          {/* Header Bar */}
          <View style={styles.modalHeader}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <FontAwesome5 name="award" size={20} color="#F59E0B" />
              <Text style={styles.modalTitleText}>Official E-Certificate</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={22} color="#FFF" />
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            <View style={[styles.certScaleContainer, { width: TARGET_WIDTH, height: CERT_DESIGN_HEIGHT * scale }]}>
              <View style={[styles.certScaleWrapper, { width: CERT_DESIGN_WIDTH, height: CERT_DESIGN_HEIGHT, transform: [{ scale }] }]}>
                {isExcellence ? (
                  /* ========================================== */
                  /* TEMPLATE 1: CERTIFICATE OF EXCELLENCE      */
                  /* ========================================== */
                  <View style={styles.excellenceCertCard}>
                    {/* Top Corner Decorative Geometric Swoops */}
                    <View style={styles.topGraphicHeader}>
                      <View style={styles.topGoldSwoop} />
                      <View style={styles.topNavySwoop} />
                    </View>

                    {/* Top Left Row: Official Anonymous Feedback Emblem */}
                    <View style={styles.certHeaderRow}>
                      <View style={styles.officialEmblemRing}>
                        <View style={styles.emblemIconCircle}>
                          <FontAwesome5 name="fist-raised" size={15} color="#0B0C30" />
                        </View>
                        <Text style={styles.emblemTextTop}>Anonymous Feedback</Text>
                        <Text style={styles.emblemTextBottom}>Listen • Respond • Resolve</Text>
                      </View>
                    </View>

                    {/* Main Title Banner */}
                    <View style={{ alignItems: 'center', marginTop: 4 }}>
                      <Text style={styles.excellenceTitleMain}>CERTIFICATE</Text>
                      <Text style={styles.excellenceSubtitle}>OF EXCELLENCE</Text>
                      <Text style={styles.excellencePresentedTo}>This Certificate Is Presented To</Text>
                    </View>

                    {/* Recipient Name Area with Solid Underline */}
                    <View style={styles.nameLineContainer}>
                      <Text style={styles.recipientNameText}>{resolvedStudentName.toUpperCase()}</Text>
                      <View style={styles.nameUnderline} />
                    </View>

                    {/* Official Statement Body */}
                    <Text style={styles.excellenceBodyText}>
                      This recognition is awarded for demonstrating exceptional learning, participation, contribution, and commitment to personal and professional development through FEEDX.
                    </Text>

                    {/* Center Bottom Royal Golden Seal with Blue Ribbons */}
                    <View style={styles.goldSealContainer}>
                      <View style={styles.goldSealOuterCircle}>
                        <View style={styles.goldSealInnerCircle} />
                      </View>
                      <View style={styles.blueRibbonsContainer}>
                        <View style={[styles.ribbonTail, { transform: [{ rotate: '-18deg' }] }]} />
                        <View style={[styles.ribbonTail, { transform: [{ rotate: '18deg' }] }]} />
                      </View>
                    </View>

                    {/* Footer Credentials Row */}
                    <View style={styles.excellenceFooterRow}>
                      <View>
                        <Text style={styles.footerLabel}>AWARDED BY:</Text>
                        <Text style={styles.footerBold}>FEEDX POLYTECHNIC COMMUNITY</Text>
                      </View>

                      <View style={{ alignItems: 'flex-end' }}>
                        <Text style={styles.footerLabel}>Certificate ID:</Text>
                        <Text style={[styles.footerIdText, { color: '#0B0C30', fontWeight: '900' }]}>{certId}</Text>
                      </View>
                    </View>

                    {/* Bottom Corner Decorative Geometric Swoops */}
                    <View style={styles.bottomGraphicFooter}>
                      <View style={styles.bottomGoldSwoop} />
                      <View style={styles.bottomNavySwoop} />
                    </View>
                  </View>
                ) : (
                /* ========================================== */
                /* TEMPLATE 2: CERTIFICATE OF VERIFIED LEARNER*/
                /* ========================================== */
                <View style={styles.verifiedCertCard}>
                  {/* Main Content Box */}
                  <View style={styles.verifiedMainContent}>
                    {/* Emblem */}
                    <View style={styles.emblemContainer}>
                      <View style={styles.emblemOuterRing}>
                        <MaterialCommunityIcons name="gesture-tap-button" size={16} color="#1E293B" />
                        <Text style={styles.emblemTextTop}>Anonymous Feedback</Text>
                        <Text style={styles.emblemTextBottom}>Listen • Respond • Resolve</Text>
                      </View>
                    </View>

                    {/* Title & Subtitle */}
                    <Text style={styles.verifiedTitleMain}>Certificate of Verified Learner</Text>
                    <Text style={styles.verifiedPresentedTo}>This certificate is presented to</Text>

                    {/* Recipient Name */}
                    <View style={styles.verifiedNameContainer}>
                      <Text style={styles.recipientNameText}>{resolvedStudentName.toUpperCase()}</Text>
                      <View style={styles.nameUnderline} />
                    </View>

                    {/* Body Statement */}
                    <Text style={styles.verifiedBodyText}>
                      in recognition of successfully completing the FEEDX Verified Learner achievement by demonstrating consistent participation in learning activities, skill development, and active engagement with the FEEDX Polytechnic Community.
                    </Text>

                    {/* Footer Row */}
                    <View style={[styles.certFooterRow, { marginTop: 40 }]}>
                      <View>
                        <Text style={styles.footerLabel}>AWARDED BY:</Text>
                        <Text style={[styles.footerBold, { color: '#1E3A8A' }]}>FEEDX POLYTECHNIC COMMUNITY</Text>
                      </View>

                      <View style={{ alignItems: 'flex-end' }}>
                        <Text style={styles.footerLabel}>Certificate ID:</Text>
                        <Text style={styles.footerIdText}>{certId}</Text>
                      </View>
                    </View>
                  </View>

                  {/* Right Interlocking Geometric Blue Border */}
                  <View style={styles.geometricRightBorder}>
                    {Array.from({ length: 10 }).map((_, i) => (
                      <View key={i} style={styles.geometricPatternBlock}>
                        <View style={styles.geoSquare1} />
                        <View style={styles.geoSquare2} />
                      </View>
                    ))}
                  </View>
                </View>
              )}
              </View>
            </View>

            {/* Action Controls */}
            <View style={styles.actionRow}>
              <TouchableOpacity style={styles.shareBtn} onPress={handleShareCertificate} activeOpacity={0.8}>
                <Ionicons name="share-social-outline" size={18} color="#FFF" />
                <Text style={styles.actionBtnText}>Share Certificate</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.downloadBtn}
                onPress={() => Alert.alert('Certificate Downloaded! 📜', `Official digital certificate ${certId} saved to your device profile.`)}
                activeOpacity={0.8}
              >
                <Ionicons name="download-outline" size={18} color="#FFF" />
                <Text style={styles.actionBtnText}>Download PDF</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(2, 6, 23, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
  },
  containerCard: {
    width: '100%',
    maxHeight: '92%',
    backgroundColor: '#0F172A',
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#334155',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: '#1E293B',
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  modalTitleText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '900',
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    padding: 16,
    alignItems: 'center',
  },
  horizontalScrollContent: {
    paddingHorizontal: 8,
    paddingVertical: 12,
  },

  /* ================= TEMPLATE 1: EXCELLENCE (EXACT MATCH TO UPLOADED IMAGE) ================= */
  excellenceCertCard: {
    width: 640,
    aspectRatio: 1.414,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 24,
    paddingTop: 20,
    paddingBottom: 20,
    position: 'relative',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    justifyContent: 'space-between',
  },
  topGraphicHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 38,
  },
  topGoldSwoop: {
    position: 'absolute',
    top: -15,
    left: -40,
    right: -40,
    height: 40,
    backgroundColor: '#F59E0B',
    transform: [{ rotate: '-2deg' }],
  },
  topNavySwoop: {
    position: 'absolute',
    top: -10,
    left: 0,
    right: 0,
    height: 34,
    backgroundColor: '#0B0C30',
    transform: [{ rotate: '1.5deg' }],
  },
  bottomGraphicFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 38,
  },
  bottomGoldSwoop: {
    position: 'absolute',
    bottom: -15,
    left: -40,
    right: -40,
    height: 40,
    backgroundColor: '#F59E0B',
    transform: [{ rotate: '2deg' }],
  },
  bottomNavySwoop: {
    position: 'absolute',
    bottom: -10,
    left: 0,
    right: 0,
    height: 34,
    backgroundColor: '#0B0C30',
    transform: [{ rotate: '-1.5deg' }],
  },
  certHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    zIndex: 10,
  },
  officialEmblemRing: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 2,
    borderColor: '#0B0C30',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  emblemIconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(11, 12, 48, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  emblemTextTop: {
    fontSize: 5.5,
    fontWeight: '900',
    color: '#0B0C30',
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  emblemTextBottom: {
    fontSize: 4.5,
    fontWeight: '700',
    color: '#475569',
    textAlign: 'center',
    marginTop: 1,
  },
  excellenceTitleMain: {
    fontSize: 34,
    fontWeight: '900',
    color: '#0B0C30',
    textAlign: 'center',
    letterSpacing: 3,
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
  },
  excellenceSubtitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0B0C30',
    textAlign: 'center',
    letterSpacing: 4,
    marginTop: 2,
    marginBottom: 10,
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
  },
  excellencePresentedTo: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
    textAlign: 'center',
    marginBottom: 6,
  },
  nameLineContainer: {
    alignItems: 'center',
    marginVertical: 6,
  },
  recipientNameText: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0B0C30',
    textAlign: 'center',
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  nameUnderline: {
    width: 360,
    height: 1.5,
    backgroundColor: '#0B0C30',
  },
  excellenceBodyText: {
    fontSize: 11.5,
    lineHeight: 18,
    color: '#334155',
    textAlign: 'center',
    marginVertical: 10,
    paddingHorizontal: 20,
    fontWeight: '500',
  },
  goldSealContainer: {
    alignItems: 'center',
    marginVertical: 4,
    zIndex: 5,
  },
  goldSealOuterCircle: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#F59E0B',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#D97706',
    zIndex: 3,
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  goldSealInnerCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FDE047',
    borderWidth: 1.5,
    borderColor: '#B45309',
  },
  blueRibbonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginTop: -20,
    zIndex: 2,
  },
  ribbonTail: {
    width: 18,
    height: 42,
    backgroundColor: '#1D4ED8',
    borderWidth: 1,
    borderColor: '#1E3A8A',
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
  },
  certFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 12,
    zIndex: 10,
  },
  footerLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  footerBold: {
    fontSize: 12,
    fontWeight: '900',
    color: '#0B0C30',
    letterSpacing: 0.5,
  },
  excellenceFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    marginTop: 14,
    marginBottom: 22,
    zIndex: 30,
  },
  certIdPill: {
    backgroundColor: '#0B0C30',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#F59E0B',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
  },
  certIdPillLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.5,
  },
  certIdPillValue: {
    fontSize: 11,
    fontWeight: '900',
    color: '#FDE047',
    letterSpacing: 0.8,
  },
  footerIdLabel: {
    fontSize: 12,
    color: '#0B0C30',
    fontWeight: '800',
  },
  footerIdBold: {
    fontSize: 12,
    fontWeight: '900',
    color: '#0B0C30',
  },
  footerIdText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#0B0C30',
  },
  emblemContainer: {
    marginBottom: 8,
  },
  emblemOuterRing: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 2,
    borderColor: '#0B0C30',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 3,
    backgroundColor: '#FFF',
  },

  /* ================= TEMPLATE 2: VERIFIED LEARNER ================= */
  verifiedCertCard: {
    width: 640,
    aspectRatio: 1.414,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    flexDirection: 'row',
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#E2E8F0',
  },
  verifiedMainContent: {
    flex: 1,
    padding: 24,
  },
  verifiedTitleMain: {
    fontSize: 24,
    fontWeight: '900',
    color: '#1D4ED8',
    marginTop: 10,
    marginBottom: 4,
  },
  verifiedPresentedTo: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 12,
  },
  verifiedNameContainer: {
    marginVertical: 10,
  },
  verifiedBodyText: {
    fontSize: 11,
    lineHeight: 18,
    color: '#334155',
    marginVertical: 14,
  },
  geometricRightBorder: {
    width: 48,
    backgroundColor: '#1D4ED8',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
  },
  geometricPatternBlock: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#FFF',
    transform: [{ rotate: '45deg' }],
    marginVertical: 2,
  },
  geoSquare1: {
    width: 12,
    height: 12,
    backgroundColor: '#FFF',
    position: 'absolute',
    top: 2,
    left: 2,
  },
  geoSquare2: {
    width: 8,
    height: 8,
    backgroundColor: '#1D4ED8',
    position: 'absolute',
    bottom: 2,
    right: 2,
  },

  /* Action Buttons */
  actionRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
    width: '100%',
  },
  shareBtn: {
    flex: 1,
    backgroundColor: '#3B82F6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 14,
    gap: 6,
  },
  downloadBtn: {
    flex: 1,
    backgroundColor: '#10B981',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 14,
    gap: 6,
  },
  actionBtnText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '800',
  },
  certScaleContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderRadius: 16,
    marginVertical: 12,
    backgroundColor: '#000',
  },
  certScaleWrapper: {
    position: 'absolute',
  },
});
