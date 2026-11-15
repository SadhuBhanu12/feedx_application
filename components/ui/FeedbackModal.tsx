import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View, Dimensions } from 'react-native';
import Animated, { FadeIn, FadeOut, FadeInDown, FadeOutDown } from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/context/ThemeContext';
import SuccessCheckmark from '@/components/ui/SuccessCheckmark';
import { MOTION_DURATIONS } from '@/constants/motion';

const { width } = Dimensions.get('window');

export interface FeedbackModalProps {
  visible: boolean;
  type: 'success' | 'error';
  title: string;
  message: string;
  ticketId?: string;
  confirmText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  onRetry?: () => void;
  onRefresh?: () => void;
  onRequestClose?: () => void;
}

export default function FeedbackModal({
  visible,
  type = 'success',
  title,
  message,
  ticketId,
  confirmText = 'Done',
  onConfirm,
  onCancel,
  onRetry,
  onRefresh,
  onRequestClose,
}: FeedbackModalProps) {
  const { colors } = useTheme();
  if (!visible) return null;

  const isSuccess = type === 'success';

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onRequestClose || onCancel}>
      <Animated.View
        entering={FadeIn.duration(MOTION_DURATIONS.fast)}
        exiting={FadeOut.duration(MOTION_DURATIONS.micro)}
        style={styles.overlay}
      >
        <Animated.View
          entering={FadeInDown.duration(MOTION_DURATIONS.normal).springify()}
          exiting={FadeOutDown.duration(MOTION_DURATIONS.fast)}
          style={[styles.card, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
        >
          {isSuccess ? (
            <View style={{ marginBottom: 16 }}>
              <SuccessCheckmark size={68} color="#10B981" />
            </View>
          ) : (
            <View style={[styles.iconCircle, styles.errorBg]}>
              <Feather name="alert-circle" size={38} color="#EF4444" />
            </View>
          )}

          <Text style={[styles.title, { color: colors.textPrimary }]}>{title}</Text>
          <Text style={[styles.message, { color: colors.textSecondary }]}>{message}</Text>

          {ticketId ? (
            <View style={[styles.ticketBox, { backgroundColor: colors.inputBg, borderColor: colors.border }]}>
              <Text style={styles.ticketLabel}>TICKET ID</Text>
              <Text style={styles.ticketValue}>{ticketId}</Text>
            </View>
          ) : null}

          {isSuccess ? (
            <TouchableOpacity style={styles.primaryBtn} onPress={onConfirm || onRequestClose} activeOpacity={0.88}>
              <LinearGradient colors={['#10B981', '#059669']} style={styles.btnGradient}>
                <Text style={styles.primaryBtnText}>{confirmText}</Text>
              </LinearGradient>
            </TouchableOpacity>
          ) : (
            <View style={styles.errorActionsRow}>
              {onRetry && (
                <TouchableOpacity style={[styles.actionBtn, styles.retryBtn]} onPress={onRetry} activeOpacity={0.8}>
                  <Text style={styles.retryBtnText}>Retry</Text>
                </TouchableOpacity>
              )}
              {onRefresh && (
                <TouchableOpacity style={[styles.actionBtn, styles.refreshBtn]} onPress={onRefresh} activeOpacity={0.8}>
                  <Text style={styles.refreshBtnText}>Refresh</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity style={[styles.actionBtn, styles.cancelBtn]} onPress={onCancel || onRequestClose} activeOpacity={0.8}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          )}
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  card: {
    width: Math.min(width - 48, 380),
    backgroundColor: '#0F172A',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  iconCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 1,
  },
  errorBg: {
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  title: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  message: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 16,
  },
  ticketBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 18,
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
  },
  ticketLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#3B82F6',
    letterSpacing: 1,
    marginBottom: 4,
  },
  ticketValue: {
    fontSize: 16,
    fontWeight: '900',
    color: '#10B981',
    letterSpacing: 1,
  },
  primaryBtn: {
    width: '100%',
    borderRadius: 14,
    overflow: 'hidden',
    marginTop: 8,
  },
  btnGradient: {
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFF',
  },
  errorActionsRow: {
    flexDirection: 'row',
    gap: 8,
    width: '100%',
    marginTop: 8,
  },
  actionBtn: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  retryBtn: {
    backgroundColor: '#3B82F6',
  },
  retryBtnText: {
    color: '#FFF',
    fontWeight: '800',
    fontSize: 13,
  },
  refreshBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  refreshBtnText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 13,
  },
  cancelBtn: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  cancelBtnText: {
    color: '#EF4444',
    fontWeight: '700',
    fontSize: 13,
  },
});
