import glob from 'glob';

export const createJestConfig = (rootDir: string, isMonorepoRoot = false) => {
  const pkgs = glob
    .sync('./packages/*')
    .map(p => p.replace(/^\./, '<rootDir>'))
    .map(p => `${p}`);

  const config = {
    roots: isMonorepoRoot ? pkgs : ['.'],
    transform: {
      '.(ts|tsx)': require.resolve('ts-jest/dist')
    },
    transformIgnorePatterns: ['[/\\\\]node_modules[/\\\\].+\\.(js|jsx)$'],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    collectCoverageFrom: ['src/**/*.{ts,tsx}'],
    testMatch: ['<rootDir>/**/*.(spec|test).{ts,tsx}'],
    rootDir,
    watchPlugins: [
      require.resolve('jest-watch-typeahead/filename'),
      require.resolve('jest-watch-typeahead/testname')
    ],
    //setupFiles: [require.resolve('./setup-test')]
    globalSetup: require.resolve('./setup-test'),
    globalTeardown: require.resolve('./teardown-test')
  };

  return config;
};
