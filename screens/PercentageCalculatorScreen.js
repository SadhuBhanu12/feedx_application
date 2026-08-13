import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  Platform,
  FlatList,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS } from '@/constants/theme';
import GlassCard from '@/components/ui/GlassCard';
import { useTheme } from '@/context/ThemeContext';

const STORAGE_KEY = '@feedx_percentage_history';

export default function PercentageCalculatorScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const [cgpa, setCgpa] = useState('');
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch (e) {
      console.warn('Failed loading percentage history', e);
    }
  };

  const saveHistory = async (newHistory) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
    } catch (e) {
      console.warn('Failed saving percentage history', e);
    }
  };

  const handleCalculate = () => {
    const val = parseFloat(cgpa.trim());
    if (isNaN(val) || val < 0 || val > 10) {
      Alert.alert('Invalid CGPA', 'Please enter a valid CGPA between 0.00 and 10.00.');
      return;
    }

    const calculatedPercentage = parseFloat((val * 9.5).toFixed(2));
    setResult(calculatedPercentage);

    const newItem = {
      id: Date.now().toString(),
      cgpa: val.toFixed(2),
      percentage: calculatedPercentage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updated = [newItem, ...history.slice(0, 9)];
    setHistory(updated);
    saveHistory(updated);
  };

  const handleReset = () => {
    setCgpa('');
    setResult(null);
  };

  const handleCopy = () => {
    if (result === null) return;
    const text = `CGPA: ${cgpa} = ${result}% (Percentage = CGPA × 9.5)`;
    if (Platform.OS === 'web' && navigator?.clipboard) {
      navigator.clipboard.writeText(text);
      Alert.alert('Copied!', 'Calculation copied to clipboard.');
    } else {
      Alert.alert('Calculation Result', text);
    }
  };

  const handleClearHistory = () => {
    setHistory([]);
    AsyncStorage.removeItem(STORAGE_KEY);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {isDark && <LinearGradient colors={['#0F172A', '#020617']} style={StyleSheet.absoluteFillObject} />}

      <View style={[styles.header, { borderBottomColor: colors.border, backgroundColor: colors.background }]}>
        <TouchableOpacity style={[styles.backBtn, { backgroundColor: colors.inputBg, borderColor: colors.border }]} onPress={() => router.back()}>
          <Feather name="arrow-left" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Percentage Calculator</Text>
        <TouchableOpacity style={[styles.resetBtn, { backgroundColor: colors.inputBg, borderColor: colors.border }]} onPress={handleReset}>
          <Feather name="refresh-cw" size={18} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Formula Badge */}
        <Animated.View entering={FadeInDown.duration(400)} style={[styles.formulaBadge, { backgroundColor: isDark ? 'rgba(16, 185, 129, 0.1)' : 'rgba(16, 185, 129, 0.15)', borderColor: 'rgba(16, 185, 129, 0.25)' }]}>
          <MaterialCommunityIcons name="calculator-variant" size={20} color="#10B981" />
          <Text style={[styles.formulaText, { color: isDark ? '#10B981' : '#059669' }]}>Formula: Percentage = CGPA × 9.5</Text>
        </Animated.View>

        {/* Input Card */}
        <GlassCard style={styles.inputCard}>
          <Text style={[styles.inputLabel, { color: colors.textMuted }]}>ENTER YOUR CGPA (0 - 10)</Text>
          <TextInput
            style={[styles.cgpaInput, { backgroundColor: colors.inputBg, borderColor: colors.border, color: colors.textPrimary }]}
            placeholder="e.g. 9.0"
            placeholderTextColor={colors.inputPlaceholder}
            keyboardType="decimal-pad"
            value={cgpa}
            onChangeText={(txt) => {
              setCgpa(txt);
              if (result !== null) setResult(null);
            }}
          />

          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.calcBtn} onPress={handleCalculate}>
              <LinearGradient colors={['#10B981', '#059669']} style={styles.calcGradient}>
                <Text style={styles.calcBtnText}>Calculate Percentage</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.clearBtn, { backgroundColor: colors.inputBg, borderColor: colors.border }]} onPress={handleReset}>
              <Text style={[styles.clearBtnText, { color: colors.textSecondary }]}>Reset</Text>
            </TouchableOpacity>
          </View>
        </GlassCard>

        {/* Result Card */}
        {result !== null && (
          <Animated.View entering={FadeInDown.duration(350).springify()}>
            <GlassCard style={styles.resultCard}>
              <Text style={[styles.resultLabel, { color: colors.textMuted }]}>EQUIVALENT PERCENTAGE</Text>
              <Text style={[styles.resultValue, { color: colors.textPrimary }]}>{result}%</Text>
              <Text style={[styles.resultBreakdown, { color: colors.textSecondary }]}>
                Calculation: {cgpa} × 9.5 = {result}%
              </Text>

              <TouchableOpacity style={styles.copyBtn} onPress={handleCopy}>
                <Feather name="copy" size={16} color="#FFF" />
                <Text style={styles.copyBtnText}>Copy Result</Text>
              </TouchableOpacity>
            </GlassCard>
          </Animated.View>
        )}

        {/* Calculation History */}
        <View style={styles.historyHeader}>
          <Text style={[styles.historyTitle, { color: colors.textPrimary }]}>Calculation History</Text>
          {history.length > 0 && (
            <TouchableOpacity onPress={handleClearHistory}>
              <Text style={styles.clearHistoryText}>Clear All</Text>
            </TouchableOpacity>
          )}
        </View>

        {history.length === 0 ? (
          <View style={styles.emptyHistory}>
            <Feather name="clock" size={32} color={colors.textMuted} />
            <Text style={[styles.emptyHistoryText, { color: colors.textMuted }]}>No calculation history recorded yet.</Text>
          </View>
        ) : (
          history.map((item) => (
            <GlassCard key={item.id} style={styles.historyCard}>
              <View style={styles.historyRow}>
                <View>
                  <Text style={[styles.historyCgpa, { color: colors.textPrimary }]}>CGPA: {item.cgpa}</Text>
                  <Text style={[styles.historyTime, { color: colors.textMuted }]}>{item.timestamp}</Text>
                </View>
                <Text style={[styles.historyPercentage, { color: '#10B981' }]}>{item.percentage}%</Text>
              </View>
            </GlassCard>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020617' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: { fontSize: 20, fontWeight: '800', color: '#FFF' },
  resetBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: { paddingHorizontal: 24, paddingBottom: 40 },
  formulaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.2)',
    marginBottom: 20,
  },
  formulaText: { color: '#10B981', fontSize: 13, fontWeight: '700' },
  inputCard: { padding: 20, borderRadius: 20, marginBottom: 20 },
  inputLabel: { color: 'rgba(255,255,255,0.5)', fontSize: 11, fontWeight: '800', letterSpacing: 0.5, marginBottom: 12 },
  cgpaInput: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 14,
    paddingHorizontal: 16,
    height: 54,
    fontSize: 22,
    fontWeight: '800',
    color: '#FFF',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    marginBottom: 16,
  },
  actionRow: { flexDirection: 'row', gap: 12 },
  calcBtn: { flex: 1, borderRadius: 14, overflow: 'hidden' },
  calcGradient: { height: 48, alignItems: 'center', justifyContent: 'center' },
  calcBtnText: { color: '#FFF', fontSize: 14, fontWeight: '800' },
  clearBtn: {
    paddingHorizontal: 20,
    height: 48,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  clearBtnText: { color: 'rgba(255,255,255,0.7)', fontSize: 14, fontWeight: '700' },
  resultCard: { padding: 24, borderRadius: 20, alignItems: 'center', marginBottom: 24, backgroundColor: 'rgba(16, 185, 129, 0.05)', borderColor: 'rgba(16, 185, 129, 0.2)' },
  resultLabel: { color: 'rgba(255,255,255,0.6)', fontSize: 12, fontWeight: '800', letterSpacing: 1, marginBottom: 6 },
  resultValue: { fontSize: 42, fontWeight: '900', color: '#10B981', marginBottom: 6 },
  resultBreakdown: { color: 'rgba(255,255,255,0.5)', fontSize: 13, fontWeight: '600', marginBottom: 16 },
  copyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  copyBtnText: { color: '#FFF', fontSize: 13, fontWeight: '700' },
  historyHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  historyTitle: { fontSize: 16, fontWeight: '800', color: '#FFF' },
  clearHistoryText: { fontSize: 12, color: 'rgba(244,63,94,0.8)', fontWeight: '700' },
  emptyHistory: { alignItems: 'center', padding: 30 },
  emptyHistoryText: { color: 'rgba(255,255,255,0.4)', marginTop: 8, fontSize: 13 },
  historyCard: { padding: 16, borderRadius: 14, marginBottom: 8 },
  historyRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  historyCgpa: { color: '#FFF', fontSize: 14, fontWeight: '700' },
  historyTime: { color: 'rgba(255,255,255,0.4)', fontSize: 11, marginTop: 2 },
  historyPercentage: { fontSize: 18, fontWeight: '900', color: '#10B981' },
});
