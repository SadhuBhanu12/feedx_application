import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, FlatList } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SkeletonLoader } from '@/components/ui/Loaders';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';
import { getCommunityLinks } from '@/services/supabaseService';
import { COLORS } from '@/constants/theme';

const COMMUNITY_CHANNELS = [
  {
    id: '1',
    name: '🌐 Official Web Portal',
    subtitle: 'feedxpolytechnic.com',
    url: 'https://feedxpolytechnic.com',
    icon: 'globe',
    useMaterial: false,
    description: 'Access official updates, study resources, opportunities and student services in one place.',
    badge: ''
  },
  {
    id: '2',
    name: '💬 WhatsApp Public Channel',
    subtitle: 'Official Broadcast Channel',
    url: 'https://whatsapp.com',
    icon: 'whatsapp',
    useMaterial: true,
    description: 'Receive scholarships, internships, events, placements, exam notifications, important announcements instantly.',
    badge: 'Live Updates'
  },
  {
    id: '3',
    name: '📸 Instagram Community',
    subtitle: '@feedx_official',
    url: 'https://instagram.com/feedx_official',
    icon: 'instagram',
    useMaterial: true,
    description: 'Student achievements, campus events, innovation, technology, entrepreneurship, community highlights.',
    badge: 'Highlights'
  },
  {
    id: '4',
    name: '💼 LinkedIn Network',
    subtitle: 'FEEDX TG Polytechnic Community',
    url: 'https://linkedin.com',
    icon: 'linkedin',
    useMaterial: true,
    description: 'Recruiters, Internships, Alumni, Mentors, Professional Networking, Placements.',
    badge: 'Careers'
  },
  {
    id: '5',
    name: '▶️ YouTube Learning Hub',
    subtitle: 'FEEDX TG POLYTECHNIC',
    url: 'https://youtube.com',
    icon: 'youtube',
    useMaterial: true,
    description: 'Tutorials, Projects, Career Guidance, Coding, Technology, Placement Preparation.',
    badge: 'Learning'
  }
];

export default function StayInLoopScreen() {
  const router = useRouter();

  const renderLink = ({ item, index }) => (
    <Animated.View entering={FadeInUp.delay(100 + index * 100).springify()}>
      <TouchableOpacity style={styles.linkCard} onPress={() => Linking.openURL(item.url)} activeOpacity={0.8}>
        <LinearGradient colors={['#1E293B', '#0F172A']} style={styles.iconBox}>
          {item.useMaterial ? (
            <MaterialCommunityIcons name={item.icon} size={20} color={COLORS.primary} />
          ) : (
            <Feather name={item.icon} size={20} color={COLORS.primary} />
          )}
        </LinearGradient>
        <View style={styles.linkInfo}>
          <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 6 }}>
            <Text style={styles.linkTitle}>{item.name}</Text>
            {item.badge ? (
              <View style={styles.badgeWrapper}>
                <Text style={styles.badgeText}>{item.badge}</Text>
              </View>
            ) : null}
          </View>
          <Text style={styles.linkSubtitle}>{item.subtitle}</Text>
          <Text style={styles.linkDesc}>{item.description}</Text>
        </View>
        <View style={styles.openBtn}>
          <Feather name="external-link" size={14} color={COLORS.primary} />
        </View>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#0F172A', '#020617']} style={StyleSheet.absoluteFill} />
      
      <Animated.View entering={FadeInDown.duration(400).springify()} style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Feather name="arrow-left" size={24} color="#FFF" />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Connect & Follow</Text>
          <Text style={styles.headerSub}>Connect with our community</Text>
        </View>
      </Animated.View>

      <FlatList
        data={COMMUNITY_CHANNELS}
        keyExtractor={(item) => item.id}
        renderItem={renderLink}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020617' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  headerTitle: { fontSize: 22, fontWeight: '700', color: '#FFF' },
  headerSub: { fontSize: 13, color: 'rgba(255,255,255,0.5)', marginTop: 2 },
  listContent: { padding: 20, paddingBottom: 100 },
  linkCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  iconBox: {
    width: 50,
    height: 50,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  linkInfo: { flex: 1 },
  linkTitle: { fontSize: 16, fontWeight: '750', color: '#FFF' },
  linkSubtitle: { fontSize: 12, color: COLORS.primary, fontWeight: '700', marginTop: 2, marginBottom: 4 },
  linkDesc: { fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 18 },
  badgeWrapper: {
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.25)',
  },
  badgeText: {
    color: COLORS.primary,
    fontSize: 9,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  openBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    marginLeft: 10,
  },
  emptyBox: { alignItems: 'center', justifyContent: 'center', paddingTop: 100 },
  emptyText: { color: 'rgba(255,255,255,0.5)', marginTop: 16 },
});
