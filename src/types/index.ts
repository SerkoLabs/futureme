/**
 * FutureMe alan (domain) tipleri.
 * README bolum 16 (veri modeli) ve bolum 14 (yapay zeka yanit semasi) ile hizalidir.
 * Dikey dilim yerel durumda calisir; ayni tipler ilerde Supabase tablolarina eslenecektir.
 */

/** Hedef alanlari (README bolum 3). */
export type GoalArea =
  | 'exam' // Sinav ve ogrenme
  | 'career' // Kariyer ve uretim
  | 'movement' // Hareket ve iyi olus
  | 'home' // Ev ve duzen
  | 'parenting' // Ebeveynlik ve iliskiler
  | 'selfcare'; // Oz bakim ve yasam duzeni

/** Uc hedef kademesi (README bolum 5 - Bugunun Uclusu). */
export type GoalTier = 'mainBridge' | 'supportStep' | 'minimumEvidence';

/** Gunluk enerji/kosul isareti (README bolum 5 - Sabah). */
export type EnergyLevel = 'low' | 'medium' | 'high';

/** Puan turleri iki ayri ekonomi olarak tutulur (README bolum 6). */
export type PointKind = 'stage' | 'xp';

/**
 * Guvenlik etiketi. Kritik guvenlik kararlari yalnizca isteme degil,
 * deterministik koda da baglanir (README bolum 14 ve 17).
 */
export type SafetyLabel = 'ok' | 'sensitive' | 'crisis';

/** Zorluk seviyesi. */
export type Difficulty = 'gentle' | 'standard' | 'stretch';

/**
 * Bir gunluk hedef (README bolum 14 - Ornek yanit semasi).
 * Puan alanlari (stagePoints/xp) tetikleyici koda gore atanir; modelin serbest
 * metnine birakilmaz.
 */
export interface DailyGoal {
  id: string;
  tier: GoalTier;
  title: string;
  area: GoalArea;
  why: string; // neden bu hedef
  completionCriteria: string; // sure veya tamamlanma olcutu
  durationMinutes?: number;
  difficulty: Difficulty;
  minimumVersion: string; // zor bir gun icin en kucuk adim
  stagePoints: number; // ASAMA puani
  xp: number;
  suggestedTime?: string; // onerilen zaman (orn. "18:00")
  trigger?: string; // uygulama niyeti tetikleyicisi
  safetyLabel: SafetyLabel;
  edited: boolean; // kullanici tarafindan duzenlendi mi
  completed: boolean;
  completedAt?: string; // ISO tarih
}

/**
 * Hedef sablonu havuzu (README bolum 3 - gunluk kanit ornekleri).
 * Yapay zeka uretimi olmadan dikey dilimin calismasi icin klinik incelemeye
 * uygun, guvenli ornek hedefler saglar.
 */
export interface GoalTemplate {
  area: GoalArea;
  tier: GoalTier;
  title: string;
  why: string;
  completionCriteria: string;
  durationMinutes?: number;
  difficulty: Difficulty;
  minimumVersion: string;
  suggestedTime?: string;
  trigger?: string;
}

/** Gunluk plan durumu. */
export type DailyPlanStatus = 'draft' | 'committed' | 'closed';

/** Bir gunluk plan (README bolum 16 - daily_plans / daily_goals). */
export interface DailyPlan {
  date: string; // YYYY-MM-DD (yerel gun)
  energy: EnergyLevel | null;
  context?: string;
  goals: DailyGoal[]; // her zaman en fazla uc hedef
  status: DailyPlanStatus;
  sentToFutureSelf: boolean; // uc hedef gelecekteki benlige gonderildi mi
  reflection?: EveningReflection;
}

/** Aksam kapanisi (README bolum 5 - Aksam). */
export interface EveningReflection {
  didWhat: string; // Ne yaptim?
  learned: string; // Ne ogrendim?
  easierTomorrow: string; // Yarin neyi kolaylastirmaliyim?
  createdAt: string;
}

