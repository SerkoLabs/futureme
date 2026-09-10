/**
 * Puan defteri (point ledger) mantigi - urunun en kritik dogruluk katmani.
 *
 * Ilkeler (README bolum 16 ve 22 - Kabul kriterleri):
 *  - Bakiye dogrudan degistirilmez; defter hareketlerinden hesaplanir.
 *  - ASAMA puani yalnizca dogrulanmis bir urun olayindan BIR KEZ yazilir.
 *  - Cevrimdisi tamamlama tekrar baglandiginda cift puan uretmez (idempotency).
 */

import type { DailyGoal, LedgerEntry, LedgerReason, PointKind } from '../types';
import { REASON_STAGE, REASON_XP, SEND_THREE_POINTS, TIER_POINTS } from './economy';

export interface Balance {
  stage: number;
  xp: number;
}

/** Bir hedef tamamlama olayinin benzersiz idempotency anahtari. */
export function completionRefId(date: string, goalId: string): string {
  return `${date}:goal:${goalId}:complete`;
}

/** Uc hedefi gonderme olayinin gunluk benzersiz anahtari. */
export function sendThreeRefId(date: string): string {
  return `${date}:sendThree`;
}

function entry(
  refId: string,
  kind: PointKind,
  amount: number,
  reason: LedgerReason,
  date: string,
  createdAt: string,
): LedgerEntry {
  return { id: `${refId}:${kind}`, refId, kind, amount, reason, date, createdAt };
}

/**
 * Bir hedef tamamlama icin ASAMA ve XP hareketlerini uretir.
 * Ayni refId ile uretilir; boylece `applyEntries` cift yazmayi engeller.
 */
export function completionEntries(goal: DailyGoal, date: string, createdAt: string): LedgerEntry[] {
  const refId = completionRefId(date, goal.id);
  const { stage, xp, reason } = TIER_POINTS[goal.tier];
  return [
    entry(refId, 'stage', stage, reason, date, createdAt),
    entry(refId, 'xp', xp, reason, date, createdAt),
  ];
}

/** Uc hedefi gelecekteki benlige gonderme icin hareketler. */
export function sendThreeEntries(date: string, createdAt: string): LedgerEntry[] {
  const refId = sendThreeRefId(date);
  return [
    entry(refId, 'stage', SEND_THREE_POINTS.stage, SEND_THREE_POINTS.reason, date, createdAt),
    entry(refId, 'xp', SEND_THREE_POINTS.xp, SEND_THREE_POINTS.reason, date, createdAt),
  ];
}

/**
 * Yeni hareketleri deftere idempotent olarak ekler.
 * (refId, kind) ikilisi zaten varsa yok sayilir -> cift puan olusmaz.
 * Yeni bir dizi dondurur; girdi degistirilmez.
 */
export function applyEntries(existing: LedgerEntry[], incoming: LedgerEntry[]): LedgerEntry[] {
  const seen = new Set(existing.map((e) => `${e.refId}:${e.kind}`));
  const result = existing.slice();
  for (const e of incoming) {
    const key = `${e.refId}:${e.kind}`;
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(e);
  }
  return result;
}

/** Belirli bir olay (refId) deftere yazilmis mi. */
export function hasEntry(entries: LedgerEntry[], refId: string): boolean {
  return entries.some((e) => e.refId === refId);
}

/** Defterden toplam bakiyeyi hesaplar. */
export function computeBalance(entries: LedgerEntry[]): Balance {
  let stage = 0;
  let xp = 0;
  for (const e of entries) {
    if (e.kind === 'stage') stage += e.amount;
    else xp += e.amount;
  }
  return { stage, xp };
}

/** Belirli bir gunde yazilan ASAMA toplami (gunluk azami denetimi icin). */
export function dailyStage(entries: LedgerEntry[], date: string): number {
  return entries
    .filter((e) => e.date === date && e.kind === 'stage')
    .reduce((sum, e) => sum + e.amount, 0);
}

/**
 * Bir defter hareketinin beklenen puani, reason'a gore dogru mu?
 * Denetim/senkron hatasi yakalamak icin kullanilir (README bolum 16).
 */
export function isConsistentEntry(e: LedgerEntry): boolean {
  const expected = e.kind === 'stage' ? REASON_STAGE[e.reason] : REASON_XP[e.reason];
  return e.amount === expected;
}
