import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Modal,
  Platform,
  Dimensions,
} from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SPACING } from '@/constants/theme';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

/**
 * Hook to manage complex multi-select filtering states.
 */
export function useFilterState(initialState = {}) {
  const [filters, setFilters] = useState(initialState);
  const [appliedFilters, setAppliedFilters] = useState(initialState);

  const setFilterValue = useCallback((key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const toggleMultiSelect = useCallback((key, value) => {
    setFilters((prev) => {
      const current = Array.isArray(prev[key]) ? prev[key] : [];
      const updated = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      return { ...prev, [key]: updated };
    });
  }, []);

  const apply = useCallback(() => {
    setAppliedFilters(filters);
  }, [filters]);

  const reset = useCallback((defaultState = {}) => {
    setFilters(defaultState);
    setAppliedFilters(defaultState);
  }, []);

  const clearKey = useCallback((key, defaultValue = null) => {
    setFilters((prev) => {
      const updated = { ...prev, [key]: defaultValue };
      setAppliedFilters(updated);
      return updated;
    });
  }, []);

  return {
    filters,
    appliedFilters,
    setFilterValue,
    toggleMultiSelect,
    apply,
    reset,
    clearKey,
  };
}

/**
 * Reusable dynamic Filter Bottom Sheet UI Component.
 */
export function FilterBottomSheet({
  visible,
  onClose,
  title = 'Filter Options',
  sections = [],
  filters,
  setFilterValue,
  toggleMultiSelect,
  onApply,
  onReset,
}) {
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <BlurView intensity={20} style={StyleSheet.absoluteFill} tint="dark" />
        <TouchableOpacity style={styles.dismissArea} onPress={onClose} activeOpacity={1} />
        
        <View style={styles.sheet}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>{title}</Text>
            <TouchableOpacity onPress={onClose}>
              <Feather name="x" size={22} color="#FFF" />
            </TouchableOpacity>
          </View>

          {/* Form Content */}
          <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
            {sections.map((sec) => {
              const val = filters[sec.key];

              return (
                <View key={sec.key} style={styles.section}>
                  <Text style={styles.sectionTitle}>{sec.title}</Text>
                  
                  {sec.type === 'switch' && (
                    <View style={styles.switchRow}>
                      <Text style={styles.switchLabel}>{sec.label || 'Enable'}</Text>
                      <Switch
                        value={!!val}
                        onValueChange={(v) => setFilterValue(sec.key, v)}
                        trackColor={{ false: '#1E293B', true: COLORS.primary }}
                        thumbColor="#FFF"
                      />
                    </View>
                  )}

                  {sec.type === 'single' && (
                    <View style={styles.chipsRow}>
                      {sec.options.map((opt) => {
                        const optVal = typeof opt === 'object' ? opt.value : opt;
                        const optLabel = typeof opt === 'object' ? opt.label : opt;
                        const isSelected = val === optVal;

                        return (
                          <TouchableOpacity
                            key={optVal}
                            activeOpacity={0.8}
                            style={[styles.chip, isSelected && styles.chipActive]}
                            onPress={() => {
                              try { Haptics.selectionAsync().catch(() => {}); } catch {}
                              setFilterValue(sec.key, optVal);
                            }}
                          >
                            <Text style={[styles.chipText, isSelected && styles.chipTextActive]}>
                              {optLabel}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  )}

                  {sec.type === 'multi' && (
                    <View style={styles.chipsRow}>
                      {sec.options.map((opt) => {
                        const optVal = typeof opt === 'object' ? opt.value : opt;
                        const optLabel = typeof opt === 'object' ? opt.label : opt;
                        const currentArr = Array.isArray(val) ? val : [];
                        const isSelected = currentArr.includes(optVal);

                        return (
                          <TouchableOpacity
                            key={optVal}
                            activeOpacity={0.8}
                            style={[styles.chip, isSelected && styles.chipActive]}
                            onPress={() => {
                              try { Haptics.selectionAsync().catch(() => {}); } catch {}
                              toggleMultiSelect(sec.key, optVal);
                            }}
                          >
                            <Text style={[styles.chipText, isSelected && styles.chipTextActive]}>
                              {optLabel}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  )}
                </View>
              );
            })}
          </ScrollView>

          {/* Footer Actions */}
          <View style={styles.actions}>
            <TouchableOpacity style={styles.resetBtn} onPress={onReset}>
              <Text style={styles.resetText}>Reset All</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.applyBtn} onPress={onApply}>
              <Text style={styles.applyText}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

/**
 * Inline active filter chip tags component.
 */
export function FilterChipsBar({ appliedFilters, onClearKey, keysToRender = [] }) {
  const activeChips = keysToRender.filter((key) => {
    const val = appliedFilters[key];
    if (Array.isArray(val)) return val.length > 0;
    if (typeof val === 'boolean') return val === true;
    return val !== undefined && val !== null && val !== '' && val !== 'All' && val !== 'all';
  });

  if (activeChips.length === 0) return null;

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.chipsBarContainer}
    >
      {activeChips.map((key) => {
        const val = appliedFilters[key];
        const displayLabel = Array.isArray(val) ? val.join(', ') : String(val);

        return (
          <View key={key} style={styles.barChip}>
            <Text style={styles.barChipText}>
              {key.toUpperCase()}: {displayLabel}
            </Text>
            <TouchableOpacity onPress={() => onClearKey(key, Array.isArray(val) ? [] : '')}>
              <Feather name="x" size={14} color="rgba(255,255,255,0.6)" />
            </TouchableOpacity>
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'flex-end' },
  dismissArea: { flex: 1 },
  sheet: {
    backgroundColor: '#0F172A',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: SCREEN_HEIGHT * 0.75,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#FFF' },
  scroll: { paddingHorizontal: 20, paddingTop: 16 },
  section: { marginBottom: 20 },
  sectionTitle: { color: 'rgba(255,255,255,0.5)', fontSize: 11, fontWeight: '800', letterSpacing: 0.5, marginBottom: 10 },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  switchLabel: { color: '#FFF', fontSize: 14 },
  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  chipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  chipText: { color: 'rgba(255,255,255,0.6)', fontSize: 12, fontWeight: '600' },
  chipTextActive: { color: '#FFF', fontWeight: '800' },
  actions: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
  },
  resetBtn: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  resetText: { color: 'rgba(255,255,255,0.7)', fontSize: 14, fontWeight: '700' },
  applyBtn: {
    flex: 2,
    height: 48,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyText: { color: '#FFF', fontSize: 14, fontWeight: '800' },
  chipsBarContainer: { paddingHorizontal: 20, paddingVertical: 10, gap: 8 },
  barChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
  },
  barChipText: { color: COLORS.primary, fontSize: 11, fontWeight: '700' },
});
