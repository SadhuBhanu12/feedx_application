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

  if (typeof userOrGender === 'string') {
    g = userOrGender.trim().toLowerCase();
  } else if (userOrGender && typeof userOrGender === 'object') {
    customUrl = userOrGender.profile_picture || userOrGender.avatar_url || userOrGender.user_metadata?.avatar_url || '';
    if (customUrl && String(customUrl).trim().length > 10) {
      return customUrl.trim();
    }
    g = String(
      userOrGender.gender ||
      userOrGender.sex ||
      userOrGender.user_metadata?.gender ||
      ''
    ).trim().toLowerCase();
  }

  // 3D Animated Student Avatars
  if (g === 'male' || g === 'm' || g === 'boy') {
    return `https://api.dicebear.com/7.x/bottts/png?seed=${styleSeed === 'default' ? 'MaleStudent' : styleSeed}&backgroundColor=3b82f6`;
  }
  if (g === 'female' || g === 'f' || g === 'girl') {
    return `https://api.dicebear.com/7.x/bottts/png?seed=${styleSeed === 'default' ? 'FemaleStudent' : styleSeed}&backgroundColor=ec4899`;
  }
  return `https://api.dicebear.com/7.x/bottts/png?seed=${styleSeed === 'default' ? 'NeutralStudent' : styleSeed}&backgroundColor=06b6d4`;
}

export function UserAvatar({
  user = null,
  gender = null,
  size = 48,
  showBadge = false,
  animated = false,
  style = null,
}) {
  const [imageError, setImageError] = React.useState(false);
  const avatarUri = getGenderAvatarUri(user || gender);
  const fallbackUri = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.full_name || 'Student')}&background=3b82f6&color=fff`;
  const activeUri = imageError ? fallbackUri : avatarUri;
  const breathScale = useSharedValue(1);
  const haloOpacity = useSharedValue(0.4);

  useEffect(() => {
    if (animated) {
      breathScale.value = withRepeat(
        withSequence(
          withTiming(1.04, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
          withTiming(1.00, { duration: 1500, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      );

      haloOpacity.value = withRepeat(
        withSequence(
          withTiming(0.8, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
          withTiming(0.4, { duration: 1500, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      );
    }
  }, [animated]);

  const animatedAvatarStyle = useAnimatedStyle(() => ({
    transform: [{ scale: breathScale.value }],
  }));

  const animatedHaloStyle = useAnimatedStyle(() => ({
    opacity: haloOpacity.value,
  }));

  return (
    <View style={[styles.outerWrapper, { width: size + 6, height: size + 6 }, style]}>
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
