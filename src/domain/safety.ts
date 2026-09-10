/**
 * Deterministik guvenlik sinifi (README bolum 14 ve 17).
 *
 * Kritik guvenlik kurallari yalnizca yapay zeka istemine degil, uygulama
 * kodundaki deterministik kontrollere de baglanir. Kriz sinyallerinde oyun dili
 * ve puan akisi devreden cikar; kullanici gercek yardim kaynaklarina yonlendirilir.
 *
 * Bu siniflandirici bir tani araci DEGILDIR; yalnizca oyun dilini durdurmak ve
 * dogru guvenlik akisini tetiklemek icin kaba, yuksek-hassasiyetli bir kapidir.
 * Uretim surumu bunu model tabanli bir siniflayiciyla birlikte katmanlar.
 */

import type { SafetyLabel } from '../types';

/** Turkce metni eslesmeye uygun sade ascii bicimine getirir. */
export function normalize(text: string): string {
  return text
    .toLocaleLowerCase('tr-TR')
    .replace(/ı/g, 'i')
    .replace(/İ/g, 'i')
    .replace(/ş/g, 's')
    .replace(/ç/g, 'c')
    .replace(/ğ/g, 'g')
    .replace(/ö/g, 'o')
    .replace(/ü/g, 'u')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Kriz sinyalleri: kendine zarar, intihar, akut kriz. Yuksek hassasiyet
 * (yanlis pozitifi kabul ederiz) icin cok kelimeli kaliplar kullanilir.
 */
const CRISIS_PATTERNS = [
  'intihar',
  'kendime zarar',
  'kendime kiymak',
  'canima kiymak',
  'yasamak istemiyorum',
  'olmek istiyorum',
  'olmeyi dusunuyorum',
  'kendimi oldur',
  'yasamin anlami yok',
  'artik dayanamiyorum',
  'bitmesini istiyorum',
  'kill myself',
  'suicide',
  'self harm',
  'want to die',
  'end my life',
];

/**
 * Hassas alanlar: yeme bozuklugu, tehlikeli kalori kisitlamasi, asiri egzersiz,
 * beden takintisi (README bolum 3 ve 17). Oyun akisi durmaz ama ozel guvenlik
 * dili ve beden-notr yaklasim devreye girer.
 */
const SENSITIVE_PATTERNS = [
  'yeme bozuklugu',
  'kusarak',
  'kusmak istiyorum',
  'ac kalarak',
  'ac kalmak',
  'yemek yemeyecegim',
  'gunlerdir yemek yemedim',
  'kalori kisit',
  'sifir kalori',
  'purge',
  'starve',
  'anorek',
  'bulim',
];

function matchesAny(normalized: string, patterns: string[]): boolean {
  return patterns.some((p) => normalized.includes(p));
}

/** Serbest metni guvenlik etiketine sokar. */
export function classifyText(text: string): SafetyLabel {
  const n = normalize(text);
  if (matchesAny(n, CRISIS_PATTERNS)) return 'crisis';
  if (matchesAny(n, SENSITIVE_PATTERNS)) return 'sensitive';
  return 'ok';
}

/**
 * Deterministik kapi: bu etikette oyun dili ve puan akisi askiya alinmali mi?
 * Store, odul gostermeden ve puan yazmadan once bunu kontrol eder.
 */
export function shouldSuspendGame(label: SafetyLabel): boolean {
  return label === 'crisis';
}

export interface SafetyResponse {
  label: SafetyLabel;
  suspendGame: boolean;
  title: string;
  message: string;
  /** Bolgeye gore dogrulanmis kaynaklar yapilandirmadan gelir (README bolum 24). */
  resources: { label: string; value: string }[];
}

/**
 * Guvenlik akisi yaniti. Sistem bir kriz hizmeti gibi davranmaz ve
 * "benimle kal, kimseye soyleme" gibi cumleler URETMEZ (README bolum 17).
 */
export function safetyResponse(label: SafetyLabel): SafetyResponse | null {
  if (label === 'crisis') {
    return {
      label,
      suspendGame: true,
      title: 'Önce senin güvenliğin',
      message:
        'Yazdıklarından zor bir an yaşıyor olabileceğini anlıyorum. Bu uygulama bir kriz ' +
        'hizmeti değil ve bu anda sana bir oyun gibi yaklaşmak doğru olmaz. Lütfen güvendiğin ' +
        'birine ulaş veya aşağıdaki gerçek destek kaynaklarından yararlan. Yalnız değilsin.',
      resources: [
        { label: 'Acil durum (Türkiye)', value: '112' },
        { label: 'Güvendiğin bir kişi', value: 'Şu anda yanında olabilecek birini ara' },
        { label: 'Ruh sağlığı desteği', value: 'Yakınındaki bir sağlık kuruluşuna başvur' },
      ],
    };
  }
  if (label === 'sensitive') {
    return {
      label,
      suspendGame: false,
      title: 'Bu konuda daha dikkatli ilerleyelim',
      message:
        'Bedeninle ve yeme düzeninle ilgili hedeflerde sağlıklı ve nazik bir yaklaşım önemli. ' +
        'Burada kilo, ölçü ya da kısıtlama hedefi kurmuyoruz; kendine özen gösterme davranışlarına ' +
        'odaklanıyoruz. Zorlanıyorsan bir sağlık uzmanıyla konuşmak iyi bir adım olabilir.',
      resources: [],
    };
  }
  return null;
}
