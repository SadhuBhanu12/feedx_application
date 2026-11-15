import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { COLORS, SHADOWS } from '@/constants/theme';
import { LinearGradient } from 'expo-linear-gradient';

export function getGenderAvatarUri(userOrGender, styleSeed = 'default') {
  let g = '';
  let customUrl = '';
  let effectiveSeed = styleSeed;

  if (typeof userOrGender === 'string') {
    if (userOrGender.startsWith('http') || userOrGender.startsWith('file://') || userOrGender.startsWith('data:') || userOrGender.startsWith('ph://')) {
      return userOrGender.trim();
    }
    g = userOrGender.trim().toLowerCase();
  } else if (userOrGender && typeof userOrGender === 'object') {
    customUrl = userOrGender.avatar_url || userOrGender.profile_image || userOrGender.profile_picture || userOrGender.avatar || userOrGender.user_metadata?.avatar_url || '';
    if (customUrl && String(customUrl).trim().length > 5) {
      return String(customUrl).trim();
    }
    g = String(
      userOrGender.gender ||
      userOrGender.sex ||
      userOrGender.user_metadata?.gender ||
      ''
    ).trim().toLowerCase();

    if (styleSeed === 'default') {
      const uniqueId = userOrGender.id || userOrGender.email || userOrGender.roll_no || userOrGender.roll_number || userOrGender.full_name || 'Student';
      effectiveSeed = `FX_${String(uniqueId).replace(/[^a-zA-Z0-9]/g, '').slice(0, 16)}`;
    }
  }

  // 3D Animated Student Avatars
  if (g === 'female' || g === 'f' || g === 'girl') {
    return `https://api.dicebear.com/7.x/bottts/png?seed=${effectiveSeed === 'default' ? 'FemaleStudent' : effectiveSeed}&backgroundColor=ec4899`;
  }
  return `https://api.dicebear.com/7.x/bottts/png?seed=${effectiveSeed === 'default' ? 'MaleStudent' : effectiveSeed}&backgroundColor=3b82f6`;
}

/**
 * @param {{
 *   user?: any,
 *   gender?: string,
 *   avatarUrl?: string,
 *   fullName?: string,
 *   size?: number,
 *   showBadge?: boolean,
 *   animated?: boolean,
 *   style?: any
 * }} props
 */
export function UserAvatar({
  user = null,
  gender = null,
  avatarUrl = null,
  fullName = '',
  size = 48,
  showBadge = false,
  animated = false,
  style = null,
}) {
  const [imageError, setImageError] = React.useState(false);
  const effectiveUser = user || (avatarUrl || fullName ? { avatar_url: avatarUrl, full_name: fullName, gender } : null);
  const avatarUri = getGenderAvatarUri(avatarUrl || effectiveUser || gender);
  const fallbackName = fullName || user?.full_name || 'Student';
  const fallbackUri = `https://ui-avatars.com/api/?name=${encodeURIComponent(fallbackName)}&background=3b82f6&color=fff`;
  const activeUri = imageError ? fallbackUri : avatarUri;
  const breathScale = useSharedValue(1);
  const haloOpacity = useSharedValue(0.4);

  useEffect(() => {
    if (animated) {
      try {
        if (typeof withRepeat === 'function' && typeof withSequence === 'function' && typeof withTiming === 'function') {
          breathScale.value = withRepeat(
            withSequence(
              withTiming(1.04, { duration: 1500, easing: Easing?.inOut ? Easing.inOut(Easing.ease) : undefined }),
              withTiming(1.00, { duration: 1500, easing: Easing?.inOut ? Easing.inOut(Easing.ease) : undefined })
            ),
            -1,
            true
          );

          haloOpacity.value = withRepeat(
            withSequence(
              withTiming(0.8, { duration: 1500, easing: Easing?.inOut ? Easing.inOut(Easing.ease) : undefined }),
              withTiming(0.4, { duration: 1500, easing: Easing?.inOut ? Easing.inOut(Easing.ease) : undefined })
            ),
            -1,
            true
          );
        }
      } catch (err) {
        // Fallback gracefully without crash
      }
    }
  }, [animated]);

  const animatedAvatarStyle = useAnimatedStyle(() => ({
    transform: [{ scale: breathScale.value }],
  }));

  const animatedHaloStyle = useAnimatedStyle(() => ({
    opacity: haloOpacity.value,
  }));

  return (
    <View style={[styles.outerWrapper, { width: animated ? size + 6 : size, height: animated ? size + 6 : size }, style]}>
      {animated && (
        <Animated.View
          style={[
            styles.haloRing,
            { width: size + 6, height: size + 6, borderRadius: (size + 6) / 2 },
            animatedHaloStyle,
          ]}
        >
          <LinearGradient
            colors={[COLORS.primary, '#EC4899', '#06B6D4']}
            style={styles.gradientRing}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
        </Animated.View>
      )}

      <Animated.View
        style={[
          styles.avatarContainer,
          { width: size, height: size, borderRadius: size / 2 },
          animated && animatedAvatarStyle,
        ]}
      >
        <Image
          source={{ uri: activeUri }}
          style={[styles.avatarImage, { width: size, height: size, borderRadius: size / 2 }]}
          contentFit="cover"
          transition={200}
          onError={() => setImageError(true)}
        />
        {showBadge && (
          <View
            style={[
              styles.badge,
              {
                width: Math.max(12, size * 0.28),
                height: Math.max(12, size * 0.28),
                borderRadius: Math.max(6, size * 0.14),
              },
            ]}
          />
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  haloRing: {
    position: 'absolute',
    padding: 2,
  },
  gradientRing: {
    width: '100%',
    height: '100%',
    borderRadius: 999,
  },
  avatarContainer: {
    backgroundColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    overflow: 'hidden',
    position: 'relative',
    ...SHADOWS.glow(COLORS.primary),
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  badge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: COLORS.success,
    borderWidth: 2,
    borderColor: '#0F172A',
  },
});

export default UserAvatar;
