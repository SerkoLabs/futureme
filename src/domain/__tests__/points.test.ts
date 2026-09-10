import type { DailyGoal } from '../../types';
import {
  applyEntries,
  completionEntries,
  completionRefId,
  computeBalance,
  dailyStage,
  hasEntry,
  isConsistentEntry,
  sendThreeEntries,
} from '../points';

const DATE = '2026-08-30';
const NOW = '2026-08-30T09:00:00.000Z';

function goal(tier: DailyGoal['tier'], id: string): DailyGoal {
  return {
    id,
    tier,
    title: 't',
    area: 'career',
    why: 'w',
    completionCriteria: 'c',
    difficulty: 'standard',
    minimumVersion: 'm',
    stagePoints: 0,
    xp: 0,
    safetyLabel: 'ok',
    edited: false,
    completed: false,
  };
}

describe('puan defteri (README bolum 16 ve 22)', () => {
  it('bakiye defter hareketlerinden hesaplanir', () => {
    let ledger = applyEntries([], sendThreeEntries(DATE, NOW));
    ledger = applyEntries(ledger, completionEntries(goal('mainBridge', 'g1'), DATE, NOW));
    const balance = computeBalance(ledger);
    expect(balance.stage).toBe(1 + 3);
    expect(balance.xp).toBe(10 + 30);
  });

  it('ayni hedefi iki kez tamamlamak cift puan URETMEZ (idempotency)', () => {
    const g = goal('supportStep', 'g2');
    let ledger = applyEntries([], completionEntries(g, DATE, NOW));
    // Cevrimdisi tekrar / yeniden senkron: ayni olay tekrar uygulanir.
    ledger = applyEntries(ledger, completionEntries(g, DATE, NOW));
    const balance = computeBalance(ledger);
    expect(balance.stage).toBe(2); // 4 degil
    expect(balance.xp).toBe(20);
  });

  it('bir gunde tum olaylar bir kez uygulaninca gunluk ASAMA azami 7 olur', () => {
    let ledger = applyEntries([], sendThreeEntries(DATE, NOW));
    ledger = applyEntries(ledger, completionEntries(goal('minimumEvidence', 'a'), DATE, NOW));
    ledger = applyEntries(ledger, completionEntries(goal('supportStep', 'b'), DATE, NOW));
    ledger = applyEntries(ledger, completionEntries(goal('mainBridge', 'c'), DATE, NOW));
    expect(dailyStage(ledger, DATE)).toBe(7);
  });

  it('hasEntry, yazilmis bir olayi bulur', () => {
    const ledger = applyEntries([], completionEntries(goal('mainBridge', 'g3'), DATE, NOW));
    expect(hasEntry(ledger, completionRefId(DATE, 'g3'))).toBe(true);
    expect(hasEntry(ledger, completionRefId(DATE, 'yok'))).toBe(false);
  });

  it('her hareket reason ile tutarli puan tasir (denetim)', () => {
    const ledger = applyEntries(
      sendThreeEntries(DATE, NOW),
      completionEntries(goal('mainBridge', 'g4'), DATE, NOW),
    );
    expect(ledger.every(isConsistentEntry)).toBe(true);
  });

  it('applyEntries girdi dizisini degistirmez (immutability)', () => {
    const original = sendThreeEntries(DATE, NOW);
    const copy = original.slice();
    applyEntries(original, completionEntries(goal('mainBridge', 'g5'), DATE, NOW));
    expect(original).toEqual(copy);
  });
});
