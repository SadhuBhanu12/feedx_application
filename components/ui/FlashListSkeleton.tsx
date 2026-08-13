import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Skeleton } from './Skeleton';

interface FlashListSkeletonProps {
  count?: number;
  itemHeight?: number;
}

export const FlashListSkeleton = ({ count = 5, itemHeight = 100 }: FlashListSkeletonProps) => {
  return (
    <View style={styles.container}>
      {Array.from({ length: count }).map((_, index) => (
        <View key={index} style={styles.itemContainer}>
          <Skeleton.Card height={itemHeight} />
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 16,
  },
  itemContainer: {
    width: '100%',
  },
});
