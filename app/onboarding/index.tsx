import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { StyleSheet, Switch, View } from 'react-native';

import {
  AppText,
  Button,
  Card,
  Chip,
  FutureSelfScene,
  Screen,
  SectionHeader,
  TextField,
} from '@/components';
import { GOAL_AREAS, MOTIVATION_HINTS, goalAreaMeta, possibleFuturesFor } from '@/data/seed';
import { colors, palette, spacing } from '@/theme';
import type { Consents, GoalArea } from '@/types';
import { useStore } from '@/store/useStore';

/**
 * Onboarding (README bolum 4.1 ve 11). Bir form degil, gelecekteki benlikle ilk
 * karsilasmaya hazirlanan kisa bir seruven. Tek dosyalik sihirbaz; adimlar
 * icsel useState ile yonetilir (ayri rota dosyalari yok).
 *
 * Ton: sicak, sefkatli; kesinlik/kehanet/garanti dili yok. Bu bir iyi olus ve
 * motivasyon araci; terapi/tani/tibbi/acil hizmet degildir.
 */

const STEP_WELCOME = 0;
const STEP_NAME = 1;
const STEP_AREA = 2;
const STEP_NORTH_STAR = 3;
const STEP_MOTIVATION = 4;
const STEP_POSSIBILITY = 5;
const STEP_CONSENTS = 6;
const STEP_MEETING = 7;
const STEP_FINISH = 8;
const LAST_STEP = STEP_FINISH;

const DEFAULT_CONSENTS: Consents = {
  photo: false,
  voice: false,
  ai: true,
  analytics: false,
  modelTraining: false, // varsayilan olarak kapali (README bolum 17)
};

