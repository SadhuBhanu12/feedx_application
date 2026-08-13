import React, { useState, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
  Dimensions,
} from 'react-native';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Image as ExpoImage } from 'expo-image';
import ProjectDetailModal from './ProjectDetailModal';
import { COLORS } from '@/constants/theme';

const { width } = Dimensions.get('window');

const STAGES = ['All', '⭐ My Projects', 'Idea', 'Research', 'Prototype', 'Development', 'Testing', 'Completed'];
const BRANCHES = ['All', 'ECE', 'CSE', 'EEE', 'Mechanical', 'Civil', 'AI & ML'];

interface Props {
  projects: any[];
  currentUser: any;
  onLike: (id: string) => void;
  onBookmark: (id: string) => void;
  likedProjectIds: string[];
  bookmarkedProjectIds: string[];
}

const getValidProjectImageUri = (projectImage?: string, supportingDocs?: string): string | null => {
  if (projectImage && typeof projectImage === 'string' && projectImage.trim().length > 5) {
    return projectImage.trim();
  }
  if (supportingDocs && typeof supportingDocs === 'string') {
    const doc = supportingDocs.trim().toLowerCase();
    if (doc.match(/\.(png|jpg|jpeg|webp|gif|svg)(\?.*)?$/) || doc.includes('cloudinary') || doc.includes('unsplash') || doc.includes('image')) {
      return supportingDocs.trim();
    }
  }
  return null;
};

