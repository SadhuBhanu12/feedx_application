import React from 'react';
import { View, Text, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  interpolate,
  Extrapolation,
  SharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/context/ThemeContext';
import { PressableCard } from '@/components/ui/PressableCard';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import FeedxAppLogo from '@/components/ui/FeedxAppLogo';

export interface CollapsingHeaderProps {
  title: string;
  subtitle?: string;
  scrollY?: SharedValue<number>;
  rightElement?: React.ReactNode;
  showLogo?: boolean;
  style?: StyleProp<ViewStyle>;
}

export const CollapsingHeader: React.FC<CollapsingHeaderProps> = ({
  title,
  subtitle,
  scrollY,
  rightElement,
  showLogo = true,
  style,
}) => {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const router = useRouter();

  const maxHeaderHeight = 110 + insets.top;
  const minHeaderHeight = 60 + insets.top;

  const headerAnimatedStyle = useAnimatedStyle(() => {
    if (!scrollY) return {};
    const height = interpolate(
      scrollY.value,
      [0, 80],
      [maxHeaderHeight, minHeaderHeight],
      Extrapolation.CLAMP
    );
    const borderBottomOpacity = interpolate(
      scrollY.value,
      [0, 40],
      [0, 0.15],
      Extrapolation.CLAMP
    );

    return {
      height,
      borderBottomColor: `rgba(255, 255, 255, ${borderBottomOpacity})`,
    };
  });

  const subtitleAnimatedStyle = useAnimatedStyle(() => {
    if (!scrollY) return {};
    const opacity = interpolate(
      scrollY.value,
      [0, 45],
      [1, 0],
      Extrapolation.CLAMP
    );
    const translateY = interpolate(
      scrollY.value,
      [0, 45],
      [0, -10],
      Extrapolation.CLAMP
    );

    return {
      opacity,
      transform: [{ translateY }],
    };
  });

  const titleAnimatedStyle = useAnimatedStyle(() => {
    if (!scrollY) return {};
    const scale = interpolate(
      scrollY.value,
      [0, 70],
      [1, 0.86],
      Extrapolation.CLAMP
    );
    const translateY = interpolate(
      scrollY.value,
      [0, 70],
      [0, 4],
      Extrapolation.CLAMP
    );

    return {
      transform: [{ scale }, { translateY }],
    };
  });

  return (
    <Animated.View
      style={[
        styles.container,
        {
          paddingTop: insets.top + 8,
          backgroundColor: colors.background,
        },
        headerAnimatedStyle,
        style,
      ]}
    >
      <View style={styles.contentRow}>
        {showLogo && (
          <PressableCard
            onPress={() => router.push('/about-feedx')}
            scaleTo={0.94}
            haptic
          >
            <FeedxAppLogo size={40} />
          </PressableCard>
        )}

        <View style={styles.titleCol}>
          <Animated.Text
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.85}
            maxFontSizeMultiplier={1.2}
            style={[styles.title, { color: colors.textPrimary }, titleAnimatedStyle]}
          >
            {title}
          </Animated.Text>
          {subtitle ? (
            <Animated.Text
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.85}
              maxFontSizeMultiplier={1.2}
              style={[styles.subtitle, { color: colors.textSecondary }, subtitleAnimatedStyle]}
            >
              {subtitle}
            </Animated.Text>
          ) : null}
        </View>

        {rightElement && <View style={styles.rightWrap}>{rightElement}</View>}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'transparent',
    justifyContent: 'center',
    zIndex: 10,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoWrap: {
    width: 40,
    height: 40,
    marginRight: 12,
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 10,
  },
  titleCol: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: -0.3,
    includeFontPadding: false,
  },
  subtitle: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 2,
    includeFontPadding: false,
  },
  rightWrap: {
    marginLeft: 12,
    alignItems: 'flex-end',
  },
});

export default CollapsingHeader;
