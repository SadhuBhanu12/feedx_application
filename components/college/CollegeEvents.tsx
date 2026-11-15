import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { useTheme } from '@/context/ThemeContext';
import { useUser } from '@/context/UserContext';
import { supabase } from '@/lib/supabase';
import { EventRepository } from '@/repository/EventRepository';
import { SPACING, RADIUS, SHADOWS, FONT } from '@/constants/theme';

export function CollegeEvents() {
  const { colors, isDark } = useTheme();
  const { user, dashboard } = useUser();
  const router = useRouter();

  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const collegeId = user?.college_id || dashboard?.profile?.college_id || null;

  const loadEvents = async () => {
    setLoading(true);
    try {
      if (collegeId) {
        const res = await EventRepository.getCollegeEvents(collegeId);
        setEvents(((res as any)?.data || []).slice(0, 6));
      } else {
        const res = await EventRepository.getEvents();
        setEvents(((res as any)?.data || []).slice(0, 6));
      }
    } catch (e) {
      console.warn('[CollegeEvents] Error fetching events:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();

    const channel = supabase
      .channel(`college_events_live_${Date.now()}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'events' }, () => {
        loadEvents();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, collegeId]);

  return (
    <Animated.View entering={FadeInUp.duration(400).delay(200).springify()} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.titleGroup}>
          <MaterialCommunityIcons name="calendar-star" size={22} color={colors.primary} />
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Campus & College Events</Text>
        </View>
        <TouchableOpacity onPress={() => router.push('/(tabs)/events')} activeOpacity={0.7}>
          <Text style={[styles.viewAllText, { color: colors.primary }]}>View All Events →</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="small" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.textMuted }]}>Loading events...</Text>
        </View>
      ) : events.length === 0 ? (
        <View style={[styles.emptyCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
          <Feather name="calendar" size={24} color={colors.textMuted} />
          <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>No Upcoming Events</Text>
          <Text style={[styles.emptySub, { color: colors.textMuted }]}>
            Check back later for new workshops, technical symposiums, and campus drives.
          </Text>
        </View>
      ) : (
        <View style={styles.eventsList}>
          {events.map((ev) => {
            const formattedDate = ev.event_date
              ? new Date(ev.event_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
              : 'Upcoming';

            return (
              <TouchableOpacity
                key={ev.id}
                style={[
                  styles.eventCard,
                  { backgroundColor: colors.card, borderColor: colors.cardBorder },
                ]}
                activeOpacity={0.88}
                onPress={() => router.push({ pathname: '/event-detail' as any, params: { id: ev.id } })}
              >
                {ev.banner_url ? (
                  <Image source={{ uri: ev.banner_url }} style={styles.eventBanner} contentFit="cover" />
                ) : (
                  <View style={[styles.bannerPlaceholder, { backgroundColor: isDark ? 'rgba(59, 130, 246, 0.12)' : 'rgba(37, 99, 235, 0.08)' }]}>
                    <MaterialCommunityIcons name="calendar-star" size={28} color={colors.primary} />
                  </View>
                )}

                <View style={styles.eventInfo}>
                  <View style={styles.badgeRow}>
                    <View style={[styles.dateBadge, { backgroundColor: isDark ? 'rgba(59, 130, 246, 0.15)' : 'rgba(37, 99, 235, 0.1)' }]}>
                      <Feather name="calendar" size={10} color={colors.primary} />
                      <Text style={[styles.dateBadgeText, { color: colors.primary }]}>{formattedDate}</Text>
                    </View>
                    {ev.start_time && (
                      <View style={[styles.timeBadge, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#F1F5F9' }]}>
                        <Feather name="clock" size={10} color={colors.textMuted} />
                        <Text style={[styles.timeBadgeText, { color: colors.textSecondary }]}>{ev.start_time}</Text>
                      </View>
                    )}
                  </View>

                  <Text style={[styles.eventTitle, { color: colors.textPrimary }]} numberOfLines={2}>
                    {ev.title}
                  </Text>

                  <View style={styles.venueRow}>
                    <Feather name="map-pin" size={12} color={colors.textMuted} />
                    <Text style={[styles.venueText, { color: colors.textMuted }]} numberOfLines={1}>
                      {ev.venue || 'Campus Auditorium'}
                    </Text>
                  </View>

                  <View style={styles.cardFooter}>
                    <Text style={[styles.registerLink, { color: colors.primary }]}>View Details & Register →</Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  titleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontSize: FONT.size.sm,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  viewAllText: {
    fontSize: 11,
    fontWeight: '800',
  },
  loadingBox: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  loadingText: {
    fontSize: 12,
    fontWeight: '600',
  },
  emptyCard: {
    padding: SPACING.lg,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  emptyTitle: {
    fontSize: FONT.size.sm,
    fontWeight: '800',
    marginTop: 4,
  },
  emptySub: {
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 16,
  },
  eventsList: {
    gap: 12,
  },
  eventCard: {
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
    borderWidth: 1,
    ...SHADOWS.small,
  },
  eventBanner: {
    width: '100%',
    height: 120,
  },
  bannerPlaceholder: {
    width: '100%',
    height: 90,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eventInfo: {
    padding: SPACING.md,
    gap: 6,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  dateBadgeText: {
    fontSize: 10,
    fontWeight: '800',
  },
  timeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  timeBadgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  eventTitle: {
    fontSize: 14,
    fontWeight: '800',
    lineHeight: 19,
  },
  venueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  venueText: {
    fontSize: 11,
    fontWeight: '600',
  },
  cardFooter: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.06)',
    paddingTop: 8,
    marginTop: 4,
  },
  registerLink: {
    fontSize: 11,
    fontWeight: '800',
  },
});
