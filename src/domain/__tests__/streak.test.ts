import { addDays } from '../dates';
import {
  bumpStreak,
  comebackMessage,
  emptyStreaks,
  recordBond,
  recordEvidence,
} from '../streak';

describe('seri sistemi (README bolum 6)', () => {
  it('ilk temas seriyi 1 yapar', () => {
    expect(bumpStreak({ count: 0, lastDate: null }, '2026-08-30')).toEqual({
      count: 1,
      lastDate: '2026-08-30',
    });
  });

  it('ayni gun tekrar temas seriyi sismez', () => {
    const s = { count: 3, lastDate: '2026-08-30' };
    expect(bumpStreak(s, '2026-08-30')).toEqual(s);
  });

  it('tam ertesi gun seriyi +1 yapar', () => {
    expect(bumpStreak({ count: 3, lastDate: '2026-08-30' }, '2026-08-31')).toEqual({
      count: 4,
      lastDate: '2026-08-31',
    });
  });

  it('bosluktan sonra seri yeniden 1 olur (gecmis puan silinmez)', () => {
    const after = bumpStreak({ count: 9, lastDate: '2026-08-25' }, '2026-08-30');
    expect(after).toEqual({ count: 1, lastDate: '2026-08-30' });
  });

  it('siradisi/gecmis tarih seriyi degistirmez', () => {
    const s = { count: 5, lastDate: '2026-08-30' };
    expect(bumpStreak(s, '2026-08-28')).toEqual(s);
  });

  it('Bag ve Kanit serileri bagimsiz guncellenir', () => {
    let streaks = emptyStreaks();
    streaks = recordBond(streaks, '2026-08-30');
    streaks = recordEvidence(streaks, '2026-08-30');
    streaks = recordBond(streaks, '2026-08-31'); // sadece temas, kanit yok
    expect(streaks.bond.count).toBe(2);
    expect(streaks.evidence.count).toBe(1);
  });

  it('kacirilan gunlerden sonra suclamayan donus mesaji verir', () => {
    let streaks = emptyStreaks();
    streaks = recordEvidence(streaks, '2026-08-20');
    const msg = comebackMessage(streaks, '2026-08-30');
    expect(msg).toContain('Yol silinmedi');
    expect(msg).not.toContain('kaybettin');
  });

  it('ardisik gunlerde donus mesaji gostermez', () => {
    let streaks = emptyStreaks();
    const d = '2026-08-30';
    streaks = recordEvidence(streaks, d);
    expect(comebackMessage(streaks, addDays(d, 1))).toBeNull();
  });
});
