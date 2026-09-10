import React from 'react';
import { StyleSheet, View } from 'react-native';

import { colors, spacing } from '../theme';
import { AppText } from './AppText';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  kicker?: string;
}

/** Bolum basligi: istege bagli ust etiket + baslik + alt aciklama. */
export function SectionHeader({ title, subtitle, kicker }: SectionHeaderProps) {
  return (
    <View style={styles.wrap}>
      {kicker ? (
        <AppText variant="label" color={colors.primary}>
          {kicker}
        </AppText>
      ) : null}
      <AppText variant="title">{title}</AppText>
      {subtitle ? (
        <AppText variant="body" color={colors.onSurfaceMuted}>
          {subtitle}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.xs },
});
