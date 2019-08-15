// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  preset: '@shelf/jest-mongodb',
  verbose: true,
  // A set of global variables that need to be available in all test environments
  globals: {
    NODE_ENV: 'test'
  },

  // An array of directory names to be searched recursively up from the requiring module's location
  moduleDirectories: ['node_modules'],

  // An array of file extensions your modules use
  moduleFileExtensions: [
    'js',
    'jsx',
    'json',
    'ts',
    'tsx',
    'css',
    'less',
    'scss',
    'graphql',
    'md',
    'markdown'
  ],
  watchPathIgnorePatterns: ['<rootDir>/node_modules'],
  testPathIgnorePatterns: ['/node_modules/', '/db/']
}
