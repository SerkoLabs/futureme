/**
 * Dikey dilim icin guvenli, klinik incelemeye uygun ornek icerik.
 *
 * Bu icerik yapay zeka uretiminin YERINE GECMEK icin degil, model henuz bagli
 * degilken calisan bir yedek deneyim saglamak icindir (README bolum 14 - guvenli
 * yedek deneyim). Lisansli kitap metinleri KOPYALANMAZ (README bolum 10).
 */

import type {
  GoalArea,
  GoalTemplate,
  GoalTier,
  MotivationHint,
  ProbableFuture,
} from '../types';

export interface GoalAreaMeta {
  area: GoalArea;
  label: string;
  emoji: string;
  possibleFuture: string; // ornek gelecek ihtimali
  northStarPrompt: string;
}

/** Hedef alanlari (README bolum 3 tablosu). */
export const GOAL_AREAS: GoalAreaMeta[] = [
  {
    area: 'exam',
    label: 'Sınav ve öğrenme',
    emoji: '📚',
    possibleFuture: 'İstediği bölüme hazırlanmış, çalışma düzeni kurmuş ben',
    northStarPrompt: 'Altı ay sonra hangi çalışma davranışlarını daha doğal yapan biri olmak istersin?',
  },
  {
    area: 'career',
    label: 'Kariyer ve üretim',
    emoji: '💼',
    possibleFuture: 'Portföyü ve görünürlüğü artmış profesyonel ben',
    northStarPrompt: 'Altı ay sonra ne üretiyor olmak seni sana yakınlaştırır?',
  },
  {
    area: 'movement',
    label: 'Hareket ve iyi oluş',
    emoji: '🌿',
    possibleFuture: 'Daha hareketli ve bedenine özen gösteren ben',
    northStarPrompt: 'Altı ay sonra bedeninle ilişkinde neyi daha kolay yapıyor olmak istersin?',
  },
  {
    area: 'home',
    label: 'Ev ve düzen',
    emoji: '🏡',
    possibleFuture: 'Yaşam alanını yönetebilen sakin ben',
    northStarPrompt: 'Altı ay sonra evinde hangi düzeni daha doğal sürdürüyor olmak istersin?',
  },
  {
    area: 'parenting',
    label: 'Ebeveynlik ve ilişkiler',
    emoji: '🤝',
    possibleFuture: 'Daha mevcut, sabırlı ve tutarlı ben',
    northStarPrompt: 'Altı ay sonra ilişkilerinde hangi anı daha sık yaşıyor olmak istersin?',
  },
  {
    area: 'selfcare',
    label: 'Öz bakım ve yaşam düzeni',
    emoji: '✨',
    possibleFuture: 'Kendine verdiği sözleri daha sık tutan ben',
    northStarPrompt: 'Altı ay sonra kendine verdiğin hangi sözü daha sık tutuyor olmak istersin?',
  },
];

export function goalAreaMeta(area: GoalArea): GoalAreaMeta {
  return GOAL_AREAS.find((a) => a.area === area) ?? GOAL_AREAS[0];
}

