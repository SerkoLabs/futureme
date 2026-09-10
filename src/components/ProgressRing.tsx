import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

import { colors, palette } from '../theme';

interface ProgressRingProps {
  value: number; // mevcut ASAMA
  target: number; // hedef (1000)
  size?: number;
  strokeWidth?: number;
  children?: React.ReactNode; // ortadaki icerik
  color?: string;
  trackColor?: string;
}

/** 0-1000 ilerleme halkasi (README bolum 12 - ana ekran bilesimi). */
export function ProgressRing({
  value,
  target,
  size = 220,
  strokeWidth = 16,
  children,
  color = colors.primary,
  trackColor = palette.brandTint,
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = target > 0 ? Math.max(0, Math.min(1, value / target)) : 0;
  const dashoffset = circumference * (1 - pct);
  const center = size / 2;

  return (
    <View
      accessibilityRole="progressbar"
      accessibilityLabel="Aşama ilerlemesi"
      accessibilityValue={{ min: 0, max: target, now: Math.round(Math.max(0, value)) }}
      style={{ width: size, height: size }}
    >
      <Svg width={size} height={size}>
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={trackColor}
          strokeWidth={strokeWidth}
          fill="none"
        />
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={dashoffset}
          transform={`rotate(-90 ${center} ${center})`}
        />
      </Svg>
      <View style={[StyleSheet.absoluteFill, styles.center]}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { alignItems: 'center', justifyContent: 'center' },
});
