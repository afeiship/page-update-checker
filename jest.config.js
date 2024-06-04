// https://jestjs.io/docs/en/configuration
/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  verbose: true,
  // use jsdom env
  // testEnvironment: 'jsdom',
  preset: 'ts-jest',
  testRegex: [/\.spec.ts/],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  }
};
