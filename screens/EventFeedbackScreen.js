import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { COLORS } from '@/constants/theme';
import { useUser } from '@/context/UserContext';
import GlassCard from '@/components/ui/GlassCard';
import { submitEventFeedback } from '@/services/supabaseService';
import { useTheme } from '@/context/ThemeContext';

const { width } = Dimensions.get('window');

export default function EventFeedbackScreen() {
  const router = useRouter();
  const { eventId, eventTitle } = useLocalSearchParams();
  const { user } = useUser();
  const { colors, isDark } = useTheme();
  const [rating, setRating] = useState(0);
  const [favoriteSession, setFavoriteSession] = useState('');
  const [suggestions, setSuggestions] = useState('');
  const [comments, setComments] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) {
      Alert.alert('Required', 'Please select a star rating.');
      return;
    }
    setSubmitting(true);
    try {
      await submitEventFeedback(eventId, rating, favoriteSession, suggestions, comments, user?.id);
      Alert.alert(
        'Feedback Submitted',
        'Thank you for your feedback! Your digital certificate has been unlocked and dispatched.',
        [{ text: 'Great', onPress: () => router.push('/(tabs)/updates') }]
      );
    } catch (e) {
      Alert.alert('Error', e.message || 'Unable to submit feedback.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {isDark && <LinearGradient colors={['#0F172A', '#020617']} style={StyleSheet.absoluteFill} />}

      {/* Header */}
      <View style={[styles.topNav, { borderBottomColor: colors.border, backgroundColor: colors.background }]}>
        <TouchableOpacity style={[styles.backBtn, { backgroundColor: colors.inputBg, borderColor: colors.border }]} onPress={() => router.back()}>
          <Feather name="chevron-left" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]} numberOfLines={1}>Event Feedback</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.duration(500).springify()} style={styles.heroSection}>
          <View style={styles.iconCircle}>
            <Feather name="message-square" size={32} color={colors.primary} />
          </View>
          <Text style={[styles.heroTitle, { color: colors.textPrimary }]}>Feedback & Ratings</Text>
          <Text style={[styles.heroSub, { color: colors.textMuted }]}>
            Share your thoughts on &quot;{eventTitle || 'the event'}&quot; to help us improve future sessions and claim your certificate.
          </Text>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(100).duration(500)} style={styles.formSection}>
          {/* Question 1: Rating */}
          <GlassCard style={styles.questionCard}>
            <Text style={[styles.questionTitle, { color: colors.textPrimary }]}>How would you rate the overall event? *</Text>
            <View style={styles.starsRow}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity
                  key={star}
                  onPress={() => setRating(star)}
                  activeOpacity={0.7}
                >
                  <MaterialCommunityIcons
                    name={star <= rating ? 'star' : 'star-outline'}
                    size={40}
                    color={star <= rating ? '#F59E0B' : colors.textMuted}
                    style={styles.starIcon}
                  />
                </TouchableOpacity>
              ))}
            </View>
            {rating > 0 && (
              <Text style={styles.ratingText}>
                {rating === 1 ? 'Poor' : rating === 2 ? 'Fair' : rating === 3 ? 'Good' : rating === 4 ? 'Very Good' : 'Excellent!'}
              </Text>
            )}
          </GlassCard>

          {/* Question 2: Favorite Session */}
          <GlassCard style={styles.questionCard}>
            <Text style={[styles.questionTitle, { color: colors.textPrimary }]}>What was your favorite session or speaker?</Text>
            <TextInput
              style={[styles.textInput, { backgroundColor: colors.inputBg, borderColor: colors.border, color: colors.textPrimary }]}
              placeholder="e.g. Hands-on Lab, Keynote Panel..."
              placeholderTextColor={colors.inputPlaceholder}
              value={favoriteSession}
              onChangeText={setFavoriteSession}
            />
          </GlassCard>

          {/* Question 3: Suggestions */}
          <GlassCard style={styles.questionCard}>
            <Text style={[styles.questionTitle, { color: colors.textPrimary }]}>Any suggestions for improvement?</Text>
            <TextInput
              style={[styles.textInput, styles.textArea, { backgroundColor: colors.inputBg, borderColor: colors.border, color: colors.textPrimary }]}
              placeholder="Tell us what we can do better next time..."
              placeholderTextColor={colors.inputPlaceholder}
              multiline
              numberOfLines={4}
              value={suggestions}
              onChangeText={setSuggestions}
            />
          </GlassCard>

          {/* Question 4: Comments */}
          <GlassCard style={styles.questionCard}>
            <Text style={[styles.questionTitle, { color: colors.textPrimary }]}>General Comments</Text>
            <TextInput
              style={[styles.textInput, styles.textArea, { backgroundColor: colors.inputBg, borderColor: colors.border, color: colors.textPrimary }]}
              placeholder="Any other comments or feedback..."
              placeholderTextColor={colors.inputPlaceholder}
              multiline
              numberOfLines={4}
              value={comments}
              onChangeText={setComments}
            />
          </GlassCard>

          {/* Submit button */}
          <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} disabled={submitting}>
            <LinearGradient colors={['#3B82F6', '#1D4ED8']} style={styles.submitGradient}>
              <Text style={styles.submitBtnText}>{submitting ? 'Submitting...' : 'Submit Feedback'}</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  topNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 54,
    paddingBottom: 14,
    borderBottomWidth: 1,
  },
  backBtn: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  headerTitle: { fontSize: 16, fontWeight: '800', flex: 1, textAlign: 'center' },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 60 },
  heroSection: { alignItems: 'center', marginTop: 24, marginBottom: 24, gap: 10 },
  iconCircle: { width: 64, height: 64, borderRadius: 32, backgroundColor: 'rgba(59, 130, 246, 0.1)', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(59, 130, 246, 0.2)' },
  heroTitle: { fontSize: 20, fontWeight: '900' },
  heroSub: { fontSize: 12, textAlign: 'center', lineHeight: 18 },
  formSection: { gap: 14 },
  questionCard: { padding: 18, gap: 12 },
  questionTitle: { fontSize: 13, fontWeight: '800' },
  starsRow: { flexDirection: 'row', justifyContent: 'center', gap: 14, paddingVertical: 10 },
  starIcon: { marginHorizontal: 2 },
  ratingText: { fontSize: 13, fontWeight: '800', color: '#F59E0B', textAlign: 'center' },
  textInput: { borderWidth: 1, borderRadius: 12, paddingHorizontal: 14, height: 46, fontSize: 13, fontWeight: '600' },
  textArea: { height: 100, textAlignVertical: 'top', paddingVertical: 12 },
  submitBtn: { borderRadius: 14, overflow: 'hidden', marginTop: 10 },
  submitGradient: { height: 50, alignItems: 'center', justifyContent: 'center' },
  submitBtnText: { fontSize: 15, fontWeight: '800', color: '#FFF' },
});
