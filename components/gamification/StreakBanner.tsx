import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { useGamification } from '@/context/GamificationContext';
import { useTheme } from '@/context/ThemeContext';
import StreakModal from './StreakModal';

export default function StreakBanner() {
  const { wallet, streak } = useGamification();
  const { colors, isDark } = useTheme();
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);

  const currentStreak = streak?.current_streak || 1;
  const coins = wallet?.gold_coins || 0;

  return (
    <>
      <View style={[styles.container, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
        {/* Streak Pill */}
        <TouchableOpacity
          style={[styles.pill, { backgroundColor: isDark ? 'rgba(245, 158, 11, 0.15)' : '#FEF3C7', borderColor: '#F59E0B' }]}
          onPress={() => setModalVisible(true)}
          activeOpacity={0.8}
        >
          <Text style={styles.flameEmoji}>🔥</Text>
          <Text style={styles.streakText}>{currentStreak} Days</Text>
          <View style={styles.multiplierBadge}>
            <Text style={styles.multiplierText}>1.5x</Text>
          </View>
        </TouchableOpacity>

        {/* Gold Coins Wallet Pill */}
        <TouchableOpacity
          style={[styles.pill, { backgroundColor: isDark ? 'rgba(234, 179, 8, 0.15)' : '#FEF08A', borderColor: '#EAB308' }]}
          onPress={() => router.push('/rewards' as any)}
          activeOpacity={0.8}
        >
          <FontAwesome5 name="coins" size={14} color="#D97706" style={{ marginRight: 5 }} />
          <Text style={styles.coinsText}>{coins} Coins</Text>
          <Ionicons name="chevron-forward" size={12} color="#D97706" style={{ marginLeft: 2 }} />
        </TouchableOpacity>
      </View>

      <StreakModal visible={modalVisible} onClose={() => setModalVisible(false)} />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
    borderWidth: 1,
    marginHorizontal: 16,
    marginVertical: 8,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  flameEmoji: {
    fontSize: 14,
    marginRight: 4,
  },
  streakText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#D97706',
  },
  multiplierBadge: {
    backgroundColor: '#F59E0B',
    borderRadius: 8,
    paddingHorizontal: 4,
    paddingVertical: 1,
    marginLeft: 6,
  },
  multiplierText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  coinsText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#B45309',
  },
});
