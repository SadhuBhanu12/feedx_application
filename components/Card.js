import { View, StyleSheet } from 'react-native';
import { COLORS, SHADOWS } from '@/constants/theme';

export default function Card({ children, style }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    ...SHADOWS.light,
  }
});