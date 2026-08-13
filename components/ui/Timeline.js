import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';
import { COLORS } from '@/constants/theme';
import { Clock } from 'lucide-react-native';

const TimelineItem = ({ item, isCurrent }) => {
  return (
    <Animated.View style={[styles.item, isCurrent && styles.currentItem]}>
      <View style={styles.timeContainer}>
        <Clock size={16} color={isCurrent ? COLORS.white : COLORS.gray} />
        <Text style={[styles.timeText, isCurrent && styles.currentTimeText]}>
          {item.start_time} - {item.end_time}
        </Text>
      </View>
      <View style={styles.detailsContainer}>
        <Text style={[styles.title, isCurrent && styles.currentTitle]}>{item.subject_name}</Text>
      </View>
    </Animated.View>
  );
};

const Timeline = ({ data }) => {
  // Logic to determine current class would go here
  const now = new Date();
  const currentTime = `${now.getHours()}:${now.getMinutes()}`;

  return (
    <View style={styles.container}>
      {data.map((item, index) => (
        <TimelineItem
          key={item.id}
          item={item}
          isCurrent={item.start_time <= currentTime && item.end_time >= currentTime}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
  },
  item: {
    flexDirection: 'row',
    padding: 12,
    borderRadius: 16,
    marginBottom: 8,
    backgroundColor: COLORS.white,
    borderLeftWidth: 5,
    borderLeftColor: COLORS.lightGray,
  },
  currentItem: {
    backgroundColor: COLORS.primary,
    borderLeftColor: COLORS.accent,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 8,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
    width: 130,
  },
  timeText: {
    color: COLORS.gray,
    fontSize: 12,
    marginLeft: 6,
  },
  currentTimeText: {
    color: COLORS.white,
    fontWeight: 'bold',
  },
  detailsContainer: {
    flex: 1,
  },
  title: {
    color: COLORS.text,
    fontWeight: 'bold',
    fontSize: 15,
  },
  currentTitle: {
    color: COLORS.white,
  },
});

export default Timeline;
