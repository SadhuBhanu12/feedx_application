import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { COLORS, SPACING } from '@/constants/theme';
import { globalSearch } from '@/services/supabaseService';

export default function GlobalSearchModal({ visible, onClose, userId }) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);

  useEffect(() => {
    if (!visible) {
      setQuery('');
      setResults(null);
    }
  }, [visible]);

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults(null);
      return;
    }
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await globalSearch(query, userId);
        setResults(data);
      } catch {
        setResults({ events: [], opportunities: [], resources: [], colleges: [] });
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [query, userId]);

  const navigate = (type, item) => {
    onClose();
    if (type === 'event') router.push(`/event-detail?id=${item.id}`);
    else if (type === 'opportunity') router.push('/(tabs)/opportunities');
    else if (type === 'resource') router.push('/(tabs)/academics');
    else if (type === 'college') router.push(`/college-detail?id=${item.id}`);
    else if (type === 'post') router.push('/community');
    else if (type === 'innovation') router.push(`/innovation?id=${item.id}`);
  };

  const renderSection = (title, items, type, icon) => {
    if (!items?.length) return null;
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {items.map((item) => (
          <TouchableOpacity key={item.id} style={styles.resultRow} onPress={() => navigate(type, item)}>
            <Feather name={icon} size={16} color={COLORS.primary} />
            <View style={{ flex: 1 }}>
              <Text style={styles.resultTitle} numberOfLines={1}>{item.title || item.name || item.caption}</Text>
              <Text style={styles.resultMeta} numberOfLines={1}>
                {item.company || item.venue || item.location || item.subject || item.type || item.category || ''}
              </Text>
            </View>
            <Feather name="chevron-right" size={16} color={COLORS.textMuted} />
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const hasResults = results && (
    (results.events?.length || 0) + 
    (results.opportunities?.length || 0) + 
    (results.resources?.length || 0) + 
    (results.colleges?.length || 0) +
    (results.posts?.length || 0) +
    (results.innovations?.length || 0) > 0
  );

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <BlurView intensity={40} tint="dark" style={styles.overlay}>
        <View style={styles.sheet}>
          <View style={styles.searchBar}>
            <Feather name="search" size={20} color={COLORS.textMuted} />
            <TextInput
              style={styles.input}
              placeholder="Search events, jobs, resources, colleges..."
              placeholderTextColor={COLORS.textDisabled}
              value={query}
              onChangeText={setQuery}
              autoFocus
            />
            <TouchableOpacity onPress={onClose}>
              <Feather name="x" size={22} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>

          {loading ? (
            <ActivityIndicator color={COLORS.primary} style={{ marginTop: 24 }} />
          ) : (
            <ScrollView style={styles.results} keyboardShouldPersistTaps="handled">
              {!query.trim() ? (
                <Text style={styles.hint}>Type at least 2 characters to search</Text>
              ) : !hasResults ? (
                <Text style={styles.hint}>No results found for &ldquo;{query}&rdquo;</Text>
              ) : (
                <>
                  {renderSection('Events', results.events, 'event', 'calendar')}
                  {renderSection('Opportunities', results.opportunities, 'opportunity', 'briefcase')}
                  {renderSection('Resources', results.resources, 'resource', 'book')}
                  {renderSection('Colleges', results.colleges, 'college', 'award')}
                  {renderSection('Forum Posts', results.posts, 'post', 'message-square')}
                  {renderSection('Innovation Ideas', results.innovations, 'innovation', 'lightbulb')}
                </>
              )}
            </ScrollView>
          )}
        </View>
      </BlurView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'flex-start', paddingTop: 60, paddingHorizontal: SPACING.md },
  sheet: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    maxHeight: '80%',
    overflow: 'hidden',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  input: { flex: 1, color: COLORS.textPrimary, fontSize: 16 },
  results: { padding: SPACING.md },
  hint: { color: COLORS.textMuted, textAlign: 'center', marginTop: 20 },
  section: { marginBottom: SPACING.md },
  sectionTitle: { color: COLORS.textMuted, fontSize: 11, fontWeight: '800', letterSpacing: 1, marginBottom: 8 },
  resultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  resultTitle: { color: COLORS.textPrimary, fontWeight: '700', fontSize: 15 },
  resultMeta: { color: COLORS.textMuted, fontSize: 12, marginTop: 2 },
});
