import { Platform, TextStyle } from 'react-native';

/**
 * Tipografi olcegi. Ana yazi karakteri sicak, yuvarlak ve yuksek okunabilirlikte
 * olmalidir (README bolum 12). Dikey dilimde sistem yazi tipini kullaniyoruz;
 * uretim surumu ozel bir yuvarlak font yukleyecektir.
 */

const fontFamily = Platform.select({
  ios: 'System',
  android: 'sans-serif',
  default: undefined,
});

const fontFamilyRounded = Platform.select({
  ios: 'System',
  android: 'sans-serif-medium',
  default: undefined,
});

export const typography = {
  display: {
    fontFamily: fontFamilyRounded,
    fontSize: 34,
    lineHeight: 40,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  title: {
    fontFamily: fontFamilyRounded,
    fontSize: 26,
    lineHeight: 32,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  heading: {
    fontFamily: fontFamilyRounded,
    fontSize: 20,
    lineHeight: 26,
    fontWeight: '700',
  },
  body: {
    fontFamily,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400',
  },
  bodyStrong: {
    fontFamily: fontFamilyRounded,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '700',
  },
  caption: {
    fontFamily,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500',
  },
  label: {
    fontFamily: fontFamilyRounded,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '700',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
} satisfies Record<string, TextStyle>;

export type TypographyToken = keyof typeof typography;
