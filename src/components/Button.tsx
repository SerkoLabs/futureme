import React from 'react';
import { ActivityIndicator, Pressable, StyleProp, StyleSheet, ViewStyle } from 'react-native';

import { colors, palette, radius, spacing } from '../theme';
import { useStore } from '../store/useStore';
import { AppText } from './AppText';
import { tapFeedback } from './haptics';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'success' | 'danger';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
  accessibilityHint?: string;
  accessibilityLabel?: string;
}

const BG: Record<ButtonVariant, string> = {
  primary: colors.primary,
  secondary: palette.brandTint,
  ghost: 'transparent',
  success: colors.success,
  danger: colors.danger,
};

const FG: Record<ButtonVariant, string> = {
  primary: colors.primaryText,
  secondary: colors.primary,
  ghost: colors.primary,
  success: palette.white,
  danger: palette.white,
};

export function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled,
  loading,
  fullWidth,
  style,
  accessibilityHint,
  accessibilityLabel,
}: ButtonProps) {
  const highContrast = useStore((state) => state.profile.accessibility.highContrast);
  const backgroundColor = highContrast && variant === 'primary' ? palette.night : BG[variant];
  const foregroundColor = highContrast && variant === 'ghost' ? palette.night : FG[variant];
  const handlePress = () => {
    if (disabled || loading) return;
    void tapFeedback(variant === 'success' ? 'medium' : 'light');
    onPress();
  };

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: !!disabled, busy: !!loading }}
      accessibilityHint={accessibilityHint}
      accessibilityLabel={accessibilityLabel ?? label}
      disabled={disabled || loading}
      hitSlop={4}
      onPress={handlePress}
      style={({ pressed }) => [
        styles.base,
        size === 'lg' ? styles.lg : styles.md,
        { backgroundColor },
        variant === 'ghost' && [styles.ghost, highContrast && styles.ghostContrast],
        fullWidth && styles.fullWidth,
        (disabled || loading) && styles.disabled,
        pressed && !disabled && styles.pressed,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={foregroundColor} />
      ) : (
        <AppText variant="bodyStrong" color={foregroundColor} center>
          {label}
        </AppText>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  md: { paddingVertical: spacing.md, paddingHorizontal: spacing.xl, minHeight: 48 },
  lg: { paddingVertical: spacing.lg, paddingHorizontal: spacing.xl, minHeight: 56 },
  ghost: { borderWidth: 1.5, borderColor: colors.primary },
  ghostContrast: { borderColor: palette.night },
  fullWidth: { alignSelf: 'stretch' },
  disabled: { opacity: 0.45 },
  pressed: { opacity: 0.85, transform: [{ scale: 0.98 }] },
});
