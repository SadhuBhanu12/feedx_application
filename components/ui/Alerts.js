import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { TriangleAlert, ListTodo } from 'lucide-react-native';
import { COLORS } from '@/constants/theme';
import GlassCard from './GlassCard';

const AlertItem = ({ icon, text, color, delay }) => (
  <Animated.View entering={FadeInUp.delay(delay)}>
    <GlassCard style={[styles.alert, { backgroundColor: color }]}>
      {icon}
      <Text style={styles.alertText}>{text}</Text>
    </GlassCard>
  </Animated.View>
);

const Alerts = ({ attendance, pendingTasks }) => {
  return (
    <View>
      {attendance < 75 && (
        <AlertItem
          icon={<TriangleAlert size={18} color={COLORS.white} />}
          text="Attendance is below 75%. Plan recovery sessions."
          color={COLORS.danger}
          delay={160}
        />
      )}
      {pendingTasks > 0 && (
        <AlertItem
          icon={<ListTodo size={18} color={COLORS.white} />}
          text={`${pendingTasks} deadlines are pending. Clear your backlog.`}
          color={COLORS.warning}
          delay={200}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  alert: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    marginBottom: 12,
  },
  alertText: {
    color: COLORS.white,
    flex: 1,
    fontWeight: '600',
    fontSize: 13,
  },
});

export default Alerts;
