/**
 * FutureMe renk paleti (README bolum 12 - Gorsel tasarim sistemi).
 * Renk tek basina durum anlatmaz; ikon, metin ve sekille birlikte kullanilir.
 */

export const palette = {
  night: '#17143D', // Gece laciverti / temel
  brand: '#765BFF', // Elektrik moru / ana marka
  growth: '#43D6A4', // Buyume minti / tamamlandi
  sunrise: '#FFC857', // Gun dogumu / vurgu
  coral: '#FF708F', // Sicak mercan / kutlama
  cloud: '#F7F7FC', // Bulut / arka plan
  ink: '#24243A', // Murekkep / metin

  // Tureyen tonlar (yumusak katmanlar, kenarliklar, golgeler icin)
  nightSoft: '#241F55',
  nightDeep: '#100D2B',
  brandSoft: '#8E79FF',
  brandTint: '#EDE9FF',
  growthTint: '#DFF7EE',
  coralTint: '#FFE4EA',
  sunriseTint: '#FFF3D6',
  inkMuted: '#5B5B72',
  inkFaint: '#9A9AAD',
  line: '#E7E7F0',
  white: '#FFFFFF',
} as const;

export type ColorToken = keyof typeof palette;

/**
 * Anlamsal renk rolleri. Bilesenler dogrudan paleti degil, mumkun oldugunca
 * bu rolleri kullanmalidir.
 */
export const colors = {
  background: palette.cloud,
  surface: palette.white,
  surfaceMuted: '#EFEFF6',
  primary: palette.brand,
  primaryText: palette.white,
  onSurface: palette.ink,
  onSurfaceMuted: palette.inkMuted,
  onSurfaceFaint: palette.inkFaint,
  border: palette.line,
  success: palette.growth,
  accent: palette.sunrise,
  celebration: palette.coral,
  // Sinematik ust alan (gelecekteki benlik sahnesi) icin gradyan uclari.
  sceneTop: palette.night,
  sceneBottom: palette.nightSoft,
  onScene: palette.white,
  danger: '#E5484D',
} as const;

/**
 * Uc hedef kademesinin renkleri (README bolum 5 - Bugunun Uclusu).
 */
export const tierColors = {
  mainBridge: palette.brand, // Ana Kopru
  supportStep: palette.sunrise, // Destek Adimi
  minimumEvidence: palette.growth, // Minimum Kanit
} as const;
