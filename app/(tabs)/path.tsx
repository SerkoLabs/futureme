import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import {
  AppText,
  Button,
  Card,
  FutureSelfScene,
  GoalCard,
  ProgressRing,
  RewardOverlay,
  SafetyBanner,
  Screen,
  StepNode,
} from '@/components';
import type { StepState } from '@/components';
import { FUTURE_SELF } from '@/data/seed';
import { computeBalance, daysBetween } from '@/domain';
import { colors, palette, spacing } from '@/theme';
import type { GoalTier } from '@/types';
import { today, useStore } from '@/store/useStore';

/**
 * Yol ekrani - gunluk ana dongu (README bolum 5, 11, 12).
 * Uc hedef, 0-1000 ilerleme halkasi, seriler ve yakin gunlerin rotasi.
 */
export default function PathScreen() {
  const router = useRouter();
  const date = today();

  const journey = useStore((s) => s.journey);
  const ledger = useStore((s) => s.ledger);
  const streaks = useStore((s) => s.streaks);
  const plan = useStore((s) => s.plansByDate[date]);
  const safety = useStore((s) => s.safety);
  const displayName = useStore((s) => s.profile.displayName);
  const reduceMotion = useStore((s) => s.profile.accessibility.reduceMotion);
  const completeGoal = useStore((s) => s.completeGoal);
  const shrinkGoal = useStore((s) => s.shrinkGoal);
  const acknowledgeSafety = useStore((s) => s.acknowledgeSafety);

  const balance = useMemo(() => computeBalance(ledger), [ledger]);
  const [rewardTier, setRewardTier] = useState<GoalTier | null>(null);

  if (!journey) {
    return (
      <Screen scroll>
        <AppText variant="body">Yolculuk bulunamadı.</AppText>
      </Screen>
    );
  }

  if (safety.suspended) {
    return (
      <Screen scroll>
        <SafetyBanner
          title={safety.title}
          message={safety.message}
          resources={safety.resources}
          onAcknowledge={acknowledgeSafety}
        />
      </Screen>
    );
  }

  const dayIndex = daysBetween(journey.startDate, date) + 1;
  const committed = plan?.sentToFutureSelf;
  const allDone = !!plan && plan.goals.length > 0 && plan.goals.every((g) => g.completed);
  const morningMsg = FUTURE_SELF.morning(displayName || undefined);

  const onComplete = (goalId: string, tier: GoalTier) => {
    completeGoal(date, goalId);
    setRewardTier(tier);
  };

  return (
    <Screen scroll>
      <FutureSelfScene
        compact
        name={displayName}
        message={
          committed
            ? 'Bugün bana üç kanıt gönderdin. Adım adım, konuştuğumuz ihtimale yaklaşıyoruz.'
            : morningMsg
        }
      />

      {/* Ilerleme halkasi */}
      <Card style={styles.progressCard}>
        <ProgressRing value={balance.stage} target={journey.stageTarget}>
          <AppText variant="display" color={colors.primary}>
            {balance.stage}
          </AppText>
          <AppText variant="caption" color={colors.onSurfaceMuted}>
            / {journey.stageTarget} AŞAMA
          </AppText>
          <AppText variant="caption" color={palette.sunrise}>
            {balance.xp} XP
          </AppText>
        </ProgressRing>
        <View style={styles.streakRow}>
          <StreakPill label="Bağ Serisi" value={streaks.bond.count} />
          <StreakPill label="Kanıt Serisi" value={streaks.evidence.count} />
        </View>
      </Card>

      {/* Bugunun Uclusu ya da sabaha davet */}
      {committed && plan ? (
        <View style={styles.section}>
          <AppText variant="heading">Bugünün Üçlüsü</AppText>
          {plan.goals.map((g) => (
            <GoalCard
              key={g.id}
              goal={g}
              onComplete={() => onComplete(g.id, g.tier)}
              onShrink={g.completed ? undefined : () => shrinkGoal(date, g.id)}
            />
          ))}
          {allDone ? (
            <Button
              label="Günü kapat: Ayna zamanı"
              onPress={() => router.push('/evening')}
              fullWidth
            />
          ) : null}
        </View>
      ) : (
        <Card style={styles.section}>
          <AppText variant="heading">Bugüne başlayalım mı?</AppText>
          <AppText variant="body" color={colors.onSurfaceMuted}>
            Önce kısa bir gelecek sahnesi, sonra bugünün üç küçük hedefini gelecekteki
            benliğine gönderiyorsun.
          </AppText>
          <Button label="Sabah deneyimine başla" onPress={() => router.push('/morning')} fullWidth />
        </Card>
      )}

      {/* Yol onizleme - yalnizca yakin gunler net (README bolum 11) */}
      <View style={styles.section}>
        <AppText variant="heading">Yol</AppText>
        <Card>
          {buildPathSteps(dayIndex).map((step, i, arr) => (
            <StepNode
              key={step.day}
              day={step.day}
              state={step.state}
              isLast={i === arr.length - 1}
            />
          ))}
        </Card>
      </View>

      <RewardOverlay
        visible={rewardTier !== null}
        tier={rewardTier}
        message={rewardTier ? FUTURE_SELF.onComplete(rewardTier) : undefined}
        reduceMotion={reduceMotion}
        onClose={() => setRewardTier(null)}
      />
    </Screen>
  );
}

function StreakPill({ label, value }: { label: string; value: number }) {
  return (
    <View style={styles.pill}>
      <AppText variant="title" color={colors.primary}>
        {value}
      </AppText>
      <AppText variant="caption" color={colors.onSurfaceMuted}>
        {label}
      </AppText>
    </View>
  );
}

/** Bugunu merkeze alan kisa bir gun penceresi uretir. */
function buildPathSteps(dayIndex: number): { day: number; state: StepState }[] {
  const start = Math.max(1, dayIndex - 1);
  const steps: { day: number; state: StepState }[] = [];
  for (let d = start; d < start + 6; d += 1) {
    const state: StepState = d < dayIndex ? 'done' : d === dayIndex ? 'today' : 'future';
    steps.push({ day: d, state });
  }
  return steps;
}

const styles = StyleSheet.create({
  progressCard: { alignItems: 'center', gap: spacing.lg },
  streakRow: { flexDirection: 'row', gap: spacing.md, alignSelf: 'stretch' },
  pill: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.surfaceMuted,
    borderRadius: 16,
    paddingVertical: spacing.md,
  },
  section: { gap: spacing.md, marginTop: spacing.sm },
});
