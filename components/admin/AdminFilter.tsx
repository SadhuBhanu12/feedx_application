import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Feather } from '@expo/vector-icons';

const BRANCHES = ['All', 'CSE', 'ECE', 'EEE', 'MECH', 'CIVIL'];
const YEARS = ['All', '1', '2', '3', '4'];
const SECTIONS = ['All', 'A', 'B', 'C'];

interface AdminFilterProps {
  filters: {
    branch: string;
    year: string;
    section: string;
  };
  setFilters: (filters: any) => void;
}

export default function AdminFilter({ filters, setFilters }: AdminFilterProps) {
  const renderPill = (type: keyof AdminFilterProps['filters'], value: string, label: string) => {
    const active = filters[type] === value;
    return (
      <TouchableOpacity
        key={value}
        onPress={() => setFilters({ ...filters, [type]: value })}
        style={[styles.pill, active && styles.pillActive]}
      >
        <Text style={[styles.pillText, active && styles.pillTextActive]}>{label}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <View style={styles.labelRow}>
           <Feather name="layers" size={14} color="#3B82F6" />
           <Text style={styles.label}>Select Branch</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scroll}>
          {BRANCHES.map(b => renderPill('branch', b, b))}
        </ScrollView>
      </View>

      <View style={styles.row}>
        <View style={[styles.section, { flex: 1 }]}>
          <View style={styles.labelRow}>
             <Feather name="calendar" size={14} color="#10B981" />
             <Text style={styles.label}>Academic Year</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scroll}>
            {YEARS.map(y => renderPill('year', y, y))}
          </ScrollView>
        </View>

        <View style={[styles.section, { flex: 1 }]}>
          <View style={styles.labelRow}>
             <Feather name="grid" size={14} color="#F59E0B" />
             <Text style={styles.label}>Section</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scroll}>
            {SECTIONS.map(s => renderPill('section', s, s))}
          </ScrollView>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 16, marginBottom: 20 },
  section: { gap: 8 },
  row: { flexDirection: 'row', gap: 16 },
  labelRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginLeft: 4 },
  label: { fontSize: 10, fontWeight: '700', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: 0.5 },
  scroll: { gap: 8, paddingLeft: 4 },
  pill: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  pillActive: { backgroundColor: '#3B82F6', borderColor: '#60A5FA' },
  pillText: { fontSize: 13, color: 'rgba(255,255,255,0.5)', fontWeight: '600' },
  pillTextActive: { color: '#FFF', fontWeight: '800' },
});
