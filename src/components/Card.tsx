import React from 'react';
import { Pressable, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { colors, radius, shadow, spacing } from '../theme';
import { useStore } from '../store/useStore';

interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  padded?: boolean;
  tone?: 'surface' | 'muted';
  accessibilityLabel?: string;
}

/** Yumusak, hacimli ve dokunulabilir kart (README bolum 12). */
export function Card({
  children,
  onPress,
  style,
  padded = true,
  tone = 'surface',
  accessibilityLabel,
}: CardProps) {
  const highContrast = useStore((state) => state.profile.accessibility.highContrast);
  const content = (
    <View
      style={[
        styles.card,
        {
          backgroundColor: highContrast
            ? colors.surface
            : tone === 'surface'
              ? colors.surface
              : colors.surfaceMuted,
        },
        highContrast && styles.highContrast,
        padded && styles.padded,
        style,
      ]}
    >
      {children}
    </View>
  );

  if (!onPress) return content;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      style={({ pressed }) => pressed && styles.pressed}
    >
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    ...shadow.soft,
  },
  padded: { padding: spacing.lg },
  pressed: { opacity: 0.9, transform: [{ scale: 0.995 }] },
  highContrast: { borderWidth: 1.5, borderColor: colors.onSurface },
});
