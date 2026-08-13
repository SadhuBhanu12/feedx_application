import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
  TextStyle,
  ScrollView,
} from 'react-native';
import { Feather } from '@expo/vector-icons';

export interface FormSelectProps {
  label?: string;
  required?: boolean;
  options: string[];
  selectedValue: string;
  onSelect: (value: string) => void;
  error?: string | null;
  containerStyle?: ViewStyle;
  labelStyle?: TextStyle;
}

export const FormSelect: React.FC<FormSelectProps> = ({
  label,
  required = false,
  options,
  selectedValue,
  onSelect,
  error,
  containerStyle,
  labelStyle,
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      {!!label && (
        <Text style={[styles.label, labelStyle]}>
          {label} {required && <Text style={styles.asterisk}>*</Text>}
        </Text>
      )}

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.optionsRow}
      >
        {options.map(opt => {
          const isSelected = selectedValue === opt;
          return (
            <TouchableOpacity
              key={opt}
              style={[
                styles.optionChip,
                isSelected && styles.optionChipActive,
                !!error && !selectedValue && styles.optionChipError,
              ]}
              onPress={() => onSelect(opt)}
            >
              <Text
                style={[
                  styles.optionText,
                  isSelected && styles.optionTextActive,
                ]}
              >
                {opt}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

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
  label: {
    fontSize: 11,
    fontWeight: '800',
    color: 'rgba(255, 255, 255, 0.6)',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  asterisk: {
    color: '#EF4444',
    fontWeight: 'bold',
  },
  optionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 2,
  },
  optionChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  optionChipActive: {
    backgroundColor: '#8B5CF6',
    borderColor: '#8B5CF6',
  },
  optionChipError: {
    borderColor: '#EF4444',
  },
  optionText: {
    fontSize: 12,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.6)',
  },
  optionTextActive: {
    color: '#FFFFFF',
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
