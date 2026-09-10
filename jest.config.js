/**
 * Pure-TypeScript domain tests (puan defteri, yolculuk matematigi, seri, guvenlik).
 * React Native/Expo bilesenlerinden bagimsiz calisir; kritik guvenlik ve puan
 * kurallarini deterministik olarak dogrular (bkz. README bolum 22 - Kabul kriterleri).
 */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src/domain'],
  testMatch: ['**/__tests__/**/*.test.ts'],
  transform: {
    '^.+\\.ts$': ['ts-jest', { tsconfig: 'tsconfig.jest.json' }],
  },
};
