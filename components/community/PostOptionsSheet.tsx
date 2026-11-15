import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Share,
  Alert,
  Clipboard,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';
import { downloadOrOpenFile, shareCommunityPost } from '@/services/downloadService';
import { reportCommunityItem } from '@/services/supabaseService';

interface PostOptionsSheetProps {
  visible: boolean;
  post: any;
  currentUserId?: string;
  isSuperAdmin?: boolean;
  onClose: () => void;
  onPinPress?: () => void;
  onDeletePress?: () => void;
  onEditPress?: () => void;
}

export function PostOptionsSheet({
  visible,
  post,
  currentUserId,
  isSuperAdmin = false,
  onClose,
  onPinPress,
  onDeletePress,
  onEditPress,
}: PostOptionsSheetProps) {
  const { colors, isDark } = useTheme();

  if (!post) return null;

  const isPinned = Boolean(post.pinned);
  const mediaUrl =
    (Array.isArray(post.media_urls) && post.media_urls[0]) ||
    (Array.isArray(post.images) && post.images[0]) ||
    post.image_url ||
    post.media_url ||
    post.drive_url;

  const handleDownloadImage = async () => {
    onClose();
    if (!mediaUrl) {
      Alert.alert('Notice', 'No image available to download on this post.');
      return;
    }
    try {
      try {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      } catch (_) {}
      const cleanName = (post.title || 'feedx_post').replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 30);
      const filename = `${cleanName}_${Date.now()}.png`;
      await downloadOrOpenFile(mediaUrl, filename, 'Image (PNG)');
    } catch (e: any) {
      console.warn('Download error:', e);
      Alert.alert('Download Error', e?.message || 'Could not download image.');
    }
  };

  const handleShare = async () => {
    onClose();
    try {
      try {
        Haptics.selectionAsync();
      } catch (_) {}
      await shareCommunityPost(post);
    } catch (e) {
      console.warn('Share error:', e);
    }
  };

  const handleReport = () => {
    Alert.alert('Report Post', 'Why are you reporting this post?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Inappropriate Content',
        onPress: async () => {
          try {
            await reportCommunityItem({
              item_id: post.id,
              item_type: 'post',
              reporter_id: currentUserId,
              reason: 'Inappropriate Content',
            });
            Alert.alert('Report Submitted', 'Thank you for keeping the FEEDX Community safe.');
            onClose();
          } catch (e) {
            Alert.alert('Notice', 'Report has been received.');
            onClose();
          }
        },
      },
      {
        text: 'Misleading Info',
        onPress: async () => {
          try {
            await reportCommunityItem({
              item_id: post.id,
              item_type: 'post',
              reporter_id: currentUserId,
              reason: 'Misleading Info',
            });
            Alert.alert('Report Submitted', 'Thank you for keeping the FEEDX Community safe.');
            onClose();
          } catch (e) {
            Alert.alert('Notice', 'Report has been received.');
            onClose();
          }
        },
      },
    ]);
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />

        <View style={[styles.sheet, { backgroundColor: isDark ? '#0F172A' : '#FFFFFF' }]}>
          <View style={styles.grabHandleWrap}>
            <View style={[styles.grabHandle, { backgroundColor: isDark ? '#334155' : '#E2E8F0' }]} />
          </View>

          {/* Superadmin Actions */}
          {isSuperAdmin && (
            <View style={styles.section}>
              <Text style={[styles.sectionHeader, { color: colors.textMuted }]}>SUPERADMIN CONTROLS</Text>

              {onPinPress && (
                <TouchableOpacity style={styles.optionRow} onPress={() => { onClose(); onPinPress(); }}>
                  <MaterialCommunityIcons
                    name={isPinned ? 'pin-off-outline' : 'pin-outline'}
                    size={22}
                    color={colors.textPrimary}
                  />
                  <Text style={[styles.optionText, { color: colors.textPrimary }]}>
                    {isPinned ? 'Unpin Post from Top' : 'Pin Post to Top'}
                  </Text>
                </TouchableOpacity>
              )}

              {onEditPress && (
                <TouchableOpacity style={styles.optionRow} onPress={() => { onClose(); onEditPress(); }}>
                  <Feather name="edit-3" size={20} color={colors.textPrimary} />
                  <Text style={[styles.optionText, { color: colors.textPrimary }]}>Edit Post</Text>
                </TouchableOpacity>
              )}

              {onDeletePress && (
                <TouchableOpacity style={styles.optionRow} onPress={() => { onClose(); onDeletePress(); }}>
                  <Feather name="trash-2" size={20} color="#EF4444" />
                  <Text style={[styles.optionText, { color: '#EF4444' }]}>Delete Post</Text>
                </TouchableOpacity>
              )}
            </View>
          )}

          {/* General Actions */}
          <View style={styles.section}>
            <TouchableOpacity style={styles.optionRow} onPress={handleShare}>
              <Feather name="share-2" size={20} color={colors.textPrimary} />
              <Text style={[styles.optionText, { color: colors.textPrimary }]}>Share Post</Text>
            </TouchableOpacity>

            {mediaUrl ? (
              <TouchableOpacity style={styles.optionRow} onPress={handleDownloadImage}>
                <Feather name="download" size={20} color={colors.textPrimary} />
                <Text style={[styles.optionText, { color: colors.textPrimary }]}>Download Image</Text>
              </TouchableOpacity>
            ) : null}

            <TouchableOpacity style={styles.optionRow} onPress={handleReport}>
              <Feather name="flag" size={20} color="#EF4444" />
              <Text style={[styles.optionText, { color: '#EF4444' }]}>Report Post</Text>
            </TouchableOpacity>
          </View>

          {/* Cancel Button */}
          <TouchableOpacity
            style={[styles.cancelBtn, { backgroundColor: isDark ? '#1E293B' : '#F1F5F9' }]}
            onPress={onClose}
          >
            <Text style={[styles.cancelBtnText, { color: colors.textPrimary }]}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  backdrop: {
    flex: 1,
  },
  sheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingBottom: 36,
  },
  grabHandleWrap: {
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 14,
  },
  grabHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
  },
  section: {
    marginBottom: 12,
  },
  sectionHeader: {
    fontSize: 10.5,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: 8,
    marginTop: 4,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 13,
    gap: 14,
  },
  optionText: {
    fontSize: 14.5,
    fontWeight: '700',
  },
  cancelBtn: {
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  cancelBtnText: {
    fontSize: 14.5,
    fontWeight: '800',
  },
});
