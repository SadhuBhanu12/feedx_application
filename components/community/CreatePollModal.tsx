import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Alert,
  Switch,
} from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '@/context/ThemeContext';
import { createCommunityPostAdmin, createCommunityPollPostAdmin, uploadCommunityImage } from '@/services/supabaseService';
import { SPACING, FONT, RADIUS, SHADOWS } from '@/constants/theme';
import { Image as ExpoImage } from 'expo-image';

interface CreatePollModalProps {
  visible: boolean;
  onClose: () => void;
  userId: string;
  onPostCreated?: () => void;
}

export function CreatePollModal({ visible, onClose, userId, onPostCreated }: CreatePollModalProps) {
  const { colors, isDark } = useTheme();

  const [postType, setPostType] = useState<'text' | 'image' | 'poll' | 'announcement'>('poll');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Polls');

  // Poll Fields
  const [question, setQuestion] = useState('');
  const [pollOptions, setPollOptions] = useState<string[]>(['AI & Machine Learning', 'Web Development', 'Cloud Computing', 'Cybersecurity']);
  const [allowMultiple, setAllowMultiple] = useState(false);
  const [anonymousVoting, setAnonymousVoting] = useState(true);
  const [showResultsBeforeVote, setShowResultsBeforeVote] = useState(false);
  const [allowVoteChange, setAllowVoteChange] = useState(false);
  const [endDateDays, setEndDateDays] = useState('3'); // default 3 days poll

  // Multi-Image Upload
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
          created_by: userId,
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
      if (!description.trim() && !title.trim()) {
        Alert.alert('Validation Error', 'Please enter post title or content.');
        return;
      }

      setSubmitting(true);
      try {
        await createCommunityPostAdmin({
          title: title.trim() || description.slice(0, 50),
          caption: description.trim(),
          category: category,
          created_by: userId,
          image_url: uploadedImages[0] || null,
          images: uploadedImages,
          post_type: postType,
        });

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
        <View style={[styles.modalContent, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerTitleGroup}>
              <MaterialCommunityIcons name="poll" size={22} color={colors.primary} />
              <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Superadmin Content Creator</Text>
            </View>
            <TouchableOpacity onPress={onClose}>
              <Feather name="x" size={22} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
            {/* Post Type Selector */}
            <View style={styles.typeSelectorRow}>
              {(['poll', 'image', 'announcement', 'text'] as const).map((type) => {
                const isActive = postType === type;
                return (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.typePill,
                      { backgroundColor: isActive ? colors.primary : isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' },
                    ]}
                    onPress={() => {
                      setPostType(type);
                      if (type === 'poll') setCategory('Polls');
                    }}
                  >
                    <Text style={[styles.typePillText, { color: isActive ? '#FFF' : colors.textSecondary }]}>
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

                <Text style={[styles.label, { color: colors.textPrimary }]}>Poll Options (Min 2)</Text>
                {pollOptions.map((opt, idx) => (
                  <View key={idx} style={styles.optionInputRow}>
                    <TextInput
                      style={[styles.input, { flex: 1, color: colors.textPrimary, borderColor: colors.border }]}
                      placeholder={`Option ${idx + 1}`}
                      placeholderTextColor={colors.textMuted}
                      value={opt}
                      onChangeText={(txt) => handleOptionChange(txt, idx)}
                    />
                    {pollOptions.length > 2 && (
                      <TouchableOpacity onPress={() => handleRemoveOption(idx)} style={styles.removeOptionBtn}>
                        <Feather name="trash-2" size={18} color="#EF4444" />
                      </TouchableOpacity>
                    )}
                  </View>
                ))}

                <TouchableOpacity style={[styles.addOptBtn, { borderColor: colors.primary }]} onPress={handleAddOption}>
                  <Feather name="plus" size={16} color={colors.primary} />
                  <Text style={[styles.addOptBtnText, { color: colors.primary }]}>Add Option</Text>
                </TouchableOpacity>

                {/* Poll Configuration Toggles */}
                <View style={styles.togglesGroup}>
                  <View style={styles.toggleRow}>
                    <Text style={[styles.toggleLabel, { color: colors.textSecondary }]}>Allow Multiple Answers</Text>
                    <Switch value={allowMultiple} onValueChange={setAllowMultiple} />
                  </View>

                  <View style={styles.toggleRow}>
                    <Text style={[styles.toggleLabel, { color: colors.textSecondary }]}>Anonymous Voting</Text>
                    <Switch value={anonymousVoting} onValueChange={setAnonymousVoting} />
                  </View>

                  <View style={styles.toggleRow}>
                    <Text style={[styles.toggleLabel, { color: colors.textSecondary }]}>Allow Vote Change</Text>
                    <Switch value={allowVoteChange} onValueChange={setAllowVoteChange} />
                  </View>
                </View>
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

            {/* Images Attachment Section */}
            <View style={styles.imageSection}>
              <View style={styles.imageHeaderRow}>
                <Text style={[styles.label, { color: colors.textPrimary, marginBottom: 0 }]}>Attach Images</Text>
                <TouchableOpacity onPress={handlePickImage} disabled={uploadingImage}>
                  <Text style={[styles.pickBtnText, { color: colors.primary }]}>+ Add Images</Text>
                </TouchableOpacity>
              </View>

              {uploadingImage && <ActivityIndicator size="small" color={colors.primary} style={{ marginVertical: 8 }} />}

              {uploadedImages.length > 0 && (
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imagePreviewRow}>
                  {uploadedImages.map((url, idx) => (
                    <View key={idx} style={styles.previewThumbWrap}>
                      <ExpoImage source={{ uri: url }} style={styles.previewThumb} />
                      <TouchableOpacity style={styles.removeImgBadge} onPress={() => handleRemoveImage(idx)}>
                        <Feather name="x" size={12} color="#FFF" />
                      </TouchableOpacity>
                    </View>
                  ))}
                </ScrollView>
              )}
            </View>
          </ScrollView>

          {/* Footer Submit Button */}
          <TouchableOpacity
            style={[styles.submitBtn, { backgroundColor: colors.primary }, submitting && { opacity: 0.6 }]}
            onPress={handleSubmit}
            disabled={submitting}
          >
            {submitting ? (
              <ActivityIndicator size="small" color="#FFF" />
            ) : (
              <Text style={styles.submitBtnText}>Publish {postType === 'poll' ? 'Poll' : 'Post'}</Text>
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
    gap: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: FONT.size.md,
    fontWeight: '800',
  },
  body: {
    maxHeight: 480,
  },
  typeSelectorRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 14,
  },
  typePill: {
    flex: 1,
    paddingVertical: 7,
    borderRadius: RADIUS.md,
    alignItems: 'center',
  },
  typePillText: {
    fontSize: 10,
    fontWeight: '900',
  },
  formSection: {
    gap: 10,
  },
  label: {
    fontSize: 12,
    fontWeight: '800',
    marginBottom: 2,
  },
  input: {
    borderRadius: RADIUS.md,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: 13,
  },
  optionInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  removeOptionBtn: {
    padding: 6,
  },
  addOptBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderStyle: 'dashed',
    marginTop: 4,
  },
  addOptBtnText: {
    fontSize: 12,
    fontWeight: '800',
  },
  togglesGroup: {
    gap: 8,
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  toggleLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  imageSection: {
    marginTop: 14,
    gap: 8,
  },
  imageHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pickBtnText: {
    fontSize: 12,
    fontWeight: '800',
  },
  imagePreviewRow: {
    flexDirection: 'row',
    gap: 8,
  },
  previewThumbWrap: {
    width: 60,
    height: 60,
    borderRadius: RADIUS.sm,
    overflow: 'hidden',
    position: 'relative',
    marginRight: 8,
  },
  previewThumb: {
    width: '100%',
    height: '100%',
  },
  removeImgBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 8,
    padding: 2,
  },
  submitBtn: {
    paddingVertical: 12,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
  },
  submitBtnText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '800',
  },
});