export default function OnboardingScreen() {
  const router = useRouter();

  // Aksiyonu tek tek sec (zustand secici kurali: yeni nesne/dizi dondurme).
  const completeOnboarding = useStore((s) => s.completeOnboarding);

  const [step, setStep] = useState<number>(STEP_WELCOME);
  const [displayName, setDisplayName] = useState('');
  const [area, setArea] = useState<GoalArea | null>(null);
  const [northStar, setNorthStar] = useState('');
  const [whyItMatters, setWhyItMatters] = useState('');
  const [consents, setConsents] = useState<Consents>(DEFAULT_CONSENTS);

  const meta = useMemo(() => (area ? goalAreaMeta(area) : null), [area]);
  const futures = useMemo(() => (area ? possibleFuturesFor(area) : []), [area]);

  const trimmedName = displayName.trim();
  const trimmedStar = northStar.trim();

  const greeting = trimmedName ? `Merhaba ${trimmedName}.` : 'Merhaba.';
  const meetingMessage = trimmedStar
    ? `${greeting} “${trimmedStar}” dedin. Bu yöne, bugünden başlayarak attığın küçük adımlarla ` +
      'birlikte yaklaşabiliriz. Acele yok; adım adım gideriz.'
    : `${greeting} Buraya kadar geldin bile. Yarınki hâlinle bugünden bağ kurmaya başlıyoruz; ` +
      'her gün üç küçük adım, aramızdaki mesafeyi biraz daha kısaltabilir.';

  const setConsent = (key: keyof Consents, value: boolean) =>
    setConsents((c) => ({ ...c, [key]: value }));

  const goNext = () => setStep((s) => Math.min(s + 1, LAST_STEP));
  const goBack = () => setStep((s) => Math.max(s - 1, STEP_WELCOME));

  // Alan ve Kuzey Yıldızı olmadan anlamlı bir günlük plan üretilemez.
  const nextDisabled =
    (step === STEP_AREA && area === null) ||
    (step === STEP_NORTH_STAR && trimmedStar.length < 3);

  const onFinish = () => {
    if (!area) return; // guvenlik: alan olmadan bitirilemez
    completeOnboarding({
      displayName: trimmedName,
      area,
      northStar: trimmedStar,
      whyItMatters: whyItMatters.trim(),
      consents,
    });
    router.replace('/morning');
  };

  const renderStep = () => {
    switch (step) {
      case STEP_WELCOME:
        return (
          <>
            <FutureSelfScene
              message="Seni bekliyordum. Birlikte kısa bir yolculuğa çıkacağız; sonunda tanışacağız."
            />
            <SectionHeader
              kicker="HOŞ GELDİN"
              title="FutureMe'ye hoş geldin"
              subtitle="Gelecekteki benliğinle konuşarak her gün üç küçük kanıt ürettiğin bir iyi oluş ve motivasyon oyunu."
            />
            <Card tone="muted" style={styles.block}>
              <AppText variant="bodyStrong">Önce küçük bir not</AppText>
              <AppText variant="body" color={colors.onSurfaceMuted}>
                FutureMe bir terapi, tanı, tıbbi ya da acil durum hizmeti değildir. Zor bir an
                yaşıyorsan lütfen bir uzmana ya da yerel destek hatlarına başvurmayı düşün.
              </AppText>
            </Card>
            <Card tone="muted" style={styles.block}>
              <AppText variant="bodyStrong">Yapay zekâ ve verin</AppText>
              <AppText variant="body" color={colors.onSurfaceMuted}>
                Deneyim yapay zekâ ile kişiselleştirilir ve yapay üretilen içerikler açıkça
                etiketlenir. Verinin kontrolü sende: dilediğin zaman dışa aktarabilir ya da
                silebilirsin. Model eğitimi izni varsayılan olarak kapalıdır.
              </AppText>
            </Card>
          </>
        );

      case STEP_NAME:
        return (
          <>
            <SectionHeader
              kicker="TANIŞMA"
              title="Sana nasıl sesleneyim?"
              subtitle="İstersen adını bırak; boş bırakabilirsin, her zaman değiştirebilirsin."
            />
            <TextField
              label="Adın (isteğe bağlı)"
              value={displayName}
              onChangeText={setDisplayName}
              placeholder="Örnek: Deniz"
              helperText="Yalnızca seni sıcak bir şekilde selamlayabilmem için."
            />
          </>
        );

      case STEP_AREA:
        return (
          <>
            <SectionHeader
              kicker="YÖN"
              title="Şu aralar seni en çok ne zorluyor?"
              subtitle="Başlamak için bir alan seç. Sonradan değiştirebilirsin."
            />
            <View style={styles.chipWrap}>
              {GOAL_AREAS.map((g) => (
                <Chip
                  key={g.area}
                  label={g.label}
                  emoji={g.emoji}
                  selected={area === g.area}
                  onPress={() => setArea(g.area)}
                />
              ))}
            </View>
            {area === null ? (
              <AppText variant="caption" color={colors.onSurfaceMuted}>
                Devam etmek için bir alan seçmen yeterli.
              </AppText>
            ) : null}
          </>
        );

      case STEP_NORTH_STAR:
        return (
          <>
            <SectionHeader
              kicker="KUZEY YILDIZI"
              title="Küçük bir yön belirleyelim"
              subtitle="Kusursuz cevap aranmıyor; birkaç kelime bile yeterli."
            />
            <TextField
              label={
                meta?.northStarPrompt ??
                'Altı ay sonra hangi davranışları daha doğal yapıyor olmak istersin?'
              }
              value={northStar}
              onChangeText={setNorthStar}
              placeholder="Kendi cümlenle yaz..."
              multiline
              helperText="En az birkaç karakter yaz. Dilediğin zaman değiştirebilirsin."
            />
            <TextField
              label="Bu neden senin için önemli?"
              value={whyItMatters}
              onChangeText={setWhyItMatters}
              placeholder="Arkasındaki değeri birkaç kelimeyle anlat..."
              multiline
              helperText="Boş bırakabilirsin; ama bir 'neden' zor günlerde yol gösterebilir."
            />
          </>
        );

      case STEP_MOTIVATION:
        return (
          <>
            <SectionHeader
              kicker="MOTİVASYON HARİTASI"
              title="Sana şimdilik daha yakın görünen yaklaşımlar"
              subtitle="Bunlar bir tanı ya da hüküm değil; yalnızca birer olasılık. Zamanla gerçek davranışların bunları günceller."
            />
            {MOTIVATION_HINTS.slice(0, 3).map((h) => (
              <Card key={h.patternId} style={styles.hintCard}>
                <View style={styles.hintHeader}>
                  <AppText variant="bodyStrong" style={styles.hintTitle}>
                    {h.label}
                  </AppText>
                  <AppText variant="caption" color={colors.primary}>
                    ~%{Math.round(h.confidence * 100)} yakın
                  </AppText>
                </View>
                <AppText variant="caption" color={colors.onSurfaceMuted}>
                  İşe yarayabilir: {h.approach}
                </AppText>
                <AppText variant="caption" color={colors.onSurfaceMuted}>
                  Şimdilik kaçınılabilir: {h.avoid}
                </AppText>
              </Card>
            ))}
          </>
        );

      case STEP_POSSIBILITY:
        return (
          <>
            <SectionHeader
              kicker="OLASILIK ODASI"
              title="İhtimal, kader değil"
              subtitle="Tek bir kesin sonuç yok. İşte aynı yöne giden üç gerçekçi rota."
            />
            {futures.map((f) => (
              <Card key={f.id} style={styles.futureCard}>
                <AppText variant="bodyStrong">{f.title}</AppText>
                <AppText variant="caption" color={colors.onSurfaceMuted}>
                  {f.description}
                </AppText>
                <View style={styles.futureMeta}>
                  <AppText variant="label" color={colors.primary}>
                    SENİN ELİNDE
                  </AppText>
                  {f.controllables.slice(0, 2).map((c) => (
                    <AppText key={c} variant="caption" color={colors.onSurface}>
                      · {c}
                    </AppText>
                  ))}
                </View>
                <View style={styles.futureMeta}>
                  <AppText variant="label" color={colors.onSurfaceFaint}>
                    BELİRSİZ
                  </AppText>
                  {f.uncertainties.slice(0, 2).map((u) => (
                    <AppText key={u} variant="caption" color={colors.onSurfaceMuted}>
                      · {u}
                    </AppText>
                  ))}
                </View>
              </Card>
            ))}
          </>
        );

      case STEP_CONSENTS:
        return (
          <>
            <SectionHeader
              kicker="İZİNLER"
              title="Neyi paylaşacağına sen karar ver"
              subtitle="Her izin ayrıdır ve istediğin zaman Profil > Kontroller'den geri alabilirsin."
            />
            <Card style={styles.consentCard}>
              <ConsentRow
                title="Fotoğraf"
                description="Gelecekteki benlik avatarını kişiselleştirmek için fotoğrafını kullanma izni."
                value={consents.photo}
                onValueChange={(v) => setConsent('photo', v)}
              />
              <ConsentRow
                title="Ses"
                description="Sesli 'Benimle Yürü' deneyimi ve gelecekteki benliğin ses tonu için."
                value={consents.voice}
                onValueChange={(v) => setConsent('voice', v)}
              />
              <ConsentRow
                title="Yapay zekâ"
                description="Kişiselleştirilmiş mesaj ve hedef önerileri üretmek için. Kapatırsan güvenli hazır içerik kullanılır."
                value={consents.ai}
                onValueChange={(v) => setConsent('ai', v)}
              />
              <ConsentRow
                title="Kullanım analizi"
                description="Uygulamayı iyileştirmek için anonim kullanım verisi."
                value={consents.analytics}
                onValueChange={(v) => setConsent('analytics', v)}
              />
              <ConsentRow
                title="Model eğitimi"
                description="Verinin yapay zekâ modeli eğitiminde kullanılması. Varsayılan olarak kapalı."
                value={consents.modelTraining}
                onValueChange={(v) => setConsent('modelTraining', v)}
                last
              />
            </Card>
          </>
        );

      case STEP_MEETING:
        return (
          <>
            <SectionHeader
              kicker="İLK GÖRÜŞME"
              title="Şimdi tanışalım"
              subtitle="Gelecekteki benin, senin kendi sözlerinden yola çıkarak seni selamlıyor."
            />
            <FutureSelfScene name={trimmedName || undefined} message={meetingMessage} />
          </>
        );

      case STEP_FINISH:
      default:
        return (
          <>
            <SectionHeader
              kicker="İLK ÜÇ KÖPRÜ"
              title="Hazırsın"
              subtitle="Şimdi bugünün üç küçük hedefini seçip gelecekteki benliğine gönderelim."
            />
            <Card tone="muted" style={styles.block}>
              <AppText variant="body" color={colors.onSurfaceMuted}>
                Kusursuz olman gerekmiyor. Bir ana adım, bir destek adımı ve zor bir gün için en
                küçük adım; bu kadarı bugün için fazlasıyla yeterli.
              </AppText>
            </Card>
          </>
        );
    }
  };

  const navigation =
    step < LAST_STEP ? (
      <View style={styles.navRow}>
        {step > STEP_WELCOME ? (
          <Button label="Geri" variant="ghost" onPress={goBack} style={styles.navBtn} />
        ) : null}
        <Button
          label="İleri"
          onPress={goNext}
          disabled={nextDisabled}
          style={styles.navBtn}
          accessibilityHint="Bir sonraki adıma geçer"
        />
      </View>
    ) : (
      <View style={styles.finishWrap}>
        <Button
          label="İlk üç hedefi seç"
          size="lg"
          fullWidth
          disabled={!area}
          onPress={onFinish}
          accessibilityHint="Tanışmayı tamamlar ve sabah deneyimine geçer"
        />
        <Button label="Geri" variant="ghost" fullWidth onPress={goBack} />
      </View>
    );

  return (
    <Screen key={step} scroll footer={navigation}>
      {/* Ilerleme gostergesi */}
      <View style={styles.progressWrap}>
        <AppText variant="label" color={colors.onSurfaceFaint}>
          ADIM {step + 1} / {LAST_STEP + 1}
        </AppText>
        <View style={styles.progressTrack}>
          {Array.from({ length: LAST_STEP + 1 }).map((_, i) => (
            <View
              key={i}
              style={[styles.progressSeg, i <= step ? styles.progressOn : styles.progressOff]}
            />
          ))}
        </View>
      </View>

      <View style={styles.step}>{renderStep()}</View>

    </Screen>
  );
}

