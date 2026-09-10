import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Share, StyleSheet, Switch, View } from 'react-native';

import { AppText, Button, Card, Screen, SectionHeader } from '@/components';
import { colors, palette, spacing } from '@/theme';
import type { AccessibilityPrefs, Consents, NotificationPrefs } from '@/types';
import { useStore } from '@/store/useStore';

/**
 * Profil ve Kontroller ekrani (README bolum 11, 12, 13, 17).
 * Izinler, bildirimler, erisilebilirlik ve veri kontrolleri tek yerde.
 * Her izin ayri ayri ve geri alinabilir; model egitimi varsayilan olarak kapalidir.
 */

type ConsentRow = { key: keyof Consents; label: string; description: string; note?: string };
type NotifBoolKey = 'morning' | 'planned' | 'evening' | 'comeback';
type NotifRow = { key: NotifBoolKey; label: string; description: string };
type AccessRow = { key: keyof AccessibilityPrefs; label: string; description: string };

const CONSENT_ROWS: ConsentRow[] = [
  {
    key: 'photo',
    label: 'Fotoğraf',
    description: 'Gelecekteki benlik sahnesi ve avatar için fotoğrafını kullan.',
  },
  {
    key: 'voice',
    label: 'Ses',
    description: 'Sesli yol arkadaşlığı ve gelecek-ben sesi için ses kaydını kullan.',
  },
  {
    key: 'ai',
    label: 'Yapay zekâ',
    description: 'Plan, sohbet ve koçluğu kişiselleştirmek için yapay zekâyı kullan.',
  },
  {
    key: 'analytics',
    label: 'Kullanım analitiği',
    description: 'Uygulamayı iyileştirmek için anonim kullanım ölçümlerini paylaş.',
  },
  {
    key: 'modelTraining',
    label: 'Model eğitimi',
    description: 'Verilerini modelleri geliştirmek için kullanmamıza izin ver.',
    note:
      'Varsayılan olarak KAPALI. Bu izin diğer izinlerden ayrıdır ve istediğin an geri alabilirsin.',
  },
];

const NOTIF_ROWS: NotifRow[] = [
  { key: 'morning', label: 'Sabah', description: 'Gelecek sahnesine ve bugünün üç kanıtına davet.' },
  {
    key: 'planned',
    label: 'Planlanan an',
    description: 'Kendi uygulama niyetin için nazik bir hatırlatma.',
  },
  { key: 'evening', label: 'Akşam', description: 'Yargısız günlük kapanış daveti.' },
  {
    key: 'comeback',
    label: 'Geri dönüş',
    description: 'Ara verdiğinde bağı yeniden kurmak için tek küçük basamak.',
  },
];

const ACCESS_ROWS: AccessRow[] = [
  {
    key: 'reduceMotion',
    label: 'Hareketi azalt',
    description: 'Kutlama ve geçiş animasyonlarını sakin tutar.',
  },
  { key: 'muteSound', label: 'Sesi kapat', description: 'Uygulama içi ses ve efektleri susturur.' },
  {
    key: 'highContrast',
    label: 'Yüksek kontrast',
    description: 'Metin ve öğeler arasındaki kontrastı artırır.',
  },
];

