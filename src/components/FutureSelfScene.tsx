import React from 'react';
import { StyleSheet, View } from 'react-native';

import { colors, palette, radius, spacing } from '../theme';
import { AppText } from './AppText';

interface FutureSelfSceneProps {
  message: string;
  name?: string;
  compact?: boolean;
  generated?: boolean;
}

/**
 * Sinematik ust alan: gelecekteki benligin kisa sahnesi (README bolum 12).
 * Dikey dilimde guvenli bir stilize avatar yeterlidir; uretilen her gorselde
 * "AI ile olusturuldu" bilgisi erisilebilir bicimde bulunur (README bolum 8).
 */
export function FutureSelfScene({ message, name, compact, generated = false }: FutureSelfSceneProps) {
  const initial = (name?.trim()?.[0] ?? '+').toLocaleUpperCase('tr-TR');
  return (
    <View style={[styles.scene, compact && styles.compact]}>
      {/* atmosferik isik lekeleri */}
      <View style={[styles.glow, styles.glowA]} />
      <View style={[styles.glow, styles.glowB]} />

      <View style={styles.avatarWrap}>
        <View style={styles.avatarGlow} />
        <View style={styles.avatar}>
          <AppText variant="title" color={palette.white}>
            {initial}
          </AppText>
        </View>
        <View style={styles.aiTag}>
          <AppText variant="label" color={palette.white}>
            {generated ? 'Yapay zekâ ile oluşturuldu' : 'Stilize önizleme'}
          </AppText>
        </View>
      </View>

      {!compact && (
        <AppText variant="caption" color={palette.brandSoft} style={styles.kicker}>
          GELECEKTEKİ BEN
        </AppText>
      )}
      <AppText variant={compact ? 'body' : 'heading'} color={colors.onScene} style={styles.message}>
        {message}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  scene: {
    backgroundColor: colors.sceneTop,
    borderRadius: radius.xl,
    padding: spacing.xl,
    overflow: 'hidden',
    gap: spacing.sm,
  },
  compact: { padding: spacing.lg },
  glow: { position: 'absolute', borderRadius: radius.pill, opacity: 0.5 },
  glowA: {
    width: 220,
    height: 220,
    backgroundColor: palette.brand,
    top: -90,
    right: -60,
    opacity: 0.35,
  },
  glowB: {
    width: 160,
    height: 160,
    backgroundColor: palette.coral,
    bottom: -70,
    left: -40,
    opacity: 0.2,
  },
  avatarWrap: { alignItems: 'center', marginBottom: spacing.sm },
  avatarGlow: {
    position: 'absolute',
    width: 96,
    height: 96,
    borderRadius: radius.pill,
    backgroundColor: palette.brand,
    opacity: 0.4,
    top: -4,
  },
  avatar: {
    width: 84,
    height: 84,
    borderRadius: radius.pill,
    backgroundColor: palette.nightSoft,
    borderWidth: 2,
    borderColor: palette.brandSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiTag: {
    marginTop: spacing.sm,
    backgroundColor: 'rgba(255,255,255,0.14)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.pill,
  },
  kicker: { letterSpacing: 1 },
  message: { lineHeight: 26 },
});
