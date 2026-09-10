import React from 'react';
import { StyleSheet, View } from 'react-native';

import { colors, palette, radius, spacing } from '../theme';
import { AppText } from './AppText';
import { Button } from './Button';

interface SafetyBannerProps {
  title: string;
  message: string;
  resources: { label: string; value: string }[];
  onAcknowledge?: () => void;
}

/**
 * Kriz aninda oyun dili yerine gosterilen sakin guvenlik karti (README bolum 17).
 * Sistem bir kriz hizmeti gibi davranmaz; gercek yardim kaynaklarina yonlendirir.
 */
export function SafetyBanner({ title, message, resources, onAcknowledge }: SafetyBannerProps) {
  return (
    <View style={styles.card}>
      <AppText variant="heading" color={palette.white}>
        {title}
      </AppText>
      <AppText variant="body" color={palette.white} style={styles.message}>
        {message}
      </AppText>
      <View style={styles.resources}>
        {resources.map((r) => (
          <View key={r.label} style={styles.resourceRow}>
            <AppText variant="label" color={palette.brandSoft}>
              {r.label}
            </AppText>
            <AppText variant="bodyStrong" color={palette.white}>
              {r.value}
            </AppText>
          </View>
        ))}
      </View>
      {onAcknowledge ? (
        <Button label="Anladım, güvendeyim" variant="secondary" onPress={onAcknowledge} fullWidth />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.sceneTop,
    borderRadius: radius.xl,
    padding: spacing.xl,
    gap: spacing.md,
  },
  message: { lineHeight: 24 },
  resources: { gap: spacing.sm },
  resourceRow: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: radius.md,
    padding: spacing.md,
    gap: 2,
  },
});
