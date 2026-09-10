import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import {
  AppText,
  Button,
  Card,
  FutureSelfScene,
  Screen,
  SectionHeader,
  TextField,
} from '@/components';
import { FUTURE_SELF } from '@/data/seed';
import { TIER_LABEL } from '@/domain';
import { colors, spacing, tierColors } from '@/theme';
import type { GoalTier } from '@/types';
import { today, useStore } from '@/store/useStore';

interface Proof {
  id: string;
  tier: GoalTier;
  title: string;
}

/**
 * Aksam / Ayna deneyimi (README bolum 5 - Aksam, bolum 11 - Ayna Gunu).
 * Once kisa bir gelecek sahnesi, bugunun kanit kolaji ve uc kisa soruyla gunun
 * kapanisi. Tamamlanmayan hedef icin utandirma yoktur; engel nazikce incelenir.
 */
export default function EveningScreen() {
  const router = useRouter();
  const date = today();

  const displayName = useStore((s) => s.profile.displayName);
  const plan = useStore((s) => s.plansByDate[date]);
  const evidence = useStore((s) => s.evidence);
  const saveReflection = useStore((s) => s.saveReflection);

  // Bugunun tamamlanan kanitlari: once gunun planindan, plan yoksa kanit kasasindan.
  const proofs = useMemo<Proof[]>(() => {
    if (plan) {
      return plan.goals
        .filter((g) => g.completed)
        .map((g) => ({ id: g.id, tier: g.tier, title: g.title }));
    }
    return evidence
      .filter((e) => e.date === date)
      .map((e) => ({ id: e.id, tier: e.tier, title: e.title }));
  }, [plan, evidence, date]);

  const [didWhat, setDidWhat] = useState('');
  const [learned, setLearned] = useState('');
  const [easierTomorrow, setEasierTomorrow] = useState('');

  const onSave = () => {
    saveReflection(date, { didWhat, learned, easierTomorrow });
    router.replace('/(tabs)/path');
  };

  const hasProof = proofs.length > 0;

  return (
    <Screen scroll>
      <FutureSelfScene name={displayName} message={FUTURE_SELF.evening} />

      <SectionHeader
        kicker="AYNA"
        title="Bugünün kanıt kolajı"
        subtitle="Bugün ne olduysa oldu; birlikte kanıta ve engele bakalım."
      />

      {hasProof ? (
        proofs.map((p) => (
          <Card key={p.id} style={styles.proof}>
            <View style={styles.proofHeader}>
              <View style={[styles.dot, { backgroundColor: tierColors[p.tier] }]} />
              <AppText variant="label" color={tierColors[p.tier]}>
                {TIER_LABEL[p.tier]}
              </AppText>
            </View>
            <AppText variant="bodyStrong">{p.title}</AppText>
          </Card>
        ))
      ) : (
        <Card tone="muted" style={styles.kind}>
          <AppText variant="bodyStrong">
            {plan
              ? 'Bugün tamamlanan bir kanıt görünmüyor ve bu utanılacak bir şey değil.'
              : 'Bugün üç köprüyü henüz başlatmadın ve bu da bir bilgi.'}
          </AppText>
          <AppText variant="body" color={colors.onSurfaceMuted}>
            Buraya geri dönmen tek başına ilerlemenin bir parçası. Engeli birlikte inceleyip yarına
            daha küçük bir deney tasarlayabiliriz.
          </AppText>
        </Card>
      )}

      <SectionHeader
        title="Üç kısa soru"
        subtitle="Günü yargısızca kapat; kısa cevaplar da yeterli."
      />
      <TextField
        label="Ne yaptım?"
        value={didWhat}
        onChangeText={setDidWhat}
        placeholder="Bugün atılan bir adım..."
        multiline
      />
      <TextField
        label="Ne öğrendim?"
        value={learned}
        onChangeText={setLearned}
        placeholder="Küçük bir fark ediş..."
        multiline
      />
      <TextField
        label="Yarın neyi kolaylaştırmalıyım?"
        value={easierTomorrow}
        onChangeText={setEasierTomorrow}
        placeholder="Yarını bir tık kolaylaştıracak şey..."
        multiline
      />

      <Button
        label="Kaydet ve günü kapat"
        onPress={onSave}
        size="lg"
        fullWidth
        style={styles.save}
        accessibilityHint="Akşam yansımasını kaydeder ve yola geri döner"
      />
      <Button
        label="Bir engel mi vardı? Düşünce Laboratuvarı"
        variant="ghost"
        onPress={() => router.push('/thought-lab')}
        fullWidth
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  proof: { gap: spacing.xs },
  proofHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  dot: { width: 10, height: 10, borderRadius: 5 },
  kind: { gap: spacing.sm },
  save: { marginTop: spacing.md },
});
