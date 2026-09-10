import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import {
  AppText,
  Button,
  Card,
  Chip,
  Screen,
  SectionHeader,
  TextField,
} from '@/components';
import { COGNITIVE_DISTORTIONS, THOUGHT_LAB_EXAMPLE } from '@/data/seed';
import { colors, spacing } from '@/theme';
import { useStore } from '@/store/useStore';

/**
 * Dusunce Laboratuvari (README bolum 9 - BDT tabanli yol haritasi).
 * Takilinan bir ani kucuk bir davranis deneyine ceviren dusunce kaydi.
 * Once gundelik dil; klinik aciklama istege bagli bir notun arkasinda durur.
 */
export default function ThoughtLabScreen() {
  const router = useRouter();

  // Zustand secici uyarisi: her seferinde tek bir alan/aksiyon dondururuz.
  const thoughtRecords = useStore((s) => s.thoughtRecords);
  const addThoughtRecord = useStore((s) => s.addThoughtRecord);

  const [situation, setSituation] = useState('');
  const [automaticThought, setAutomaticThought] = useState('');
  const [distortion, setDistortion] = useState<string | undefined>(undefined);
  const [emotion, setEmotion] = useState('');
  const [behavior, setBehavior] = useState('');
  const [balancedThought, setBalancedThought] = useState('');
  const [experiment, setExperiment] = useState('');
  const [learning, setLearning] = useState('');
  const [showMethod, setShowMethod] = useState(false);

  const canSave = situation.trim().length > 0 && automaticThought.trim().length > 0;

  const handleSave = () => {
    if (!canSave) return;
    const trimmedLearning = learning.trim();
    addThoughtRecord({
      situation: situation.trim(),
      automaticThought: automaticThought.trim(),
      distortion,
      emotion: emotion.trim(),
      behavior: behavior.trim(),
      balancedThought: balancedThought.trim(),
      experiment: experiment.trim(),
      learning: trimmedLearning.length > 0 ? trimmedLearning : undefined,
    });
    router.back();
  };

  return (
    <Screen scroll>
      <SectionHeader
        title="Düşünce Laboratuvarı"
        subtitle="Takıldığın bir anı al, üzerinde biraz düşün ve onu küçücük bir denemeye çevir. Amaç kendini yargılamak değil, ne olduğunu merakla görmek."
      />

      {/* Istege bagli yontem notu - varsayilan olarak kapali. */}
      <Card tone="muted" onPress={() => setShowMethod((v) => !v)}>
        <View style={styles.methodHeader}>
          <AppText variant="bodyStrong" color={colors.primary} style={styles.methodTitle}>
            Bunun arkasındaki yöntem neydi?
          </AppText>
          <AppText variant="caption" color={colors.primary}>
            {showMethod ? 'Gizle' : 'Göster'}
          </AppText>
        </View>
        {showMethod ? (
          <View style={styles.method}>
            <AppText variant="body" color={colors.onSurfaceMuted}>
              Bu küçük akış, zorlandığın bir anı parçalara ayırmana yarar: önce ne
              olduğunu (Durum), o an zihninden geçen ilk cümleyi (Otomatik düşünce) ve
              bunun sana ne hissettirip ne yaptırdığını (Duygu/Davranış) yazıyorsun.
              Sonra aynı duruma daha adil bakan bir cümle (Dengeli düşünce) ve onu
              sınayacak küçücük bir adım (Küçük deney) buluyorsun. En sonda da ne fark
              ettiğini (Öğrenme) not ediyorsun.
            </AppText>
            <AppText variant="body" color={colors.onSurfaceMuted}>
              Fikir şu: düşüncelerimizi kesin bir gerçek gibi değil, sınanabilir tahminler
              gibi ele almak. Küçük bir deney çoğu zaman, korktuğumuz şeyin sandığımızdan
              daha küçük olduğunu gösterir.
            </AppText>
          </View>
        ) : null}
      </Card>

      <View style={styles.form}>
        <TextField
          label="Durum"
          value={situation}
          onChangeText={setSituation}
          placeholder={THOUGHT_LAB_EXAMPLE.situation}
          multiline
          helperText="Ne oldu? Nerede, ne zaman, kimlerle?"
        />
        <TextField
          label="Otomatik düşünce"
          value={automaticThought}
          onChangeText={setAutomaticThought}
          placeholder={THOUGHT_LAB_EXAMPLE.automaticThought}
          multiline
          helperText="O anda zihninden geçen ilk cümle."
        />

        <View style={styles.field}>
          <AppText variant="bodyStrong">Örüntü</AppText>
          <AppText variant="caption" color={colors.onSurfaceMuted}>
            Düşüncenin tanıdık bir tuzağa benzeyip benzemediğine bak. İstersen bir tane
            seç, istersen boş bırak.
          </AppText>
          <View style={styles.chips}>
            {COGNITIVE_DISTORTIONS.map((d) => (
              <Chip
                key={d}
                label={d}
                selected={distortion === d}
                onPress={() => setDistortion((cur) => (cur === d ? undefined : d))}
              />
            ))}
          </View>
          <AppText variant="caption" color={colors.onSurfaceFaint}>
            Örnek: {THOUGHT_LAB_EXAMPLE.distortion}
          </AppText>
        </View>

        <TextField
          label="Duygu / beden"
          value={emotion}
          onChangeText={setEmotion}
          placeholder={THOUGHT_LAB_EXAMPLE.emotion}
          helperText="Ne hissettin? Bedeninde nerede duydun?"
        />
        <TextField
          label="Davranış"
          value={behavior}
          onChangeText={setBehavior}
          placeholder={THOUGHT_LAB_EXAMPLE.behavior}
          helperText="O an ne yaptın ya da neyden kaçındın?"
        />
        <TextField
          label="Dengeli düşünce"
          value={balancedThought}
          onChangeText={setBalancedThought}
          placeholder={THOUGHT_LAB_EXAMPLE.balancedThought}
          multiline
          helperText="Aynı duruma daha adil ve gerçekçi bakan bir cümle."
        />
        <TextField
          label="Küçük davranış deneyi"
          value={experiment}
          onChangeText={setExperiment}
          placeholder={THOUGHT_LAB_EXAMPLE.experiment}
          helperText="Bugün deneyebileceğin, gözünü korkutmayacak kadar küçük bir adım."
        />
        <TextField
          label="Öğrenme"
          value={learning}
          onChangeText={setLearning}
          placeholder={THOUGHT_LAB_EXAMPLE.learning}
          multiline
          helperText="İsteğe bağlı. Deneyi yaptıktan sonra doldur: ne fark ettin?"
        />
      </View>

      <Button
        label="Kaydet"
        onPress={handleSave}
        disabled={!canSave}
        fullWidth
        accessibilityHint="Düşünce kaydını saklar ve laboratuvarı kapatır"
      />
      {!canSave ? (
        <AppText variant="caption" color={colors.onSurfaceMuted} center>
          Başlamak için en azından durumu ve o anki düşünceni yaz.
        </AppText>
      ) : null}
      <Button label="Vazgeç" variant="ghost" onPress={() => router.back()} fullWidth />

      {/* Gecmis kayitlar - en yeni ustte (store zaten basa ekliyor). */}
      <SectionHeader title="Geçmiş kayıtlar" subtitle="Daha önce üzerinde çalıştığın anlar." />
      {thoughtRecords.length === 0 ? (
        <Card tone="muted">
          <AppText variant="body" color={colors.onSurfaceMuted}>
            Henüz kayıt yok. İlk takıldığın anı yukarıda küçük bir denemeye çevirebilirsin.
          </AppText>
        </Card>
      ) : (
        thoughtRecords.map((r) => (
          <Card key={r.id} style={styles.record}>
            <AppText variant="bodyStrong">{r.situation}</AppText>
            {r.balancedThought.trim().length > 0 ? (
              <AppText variant="body" color={colors.onSurfaceMuted}>
                Dengeli düşünce: {r.balancedThought}
              </AppText>
            ) : null}
          </Card>
        ))
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  methodHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  methodTitle: { flex: 1 },
  method: { gap: spacing.sm, marginTop: spacing.md },
  form: { gap: spacing.lg },
  field: { gap: spacing.sm },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  record: { gap: spacing.xs },
});
