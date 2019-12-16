import glob from 'glob';
import { PackageInfo } from './package-info';

const globTests = () =>
  glob
    .sync('./packages/*')
    .map(p => p.replace(/^\./, '<rootDir>'))
    .map(p => `${p}`);

export const createJestConfig = (packageInfo: PackageInfo) => {
  const config = {
    roots: packageInfo.isMonorepoRoot() ? globTests() : undefined,
    transform: {
      '.(ts|tsx)': require.resolve('ts-jest/dist')
    },
    //transformIgnorePatterns: ['[/\\\\]node_modules[/\\\\].+\\.(js|jsx)$'],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    collectCoverageFrom: ['src/**/*.{ts,tsx}'],
    testMatch: ['<rootDir>/**/*.(spec|test).{ts,tsx}'],
    rootDir: packageInfo.cwd,
    watchPlugins: [
      require.resolve('jest-watch-typeahead/filename'),
      require.resolve('jest-watch-typeahead/testname')
    ],
    globalSetup: require.resolve('./setup-test'),
    globalTeardown: require.resolve('./teardown-test')
  };

  return config;
};
