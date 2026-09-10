import React, { useEffect, useRef } from 'react';
import { Animated, DimensionValue, Easing, Modal, Pressable, StyleSheet, View } from 'react-native';

import { colors, palette, radius, spacing } from '../theme';
import type { GoalTier } from '../types';
import { AppText } from './AppText';
import { Button } from './Button';
import { successFeedback } from './haptics';

interface RewardOverlayProps {
  visible: boolean;
  tier: GoalTier | null;
  message?: string;
  onClose: () => void;
  reduceMotion?: boolean;
}

const TIER_META: Record<GoalTier, { emoji: string; title: string; color: string }> = {
  minimumEvidence: { emoji: '🌱', title: 'Küçük kanıt, büyük fark', color: colors.success },
  supportStep: { emoji: '✨', title: 'Destek adımı tamam', color: palette.sunrise },
  mainBridge: { emoji: '🎉', title: 'Ana köprüyü geçtin', color: palette.coral },
};

/**
 * Uc kademeli odul (README bolum 7). Odul siddeti davranisa gore yukselir;
 * her dokunusta ayni havai fisek gosterilmez. Kumar/kitlik mekanigi yoktur.
 */
export function RewardOverlay({ visible, tier, message, onClose, reduceMotion }: RewardOverlayProps) {
  const scale = useRef(new Animated.Value(0.8)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible && tier) {
      if (tier === 'mainBridge') void successFeedback();
      if (reduceMotion) {
        scale.setValue(1);
        opacity.setValue(1);
        return;
      }
      scale.setValue(0.8);
      opacity.setValue(0);
      Animated.parallel([
        Animated.spring(scale, { toValue: 1, useNativeDriver: true, friction: 6 }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 220,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, tier, reduceMotion, scale, opacity]);

  if (!tier) return null;
  const meta = TIER_META[tier];
  const showParticles = tier === 'mainBridge' && !reduceMotion;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        {showParticles && <Particles />}
        <Animated.View style={[styles.card, { opacity, transform: [{ scale }] }]}>
          <View style={[styles.badge, { backgroundColor: meta.color }]}>
            <AppText variant="display" color={palette.white}>
              {meta.emoji}
            </AppText>
          </View>
          <AppText variant="title" center style={styles.title}>
            {meta.title}
          </AppText>
          {message ? (
            <AppText variant="body" color={colors.onSurfaceMuted} center>
              {message}
            </AppText>
          ) : null}
          <Button label="Devam" onPress={onClose} fullWidth style={styles.button} />
        </Animated.View>
      </Pressable>
    </Modal>
  );
}

function Particles() {
  const dots = Array.from({ length: 10 });
  const colorsList = [palette.coral, palette.sunrise, palette.brand, palette.growth];
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {dots.map((_, i) => (
        <Particle key={i} index={i} color={colorsList[i % colorsList.length]} />
      ))}
    </View>
  );
}

function Particle({ index, color }: { index: number; color: string }) {
  const translateY = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 320,
        duration: 1400,
        delay: index * 60,
        easing: Easing.in(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 1400,
        delay: index * 60,
        useNativeDriver: true,
      }),
    ]).start();
  }, [index, translateY, opacity]);
  const left: DimensionValue = `${(index * 9 + 8) % 90}%`;
  return (
    <Animated.View
      style={[
        styles.particle,
        { left, backgroundColor: color, opacity, transform: [{ translateY }] },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(16,13,43,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.xl,
    alignItems: 'center',
    gap: spacing.md,
    alignSelf: 'stretch',
    maxWidth: 420,
  },
  badge: {
    width: 96,
    height: 96,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { marginTop: spacing.sm },
  button: { marginTop: spacing.sm, alignSelf: 'stretch' },
  particle: { position: 'absolute', top: 60, width: 12, height: 12, borderRadius: 6 },
});
