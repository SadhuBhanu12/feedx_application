import React from 'react';
import { View, StyleSheet, StyleProp, TextStyle, ViewStyle } from 'react-native';
import { Feather, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';

export type FeedXIconName =
  | 'home'
  | 'explore'
  | 'academic'
  | 'community'
  | 'profile'
  | 'career'
  | 'opportunity'
  | 'event'
  | 'project'
  | 'roadmap'
  | 'token'
  | 'xp'
  | 'achievement'
  | 'streak'
  | 'quiz'
  | 'quick-learn'
  | 'resources'
  | 'innovation'
  | 'notice'
  | 'support'
  | 'digital-id'
  | 'qr'
  | 'search'
  | 'filter'
  | 'bookmark'
  | 'like'
  | 'share'
  | 'calendar'
  | 'clock'
  | 'check'
  | 'alert'
  | 'info'
  | 'arrow-right'
  | 'arrow-left'
  | 'chevron-right'
  | 'chevron-down'
  | 'chevron-up'
  | 'settings'
  | 'lock'
  | 'upload'
  | 'download';

export type FeedxIconName = FeedXIconName;
export type FeedXIconSize = 12 | 14 | 16 | 18 | 20 | 22 | 24 | 28 | 32 | 40 | 48 | 56 | number;
export type FeedxIconSize = FeedXIconSize;

export interface FeedXIconProps {
  name: FeedXIconName;
  size?: FeedXIconSize;
  color?: string;
  variant?: 'outline' | 'filled';
  glow?: boolean;
  containerSize?: number;
  style?: StyleProp<any>;
}

export type FeedxIconProps = FeedXIconProps;

export function FeedXIcon({
  name,
  size = 20,
  color,
  variant = 'outline',
  glow = false,
  containerSize,
  style,
}: FeedXIconProps) {
  const { colors } = useTheme();
  const iconColor = color || colors.primary;

  const renderIcon = () => {
    switch (name) {
      case 'home':
        return <Feather name="home" size={size} color={iconColor} style={style} />;
      case 'explore':
        return <Feather name="compass" size={size} color={iconColor} style={style} />;
      case 'academic':
        return <MaterialCommunityIcons name="school-outline" size={size} color={iconColor} style={style} />;
      case 'community':
        return <MaterialCommunityIcons name="account-group-outline" size={size} color={iconColor} style={style} />;
      case 'profile':
        return <Feather name="user" size={size} color={iconColor} style={style} />;
      case 'career':
      case 'opportunity':
        return <Feather name="briefcase" size={size} color={iconColor} style={style} />;
      case 'event':
      case 'calendar':
        return <Feather name="calendar" size={size} color={iconColor} style={style} />;
      case 'project':
        return <Feather name="layers" size={size} color={iconColor} style={style} />;
      case 'roadmap':
        return <MaterialCommunityIcons name="map-marker-path" size={size} color={iconColor} style={style} />;
      case 'xp':
        return <Feather name="trending-up" size={size} color={iconColor} style={style} />;
      case 'achievement':
        return <Feather name="award" size={size} color={iconColor} style={style} />;
      case 'streak':
        return <MaterialCommunityIcons name="fire" size={size} color={iconColor || '#F59E0B'} style={style} />;
      case 'quiz':
        return <MaterialCommunityIcons name="puzzle-outline" size={size} color={iconColor} style={style} />;
      case 'quick-learn':
        return <Feather name="zap" size={size} color={iconColor} style={style} />;
      case 'resources':
        return <Feather name="book-open" size={size} color={iconColor} style={style} />;
      case 'innovation':
        return <Feather name="cpu" size={size} color={iconColor} style={style} />;
      case 'notice':
        return <MaterialCommunityIcons name="bullhorn-outline" size={size} color={iconColor} style={style} />;
      case 'support':
        return <MaterialCommunityIcons name="shield-alert-outline" size={size} color={iconColor} style={style} />;
      case 'digital-id':
        return <MaterialCommunityIcons name="card-account-details-outline" size={size} color={iconColor} style={style} />;
      case 'qr':
        return <MaterialCommunityIcons name="qrcode-scan" size={size} color={iconColor} style={style} />;
      case 'search':
        return <Feather name="search" size={size} color={iconColor} style={style} />;
      case 'filter':
        return <Feather name="filter" size={size} color={iconColor} style={style} />;
      case 'bookmark':
        return (
          <MaterialCommunityIcons
            name={variant === 'filled' ? 'bookmark' : 'bookmark-outline'}
            size={size}
            color={iconColor}
            style={style}
          />
        );
      case 'like':
        return (
          <Ionicons
            name={variant === 'filled' ? 'heart' : 'heart-outline'}
            size={size}
            color={variant === 'filled' ? '#EF4444' : iconColor}
            style={style}
          />
        );
      case 'share':
        return <Feather name="share-2" size={size} color={iconColor} style={style} />;
      case 'clock':
        return <Feather name="clock" size={size} color={iconColor} style={style} />;
      case 'check':
        return <Feather name="check-circle" size={size} color={iconColor || '#10B981'} style={style} />;
      case 'alert':
        return <Feather name="alert-triangle" size={size} color={iconColor || '#F59E0B'} style={style} />;
      case 'info':
        return <Feather name="info" size={size} color={iconColor} style={style} />;
      case 'arrow-right':
        return <Feather name="arrow-right" size={size} color={iconColor} style={style} />;
      case 'arrow-left':
        return <Feather name="arrow-left" size={size} color={iconColor} style={style} />;
      case 'chevron-right':
        return <Feather name="chevron-right" size={size} color={iconColor} style={style} />;
      case 'chevron-down':
        return <Feather name="chevron-down" size={size} color={iconColor} style={style} />;
      case 'chevron-up':
        return <Feather name="chevron-up" size={size} color={iconColor} style={style} />;
      case 'settings':
        return <Feather name="settings" size={size} color={iconColor} style={style} />;
      case 'lock':
        return <Feather name="lock" size={size} color={iconColor} style={style} />;
      case 'upload':
        return <Feather name="upload" size={size} color={iconColor} style={style} />;
      case 'download':
        return <Feather name="download" size={size} color={iconColor} style={style} />;
      default:
        return <Feather name="circle" size={size} color={iconColor} style={style} />;
    }
  };

  if (containerSize) {
    return (
      <View
        style={[
          styles.iconContainer,
          { width: containerSize, height: containerSize, borderRadius: containerSize / 2 },
          glow && { shadowColor: iconColor, shadowOpacity: 0.35, shadowRadius: 6, elevation: 3 },
        ]}
      >
        {renderIcon()}
      </View>
    );
  }

  return renderIcon();
}

export const FeedxIcon = FeedXIcon;
export default FeedXIcon;

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
