import React from 'react';
import { StyleSheet, View } from 'react-native';

import { colors, palette, radius, spacing } from '../theme';
import { AppText } from './AppText';

export type StepState = 'done' | 'today' | 'future';

interface StepNodeProps {
  day: number;
  state: StepState;
  label?: string;
  isLast?: boolean;
}

/**
 * Yol uzerindeki bir gunluk basamak (README bolum 11 - Yol).
 * Yol ekraninda yalnizca yakin gunler net; uzak gelecek sisli ve atmosferiktir.
 */
export function StepNode({ day, state, label, isLast }: StepNodeProps) {
  return (
    <View style={styles.row}>
      <View style={styles.rail}>
        <View style={[styles.node, NODE_STYLE[state]]}>
          {state === 'done' ? (
            <AppText variant="bodyStrong" color={palette.white}>
              ✓
            </AppText>
          ) : (
            <AppText variant="caption" color={state === 'today' ? palette.white : colors.onSurfaceFaint}>
              {day}
            </AppText>
          )}
        </View>
        {!isLast && <View style={[styles.connector, state === 'done' && styles.connectorDone]} />}
      </View>
      <View style={styles.body}>
        <AppText
          variant={state === 'today' ? 'bodyStrong' : 'body'}
          color={state === 'future' ? colors.onSurfaceFaint : colors.onSurface}
        >
          {state === 'today' ? 'Bugün' : `Gün ${day}`}
        </AppText>
        {label ? (
          <AppText variant="caption" color={colors.onSurfaceMuted}>
            {label}
          </AppText>
        ) : null}
      </View>
    </View>
  );
}

const NODE_STYLE = StyleSheet.create({
  done: { backgroundColor: colors.success, borderColor: colors.success },
  today: { backgroundColor: colors.primary, borderColor: colors.primary },
  future: { backgroundColor: colors.surface, borderColor: colors.border, opacity: 0.7 },
});

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: spacing.md },
  rail: { alignItems: 'center' },
  node: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  connector: { width: 3, flex: 1, minHeight: 26, backgroundColor: colors.border, marginVertical: 2 },
  connectorDone: { backgroundColor: colors.success },
  body: { paddingVertical: spacing.sm, flex: 1 },
});
