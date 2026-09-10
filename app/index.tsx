import { Redirect } from 'expo-router';
import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { AppText } from '@/components';
import { colors, palette } from '@/theme';
import { useStore } from '@/store/useStore';

/**
 * Giris kapisi: kalicilik yuklenene kadar bekler, sonra onboarding durumuna gore
 * yonlendirir. (README bolum 11 - Onboarding / Ana urun.)
 */
export default function Index() {
  const hydrated = useStore((s) => s.hydrated);
  const onboardingComplete = useStore((s) => s.onboardingComplete);

  if (!hydrated) {
    return (
      <View style={styles.splash}>
        <ActivityIndicator color={palette.brand} size="large" />
        <AppText variant="heading" color={palette.white} style={styles.title}>
          FutureMe
        </AppText>
        <AppText variant="body" color={palette.brandSoft} center>
          Gelecekteki benligin hazirlaniyor...
        </AppText>
      </View>
    );
  }

  return <Redirect href={onboardingComplete ? '/(tabs)/path' : '/onboarding'} />;
}

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    backgroundColor: colors.sceneTop,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    padding: 24,
  },
  title: { marginTop: 8 },
});
