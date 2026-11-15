import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { FadeInDown, useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { useTheme } from '@/context/ThemeContext';
import { useGamification } from '@/context/GamificationContext';
import { fetchPollDetails, submitPollVote } from '@/services/supabaseService';
import { supabase } from '@/lib/supabase';
import { SPACING, FONT, RADIUS, SHADOWS } from '@/constants/theme';

export interface PollCardProps {
  poll: any;
  studentId?: string;
  currentUserId?: string;
  onVoteComplete?: () => void;
}

function OptionProgressBar({ percentage, isSelected, text, count }: { percentage: number; isSelected: boolean; text: string; count: number }) {
  const { colors, isDark } = useTheme();
  const widthAnim = useSharedValue(0);

  useEffect(() => {
    widthAnim.value = withTiming(percentage, { duration: 600 });
  }, [percentage]);

  const animatedStyle = useAnimatedStyle(() => ({
    width: `${widthAnim.value}%`,
  }));

  return (
    <View style={[styles.resultRow, { backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)' }]}>
      <Animated.View
        style={[
          styles.resultFill,
          animatedStyle,
          { backgroundColor: isSelected ? 'rgba(59, 130, 246, 0.25)' : 'rgba(100, 116, 139, 0.15)' },
        ]}
      />
      <View style={styles.resultTextContainer}>
        <View style={styles.resultTextLeft}>
          {isSelected && (
            <MaterialCommunityIcons name="check-circle" size={16} color="#3B82F6" style={{ marginRight: 6 }} />
          )}
          <Text style={[styles.resultOptionText, { color: colors.textPrimary }, isSelected && { fontWeight: '800' }]} numberOfLines={1}>
            {text}
          </Text>
        </View>
        <Text style={[styles.resultPctText, { color: isSelected ? '#3B82F6' : colors.textSecondary }]}>
          {percentage}% ({count})
        </Text>
      </View>
    </View>
  );
}

export function PollCard({ poll: initialPoll, studentId, currentUserId, onVoteComplete }: PollCardProps) {
  const activeUserId = studentId || currentUserId || '';
  const { colors, isDark } = useTheme();
  const { refreshGamification } = useGamification();

  const [pollDetails, setPollDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(false);
  const [selectedOptionIds, setSelectedOptionIds] = useState<string[]>([]);
  const [voteError, setVoteError] = useState<string | null>(null);

  const pollId = initialPoll?.id;

  const loadPollData = async () => {
    if (!pollId) return;
    try {
      const data = await fetchPollDetails(pollId, activeUserId);
      if (data) {
        setPollDetails(data);
        if (data.student_votes) {
          setSelectedOptionIds(data.student_votes);
        }
      }
    } catch (err) {
      console.warn('[PollCard] load error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPollData();
  }, [pollId, activeUserId]);

  // Real-time listener for vote count and poll status changes
  useEffect(() => {
    if (!pollId) return;
    const channel = supabase
      .channel(`poll_votes_${pollId}_${Date.now()}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'poll_votes', filter: `poll_id=eq.${pollId}` }, () => {
        loadPollData();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'polls', filter: `id=eq.${pollId}` }, () => {
        loadPollData();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'poll_options', filter: `poll_id=eq.${pollId}` }, () => {
        loadPollData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [pollId]);

  const handleOptionToggle = (optionId: string) => {
    if (pollDetails?.has_voted && !pollDetails?.allow_vote_change) return;
    if (pollDetails?.is_closed) return;

    if (pollDetails?.allow_multiple) {
      if (selectedOptionIds.includes(optionId)) {
        setSelectedOptionIds(selectedOptionIds.filter((id) => id !== optionId));
      } else {
        setSelectedOptionIds([...selectedOptionIds, optionId]);
      }
    } else {
      setSelectedOptionIds([optionId]);
    }
  };

  const handleVoteSubmit = async () => {
    if (!activeUserId) {
      Alert.alert('Authentication Required', 'Please sign in to vote.');
      return;
    }

    if (selectedOptionIds.length === 0) {
      Alert.alert('Selection Required', 'Please select at least one option to vote.');
      return;
    }

    setVoting(true);
    setVoteError(null);

    try {
      const updated = await submitPollVote({
        poll_id: pollId,
        option_ids: selectedOptionIds,
        student_id: activeUserId,
      });

      if (updated) {
        setPollDetails(updated);
        await refreshGamification();
        if (onVoteComplete) onVoteComplete();
      }
    } catch (err: any) {
      const msg = err?.message || 'Failed to submit vote.';
      setVoteError(msg);
      Alert.alert('Voting Notice', msg);
    } finally {
      setVoting(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
        <ActivityIndicator size="small" color={colors.primary} />
      </View>
    );
  }

  const poll = pollDetails || initialPoll;
  const isClosed = Boolean(poll?.is_closed);
  const hasVoted = Boolean(poll?.has_voted);
  const showResults = hasVoted || isClosed || poll?.show_results_before_vote;
  const allowMultiple = Boolean(poll?.allow_multiple);

  return (
    <Animated.View entering={FadeInDown.duration(400).springify()} style={styles.container}>
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
        {/* Top Header Row */}
        <View style={styles.headerRow}>
          <View style={styles.badgeRow}>
            <MaterialCommunityIcons name="poll" size={16} color="#3B82F6" />
            <Text style={styles.badgeText}>COMMUNITY POLL</Text>
          </View>

          <View style={[styles.statusBadge, { backgroundColor: isClosed ? 'rgba(239, 68, 68, 0.12)' : 'rgba(16, 185, 129, 0.12)' }]}>
            <Text style={[styles.statusBadgeText, { color: isClosed ? '#EF4444' : '#10B981' }]}>
              {isClosed ? 'CLOSED' : 'ACTIVE'}
            </Text>
          </View>
        </View>

        {/* Question Title */}
        <Text style={[styles.questionText, { color: colors.textPrimary }]}>
          {poll?.question || initialPoll?.question || 'Community Poll'}
        </Text>

        {allowMultiple && !showResults && (
          <Text style={[styles.subHint, { color: colors.textMuted }]}>Select all options that apply</Text>
        )}

        {/* Options List */}
        <View style={styles.optionsContainer}>
          {showResults ? (
            // Results Mode
            (poll?.options || []).map((opt: any) => (
              <OptionProgressBar
                key={opt.id}
                text={opt.option_text}
                percentage={opt.percentage || 0}
                count={opt.votes_count || 0}
                isSelected={Boolean(opt.is_selected)}
              />
            ))
          ) : (
            // Voting Mode
            (poll?.options || []).map((opt: any) => {
              const isSelected = selectedOptionIds.includes(opt.id);

              return (
                <TouchableOpacity
                  key={opt.id}
                  style={[
                    styles.optionBtn,
                    { backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)', borderColor: colors.border },
                    isSelected && { borderColor: '#3B82F6', backgroundColor: 'rgba(59, 130, 246, 0.08)' },
                  ]}
                  onPress={() => handleOptionToggle(opt.id)}
                  activeOpacity={0.8}
                >
                  <MaterialCommunityIcons
                    name={
                      allowMultiple
                        ? isSelected
                          ? 'checkbox-marked-circle'
                          : 'checkbox-blank-circle-outline'
                        : isSelected
                        ? 'radiobox-marked'
                        : 'radiobox-blank'
                    }
                    size={20}
                    color={isSelected ? '#3B82F6' : colors.textMuted}
                  />
                  <Text style={[styles.optionBtnText, { color: colors.textPrimary }, isSelected && { fontWeight: '800' }]}>
                    {opt.option_text}
                  </Text>
                </TouchableOpacity>
              );
            })
          )}
        </View>

        {/* Submit Vote Button or Voted Status Footer */}
        <View style={styles.footerRow}>
          {!showResults ? (
            <TouchableOpacity
              style={[
                styles.voteBtn,
                { backgroundColor: colors.primary },
                (selectedOptionIds.length === 0 || voting) && { opacity: 0.5 },
              ]}
              onPress={handleVoteSubmit}
              disabled={selectedOptionIds.length === 0 || voting}
              activeOpacity={0.8}
            >
              {voting ? (
                <ActivityIndicator size="small" color="#FFF" />
              ) : (
                <>
                  <Text style={styles.voteBtnText}>{allowMultiple ? 'Submit Votes' : 'Vote'}</Text>
                  <Feather name="check" size={16} color="#FFF" />
                </>
              )}
            </TouchableOpacity>
          ) : (
            <View style={styles.votedStatusRow}>
              <View style={styles.votedTextGroup}>
                <Feather name="check-circle" size={14} color="#10B981" />
                <Text style={[styles.votedStatusText, { color: colors.textSecondary }]}>
                  {hasVoted ? 'Your vote has been recorded.' : 'Poll results.'}
                </Text>
              </View>
              {hasVoted && poll?.allow_vote_change && !isClosed && (
                <TouchableOpacity onPress={() => handleVoteSubmit()}>
                  <Text style={[styles.changeVoteLink, { color: colors.primary }]}>Change Vote</Text>
                </TouchableOpacity>
              )}
            </View>
          )}

          <Text style={[styles.totalVotesText, { color: colors.textMuted }]}>
            {poll?.total_votes || 0} students voted
          </Text>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: SPACING.xs,
  },
  card: {
    borderRadius: RADIUS.xl,
    padding: SPACING.md,
    borderWidth: 1,
    gap: 12,
    ...SHADOWS.small,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#3B82F6',
    letterSpacing: 0.8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusBadgeText: {
    fontSize: 9,
    fontWeight: '900',
  },
  questionText: {
    fontSize: 15,
    fontWeight: '800',
    lineHeight: 20,
  },
  subHint: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: -6,
  },
  optionsContainer: {
    gap: 8,
  },
  optionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
  },
  optionBtnText: {
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
  },
  resultRow: {
    height: 40,
    borderRadius: RADIUS.md,
    overflow: 'hidden',
    justifyContent: 'center',
    position: 'relative',
  },
  resultFill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    borderRadius: RADIUS.md,
  },
  resultTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    zIndex: 2,
  },
  resultTextLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  resultOptionText: {
    fontSize: 12,
    fontWeight: '700',
  },
  resultPctText: {
    fontSize: 12,
    fontWeight: '900',
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
    paddingTop: 10,
  },
  voteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: RADIUS.md,
  },
  voteBtnText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '800',
  },
  votedStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  votedTextGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  votedStatusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  changeVoteLink: {
    fontSize: 11,
    fontWeight: '800',
    textDecorationLine: 'underline',
  },
  totalVotesText: {
    fontSize: 10,
    fontWeight: '600',
  },
});
