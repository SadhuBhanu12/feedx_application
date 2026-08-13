import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ActivityIndicator, 
  Dimensions, 
  Platform, 
  TextInput,
  KeyboardAvoidingView
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Feather } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { BlurView } from 'expo-blur';
import { verifyEventRegistrationQR, verifyQrAttendance } from '@/services/supabaseService';
import { useUser } from '@/context/UserContext';

const { width } = Dimensions.get('window');

// Class Error Boundary to catch any Camera initialization / native rendering crashes gracefully
class CameraErrorBoundary extends React.Component<{ children: React.ReactNode; fallback: React.ReactNode }, { hasError: boolean }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.warn('[CameraScanner] Camera crashed gracefully caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

export default function QRScannerScreen() {
  const router = useRouter();
  const { eventId } = useLocalSearchParams();
  const { user } = useUser();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [mode, setMode] = useState<'camera' | 'manual'>('camera');
  const [manualCode, setManualCode] = useState('');
  const [cameraError, setCameraError] = useState(false);

  useEffect(() => {
    if (Platform.OS === 'web') {
      // On web, default to manual verification fallback if camera has permissions issues
      setMode('manual');
    } else if (!permission?.granted) {
      requestPermission();
    }
  }, [permission]);

  const processQrVerification = async (token: string) => {
    setScanned(true);
    setLoading(true);
    try {
      if (!token || token.trim().length === 0) {
        throw new Error('Please enter or scan a valid QR ticket code.');
      }
      
      const cleanToken = token.trim();
      let response: any;

      try {
        response = await verifyEventRegistrationQR(cleanToken, user);
      } catch (e1) {
        response = await verifyQrAttendance(cleanToken, user?.id);
      }
      
      const studentName = response?.student?.full_name || response?.studentName || response?.registration?.students?.full_name || 'Student';
      const rollNum = response?.student?.roll_number || response?.rollNumber || response?.registration?.students?.roll_number || 'N/A';
      const eventTitle = response?.event?.title || response?.eventTitle || response?.registration?.events?.title || 'Event';
      const msg = response?.message || `Verified successfully!\n\nStudent: ${studentName}\nRoll: ${rollNum}\nEvent: ${eventTitle}`;

      setResult({
        success: response?.status !== 'ALREADY_CHECKED_IN',
        message: msg
      });
    } catch (err: any) {
      setResult({ success: false, message: err.message || 'Verification failed. Please check the ticket QR code.' });
    } finally {
      setLoading(false);
    }
  };

  const handleBarCodeScanned = ({ type, data }: any) => {
    if (scanned || loading) return;
    processQrVerification(data);
  };

  const handleManualSubmit = () => {
    if (!manualCode.trim()) return;
    processQrVerification(manualCode);
  };

  const renderManualView = () => (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={styles.manualContainer}
    >
      <View style={styles.manualCard}>
        <View style={styles.iconCircle}>
          <Feather name="shield" size={40} color="#3B82F6" />
        </View>
        <Text style={styles.manualTitle}>Manual Ticket Check-in</Text>
        <Text style={styles.manualDesc}>Enter the student&apos;s QR Token, FeedX ID, or Registration Number manually below:</Text>
        
        <TextInput
          style={styles.input}
          placeholder="e.g. REG-10293 or QR Token..."
          placeholderTextColor="rgba(255,255,255,0.4)"
          value={manualCode}
          onChangeText={setManualCode}
          autoCapitalize="none"
          autoCorrect={false}
        />

        <TouchableOpacity 
          style={[styles.actionBtn, { opacity: loading || !manualCode.trim() ? 0.6 : 1 }]} 
          onPress={handleManualSubmit}
          disabled={loading || !manualCode.trim()}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.actionBtnText}>Verify Ticket Now</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );

  return (
    <View style={styles.container}>
      {/* Top Header Navigation */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="x" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Scan Ticket QR</Text>
        <TouchableOpacity 
          onPress={() => setMode(mode === 'camera' ? 'manual' : 'camera')} 
          style={styles.modeToggleBtn}
        >
          <Feather name={mode === 'camera' ? 'edit-3' : 'camera'} size={18} color="#FFF" />
        </TouchableOpacity>
      </View>

      {/* Main Body: Camera or Manual */}
      {mode === 'manual' || cameraError || Platform.OS === 'web' ? (
        renderManualView()
      ) : (
        <CameraErrorBoundary fallback={renderManualView()}>
          {!permission?.granted ? (
            <View style={styles.permissionContainer}>
              <Feather name="camera-off" size={48} color="#94A3B8" style={{ marginBottom: 16 }} />
              <Text style={styles.text}>Camera access is required to scan tickets.</Text>
              <TouchableOpacity style={styles.btn} onPress={requestPermission}>
                <Text style={styles.btnText}>Grant Camera Permission</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.btn, { backgroundColor: 'rgba(255,255,255,0.1)', marginTop: 12 }]} 
                onPress={() => setMode('manual')}
              >
                <Text style={styles.btnText}>Use Manual Code Input</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={StyleSheet.absoluteFillObject}>
              <CameraView 
                style={StyleSheet.absoluteFillObject} 
                facing="back"
                onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
                barcodeScannerSettings={{
                  barcodeTypes: ['qr'],
                }}
              />
              
              {/* Scanner Frame Box */}
              <View style={styles.scannerBody}>
                {!scanned && (
                  <View style={styles.scannerFrame}>
                    <View style={styles.frameCornerTopLeft} />
                    <View style={styles.frameCornerTopRight} />
                    <View style={styles.frameCornerBottomLeft} />
                    <View style={styles.frameCornerBottomRight} />
                    <View style={styles.scannerLine} />
                  </View>
                )}
              </View>
            </View>
          )}
        </CameraErrorBoundary>
      )}

      {/* Result Modal / Blur Overlay */}
      {scanned && (
        <BlurView intensity={90} tint="dark" style={styles.resultContainer}>
          {loading ? (
            <View style={styles.resultBox}>
              <ActivityIndicator size="large" color="#3B82F6" />
              <Text style={styles.resultText}>Verifying ticket in database...</Text>
            </View>
          ) : (
            <View style={[styles.resultBox, { borderColor: result?.success ? '#10B981' : '#EF4444' }]}>
              <Feather 
                name={result?.success ? 'check-circle' : 'x-circle'} 
                size={64} 
                color={result?.success ? '#10B981' : '#EF4444'} 
                style={{ marginBottom: 16 }}
              />
              <Text style={styles.resultTitle}>
                {result?.success ? 'Access Granted' : 'Verification Status'}
              </Text>
              <Text style={styles.resultMessage}>{result?.message}</Text>
              
              <TouchableOpacity 
                style={[styles.nextBtn, { backgroundColor: result?.success ? '#10B981' : '#EF4444' }]} 
                onPress={() => {
                  setResult(null);
                  setScanned(false);
                  setManualCode('');
                }}
              >
                <Text style={styles.nextBtnText}>Scan / Verify Next Ticket</Text>
              </TouchableOpacity>
            </View>
          )}
        </BlurView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B0F19' },
  text: { color: '#94A3B8', textAlign: 'center', marginBottom: 20, fontSize: 15, paddingHorizontal: 20 },
  btn: { backgroundColor: '#3B82F6', paddingHorizontal: 24, paddingVertical: 14, borderRadius: 14, alignItems: 'center' },
  btnText: { color: '#FFF', textAlign: 'center', fontWeight: '700', fontSize: 15 },
  
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingHorizontal: 20, 
    paddingTop: Platform.OS === 'ios' ? 60 : 44, 
    paddingBottom: 16,
    zIndex: 30,
    backgroundColor: 'rgba(11, 15, 25, 0.8)'
  },
  backBtn: { width: 42, height: 42, borderRadius: 21, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 16, fontWeight: '800', color: '#FFF' },
  modeToggleBtn: { width: 42, height: 42, borderRadius: 21, backgroundColor: 'rgba(59, 130, 246, 0.2)', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#3B82F6' },
  
  permissionContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },

  manualContainer: { flex: 1, justifyContent: 'center', padding: 20 },
  manualCard: { backgroundColor: '#1E293B', borderRadius: 24, padding: 28, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  iconCircle: { width: 72, height: 72, borderRadius: 36, backgroundColor: 'rgba(59, 130, 246, 0.1)', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  manualTitle: { fontSize: 20, fontWeight: '800', color: '#FFF', marginBottom: 8 },
  manualDesc: { fontSize: 14, color: '#94A3B8', textAlign: 'center', marginBottom: 24, lineHeight: 20 },
  input: { width: '100%', backgroundColor: '#0B0F19', borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)', borderRadius: 14, padding: 16, color: '#FFF', fontSize: 15, marginBottom: 20 },
  actionBtn: { width: '100%', backgroundColor: '#3B82F6', paddingVertical: 16, borderRadius: 14, alignItems: 'center' },
  actionBtnText: { color: '#FFF', fontWeight: '800', fontSize: 16 },

  scannerBody: { flex: 1, justifyContent: 'center', alignItems: 'center', zIndex: 5 },
  scannerFrame: { width: width * 0.68, height: width * 0.68, position: 'relative' },
  frameCornerTopLeft: { position: 'absolute', top: 0, left: 0, width: 35, height: 35, borderColor: '#10B981', borderTopWidth: 4, borderLeftWidth: 4, borderTopLeftRadius: 16 },
  frameCornerTopRight: { position: 'absolute', top: 0, right: 0, width: 35, height: 35, borderColor: '#10B981', borderTopWidth: 4, borderRightWidth: 4, borderTopRightRadius: 16 },
  frameCornerBottomLeft: { position: 'absolute', bottom: 0, left: 0, width: 35, height: 35, borderColor: '#10B981', borderBottomWidth: 4, borderLeftWidth: 4, borderBottomLeftRadius: 16 },
  frameCornerBottomRight: { position: 'absolute', bottom: 0, right: 0, width: 35, height: 35, borderColor: '#10B981', borderBottomWidth: 4, borderRightWidth: 4, borderBottomRightRadius: 16 },
  scannerLine: { width: '90%', height: 2, backgroundColor: '#10B981', position: 'absolute', top: '50%', alignSelf: 'center' },

  resultContainer: { ...StyleSheet.absoluteFillObject, justifyContent: 'center', alignItems: 'center', padding: 20, zIndex: 50 },
  resultBox: { width: '100%', backgroundColor: 'rgba(15, 23, 42, 0.96)', padding: 28, borderRadius: 28, alignItems: 'center', borderWidth: 2, borderColor: 'rgba(255,255,255,0.1)' },
  resultTitle: { fontSize: 22, fontWeight: '900', color: '#FFF', marginBottom: 8 },
  resultMessage: { fontSize: 14, color: 'rgba(255,255,255,0.8)', textAlign: 'center', marginBottom: 24, lineHeight: 22 },
  resultText: { color: '#FFF', marginTop: 16, fontSize: 16, fontWeight: '600' },
  
  nextBtn: { width: '100%', padding: 16, borderRadius: 14, alignItems: 'center' },
  nextBtnText: { color: '#FFF', fontSize: 15, fontWeight: '800' }
});
