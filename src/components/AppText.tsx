import React from 'react';
import { StyleProp, Text, TextProps, TextStyle } from 'react-native';

import { colors, typography } from '../theme';
import { useStore } from '../store/useStore';

type Variant = keyof typeof typography;

interface AppTextProps extends TextProps {
  variant?: Variant;
  color?: string;
  center?: boolean;
  style?: StyleProp<TextStyle>;
}

/**
 * Tipografi belirtecine dayali metin ilkeli. Ekranlar dogrudan RN Text yerine
 * bunu kullanir; boylece olcek ve renk tek yerden gelir.
 */
export function AppText({
  variant = 'body',
  color = colors.onSurface,
  center,
  style,
  children,
  ...rest
}: AppTextProps) {
  const highContrast = useStore((state) => state.profile.accessibility.highContrast);
  const resolvedColor =
    highContrast && (color === colors.onSurfaceMuted || color === colors.onSurfaceFaint)
      ? colors.onSurface
      : color;
  return (
    <Text
      style={[
        typography[variant] as TextStyle,
        { color: resolvedColor },
        center && { textAlign: 'center' },
        style,
      ]}
      {...rest}
    >
      {children}
    </Text>
  );
}
