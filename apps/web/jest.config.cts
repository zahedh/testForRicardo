const path = require('path');
const nextJest = require('next/jest.js');

const createJestConfig = nextJest({
  dir: path.join(__dirname, 'src'),
});

const config = {
  displayName: '@smarty3/web',
  preset: '../../jest.preset.js',
  transform: {
    '^(?!.*\\.(js|jsx|ts|tsx|css|json)$)': '@nx/react/plugins/jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../coverage/apps/web',
  testEnvironment: 'jsdom',
};

module.exports = createJestConfig(config);
