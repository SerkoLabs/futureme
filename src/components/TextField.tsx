import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

import { colors, radius, spacing, typography } from '../theme';
import { useStore } from '../store/useStore';
import { AppText } from './AppText';

interface TextFieldProps {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  multiline?: boolean;
  helperText?: string;
  autoFocus?: boolean;
  accessibilityHint?: string;
}

/** Etiketli metin girisi (onboarding, gunluk, dusunce kaydi). */
export function TextField({
  label,
  value,
  onChangeText,
  placeholder,
  multiline,
  helperText,
  autoFocus,
  accessibilityHint,
}: TextFieldProps) {
  const highContrast = useStore((state) => state.profile.accessibility.highContrast);
  return (
    <View style={styles.wrap}>
      {label ? (
        <AppText variant="bodyStrong" style={styles.label}>
          {label}
        </AppText>
      ) : null}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.onSurfaceFaint}
        multiline={multiline}
        autoFocus={autoFocus}
        accessibilityLabel={label ?? placeholder ?? 'Metin alanı'}
        accessibilityHint={accessibilityHint ?? helperText}
        selectionColor={colors.primary}
        style={[styles.input, highContrast && styles.highContrast, multiline && styles.multiline]}
      />
      {helperText ? (
        <AppText variant="caption" color={colors.onSurfaceMuted}>
          {helperText}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.xs },
  label: {},
  input: {
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    color: colors.onSurface,
    fontSize: typography.body.fontSize,
    minHeight: 48,
  },
  multiline: { minHeight: 96, textAlignVertical: 'top', paddingTop: spacing.md },
  highContrast: { borderColor: colors.onSurface, borderWidth: 2 },
});
