/**
 * Yerel gun (YYYY-MM-DD) uzerinde calisan saf tarih yardimcilari.
 * Seri ve gunluk plan mantiginin deterministik test edilebilmesi icin
 * fonksiyonlar tarihleri dizi olarak alir.
 */

const DAY_MS = 24 * 60 * 60 * 1000;

/** "YYYY-MM-DD" dizisini UTC gun-baslangicina cevirir. */
function toUtc(dateKey: string): number {
  const [y, m, d] = dateKey.split('-').map((n) => parseInt(n, 10));
  return Date.UTC(y, m - 1, d);
}

/** Bir Date nesnesini yerel "YYYY-MM-DD" anahtarina cevirir. */
export function dayKey(date: Date): string {
  const y = date.getFullYear();
  const m = `${date.getMonth() + 1}`.padStart(2, '0');
  const d = `${date.getDate()}`.padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** b - a fark, tam gun sayisi olarak (a <= b ise pozitif). */
export function daysBetween(a: string, b: string): number {
  return Math.round((toUtc(b) - toUtc(a)) / DAY_MS);
}

/** dateKey'e gun sayisi ekler ve yeni anahtar dondurur. */
export function addDays(dateKey: string, days: number): string {
  const next = new Date(toUtc(dateKey) + days * DAY_MS);
  const y = next.getUTCFullYear();
  const m = `${next.getUTCMonth() + 1}`.padStart(2, '0');
  const d = `${next.getUTCDate()}`.padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** İki gunun ardisik (b, a'dan tam bir gun sonra) olup olmadigi. */
export function isNextDay(a: string, b: string): boolean {
  return daysBetween(a, b) === 1;
}