export default function ProfileScreen() {
  const router = useRouter();

  // Zustand secici uyarisi: profile kararli bir dilim; eylem referanslari ayri ayri secilir.
  const profile = useStore((s) => s.profile);
  const setConsent = useStore((s) => s.setConsent);
  const setNotificationPref = useStore((s) => s.setNotificationPref);
  const setAccessibilityPref = useStore((s) => s.setAccessibilityPref);
  const resetAll = useStore((s) => s.resetAll);

  const [exporting, setExporting] = useState(false);
  const [exportStatus, setExportStatus] = useState<string | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);

  const handleReset = () => {
    resetAll();
    router.replace('/onboarding');
  };

  const handleExport = async () => {
    setExporting(true);
    setExportStatus(null);
    const state = useStore.getState();
    const payload = {
      exportedAt: new Date().toISOString(),
      schemaVersion: 1,
      profile: state.profile,
      journey: state.journey,
      plansByDate: state.plansByDate,
      ledger: state.ledger,
      streaks: state.streaks,
      evidence: state.evidence,
      thoughtRecords: state.thoughtRecords,
      messages: state.messages,
    };

    try {
      await Share.share({
        title: 'FutureMe veri dışa aktarımı',
        message: `FutureMe veri dışa aktarımı (JSON)\n\n${JSON.stringify(payload, null, 2)}`,
      });
      setExportStatus('Verilerin paylaşım menüsüne hazırlandı.');
    } catch {
      setExportStatus('Dışa aktarma açılamadı. Lütfen tekrar dene.');
    } finally {
      setExporting(false);
    }
  };

  return (
    <Screen scroll>
      <SectionHeader
        title="Profil ve Kontroller"
        subtitle={
          profile.displayName
            ? `${profile.displayName}, izinler ve tercihler senin kontrolünde.`
            : 'İzinler, bildirimler ve erişilebilirlik senin kontrolünde.'
        }
      />

      {/* Izinler - her izin ayri ayri ve geri alinabilir (README bolum 4.1, 17) */}
      <Card>
        <CardHeading
          title="İzinler"
          description="Her izni ayrı ayrı açıp kapatabilirsin; hiçbiri diğerini gerektirmez."
        />
        {CONSENT_ROWS.map((row, i) => (
          <ToggleRow
            key={row.key}
            label={row.label}
            description={row.description}
            note={row.note}
            value={profile.consents[row.key]}
            onValueChange={(v) => setConsent(row.key, v)}
            showDivider={i > 0}
          />
        ))}
      </Card>

      {/* Bildirimler (README bolum 13) */}
      <Card>
        <CardHeading
          title="Bildirimler"
          description="Ton, sıklık ve sessiz saatler senin seçimin. Sistem görmezden gelinen bildirimleri artırmaz."
        />
        {NOTIF_ROWS.map((row, i) => (
          <ToggleRow
            key={row.key}
            label={row.label}
            description={row.description}
            value={profile.notifications[row.key]}
            onValueChange={(v) => setNotificationPref(row.key, v)}
            showDivider={i > 0}
          />
        ))}
        <View style={styles.readonlyRow}>
          <AppText variant="bodyStrong">Sessiz saatler</AppText>
          <AppText variant="body" color={colors.onSurfaceMuted}>
            {profile.notifications.quietHoursStart} – {profile.notifications.quietHoursEnd} arasinda
            bildirim gönderilmez.
          </AppText>
        </View>
      </Card>

      {/* Erisilebilirlik (README bolum 12) */}
      <Card>
        <CardHeading
          title="Erişilebilirlik"
          description="Hareket azaltma, ses kapatma ve yüksek kontrast ilk sürüm kapsamındadır."
        />
        {ACCESS_ROWS.map((row, i) => (
          <ToggleRow
            key={row.key}
            label={row.label}
            description={row.description}
            value={profile.accessibility[row.key]}
            onValueChange={(v) => setAccessibilityPref(row.key, v)}
            showDivider={i > 0}
          />
        ))}
      </Card>

      {/* Veri kontrolleri (README bolum 17) */}
      <Card>
        <CardHeading
          title="Veri kontrolleri"
          description="Verilerin senindir. Dilediğin an dışa aktarabilir ya da tamamen silebilirsin."
        />
        <View style={styles.dataBlock}>
          <Button
            label="Verilerimi dışa aktar"
            variant="secondary"
            fullWidth
            loading={exporting}
            onPress={() => void handleExport()}
          />
          {exportStatus ? (
            <AppText variant="caption" color={colors.onSurfaceMuted}>
              {exportStatus}
            </AppText>
          ) : null}
        </View>

        <View style={styles.dataBlock}>
          {confirmReset ? (
            <View style={styles.dataBlock}>
              <AppText variant="bodyStrong" color={colors.danger}>
                Emin misin?
              </AppText>
              <AppText variant="caption" color={colors.onSurfaceMuted}>
                Yolculuğun, hedeflerin, kanıtların ve tüm tercihlerin kalıcı olarak silinir.
              </AppText>
              <Button label="Evet, hesabımı sil" variant="danger" fullWidth onPress={handleReset} />
              <Button
                label="Vazgeç"
                variant="ghost"
                fullWidth
                onPress={() => setConfirmReset(false)}
              />
            </View>
          ) : (
            <Button
              label="Hesabımı sıfırla / sil"
              variant="danger"
              fullWidth
              onPress={() => setConfirmReset(true)}
            />
          )}
        </View>
      </Card>

      {/* Klinik sinir notu (README bolum 17) */}
      <Card tone="muted">
        <CardHeading title="Klinik sınır" />
        <AppText variant="body">
          FutureMe bir terapi, tanı veya acil yardım uygulaması değildir.
        </AppText>
        <AppText variant="body" color={colors.onSurfaceMuted}>
          Kriz anında uygulama seni gerçek ve yerel yardım kaynaklarına yönlendirir; profesyonel
          bakımın yerine geçmez.
        </AppText>
      </Card>
    </Screen>
  );
}

function CardHeading({ title, description }: { title: string; description?: string }) {
  return (
    <View style={styles.cardHeading}>
      <AppText variant="heading">{title}</AppText>
      {description ? (
        <AppText variant="caption" color={colors.onSurfaceMuted}>
          {description}
        </AppText>
      ) : null}
    </View>
  );
}

interface ToggleRowProps {
  label: string;
  description: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  note?: string;
  showDivider?: boolean;
}

function ToggleRow({ label, description, value, onValueChange, note, showDivider }: ToggleRowProps) {
  return (
    <View style={[styles.row, showDivider && styles.rowDivider]}>
      <View style={styles.rowMain}>
        <View style={styles.rowText}>
          <AppText variant="bodyStrong">{label}</AppText>
          <AppText variant="caption" color={colors.onSurfaceMuted}>
            {description}
          </AppText>
          {note ? (
            <AppText variant="caption" color={colors.primary}>
              {note}
            </AppText>
          ) : null}
        </View>
        <Switch
          value={value}
          onValueChange={onValueChange}
          trackColor={{ false: colors.border, true: colors.primary }}
          thumbColor={palette.white}
          ios_backgroundColor={colors.border}
          accessibilityLabel={label}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardHeading: { gap: spacing.xs, marginBottom: spacing.sm },
  row: { paddingVertical: spacing.md },
  rowDivider: { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.border },
  rowMain: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  rowText: { flex: 1, gap: spacing.xs },
  readonlyRow: {
    gap: spacing.xs,
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  dataBlock: { gap: spacing.sm, marginTop: spacing.sm },
});
