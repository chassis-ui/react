'use strict'

module.exports = {
  moduleNameMapper: {
    '\\.(css|scss)$': '<rootDir>/packages/react/test/styleMock.js',
  },
  preset: 'ts-jest',
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { tsconfig: 'packages/react/tsconfig.json' }],
  },
  setupFilesAfterEnv: ['@testing-library/jest-dom', '<rootDir>/packages/react/test/dialogPolyfill.js'],
  testEnvironment: 'jsdom',
  testPathIgnorePatterns: ['dist/', '/vendor/'],
}
