import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';

import {
  AppText,
  Button,
  Card,
  Chip,
  FutureSelfScene,
  Screen,
  SectionHeader,
} from '@/components';
import { TIER_LABEL } from '@/domain';
import { colors, spacing, tierColors } from '@/theme';
import type { EnergyLevel } from '@/types';
import { today, useStore } from '@/store/useStore';

const ENERGY: { level: EnergyLevel; label: string; emoji: string }[] = [
  { level: 'low', label: 'Düşük', emoji: '🌙' },
  { level: 'medium', label: 'Orta', emoji: '🌤️' },
  { level: 'high', label: 'Yüksek', emoji: '☀️' },
];

/**
 * Sabah deneyimi (README bolum 5 - Sabah). Once kisa bir gelecek sahnesi, enerji
 * isareti, sonra gunun uc hedefinin gelecekteki benlige gonderilmesi.
 */
export default function MorningScreen() {
  const router = useRouter();
  const date = today();

  const displayName = useStore((s) => s.profile.displayName);
  const plan = useStore((s) => s.plansByDate[date]);
  const startMorning = useStore((s) => s.startMorning);
  const setEnergy = useStore((s) => s.setEnergy);
  const shrinkGoal = useStore((s) => s.shrinkGoal);
  const commitPlan = useStore((s) => s.commitPlan);

  useEffect(() => {
    startMorning(date);
  }, [date, startMorning]);

  if (!plan) {
    return (
      <Screen scroll>
        <AppText variant="body">Hazırlanıyor...</AppText>
      </Screen>
    );
  }

  if (plan.sentToFutureSelf) {
    return (
      <Screen scroll>
        <FutureSelfScene
          name={displayName}
          message="Üç kanıtı aldım. Gün içinde tek dokunuşla tamamla; zorlanırsan kurtarma adımı hep burada."
        />
        <Button label="Yola dön" onPress={() => router.replace('/(tabs)/path')} fullWidth />
      </Screen>
    );
  }

  const footer = (
    <View style={styles.footer}>
      <Button
        label="Üç hedefi gelecekteki benliğime gönder"
        onPress={() => {
          commitPlan(date);
          router.replace('/(tabs)/path');
        }}
        size="lg"
        fullWidth
        disabled={!plan.energy}
        accessibilityHint="Günlük sözleşmeyi başlatır ve +1 AŞAMA kazandırır"
      />
      <AppText variant="caption" color={colors.onSurfaceMuted} center>
        {plan.energy
          ? 'Göndermek günlük sözleşmeni başlatır ve sana +1 AŞAMA, +10 XP kazandırır.'
          : 'Devam etmek için önce bugünkü enerji düzeyini seç.'}
      </AppText>
    </View>
  );

  return (
    <Screen scroll footer={footer}>
      <FutureSelfScene
        name={displayName}
        message="Günaydın. Bugün kusursuz olman gerekmiyor. Bana üç kanıt gönder: bir ana adım, bir destek adımı ve zor bir gün için en küçük adım."
      />

      <SectionHeader
        kicker="ENERJİ"
        title="Bugün bana nasıl yaklaşıyoruz?"
        subtitle="Enerjine göre hedefleri birlikte ölçekleyelim."
      />
      <View style={styles.energyRow}>
        {ENERGY.map((e) => (
          <Chip
            key={e.level}
            label={e.label}
            emoji={e.emoji}
            selected={plan.energy === e.level}
            onPress={() => setEnergy(date, e.level)}
          />
        ))}
      </View>

      <SectionHeader title="Bugünün üç köprüsü" subtitle="Küçült veya olduğu gibi kabul et." />
      {plan.goals.map((g) => (
        <Card key={g.id} style={styles.goal}>
          <View style={styles.goalHeader}>
            <View style={[styles.dot, { backgroundColor: tierColors[g.tier] }]} />
            <AppText variant="label" color={tierColors[g.tier]}>
              {TIER_LABEL[g.tier]}
            </AppText>
          </View>
          <AppText variant="bodyStrong">{g.title}</AppText>
          <AppText variant="caption" color={colors.onSurfaceMuted}>
            {g.completionCriteria}
            {g.durationMinutes ? `  ·  ${g.durationMinutes} dk` : ''}
          </AppText>
          <Button
            label={`Küçült: ${g.minimumVersion}`}
            variant="ghost"
            onPress={() => shrinkGoal(date, g.id)}
            fullWidth
            style={styles.shrink}
          />
        </Card>
      ))}

    </Screen>
  );
}

const styles = StyleSheet.create({
  energyRow: { flexDirection: 'row', gap: spacing.sm, flexWrap: 'wrap' },
  goal: { gap: spacing.xs },
  goalHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  dot: { width: 10, height: 10, borderRadius: 5 },
  shrink: { marginTop: spacing.sm },
  footer: { gap: spacing.sm },
});
