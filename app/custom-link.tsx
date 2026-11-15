import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  Linking,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { COLORS } from '@/constants/theme';

export default function CustomLinkScreen() {
  const router = useRouter();
  const [label, setLabel] = useState('');
  const [url, setUrl] = useState('');

  const handleLaunch = () => {
    let cleanUrl = url.trim();
    if (!cleanUrl) {
      Alert.alert('Validation Error', 'Please enter a URL.');
      return;
    }

    // Auto prepend http:// if missing
    if (!/^https?:\/\//i.test(cleanUrl)) {
      cleanUrl = `https://${cleanUrl}`;
    }

    Linking.canOpenURL(cleanUrl).then((supported) => {
      if (supported) {
        Linking.openURL(cleanUrl);
      } else {
        Alert.alert('Invalid URL', 'This URL format cannot be opened. Make sure it is valid.');
      }
    }).catch(() => {
      Alert.alert('Error', 'Unable to resolve the provided URL.');
    });
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#0F172A', '#020617']} style={StyleSheet.absoluteFill} />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Feather name="arrow-left" size={22} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Custom Link</Text>
        <View style={{ width: 44 }} />
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>PLATFORM NAME</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. My Website, GitHub, Slack"
          placeholderTextColor="rgba(255,255,255,0.25)"
          value={label}
          onChangeText={setLabel}
        />

        <Text style={[styles.label, { marginTop: 20 }]}>URL ADDRESS</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. github.com/username"
          placeholderTextColor="rgba(255,255,255,0.25)"
          value={url}
          onChangeText={setUrl}
          autoCapitalize="none"
          keyboardType="url"
        />

        <TouchableOpacity style={styles.launchBtn} onPress={handleLaunch} activeOpacity={0.85}>
          <LinearGradient colors={COLORS.gradientPrimary} style={styles.btnGradient}>
            <Feather name="external-link" size={16} color="#FFF" style={{ marginRight: 8 }} />
            <Text style={styles.btnText}>Open Link</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020617' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: { fontSize: 20, fontWeight: '800', color: '#FFF' },
  card: {
    backgroundColor: 'rgba(255,255,255,0.02)',
    marginHorizontal: 24,
    padding: 24,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  label: {
    fontSize: 10,
    fontWeight: '900',
    color: COLORS.primary,
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 50,
    color: '#FFF',
    fontSize: 15,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  launchBtn: {
    height: 50,
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 30,
  },
  btnGradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: { color: '#FFF', fontWeight: '800', fontSize: 15 },
});
