import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText, Card, Screen, SectionHeader } from '@/components';
import { computeBalance, daysBetween, TIER_LABEL } from '@/domain';
import { colors, palette, spacing, tierColors } from '@/theme';
import type { Evidence } from '@/types';
import { useStore } from '@/store/useStore';

/**
 * Kanit Kasasi (README bolum 5 ve 11).
 * Her tamamlanan davranis burada kucuk bir kanit olarak birikir. Ton kutlayici
 * ve suclamasizdir: kucuk kanitlar degerlidir, sifir adimdan buyuktur.
 */
export default function EvidenceScreen() {
  const evidence = useStore((s) => s.evidence);
  const streaks = useStore((s) => s.streaks);
  const ledger = useStore((s) => s.ledger);
  const journey = useStore((s) => s.journey);

  const balance = useMemo(() => computeBalance(ledger), [ledger]);

  // Kanitlar zaten yeniden eskiye siralidir; sirayi bozmadan gune gore gruplariz.
  const groups = useMemo(() => groupByDate(evidence), [evidence]);

  return (
    <Screen scroll>
      <SectionHeader
        title="Kanıt Kasası"
        subtitle="Gerçek hayatta attığın her küçük adım burada kanıt olarak birikir."
      />

      {/* Ozet - path.tsx StreakPill gorunumunu yansitir */}
      <Card style={styles.statsCard}>
        <AppText variant="caption" color={colors.onSurfaceMuted} center>
          Küçük kanıtlar değerlidir. Her biri geleceğine doğru gerçek bir adım.
        </AppText>
        <View style={styles.statsRow}>
          <StatPill value={evidence.length} label="Toplam Kanıt" />
          <StatPill value={streaks.evidence.count} label="Kanıt Serisi" />
          <StatPill value={balance.stage} label="AŞAMA" hint={`${balance.xp} XP`} />
        </View>
      </Card>

      {evidence.length === 0 ? (
        <Card style={styles.emptyCard}>
          <AppText variant="heading">Kasan seni bekliyor</AppText>
          <AppText variant="body" color={colors.onSurfaceMuted}>
            Henüz kanıt yok ve bu tamamen normal. Yol sekmesinde bugünün küçük bir hedefini
            tamamladığında ilk kanıtın tam burada belirecek.
          </AppText>
          <AppText variant="body" color={colors.onSurfaceMuted}>
            Acele yok, baskı yok. Beş dakikalık bir adım bile sıfırdan büyüktür.
          </AppText>
        </Card>
      ) : (
        groups.map((group) => (
          <View key={group.date} style={styles.group}>
            <View style={styles.groupHeader}>
              <AppText variant="heading">{formatDateLabel(group.date)}</AppText>
              {dayLabel(journey?.startDate, group.date) ? (
                <AppText variant="caption" color={colors.onSurfaceMuted}>
                  {dayLabel(journey?.startDate, group.date)}
                </AppText>
              ) : null}
            </View>

            {group.items.map((item) => (
              <Card key={item.id} style={styles.item}>
                <View style={styles.itemRow}>
                  <View style={[styles.dot, { backgroundColor: tierColors[item.tier] }]} />
                  <View style={styles.itemBody}>
                    <AppText variant="bodyStrong">{item.title}</AppText>
                    <AppText variant="caption" color={colors.onSurfaceMuted}>
                      {metaLine(item)}
                    </AppText>
                    <AppText variant="caption" color={colors.onSurfaceFaint}>
                      {timeNote(item.createdAt)}
                    </AppText>
                    {item.note ? (
                      <View style={styles.note}>
                        <AppText variant="body" color={colors.onSurfaceMuted}>
                          {item.note}
                        </AppText>
                      </View>
                    ) : null}
                  </View>
                </View>
              </Card>
            ))}
          </View>
        ))
      )}
    </Screen>
  );
}

function StatPill({ value, label, hint }: { value: number | string; label: string; hint?: string }) {
  return (
    <View style={styles.pill}>
      <AppText variant="title" color={colors.primary}>
        {value}
      </AppText>
      <AppText variant="caption" color={colors.onSurfaceMuted} center>
        {label}
      </AppText>
      {hint ? (
        <AppText variant="caption" color={palette.sunrise}>
          {hint}
        </AppText>
      ) : null}
    </View>
  );
}

interface EvidenceGroup {
  date: string;
  items: Evidence[];
}

/** Kanitlari (yeniden eskiye) sirayi koruyarak gune gore gruplar. */
function groupByDate(evidence: Evidence[]): EvidenceGroup[] {
  const groups: EvidenceGroup[] = [];
  const index = new Map<string, EvidenceGroup>();
  for (const item of evidence) {
    let group = index.get(item.date);
    if (!group) {
      group = { date: item.date, items: [] };
      index.set(item.date, group);
      groups.push(group);
    }
    group.items.push(item);
  }
  return groups;
}

/** Bir kanit satirinin ust bilgisi: kademe etiketi + varsa sure. */
function metaLine(item: Evidence): string {
  const parts = [TIER_LABEL[item.tier]];
  if (item.durationMinutes) parts.push(`${item.durationMinutes} dk`);
  return parts.join(' · ');
}

const MONTHS_TR = [
  'Ocak',
  'Şubat',
  'Mart',
  'Nisan',
  'Mayıs',
  'Haziran',
  'Temmuz',
  'Ağustos',
  'Eylül',
  'Ekim',
  'Kasım',
  'Aralık',
];

/** "YYYY-MM-DD" -> "30 Ağustos 2026". */
function formatDateLabel(date: string): string {
  const [y, m, d] = date.split('-').map((n) => parseInt(n, 10));
  if (!y || !m || !d) return date;
  return `${d} ${MONTHS_TR[m - 1] ?? ''} ${y}`.trim();
}

/** Yolculuk basindan bu gune kacinci gun (guvenli). */
function dayLabel(startDate: string | undefined, date: string): string | null {
  if (!startDate) return null;
  const n = daysBetween(startDate, date) + 1;
  if (n < 1) return null;
  return `Gün ${n}`;
}

/** ISO zamandan sicak bir gunun-bolumu + saat notu. */
function timeNote(iso: string): string {
  const d = new Date(iso);
  const hh = d.getHours();
  const clock = `${`${hh}`.padStart(2, '0')}:${`${d.getMinutes()}`.padStart(2, '0')}`;
  const part = hh < 6 ? 'Gece' : hh < 12 ? 'Sabah' : hh < 18 ? 'Öğleden sonra' : 'Akşam';
  return `${part} · ${clock}`;
}

const styles = StyleSheet.create({
  statsCard: { gap: spacing.md },
  statsRow: { flexDirection: 'row', gap: spacing.md, alignSelf: 'stretch' },
  pill: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.surfaceMuted,
    borderRadius: 16,
    paddingVertical: spacing.md,
    gap: 2,
  },
  emptyCard: { gap: spacing.sm, marginTop: spacing.sm },
  group: { gap: spacing.sm, marginTop: spacing.sm },
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  item: { paddingVertical: spacing.md },
  itemRow: { flexDirection: 'row', gap: spacing.md },
  dot: { width: 12, height: 12, borderRadius: 6, marginTop: 6 },
  itemBody: { flex: 1, gap: 2 },
  note: {
    marginTop: spacing.sm,
    backgroundColor: colors.surfaceMuted,
    borderRadius: 12,
    padding: spacing.md,
  },
});
