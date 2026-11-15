import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  ActivityIndicator,
  Switch,
  Platform,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { useUser } from '@/context/UserContext';
import { COLORS, SPACING } from '@/constants/theme';
import GlassCard from '@/components/ui/GlassCard';
import {
  getCommunityPosts,
  createCommunityPostAdmin,
  updateCommunityPostAdmin,
  deleteCommunityPostAdmin,
} from '@/services/supabaseService';
import { isValidDriveUrl, convertDriveUrlToImageUrl, extractDriveFileId } from '@/utils/googleDrive';
import Animated, { FadeInDown } from 'react-native-reanimated';
import DateTimePicker from '@react-native-community/datetimepicker';
import { safeBack } from '@/utils/navigation';

const CATEGORIES = [
  'General',
  'Technology',
  'Placements',
  'Innovation',
  'Scholarships',
  'Announcements',
  'Events',
  'Entrepreneurship',
];

export default function SuperAdminCommunityScreen() {
  const router = useRouter();
  const { user } = useUser();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('All'); // All, Published, Draft, Pinned, Featured

  // Form Modal States
  const [modalVisible, setModalVisible] = useState(false);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Technology');
  const [tagsInput, setTagsInput] = useState('');
  const [driveUrl, setDriveUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [pinned, setPinned] = useState(false);
  const [featured, setFeatured] = useState(false);
  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduledDateTime, setScheduledDateTime] = useState<Date>(new Date(Date.now() + 86400000));
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [scheduledDate, setScheduledDate] = useState('');
  const [status, setStatus] = useState<'Published' | 'Draft' | 'Scheduled' | 'Archived'>('Published');
  const [submitting, setSubmitting] = useState(false);
  const [contentFit, setContentFit] = useState<'cover' | 'contain'>('cover');

  // Live URL validation state
  const isUrlValid = driveUrl.trim() ? isValidDriveUrl(driveUrl) : true;
  const processedPreviewUrl = driveUrl.trim() ? convertDriveUrlToImageUrl(driveUrl) : '';

  useEffect(() => {
    fetchPosts();
  }, [activeTab]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const isCustomTab = ['All', 'Published', 'Draft', 'Scheduled', 'Featured Spotlight', 'Featured', 'Pinned'].includes(activeTab);
      const filterCategory = isCustomTab ? 'All' : activeTab;
      const data = await getCommunityPosts(0, 50, filterCategory);
      let list = data || [];
      if (activeTab === 'Scheduled') {
        list = list.filter((p: any) => p.is_scheduled || p.status === 'Scheduled' || p.status === 'scheduled');
      } else if (activeTab === 'Featured Spotlight' || activeTab === 'Featured') {
        list = list.filter((p: any) => p.featured);
      } else if (activeTab === 'Pinned') {
        list = list.filter((p: any) => p.pinned);
      }
      setPosts(list);
    } catch (e) {
      console.error('Error loading community posts:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreateModal = () => {
    const defaultDate = new Date(Date.now() + 86400000);
    defaultDate.setHours(10, 0, 0, 0);
    setEditingPostId(null);
    setTitle('');
    setDescription('');
    setCategory('Technology');
    setTagsInput('polytechnic, tech, feedx');
    setDriveUrl('');
    setVideoUrl('');
    setPinned(false);
    setFeatured(false);
    setIsScheduled(false);
    setScheduledDateTime(defaultDate);
    setScheduledDate(defaultDate.toISOString());
    setStatus('Published');
    setModalVisible(true);
  };

  const handleOpenEditModal = (item: any) => {
    const parsedDate = item.scheduled_at ? new Date(item.scheduled_at) : new Date(Date.now() + 86400000);
    setEditingPostId(item.id);
    setTitle(item.title || '');
    setDescription(item.description || item.caption || '');
    setCategory(item.category || 'Technology');
    setTagsInput(Array.isArray(item.tags) ? item.tags.join(', ') : '');
    setDriveUrl(item.drive_url || item.image_url || '');
    setVideoUrl(item.video_url || item.media_url || '');
    setPinned(!!item.pinned);
    setFeatured(!!item.featured);
    setIsScheduled(!!item.is_scheduled || item.status === 'Scheduled' || item.status === 'scheduled');
    setScheduledDateTime(parsedDate);
    setScheduledDate(parsedDate.toISOString());
    setStatus(item.status || 'Published');
    setModalVisible(true);
  };

  const handleDateChange = (event: any, selected?: Date) => {
    setShowDatePicker(false);
    if (selected) {
      const next = new Date(scheduledDateTime);
      next.setFullYear(selected.getFullYear());
      next.setMonth(selected.getMonth());
      next.setDate(selected.getDate());
      setScheduledDateTime(next);
      setScheduledDate(next.toISOString());
    }
  };

  const handleTimeChange = (event: any, selected?: Date) => {
    setShowTimePicker(false);
    if (selected) {
      const next = new Date(scheduledDateTime);
      next.setHours(selected.getHours());
      next.setMinutes(selected.getMinutes());
      next.setSeconds(0);
      setScheduledDateTime(next);
      setScheduledDate(next.toISOString());
    }
  };

  const handleSubmit = async (submitStatus: 'Published' | 'Draft' | 'Scheduled') => {
    if (!title.trim()) {
      return Alert.alert('Validation Error', 'Post Title is required.');
    }
    if (!description.trim()) {
      return Alert.alert('Validation Error', 'Post Description is required.');
    }
    if (driveUrl.trim() && !isValidDriveUrl(driveUrl)) {
      return Alert.alert(
        'Invalid Google Drive URL',
        'Please enter a valid Google Drive image sharing URL (e.g., https://drive.google.com/file/d/FILE_ID/view).'
      );
    }

    setSubmitting(true);
    try {
      const tagsArray = tagsInput
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      const finalScheduled = submitStatus === 'Scheduled' || isScheduled;
      const payload = {
        title: title.trim(),
        description: description.trim(),
        caption: description.trim(),
        category,
        drive_url: driveUrl.trim(),
        image_url: driveUrl.trim() || undefined,
        video_url: videoUrl.trim() || undefined,
        post_type: videoUrl.trim() ? 'video' : (driveUrl.trim() ? 'image' : 'text'),
        tags: tagsArray,
        pinned,
        featured,
        status: finalScheduled ? 'Scheduled' : submitStatus,
        is_scheduled: finalScheduled,
        scheduled_at: finalScheduled ? (scheduledDate || new Date(Date.now() + 86400000).toISOString()) : null,
        author_name: user?.full_name || 'FEEDX Admin',
        author_role: 'Super Admin',
        created_by: user?.id,
      };

      if (editingPostId) {
        await updateCommunityPostAdmin(editingPostId, payload);
        Alert.alert('Success', 'Post updated successfully.');
      } else {
        await createCommunityPostAdmin(payload);
        Alert.alert(
          'Success',
          finalScheduled
            ? `Post scheduled for ${scheduledDate || 'selected date'}.`
            : `Post ${submitStatus === 'Draft' ? 'saved as Draft' : 'published successfully'}.`
        );
      }

      setModalVisible(false);
      fetchPosts();
    } catch (e: any) {
      Alert.alert('Error', e.message || 'Operation failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = (postId: string) => {
    Alert.alert('Delete Post', 'Are you sure you want to delete this community post?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteCommunityPostAdmin(postId);
            fetchPosts();
          } catch (e: any) {
            Alert.alert('Error', e.message);
          }
        },
      },
    ]);
  };

  const handleTogglePin = async (item: any) => {
    const previousState = !!item.pinned;
    const newState = !previousState;
    setPosts(prev => prev.map(p => p.id === item.id ? { ...p, pinned: newState } : p));
    try {
      await updateCommunityPostAdmin(item.id, { pinned: newState });
      Alert.alert(
        newState ? 'Post Pinned! 📌' : 'Pin Removed',
        newState
          ? `"${item.title || 'Post'}" is now pinned to the absolute top of the student community feed.`
          : `"${item.title || 'Post'}" is unpinned.`
      );
    } catch (e: any) {
      setPosts(prev => prev.map(p => p.id === item.id ? { ...p, pinned: previousState } : p));
      Alert.alert('Action Failed', e.message || 'Could not update pin status.');
    }
  };

  const handleToggleFeature = async (item: any) => {
    const previousState = !!item.featured;
    const newState = !previousState;
    // Optimistic update keeps the post immediately visible and responsive without re-fetching screen flash
    setPosts(prev => prev.map(p => p.id === item.id ? { ...p, featured: newState } : p));
    try {
      await updateCommunityPostAdmin(item.id, { featured: newState });
      Alert.alert(
        newState ? 'Post Featured! 🌟' : 'Spotlight Removed',
        newState
          ? `"${item.title || 'Post'}" is now featured as a Spotlight item at the top of the student community feed with a gold badge.`
          : `"${item.title || 'Post'}" will now appear in regular chronological order.`
      );
    } catch (e: any) {
      // Revert on error
      setPosts(prev => prev.map(p => p.id === item.id ? { ...p, featured: previousState } : p));
      Alert.alert('Action Failed', e.message || 'Could not update starred status.');
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#0F172A', '#020617']} style={StyleSheet.absoluteFill} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => safeBack('/super-admin')}>
          <Feather name="arrow-left" size={22} color="#FFF" />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Community Manager</Text>
          <Text style={styles.headerSub}>Publish, Feature & Moderate Posts</Text>
        </View>
        <TouchableOpacity style={styles.createBtn} onPress={handleOpenCreateModal}>
          <Feather name="plus" size={20} color="#FFF" />
        </TouchableOpacity>
      </View>

      {/* Spotlight & Pin Feature Explanation Banner */}
      <View style={styles.spotlightBanner}>
        <MaterialCommunityIcons name="information" size={18} color="#38BDF8" />
        <Text style={styles.spotlightBannerText}>
          <Text style={{ fontWeight: '800', color: '#38BDF8' }}>📌 Pin:</Text> Sticks post to top of feed.  
          <Text style={{ fontWeight: '800', color: '#F59E0B' }}> 🌟 Spotlight:</Text> Awards gold badge and prioritizes next in feed.
        </Text>
      </View>

      {/* Horizontally Scrollable Filter Tabs */}
      <View style={styles.tabScrollWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabScrollContent}
        >
          {['All', 'Pinned', 'Featured Spotlight', 'Scheduled', ...CATEGORIES].map((t) => {
            const isActive = activeTab === t;
            return (
              <TouchableOpacity
                key={t}
                style={[styles.tabChip, isActive && styles.tabChipActive]}
                onPress={() => setActiveTab(t)}
                activeOpacity={0.7}
              >
                {t === 'Pinned' && (
                  <MaterialCommunityIcons
                    name="pin"
                    size={14}
                    color={isActive ? '#FFF' : '#38BDF8'}
                    style={{ marginRight: 4 }}
                  />
                )}
                {t === 'Featured Spotlight' && (
                  <MaterialCommunityIcons
                    name="star"
                    size={14}
                    color={isActive ? '#FFF' : '#F59E0B'}
                    style={{ marginRight: 4 }}
                  />
                )}
                <Text style={[styles.tabChipText, isActive && styles.tabChipTextActive]}>{t}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Posts List */}
      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : posts.length === 0 ? (
        <View style={styles.centerContainer}>
          <MaterialCommunityIcons name="folder-open-outline" size={54} color="rgba(255,255,255,0.2)" />
          <Text style={styles.emptyText}>No community posts found.</Text>
          <TouchableOpacity style={styles.createFirstBtn} onPress={handleOpenCreateModal}>
            <Text style={styles.createFirstText}>Create First Post</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
          {posts.map((item, index) => (
            <Animated.View key={item.id} entering={FadeInDown.delay(index * 40)}>
              <GlassCard style={styles.postCard}>
                <View style={styles.cardHeader}>
                  <View style={styles.categoryBadge}>
                    <Text style={styles.categoryText}>{item.category || 'General'}</Text>
                  </View>
                  <View style={styles.badgeRow}>
                    {item.pinned && (
                      <View style={[styles.miniBadge, { backgroundColor: 'rgba(56, 189, 248, 0.15)', borderWidth: 1, borderColor: 'rgba(56, 189, 248, 0.4)' }]}>
                        <MaterialCommunityIcons name="pin" size={11} color="#38BDF8" />
                        <Text style={[styles.miniBadgeText, { color: '#38BDF8' }]}>PINNED</Text>
                      </View>
                    )}
                    {item.featured && (
                      <View style={[styles.miniBadge, { backgroundColor: 'rgba(245, 158, 11, 0.15)', borderWidth: 1, borderColor: 'rgba(245, 158, 11, 0.4)' }]}>
                        <MaterialCommunityIcons name="star" size={11} color="#F59E0B" />
                        <Text style={[styles.miniBadgeText, { color: '#F59E0B' }]}>SPOTLIGHT</Text>
                      </View>
                    )}
                  </View>
                </View>

                <Text style={styles.postTitle}>{item.title}</Text>
                <Text style={styles.postDesc} numberOfLines={2}>{item.description || item.caption}</Text>

                {item.image_url ? (
                  <Image source={{ uri: item.image_url }} style={styles.cardImagePreview} contentFit="cover" />
                ) : null}

                <View style={styles.cardFooter}>
                  <Text style={styles.authorText}>By {item.author_name || 'Admin'}</Text>
                  <View style={styles.actionGroup}>
                    {/* Pin Action Button */}
                    <TouchableOpacity
                      style={[
                        styles.pinActionBtn,
                        item.pinned && styles.pinActionBtnActive,
                      ]}
                      onPress={() => handleTogglePin(item)}
                      activeOpacity={0.7}
                    >
                      <MaterialCommunityIcons
                        name={item.pinned ? 'pin' : 'pin-outline'}
                        size={14}
                        color={item.pinned ? '#38BDF8' : 'rgba(255,255,255,0.6)'}
                      />
                      <Text
                        style={[
                          styles.pinActionText,
                          item.pinned && { color: '#38BDF8', fontWeight: '800' },
                        ]}
                      >
                        {item.pinned ? 'Pinned' : 'Pin'}
                      </Text>
                    </TouchableOpacity>

                    {/* Spotlight / Feature Action Button */}
                    <TouchableOpacity
                      style={[
                        styles.featureActionBtn,
                        item.featured && styles.featureActionBtnActive,
                      ]}
                      onPress={() => handleToggleFeature(item)}
                      activeOpacity={0.7}
                    >
                      <MaterialCommunityIcons
                        name={item.featured ? 'star' : 'star-outline'}
                        size={14}
                        color={item.featured ? '#F59E0B' : 'rgba(255,255,255,0.6)'}
                      />
                      <Text
                        style={[
                          styles.featureActionText,
                          item.featured && { color: '#F59E0B', fontWeight: '800' },
                        ]}
                      >
                        {item.featured ? 'Spotlight' : 'Feature'}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconAction} onPress={() => handleOpenEditModal(item)}>
                      <Feather name="edit-3" size={16} color={COLORS.primary} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconAction} onPress={() => handleDelete(item.id)}>
                      <Feather name="trash-2" size={16} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                </View>
              </GlassCard>
            </Animated.View>
          ))}
        </ScrollView>
      )}

      {/* Create / Edit Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{editingPostId ? 'Edit Post' : 'Create Community Post'}</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Feather name="x" size={22} color="#FFF" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalForm} showsVerticalScrollIndicator={false}>
              {/* Post Title */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>POST TITLE *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter high-impact post title..."
                  placeholderTextColor="rgba(255,255,255,0.3)"
                  value={title}
                  onChangeText={setTitle}
                />
              </View>

              {/* Category Dropdown */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>CATEGORY</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: 6 }}>
                  {CATEGORIES.map((cat) => (
                    <TouchableOpacity
                      key={cat}
                      style={[styles.catBtn, category === cat && styles.catBtnActive]}
                      onPress={() => setCategory(cat)}
                    >
                      <Text style={[styles.catBtnText, category === cat && styles.catBtnTextActive]}>{cat}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              {/* Video URL Input */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>VIDEO URL / YOUTUBE STREAM (OPTIONAL)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Paste YouTube, MP4, Vimeo, or Loom video link..."
                  placeholderTextColor="rgba(255,255,255,0.3)"
                  value={videoUrl}
                  onChangeText={setVideoUrl}
                  autoCapitalize="none"
                />
              </View>

              {/* Google Drive URL Input */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>GOOGLE DRIVE IMAGE URL (PUBLISHABLE)</Text>
                <TextInput
                  style={[styles.input, !isUrlValid && { borderColor: '#EF4444' }]}
                  placeholder="Paste Drive Share URL (e.g., https://drive.google.com/file/d/...)"
                  placeholderTextColor="rgba(255,255,255,0.3)"
                  value={driveUrl}
                  onChangeText={setDriveUrl}
                  autoCapitalize="none"
                />
                {!isUrlValid && (
                  <Text style={styles.urlErrorText}>⚠️ Please enter a valid Google Drive image link.</Text>
                )}
              </View>

              {/* Display Fit Mode Selector */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>PREVIEW DISPLAY CROP MODE</Text>
                <View style={{ flexDirection: 'row', gap: 10, marginTop: 4 }}>
                  <TouchableOpacity
                    style={[
                      styles.catBtn,
                      contentFit === 'cover' && styles.catBtnActive,
                      { flex: 1, alignItems: 'center', justifyContent: 'center' },
                    ]}
                    onPress={() => setContentFit('cover')}
                  >
                    <Text style={[styles.catBtnText, contentFit === 'cover' && styles.catBtnTextActive]}>
                      🖼️ Cover (Fill Card)
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.catBtn,
                      contentFit === 'contain' && styles.catBtnActive,
                      { flex: 1, alignItems: 'center', justifyContent: 'center' },
                    ]}
                    onPress={() => setContentFit('contain')}
                  >
                    <Text style={[styles.catBtnText, contentFit === 'contain' && styles.catBtnTextActive]}>
                      🔍 Contain (Show Full)
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Real-time Image Preview */}
              {processedPreviewUrl ? (
                <View style={styles.previewContainer}>
                  <Image
                    source={{
                      uri: processedPreviewUrl,
                      headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
                        'Accept': 'image/*,*/*',
                      },
                    }}
                    style={styles.imagePreview}
                    contentFit={contentFit}
                  />
                  {extractDriveFileId(driveUrl) ? (
                    <View style={{ marginTop: 6 }}>
                      <Text style={styles.fileIdText}>Extracted Drive File ID: {extractDriveFileId(driveUrl)}</Text>
                      <Text style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>
                        💡 Note: Ensure file permission on Google Drive is set to &quot;Anyone with the link can view&quot;.
                      </Text>
                    </View>
                  ) : null}
                </View>
              ) : null}

              {/* Description */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>DESCRIPTION / CONTENT *</Text>
                <TextInput
                  style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
                  placeholder="Write post content, guidelines, and opportunity details..."
                  placeholderTextColor="rgba(255,255,255,0.3)"
                  multiline
                  value={description}
                  onChangeText={setDescription}
                />
              </View>

              {/* Tags */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>TAGS (COMMA SEPARATED)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. Hackathon, Placements, Diploma, AI"
                  placeholderTextColor="rgba(255,255,255,0.3)"
                  value={tagsInput}
                  onChangeText={setTagsInput}
                />
              </View>

              {/* Schedule Post Toggle */}
              <View style={styles.toggleRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.toggleTitle}>📅 Schedule Post Release</Text>
                  <Text style={styles.toggleSub}>Publish automatically at a future date/time.</Text>
                </View>
                <Switch value={isScheduled} onValueChange={setIsScheduled} trackColor={{ false: '#1E293B', true: '#10B981' }} />
              </View>

              {isScheduled && (
                <View style={[styles.formGroup, { marginTop: 8 }]}>
                  <Text style={[styles.label, { color: '#10B981', marginBottom: 8 }]}>
                    📅 SCHEDULED PUBLISH DATE & TIME
                  </Text>
                  <View style={{ flexDirection: 'row', gap: 10 }}>
                    {/* Date Picker Button */}
                    <TouchableOpacity
                      style={styles.pickerBtn}
                      activeOpacity={0.8}
                      onPress={() => setShowDatePicker(true)}
                    >
                      <View style={styles.pickerIconWrap}>
                        <Feather name="calendar" size={18} color="#10B981" />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.pickerSubLabel}>Release Date</Text>
                        <Text style={styles.pickerValueText}>
                          {scheduledDateTime.toLocaleDateString(undefined, {
                            weekday: 'short',
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </Text>
                      </View>
                      <Feather name="chevron-down" size={16} color="rgba(255,255,255,0.4)" />
                    </TouchableOpacity>

                    {/* Time Picker Button */}
                    <TouchableOpacity
                      style={styles.pickerBtn}
                      activeOpacity={0.8}
                      onPress={() => setShowTimePicker(true)}
                    >
                      <View style={styles.pickerIconWrap}>
                        <Feather name="clock" size={18} color="#10B981" />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.pickerSubLabel}>Release Time</Text>
                        <Text style={styles.pickerValueText}>
                          {scheduledDateTime.toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: true,
                          })}
                        </Text>
                      </View>
                      <Feather name="chevron-down" size={16} color="rgba(255,255,255,0.4)" />
                    </TouchableOpacity>
                  </View>

                  {/* Scheduled Summary Badge */}
                  <View style={styles.scheduledSummaryBadge}>
                    <Feather name="check-circle" size={13} color="#10B981" />
                    <Text style={styles.scheduledSummaryText}>
                      Will automatically publish on{' '}
                      {scheduledDateTime.toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}{' '}
                      at{' '}
                      {scheduledDateTime.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true,
                      })}
                    </Text>
                  </View>

                  {showDatePicker && (
                    <DateTimePicker
                      value={scheduledDateTime}
                      mode="date"
                      display="default"
                      minimumDate={new Date()}
                      onChange={handleDateChange}
                    />
                  )}

                  {showTimePicker && (
                    <DateTimePicker
                      value={scheduledDateTime}
                      mode="time"
                      display="default"
                      onChange={handleTimeChange}
                    />
                  )}
                </View>
              )}

              {/* Pin Post Toggle */}
              <View style={styles.toggleRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.toggleTitle}>📌 Pin Post to Top</Text>
                  <Text style={styles.toggleSub}>Stick to the absolute top of the student community feed.</Text>
                </View>
                <Switch value={pinned} onValueChange={setPinned} trackColor={{ false: '#1E293B', true: '#38BDF8' }} />
              </View>

              {/* Feature Post Toggle */}
              <View style={styles.toggleRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.toggleTitle}>🌟 Spotlight Feature</Text>
                  <Text style={styles.toggleSub}>Highlight with a gold badge in the community feed.</Text>
                </View>
                <Switch value={featured} onValueChange={setFeatured} trackColor={{ false: '#1E293B', true: '#F59E0B' }} />
              </View>

              {/* Action Buttons */}
              <View style={styles.modalActions}>
                {isScheduled ? (
                  <TouchableOpacity
                    style={[styles.modalSubmitBtn, { backgroundColor: '#10B981' }]}
                    onPress={() => handleSubmit('Scheduled')}
                    disabled={submitting}
                  >
                    <Text style={styles.modalSubmitText}>📅 Schedule Post</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={[styles.modalSubmitBtn, { backgroundColor: '#3B82F6' }]}
                    onPress={() => handleSubmit('Published')}
                    disabled={submitting}
                  >
                    <Text style={styles.modalSubmitText}>Publish Post Now</Text>
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  style={[styles.modalSubmitBtn, { backgroundColor: 'rgba(255,255,255,0.1)' }]}
                  onPress={() => handleSubmit('Draft')}
                  disabled={submitting}
                >
                  <Text style={[styles.modalSubmitText, { color: 'rgba(255,255,255,0.7)' }]}>Save as Draft</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020617' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 56 : 42,
    paddingHorizontal: 20,
    paddingBottom: 16,
    gap: 14,
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
  headerSub: { fontSize: 12, color: 'rgba(255,255,255,0.4)', fontWeight: '600' },
  createBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabRow: { flexDirection: 'row', paddingHorizontal: 20, gap: 8, marginBottom: 16 },
  tabScrollWrapper: { marginBottom: 16 },
  tabScrollContent: { paddingHorizontal: 20, gap: 8, alignItems: 'center' },
  tabChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    flexDirection: 'row',
    alignItems: 'center',
  },
  tabChipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  tabChipText: { color: 'rgba(255,255,255,0.6)', fontSize: 12, fontWeight: '600' },
  tabChipTextActive: { color: '#FFF', fontWeight: '800' },
  centerContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },
  emptyText: { color: 'rgba(255,255,255,0.4)', fontSize: 14, marginTop: 12 },
  createFirstBtn: { marginTop: 16, paddingHorizontal: 20, paddingVertical: 10, backgroundColor: COLORS.primary, borderRadius: 12 },
  createFirstText: { color: '#FFF', fontWeight: '700' },
  listContent: { paddingHorizontal: 20, paddingBottom: 40 },
  postCard: { padding: 16, borderRadius: 16, marginBottom: 12 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  categoryBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6, backgroundColor: 'rgba(96,165,250,0.1)' },
  categoryText: { color: COLORS.primary, fontSize: 11, fontWeight: '800' },
  badgeRow: { flexDirection: 'row', gap: 6 },
  miniBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  miniBadgeText: { fontSize: 9, fontWeight: '800' },
  postTitle: { fontSize: 16, fontWeight: '800', color: '#FFF', marginBottom: 6 },
  postDesc: { fontSize: 13, color: 'rgba(255,255,255,0.6)', lineHeight: 18, marginBottom: 12 },
  cardImagePreview: { width: '100%', height: 160, borderRadius: 12, marginBottom: 12 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 10, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)' },
  authorText: { fontSize: 11, color: 'rgba(255,255,255,0.4)', fontWeight: '600' },
  actionGroup: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  iconAction: { padding: 4 },
  pinActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  pinActionBtnActive: {
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    borderColor: 'rgba(56, 189, 248, 0.4)',
  },
  pinActionText: {
    fontSize: 11,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.6)',
  },
  featureActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  featureActionBtnActive: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    borderColor: 'rgba(245, 158, 11, 0.4)',
  },
  featureActionText: {
    fontSize: 11,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.6)',
  },
  spotlightBanner: {
    marginHorizontal: 24,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(245, 158, 11, 0.08)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.2)',
  },
  spotlightBannerText: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.7)',
    flex: 1,
    lineHeight: 16,
  },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#0F172A', borderTopLeftRadius: 24, borderTopRightRadius: 24, height: '85%', padding: 24 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 18, fontWeight: '800', color: '#FFF' },
  modalForm: { flex: 1 },
  formGroup: { marginBottom: 16 },
  label: { color: 'rgba(255,255,255,0.5)', fontSize: 11, fontWeight: '800', marginBottom: 8 },
  input: { backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 12, paddingHorizontal: 16, height: 48, color: '#FFF', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  catBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.05)', marginRight: 8 },
  catBtnActive: { backgroundColor: COLORS.primary },
  catBtnText: { color: 'rgba(255,255,255,0.6)', fontSize: 12, fontWeight: '600' },
  catBtnTextActive: { color: '#FFF', fontWeight: '800' },
  urlErrorText: { color: '#EF4444', fontSize: 11, marginTop: 4, fontWeight: '600' },
  previewContainer: { marginBottom: 16, padding: 12, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.03)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' },
  previewLabel: { color: 'rgba(255,255,255,0.4)', fontSize: 10, fontWeight: '800', marginBottom: 8 },
  imagePreview: { width: '100%', height: 180, borderRadius: 10 },
  fileIdText: { color: '#10B981', fontSize: 10, fontWeight: '700', marginTop: 6 },
  toggleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  toggleTitle: { color: '#FFF', fontSize: 14, fontWeight: '700' },
  toggleSub: { color: 'rgba(255,255,255,0.4)', fontSize: 11 },
  modalActions: { gap: 10, marginTop: 20, marginBottom: 40 },
  modalSubmitBtn: { height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  modalSubmitText: { color: '#FFF', fontSize: 14, fontWeight: '800' },
  pickerBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.4)',
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  pickerIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pickerSubLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: 'rgba(255,255,255,0.4)',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  pickerValueText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFF',
    marginTop: 1,
  },
  scheduledSummaryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.25)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    marginTop: 10,
  },
  scheduledSummaryText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#10B981',
    flex: 1,
  },
});
