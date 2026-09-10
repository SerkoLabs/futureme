import { addDays, dayKey, daysBetween, isNextDay } from '../dates';

describe('tarih yardimcilari', () => {
  it('daysBetween tam gun farkini verir', () => {
    expect(daysBetween('2026-08-30', '2026-09-02')).toBe(3);
    expect(daysBetween('2026-09-02', '2026-08-30')).toBe(-3);
    expect(daysBetween('2026-08-30', '2026-08-30')).toBe(0);
  });

  it('ay ve yil sinirlarini asar', () => {
    expect(daysBetween('2026-12-31', '2027-01-01')).toBe(1);
    expect(daysBetween('2024-02-28', '2024-03-01')).toBe(2); // 2024 arti yil
  });

  it('addDays yeni anahtar dondurur', () => {
    expect(addDays('2026-08-30', 1)).toBe('2026-08-31');
    expect(addDays('2026-08-31', 1)).toBe('2026-09-01');
    expect(addDays('2026-01-01', -1)).toBe('2025-12-31');
  });

  it('isNextDay yalnizca tam ertesi gun icin dogrudur', () => {
    expect(isNextDay('2026-08-30', '2026-08-31')).toBe(true);
    expect(isNextDay('2026-08-30', '2026-09-01')).toBe(false);
  });

  it('dayKey bir Date nesnesini yerel anahtara cevirir', () => {
    const d = new Date(2026, 7, 30); // yerel saatte 30 Agustos 2026
    expect(dayKey(d)).toBe('2026-08-30');
  });
});
