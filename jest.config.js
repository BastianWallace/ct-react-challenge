const {defaults} = require('jest-config')

module.exports = {
  testEnvironment: 'jsdom',
  moduleFileExtensions: [...defaults.moduleFileExtensions, 'ts', 'tsx'],
  transform: {
    "^.+\\.(js|jsx)$": "babel-jest"
  },
  transformIgnorePatterns: [
    '<rootDir>/bower_components/',
    '<rootDir>/node_modules/'
  ],
  testPathIgnorePatterns: [`node_modules`, `.cache`],
  setupFiles: [`<rootDir>/loadershim.js`, 'jest-canvas-mock'],
  verbose: true,
}