import { View, Text, StyleSheet, TouchableOpacity, StyleProp, ViewStyle, TextStyle, Clipboard, Platform, Alert } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/context/ThemeContext';
import { resolveStandardFeedXId } from '@/services/idService';

export interface FeedXIdProps {
  value?: string | null;
  student?: any;
  size?: 'sm' | 'md' | 'lg';
  showCopy?: boolean;
  showIcon?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export const FeedXId: React.FC<FeedXIdProps> = ({
  value,
  student,
  size = 'md',
  showCopy = true,
  showIcon = true,
  style,
  textStyle,
}) => {
  const { colors, isDark } = useTheme();
  const feedxId = value ? (value.startsWith('FX-') ? value : resolveStandardFeedXId({ feedx_id: value })) : resolveStandardFeedXId(student);

  const handleCopy = () => {
    try {
      if (Platform.OS === 'web' && typeof navigator !== 'undefined' && navigator?.clipboard) {
        navigator.clipboard.writeText(feedxId);
      } else {
        Clipboard.setString(feedxId);
      }
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
      Alert.alert('Copied!', `FEEDX ID (${feedxId}) copied to clipboard.`);
    } catch {}
  };

  const getSizes = () => {
    switch (size) {
      case 'sm':
        return { fontSize: 11, paddingH: 6, paddingV: 2, iconSize: 12 };
      case 'lg':
        return { fontSize: 16, paddingH: 12, paddingV: 6, iconSize: 18 };
      default:
        return { fontSize: 13, paddingH: 8, paddingV: 4, iconSize: 14 };
    }
  };

  const s = getSizes();

  return (
    <TouchableOpacity
      onPress={showCopy ? handleCopy : undefined}
      activeOpacity={showCopy ? 0.7 : 1}
      style={[
        styles.container,
        {
          backgroundColor: isDark ? 'rgba(0, 178, 254, 0.12)' : 'rgba(0, 178, 254, 0.08)',
          borderColor: isDark ? 'rgba(0, 178, 254, 0.3)' : 'rgba(0, 178, 254, 0.2)',
          paddingHorizontal: s.paddingH,
          paddingVertical: s.paddingV,
        },
        style,
      ]}
    >
      {showIcon && (
        <MaterialCommunityIcons name="shield-check" size={s.iconSize} color="#00B2FE" style={{ marginRight: 4 }} />
      )}
      <Text
        numberOfLines={1}
        ellipsizeMode="tail"
        style={[
          styles.idText,
          {
            fontSize: s.fontSize,
            color: isDark ? '#38BDF8' : '#0284C7',
          },
          textStyle,
        ]}
      >
        {feedxId}
      </Text>
      {showCopy && (
        <Feather name="copy" size={s.iconSize - 2} color={isDark ? '#38BDF8' : '#0284C7'} style={{ marginLeft: 5, opacity: 0.8, flexShrink: 0 }} />
      )}
    </TouchableOpacity>
  );
};

export default FeedXId;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    alignSelf: 'flex-start',
    maxWidth: '100%',
  },
  idText: {
    fontWeight: '800',
    fontFamily: 'monospace',
    letterSpacing: 0.5,
    flexShrink: 1,
  },
});