/** Her alan icin uc kademeden hedef sablonlari (README bolum 3 gunluk kanit ornekleri). */
export const GOAL_TEMPLATES: GoalTemplate[] = [
  // Sinav ve ogrenme
  {
    area: 'exam',
    tier: 'mainBridge',
    title: '25 dakika odaklanmış çalışma',
    why: 'Düzenli çalışma, hazır bene giden ana köprü',
    completionCriteria: '25 dakika kesintisiz odak (tek konu)',
    durationMinutes: 25,
    difficulty: 'standard',
    minimumVersion: 'Kitabı aç ve 5 dakika oku',
    suggestedTime: '19:00',
    trigger: 'Akşam yemeğinden sonra masaya otur',
  },
  {
    area: 'exam',
    tier: 'supportStep',
    title: '20 soru çöz',
    why: 'Uygulama, öğrenmeyi pekiştirir',
    completionCriteria: '20 soru ve kısa yanlış analizi',
    durationMinutes: 20,
    difficulty: 'standard',
    minimumVersion: '5 soru çöz',
  },
  {
    area: 'exam',
    tier: 'minimumEvidence',
    title: 'Yarınki konuyu seç',
    why: 'Küçük hazırlık, yarını kolaylaştırır',
    completionCriteria: 'Yarın çalışılacak tek konuyu yaz',
    difficulty: 'gentle',
    minimumVersion: 'Tek satır not',
  },
  // Kariyer ve uretim
  {
    area: 'career',
    tier: 'mainBridge',
    title: 'Bir içerik taslağı yaz',
    why: 'Görünürlük, profesyonel bene giden köprü',
    completionCriteria: 'Kısa bir taslak (giriş + 3 madde)',
    durationMinutes: 25,
    difficulty: 'standard',
    minimumVersion: 'Tek paragraf fikir notu',
    suggestedTime: '10:00',
    trigger: 'Sabah kahvesiyle birlikte',
  },
  {
    area: 'career',
    tier: 'supportStep',
    title: '20 dakika beceri çalışması',
    why: 'Küçük ama düzenli ustalık',
    completionCriteria: '20 dakika odaklı pratik',
    durationMinutes: 20,
    difficulty: 'standard',
    minimumVersion: '5 dakika izle/oku',
  },
  {
    area: 'career',
    tier: 'minimumEvidence',
    title: 'Bir bağlantıya ulaş',
    why: 'Ağ, fırsatları açar',
    completionCriteria: 'Bir kişiye kısa ve samimi mesaj',
    difficulty: 'gentle',
    minimumVersion: 'Bir kişinin adını not et',
  },
  // Hareket ve iyi olus (beden-notr dil; kilo/olcu hedefi yok - README bolum 3 ve 17)
  {
    area: 'movement',
    tier: 'mainBridge',
    title: '30 dakika tempolu yürüyüş',
    why: 'Hareket, bedenine özen gösteren bene yaklaştırır',
    completionCriteria: '30 dakika yürüyüş',
    durationMinutes: 30,
    difficulty: 'standard',
    minimumVersion: 'Ayakkabıyı giy ve 7 dakika yürü',
    suggestedTime: '18:00',
    trigger: 'Saat 18.00 olduğunda ayakkabıyı giy',
  },
  {
    area: 'movement',
    tier: 'supportStep',
    title: 'Gün içinde su molası',
    why: 'Küçük öz bakım davranışı',
    completionCriteria: 'Gün boyu 3 su molası',
    difficulty: 'gentle',
    minimumVersion: '1 bardak su iç',
  },
  {
    area: 'movement',
    tier: 'minimumEvidence',
    title: 'Uyku saatini işaretle',
    why: 'Düzenli uyku, enerjiyi toparlar',
    completionCriteria: 'Yatma saatini not et',
    difficulty: 'gentle',
    minimumVersion: 'Tek satır not',
  },
  // Ev ve duzen
  {
    area: 'home',
    tier: 'mainBridge',
    title: 'Tek bir yüzeyi topla',
    why: 'Yönetilebilir düzen, sakin bene giden köprü',
    completionCriteria: 'Bir masa/tezgâh yüzeyini boşalt',
    durationMinutes: 15,
    difficulty: 'standard',
    minimumVersion: 'Beş dakikalık yüzey toplama',
    suggestedTime: '20:00',
  },
  {
    area: 'home',
    tier: 'supportStep',
    title: 'Çamaşır başlat',
    why: 'Küçük sistem, birikimi önler',
    completionCriteria: 'Bir makine çamaşır başlat',
    difficulty: 'gentle',
    minimumVersion: 'Çamaşırları sepete topla',
  },
  {
    area: 'home',
    tier: 'minimumEvidence',
    title: 'Tek çekmece düzeni',
    why: 'Küçük kazanım, motivasyon doğurur',
    completionCriteria: 'Bir çekmeceyi düzenle',
    difficulty: 'gentle',
    minimumVersion: 'Bir eşyayı yerine koy',
  },
  // Ebeveynlik ve iliskiler
  {
    area: 'parenting',
    tier: 'mainBridge',
    title: '10 dakika bölünmemiş ilgi',
    why: 'Mevcut olmak, ilişkinin ana köprüsü',
    completionCriteria: '10 dakika telefonsuz birlikte zaman',
    durationMinutes: 10,
    difficulty: 'standard',
    minimumVersion: '2 dakika göz temasıyla dinle',
    suggestedTime: '19:30',
  },
  {
    area: 'parenting',
    tier: 'supportStep',
    title: 'Küçük bir onarım konuşması',
    why: 'Küçük onarım, bağı güçlendirir',
    completionCriteria: 'Bir yakınınla kısa, sıcak bir konuşma',
    difficulty: 'gentle',
    minimumVersion: 'Tek bir teşekkür mesajı',
  },
  {
    area: 'parenting',
    tier: 'minimumEvidence',
    title: 'Bir takdir cümlesi',
    why: 'Fark etmek, ilişkiyi besler',
    completionCriteria: 'Bir yakınına somut bir takdir söyle',
    difficulty: 'gentle',
    minimumVersion: 'İçinden bir takdir düşün ve not et',
  },
  // Oz bakim ve yasam duzeni
  {
    area: 'selfcare',
    tier: 'mainBridge',
    title: 'Sabah rutinini tamamla',
    why: 'Kendine verdiğin söz, günü kurar',
    completionCriteria: 'Seçtiğin 3 adımlık sabah rutini',
    durationMinutes: 15,
    difficulty: 'standard',
    minimumVersion: 'Rutinin tek adımını yap',
    suggestedTime: '08:00',
  },
  {
    area: 'selfcare',
    tier: 'supportStep',
    title: 'Ekran sınırını uygula',
    why: 'Sınır, enerjiyi korur',
    completionCriteria: 'Belirlediğin saatte ekranı bırak',
    difficulty: 'gentle',
    minimumVersion: '10 dakika ekransız mola',
  },
  {
    area: 'selfcare',
    tier: 'minimumEvidence',
    title: 'Kısa günlük',
    why: 'Küçük yansıma, farkındalık verir',
    completionCriteria: 'Üç cümlelik günlük',
    difficulty: 'gentle',
    minimumVersion: 'Tek cümle yaz',
  },
];