export default function CommunityProjectsView({
  projects,
  currentUser,
  onLike,
  onBookmark,
  likedProjectIds,
  bookmarkedProjectIds,
}: Props) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStage, setFilterStage] = useState('All');
  const [filterBranch, setFilterBranch] = useState('All');
  const [sortBy, setSortBy] = useState<'newest' | 'trending' | 'supported'>('newest');

  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);

  // Search & Filtering Pipeline
  const filteredProjects = useMemo(() => {
    let result = [...(projects || [])];

    // Filter Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.title?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          (p.tech_stack || '').toLowerCase().includes(q) ||
          (p.author_name || '').toLowerCase().includes(q) ||
          (p.college_name || '').toLowerCase().includes(q)
      );
    }

    // Filter Stage / My Projects
    if (filterStage === '⭐ My Projects') {
      if (currentUser?.id) {
        result = result.filter((p) => p.user_id === currentUser.id || p.author_email === currentUser.email);
      } else {
        result = [];
      }
    } else if (filterStage !== 'All') {
      result = result.filter((p) => (p.stage || 'Idea').toLowerCase() === filterStage.toLowerCase());
    }

    // Filter Branch
    if (filterBranch !== 'All') {
      result = result.filter((p) => (p.branch || '').toLowerCase().includes(filterBranch.toLowerCase()));
    }

    // Sorting
    if (sortBy === 'trending') {
      result.sort((a, b) => (b.upvotes || 0) - (a.upvotes || 0));
    } else if (sortBy === 'supported') {
      result.sort((a, b) => {
        const aSup = Array.isArray(a.support_needed) ? a.support_needed.length : 0;
        const bSup = Array.isArray(b.support_needed) ? b.support_needed.length : 0;
        return bSup - aSup;
      });
    } else {
      // Newest
      result.sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());
    }

    return result;
  }, [projects, searchQuery, filterStage, filterBranch, sortBy, currentUser]);

  const openProjectDetail = (p: any) => {
    setSelectedProject(p);
    setDetailModalVisible(true);
  };

  return (
    <View style={styles.container}>

      {/* Header Banner */}
      <View style={styles.headerBanner}>
        <Text style={styles.bannerTitle}>🌐 Polytechnic Community Projects</Text>
        <Text style={styles.bannerSubtitle}>
          Discover innovations by student creators across all campuses. Connect, offer support, and join team projects.
        </Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchWrap}>
        <Feather name="search" size={18} color="rgba(255,255,255,0.4)" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by Title, Tech Stack, or College..."
          placeholderTextColor="rgba(255,255,255,0.3)"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery ? (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Feather name="x" size={16} color="rgba(255,255,255,0.4)" />
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Filter Row - Stage */}
      <View style={styles.filterGroup}>
        <Text style={styles.filterGroupLabel}>Stage:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsScroll}>
          {STAGES.map((st) => (
            <TouchableOpacity
              key={st}
              style={[styles.filterChip, filterStage === st && styles.filterChipActive]}
              onPress={() => setFilterStage(st)}
            >
              <Text style={[styles.filterChipText, filterStage === st && styles.filterChipTextActive]}>{st}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Sorting Bar */}
      <View style={styles.sortRow}>
        <Text style={styles.sortLabel}>Sort By:</Text>
        <TouchableOpacity
          style={[styles.sortBtn, sortBy === 'newest' && styles.sortBtnActive]}
          onPress={() => setSortBy('newest')}
        >
          <Text style={[styles.sortBtnText, sortBy === 'newest' && styles.sortBtnTextActive]}>Newest</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.sortBtn, sortBy === 'trending' && styles.sortBtnActive]}
          onPress={() => setSortBy('trending')}
        >
          <Text style={[styles.sortBtnText, sortBy === 'trending' && styles.sortBtnTextActive]}>Trending</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.sortBtn, sortBy === 'supported' && styles.sortBtnActive]}
          onPress={() => setSortBy('supported')}
        >
          <Text style={[styles.sortBtnText, sortBy === 'supported' && styles.sortBtnTextActive]}>Most Support</Text>
        </TouchableOpacity>
      </View>

      {/* Community Projects List Cards */}
      {filteredProjects.length === 0 ? (
        <View style={styles.emptyCard}>
          <Feather name="folder" size={42} color="rgba(255,255,255,0.2)" />
          <Text style={styles.emptyTitle}>No Community Projects Found</Text>
          <Text style={styles.emptySubtitle}>Try adjusting your search criteria or category filter.</Text>
        </View>
      ) : (
        filteredProjects.map((item) => {
          const isLiked = likedProjectIds.includes(item.id);
          const isBookmarked = bookmarkedProjectIds.includes(item.id);

          const supportPills = Array.isArray(item.support_needed)
            ? item.support_needed
            : typeof item.support_needed === 'string'
            ? item.support_needed.split(',')
            : [];

          return (
            <TouchableOpacity
              key={item.id}
              style={styles.projectCard}
              onPress={() => openProjectDetail(item)}
              activeOpacity={0.9}
            >
              {/* Card Banner Image if available */}
              {(() => {
                const imgUri = getValidProjectImageUri(item.project_image, item.supporting_docs);
                if (!imgUri) return null;
                return (
                  <View style={styles.cardImageWrap}>
                    <ExpoImage
                      source={{ uri: imgUri }}
                      style={StyleSheet.absoluteFillObject}
                      contentFit="cover"
                    />
                    <View style={styles.stageTagFloating}>
                      <Text style={styles.stageTagText}>{item.stage || 'Idea'}</Text>
                    </View>
                  </View>
                );
              })()}

              {/* Card Header & Title */}
              <View style={styles.cardBody}>
                <View style={styles.cardHeaderRow}>
                  <View style={styles.categoryBadge}>
                    <Text style={styles.categoryBadgeText}>{item.category || 'Technology'}</Text>
                  </View>

                  <View style={styles.cardActionsRight}>
                    <TouchableOpacity
                      onPress={(e) => {
                        e.stopPropagation();
                        onBookmark(item.id);
                      }}
                      style={styles.cardActionIcon}
                    >
                      <Feather name="bookmark" size={18} color={isBookmarked ? '#F59E0B' : 'rgba(255,255,255,0.5)'} />
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={(e) => {
                        e.stopPropagation();
                        onLike(item.id);
                      }}
                      style={styles.cardActionIcon}
                    >
                      <Ionicons
                        name={isLiked ? "heart" : "heart-outline"}
                        size={18}
                        color={isLiked ? "#EF4444" : "rgba(255,255,255,0.5)"}
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                <Text style={styles.cardTitle}>{item.title}</Text>

                {/* College & Owner line */}
                <Text style={styles.ownerText}>
                  By <Text style={styles.ownerHighlight}>{item.author_name || 'Polytechnic Innovator'}</Text> • {item.college_name || 'FEEDX Polytechnic'}
                </Text>

                <Text style={styles.cardDescription} numberOfLines={2}>
                  {item.description || item.problem_statement}
                </Text>

                {/* Support Needed Pills */}
                {supportPills.length > 0 && (
                  <View style={styles.supportSection}>
                    <Text style={styles.supportSectionLabel}>Support Needed:</Text>
                    <View style={styles.supportPillsRow}>
                      {supportPills.slice(0, 3).map((sup: string, idx: number) => (
                        <View key={idx} style={styles.supportMiniPill}>
                          <Text style={styles.supportMiniText}>{String(sup).trim()}</Text>
                        </View>
                      ))}
                      {supportPills.length > 3 && (
                        <Text style={styles.moreSupportText}>+{supportPills.length - 3} more</Text>
                      )}
                    </View>
                  </View>
                )}

                {/* Card Footer: Tech Stack & Interested CTA */}
                <View style={styles.cardFooter}>
                  <Text style={styles.techText} numberOfLines={1}>
                    {item.tech_stack ? `🛠️ ${item.tech_stack}` : '🚀 Innovation Proposal'}
                  </Text>

                  {currentUser?.id && (item.user_id === currentUser.id || item.author_email === currentUser.email) ? (
                    <View style={styles.ownProjectBadge}>
                      <Feather name="check-circle" size={12} color="#10B981" style={{ marginRight: 4 }} />
                      <Text style={styles.ownProjectText}>Your Project</Text>
                    </View>
                  ) : (
                    <TouchableOpacity
                      style={styles.interestedBtn}
                      onPress={(e) => {
                        e.stopPropagation();
                        openProjectDetail(item);
                      }}
                    >
                      <Text style={styles.interestedBtnText}>🤝 Interested to Collaborate</Text>
                    </TouchableOpacity>
                  )}
                </View>

              </View>
            </TouchableOpacity>
          );
        })
      )}

      {/* Project Details Modal */}
      <ProjectDetailModal
        visible={detailModalVisible}
        onClose={() => setDetailModalVisible(false)}
        project={selectedProject}
        currentUser={currentUser}
        onLike={onLike}
        onBookmark={onBookmark}
        isLiked={selectedProject && likedProjectIds.includes(selectedProject.id)}
        isBookmarked={selectedProject && bookmarkedProjectIds.includes(selectedProject.id)}
      />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  headerBanner: {
    backgroundColor: 'rgba(59, 130, 246, 0.08)',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
    marginBottom: 16,
  },
  bannerTitle: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '900',
    marginBottom: 4,
  },
  bannerSubtitle: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 12,
    lineHeight: 18,
  },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 14,
    marginBottom: 14,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    color: '#FFF',
    fontSize: 14,
  },
  filterGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  filterGroupLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: 'rgba(255, 255, 255, 0.4)',
    marginRight: 8,
  },
  chipsScroll: {
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  filterChipActive: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  filterChipText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 12,
    fontWeight: '600',
  },
  filterChipTextActive: {
    color: '#FFF',
    fontWeight: '800',
  },
  sortRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  sortLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: 'rgba(255, 255, 255, 0.4)',
  },
  sortBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
  },
  sortBtnActive: {
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
  },
  sortBtnText: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 11,
  },
  sortBtnTextActive: {
    color: '#60A5FA',
    fontWeight: '700',
  },
  emptyCard: {
    alignItems: 'center',
    padding: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  emptyTitle: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '800',
    marginTop: 10,
  },
  emptySubtitle: {
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: 12,
    marginTop: 4,
  },
  projectCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    marginBottom: 16,
    overflow: 'hidden',
  },
  cardImageWrap: {
    width: '100%',
    height: 140,
    backgroundColor: '#1E293B',
    position: 'relative',
  },
  stageTagFloating: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  stageTagText: {
    color: '#C084FC',
    fontSize: 11,
    fontWeight: '800',
  },
  cardBody: {
    padding: 16,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryBadge: {
    backgroundColor: 'rgba(59, 130, 246, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  categoryBadgeText: {
    color: '#60A5FA',
    fontSize: 11,
    fontWeight: '700',
  },
  cardActionsRight: {
    flexDirection: 'row',
    gap: 8,
  },
  cardActionIcon: {
    padding: 4,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#FFF',
    marginBottom: 4,
    lineHeight: 22,
  },
  ownerText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.5)',
    marginBottom: 8,
  },
  ownerHighlight: {
    color: '#FFF',
    fontWeight: '700',
  },
  cardDescription: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.7)',
    lineHeight: 18,
    marginBottom: 12,
  },
  supportSection: {
    marginBottom: 12,
  },
  supportSectionLabel: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.4)',
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  supportPillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 6,
  },
  supportMiniPill: {
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  supportMiniText: {
    color: '#34D399',
    fontSize: 11,
    fontWeight: '600',
  },
  moreSupportText: {
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: 11,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.06)',
    paddingTop: 12,
    marginTop: 4,
  },
  techText: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.5)',
    flex: 1,
    marginRight: 8,
  },
  interestedBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.3)',
  },
  interestedBtnText: {
    color: '#60A5FA',
    fontSize: 12,
    fontWeight: '700',
  },
  ownProjectBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  ownProjectText: {
    color: '#10B981',
    fontSize: 11,
    fontWeight: '700',
  },
});
