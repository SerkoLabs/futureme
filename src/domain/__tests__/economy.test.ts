import {
  DAILY_MAX_STAGE,
  DAILY_MAX_XP,
  SEND_THREE_POINTS,
  TIER_POINTS,
  journeyMath,
} from '../economy';

describe('puan ekonomisi (README bolum 6)', () => {
  it('gunluk azami = gonder(1) + minimum(1) + destek(2) + ana(3) = 7 ASAMA', () => {
    const total =
      SEND_THREE_POINTS.stage +
      TIER_POINTS.minimumEvidence.stage +
      TIER_POINTS.supportStep.stage +
      TIER_POINTS.mainBridge.stage;
    expect(total).toBe(7);
    expect(total).toBe(DAILY_MAX_STAGE);
  });

  it('gunluk azami XP = 70', () => {
    const total =
      SEND_THREE_POINTS.xp +
      TIER_POINTS.minimumEvidence.xp +
      TIER_POINTS.supportStep.xp +
      TIER_POINTS.mainBridge.xp;
    expect(total).toBe(70);
    expect(total).toBe(DAILY_MAX_XP);
  });

  it('kademe puanlari README tablosuyla birebir eslesir', () => {
    expect(TIER_POINTS.minimumEvidence).toMatchObject({ stage: 1, xp: 10 });
    expect(TIER_POINTS.supportStep).toMatchObject({ stage: 2, xp: 20 });
    expect(TIER_POINTS.mainBridge).toMatchObject({ stage: 3, xp: 30 });
  });
});

describe('yolculuk matematigi (README bolum 6)', () => {
  const m = journeyMath(180, 1000);

  it('180 gunde alinabilecek azami puan 1260', () => {
    expect(m.maxPossibleStage).toBe(1260);
  });

  it('1000 puan icin gunluk ortalama ~5,56', () => {
    expect(m.averagePerDayNeeded).toBeCloseTo(5.56, 2);
  });

  it('gereken tutarlilik ~yuzde 79', () => {
    expect(m.requiredConsistency).toBeCloseTo(0.79, 2);
  });

  it('tum hedeflerin tamamlandigi esdeger gun sayisi en az 143', () => {
    expect(m.minFullDaysToTarget).toBe(143);
  });
});
