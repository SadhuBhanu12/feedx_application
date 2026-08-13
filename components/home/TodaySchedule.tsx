import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { SPACING, FONT, RADIUS, SHADOWS } from '@/constants/theme';

interface TodayScheduleProps {
  timetable: any[];
}

export function TodaySchedule({ timetable = [] }: TodayScheduleProps) {
  const { colors, isDark } = useTheme();
  const router = useRouter();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const todayName = daysOfWeek[currentTime.getDay()];

  // Filter timetable for today
  const todayClasses = (timetable || []).filter((item: any) => {
    const d = item.day_of_week;
    if (typeof d === 'number') {
      return d === currentTime.getDay();
    }
    return String(d).toLowerCase() === todayName.toLowerCase();
  });

  // Calculate status for each class based on current time
  const currentMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();

  const parseTimeToMinutes = (timeStr: string) => {
    if (!timeStr) return 0;
    const clean = timeStr.trim();
    // Format could be "10:00" or "10:00 AM" or "10:00:00"
    const match = clean.match(/(\d+):(\d+)(?::(\d+))?\s*(AM|PM)?/i);
    if (!match) return 0;
    let hrs = parseInt(match[1], 10);
    const mins = parseInt(match[2], 10);
    const ampm = match[4];
    if (ampm) {
      if (ampm.toUpperCase() === 'PM' && hrs < 12) hrs += 12;
      if (ampm.toUpperCase() === 'AM' && hrs === 12) hrs = 0;
    }
    return hrs * 60 + mins;
  };

  const processedClasses = todayClasses.map((item: any) => {
    const startMins = parseTimeToMinutes(item.start_time || '09:00');
    const endMins = parseTimeToMinutes(item.end_time || '10:00');

    let status = 'UPCOMING';
    if (currentMinutes >= startMins && currentMinutes < endMins) {
      status = 'ONGOING';
    } else if (currentMinutes >= endMins) {
      status = 'COMPLETED';
    }
    if (item.status === 'Cancelled') {
      status = 'CANCELLED';
    }

    return {
      ...item,
      startMins,
      endMins,
      computedStatus: status,
      subjectName: item.subjects?.subject_name || item.subject_name || 'Subject',
      facultyName: item.subjects?.faculty_name || item.faculty_name || 'Faculty',
      room: item.room_number || item.room || 'Classroom',
    };
  });

  // Identify next class & ongoing class
  const ongoingClass = processedClasses.find((c) => c.computedStatus === 'ONGOING');
  const nextClass = processedClasses
    .filter((c) => c.computedStatus === 'UPCOMING' && c.startMins > currentMinutes)
    .sort((a, b) => a.startMins - b.startMins)[0];

  let nextClassCountdown = '';
  if (nextClass) {
    const diffMins = nextClass.startMins - currentMinutes;
    if (diffMins < 60) {
      nextClassCountdown = `Starts in ${diffMins} min`;
    } else {
      const hrs = Math.floor(diffMins / 60);
      const mins = diffMins % 60;
      nextClassCountdown = `Starts in ${hrs}h ${mins}m`;
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ONGOING':
        return { text: 'ONGOING', color: '#10B981', bg: 'rgba(16, 185, 129, 0.15)' };
      case 'UPCOMING':
        return { text: 'UPCOMING', color: '#3B82F6', bg: 'rgba(59, 130, 246, 0.15)' };
      case 'COMPLETED':
        return { text: 'COMPLETED', color: '#64748B', bg: 'rgba(100, 116, 139, 0.12)' };
      case 'CANCELLED':
        return { text: 'CANCELLED', color: '#EF4444', bg: 'rgba(239, 68, 68, 0.15)' };
      default:
        return { text: status, color: '#3B82F6', bg: 'rgba(59, 130, 246, 0.15)' };
    }
  };

  return (
    <Animated.View entering={FadeInUp.duration(400).delay(200).springify()} style={styles.container}>
      {/* Next Class Highlight Card */}
      {nextClass && (
        <TouchableOpacity
          style={[styles.nextCard, { backgroundColor: isDark ? '#1E293B' : '#EFF6FF', borderColor: '#3B82F6' }]}
          onPress={() => router.push('/(tabs)/timetable')}
          activeOpacity={0.8}
        >
          <View style={styles.nextHeader}>
            <View style={styles.nextTag}>
              <Feather name="bell" size={12} color="#3B82F6" />
              <Text style={styles.nextTagText}>NEXT CLASS</Text>
            </View>
            <Text style={styles.nextCountdownText}>{nextClassCountdown}</Text>
          </View>

          <Text style={[styles.nextSubject, { color: colors.textPrimary }]}>{nextClass.subjectName}</Text>

          <View style={styles.nextMetaRow}>
            <View style={styles.metaItem}>
              <Feather name="clock" size={13} color={colors.textMuted} />
              <Text style={[styles.metaText, { color: colors.textSecondary }]}>
                {nextClass.start_time} – {nextClass.end_time}
              </Text>
            </View>
            <View style={styles.metaItem}>
              <Feather name="map-pin" size={13} color={colors.textMuted} />
              <Text style={[styles.metaText, { color: colors.textSecondary }]}>Room {nextClass.room}</Text>
            </View>
            {nextClass.facultyName && (
              <View style={styles.metaItem}>
                <Feather name="user" size={13} color={colors.textMuted} />
                <Text style={[styles.metaText, { color: colors.textSecondary }]}>{nextClass.facultyName}</Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      )}

      {/* Main Today's Timetable Section */}
      <View style={styles.sectionHeader}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Today&apos;s Schedule</Text>
          <Text style={[styles.daySubtitle, { color: colors.textMuted }]}>({todayName})</Text>
        </View>
        <TouchableOpacity onPress={() => router.push('/(tabs)/timetable')}>
          <Text style={[styles.viewAll, { color: colors.primary }]}>Full Schedule →</Text>
        </TouchableOpacity>
      </View>

      {processedClasses.length === 0 ? (
        <View style={[styles.emptyCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
          <Feather name="calendar" size={24} color={colors.textMuted} />
          <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>No classes scheduled for today</Text>
          <Text style={[styles.emptySub, { color: colors.textMuted }]}>Enjoy your free day or focus on self-learning!</Text>
        </View>
      ) : (
        <View style={styles.list}>
          {processedClasses.map((item, idx) => {
            const badge = getStatusBadge(item.computedStatus);
            const isOngoing = item.computedStatus === 'ONGOING';

            return (
              <TouchableOpacity
                key={item.id || idx}
                style={[
                  styles.classCard,
                  { backgroundColor: colors.card, borderColor: isOngoing ? '#10B981' : colors.cardBorder },
                  isOngoing && { borderWidth: 1.5 },
                ]}
                onPress={() => router.push('/(tabs)/timetable')}
                activeOpacity={0.8}
              >
                <View style={styles.timeColumn}>
                  <Text style={[styles.timeText, { color: colors.textPrimary }]}>{item.start_time}</Text>
                  <Text style={[styles.timeSub, { color: colors.textMuted }]}>{item.end_time}</Text>
                </View>

                <View style={styles.divider} />

                <View style={styles.infoColumn}>
                  <View style={styles.cardTopRow}>
                    <Text style={[styles.className, { color: colors.textPrimary }]} numberOfLines={1}>
                      {item.subjectName}
                    </Text>
                    <View style={[styles.badge, { backgroundColor: badge.bg }]}>
                      <Text style={[styles.badgeText, { color: badge.color }]}>{badge.text}</Text>
                    </View>
                  </View>

                  <View style={styles.cardDetailsRow}>
                    <Text style={[styles.detailText, { color: colors.textMuted }]} numberOfLines={1}>
                      Room: {item.room} {item.facultyName ? `• ${item.facultyName}` : ''}
                    </Text>
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
  nextCard: {
    borderRadius: RADIUS.xl,
    padding: SPACING.md,
    borderWidth: 1.5,
    marginBottom: SPACING.md,
    ...SHADOWS.small,
  },
  nextHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  nextTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(59, 130, 246, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  nextTagText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#3B82F6',
    letterSpacing: 0.5,
  },
  nextCountdownText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#3B82F6',
  },
  nextSubject: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 8,
  },
  nextMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    flexWrap: 'wrap',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 11,
    fontWeight: '600',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: FONT.size.md,
    fontWeight: FONT.weight.bold,
  },
  daySubtitle: {
    fontSize: FONT.size.xs,
    fontWeight: '600',
  },
  viewAll: {
    fontSize: FONT.size.xs,
    fontWeight: '700',
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
    fontWeight: '700',
    marginTop: 4,
  },
  emptySub: {
    fontSize: 11,
    textAlign: 'center',
  },
  list: {
    gap: 8,
  },
  classCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: RADIUS.lg,
    padding: 12,
    borderWidth: 1,
    ...SHADOWS.small,
  },
  timeColumn: {
    width: 65,
    alignItems: 'center',
  },
  timeText: {
    fontSize: 12,
    fontWeight: '800',
  },
  timeSub: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 2,
  },
  divider: {
    width: 1,
    height: '80%',
    backgroundColor: 'rgba(255,255,255,0.08)',
    marginHorizontal: 12,
  },
  infoColumn: {
    flex: 1,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  className: {
    fontSize: 13,
    fontWeight: '700',
    flex: 1,
    marginRight: 8,
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '800',
  },
  cardDetailsRow: {
    marginTop: 4,
  },
  detailText: {
    fontSize: 11,
    fontWeight: '500',
  },
});
