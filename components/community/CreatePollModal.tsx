import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Image as ExpoImage } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '@/context/ThemeContext';
import { RADIUS, SPACING } from '@/constants/theme';
import { useUser } from '@/context/UserContext';
import {
  createCommunityPollPostAdmin,
  createCommunityPostAdmin,
  uploadCommunityImage,
} from '@/services/supabaseService';

interface CreatePollModalProps {
  visible: boolean;
  onClose: () => void;
  userId?: string;
  onPostCreated?: () => void;
}

export function CreatePollModal({ visible, onClose, userId, onPostCreated }: CreatePollModalProps) {
  const { colors, isDark } = useTheme();
  const { user } = useUser();
  const effectiveUserId = userId || user?.id;

  const [postType, setPostType] = useState<'text' | 'video' | 'image' | 'poll' | 'announcement'>('poll');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Polls');
  const [videoUrl, setVideoUrl] = useState('');

  // Poll Fields
  const [question, setQuestion] = useState('');
  const [pollOptions, setPollOptions] = useState<string[]>([
    'AI & Machine Learning',
    'Web Development',
    'Cloud Computing',
    'Cybersecurity',
  ]);
  const [allowMultiple, setAllowMultiple] = useState(false);
  const [anonymousVoting, setAnonymousVoting] = useState(true);
  const [showResultsBeforeVote, setShowResultsBeforeVote] = useState(false);
  const [allowVoteChange, setAllowVoteChange] = useState(false);
  const [endDateDays, setEndDateDays] = useState('3'); // default 3 days poll

  // Multi-Image & Video Upload
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleAddOption = () => {
    if (pollOptions.length >= 8) {
      Alert.alert('Limit Reached', 'Maximum 8 options allowed per poll.');
      return;
    }
    setPollOptions([...pollOptions, '']);
  };

  const handleRemoveOption = (index: number) => {
    if (pollOptions.length <= 2) {
      Alert.alert('Minimum Options', 'A poll must have at least 2 options.');
      return;
    }
    setPollOptions(pollOptions.filter((_, idx) => idx !== index));
  };

  const handleOptionChange = (text: string, index: number) => {
    const updated = [...pollOptions];
    updated[index] = text;
    setPollOptions(updated);
  };

  const handlePickImage = async () => {
    try {
      const res = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 0.8,
      });

      if (!res.canceled && res.assets && res.assets.length > 0) {
        setUploadingImage(true);
        const newUrls: string[] = [];

        for (const asset of res.assets) {
          try {
            const url = await uploadCommunityImage(userId, asset.uri);
            if (url) newUrls.push(url);
          } catch (e) {
            console.warn('[handlePickImage] Single image upload error:', e);
          }
        }

        setUploadedImages([...uploadedImages, ...newUrls]);
      }
    } catch (err: any) {
      Alert.alert('Image Upload Error', err?.message || 'Failed to select image.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handlePickVideo = async () => {
    try {
      const res = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: false,
        quality: 0.8,
      });

      if (!res.canceled && res.assets && res.assets.length > 0) {
        const uri = res.assets[0].uri;
        setUploadingImage(true);
        try {
          const url = await uploadCommunityImage(userId, uri);
          if (url) {
            setVideoUrl(url);
          } else {
            setVideoUrl(uri);
          }
        } catch (e) {
          setVideoUrl(uri);
        }
      }
    } catch (err: any) {
      Alert.alert('Video Selection Error', err?.message || 'Failed to select video.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleRemoveImage = (index: number) => {
    setUploadedImages(uploadedImages.filter((_, idx) => idx !== index));
  };

  const handleSubmit = async () => {
    if (postType === 'poll') {
      if (!question.trim()) {
        Alert.alert('Validation Error', 'Please enter a poll question.');
        return;
      }

      const validOptions = pollOptions.map((o) => o.trim()).filter((o) => o.length > 0);
      if (validOptions.length < 2) {
        Alert.alert('Validation Error', 'Please provide at least 2 valid poll options.');
        return;
      }

      // Check duplicate options
      const uniqueOptions = new Set(validOptions.map((o) => o.toLowerCase()));
      if (uniqueOptions.size < validOptions.length) {
        Alert.alert('Validation Error', 'Duplicate poll options are not allowed.');
        return;
      }

      setSubmitting(true);
      try {
        const days = parseInt(endDateDays, 10) || 3;
        const endsAt = new Date();
        endsAt.setDate(endsAt.getDate() + days);

        await createCommunityPollPostAdmin({
          title: title.trim() || question.trim(),
          description: description.trim(),
          question: question.trim(),
          options: validOptions,
          allow_multiple: allowMultiple,
          anonymous_voting: anonymousVoting,
          show_results_before_vote: showResultsBeforeVote,
          allow_vote_change: allowVoteChange,
          ends_at: endsAt.toISOString(),
          category: category,
          created_by: effectiveUserId,
          image_url: uploadedImages[0] || null,
          images: uploadedImages,
        });

        Alert.alert('Success', 'Community Poll published successfully!');
        resetForm();
        onClose();
        if (onPostCreated) onPostCreated();
      } catch (err: any) {
        Alert.alert('Publish Failed', err?.message || 'Unable to publish poll.');
      } finally {
        setSubmitting(false);
      }
    } else {
      if (!description.trim() && !title.trim() && !videoUrl.trim()) {
        Alert.alert('Validation Error', 'Please enter post title, description or video link.');
        return;
      }

      setSubmitting(true);
      try {
        const payload: any = {
          title: title.trim() || description.slice(0, 50) || 'Community Video',
          caption: description.trim(),
          category: category,
          created_by: effectiveUserId,
          image_url: uploadedImages[0] || null,
          images: uploadedImages,
          post_type: postType === 'video' || Boolean(videoUrl.trim()) ? 'video' : postType,
        };

        if (videoUrl.trim()) {
          payload.video_url = videoUrl.trim();
          payload.drive_url = videoUrl.trim();
          payload.post_type = 'video';
        }

        await createCommunityPostAdmin(payload);

        Alert.alert('Success', 'Community Post published successfully!');
        resetForm();
        onClose();
        if (onPostCreated) onPostCreated();
      } catch (err: any) {
        Alert.alert('Publish Failed', err?.message || 'Unable to publish post.');
      } finally {
        setSubmitting(false);
      }
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setQuestion('');
    setVideoUrl('');
    setPollOptions(['AI & Machine Learning', 'Web Development', 'Cloud Computing', 'Cybersecurity']);
    setUploadedImages([]);
    setAllowMultiple(false);
    setAnonymousVoting(true);
    setShowResultsBeforeVote(false);
    setAllowVoteChange(false);
  };

  return (
    <Modal visible={visible} transparent={true} animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={[styles.modalContent, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>
              {postType === 'poll' ? 'Create Interactive Poll' : postType === 'video' ? 'Publish Video Post' : 'Create Community Post'}
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Feather name="x" size={20} color={colors.textMuted} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollArea} showsVerticalScrollIndicator={false}>
            {/* Post Type Selector */}
            <View style={styles.typeSelectorRow}>
              {(['poll', 'video', 'image', 'announcement', 'text'] as const).map((type) => {
                const isActive = postType === type;
                return (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.typePill,
                      {
                        backgroundColor: isActive
                          ? colors.primary
                          : isDark
                          ? 'rgba(255,255,255,0.05)'
                          : 'rgba(0,0,0,0.05)',
                      },
                    ]}
                    onPress={() => {
                      setPostType(type);
                      if (type === 'poll') setCategory('Polls');
                      else if (type === 'video') setCategory('Innovation');
                    }}
                  >
                    <Text
                      style={[
                        styles.typePillText,
                        { color: isActive ? '#FFF' : colors.textSecondary },
                      ]}
                    >
                      {type.toUpperCase()}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Poll Creation Specific Fields */}
            {postType === 'poll' ? (
              <View style={styles.formSection}>
                <Text style={[styles.label, { color: colors.textPrimary }]}>Poll Question *</Text>
                <TextInput
                  style={[styles.input, { color: colors.textPrimary, borderColor: colors.border }]}
                  placeholder="e.g. Which workshop should FEEDX organize next?"
                  placeholderTextColor={colors.textMuted}
                  value={question}
                  onChangeText={setQuestion}
                />

                <Text style={[styles.label, { color: colors.textPrimary }]}>Optional Description</Text>
                <TextInput
                  style={[styles.input, { color: colors.textPrimary, borderColor: colors.border }]}
                  placeholder="Provide context for the poll..."
                  placeholderTextColor={colors.textMuted}
                  value={description}
                  onChangeText={setDescription}
                  multiline
                />

                {/* Poll Options */}
                <Text style={[styles.label, { color: colors.textPrimary, marginTop: 12 }]}>
                  Poll Options (Min 2, Max 8)
                </Text>
                {pollOptions.map((opt, idx) => (
                  <View key={idx} style={styles.optionRow}>
                    <Text style={[styles.optionIndex, { color: colors.textMuted }]}>{idx + 1}.</Text>
                    <TextInput
                      style={[
                        styles.optionInput,
                        { color: colors.textPrimary, borderColor: colors.border },
                      ]}
                      placeholder={`Option ${idx + 1}`}
                      placeholderTextColor={colors.textMuted}
                      value={opt}
                      onChangeText={(text) => handleOptionChange(text, idx)}
                    />
                    {pollOptions.length > 2 && (
                      <TouchableOpacity
                        onPress={() => handleRemoveOption(idx)}
                        style={styles.removeOptionBtn}
                      >
                        <Feather name="trash-2" size={16} color="#EF4444" />
                      </TouchableOpacity>
                    )}
                  </View>
                ))}

                {pollOptions.length < 8 && (
                  <TouchableOpacity style={styles.addOptionBtn} onPress={handleAddOption}>
                    <Feather name="plus" size={16} color={colors.primary} />
                    <Text style={[styles.addOptionText, { color: colors.primary }]}>Add Option</Text>
                  </TouchableOpacity>
                )}
              </View>
            ) : postType === 'video' ? (
              /* Video Post Fields */
              <View style={styles.formSection}>
                <Text style={[styles.label, { color: colors.textPrimary }]}>Title</Text>
                <TextInput
                  style={[styles.input, { color: colors.textPrimary, borderColor: colors.border }]}
                  placeholder="Video Title..."
                  placeholderTextColor={colors.textMuted}
                  value={title}
                  onChangeText={setTitle}
                />

                <Text style={[styles.label, { color: colors.textPrimary }]}>Video Link (Google Drive / YouTube / MP4)</Text>
                <TextInput
                  style={[styles.input, { color: colors.textPrimary, borderColor: colors.border }]}
                  placeholder="https://drive.google.com/file/d/FILE_ID/view"
                  placeholderTextColor={colors.textMuted}
                  value={videoUrl}
                  onChangeText={setVideoUrl}
                  autoCapitalize="none"
                  autoCorrect={false}
                />

                <TouchableOpacity style={styles.uploadVideoBtn} onPress={handlePickVideo}>
                  <Ionicons name="cloud-upload-outline" size={18} color="#3B82F6" />
                  <Text style={styles.uploadVideoBtnText}>Select Video From Phone Gallery</Text>
                </TouchableOpacity>

                <Text style={[styles.label, { color: colors.textPrimary, marginTop: 12 }]}>Caption / Description</Text>
                <TextInput
                  style={[styles.input, { height: 80, color: colors.textPrimary, borderColor: colors.border }]}
                  placeholder="Tell students about this video..."
                  placeholderTextColor={colors.textMuted}
                  value={description}
                  onChangeText={setDescription}
                  multiline
                />
              </View>
            ) : (
              /* General Post Fields */
              <View style={styles.formSection}>
                <Text style={[styles.label, { color: colors.textPrimary }]}>Title</Text>
                <TextInput
                  style={[styles.input, { color: colors.textPrimary, borderColor: colors.border }]}
                  placeholder="Post Title..."
                  placeholderTextColor={colors.textMuted}
                  value={title}
                  onChangeText={setTitle}
                />

                <Text style={[styles.label, { color: colors.textPrimary }]}>Content / Caption</Text>
                <TextInput
                  style={[styles.input, { height: 100, color: colors.textPrimary, borderColor: colors.border }]}
                  placeholder="Write your official community message..."
                  placeholderTextColor={colors.textMuted}
                  value={description}
                  onChangeText={setDescription}
                  multiline
                />
              </View>
            )}

            {/* Images Attachment Section (if not video) */}
            {postType !== 'video' && (
              <View style={styles.imageSection}>
                <View style={styles.imageHeaderRow}>
                  <Text style={[styles.label, { color: colors.textPrimary, marginBottom: 0 }]}>
                    Attach Images
                  </Text>
                  <TouchableOpacity onPress={handlePickImage} disabled={uploadingImage}>
                    <Text style={[styles.pickBtnText, { color: colors.primary }]}>+ Add Images</Text>
                  </TouchableOpacity>
                </View>

                {uploadingImage && (
                  <ActivityIndicator
                    size="small"
                    color={colors.primary}
                    style={{ marginVertical: 8 }}
                  />
                )}

                {uploadedImages.length > 0 && (
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.imagePreviewRow}
                  >
                    {uploadedImages.map((url, idx) => (
                      <View key={idx} style={styles.previewThumbWrap}>
                        <ExpoImage source={{ uri: url }} style={styles.previewThumb} />
                        <TouchableOpacity
                          style={styles.removeImgBadge}
                          onPress={() => handleRemoveImage(idx)}
                        >
                          <Feather name="x" size={12} color="#FFF" />
                        </TouchableOpacity>
                      </View>
                    ))}
                  </ScrollView>
                )}
              </View>
            )}
          </ScrollView>

          {/* Footer Submit Button */}
          <TouchableOpacity
            style={[
              styles.submitBtn,
              { backgroundColor: colors.primary },
              submitting && { opacity: 0.6 },
            ]}
            onPress={handleSubmit}
            disabled={submitting}
          >
            {submitting ? (
              <ActivityIndicator size="small" color="#FFF" />
            ) : (
              <Text style={styles.submitBtnText}>
                Publish {postType === 'poll' ? 'Poll' : postType === 'video' ? 'Video Post' : 'Post'}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    padding: SPACING.md,
  },
  modalContent: {
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    maxHeight: '90%',
    borderWidth: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  closeBtn: {
    padding: 4,
  },
  scrollArea: {
    marginBottom: SPACING.md,
  },
  typeSelectorRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: SPACING.md,
    flexWrap: 'wrap',
  },
  typePill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
  },
  typePillText: {
    fontSize: 11,
    fontWeight: '700',
  },
  formSection: {
    marginBottom: SPACING.md,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  input: {
    borderWidth: 1,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    fontSize: 14,
    marginBottom: SPACING.sm,
  },
  uploadVideoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.3)',
    borderRadius: RADIUS.md,
    paddingVertical: 10,
    marginBottom: SPACING.sm,
  },
  uploadVideoBtnText: {
    color: '#3B82F6',
    fontSize: 12,
    fontWeight: '700',
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  optionIndex: {
    fontSize: 13,
    fontWeight: '700',
    width: 18,
  },
  optionInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: 8,
    fontSize: 13,
  },
  removeOptionBtn: {
    padding: 6,
  },
  addOptionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 6,
    paddingVertical: 4,
  },
  addOptionText: {
    fontSize: 13,
    fontWeight: '700',
  },
  imageSection: {
    marginBottom: SPACING.md,
  },
  imageHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  pickBtnText: {
    fontSize: 12,
    fontWeight: '700',
  },
  imagePreviewRow: {
    flexDirection: 'row',
    marginTop: 6,
  },
  previewThumbWrap: {
    width: 60,
    height: 60,
    borderRadius: RADIUS.md,
    marginRight: 8,
    position: 'relative',
    overflow: 'hidden',
  },
  previewThumb: {
    width: '100%',
    height: '100%',
  },
  removeImgBadge: {
    position: 'absolute',
    top: 3,
    right: 3,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 10,
    width: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitBtn: {
    borderRadius: RADIUS.lg,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitBtnText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '800',
  },
});
