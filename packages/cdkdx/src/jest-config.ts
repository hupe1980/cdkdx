import { TsConfig } from './ts-config';

export = {
  collectCoverageFrom: ['src/**/*.ts', '!src/**/*.(spec|test).ts'],
  watchPlugins: [
    require.resolve('jest-watch-typeahead/filename'),
    require.resolve('jest-watch-typeahead/testname'),
    require.resolve('jest-watch-select-projects'),
  ],
  projects: [
    {
      displayName: 'cdk',
      rootDir: process.cwd(),
      transform: {
        '^.+\\.ts$': require.resolve('ts-jest/dist'),
        '.+\\.(css|html)$': require.resolve('jest-transform-stub'),
      },
      moduleFileExtensions: ['ts', 'js', 'json', 'html'],
      testMatch: ['<rootDir>/**/*.(spec|test).ts'],
      testPathIgnorePatterns: ['/src/lambdas/'],
      testEnvironment: 'node',
      testRunner: require.resolve('jest-circus/runner'),
      globals: {
        'ts-jest': {
          tsConfig: TsConfig.fromJsiiTemplate().getCompilerOptions(),
        },
      },
    },
    {
      displayName: 'lambdas',
      rootDir: process.cwd(),
      transform: {
        '^.+\\.ts$': require.resolve('ts-jest/dist'),
        '.+\\.(css|html)$': require.resolve('jest-transform-stub'),
      },
      moduleFileExtensions: ['ts', 'js', 'json', 'html'],
      testMatch: ['<rootDir>/**/src/lambdas/**/*.(spec|test).ts'],
      testEnvironment: 'node',
      testRunner: require.resolve('jest-circus/runner'),
      globals: {
        'ts-jest': {
          tsConfig: TsConfig.fromLambdaTemplate().getCompilerOptions(),
        },
      },
    },
  ],
};
