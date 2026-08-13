import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '@/constants/theme';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';

const GradientHeader = ({ title, subtitle }) => {
  const router = useRouter();

  return (
    <LinearGradient
      colors={['#4F46E5', '#3B82F6']}
      style={styles.header}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <TouchableOpacity 
          style={styles.headerLeft} 
          onPress={() => router.push('/about-feedx')}
          activeOpacity={0.8}
        >
          <Image source={require('../../assets/images/icon.png')} style={styles.logoHeader} contentFit="contain" />
        </TouchableOpacity>
        <View>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerLeft: {
    width: 48,
    height: 48,
    marginRight: 12,
  },
  logoHeader: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.white,
    opacity: 0.8,
  },
});

export default GradientHeader;
