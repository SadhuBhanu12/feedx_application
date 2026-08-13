import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import CertificateModal from '@/components/ui/CertificateModal';
import { useUser } from '@/context/UserContext';

export default function CertificateViewScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ type?: string; studentName?: string; id?: string }>();
  const { user } = useUser();

  const certType = params.type || 'verified_learner';
  const name = params.studentName || user?.full_name || 'BHANU PRAKASH';
  const certId = params.id;

  return (
    <CertificateModal
      visible={true}
      onClose={() => router.back()}
      certificateType={certType}
      studentName={name}
      certificateId={certId}
    />
  );
}
