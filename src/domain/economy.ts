/**
 * Puan ekonomisi sabitleri ve saf kurallar (README bolum 6 - 1000 ASAMA).
 *
 * Iki ayri ekonomi:
 *  - ASAMA (stage): gercek yolculugun sinirli ilerleme olcusu. Satin alinamaz,
 *    transfer edilemez, reklamla kazanilamaz.
 *  - XP: gorsel oduller icin oyun ici deneyim puani. Ana ilerlemeyi degistirmez.
 *
 * Puan/gorev kurallari modelin serbest metnine birakilmaz; burada deterministiktir
 * (README bolum 14 - Yapay zeka kurallari).
 */

import type { GoalTier, LedgerReason } from '../types';

/** Kademe basina puanlar (README bolum 6 - Gunluk puan dagilimi). */
export const TIER_POINTS: Record<GoalTier, { stage: number; xp: number; reason: LedgerReason }> = {
  minimumEvidence: { stage: 1, xp: 10, reason: 'completeMinimum' },
  supportStep: { stage: 2, xp: 20, reason: 'completeSupport' },
  mainBridge: { stage: 3, xp: 30, reason: 'completeMain' },
};

/** Uc hedefi gelecekteki benlige gonderme odulu. */
export const SEND_THREE_POINTS = { stage: 1, xp: 10, reason: 'sendThree' as LedgerReason };

/** Gunluk azami (README bolum 6). send(1) + min(1) + support(2) + main(3) = 7 ASAMA. */
export const DAILY_MAX_STAGE = 7;
export const DAILY_MAX_XP = 70;

/** Standart yolculuk (README bolum 6). */
export const SEASON_LENGTH_DAYS = 180;
export const STAGE_TARGET = 1000;

/** ASAMA -> reason eslemesi; tersten dogrulama icin. */
export const REASON_STAGE: Record<LedgerReason, number> = {
  sendThree: SEND_THREE_POINTS.stage,
  completeMinimum: TIER_POINTS.minimumEvidence.stage,
  completeSupport: TIER_POINTS.supportStep.stage,
  completeMain: TIER_POINTS.mainBridge.stage,
};

export const REASON_XP: Record<LedgerReason, number> = {
  sendThree: SEND_THREE_POINTS.xp,
  completeMinimum: TIER_POINTS.minimumEvidence.xp,
  completeSupport: TIER_POINTS.supportStep.xp,
  completeMain: TIER_POINTS.mainBridge.xp,
};

/**
 * Yolculuk matematigi (README bolum 6). Surdurulebilirlik icin kusursuzluk
 * istemez; asagidaki turetilen degerler README'deki sayilarla tutarli olmalidir.
 */
export interface JourneyMath {
  maxPossibleStage: number; // 180 gunde alinabilecek azami: 1260
  averagePerDayNeeded: number; // ~5.56
  requiredConsistency: number; // ~0.79
  minFullDaysToTarget: number; // en az 143
}

export function journeyMath(
  seasonLengthDays: number = SEASON_LENGTH_DAYS,
  stageTarget: number = STAGE_TARGET,
): JourneyMath {
  const maxPossibleStage = seasonLengthDays * DAILY_MAX_STAGE;
  const averagePerDayNeeded = stageTarget / seasonLengthDays;
  const requiredConsistency = averagePerDayNeeded / DAILY_MAX_STAGE;
  const minFullDaysToTarget = Math.ceil(stageTarget / DAILY_MAX_STAGE);
  return { maxPossibleStage, averagePerDayNeeded, requiredConsistency, minFullDaysToTarget };
}
