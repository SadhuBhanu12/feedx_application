import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  ScrollView,
  TextInput,
  Alert,
  Linking,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SPACING } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';
import { supabase } from '@/lib/supabase';

interface Props {
  visible: boolean;
  onClose: () => void;
  project: {
    id: string;
    title: string;
    author_name?: string;
    author_email?: string;
    user_id?: string;
    college_name?: string;
    branch?: string;
    stage?: string;
    support_needed?: string;
    description?: string;
  } | null;
  currentUser: {
    id?: string;
    full_name?: string;
    roll_number?: string;
    email?: string;
    college_name?: string;
    branch?: string;
    year?: string;
  } | null;
}

export default function JoinProjectBottomSheet({ visible, onClose, project, currentUser }: Props) {
  const { colors, isDark } = useTheme();
  
  // Editable fields
  const [skills, setSkills] = useState('');
  const [portfolio, setPortfolio] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [driveLink, setDriveLink] = useState('');
  const [message, setMessage] = useState('I am interested in contributing to your project. Please let me know if we can connect.');
  
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!project) return null;

  const ownerName = project.author_name || 'Project Owner';

  const handleSendRequest = async () => {
    // Validation
    if (!message.trim()) {
      Alert.alert('Validation Error', 'Please write a message to the project owner.');
      return;
    }

    if (portfolio.trim() && !portfolio.toLowerCase().startsWith('http')) {
      Alert.alert('Validation Error', 'Please enter a valid portfolio URL (starting with http:// or https://).');
      return;
    }

    setSending(true);

    try {
      // 1. Resolve exact author email from project or user profile
      let targetEmail = project.author_email?.trim() || '';

      if (!targetEmail && project.user_id) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('email')
          .eq('id', project.user_id)
          .maybeSingle();

        if (profile?.email) {
          targetEmail = profile.email.trim();
        }
      }

      if (!targetEmail) {
        Alert.alert(
          'Contact Unavailable',
          "Unable to retrieve the project owner's contact email. Please ensure the author has registered their email.",
          [{ text: 'OK' }]
        );
        return;
      }

      // Create in-app notification for the project owner
      if (project.user_id) {
        await supabase.from('notifications').insert({
          user_id: project.user_id,
          title: '🤝 New Collaboration Request',
          message: `${currentUser?.full_name || 'A student'} is interested in collaborating on your project "${project.title}". Check your registered email.`,
          type: 'collaboration',
        });
      }

      // Try creating database log in collaboration_requests table (optional log table)
      try {
        await supabase.from('collaboration_requests').insert({
          project_id: project.id,
          project_owner_id: project.user_id,
          project_owner_email: targetEmail,
          requester_id: currentUser?.id || null,
          requester_name: currentUser?.full_name || '',
          requester_email: currentUser?.email || '',
          status: 'Pending',
        });
      } catch (dbErr) {
        // Table may not exist yet, skip silently
      }

      // Prepare Email Template Parameters
      const emailSubject = `Interested to Collaborate on Your Project – FEEDX Innovation Hub`;
      const emailBody = `Hello ${ownerName},

I found your project "${project.title}" on the FEEDX Innovation Hub and would love to collaborate with you.

My Details:
Name: ${currentUser?.full_name || ''}
FEEDX ID: ${currentUser?.roll_number || 'N/A'}
College: ${currentUser?.college_name || 'FEEDX Polytechnic'}
Branch: ${currentUser?.branch || ''}
Academic Year: ${currentUser?.year || ''}
Registered Email: ${currentUser?.email || ''}
Skills: ${skills || 'N/A'}
Portfolio/GitHub: ${portfolio || 'N/A'}
LinkedIn: ${linkedin || 'N/A'}
Google Drive Portfolio: ${driveLink || 'N/A'}

Message:
${message}

Thank you.

Regards,
${currentUser?.full_name || 'Student Innovator'}`;

      const mailtoUrl = `mailto:${targetEmail}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
      
      const supported = await Linking.canOpenURL(mailtoUrl);
      if (supported) {
        await Linking.openURL(mailtoUrl);
      } else {
        Alert.alert('Email Client Unavailable', 'We recorded the request in-app, but could not launch your default email client.');
      }

      // Show success screen
      setSuccess(true);
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to send collaboration request.');
    } finally {
      setSending(false);
    }
  };

  const handleCloseSuccess = () => {
    setSuccess(false);
    setSkills('');
    setPortfolio('');
    setLinkedin('');
    setDriveLink('');
    setMessage('I am interested in contributing to your project. Please let me know if we can connect.');
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={[styles.bottomSheetContainer, { backgroundColor: colors.background, borderColor: colors.border }]}>
          {/* Handle bar */}
          <View style={[styles.handleBar, { backgroundColor: colors.borderStrong }]} />

          {/* Header */}
          <View style={styles.header}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.title, { color: colors.textPrimary }]}>
                {success ? '🎉 Request Sent' : '🤝 Collaborate on Project'}
              </Text>
              <Text style={[styles.subtitle, { color: colors.textMuted }]} numberOfLines={1}>
                {project.title}
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={[styles.closeBtn, { backgroundColor: colors.inputBg }]}>
              <Feather name="x" size={20} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>

          {success ? (
            <View style={styles.successContainer}>
              <View style={styles.successIconWrap}>
                <Feather name="check-circle" size={54} color="#10B981" />
              </View>
              <Text style={[styles.successTitle, { color: colors.textPrimary }]}>Collaboration Request Ready</Text>
              <Text style={[styles.successText, { color: colors.textSecondary }]}>
                Your email has been prepared and addressed to the Project Owner. Please review and send it using your preferred email application.
              </Text>

              <TouchableOpacity style={styles.successBtn} onPress={handleCloseSuccess}>
                <LinearGradient colors={['#3B82F6', '#1D4ED8']} style={styles.successGradient}>
                  <Text style={styles.successBtnText}>Return to Community Projects</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity style={styles.secondarySuccessBtn} onPress={handleCloseSuccess}>
                <Text style={[styles.secondarySuccessBtnText, { color: colors.textSecondary }]}>Explore More Projects</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <ScrollView style={styles.scrollBody} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
              
              {/* Project Quick Details */}
              <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
                <Text style={[styles.cardSectionTitle, { color: colors.textMuted }]}>Project Info</Text>
                <Text style={[styles.projectName, { color: colors.textPrimary }]}>{project.title}</Text>
                <Text style={[styles.projectMeta, { color: colors.textSecondary }]}>
                  Owner: {ownerName} • {project.college_name || 'Polytechnic'}
                </Text>
                {project.stage && (
                  <View style={styles.stageTag}>
                    <Text style={styles.stageTagText}>{project.stage} Stage</Text>
                  </View>
                )}
              </View>

              {/* Logged-in Student Auto-fill Info */}
              <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
                <Text style={[styles.cardSectionTitle, { color: colors.textMuted }]}>Your Profile Details (Auto-filled)</Text>
                
                <View style={styles.profileRow}>
                  <Text style={[styles.profileLabel, { color: colors.textSecondary }]}>Name</Text>
                  <Text style={[styles.profileVal, { color: colors.textPrimary }]}>{currentUser?.full_name || 'N/A'}</Text>
                </View>
                <View style={styles.profileRow}>
                  <Text style={[styles.profileLabel, { color: colors.textSecondary }]}>FEEDX ID</Text>
                  <Text style={[styles.profileVal, { color: colors.textPrimary }]}>{currentUser?.roll_number || 'N/A'}</Text>
                </View>
                <View style={styles.profileRow}>
                  <Text style={[styles.profileLabel, { color: colors.textSecondary }]}>College</Text>
                  <Text style={[styles.profileVal, { color: colors.textPrimary }]} numberOfLines={1}>{currentUser?.college_name || 'N/A'}</Text>
                </View>
                <View style={styles.profileRow}>
                  <Text style={[styles.profileLabel, { color: colors.textSecondary }]}>Branch</Text>
                  <Text style={[styles.profileVal, { color: colors.textPrimary }]}>{currentUser?.branch || 'N/A'}</Text>
                </View>
                <View style={styles.profileRow}>
                  <Text style={[styles.profileLabel, { color: colors.textSecondary }]}>Year</Text>
                  <Text style={[styles.profileVal, { color: colors.textPrimary }]}>{currentUser?.year || 'N/A'}</Text>
                </View>
                <View style={styles.profileRow}>
                  <Text style={[styles.profileLabel, { color: colors.textSecondary }]}>Email</Text>
                  <Text style={[styles.profileVal, { color: colors.textPrimary }]}>{currentUser?.email || 'N/A'}</Text>
                </View>
              </View>

              {/* Editable Fields */}
              <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
                <Text style={[styles.cardSectionTitle, { color: colors.textMuted }]}>Add Collaboration Context</Text>

                <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Skills & Competencies</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.inputBg, borderColor: colors.inputBorder, color: colors.textPrimary }]}
                  placeholder="e.g. React Native, UI Design, Flutter"
                  placeholderTextColor={colors.inputPlaceholder}
                  value={skills}
                  onChangeText={setSkills}
                />

                <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Portfolio / GitHub Link (Optional)</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.inputBg, borderColor: colors.inputBorder, color: colors.textPrimary }]}
                  placeholder="https://github.com/username"
                  placeholderTextColor={colors.inputPlaceholder}
                  autoCapitalize="none"
                  value={portfolio}
                  onChangeText={setPortfolio}
                />

                <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>LinkedIn Profile (Optional)</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.inputBg, borderColor: colors.inputBorder, color: colors.textPrimary }]}
                  placeholder="https://linkedin.com/in/username"
                  placeholderTextColor={colors.inputPlaceholder}
                  autoCapitalize="none"
                  value={linkedin}
                  onChangeText={setLinkedin}
                />

                <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Google Drive Portfolio / Docs (Optional)</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.inputBg, borderColor: colors.inputBorder, color: colors.textPrimary }]}
                  placeholder="https://drive.google.com/..."
                  placeholderTextColor={colors.inputPlaceholder}
                  autoCapitalize="none"
                  value={driveLink}
                  onChangeText={setDriveLink}
                />

                <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Introduction Message *</Text>
                <TextInput
                  style={[styles.input, styles.textArea, { backgroundColor: colors.inputBg, borderColor: colors.inputBorder, color: colors.textPrimary }]}
                  placeholder="Tell the project owner why you want to join..."
                  placeholderTextColor={colors.inputPlaceholder}
                  multiline
                  numberOfLines={4}
                  value={message}
                  onChangeText={setMessage}
                />
              </View>

              <View style={{ height: 20 }} />
            </ScrollView>
          )}

          {!success && (
            <View style={[styles.footer, { borderTopColor: colors.border }]}>
              <TouchableOpacity
                style={styles.sendEmailCta}
                onPress={handleSendRequest}
                disabled={sending}
                activeOpacity={0.85}
              >
                <LinearGradient colors={['#3B82F6', '#1D4ED8']} style={styles.ctaGradient}>
                  {sending ? (
                    <ActivityIndicator size="small" color="#FFF" />
                  ) : (
                    <>
                      <Feather name="send" size={18} color="#FFF" style={{ marginRight: 8 }} />
                      <Text style={styles.ctaText}>Send Collaboration Request</Text>
                    </>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'flex-end',
  },
  bottomSheetContainer: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 12,
    paddingHorizontal: 20,
    maxHeight: '90%',
    borderWidth: 1,
  },
  handleBar: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollBody: {
    marginBottom: 12,
  },
  card: {
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    marginBottom: 16,
  },
  cardSectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  projectName: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 4,
  },
  projectMeta: {
    fontSize: 13,
    fontWeight: '500',
  },
  stageTag: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginTop: 8,
  },
  stageTagText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#3B82F6',
  },
  profileRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  profileLabel: {
    fontSize: 13,
    fontWeight: '500',
  },
  profileVal: {
    fontSize: 13,
    fontWeight: '700',
    maxWidth: '70%',
  },
  inputLabel: {
    fontSize: 12.5,
    fontWeight: '600',
    marginTop: 10,
    marginBottom: 6,
  },
  input: {
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 13.5,
    borderWidth: 1,
  },
  textArea: {
    height: 90,
    textAlignVertical: 'top',
  },
  footer: {
    paddingVertical: 16,
    borderTopWidth: 1,
  },
  sendEmailCta: {
    borderRadius: 14,
    overflow: 'hidden',
  },
  ctaGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
  },
  ctaText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '800',
  },
  successContainer: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 16,
  },
  successIconWrap: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: '900',
    marginBottom: 12,
    textAlign: 'center',
  },
  successText: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 28,
  },
  successBtn: {
    width: '100%',
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 12,
  },
  successGradient: {
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  successBtnText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '800',
  },
  secondarySuccessBtn: {
    paddingVertical: 10,
  },
  secondarySuccessBtnText: {
    fontSize: 13.5,
    fontWeight: '700',
  },
});
