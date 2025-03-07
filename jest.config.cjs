//module.exports = {
 // testEnvironment: 'jsdom',
//  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
//  transform: {
//    '^.+\\.jsx?$': 'babel-jest',
//  },
//  moduleNameMapper: {
//    '^@/(.*)$': '<rootDir>/src/$1', // หากคุณใช้ alias
// },
//};
// jest.config.cjs
module.exports = {
  testEnvironment: 'jsdom',
  setupFiles: ['<rootDir>/setupTextEncoder.js'], // This runs before imports
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js', '@testing-library/jest-dom'],
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  transformIgnorePatterns: [
    '/node_modules/(?!.*\\.mjs$)'
  ],
  testEnvironmentOptions: {
    customExportConditions: ['node', 'node-addons'],
  }
};