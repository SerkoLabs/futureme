/**
 * Iki seri gostergesi (README bolum 6 - Seri sistemi):
 *  - Bag Serisi: uygulamaya donup gelecekteki benlikle temas edilen gunler.
 *  - Kanit Serisi: en az bir gercek davranis tamamlanan gunler.
 *
 * Onemli: Kacirilan gun GECMIS YOLU (puanlari) silmez. Seri sayaci sifirlanabilir
 * ama kullaniciya "seriyi kaybettin" degil "yol burada seni bekliyordu" denir.
 * Puan ilerlemesi point_ledger'da durur; seri yalnizca bir tutarlilik gostergesidir.
 */

import type { Streaks } from '../types';
import { daysBetween } from './dates';

export interface StreakCounter {
  count: number;
  lastDate: string | null;
}

export function emptyStreaks(): Streaks {
  return {
    bond: { count: 0, lastDate: null },
    evidence: { count: 0, lastDate: null },
  };
}

/**
 * Bir seri sayacini verilen gun icin gunceller.
 *  - Ayni gun tekrar -> degismez (gun icinde birden fazla temas seriyi sismez).
 *  - Ilk temas -> 1.
 *  - Tam ertesi gun -> +1.
 *  - Bosluk (>1 gun) -> yeni seri 1 (gecmis puan silinmez).
 *  - Gecmis bir tarih (sira disi) -> degismez.
 */
export function bumpStreak(current: StreakCounter, date: string): StreakCounter {
  if (current.lastDate === null) {
    return { count: 1, lastDate: date };
  }
  const gap = daysBetween(current.lastDate, date);
  if (gap === 0) return current; // ayni gun
  if (gap < 0) return current; // siradisi/gecmis tarih, yok say
  if (gap === 1) return { count: current.count + 1, lastDate: date };
  return { count: 1, lastDate: date }; // bosluk -> yeni seri
}

/** Kullanici uygulamaya donup temas ettiginde Bag Serisini gunceller. */
export function recordBond(streaks: Streaks, date: string): Streaks {
  return { ...streaks, bond: bumpStreak(streaks.bond, date) };
}

/** O gun en az bir gercek davranis tamamlaninca Kanit Serisini gunceller. */
export function recordEvidence(streaks: Streaks, date: string): Streaks {
  return { ...streaks, evidence: bumpStreak(streaks.evidence, date) };
}

/**
 * Kullaniciya gosterilecek sefkatli donus mesaji: kacirilan gunlerden sonra
 * suclamayan bir dil kullanir (README bolum 6 ve 13).
 */
export function comebackMessage(streaks: Streaks, today: string): string | null {
  const last = streaks.evidence.lastDate ?? streaks.bond.lastDate;
  if (!last) return null;
  const gap = daysBetween(last, today);
  if (gap <= 1) return null;
  return 'Yol silinmedi. Bugün tek bir küçük basamakla yeniden başlayabilirsin.';
}