/** Gelecekteki benlik sesi (README bolum 8 - Konusma sozlesmesi). */
export const FUTURE_SELF = {
  /** Sabah karsilamasi (README bolum 5 ornek mesaji). */
  morning: (name?: string): string =>
    `${name ? name + ', g' : 'G'}ünaydın. Ben, bugün attığın küçük adımlar devam ederse ` +
    'yaklaşabileceğin benliğim. Bugün kusursuz olman gerekmiyor. Bana üç kanıt gönder: ' +
    'bir ana adım, bir destek adımı ve zor bir gün için en küçük adım.',

  /** Kademeye gore tamamlama yansimasi - kimlik diliyle, ovguyu davranisa baglar. */
  onComplete: (tier: GoalTier): string => {
    switch (tier) {
      case 'minimumEvidence':
        return 'Küçük bir kanıt gönderdin ve bu sıfırdan çok daha büyük. Zor günde bile ' +
          'geri dönebilen biri oluyorsun.';
      case 'supportStep':
        return 'Destek adımını tamamladın. Bu tür adımlar, ana köprüleri daha kolay hâle getirir.';
      case 'mainBridge':
        return 'Bugünün ana köprüsünü geçtin. Bu davranışı sürdürürsen, konuştuğumuz ihtimale ' +
          'biraz daha yaklaşıyorsun.';
    }
  },

  /** Gun sonu kapanisi (yargisiz). */
  evening: 'Bugün ne olduysa oldu. Birlikte kanıtı ve engeli görelim; yarını bir tık kolaylaştıralım.',

  /** Bos gunun ardindan donus (bag yeniden kurma). */
  comeback: 'Yol silinmedi. Bugün tek bir küçük basamakla yeniden başlayabilirsin.',
} as const;

