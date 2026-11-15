import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  ScrollView,
  Dimensions,
  Linking,
} from 'react-native';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Image as ExpoImage } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import ProposalTimeline from './ProposalTimeline';
import JoinProjectBottomSheet from './JoinProjectBottomSheet';
import { COLORS } from '@/constants/theme';

const { width } = Dimensions.get('window');

interface Props {
  visible: boolean;
  onClose: () => void;
  project: any;
  currentUser: any;
  onLike?: (id: string) => void;
  onBookmark?: (id: string) => void;
  isLiked?: boolean;
  isBookmarked?: boolean;
}

export default function ProjectDetailModal({
  visible,
  onClose,
  project,
  currentUser,
  onLike,
  onBookmark,
  isLiked = false,
  isBookmarked = false,
}: Props) {
  const [joinSheetVisible, setJoinSheetVisible] = useState(false);

  if (!project) return null;

  const supportList = Array.isArray(project.support_needed)
    ? project.support_needed
    : typeof project.support_needed === 'string'
    ? project.support_needed.split(',').map((s: string) => s.trim())
    : [];

  const techStackList = Array.isArray(project.tech_stack)
    ? project.tech_stack
    : typeof project.tech_stack === 'string'
    ? project.tech_stack.split(',').map((s: string) => s.trim())
    : [];

  const openExternalUrl = async (url?: string) => {
    if (!url || !url.trim()) return;
    try {
      const formatted = url.startsWith('http') ? url : `https://${url}`;
      await Linking.openURL(formatted);
    } catch (e) {
      console.warn('Failed to open URL:', url);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={false} onRequestClose={onClose}>
      <View style={styles.container}>
        <LinearGradient colors={['#0F172A', '#020617']} style={StyleSheet.absoluteFill} />

        {/* Top Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.headerBackBtn}>
            <Feather name="arrow-left" size={20} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle} numberOfLines={1}>{project.title}</Text>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <TouchableOpacity onPress={() => onBookmark && onBookmark(project.id)} style={styles.headerActionBtn}>
              <Feather name="bookmark" size={18} color={isBookmarked ? '#F59E0B' : '#FFF'} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onLike && onLike(project.id)} style={styles.headerActionBtn}>
              <Ionicons name={isLiked ? "heart" : "heart-outline"} size={20} color={isLiked ? "#EF4444" : "#FFF"} />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

          {/* Project Image Banner */}
          {(() => {
            const rawImg = project.project_image || project.supporting_docs;
            if (!rawImg || typeof rawImg !== 'string') return null;
            const doc = rawImg.trim().toLowerCase();
            const isValidImg = project.project_image || doc.match(/\.(png|jpg|jpeg|webp|gif|svg)(\?.*)?$/) || doc.includes('cloudinary') || doc.includes('unsplash') || doc.includes('image');
            if (!isValidImg) return null;
            return (
              <View style={styles.imageBannerContainer}>
                <ExpoImage
                  source={{ uri: rawImg }}
                  style={StyleSheet.absoluteFill}
                  contentFit="cover"
                />
                <LinearGradient colors={['transparent', 'rgba(15, 23, 42, 0.95)']} style={styles.bannerOverlay} />
              </View>
            );
          })()}

          {/* Badges & Meta */}
          <View style={styles.metaRow}>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{project.category}</Text>
            </View>
            <View style={styles.stageBadge}>
              <Text style={styles.stageText}>Stage: {project.stage || 'Idea'}</Text>
            </View>
          </View>

          {/* Title & Author Info */}
          <Text style={styles.projectTitle}>{project.title}</Text>

          <View style={styles.authorCard}>
            <View style={styles.authorAvatar}>
              <Text style={styles.avatarLetter}>
                {(project.author_name || 'Innovator').charAt(0).toUpperCase()}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.authorName}>{project.author_name || 'Polytechnic Student'}</Text>
              <Text style={styles.authorSub}>
                {project.college_name || 'FEEDX Polytechnic'} {project.branch ? `• ${project.branch}` : ''}
              </Text>
              {project.author_email ? (
                <Text style={styles.authorEmailText}>{project.author_email}</Text>
              ) : null}
            </View>
            {project.author_email ? (
              <TouchableOpacity 
                style={styles.emailAuthorBtn} 
                onPress={() => Linking.openURL(`mailto:${project.author_email}?subject=Interested in your Innovation: ${encodeURIComponent(project.title || '')}`)}
                activeOpacity={0.8}
              >
                <Feather name="mail" size={14} color="#FFF" />
                <Text style={styles.emailAuthorBtnText}>Email</Text>
              </TouchableOpacity>
            ) : (
              <Text style={styles.postedDate}>{new Date(project.created_at || Date.now()).toLocaleDateString()}</Text>
            )}
          </View>

          {/* Timeline Status */}
          <ProposalTimeline status={project.status || 'Submitted'} />

          {/* Summary / Problem / Solution */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionHeader}>📋 Problem Statement</Text>
            <Text style={styles.bodyText}>{project.problem_statement || project.description || 'No detailed problem statement provided.'}</Text>

            <View style={styles.divider} />

            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 }}>
              <Feather name="zap" size={14} color="#8B5CF6" />
              <Text style={[styles.sectionHeader, { marginBottom: 0 }]}>Proposed Solution</Text>
            </View>
            <Text style={styles.bodyText}>{project.proposed_solution || project.description || 'No detailed proposed solution provided.'}</Text>

            {project.expected_impact ? (
              <>
                <View style={styles.divider} />
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                  <Feather name="trending-up" size={14} color="#10B981" />
                  <Text style={[styles.sectionHeader, { marginBottom: 0 }]}>Expected Impact</Text>
                </View>
                <Text style={styles.bodyText}>{project.expected_impact}</Text>
              </>
            ) : null}
          </View>

          {/* Technology Stack */}
          {techStackList.length > 0 && (
            <View style={styles.sectionCard}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                <Feather name="code" size={14} color="#3B82F6" />
                <Text style={[styles.sectionHeader, { marginBottom: 0 }]}>Technology Stack</Text>
              </View>
              <View style={styles.pillsContainer}>
                {techStackList.map((tech: string, idx: number) => (
                  <View key={idx} style={styles.techPill}>
                    <Text style={styles.techPillText}>{tech}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Support Needed */}
          {supportList.length > 0 && (
            <View style={styles.sectionCard}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                <Feather name="users" size={14} color="#F59E0B" />
                <Text style={[styles.sectionHeader, { marginBottom: 0 }]}>Support Needed from FEEDX</Text>
              </View>
              <View style={styles.pillsContainer}>
                {supportList.map((sup: string, idx: number) => (
                  <View key={idx} style={styles.supportPill}>
                    <Feather name="help-circle" size={12} color="#93C5FD" style={{ marginRight: 4 }} />
                    <Text style={styles.supportPillText}>{sup}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Links & Attachments */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionHeader}>🔗 Project Links & Attachments</Text>

            <View style={styles.linksRow}>
              {project.demo_link ? (
                <TouchableOpacity style={styles.linkCard} onPress={() => openExternalUrl(project.demo_link)}>
                  <Feather name="external-link" size={16} color="#3B82F6" />
                  <Text style={styles.linkText} numberOfLines={1}>Demo / Prototype</Text>
                </TouchableOpacity>
              ) : null}

              {project.github_link ? (
                <TouchableOpacity style={styles.linkCard} onPress={() => openExternalUrl(project.github_link)}>
                  <Feather name="github" size={16} color="#FFF" />
                  <Text style={styles.linkText} numberOfLines={1}>GitHub Repo</Text>
                </TouchableOpacity>
              ) : null}

              {project.drive_link || project.supporting_docs ? (
                <TouchableOpacity style={styles.linkCard} onPress={() => openExternalUrl(project.drive_link || project.supporting_docs)}>
                  <Feather name="folder" size={16} color="#F59E0B" />
                  <Text style={styles.linkText} numberOfLines={1}>Google Drive / Docs</Text>
                </TouchableOpacity>
              ) : null}
            </View>
          </View>

          {/* Team Details */}
          {project.team_members || project.faculty_guide ? (
            <View style={styles.sectionCard}>
              <Text style={styles.sectionHeader}>👥 Team & Faculty Guide</Text>
              {project.team_members && <Text style={styles.bodyText}>Team Members: {project.team_members}</Text>}
              {project.faculty_guide && <Text style={[styles.bodyText, { marginTop: 6 }]}>Faculty Guide: {project.faculty_guide}</Text>}
            </View>
          ) : null}

        </ScrollView>

        {/* Interested to Join Action Bar */}
        <View style={styles.bottomBar}>
          {currentUser?.id && (project.user_id === currentUser.id || project.author_email === currentUser.email) ? (
            <View style={[styles.joinCtaBtn, { backgroundColor: 'rgba(16, 185, 129, 0.15)', borderColor: 'rgba(16, 185, 129, 0.3)', borderWidth: 1, height: 50, borderRadius: 16, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }]}>
              <Feather name="check-circle" size={18} color="#10B981" style={{ marginRight: 8 }} />
              <Text style={{ color: '#10B981', fontWeight: '800', fontSize: 14 }}>Your Posted Innovation</Text>
            </View>
          ) : (
            <TouchableOpacity style={styles.joinCtaBtn} onPress={() => setJoinSheetVisible(true)} activeOpacity={0.85}>
              <LinearGradient colors={COLORS.gradientPrimary} style={styles.joinGradient}>
                <Feather name="users" size={18} color="#FFF" style={{ marginRight: 8 }} />
                <Text style={styles.joinCtaText}>🤝 Interested to Collaborate</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}
        </View>

        {/* Join Project Bottom Sheet */}
        <JoinProjectBottomSheet
          visible={joinSheetVisible}
          onClose={() => setJoinSheetVisible(false)}
          project={project}
          currentUser={currentUser}
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  headerBackBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '800',
    flex: 1,
    marginHorizontal: 12,
  },
  headerActionBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  imageBannerContainer: {
    width: '100%',
    height: 200,
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 16,
    backgroundColor: '#1E293B',
    position: 'relative',
  },
  bannerOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },
  categoryBadge: {
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.3)',
  },
  categoryText: {
    color: '#60A5FA',
    fontSize: 12,
    fontWeight: '700',
  },
  stageBadge: {
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
  },
  stageText: {
    color: '#C084FC',
    fontSize: 12,
    fontWeight: '700',
  },
  projectTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFF',
    marginBottom: 14,
    lineHeight: 28,
  },
  authorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    marginBottom: 16,
    gap: 12,
  },
  authorAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarLetter: {
    color: '#FFF',
    fontWeight: '800',
    fontSize: 16,
  },
  authorName: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 14,
  },
  authorSub: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 11,
  },
  postedDate: {
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: 11,
  },
  authorEmailText: {
    color: '#60A5FA',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  emailAuthorBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#2563EB',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  emailAuthorBtnText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '800',
  },
  sectionCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    marginBottom: 14,
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFF',
    marginBottom: 8,
  },
  bodyText: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.75)',
    lineHeight: 20,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    marginVertical: 12,
  },
  pillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  techPill: {
    backgroundColor: 'rgba(59, 130, 246, 0.12)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.25)',
  },
  techPillText: {
    color: '#93C5FD',
    fontSize: 12,
    fontWeight: '600',
  },
  supportPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.25)',
  },
  supportPillText: {
    color: '#34D399',
    fontSize: 12,
    fontWeight: '600',
  },
  linksRow: {
    gap: 8,
    marginTop: 4,
  },
  linkCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    padding: 12,
    borderRadius: 12,
    gap: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  linkText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: 'rgba(15, 23, 42, 0.95)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
  },
  joinCtaBtn: {
    height: 54,
    borderRadius: 16,
    overflow: 'hidden',
  },
  joinGradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  joinCtaText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '800',
  },
});