/**
 * Degistirilemez puan defteri hareketi (README bolum 16 - point_ledger).
 * Bakiye dogrudan degistirilmez; defter hareketlerinden hesaplanir.
 * `refId` cift puanlamayi onlemek icin idempotency anahtaridir (README bolum 22).
 */
export interface LedgerEntry {
  id: string;
  createdAt: string;
  kind: PointKind;
  amount: number; // pozitif kazanim; iptaller icin negatif olabilir
  reason: LedgerReason;
  refId: string; // olayi benzersiz kilan anahtar (orn. "2026-08-30:goal:<id>:complete")
  date: string; // YYYY-MM-DD - gunluk azami denetimi icin
}

export type LedgerReason =
  | 'sendThree' // uc hedefi gelecekteki benlige gonderme
  | 'completeMinimum'
  | 'completeSupport'
  | 'completeMain';

/** Iki seri gostergesi (README bolum 6 - Seri sistemi). */
export interface Streaks {
  bond: {
    count: number; // Bag Serisi - uygulamaya donup temas edilen gunler
    lastDate: string | null;
  };
  evidence: {
    count: number; // Kanit Serisi - en az bir gercek davranis tamamlanan gunler
    lastDate: string | null;
  };
}

/** Kanit Kasasi ogesi (README bolum 16 - evidence). */
export interface Evidence {
  id: string;
  goalId: string;
  date: string;
  createdAt: string;
  note?: string;
  durationMinutes?: number;
  tier: GoalTier;
  title: string;
}

/** BDT dusunce kaydi (README bolum 9 - Temel akis). */
export interface ThoughtRecord {
  id: string;
  createdAt: string;
  situation: string;
  automaticThought: string;
  distortion?: string;
  emotion: string;
  behavior: string;
  balancedThought: string;
  experiment: string;
  learning?: string;
}

/** Gelecekteki benlik sohbet mesaji (README bolum 8 ve 16 - conversations). */
export interface ChatMessage {
  id: string;
  role: 'future' | 'user';
  text: string;
  createdAt: string;
  safetyLabel: SafetyLabel;
}

/** Olasilik Odasi rotasi (README bolum 8 - Olasilik Odasi). */
export interface ProbableFuture {
  id: string;
  kind: 'direct' | 'adapted' | 'surprise';
  title: string;
  description: string;
  controllables: string[]; // kontrol edilebilir davranislar
  uncertainties: string[]; // kontrol edilemeyen belirsizlikler
}

/** Kisilik/motivasyon haritasi sonucu (README bolum 4.2 - olasilik olarak). */
export interface MotivationHint {
  patternId: string;
  label: string;
  confidence: number; // 0..1
  approach: string; // ise yarayabilecek yaklasim
  avoid: string; // kacinilacak yaklasim
  confirmedByUser: boolean | null;
}

/** Izinler, ayri ayri ve geri alinabilir (README bolum 4.1 ve 17). */
export interface Consents {
  photo: boolean;
  voice: boolean;
  ai: boolean;
  analytics: boolean;
  modelTraining: boolean; // varsayilan olarak kapali
}

/** Bildirim tercihleri (README bolum 13). */
export interface NotificationPrefs {
  morning: boolean;
  planned: boolean;
  evening: boolean;
  comeback: boolean;
  quietHoursStart: string; // "22:00"
  quietHoursEnd: string; // "08:00"
}

/** Erisilebilirlik tercihleri (README bolum 12). */
export interface AccessibilityPrefs {
  reduceMotion: boolean;
  muteSound: boolean;
  highContrast: boolean;
}

/** Yolculuk (README bolum 16 - journeys/seasons). */
export interface Journey {
  id: string;
  area: GoalArea;
  northStar: string; // Kuzey Yildizi
  whyItMatters: string;
  startDate: string;
  seasonLengthDays: number; // standart 180
  stageTarget: number; // standart 1000
  status: 'active' | 'paused' | 'completed';
  possibleFutures: ProbableFuture[];
  motivationHints: MotivationHint[];
}

/** Kullanici profili. */
export interface Profile {
  displayName: string;
  consents: Consents;
  notifications: NotificationPrefs;
  accessibility: AccessibilityPrefs;
}