function ConsentRow({
  title,
  description,
  value,
  onValueChange,
  last,
}: {
  title: string;
  description: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  last?: boolean;
}) {
  return (
    <View style={[styles.consentRow, !last && styles.consentDivider]}>
      <View style={styles.consentText}>
        <AppText variant="bodyStrong">{title}</AppText>
        <AppText variant="caption" color={colors.onSurfaceMuted}>
          {description}
        </AppText>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ true: colors.primary, false: colors.border }}
        thumbColor={palette.white}
        accessibilityLabel={title}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  progressWrap: { gap: spacing.sm },
  progressTrack: { flexDirection: 'row', gap: spacing.xs },
  progressSeg: { flex: 1, height: 6, borderRadius: 3 },
  progressOn: { backgroundColor: colors.primary },
  progressOff: { backgroundColor: colors.surfaceMuted },

  step: { gap: spacing.lg },
  block: { gap: spacing.xs },

  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },

  hintCard: { gap: spacing.xs },
  hintHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  hintTitle: { flex: 1 },

  futureCard: { gap: spacing.sm },
  futureMeta: { gap: 2 },

  consentCard: { gap: 0 },
  consentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
  },
  consentDivider: { borderBottomWidth: 1, borderBottomColor: colors.border },
  consentText: { flex: 1, gap: 2 },

  navRow: { flexDirection: 'row', gap: spacing.md },
  navBtn: { flex: 1 },
  finishWrap: { gap: spacing.sm },
});
