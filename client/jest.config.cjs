module.exports = {
  rootDir: '../',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/client/jest.setup.js'],
  transform: {
    '^.+\.[tj]sx?$': ['babel-jest', {
      configFile: 'E:/Projet/atypikhouse-ssr/babel.config.js'
    }],
  },
  testMatch: ['<rootDir>/client/src/__tests__/**/*.test.jsx'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/client/src/$1',
    'import.meta.env.VITE_BASE_URL': '<rootDir>/client/src/config.js',
  },
};