import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';

/**
 * Web'de ve hareket/ses tercihleri disinda guvenli titresim.
 * Odul siddeti davranisa gore yukselir (README bolum 7).
 */
export async function tapFeedback(intensity: 'light' | 'medium' | 'heavy' = 'light') {
  if (Platform.OS === 'web') return;
  try {
    const map = {
      light: Haptics.ImpactFeedbackStyle.Light,
      medium: Haptics.ImpactFeedbackStyle.Medium,
      heavy: Haptics.ImpactFeedbackStyle.Heavy,
    } as const;
    await Haptics.impactAsync(map[intensity]);
  } catch {
    // titresim desteklenmiyorsa sessizce gec
  }
}

export async function successFeedback() {
  if (Platform.OS === 'web') return;
  try {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  } catch {
    // yoksay
  }
}
