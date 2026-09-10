import React from 'react';
import { StyleSheet, View } from 'react-native';

import { TIER_LABEL } from '../domain';
import { colors, radius, spacing, tierColors } from '../theme';
import type { DailyGoal } from '../types';
import { AppText } from './AppText';
import { Button } from './Button';
import { Card } from './Card';

interface GoalCardProps {
  goal: DailyGoal;
  onComplete: () => void;
  onShrink?: () => void;
  disabled?: boolean;
}

/** Bugunun uc gorev kartindan biri (README bolum 5 ve 12). */
export function GoalCard({ goal, onComplete, onShrink, disabled }: GoalCardProps) {
  const accent = tierColors[goal.tier];
  return (
    <Card style={[styles.card, goal.completed && styles.done]}>
      <View style={styles.headerRow}>
        <View style={styles.tierRow}>
          <View style={[styles.dot, { backgroundColor: accent }]} />
          <AppText variant="label" color={accent}>
            {TIER_LABEL[goal.tier]}
          </AppText>
        </View>
        <View style={[styles.points, { backgroundColor: accent }]}>
          <AppText variant="caption" color={colors.surface}>
            +{goal.stagePoints} AŞAMA
          </AppText>
        </View>
      </View>

      <AppText variant="heading" style={styles.title}>
        {goal.title}
      </AppText>
      <AppText variant="body" color={colors.onSurfaceMuted}>
        {goal.completionCriteria}
        {goal.durationMinutes ? `  ·  ${goal.durationMinutes} dk` : ''}
      </AppText>

      {goal.completed ? (
        <View style={styles.completedRow}>
          <AppText variant="bodyStrong" color={colors.success}>
            ✓ Kanıt gönderildi
          </AppText>
        </View>
      ) : (
        <View style={styles.actions}>
          <Button
            label="Tamamladım"
            variant="success"
            onPress={onComplete}
            disabled={disabled}
            fullWidth
            accessibilityHint={`${goal.title} hedefini tamamlandı olarak işaretle`}
          />
          {onShrink ? (
            <Button
              label={`Kurtarma adımı: ${goal.minimumVersion}`}
              variant="ghost"
              size="md"
              onPress={onShrink}
              disabled={disabled}
              fullWidth
            />
          ) : null}
        </View>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: spacing.sm },
  done: { opacity: 0.75 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  tierRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  dot: { width: 10, height: 10, borderRadius: radius.pill },
  points: { paddingHorizontal: spacing.sm, paddingVertical: 3, borderRadius: radius.pill },
  title: { marginTop: spacing.xs },
  actions: { marginTop: spacing.md, gap: spacing.sm },
  completedRow: { marginTop: spacing.md },
});
