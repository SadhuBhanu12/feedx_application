import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Dimensions,
} from 'react-native';
import Animated, { FadeOutDown, ZoomIn } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';
import { SPACING, RADIUS, SHADOWS } from '@/constants/theme';

const { width } = Dimensions.get('window');

export type AlertType = 'success' | 'info' | 'warning' | 'error';

export interface AlertButton {
  text: string;
  onPress?: () => void;
  style?: 'default' | 'cancel' | 'destructive';
}

export interface FeedxAlertModalProps {
  visible: boolean;
  title: string;
  message: string;
  type?: AlertType;
  buttons?: AlertButton[];
  onClose: () => void;
}

const TYPE_CONFIG = {
  success: {
    icon: 'check-circle',
    iconColor: '#10B981',
    badgeBg: 'rgba(16, 185, 129, 0.15)',
    borderGlow: 'rgba(16, 185, 129, 0.3)',
    gradient: ['#10B981', '#059669'],
  },
  info: {
    icon: 'info',
    iconColor: '#3B82F6',
    badgeBg: 'rgba(59, 130, 246, 0.15)',
    borderGlow: 'rgba(59, 130, 246, 0.3)',
    gradient: ['#3B82F6', '#1D4ED8'],
  },
  warning: {
    icon: 'alert-triangle',
    iconColor: '#F59E0B',
    badgeBg: 'rgba(245, 158, 11, 0.15)',
    borderGlow: 'rgba(245, 158, 11, 0.3)',
    gradient: ['#F59E0B', '#D97706'],
  },
  error: {
    icon: 'alert-octagon',
    iconColor: '#EF4444',
    badgeBg: 'rgba(239, 68, 68, 0.15)',
    borderGlow: 'rgba(239, 68, 68, 0.3)',
    gradient: ['#EF4444', '#DC2626'],
  },
};

export function FeedxAlertModal({
  visible,
  title,
  message,
  type = 'info',
  buttons = [{ text: 'OK', style: 'default' }],
  onClose,
}: FeedxAlertModalProps) {
  const { colors, isDark } = useTheme();
  const config = TYPE_CONFIG[type] || TYPE_CONFIG.info;

  if (!visible) return null;

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backdrop}>
          <TouchableWithoutFeedback>
            <Animated.View
              entering={ZoomIn.duration(260).springify()}
              exiting={FadeOutDown.duration(180)}
              style={[
                styles.modalCard,
                {
                  backgroundColor: isDark ? '#111827' : '#FFFFFF',
                  borderColor: isDark ? 'rgba(255,255,255,0.1)' : config.borderGlow,
                },
              ]}
            >
              {/* Top Accent Line */}
              <LinearGradient
                colors={config.gradient as any}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.topAccentBar}
              />

              {/* Status Badge Icon */}
              <View style={[styles.badgeWrap, { backgroundColor: config.badgeBg }]}>
                <Feather name={config.icon as any} size={28} color={config.iconColor} />
              </View>

              {/* Content */}
              <Text style={[styles.titleText, { color: colors.textPrimary }]}>{title}</Text>
              <Text style={[styles.messageText, { color: colors.textSecondary }]}>{message}</Text>

              {/* Action Buttons */}
              <View style={styles.buttonContainer}>
                {buttons.map((btn, idx) => {
                  const isCancel = btn.style === 'cancel';
                  const isDestructive = btn.style === 'destructive';

                  return (
                    <TouchableOpacity
                      key={idx}
                      activeOpacity={0.8}
                      onPress={() => {
                        btn.onPress?.();
                        onClose();
                      }}
                      style={[
                        styles.btn,
                        isCancel
                          ? [
                            styles.btnCancel,
                            {
                              backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : '#F1F5F9',
                              borderColor: colors.border,
                            },
                          ]
                          : isDestructive
                            ? [styles.btnPrimary, { backgroundColor: '#EF4444' }]
                            : [styles.btnPrimary, { backgroundColor: colors.primary }],
                      ]}
                    >
                      <Text
                        style={[
                          styles.btnText,
                          isCancel
                            ? { color: colors.textPrimary }
                            : { color: '#FFFFFF', fontWeight: '800' },
                        ]}
                      >
                        {btn.text}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.72)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.lg,
  },
  modalCard: {
    width: Math.min(width - 48, 380),
    borderRadius: RADIUS.xl,
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 22,
    alignItems: 'center',
    borderWidth: 1.5,
    overflow: 'hidden',
    ...SHADOWS.medium,
  },
  topAccentBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
  },
  badgeWrap: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  titleText: {
    fontSize: 17,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 8,
  },
  messageText: {
    fontSize: 13.5,
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: 22,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
  },
  btn: {
    flex: 1,
    height: 44,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnCancel: {
    borderWidth: 1,
  },
  btnPrimary: {
    ...SHADOWS.small,
  },
  btnText: {
    fontSize: 14,
    fontWeight: '700',
  },
});
