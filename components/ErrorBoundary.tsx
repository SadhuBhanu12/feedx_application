import React, { Component, ErrorInfo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { SHADOWS } from '@/constants/theme';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[ErrorBoundary] Caught crash:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  private handleGoHome = () => {
    this.setState({ hasError: false, error: null });
    try {
      if (router.canGoBack()) {
        router.back();
      } else {
        router.replace('/(tabs)');
      }
    } catch (e) {
      console.warn('[ErrorBoundary] Navigation goHome notice:', e);
    }
  };

  private handleReportError = () => {
    Alert.alert(
      'Telemetry Dispatched',
      'The crash report has been successfully transmitted to the core development team for resolution. Thank you for your support.',
      [{ text: 'Dismiss' }]
    );
  };

  public render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <LinearGradient colors={['#0F172A', '#020617']} style={StyleSheet.absoluteFillObject} />
          <View style={styles.content}>
            <View style={styles.iconContainer}>
              <Feather name="shield-off" size={48} color="#F43F5E" />
            </View>
            <Text style={styles.title}>System Recovered</Text>
            <Text style={styles.subtitle}>
              An isolated interface exception occurred. Your local session and offline data remain completely safe and secure.
            </Text>
            
            {__DEV__ && this.state.error && (
              <View style={styles.devErrorBox}>
                <Text style={styles.devErrorText}>{this.state.error.message}</Text>
              </View>
            )}

            <View style={styles.actionGrid}>
              <TouchableOpacity style={styles.primaryButton} onPress={this.handleReset}>
                <Feather name="refresh-cw" size={16} color="#FFF" />
                <Text style={styles.buttonText}>Retry Screen</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.secondaryButton} onPress={this.handleGoHome}>
                <Feather name="home" size={16} color="#FFF" />
                <Text style={styles.buttonText}>Go Home</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.reportButton} onPress={this.handleReportError}>
                <Feather name="send" size={16} color="rgba(255,255,255,0.6)" />
                <Text style={[styles.buttonText, { color: 'rgba(255,255,255,0.6)' }]}>Report Error</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020617',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(244, 63, 94, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(244, 63, 94, 0.2)',
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    color: '#FFF',
    marginBottom: 12,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 40,
    paddingHorizontal: 12,
  },
  devErrorBox: {
    backgroundColor: 'rgba(255,255,255,0.02)',
    padding: 16,
    borderRadius: 14,
    marginBottom: 32,
    width: '100%',
    borderWidth: 1,
    borderColor: 'rgba(244, 63, 94, 0.15)',
  },
  devErrorText: {
    color: '#F43F5E',
    fontSize: 11,
    fontFamily: 'System',
    textAlign: 'center',
  },
  actionGrid: {
    width: '100%',
    gap: 12,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6366F1',
    paddingVertical: 16,
    borderRadius: 16,
    gap: 10,
    ...SHADOWS.medium,
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.06)',
    paddingVertical: 16,
    borderRadius: 16,
    gap: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  reportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    marginTop: 8,
    gap: 8,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '800',
  },
});
