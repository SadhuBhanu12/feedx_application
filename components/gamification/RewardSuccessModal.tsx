import React from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { useGamification } from '@/context/GamificationContext';
import { useTheme } from '@/context/ThemeContext';
import { getRewardDestination } from '@/services/rewardNavigation';

interface RewardSuccessModalProps {
  visible: boolean;
  activityType: string;
  coinsEarned: number;
  onClose: () => void;
}

export default function RewardSuccessModal({
  visible,
  activityType,
  coinsEarned,
  onClose,
}: RewardSuccessModalProps) {
  const { streak } = useGamification();
  const { colors, isDark } = useTheme();
  const router = useRouter();
  const destination = getRewardDestination(activityType);
  const currentTokens = streak?.xp_points || 0;

  const handleAction = () => {
    onClose();
    if (destination.route) {
      router.push(destination.route as any);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={[styles.card, { backgroundColor: isDark ? '#0F172A' : '#FFFFFF' }]}>
          {/* Close Icon */}
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Ionicons name="close" size={24} color={colors.textPrimary} />
          </TouchableOpacity>

          {/* Celebration Hero Badge */}
          <View style={styles.heroCircle}>
            <Text style={{ fontSize: 44 }}>🎉</Text>
          </View>

          <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Tokens (XP) Earned!</Text>

          {/* Tokens Badge */}
          <View style={styles.coinsBadge}>
            <Ionicons name="star" size={22} color="#3B82F6" style={{ marginRight: 8 }} />
            <Text style={styles.coinsAmount}>+{coinsEarned} Tokens (XP)</Text>
          </View>

          <Text style={[styles.activityTitle, { color: colors.textPrimary }]}>{destination.title}</Text>
          <Text style={styles.subtext}>
            Keep learning and earning with FEEDX! Your total balance is now{' '}
            <Text style={{ color: '#3B82F6', fontWeight: '800' }}>{currentTokens} Tokens</Text>. Every 1,000 Tokens convert to 1 Spendable Gold Coin!
          </Text>

          {/* Destination Action Button */}
          <TouchableOpacity style={styles.actionBtn} onPress={handleAction} activeOpacity={0.8}>
            <Text style={styles.actionBtnText}>{destination.buttonLabel}</Text>
            <Ionicons name="arrow-forward" size={18} color="#FFFFFF" style={{ marginLeft: 6 }} />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    borderRadius: 28,
    padding: 24,
    alignItems: 'center',
    elevation: 8,
  },
  closeBtn: {
    position: 'absolute',
    top: 16,
    right: 16,
    padding: 4,
  },
  heroCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#F59E0B',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '900',
    marginBottom: 8,
  },
  coinsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.18)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#F59E0B',
    marginBottom: 12,
  },
  coinsAmount: {
    fontSize: 20,
    fontWeight: '900',
    color: '#D97706',
  },
  activityTitle: {
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 6,
  },
  subtext: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  actionBtn: {
    width: '100%',
    backgroundColor: '#F59E0B',
    paddingVertical: 14,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
