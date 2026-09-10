import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { colors } from '@/theme';

/**
 * Kok yerlesim. Tum ekranlar ozel basliklarla geldigi icin sistem basligi kapalidir.
 * Sabah, aksam ve dusunce laboratuvari kart (modal) olarak sunulur.
 */
export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="onboarding/index" />
        <Stack.Screen name="morning" options={{ presentation: 'modal' }} />
        <Stack.Screen name="evening" options={{ presentation: 'modal' }} />
        <Stack.Screen name="thought-lab" options={{ presentation: 'modal' }} />
      </Stack>
    </SafeAreaProvider>
  );
}
