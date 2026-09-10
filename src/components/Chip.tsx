import React from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { colors, palette, radius, spacing } from '../theme';
import { useStore } from '../store/useStore';
import { AppText } from './AppText';
import { tapFeedback } from './haptics';

interface ChipProps {
  label: string;
  selected?: boolean;
  onPress: () => void;
  emoji?: string;
}

/** Secilebilir etiket (hedef alani, enerji, motivasyon dogrulama vb.). */
export function Chip({ label, selected, onPress, emoji }: ChipProps) {
  const highContrast = useStore((state) => state.profile.accessibility.highContrast);
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: !!selected }}
      accessibilityLabel={label}
      hitSlop={4}
      onPress={() => {
        void tapFeedback('light');
        onPress();
      }}
      style={[
        styles.chip,
        selected ? styles.selected : styles.unselected,
        highContrast && (selected ? styles.selectedContrast : styles.unselectedContrast),
      ]}
    >
      <AppText
        variant="bodyStrong"
        color={selected ? colors.primaryText : colors.onSurface}
      >
        {emoji ? `${emoji}  ` : ''}
        {label}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    minHeight: 48,
    justifyContent: 'center',
  },
  selected: { backgroundColor: colors.primary, borderColor: colors.primary },
  unselected: { backgroundColor: palette.white, borderColor: colors.border },
  selectedContrast: { backgroundColor: palette.night, borderColor: palette.night },
  unselectedContrast: { borderColor: palette.night },
});
