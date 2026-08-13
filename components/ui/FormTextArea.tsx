import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Feather } from '@expo/vector-icons';

export interface FormTextAreaProps extends TextInputProps {
  label?: string;
  required?: boolean;
  error?: string | null;
  min?: number;
  max?: number;
  showCharCount?: boolean;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  labelStyle?: TextStyle;
  height?: number;
}

export const FormTextArea: React.FC<FormTextAreaProps> = ({
  label,
  required = false,
  error,
  min,
  max,
  showCharCount = true,
  containerStyle,
  inputStyle,
  labelStyle,
  height = 100,
  value = '',
  onChangeText,
  ...props
}) => {
  const currentLength = (value || '').length;

  return (
    <View style={[styles.container, containerStyle]}>
      {!!label && (
        <View style={styles.labelRow}>
          <Text style={[styles.label, labelStyle]}>
            {label} {required && <Text style={styles.asterisk}>*</Text>}
          </Text>
          {showCharCount && max ? (
            <Text
              style={[
                styles.charCount,
                min && currentLength < min ? styles.charCountWarning : null,
                currentLength > max ? styles.charCountError : null,
              ]}
            >
              {currentLength}/{max} {min ? `(min ${min})` : ''}
            </Text>
          ) : null}
        </View>
      )}

      <View
        style={[
          styles.inputWrapper,
          { height },
          !!error && styles.inputErrorBorder,
        ]}
      >
        <TextInput
          style={[styles.input, inputStyle]}
          value={value}
          onChangeText={onChangeText}
          multiline
          textAlignVertical="top"
          placeholderTextColor="rgba(255, 255, 255, 0.3)"
          {...props}
        />
      </View>

      {!!error && (
        <View style={styles.errorRow}>
          <Feather name="alert-circle" size={12} color="#EF4444" style={styles.errorIcon} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 14,
    width: '100%',
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  label: {
    fontSize: 11,
    fontWeight: '800',
    color: 'rgba(255, 255, 255, 0.6)',
    letterSpacing: 0.5,
  },
  asterisk: {
    color: '#EF4444',
    fontWeight: 'bold',
  },
  charCount: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.4)',
    fontWeight: '600',
  },
  charCountWarning: {
    color: '#F59E0B',
  },
  charCountError: {
    color: '#EF4444',
  },
  inputWrapper: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    padding: 12,
  },
  inputErrorBorder: {
    borderColor: '#EF4444',
    backgroundColor: 'rgba(239, 68, 68, 0.05)',
  },
  input: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 13,
    lineHeight: 18,
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    paddingLeft: 2,
  },
  errorIcon: {
    marginRight: 4,
  },
  errorText: {
    fontSize: 11,
    color: '#EF4444',
    fontWeight: '700',
  },
});
