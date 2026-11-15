import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View, Image, Platform, Linking } from 'react-native';
import { SkeletonLoader } from '@/components/ui/Loaders';
import { CalendarDays, Clock3, Users, CheckCircle, Award, AlertCircle } from 'lucide-react-native';
import { Feather } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { COLORS } from '@/constants/theme';
import { getEventById, getUserEventRegistration, registerForEvent, cancelEventRegistration, toggleBookmark, isBookmarked } from '@/services/supabaseService';
import { supabase } from '@/lib/supabase';
import { useUser } from '@/context/UserContext';
import GradientHeader from '@/components/ui/GradientHeader';
import GlassCard from '@/components/ui/GlassCard';
import { OptimizedImage } from '@/components/ui/OptimizedImage';

const FEEDX_EVENT_FALLBACK = require('@/assets/images/logo.jpg');

export default function EventDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user } = useUser();
  const [event, setEvent] = useState(null);
  const [registered, setRegistered] = useState(false);
  const [registration, setRegistration] = useState(null);
  const [bookmarked, setBookmarked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const load = async () => {
    if (!id) {
      setFetching(false);
      return;
    }
    try {
      setFetching(true);
      const data = await getEventById(String(id));
      setEvent(data);
      if (user?.id && data) {
        const reg = await getUserEventRegistration(data.id, user.id);
        setRegistered(!!reg);
        setRegistration(reg);
        setBookmarked(await isBookmarked(user.id, 'event', data.id));
      }
    } catch (e) {
      console.error("Load Event Details Failed:", e);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    load();

    if (!id) return;

    // 1. Real-time subscription to event registrations table with unique channel ID
    const channelId = `event_regs_${id}_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    const channel = supabase
      .channel(channelId)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'event_registrations',
          filter: `event_id=eq.${id}`
        },
        async (payload) => {
          console.log('[EventDetail] Real-time registration change:', payload);
          const updatedEvent = await getEventById(String(id));
          if (updatedEvent) {
            setEvent(updatedEvent);
          }
          if (user?.id) {
            const reg = await getUserEventRegistration(String(id), user.id);
            setRegistered(!!reg);
            setRegistration(reg);
          }
        }
      );

    channel.subscribe();

    // 2. Auto-polling fallback to guarantee capacity updates even if Supabase Realtime is disabled
    const interval = setInterval(async () => {
      const updatedEvent = await getEventById(String(id));
      if (updatedEvent) {
        setEvent(updatedEvent);
      }
    }, 8000);

    return () => {
      try {
        supabase.removeChannel(channel);
      } catch (e) {
        // Ignore cleanup warning
      }
      clearInterval(interval);
    };
  }, [id, user?.id]);

  const handleRegister = async () => {
    if (!user?.id || registered) return;
    setLoading(true);
    try {
      setRegistered(true);
      setEvent(prev => prev ? { ...prev, registered: (Number(prev.registered) || 0) + 1 } : prev);
      await registerForEvent(event.id, user.id, user);
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['event_registrations'] });
      await load();
      Alert.alert('Registered', 'You have successfully registered for this event.');
    } catch (e) {
      setRegistered(false);
      setEvent(prev => prev ? { ...prev, registered: Math.max(0, (Number(prev.registered) || 1) - 1) } : prev);
      Alert.alert('Registration Failed', e.message || 'Unable to register.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!user?.id || !registered) return;
    Alert.alert('Cancel Registration', 'Remove your registration for this event?', [
      { text: 'Keep', style: 'cancel' },
      {
        text: 'Cancel Registration',
        style: 'destructive',
        onPress: async () => {
          setLoading(true);
          try {
            setRegistered(false);
            setRegistration(null);
            setEvent(prev => prev ? { ...prev, registered: Math.max(0, (Number(prev.registered) || 1) - 1) } : prev);
            await cancelEventRegistration(event.id, user.id);
            queryClient.invalidateQueries({ queryKey: ['events'] });
            queryClient.invalidateQueries({ queryKey: ['event_registrations'] });
            await load();
          } catch (e) {
            setRegistered(true);
            setEvent(prev => prev ? { ...prev, registered: (Number(prev.registered) || 0) + 1 } : prev);
            Alert.alert('Error', e.message || 'Could not cancel registration.');
          } finally {
            setLoading(false);
          }
        },
      },
    ]);
  };

  const handleBookmark = async () => {
    if (!user?.id) return;
    const result = await toggleBookmark(user.id, 'event', event.id);
    setBookmarked(result.bookmarked);
  };

  if (fetching) {
    return (
      <View style={{ flex: 1, backgroundColor: '#070A13', padding: 24, paddingTop: 60 }}>
        <SkeletonLoader height={250} borderRadius={24} style={{ marginBottom: 24 }} />
        <SkeletonLoader width="60%" height={24} borderRadius={6} style={{ marginBottom: 16 }} />
        <SkeletonLoader width="40%" height={16} borderRadius={4} style={{ marginBottom: 32 }} />
        <SkeletonLoader height={100} borderRadius={16} style={{ marginBottom: 16 }} />
        <SkeletonLoader height={150} borderRadius={16} />
      </View>
    );
  }

  if (!event) {
    return (
      <View style={styles.emptyWrap}>
        <Text style={styles.emptyText}>Event not found.</Text>
      </View>
    );
  }

  const handleOpenExternalRegistration = () => {
    const rawUrl = String(event?.registration_url || '').trim();
    if (!rawUrl) {
      Alert.alert('Notice', 'No registration link specified for this event.');
      return;
    }
    const safeUrl = rawUrl.startsWith('http://') || rawUrl.startsWith('https://') ? rawUrl : `https://${rawUrl}`;
    Linking.openURL(safeUrl).catch(() => {
      Alert.alert('Unable to Open Link', 'The registration URL could not be opened on your device.');
    });
  };

  const capacity = Number(event?.capacity || event?.max_participants || 100);
  const registeredCount = Number(event?.registered || 0);
  const pct = capacity > 0 ? Math.min(100, Math.round((registeredCount / capacity) * 100)) : 0;
  const isFull = capacity > 0 && registeredCount >= capacity;
  const isExternalEvent = Boolean(event.registration_url || event.event_source === 'external');

  return (
    <View style={styles.container}>
      <GradientHeader title="Event Detail" subtitle="Schedule and ticketing" />

      <ScrollView contentContainerStyle={{ paddingBottom: 140 }} showsVerticalScrollIndicator={false}>
        {/* Cover Banner Image */}
        <View style={styles.bannerContainer}>
          <OptimizedImage 
            source={event.image_url || event.banner_url || event.poster_url || event.image || event.cover_image || FEEDX_EVENT_FALLBACK} 
            fallbackSource={FEEDX_EVENT_FALLBACK}
            style={styles.bannerImage} 
            contentFit="cover"
          />
          <LinearGradient 
            colors={['rgba(2, 4, 8, 0.1)', 'rgba(2, 4, 8, 0.7)', '#020408']} 
            style={styles.bannerOverlay} 
          />
          <View style={styles.titleContainer}>
            <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center', marginBottom: 6 }}>
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryText}>{event.category || 'Workshop'}</Text>
              </View>
              {isExternalEvent && (
                <View style={[styles.categoryBadge, { backgroundColor: 'rgba(245, 158, 11, 0.2)', borderColor: 'rgba(245, 158, 11, 0.4)', borderWidth: 1 }]}>
                  <Text style={[styles.categoryText, { color: '#F59E0B' }]}>EXTERNAL OPPORTUNITY</Text>
                </View>
              )}
            </View>
            <Text style={styles.heroTitle}>{event.title}</Text>
          </View>
        </View>

        {/* Schedule & Venue Card */}
        <GlassCard style={styles.card}>
          <View style={styles.row}>
            <CalendarDays size={18} color={COLORS.primary} />
            <View style={styles.metaTextContainer}>
              <Text style={styles.metaLabel}>DATE & TIME</Text>
              <Text style={styles.meta}>{event.event_date || event.date || 'TBA'} {event.time ? `@ ${event.time}` : ''}</Text>
            </View>
          </View>

          <View style={[styles.row, { marginTop: 14 }]}>
            <Clock3 size={18} color={COLORS.primary} />
            <View style={styles.metaTextContainer}>
              <Text style={styles.metaLabel}>VENUE LOCATION</Text>
              <Text style={styles.meta}>{event.venue || 'TBA'} ({event.location || 'Offline'})</Text>
            </View>
          </View>

          <View style={[styles.row, { marginTop: 14 }]}>
            <Users size={18} color={COLORS.primary} />
            <View style={styles.metaTextContainer}>
              <Text style={styles.metaLabel}>ORGANIZED BY</Text>
              <Text style={styles.meta}>{event.organizer_name || event.organizer || 'FEEDX'}</Text>
            </View>
          </View>

          {event.registration_deadline ? (
            <View style={[styles.row, { marginTop: 14 }]}>
              <AlertCircle size={18} color="#F59E0B" />
              <View style={styles.metaTextContainer}>
                <Text style={[styles.metaLabel, { color: '#F59E0B' }]}>REGISTRATION DEADLINE</Text>
                <Text style={[styles.meta, { color: '#F59E0B', fontWeight: '700' }]}>{event.registration_deadline}</Text>
              </View>
            </View>
          ) : null}

          {!isExternalEvent && (
            <View style={[styles.row, { marginTop: 14 }]}>
              <Users size={18} color={COLORS.primary} />
              <View style={styles.metaTextContainer}>
                <Text style={styles.metaLabel}>PARTICIPATION CAPACITY</Text>
                <Text style={styles.meta}>{registeredCount} / {capacity} Registrations ({pct}% full)</Text>
              </View>
            </View>
          )}
        </GlassCard>

        {/* Eligibility Card */}
        {event.eligibility ? (
          <GlassCard style={styles.card}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <Award size={18} color="#10B981" />
              <Text style={styles.heading}>Eligibility Criteria</Text>
            </View>
            <Text style={styles.copy}>{event.eligibility}</Text>
          </GlassCard>
        ) : null}

        {/* Description Card */}
        <GlassCard style={styles.card}>
          <Text style={styles.heading}>About This Event</Text>
          <Text style={styles.copy}>{event.description || 'Industry-led event focused on exposure, hiring opportunities, and practical career guidance for diploma students.'}</Text>
        </GlassCard>

        {/* Registration Ticket / Actions (if already registered internally) */}
        {!isExternalEvent && registered && (
          <GlassCard style={[styles.card, { marginTop: 12 }]}>
            {(registration?.checked_in || registration?.attendance_status === 'present' || registration?.attendance === 'Present') ? (
              <View style={{ gap: 10 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Feather name="check-circle" size={16} color="#10B981" />
                  <Text style={[styles.heading, { color: '#10B981' }]}>Attended</Text>
                </View>
                <Text style={styles.copy}>You checked in successfully. Please share your feedback to unlock your certificate.</Text>
                
                <TouchableOpacity
                  style={styles.feedbackBtn}
                  onPress={() => router.push(`/event-feedback?eventId=${event.id}&eventTitle=${encodeURIComponent(event.title)}`)}
                >
                  <LinearGradient colors={['#3B82F6', '#1D4ED8']} style={styles.feedbackGradient}>
                    <Text style={styles.feedbackBtnText}>Give Feedback</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            ) : (
              <View>
                <Text style={styles.heading}>Your Event Ticket</Text>
                <Text style={styles.copy}>Registration active. Show your secure QR code at the venue for check-in.</Text>
                <TouchableOpacity
                  style={[styles.feedbackBtn, { marginTop: 16 }]}
                  onPress={() => router.push(`/student/ticket?eventId=${event.id}`)}
                >
                  <LinearGradient colors={['#8B5CF6', '#6D28D9']} style={styles.feedbackGradient}>
                    <Text style={styles.feedbackBtnText}>View QR Ticket</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            )}
          </GlassCard>
        )}

        {/* Admin Backdoor shortcut */}
        {(user?.role === 'super_admin' || ((user?.role === 'admin' || user?.role === 'inst_admin') && event.college_id && event.college_id === user?.college_id)) && (
          <TouchableOpacity
            style={styles.adminDeckBtn}
            onPress={() => router.push(`/admin/organizer-dashboard?id=${event.id}`)}
          >
            <LinearGradient colors={['#8B5CF6', '#7C3AED']} style={styles.adminDeckGradient}>
              <Feather name="shield" size={16} color="#FFF" style={{ marginRight: 6 }} />
              <Text style={styles.adminDeckText}>Open Organizer Deck</Text>
            </LinearGradient>
          </TouchableOpacity>
        )}
      </ScrollView>

      {/* Sticky Bottom Action Bar */}
      <Animated.View entering={FadeInUp.duration(400).delay(100)} style={styles.stickyBottomBar}>
        <View style={styles.bottomBarContent}>
          <View style={styles.priceContainer}>
            <Text style={styles.priceLabel}>Price</Text>
            <Text style={styles.priceValue}>{event.price > 0 ? `₹${event.price}` : 'Free'}</Text>
          </View>
          
          <View style={styles.bottomActions}>
            <TouchableOpacity style={styles.bookmarkIconBtn} onPress={handleBookmark}>
              <Feather name="bookmark" size={22} color={bookmarked ? COLORS.primary : '#A1A1AA'} />
            </TouchableOpacity>

            {isExternalEvent ? (
              <TouchableOpacity
                style={styles.registerBtn}
                onPress={handleOpenExternalRegistration}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['#3B82F6', '#1D4ED8']}
                  style={styles.registerGradient}
                >
                  <Feather name="external-link" size={18} color="#FFF" style={{ marginRight: 6 }} />
                  <Text style={styles.registerText}>Register Now</Text>
                </LinearGradient>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[styles.registerBtn, (registered || isFull) && styles.registerBtnDone]}
                onPress={handleRegister}
                disabled={loading || registered || isFull}
              >
                <LinearGradient
                  colors={registered ? COLORS.gradientSuccess : isFull ? ['#64748B', '#475569'] : COLORS.gradientPrimary}
                  style={styles.registerGradient}
                >
                  {registered ? (
                    <>
                      <CheckCircle size={18} color="#FFF" />
                      <Text style={styles.registerText}>Registered</Text>
                    </>
                  ) : (
                    <Text style={styles.registerText}>{isFull ? 'Registration Full' : loading ? 'Registering...' : 'Register Now'}</Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020408' },
  emptyWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#020408' },
  emptyText: { color: COLORS.gray, fontSize: 16, fontWeight: '600' },
  
  bannerContainer: { width: '100%', height: 240, position: 'relative' },
  bannerImage: { width: '100%', height: '100%' },
  bannerOverlay: { ...StyleSheet.absoluteFill },
  titleContainer: { position: 'absolute', bottom: 16, left: 16, right: 16 },
  categoryBadge: { alignSelf: 'flex-start', backgroundColor: COLORS.primary + '25', borderWidth: 1, borderColor: COLORS.primary + '50', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, marginBottom: 8 },
  categoryText: { color: COLORS.primary, fontSize: 10, fontWeight: '950', textTransform: 'uppercase', letterSpacing: 0.5 },
  heroTitle: { color: '#FFF', fontSize: 24, fontWeight: '900', lineHeight: 30 },
  
  card: { marginHorizontal: 16, marginBottom: 16, padding: 18 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  metaTextContainer: { flex: 1 },
  metaLabel: { fontSize: 9, color: COLORS.textMuted, fontWeight: '800', letterSpacing: 0.8, marginBottom: 2 },
  meta: { color: '#FFF', fontSize: 14, fontWeight: '700' },
  heading: { color: '#FFF', fontWeight: '800', fontSize: 16, marginBottom: 8 },
  copy: { color: COLORS.textSecondary, fontSize: 13, lineHeight: 20 },
  
  stickyBottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(11, 15, 25, 0.96)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: Platform.OS === 'ios' ? 32 : 18,
  },
  bottomBarContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  priceContainer: {
    flex: 1,
  },
  priceLabel: {
    color: COLORS.gray,
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  priceValue: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '900',
    marginTop: 2,
  },
  bottomActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1.8,
  },
  bookmarkIconBtn: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  registerBtn: { 
    flex: 1,
    borderRadius: 23, 
    overflow: 'hidden',
  },
  registerBtnDone: { opacity: 0.9 },
  registerGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, height: 46 },
  registerText: { color: '#FFF', fontWeight: '800', fontSize: 15 },
  cancelLink: { marginTop: 12, alignItems: 'center' },
  cancelText: { color: COLORS.danger, fontWeight: '700', fontSize: 13 },
  feedbackBtn: { borderRadius: 12, overflow: 'hidden', marginTop: 10 },
  feedbackGradient: { height: 44, alignItems: 'center', justifyContent: 'center' },
  feedbackBtnText: { color: '#FFF', fontWeight: '800', fontSize: 14 },
  adminDeckBtn: { marginHorizontal: 16, borderRadius: 14, overflow: 'hidden', marginTop: 4, marginBottom: 12 },
  adminDeckGradient: { height: 46, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  adminDeckText: { color: '#FFF', fontWeight: '800', fontSize: 14 },
});
