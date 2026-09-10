import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import { Edge, SafeAreaView } from 'react-native-safe-area-context';

import { colors, spacing } from '../theme';
import { useStore } from '../store/useStore';

interface ScreenProps {
  children: React.ReactNode;
  footer?: React.ReactNode;
  scroll?: boolean;
  padded?: boolean;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  edges?: readonly Edge[];
  background?: string;
  footerStyle?: StyleProp<ViewStyle>;
}

/** Ekran cercevesi: guvenli alan + arka plan + istege bagli kaydirma. */
export function Screen({
  children,
  footer,
  scroll,
  padded = true,
  style,
  contentStyle,
  edges = ['top', 'bottom'],
  background,
  footerStyle,
}: ScreenProps) {
  const highContrast = useStore((state) => state.profile.accessibility.highContrast);
  const inner = padded ? styles.padded : undefined;
  const resolvedBackground = background ?? (highContrast ? colors.surface : colors.background);

  return (
    <SafeAreaView edges={edges} style={[styles.safe, { backgroundColor: resolvedBackground }, style]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}
      >
        {scroll ? (
          <ScrollView
            contentContainerStyle={[styles.scrollContent, inner, contentStyle]}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="interactive"
            automaticallyAdjustKeyboardInsets
          >
            {children}
          </ScrollView>
        ) : (
          <View style={[styles.flex, inner, contentStyle]}>{children}</View>
        )}
        {footer ? (
          <View
            style={[
              styles.footer,
              inner,
              { backgroundColor: resolvedBackground },
              highContrast && styles.footerContrast,
              footerStyle,
            ]}
          >
            {footer}
          </View>
        ) : null}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  flex: { flex: 1 },
  padded: { paddingHorizontal: spacing.lg },
  scrollContent: { paddingVertical: spacing.lg, paddingBottom: spacing.xxxl, gap: spacing.md },
  footer: {
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  footerContrast: { borderTopColor: colors.onSurface },
});
