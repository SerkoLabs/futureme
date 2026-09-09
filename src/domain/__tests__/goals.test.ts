import type { GoalTemplate } from '../../types';
import { buildDailyGoals, goalId, minimumDurationMinutes } from '../goals';

const templates: GoalTemplate[] = [
  {
    area: 'movement',
    tier: 'mainBridge',
    title: '30 dakika tempolu yuruyus',
    why: 'bedenine ozen gosteren bene yaklasmak',
    completionCriteria: '30 dakika kesintisiz yuruyus',
    durationMinutes: 30,
    difficulty: 'standard',
    minimumVersion: 'ayakkabiyi giy ve 7 dakika yuru',
  },
  {
    area: 'movement',
    tier: 'supportStep',
    title: 'Su hatirlatma',
    why: 'gun boyu su icmek',
    completionCriteria: '3 bardak su',
    difficulty: 'gentle',
    minimumVersion: '1 bardak su',
  },
  {
    area: 'movement',
    tier: 'minimumEvidence',
    title: 'Uyku saatini yaz',
    why: 'duzenli uyku',
    completionCriteria: 'uyku saatini not et',
    difficulty: 'gentle',
    minimumVersion: 'tek satir not',
  },
];

describe('gunluk hedef uretimi (README bolum 5 ve 22)', () => {
  it('her kademeden bir tane, tam uc hedef uretir', () => {
    const goals = buildDailyGoals(templates, {
      area: 'movement',
      energy: 'medium',
      date: '2026-08-30',
    });
    expect(goals).toHaveLength(3);
    expect(goals.map((g) => g.tier)).toEqual(['mainBridge', 'supportStep', 'minimumEvidence']);
  });

  it('puanlari kademeye gore deterministik atar', () => {
    const goals = buildDailyGoals(templates, {
      area: 'movement',
      energy: 'medium',
      date: '2026-08-30',
    });
    const byTier = Object.fromEntries(goals.map((g) => [g.tier, g]));
    expect(byTier.mainBridge.stagePoints).toBe(3);
    expect(byTier.supportStep.stagePoints).toBe(2);
    expect(byTier.minimumEvidence.stagePoints).toBe(1);
  });

  it('her hedefin acik tamamlanma olcutu ve minimum surumu vardir', () => {
    const goals = buildDailyGoals(templates, {
      area: 'movement',
      energy: 'medium',
      date: '2026-08-30',
    });
    for (const g of goals) {
      expect(g.completionCriteria.length).toBeGreaterThan(0);
      expect(g.minimumVersion.length).toBeGreaterThan(0);
    }
  });

  it('dusuk enerjide ana kopruyu tanimli minimum surume indirir', () => {
    const goals = buildDailyGoals(templates, {
      area: 'movement',
      energy: 'low',
      date: '2026-08-30',
    });
    const main = goals.find((g) => g.tier === 'mainBridge')!;
    expect(main.difficulty).toBe('gentle');
    expect(main.completionCriteria).toBe(main.minimumVersion);
    expect(main.durationMinutes).toBe(7);
  });

  it('minimum metninde dakika yoksa mevcut sureyi korur', () => {
    expect(minimumDurationMinutes('tek satir not', 10)).toBe(10);
  });

  it('hedef kimligi gun+kademe ile kararlidir (idempotency icin)', () => {
    const goals = buildDailyGoals(templates, {
      area: 'movement',
      energy: 'medium',
      date: '2026-08-30',
    });
    expect(goals[0].id).toBe(goalId('2026-08-30', 'mainBridge'));
  });
});
