import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme, ThemeMode } from '@/context/ThemeContext';

interface Props {
  compact?: boolean;
}

export default function ThemeToggle({ compact = false }: Props) {
  const { themeMode, activeTheme, isDark, toggleTheme, setThemeMode, colors } = useTheme();

  if (compact) {
    return (
      <TouchableOpacity
        style={[
          styles.compactBtn,
          {
            backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(15, 23, 42, 0.08)',
            borderColor: colors.border,
          },
        ]}
        onPress={toggleTheme}
        activeOpacity={0.8}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Feather
          name={isDark ? 'sun' : 'moon'}
          size={18}
          color={isDark ? '#F59E0B' : '#2563EB'}
        />
      </TouchableOpacity>
    );
  }

  const options: { mode: ThemeMode; label: string; icon: 'sun' | 'moon' | 'settings' }[] = [
    { mode: 'light', label: 'Light', icon: 'sun' },
    { mode: 'dark', label: 'Dark', icon: 'moon' },
    { mode: 'system', label: 'System', icon: 'settings' },
  ];

  return (
    <View style={[styles.cardContainer, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
      <View style={styles.headerRow}>
        <View style={styles.titleColumn}>
          <View style={styles.titleWithIcon}>
            <Feather
              name={isDark ? 'moon' : 'sun'}
              size={18}
              color={isDark ? '#A855F7' : '#F59E0B'}
              style={{ marginRight: 8 }}
            />
            <Text style={[styles.titleText, { color: colors.textPrimary }]}>Appearance</Text>
          </View>
          <Text style={[styles.subtitleText, { color: colors.textMuted }]}>
            Customize how FEEDX looks on your device
          </Text>
        </View>
      </View>

      <View style={[styles.segmentContainer, { backgroundColor: colors.inputBg, borderColor: colors.inputBorder }]}>
        {options.map((opt) => {
          const isSelected = themeMode === opt.mode;
          return (
            <TouchableOpacity
              key={opt.mode}
              style={[
                styles.segmentBtn,
                isSelected && [
                  styles.segmentBtnSelected,
                  { backgroundColor: isDark ? '#3B82F6' : '#2563EB' },
                ],
              ]}
              onPress={() => setThemeMode(opt.mode)}
              activeOpacity={0.85}
            >
              <Feather
                name={opt.icon}
                size={14}
                color={isSelected ? '#FFFFFF' : colors.textMuted}
                style={{ marginRight: 6 }}
              />
              <Text
                style={[
                  styles.segmentLabel,
                  { color: isSelected ? '#FFFFFF' : colors.textSecondary },
                  isSelected && styles.segmentLabelSelected,
                ]}
              >
                {opt.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  compactBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  cardContainer: {
    padding: 18,
    borderRadius: 22,
    borderWidth: 1,
    marginVertical: 10,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  titleColumn: {
    flex: 1,
  },
  titleWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  titleText: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  subtitleText: {
    fontSize: 12.5,
    fontWeight: '500',
  },
  segmentContainer: {
    flexDirection: 'row',
    padding: 4,
    borderRadius: 14,
    borderWidth: 1,
    gap: 4,
  },
  segmentBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 10,
  },
  segmentBtnSelected: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  segmentLabel: {
    fontSize: 12.5,
    fontWeight: '600',
  },
  segmentLabelSelected: {
    fontWeight: '800',
  },
});