/** Olasilik Odasi rotalari (README bolum 8). Sablon; alan adiyla kisisellestirilir. */
export function possibleFuturesFor(area: GoalArea): ProbableFuture[] {
  const meta = goalAreaMeta(area);
  return [
    {
      id: `${area}:direct`,
      kind: 'direct',
      title: 'Doğrudan rota',
      description: `${meta.possibleFuture}. Koşullar plandaki gibi giderse bu yola en yakın olduğun rota.`,
      controllables: ['Günlük üç küçük adım', 'Haftalık yeniden ayar', 'Engel çıkınca küçültme'],
      uncertainties: ['Dış koşulların değişmesi', 'Zamanlamanın herkes için aynı olmaması'],
    },
    {
      id: `${area}:adapted`,
      kind: 'adapted',
      title: 'Uyarlanmış rota',
      description: 'Zaman, enerji veya kaynak daha kısıtlıysa da aynı yöne giden daha yumuşak rota.',
      controllables: ['Minimum sürümleri seçme', 'Mola modunu kullanma', 'Küçük deneyler'],
      uncertainties: ['Yoğun dönemler', 'Bakım ve sorumluluk yükü'],
    },
    {
      id: `${area}:surprise`,
      kind: 'surprise',
      title: 'Sürpriz rota',
      description: 'Geliştirdiğin becerinin beklenmedik ama değerlerinle uyumlu bir fırsata açılması.',
      controllables: ['Meraklı kalma', 'Küçük görünürlük adımları'],
      uncertainties: ['Fırsatın ne zaman geleceği', 'Kontrol dışı tesadüfler'],
    },
  ];
}

/** Motivasyon ipuclari havuzu (README bolum 4.2 - olasilik olarak sunulur). */
export const MOTIVATION_HINTS: MotivationHint[] = [
  {
    patternId: 'achievement',
    label: 'Başarı ve görünür ilerleme',
    confidence: 0.62,
    approach: 'Net kilometre taşları, ustalık rozeti, somut kanıt',
    avoid: 'Sadece sıralama ve dış onay',
    confirmedByUser: null,
  },
  {
    patternId: 'security',
    label: 'Güvenlik ve belirsizliği azaltma',
    confidence: 0.55,
    approach: 'Plan B, küçük deney, hazırlık cümlesi',
    avoid: 'Kesin gelecek iddiası',
    confirmedByUser: null,
  },
  {
    patternId: 'depth',
    label: 'Derinlik ve anlam',
    confidence: 0.48,
    approach: 'Günlük, duygu dili, kişisel semboller',
    avoid: 'Yapay pozitiflik',
    confirmedByUser: null,
  },
];

/** BDT bilissel carpitma etiketleri (README bolum 9 - ozgun, kitaptan kopya degil). */
export const COGNITIVE_DISTORTIONS: string[] = [
  'Ya hep ya hiç düşüncesi',
  'Felaketleştirme',
  'Zihin okuma',
  'Etiketleme',
  'Meli/malıcılık',
  'Olumluyu geçersiz kılma',
  'Duygusal çıkarım',
];

/** Dusunce Laboratuvari baslangic ornegi (README bolum 9 tablosu). */
export const THOUGHT_LAB_EXAMPLE = {
  situation: 'Akşam oldu, bir saatlik yürüyüş hâlâ yapılmadı',
  automaticThought: 'Bir saat yapamayacaksam hiç anlamı yok',
  distortion: 'Ya hep ya hiç düşüncesi',
  emotion: 'Suçluluk, kaçınma',
  behavior: 'Telefona yönelme',
  balancedThought: 'Bugün süreyi değil, geri dönme davranışını çalışabilirim',
  experiment: 'Ayakkabıyı giy ve 7 dakika yürü',
  learning: 'Başlamak düşündüğümden daha kolaydı; küçük adım günü kurtardı',
} as const;
