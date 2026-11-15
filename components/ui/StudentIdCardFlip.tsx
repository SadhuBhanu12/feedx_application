import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Platform,
  StyleProp,
  ViewStyle,
  TouchableOpacity,
  Modal,
  Alert,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import QRCode from 'react-native-qrcode-svg';
import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import { UserAvatar } from '@/components/ui/UserAvatar';
import { MOTION_DURATIONS, MOTION_EASINGS } from '@/constants/motion';
import { rf, rs } from '@/constants/responsive';
import { useRouter } from 'expo-router';
import { resolveStandardFeedXId, resolveQuizueId, getQrVerificationPayload } from '@/services/idService';

export interface StudentIdCardFlipProps {
  user: any;
  dashboard?: any;
  style?: StyleProp<ViewStyle>;
  onFlipChange?: (isFlipped: boolean) => void;
  showTapHint?: boolean;
}

export const StudentIdCardFlip: React.FC<StudentIdCardFlipProps> = ({
  user,
  dashboard,
  style,
  onFlipChange,
  showTapHint = true,
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const flipRotation = useSharedValue(0);

  const [qrModalVisible, setQrModalVisible] = useState(false);
  const profile = { ...(dashboard?.profile || {}), ...(user || {}) };
  const studentName = profile.full_name || profile.name || 'STUDENT NAME';
  const feedxId = resolveStandardFeedXId(profile);
  const rawRoll = profile.pin_number || profile.roll_number || profile.roll_no || profile.student_id;
  const rollNumber = (rawRoll && rawRoll !== '21001-CSE-001' && rawRoll !== 'PENDING') ? rawRoll : feedxId;
  const collegeName = profile.college_name || 'FEEDX POLYTECHNIC';
  const branch = profile.branch || 'Computer Science & Engineering';
  const year = profile.year || '3rd Year';
  const semester = profile.semester ? `${profile.semester}th Semester` : '5th Semester';
  const isVerified = String(profile.verification_status || 'verified').toLowerCase() === 'verified';
  
  const quizueId = resolveQuizueId(profile);
  const qrPayload = getQrVerificationPayload(feedxId, quizueId);

  const router = useRouter();
  const toggleFlip = useCallback(() => {
    const nextFlipped = !isFlipped;
    setIsFlipped(nextFlipped);

    try {
      Haptics.selectionAsync().catch(() => {});
    } catch {}

    flipRotation.value = withTiming(nextFlipped ? 180 : 0, {
      duration: 400,
    });

    if (onFlipChange) {
      onFlipChange(nextFlipped);
    }
  }, [isFlipped, onFlipChange]);

  const frontAnimatedStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(flipRotation.value, [0, 180], [0, 180]);
    return {
      transform: [{ perspective: 1200 }, { rotateY: `${rotateY}deg` }],
      opacity: flipRotation.value < 90 ? 1 : 0,
      zIndex: flipRotation.value < 90 ? 2 : 1,
    };
  });

  const backAnimatedStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(flipRotation.value, [0, 180], [180, 360]);
    return {
      transform: [{ perspective: 1200 }, { rotateY: `${rotateY}deg` }],
      opacity: flipRotation.value >= 90 ? 1 : 0,
      zIndex: flipRotation.value >= 90 ? 2 : 1,
    };
  });

  return (
    <View style={[styles.outerContainer, style]}>
      <Pressable onPress={toggleFlip} style={styles.pressContainer}>
        {/* FRONT SIDE */}
        <Animated.View style={[styles.cardSide, frontAnimatedStyle]}>
          <LinearGradient
            colors={['#0284C7', '#0369A1', '#0F4C81']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.cardInner}
          >
            {/* Header */}
            <View style={styles.cardHeader}>
              <View style={styles.logoRow}>
                <Image source={require('@/assets/images/icon.png')} style={styles.logo} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.instName} adjustsFontSizeToFit minimumFontScale={0.8}>
                    {collegeName}
                  </Text>
                  <Text style={styles.cardType}>STUDENT IDENTITY CARD</Text>
                </View>
              </View>

              <View style={[styles.verifiedBadge, { backgroundColor: isVerified ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)' }]}>
                <Feather name={isVerified ? 'check-circle' : 'clock'} size={11} color={isVerified ? '#10B981' : '#F59E0B'} />
                <Text style={[styles.verifiedBadgeText, { color: isVerified ? '#10B981' : '#F59E0B' }]}>
                  {isVerified ? 'VERIFIED' : 'PENDING'}
                </Text>
              </View>
            </View>

            {/* Body */}
            <View style={styles.cardBody}>
              <View style={styles.photoContainer}>
                <UserAvatar user={user} size={rs(64)} />
              </View>

              <View style={styles.infoCol}>
                <Text style={styles.name} adjustsFontSizeToFit minimumFontScale={0.8}>
                  {studentName.toUpperCase()}
                </Text>
                <Text style={styles.roll}>
                  REG NO: <Text style={styles.rollVal}>{rollNumber}</Text>
                </Text>

                <View style={styles.detailRow}>
                  <Text style={styles.label}>BRANCH:</Text>
                  <Text style={styles.value}>{branch}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.label}>YEAR/SEM:</Text>
                  <Text style={styles.value}>{year} • {semester}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={[styles.label, { color: '#E2E8F0' }]}>FEEDX ID:</Text>
                  <Text style={[styles.value, { color: '#FACC15', fontWeight: '900' }]}>
                    {feedxId}
                  </Text>
                </View>
              </View>
            </View>

            {/* Footer */}
            <View style={styles.cardFooter}>
              <Text style={[styles.tapFlipNotice, { flex: 1, marginRight: 4 }]} numberOfLines={1}>
                <Feather name="refresh-cw" size={10} color="#E0F2FE" /> Tap to view QR verification side
              </Text>
              <View style={styles.authBadge}>
                <MaterialCommunityIcons name="shield-check" size={12} color="#60A5FA" />
                <Text style={styles.authText}>DIGITAL SECURE</Text>
              </View>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* BACK SIDE (QR & VERIFICATION SIDE) */}
        <Animated.View style={[styles.cardSide, styles.cardSideBack, backAnimatedStyle]}>
          <LinearGradient
            colors={['#0F172A', '#1E293B', '#0F4C81']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.cardInner, { borderColor: 'rgba(96, 165, 250, 0.4)' }]}
          >
            {/* Header */}
            <View style={styles.cardHeader}>
              <View style={[styles.logoRow, { flex: 1, marginRight: 8 }]}>
                <MaterialCommunityIcons name="qrcode-scan" size={20} color="#60A5FA" />
                <View style={{ flex: 1 }}>
                  <Text style={styles.instName} numberOfLines={1}>FEEDX VERIFICATION DESK</Text>
                  <Text style={styles.cardType} numberOfLines={1}>INSTITUTIONAL QR TOKEN</Text>
                </View>
              </View>
              <View style={[styles.verifiedBadge, { backgroundColor: 'rgba(16, 185, 129, 0.2)', flexShrink: 0 }]}>
                <Feather name="check" size={11} color="#10B981" />
                <Text style={[styles.verifiedBadgeText, { color: '#10B981' }]}>ACTIVE ID</Text>
              </View>
            </View>

            {/* Body */}
            <View style={styles.backBody}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setQrModalVisible(true)}
                style={styles.qrBox}
              >
                <QRCode
                  value={qrPayload}
                  size={rs(76)}
                  color="#000000"
                  backgroundColor="#FFFFFF"
                />
              </TouchableOpacity>

              <View style={styles.backInfoCol}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <Text style={[styles.backIdText, { color: '#38BDF8' }]}>{feedxId}</Text>
                </View>
                <Text style={styles.backStudentText} numberOfLines={1}>{studentName}</Text>
                <Text style={styles.backInstText} numberOfLines={2}>STATUS: <Text style={{ color: '#10B981', fontWeight: '800' }}>VERIFIED STUDENT</Text></Text>

                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => setQrModalVisible(true)}
                  style={styles.securityRow}
                >
                  <Feather name="maximize-2" size={10} color="#10B981" />
                  <Text style={styles.securityText}>Tap QR to Enlarge</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Footer */}
            <View style={styles.cardFooter}>
              <Text style={[styles.tapFlipNotice, { flex: 1, marginRight: 6 }]} numberOfLines={1}>
                <Feather name="refresh-cw" size={10} color="#E0F2FE" /> Tap to flip back to front
              </Text>
              <Text style={[styles.validText, { flexShrink: 0 }]} numberOfLines={1}>OFFICIAL STUDENT CREDENTIAL</Text>
            </View>
          </LinearGradient>
        </Animated.View>
      </Pressable>

      {showTapHint && (
        <View style={styles.hintContainer}>
          <Feather name="repeat" size={12} color="rgba(255,255,255,0.4)" />
          <Text style={styles.hintText}>Tap card to flip between Details and QR Verification</Text>
        </View>
      )}

      {/* Enlarged QR Code Modal */}
      <Modal visible={qrModalVisible} animationType="fade" transparent={true} onRequestClose={() => setQrModalVisible(false)}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center', alignItems: 'center', padding: 24 }}>
          <View style={{ width: '100%', maxWidth: 340, backgroundColor: '#0F172A', borderRadius: 24, borderWidth: 1.5, borderColor: '#38BDF8', padding: 24, alignItems: 'center' }}>
            <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <Text style={{ fontSize: 16, fontWeight: '900', color: '#FFF' }}>FEEDX Digital QR Code</Text>
              <TouchableOpacity onPress={() => setQrModalVisible(false)}>
                <Feather name="x" size={24} color="#FFF" />
              </TouchableOpacity>
            </View>

            <View style={{ backgroundColor: '#FFF', padding: 18, borderRadius: 20, marginBottom: 16 }}>
              <QRCode
                value={qrPayload}
                size={210}
                color="#000000"
                backgroundColor="#FFFFFF"
              />
            </View>

            <Text style={{ fontSize: 15, fontWeight: '900', color: '#38BDF8', letterSpacing: 0.5, marginBottom: 4 }}>
              {feedxId}
            </Text>
            <Text style={{ fontSize: 13, color: '#E2E8F0', fontWeight: '700', textAlign: 'center', marginBottom: 16 }}>
              {studentName}
            </Text>

            <TouchableOpacity
              style={{ backgroundColor: '#0284C7', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 12, width: '100%', alignItems: 'center' }}
              onPress={() => {
                setQrModalVisible(false);
                router.push('/tools/id-generator');
              }}
            >
              <Text style={{ color: '#FFF', fontWeight: '800', fontSize: 14 }}>Open FEEDX ID Page →</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    width: '100%',
  },
  pressContainer: {
    width: '100%',
    minHeight: rs(215),
    position: 'relative',
  },
  cardSide: {
    width: '100%',
    borderRadius: rs(22),
    overflow: 'hidden',
  },
  cardSideBack: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  cardInner: {
    padding: rs(16),
    borderRadius: rs(22),
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.45)',
    minHeight: rs(215),
    justifyContent: 'space-between',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: rs(10),
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    paddingBottom: rs(8),
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: rs(8),
    flex: 1,
    marginRight: rs(8),
  },
  logo: {
    width: rs(28),
    height: rs(28),
    borderRadius: rs(7),
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },
  instName: {
    color: '#FFFFFF',
    fontSize: rf(12),
    fontWeight: '900',
  },
  cardType: {
    color: '#E0F2FE',
    fontSize: rf(8.5),
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    flexShrink: 0,
  },
  verifiedBadgeText: {
    fontSize: rf(8.5),
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  cardBody: {
    flexDirection: 'row',
    gap: rs(12),
    alignItems: 'center',
  },
  photoContainer: {
    width: rs(66),
    height: rs(66),
    borderRadius: rs(12),
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoCol: {
    flex: 1,
  },
  name: {
    color: '#FFFFFF',
    fontSize: rf(14),
    fontWeight: '900',
    marginBottom: 2,
  },
  roll: {
    color: '#F0F9FF',
    fontSize: rf(10.5),
    fontWeight: '700',
    marginBottom: 4,
  },
  rollVal: {
    fontWeight: '900',
    color: '#FFFFFF',
  },
  detailRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 2,
  },
  label: {
    color: '#E0F2FE',
    fontSize: rf(9),
    fontWeight: '800',
  },
  value: {
    color: '#FFFFFF',
    fontSize: rf(9),
    fontWeight: '900',
    flex: 1,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.15)',
    paddingTop: rs(8),
    marginTop: rs(8),
  },
  tapFlipNotice: {
    fontSize: rf(9),
    fontWeight: '700',
    color: '#E0F2FE',
  },
  authBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flexShrink: 0,
  },
  authText: {
    color: '#60A5FA',
    fontSize: rf(8),
    fontWeight: '900',
  },
  validText: {
    color: '#94A3B8',
    fontSize: rf(8),
    fontWeight: '800',
    flexShrink: 0,
  },
  // Back Side Styles
  backBody: {
    flexDirection: 'row',
    gap: rs(14),
    alignItems: 'center',
  },
  qrBox: {
    backgroundColor: '#FFFFFF',
    padding: rs(6),
    borderRadius: rs(10),
  },
  backInfoCol: {
    flex: 1,
    gap: 2,
  },
  backIdText: {
    color: '#60A5FA',
    fontSize: rf(12),
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  backStudentText: {
    color: '#FFFFFF',
    fontSize: rf(13),
    fontWeight: '800',
  },
  backInstText: {
    color: '#94A3B8',
    fontSize: rf(10),
    fontWeight: '700',
  },
  securityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  securityText: {
    color: '#10B981',
    fontSize: rf(9),
    fontWeight: '700',
  },
  hintContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: rs(8),
  },
  hintText: {
    fontSize: rf(10),
    color: 'rgba(255, 255, 255, 0.5)',
    fontWeight: '600',
  },
});

export default StudentIdCardFlip;
