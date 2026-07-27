'use strict'

module.exports = {
  moduleNameMapper: {
    '\\.(css|scss)$': '<rootDir>/packages/react/test/styleMock.js',
  },
  preset: 'ts-jest',
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { tsconfig: 'packages/react/tsconfig.json' }],
  },
  setupFilesAfterEnv: [
    '@testing-library/jest-dom',
    '<rootDir>/packages/react/test/dialogPolyfill.js',
    '<rootDir>/packages/react/test/axeMatchers.js',
  ],
  testEnvironment: 'jsdom',
  testPathIgnorePatterns: ['dist/', '/vendor/'],
  coverageThreshold: {
    global: {
      statements: 91,
      branches: 73,
      functions: 90,
      lines: 92,
    },
  },
}
